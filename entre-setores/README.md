# Entre setores

Sistema web para centralizar as **solicitações internas entre os setores de uma empresa**. Quem precisa de algo abre um chamado para o setor responsável, conversa com o atendente no próprio chamado e só encerra o pedido quando aprova a solução. Projeto acadêmico, em português, baseado no documento **Sistema de Solicitações Internas.pdf**.

**Site publicado:** [Abrir Entre setores](https://ceciliaccarvalho.github.io/entre-setores/) · **Repositório:** [ceciliaccarvalho/entre-setores](https://github.com/ceciliaccarvalho/entre-setores)

## O que o sistema faz

| Perfil | O que pode ver e fazer |
| --- | --- |
| **Funcionário (solicitante)** | Abre vários chamados ao mesmo tempo, acompanha os próprios pedidos, conversa, envia anexos, responde pedidos de informação e aprova ou reprova a solução. |
| **Atendente do setor** | Tudo do funcionário, mais receber os chamados do seu setor, assumir o atendimento, pedir informações, registrar contatos com terceiros e a solução, e enviar para confirmação. |
| **Diretoria / gestor** | Tudo do funcionário, mais indicadores consolidados por setor e período, sem acesso ao conteúdo dos chamados de outras pessoas. |
| **Administrador** | Cadastra usuários com e-mail e senha, define setor e perfil de acesso, desativa ou reativa contas e redefine senhas. Não participa dos chamados nem vê o conteúdo deles. |

Regras principais:

- O chamado só é finalizado com a **aprovação do solicitante**. A reprovação exige justificativa e devolve o chamado ao atendimento.
- Todo evento fica no **histórico**, com autor, data e hora (horário de Brasília).
- **Notificações** dentro do sistema e **e-mails automáticos**: a cada atualização do chamado (aberto, assumido, pedido de informação, mensagem, solução, aprovação ou reprovação) a outra parte recebe um e-mail com o resumo e um link para abrir o chamado.
- **Indicadores** calculados a partir dos eventos: volume, primeira resposta, tempo de resolução, duração total, espera pela aprovação, acionamento de terceiros e reaberturas.
- Anexos em PDF, PNG, JPEG, WebP, TXT e CSV (5 MB por arquivo, 10 MB e 20 arquivos por chamado).

O contato com terceiros acontece fora do sistema; ele apenas registra o acionamento e o resultado. Integrações com WhatsApp, ERP, pagamentos e resolução automática por IA ficam fora do escopo.

## Como é construído

- **Site (frontend):** HTML, CSS e JavaScript nativos, sem build e sem npm, publicado no **GitHub Pages**.
- **Banco e login:** **Supabase** (Auth e PostgreSQL). As permissões são validadas no servidor; as tabelas não aceitam acesso direto, apenas funções (RPC) autorizadas.
- **Funções de servidor (Supabase Edge Functions):**
  - `admin-users`: cria e gerencia usuários. Só funciona para um administrador ativo e é a única parte que usa a chave de serviço, que nunca vai para o site.
  - `send-notification-email`: envia o e-mail de cada notificação, usando o **Resend**.
- **Modo demonstração:** se `config.js` estiver sem URL e chave do Supabase e com `allowDemo: true`, o site abre com perfis fictícios guardados só no navegador.

Nunca coloque uma chave `service_role`, senha de banco, chave do Resend ou token do GitHub em arquivos do site. Em `config.js` ficam somente a URL do projeto e a chave pública.

## Configurar do zero

1. Crie um projeto no [Supabase](https://supabase.com/dashboard).
2. Siga [docs/PRODUCAO.md](docs/PRODUCAO.md) para criar as tabelas (`supabase/schema.sql`) e ligar o site ao projeto (`config.js`).
3. Siga [docs/ADMIN_E_EMAILS.md](docs/ADMIN_E_EMAILS.md) para criar o primeiro administrador, publicar as duas funções e ativar os e-mails.

Sem domínio próprio, o Resend entrega apenas no e-mail da conta que o criou. Para apresentações existe o **modo apresentação**: todos os e-mails chegam em um único endereço, com o destinatário original indicado no assunto.

## Executar no computador

Na pasta do projeto, inicie um servidor local.

macOS ou Linux:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Windows (PowerShell):

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Acesse **http://127.0.0.1:4173**. Use sempre um servidor HTTP; abrir o `index.html` direto no navegador impede o carregamento dos módulos JavaScript.

## Publicar no GitHub Pages

1. Envie os arquivos para a branch `main` do repositório, mantendo a pasta `.github`.
2. Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.
3. Na aba **Actions**, execute **Publicar no GitHub Pages** (ou envie um novo commit para `main`).
4. Ao terminar, o endereço `github.io` aparece no job de publicação.

O workflow publica somente `index.html`, `styles.css`, `config.js`, `manifest.webmanifest`, `favicon.svg` e `src/`. Documentação, testes e SQL ficam fora do site. Como o repositório é público, não envie dados de usuários nem segredos.

## Estrutura do projeto

| Caminho | Conteúdo |
| --- | --- |
| `index.html`, `styles.css`, `config.js` | Página, estilos e configuração pública. |
| `src/` | Lógica do sistema: `app.js` (telas), `core.js` (regras do chamado), `remote.js` (Supabase), `local.js` e `seed.js` (demonstração). |
| `supabase/schema.sql` | Tabelas, permissões e funções do banco. |
| `supabase/admin.sql` | Perfil de administrador e controle de e-mails enviados. |
| `supabase/emails.sql` | Gatilho que dispara o e-mail a cada notificação. |
| `supabase/functions/` | Funções de servidor `admin-users` e `send-notification-email`. |
| `docs/` | Requisitos, guia de produção e guia de administrador e e-mails. |
| `tests/` | Testes das regras, do banco e das telas. |
| `.github/workflows/` | Publicação automática no GitHub Pages. |

## Testes

- **Regras do chamado:** com o servidor local ligado, abra `http://127.0.0.1:4173/tests/domain.html`. Verifica permissões, transições de situação e cálculo de indicadores.
- **Banco e autenticação:** abra `http://127.0.0.1:4173/tests/backend.html`. Executa o `schema.sql` em um PostgreSQL em memória ([PGlite](https://pglite.dev/docs/)) com identidades de teste. Requer internet, pois carrega o PGlite de um CDN; o site publicado não depende dele.
- **Telas no navegador:** `tests/browser_check.py` roda o ciclo completo no Chrome ou Edge por meio do protocolo de depuração, com uma instância de teste de perfil exclusivo, e grava capturas e um relatório JSON em `artifacts/` (fora do Pages).
- **Administrador e e-mails:** o roteiro de teste manual está no final de [docs/ADMIN_E_EMAILS.md](docs/ADMIN_E_EMAILS.md).

Testes automatizados não substituem a conferência de toque, teclado e áreas seguras em um celular de verdade, nem a validação do projeto Supabase com contas reais.

## Documentação

- [docs/REQUISITOS.md](docs/REQUISITOS.md): rastreabilidade dos requisitos.
- [docs/PRODUCAO.md](docs/PRODUCAO.md): implantação com Supabase.
- [docs/ADMIN_E_EMAILS.md](docs/ADMIN_E_EMAILS.md): administrador, cadastro de usuários e e-mails automáticos.
