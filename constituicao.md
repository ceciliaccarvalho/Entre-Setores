# Constituição — Sistema de Gerenciamento de Chamados Internos

Princípios inegociáveis do projeto. Toda decisão de especificação, plano e implementação deve respeitá-los.

## 1. Rastreabilidade dos chamados

Toda ação relevante realizada em um chamado deve ser registrada pelo sistema, permitindo identificar quem realizou a ação, o que aconteceu e quando ela ocorreu.

## 2. Transparência para o solicitante

O solicitante deve conseguir acompanhar o status e o histórico dos seus próprios chamados, incluindo atualizações e solicitações de informações realizadas pelo setor responsável, e receber notificações sobre o andamento do processo.

## 3. Acesso conforme o papel do usuário

Cada usuário deve visualizar e acessar somente as informações necessárias para exercer sua função no sistema, respeitando seu papel como solicitante, atendente ou gestor.

| Categoria do usuário | Pode enviar | Pode receber | Pode ver indicadores |
|---|---|---|---|
| Recursos Humanos (RH) | sim | sim | não |
| Tecnologia da Informação (TI) | sim | sim | não |
| Financeiro e Contabilidade | sim | sim | não |
| Fiscal e Jurídico | sim | sim | não |
| Compras | sim | sim | não |
| Administrativo | sim | sim | não |
| Infraestrutura / Manutenção | sim | sim | não |
| Serviços Gerais | sim | sim | não |
| Operações | sim | sim | não |
| Comercial / Vendas | sim | não | não |
| Marketing | sim | não | não |
| Produto | sim | não | não |
| Diretoria | sim | não | sim |

## 4. Indicadores baseados nos dados registrados

Os indicadores gerenciais devem ser calculados a partir dos dados registrados nos chamados, sem depender de lançamentos manuais de resultados, garantindo que as informações apresentadas aos gestores reflitam os dados do sistema. A parte de indicadores fica visível apenas para usuários classificados como "diretor".
