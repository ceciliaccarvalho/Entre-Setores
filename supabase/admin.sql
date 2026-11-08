-- Entre setores | Atualização 1: perfil de administrador + controle de e-mails.
-- Rode UMA vez no SQL Editor do Supabase, DEPOIS de ter rodado o schema.sql.
-- Pode rodar de novo sem problemas (é seguro repetir).
begin;

-- 1) Permite o perfil "admin". O administrador tem somente esse perfil.
alter table public.app_profiles drop constraint if exists app_roles_valid;
alter table public.app_profiles add constraint app_roles_valid check (
  cardinality(roles) between 1 and 2
  and roles <@ array['requester','agent','director','admin']::text[]
  and array_position(roles,null) is null
  and (cardinality(roles)=1 or roles[1]<>roles[2])
  and (not ('admin'=any(roles)) or cardinality(roles)=1)
);

-- 2) Marca quando o e-mail de cada notificação foi enviado (evita envio duplicado).
alter table public.app_notifications add column if not exists emailed_at timestamptz;

commit;
notify pgrst,'reload schema';
