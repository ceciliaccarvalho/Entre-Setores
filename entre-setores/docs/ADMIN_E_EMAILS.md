# Administrador, cadastro de usuários e e-mails automáticos

Este guia liga duas funções novas ao seu projeto Supabase:

1. **Perfil de administrador**, com uma tela dentro do sistema para cadastrar funcionários (e-mail, senha, setor e o que cada um pode fazer).
2. **E-mails automáticos** a cada atualização de um chamado, para quem abriu e para quem atende.

Faça na ordem. Se algum passo der erro, copie a mensagem e peça ajuda.

> O arquivo `supabase/schema.sql` precisa ter sido executado antes (passo 2 do guia `PRODUCAO.md`). Se ainda não rodou, rode primeiro.

---

## Parte A: preparar o banco e o primeiro administrador

**A1. Liberar o perfil de administrador**
No Supabase: **SQL Editor → New query**. Abra o arquivo `supabase/admin.sql` no VS Code, copie tudo, cole no Supabase e clique em **Run**. Deve aparecer "Success".

**A2. Bloquear cadastro público**
**Authentication → Sign In / Providers** e desligue a opção que permite novas pessoas se cadastrarem sozinhas (nome pode variar: "Allow new users to sign up"). Só o administrador cria contas.

**A3. Criar a sua conta de administrador**
1. **Authentication → Users → Add user → Create new user**.
2. Digite o seu e-mail e uma senha. Marque **Auto Confirm User**. Clique em **Create user**.
3. Volte ao **SQL Editor → New query**, cole o comando abaixo trocando `SEU-EMAIL` (o mesmo que você acabou de cadastrar) e `Seu Nome`, e clique em **Run**:

```sql
insert into public.app_profiles(id,name,sector_id,roles)
select id,'Seu Nome','administrativo',array['admin']::text[]
from auth.users where email='SEU-EMAIL';
```

Deve aparecer "Success. 1 row affected". Se aparecer 0 linhas, o e-mail está diferente do cadastrado.

---

## Parte B: publicar a função que cria usuários

**B1.** No Supabase: **Edge Functions → Deploy a new function → Via Editor**.

**B2.** Nome da função (exatamente assim): `admin-users`

**B3.** Apague o código de exemplo, abra no VS Code o arquivo `supabase/functions/admin-users/index.ts`, copie tudo e cole no editor do Supabase. Clique em **Deploy function**.

**B4.** Desligue a verificação automática de JWT: abra a função publicada, procure **Details / Settings** e desmarque **Verify JWT** (algo como "Verify JWT with legacy secret"). A função confere sozinha se quem chama é administrador, então isso é seguro.

---

## Parte C: e-mails automáticos

**C1. Conta no Resend (envia os e-mails)**
1. Crie uma conta gratuita em **resend.com** usando o e-mail que você vai usar na apresentação.
2. **API Keys → Create API Key** (permissão de envio). Copie a chave (começa com `re_`). Ela só aparece uma vez.

> **Importante:** sem um domínio próprio verificado, o Resend só entrega e-mails para o endereço com o qual você criou a conta. Por isso usamos o **modo apresentação**: todos os e-mails chegam na sua caixa de entrada, cada um indicando no assunto para quem seria enviado (`[Para: maria@...]`). Se um dia você tiver um domínio, é só remover esse modo.

**C2. Guardar as chaves no Supabase**
**Edge Functions → Secrets** (ou "Manage secrets"). Adicione:

| Nome | Valor |
| --- | --- |
| `RESEND_API_KEY` | a chave que você copiou (`re_...`) |
| `DEMO_REDIRECT_EMAIL` | o seu e-mail do Resend (o mesmo da conta) |

Não coloque essas chaves em nenhum arquivo do projeto nem no GitHub.

**C3. Publicar a função de e-mail**
Mesmo caminho da Parte B: **Deploy a new function → Via Editor**, nome `send-notification-email`, código do arquivo `supabase/functions/send-notification-email/index.ts`. Depois de publicar, **desmarque Verify JWT**.

**C4. Ligar o disparo automático**
**SQL Editor → New query**, cole o conteúdo de `supabase/emails.sql` e clique em **Run**. A partir daqui, cada notificação do sistema vira um e-mail.

---

## Parte D: publicar o site atualizado

O arquivo `config.js` já vem com a URL e a chave pública do seu Supabase. Envie os arquivos novos e alterados para o GitHub (veja a lista no final) e espere o Actions publicar. Depois confira o site em `https://ceciliaccarvalho.github.io/entre-setores/`.

Em **Authentication → URL Configuration** do Supabase, coloque essa mesma URL em **Site URL**.

---

## Parte E: testar antes da apresentação

1. Entre no site com a sua conta de administrador. Você deve cair na tela **Usuários e acessos**.
2. **Novo usuário**: cadastre um *Funcionário* (setor Comercial, por exemplo) e um *Atendente do setor* (TI). Use o botão **Gerar** para criar a senha e anote.
3. Abra uma **janela anônima** do navegador e entre como o funcionário. Abra um chamado para a TI.
4. Em outra janela anônima, entre como o atendente da TI: assuma o chamado e responda.
5. Confira a sua caixa de entrada: devem chegar e-mails a cada passo (chamado novo para a TI, atendimento iniciado, mensagem etc.). Pode levar alguns segundos. Olhe também o spam na primeira vez.

### Se o e-mail não chegar

- **Edge Functions → send-notification-email → Logs**: mostram o motivo (chave errada, e-mail diferente do cadastrado no Resend etc.).
- Confira se os dois segredos da etapa C2 foram salvos e se a função foi publicada depois de salvá-los.
- O sistema continua funcionando normalmente mesmo que o e-mail falhe.

---

## O que cada perfil pode ver e fazer

| Perfil | Pode |
| --- | --- |
| Funcionário | Abrir chamados para outros setores, conversar e aprovar ou reprovar a solução dos próprios chamados. |
| Atendente do setor | Tudo do funcionário, mais receber e atender os chamados do seu próprio setor. |
| Diretoria / gestor | Tudo do funcionário, mais ver os indicadores consolidados de todos os setores. |
| Administrador | Cadastrar e gerenciar usuários. Não participa dos chamados nem vê o conteúdo deles. |

Atendentes só podem ficar em setores que recebem chamados. Um administrador não pode desativar nem rebaixar a própria conta.

## Arquivos desta atualização

Novos: `supabase/admin.sql`, `supabase/emails.sql`, `supabase/config.toml`, `supabase/functions/admin-users/index.ts`, `supabase/functions/send-notification-email/index.ts`, `docs/ADMIN_E_EMAILS.md`.
Alterados: `config.js`, `src/app.js`, `src/core.js`, `src/remote.js`, `styles.css`, `README.md`, `docs/PRODUCAO.md`.
