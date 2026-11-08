// Função de servidor: envia por e-mail cada notificação criada pelo sistema.
// É chamada pelo banco (veja supabase/emails.sql) e só aceita o ID de uma
// notificação recente que ainda não foi enviada. Ela mesma busca todo o resto
// no banco, então ninguém consegue usá-la para mandar mensagens à vontade.
import { createClient } from 'npm:@supabase/supabase-js@2';

const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://ceciliaccarvalho.github.io/entre-setores/';
const FROM = Deno.env.get('EMAIL_FROM') ?? 'Entre setores <onboarding@resend.dev>';
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
// Modo apresentação: se preenchido, TODOS os e-mails vão para este endereço
// (com o destinatário original indicado no assunto).
const DEMO_TO = (Deno.env.get('DEMO_REDIRECT_EMAIL') ?? '').trim();

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const STATUS: Record<string, string> = {
  open: 'Aberto', in_progress: 'Em atendimento', waiting_info: 'Aguardando informações',
  third_party: 'Envio a terceiros', resolving: 'Em resolução', resolved: 'Resolvido',
  waiting_confirmation: 'Aguardando confirmação', closed: 'Finalizado',
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);
  let id: unknown;
  try { ({ id } = await req.json()); } catch { return json({ error: 'Pedido inválido.' }, 400); }
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'Pedido inválido.' }, 400);
  if (!RESEND_KEY) return json({ error: 'RESEND_API_KEY não configurada.' }, 500);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // "Reserva" a notificação: só quem conseguir marcar como enviada prossegue.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: n } = await db.from('app_notifications')
    .update({ emailed_at: new Date().toISOString() })
    .eq('id', id).is('emailed_at', null).gte('created_at', since)
    .select('id,user_id,ticket_id,title,body').maybeSingle();
  if (!n) return json({ skipped: true });
  const undo = () => db.from('app_notifications').update({ emailed_at: null }).eq('id', id as string);

  const [{ data: account }, { data: profile }, { data: ticket }] = await Promise.all([
    db.auth.admin.getUserById(n.user_id),
    db.from('app_profiles').select('name').eq('id', n.user_id).maybeSingle(),
    db.from('app_tickets').select('data').eq('id', n.ticket_id).maybeSingle(),
  ]);
  const recipient = account?.user?.email;
  if (!recipient) { await undo(); return json({ error: 'Usuário sem e-mail.' }, 404); }

  const t = (ticket?.data ?? {}) as Record<string, any>;
  const last = Array.isArray(t.events) ? t.events[t.events.length - 1] : null;
  const link = `${SITE_URL}#/ticket/${encodeURIComponent(n.ticket_id)}`;
  const first = (profile?.name ?? '').split(' ')[0] || 'Olá';

  const detail = last?.text
    ? `<p style="margin:16px 0 0;padding:14px 16px;background:#f5f5f7;border-radius:10px;color:#3a3a40;font-size:14px;line-height:1.6;white-space:pre-wrap"><strong>${esc(last.actorName)}:</strong> ${esc(last.text)}</p>`
    : '';
  const banner = DEMO_TO
    ? `<p style="margin:0 0 16px;padding:10px 14px;background:#fff7e0;border-radius:8px;color:#7a5b00;font-size:12px">Modo apresentação: esta mensagem seria enviada para <strong>${esc(recipient)}</strong>.</p>`
    : '';

  const html = `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#f5f5f7;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;border:1px solid #e8e8ed">
    ${banner}
    <p style="margin:0 0 4px;font-size:13px;color:#8a8a92">Entre setores · ${esc(t.code ?? '')}</p>
    <h1 style="margin:0 0 6px;font-size:20px;color:#1d1d1f">${esc(n.title)}</h1>
    <p style="margin:0;font-size:14px;color:#55555e">${first}, houve uma atualização em <strong>${esc(t.title ?? n.body)}</strong>.</p>
    <p style="margin:12px 0 0;font-size:13px;color:#8a8a92">Situação atual: ${esc(STATUS[t.status] ?? t.status ?? '')}</p>
    ${detail}
    <p style="margin:24px 0 0"><a href="${esc(link)}" style="display:inline-block;background:#0067df;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-size:14px;font-weight:600">Abrir chamado</a></p>
  </div>
  <p style="text-align:center;font-size:11px;color:#a0a0a8;margin:14px 0 0">Mensagem automática do sistema Entre setores.</p>
</div>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [DEMO_TO || recipient],
      subject: `${DEMO_TO ? `[Para: ${recipient}] ` : ''}${n.title} — ${t.code ?? ''}`.trim(),
      html,
    }),
  });
  if (!response.ok) {
    await undo();
    return json({ error: 'O serviço de e-mail recusou o envio.', detail: await response.text() }, 502);
  }
  return json({ sent: true });
});
