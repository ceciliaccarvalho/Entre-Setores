// Função de servidor: o administrador cria e gerencia usuários.
// Roda no Supabase (nunca no navegador), por isso pode usar a chave de serviço
// com segurança. Antes de qualquer ação, confirma que quem chamou é um
// administrador ativo.
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Perfis de acesso oferecidos na tela -> papéis gravados no banco.
const PROFILES: Record<string, string[]> = {
  requester: ['requester'],
  agent: ['requester', 'agent'],
  director: ['requester', 'director'],
  admin: ['admin'],
};
const profileOf = (roles: string[]) =>
  roles.includes('admin') ? 'admin' : roles.includes('director') ? 'director' : roles.includes('agent') ? 'agent' : 'requester';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return reply({ error: 'Método não permitido.' }, 405);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1) Quem está chamando?
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: auth, error: authError } = await db.auth.getUser(token);
  if (authError || !auth?.user) return reply({ error: 'Entre novamente para continuar.' }, 401);
  const { data: me } = await db.from('app_profiles').select('id,roles,active').eq('id', auth.user.id).maybeSingle();
  if (!me?.active || !me.roles.includes('admin')) return reply({ error: 'Somente administradores podem fazer isso.' }, 403);

  let body: Record<string, any>;
  try { body = await req.json(); } catch { return reply({ error: 'Pedido inválido.' }, 400); }

  const { data: sectors } = await db.from('app_sectors').select('id,receives');
  const sectorOk = (id: string) => sectors?.some((s) => s.id === id);
  const receives = (id: string) => sectors?.find((s) => s.id === id)?.receives;
  const cleanName = (v: unknown) => String(v ?? '').trim();

  function checkProfile(name: string, sectorId: string, profile: string): string | null {
    if (name.length < 2 || name.length > 120) return 'Informe o nome completo (2 a 120 caracteres).';
    if (!sectorOk(sectorId)) return 'Selecione um setor válido.';
    if (!PROFILES[profile]) return 'Selecione um perfil de acesso válido.';
    if (profile === 'agent' && !receives(sectorId)) return 'Este setor não recebe chamados. Escolha outro setor para um atendente.';
    return null;
  }
  const checkPassword = (p: unknown) =>
    typeof p !== 'string' || p.length < 8 || p.length > 72 ? 'A senha deve ter entre 8 e 72 caracteres.' : null;

  switch (body.action) {
    case 'list': {
      const { data: profiles, error } = await db.from('app_profiles').select('id,name,sector_id,roles,active').order('name');
      if (error) return reply({ error: 'Não foi possível carregar os usuários.' }, 500);
      const emails = new Map<string, string>();
      for (let page = 1; page < 50; page++) {
        const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
        const users = data?.users ?? [];
        users.forEach((u) => emails.set(u.id, u.email ?? ''));
        if (users.length < 200) break;
      }
      return reply({
        users: (profiles ?? []).map((p) => ({
          id: p.id, name: p.name, email: emails.get(p.id) ?? '', sectorId: p.sector_id,
          roles: p.roles, profile: profileOf(p.roles), active: p.active,
        })),
      });
    }

    case 'create': {
      const name = cleanName(body.name);
      const email = String(body.email ?? '').trim().toLowerCase();
      const problem = checkProfile(name, body.sectorId, body.profile) || checkPassword(body.password) ||
        (EMAIL.test(email) && email.length <= 254 ? null : 'Informe um e-mail válido.');
      if (problem) return reply({ error: problem }, 400);

      const { data: created, error } = await db.auth.admin.createUser({
        email, password: body.password, email_confirm: true, user_metadata: { name },
      });
      if (error || !created?.user) {
        const exists = /already|registered|exists/i.test(error?.message ?? '');
        return reply({ error: exists ? 'Já existe um usuário com este e-mail.' : 'Não foi possível criar a conta. Confira os dados.' }, exists ? 409 : 400);
      }
      const { error: profileError } = await db.from('app_profiles').insert({
        id: created.user.id, name, sector_id: body.sectorId, roles: PROFILES[body.profile], active: true,
      });
      if (profileError) {
        await db.auth.admin.deleteUser(created.user.id); // desfaz para não deixar conta sem perfil
        return reply({ error: 'Não foi possível salvar o perfil do usuário.' }, 400);
      }
      return reply({ ok: true, id: created.user.id });
    }

    case 'update': {
      const name = cleanName(body.name);
      const problem = checkProfile(name, body.sectorId, body.profile);
      if (problem) return reply({ error: problem }, 400);
      if (typeof body.active !== 'boolean') return reply({ error: 'Pedido inválido.' }, 400);
      if (body.id === me.id && (!body.active || body.profile !== 'admin')) {
        return reply({ error: 'Você não pode desativar nem rebaixar a sua própria conta de administrador.' }, 400);
      }
      const { data: updated, error } = await db.from('app_profiles')
        .update({ name, sector_id: body.sectorId, roles: PROFILES[body.profile], active: body.active })
        .eq('id', body.id).select('id');
      if (error) return reply({ error: 'Não foi possível salvar as alterações.' }, 400);
      if (!updated?.length) return reply({ error: 'Usuário não encontrado.' }, 404);
      return reply({ ok: true });
    }

    case 'set_password': {
      const problem = checkPassword(body.password);
      if (problem) return reply({ error: problem }, 400);
      const { error } = await db.auth.admin.updateUserById(String(body.id), { password: body.password });
      if (error) return reply({ error: 'Não foi possível redefinir a senha.' }, 400);
      return reply({ ok: true });
    }

    default:
      return reply({ error: 'Ação desconhecida.' }, 400);
  }
});
