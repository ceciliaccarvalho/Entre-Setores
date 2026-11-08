-- Entre setores | Atualização 1: dispara um e-mail a cada nova notificação.
-- Rode UMA vez no SQL Editor do Supabase, DEPOIS do admin.sql
-- e DEPOIS de publicar a função "send-notification-email".
--
-- Como funciona: sempre que o sistema cria uma notificação (chamado aberto,
-- assumido, mensagem, solução, aprovação...), o banco chama a função de
-- e-mail, que envia a mensagem para a pessoa que precisa ser avisada.
-- Se o envio falhar, o chamado NÃO é afetado.
create extension if not exists pg_net;

create or replace function app_private.email_new_notification()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
  begin
    perform net.http_post(
      url := 'https://nliorlsyrswyukrrmyxk.supabase.co/functions/v1/send-notification-email',
      headers := jsonb_build_object('Content-Type','application/json'),
      body := jsonb_build_object('id', new.id)
    );
  exception when others then
    null; -- nunca bloqueia a criação do chamado por causa do e-mail
  end;
  return new;
end $$;

revoke all on function app_private.email_new_notification() from public,anon,authenticated;

drop trigger if exists app_notification_email on public.app_notifications;
create trigger app_notification_email
  after insert on public.app_notifications
  for each row execute function app_private.email_new_notification();
