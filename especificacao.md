# Especificação do Sistema — Sistema de Gerenciamento de Chamados Internos

## 1. Contexto

Em uma organização, funcionários de diferentes setores precisam realizar solicitações entre si para resolver problemas, obter informações ou solicitar serviços. Essas solicitações podem ocorrer por diferentes canais, como e-mail, mensagens instantâneas ou comunicação verbal.

A utilização de diferentes canais dificulta o acompanhamento das solicitações, a identificação dos responsáveis, o registro do histórico de comunicação e a mensuração do tempo necessário para atendimento e resolução.

O sistema proposto tem como objetivo centralizar essas solicitações em uma plataforma de gerenciamento de chamados internos, permitindo registrar, encaminhar, acompanhar e encerrar demandas entre setores.

Além do acompanhamento operacional, o sistema deverá registrar os principais eventos do ciclo de cada chamado, permitindo a geração de indicadores consolidados para apoiar a gestão.

## 2. Usuários

O sistema terá três perfis principais de usuário, podendo um usuário ter mais de um perfil, mas nunca todos.

### 2.1 Solicitante

Funcionário que abre uma solicitação para outro setor. Pode:

- abrir chamados;
- identificar seu setor;
- selecionar o setor responsável;
- descrever o problema ou solicitação;
- acompanhar seus próprios chamados;
- responder solicitações de informações adicionais;
- visualizar o histórico dos próprios chamados;
- receber notificações relacionadas aos seus chamados;
- aprovar ou não aprovar a solução apresentada pelo setor responsável.

### 2.2 Atendente

Usuário responsável pelo atendimento dos chamados destinados ao seu setor. Pode:

- abrir chamados;
- receber chamados destinados ao seu setor;
- visualizar chamados do seu setor;
- assumir e atender chamados;
- alterar o status do chamado;
- solicitar informações adicionais;
- registrar respostas e atualizações;
- registrar que um terceiro foi acionado;
- registrar o resultado da atuação de um terceiro;
- registrar a resolução;
- encerrar o chamado para avaliação do solicitante.

### 2.3 Diretor/Gestor

Usuário responsável pelo acompanhamento gerencial. Pode:

- realizar as mesmas ações do solicitante;
- acessar o painel de indicadores consolidados;
- consultar informações agregadas dos chamados.

A parte de indicadores fica disponível apenas para usuários classificados como Diretor/Gestor.

## 3. Escopo

O sistema deverá contemplar:

1. Cadastro e identificação dos usuários e seus respectivos setores;
2. Abertura de chamados;
3. Identificação do setor solicitante;
4. Identificação do setor responsável;
5. Descrição do problema ou solicitação;
6. Registro de informações e anexos relacionados ao chamado;
7. Encaminhamento do chamado ao setor responsável;
8. Registro de data e hora dos principais eventos;
9. Recebimento e atendimento dos chamados;
10. Solicitação de informações adicionais;
11. Loop de comunicação até que sejam obtidas informações suficientes para prosseguir;
12. Registro das mensagens e interações realizadas, separadas para cada chamado;
13. Registro do acionamento de terceiros realizado fora do sistema;
14. Notificação dos usuários envolvidos sobre eventos relevantes;
15. Registro do resultado da atuação de terceiros;
16. Registro da resolução;
17. Encerramento do chamado pelo setor responsável;
18. Solicitação de confirmação da solução ao solicitante;
19. Aprovação ou não aprovação da solução pelo solicitante;
20. Reabertura do fluxo de atendimento quando a solução não for aprovada;
21. Fechamento definitivo do chamado após aprovação do solicitante;
22. Registro da data e hora do fim efetivo do chamado;
23. Cálculo da duração do chamado;
24. Consulta ao histórico dos chamados;
25. Dashboard gerencial;
26. Geração de indicadores consolidados por setor e período.

## 4. Fora do escopo

- Integração real com WhatsApp;
- Integração com sistemas corporativos externos;
- Integração com sistemas de ERP;
- Atendimento ao público externo;
- Sistema de cobrança ou pagamentos;
- Automatização da resolução dos problemas;
- Inteligência artificial para responder ou resolver chamados automaticamente;
- Definição automática do setor responsável por meio de IA;
- Sistema completo de gestão de projetos;
- Controle de ponto ou jornada dos funcionários;
- Avaliação de desempenho individual dos funcionários;
- Acionamento ou comunicação direta com terceiros pelo sistema.

> **Observação:** o sistema apenas registrará que um terceiro foi acionado e permitirá registrar posteriormente o resultado de sua atuação. O contato com o terceiro ocorrerá fora do sistema, sendo realizado pelo setor responsável.

## 5. Requisitos Funcionais (EARS)

### RF-01 — Identificação do usuário e setor
O sistema deve identificar o usuário autenticado e seu respectivo setor antes da abertura de um chamado.

### RF-02 — Abertura de chamado
O sistema deve permitir que um usuário autorizado abra um chamado informando o setor responsável, título, descrição e demais informações obrigatórias definidas pelo sistema.

### RF-03 — Identificação dos setores
O sistema deve registrar o setor do solicitante e o setor responsável por cada chamado.

### RF-04 — Encaminhamento do chamado
Quando um chamado for aberto, o sistema deve encaminhá-lo ao setor responsável informado pelo solicitante.

### RF-05 — Registro de data e hora
O sistema deve registrar a data e a hora dos principais eventos do ciclo do chamado, incluindo abertura, encaminhamento, recebimento, primeira resposta, solicitações e respostas de informações, acionamento de terceiros, resolução, encerramento pelo setor responsável, aprovação ou reprovação pelo solicitante e fechamento definitivo.

### RF-06 — Notificação de recebimento
Quando um chamado for encaminhado a um setor, o sistema deve notificar os usuários responsáveis pelo atendimento daquele setor.

### RF-07 — Atendimento do chamado
O sistema deve permitir que um atendente visualize e assuma um chamado destinado ao seu setor.

### RF-08 — Solicitação de informações adicionais
O sistema deve permitir que o atendente solicite informações adicionais ao solicitante quando as informações disponíveis forem insuficientes para realizar o atendimento.

### RF-09 — Loop de informações
Enquanto as informações fornecidas forem insuficientes para o atendimento, o sistema deve permitir novas solicitações de informações e respostas do solicitante, mantendo o chamado em estado de espera até que o atendente considere as informações suficientes, como um sistema de mensagens.

### RF-10 — Registro de comunicação
O sistema deve registrar as mensagens trocadas entre solicitante e atendente no histórico do chamado, identificando o autor e a data e hora da mensagem.

### RF-11 — Acionamento de terceiro
Quando o setor responsável não puder realizar diretamente a resolução, o atendente poderá acionar um terceiro fora do sistema. O sistema deverá permitir que o atendente registre que um terceiro foi acionado e as informações pertinentes ao acionamento.

### RF-12 — Notificação sobre acionamento de terceiro
Quando um terceiro for acionado, o sistema deverá notificar o solicitante para seu conhecimento de que a resolução depende de uma atuação externa ao setor responsável. A notificação não será enviada ao terceiro pelo sistema.

### RF-13 — Registro do resultado do terceiro
Após o terceiro realizar sua atuação, o setor responsável deverá registrar no sistema o resultado do atendimento realizado fora do sistema. O registro deverá fazer parte do histórico do chamado.

### RF-14 — Registro da resolução
O setor responsável deve poder registrar a solução aplicada ao chamado antes de seu encerramento para avaliação do solicitante.

### RF-15 — Encerramento pelo setor responsável
Quando o setor responsável considerar a demanda solucionada, deverá encerrar o atendimento e encaminhar o chamado para confirmação do solicitante. O encerramento realizado pelo setor não representa o fim definitivo do chamado.

### RF-16 — Notificação para confirmação
Quando o setor responsável encerrar o atendimento, o sistema deverá notificar o solicitante de que a solução foi apresentada e aguarda sua confirmação.

### RF-17 — Aprovação da solução
O sistema deverá permitir que o solicitante aprove a solução apresentada pelo setor responsável. Quando aprovada, a solução deverá ser considerada aceita e o chamado deverá ser fechado definitivamente.

### RF-18 — Não aprovação da solução
O sistema deverá permitir que o solicitante não aprove a solução apresentada e envie uma mensagem explicando o motivo da não aprovação. Quando isso ocorrer, o chamado deverá retornar ao fluxo de atendimento, permitindo que o setor responsável receba e analise as novas informações.

### RF-19 — Fechamento definitivo
O sistema deverá fechar definitivamente o chamado somente após a aprovação da solução pelo solicitante. Nesse momento, o sistema deverá registrar a data e hora do fim efetivo do chamado.

### RF-20 — Notificação de finalização
Quando o solicitante aprovar a solução, o sistema deverá registrar a finalização definitiva do chamado.

### RF-21 — Histórico do chamado
O sistema deve apresentar ao usuário autorizado o histórico das principais ações, mensagens, alterações de status e eventos registrados durante o ciclo do chamado.

### RF-22 — Cálculo da duração
O sistema deve calcular a duração total do chamado com base na diferença entre a data e hora de abertura e a data e hora do fechamento definitivo, após aprovação do solicitante.

### RF-23 — Consulta de chamados
O sistema deve permitir que usuários autorizados consultem os chamados aos quais possuem acesso, podendo visualizar seu status e informações relevantes.

### RF-24 — Dashboard gerencial
O sistema deve disponibilizar ao diretor/gestor um painel com indicadores consolidados dos chamados.

### RF-25 — Indicadores por setor
O dashboard deve permitir visualizar a quantidade de chamados recebidos e finalizados por setor.

### RF-26 — Indicadores de tempo
O dashboard deve apresentar indicadores relacionados ao tempo dos chamados, incluindo tempo médio de resposta, tempo médio de resolução e duração média dos chamados.

### RF-27 — Filtros gerenciais
O diretor/gestor deve poder filtrar os indicadores por período e setor.

### RF-28 — Múltiplos chamados simultâneos
Um usuário pode abrir novos chamados antes que o último seja resolvido.

## 6. Critérios de Aceitação (Dado/Quando/Então)

### CA-01 — Identificação do setor
**Dado que** o usuário está cadastrado no sistema,
**quando** iniciar a abertura de um chamado,
**então** o sistema deve identificar seu setor cadastrado.

### CA-02 — Abertura de chamado
**Dado que** o usuário preencheu os campos obrigatórios,
**quando** confirmar a abertura do chamado,
**então** o sistema deve criar um chamado com identificador único, registrar o solicitante e seu setor e definir o setor responsável.

### CA-03 — Encaminhamento
**Dado que** um chamado foi criado,
**quando** o registro for concluído,
**então** o sistema deve encaminhar o chamado ao setor responsável informado.

### CA-04 — Notificação do setor
**Dado que** um chamado foi encaminhado para um setor,
**quando** o encaminhamento for registrado,
**então** o sistema deve gerar uma notificação para os responsáveis pelo atendimento daquele setor.

### CA-05 — Registro de horário
**Dado que** um chamado foi encaminhado,
**quando** o encaminhamento for realizado,
**então** o sistema deve registrar automaticamente a data e a hora do evento.

### CA-06 — Solicitação de informação
**Dado que** o atendente identificou que as informações disponíveis são insuficientes,
**quando** solicitar informações adicionais,
**então** o sistema deve registrar a solicitação, alterar o chamado para o estado de espera definido e notificar o solicitante.

### CA-07 — Loop de informações
**Dado que** o chamado está aguardando informações,
**quando** o solicitante enviar novas informações,
**então** o sistema deve registrá-las e permitir que o atendente avalie novamente se as informações são suficientes.

### CA-08 — Nova solicitação de informação
**Dado que** as informações recebidas continuam insuficientes,
**quando** o atendente solicitar novas informações,
**então** o sistema deve registrar uma nova solicitação e manter o chamado aguardando informações.

### CA-09 — Informações suficientes
**Dado que** o atendente considera as informações suficientes,
**quando** prosseguir com o atendimento,
**então** o chamado deve sair do estado de espera e retornar ao fluxo de atendimento.

### CA-10 — Acionamento de terceiro
**Dado que** o setor responsável identificou a necessidade de atuação de um terceiro,
**quando** o atendente registrar o acionamento,
**então** o sistema deve registrar que um terceiro foi acionado e manter essa informação no histórico do chamado.

### CA-11 — Notificação sobre terceiro
**Dado que** um terceiro foi acionado fora do sistema,
**quando** o atendente registrar o acionamento,
**então** o solicitante deve receber uma notificação informando que a demanda depende de uma atuação externa,
**e** o sistema não deve enviar nenhuma notificação ou solicitação diretamente ao terceiro.

### CA-12 — Registro do resultado do terceiro
**Dado que** o terceiro realizou sua atuação fora do sistema,
**quando** o setor responsável registrar o resultado,
**então** o sistema deve armazenar essa informação no histórico do chamado.

### CA-13 — Registro da resolução
**Dado que** o setor responsável considera o problema solucionado,
**quando** registrar a resolução,
**então** o sistema deve armazenar a descrição da solução no histórico do chamado.

### CA-14 — Encerramento pelo setor
**Dado que** a resolução foi registrada,
**quando** o setor responsável encerrar o atendimento,
**então** o sistema deve alterar o chamado para o estado de Aguardando confirmação e notificar o solicitante.

### CA-15 — Aprovação da solução
**Dado que** o chamado está aguardando confirmação,
**quando** o solicitante aprovar a solução,
**então** o sistema deve fechar definitivamente o chamado e registrar a data e hora do fim efetivo.

### CA-16 — Não aprovação da solução
**Dado que** o chamado está aguardando confirmação,
**quando** o solicitante não aprovar a solução,
**então** o sistema deve exigir uma mensagem explicando o motivo da não aprovação e registrar essa mensagem no histórico.

### CA-17 — Retorno ao atendimento
**Dado que** o solicitante não aprovou a solução e enviou uma nova mensagem,
**quando** a mensagem for registrada,
**então** o chamado deve retornar ao fluxo de atendimento, ficando disponível para o setor responsável analisar as novas informações.

### CA-18 — Nova rodada de atendimento
**Dado que** o chamado retornou ao setor responsável após uma não aprovação,
**quando** o atendente receber as novas informações,
**então** poderá continuar o atendimento, solicitar informações adicionais ou realizar uma nova tentativa de resolução.

### CA-19 — Fechamento definitivo
**Dado que** o setor responsável encerrou o atendimento e o solicitante aprovou a solução,
**quando** a aprovação for registrada,
**então** o sistema deve registrar o chamado como Finalizado e não permitir novas alterações no fluxo operacional, salvo procedimento administrativo definido posteriormente.

### CA-20 — Duração do chamado
**Dado que** um chamado possui data e hora de abertura e de fim efetivo,
**quando** o solicitante aprovar a solução,
**então** o sistema deve calcular a duração total do chamado utilizando esses dois momentos.

### CA-21 — Histórico
**Dado que** um chamado possui ações e mensagens registradas,
**quando** um usuário autorizado acessar o chamado,
**então** o sistema deve apresentar o histórico das ações e comunicações registradas.

### CA-22 — Dashboard
**Dado que** o usuário possui perfil de diretor/gestor,
**quando** acessar o painel gerencial,
**então** o sistema deve apresentar os indicadores consolidados dos chamados.

### CA-23 — Indicadores por setor
**Dado que** existem chamados registrados no sistema,
**quando** o diretor/gestor consultar os indicadores por setor,
**então** o sistema deve apresentar a quantidade de chamados correspondente a cada setor no período selecionado.

### CA-24 — Indicadores de tempo
**Dado que** existem chamados com os respectivos registros de data e hora,
**quando** o diretor/gestor consultar os indicadores de tempo,
**então** o sistema deve calcular e apresentar os indicadores definidos para o período selecionado.

### CA-25 — Filtro por período
**Dado que** o diretor/gestor está visualizando o dashboard,
**quando** selecionar um período específico,
**então** o sistema deve atualizar os indicadores considerando somente os chamados correspondentes ao período selecionado.

## 7. Estados do chamado

O ciclo de vida básico de um chamado será:

**Aberto → Em atendimento → Aguardando informações\* → Envio a terceiros\* → Em atendimento → Em resolução → Resolvido → Aguardando confirmação → Finalizado**

\* Estados opcionais.

- O estado "Aguardando informações" poderá ocorrer mais de uma vez durante o mesmo chamado ou nenhuma vez.
- O estado "Envio a terceiros" poderá ocorrer em alguns casos, mas não obrigatoriamente em todos.
- Caso o solicitante não aprove a solução, o chamado volta ao estado de aguardando informações, até o usuário explicar o que aconteceu; depois disso, segue o fluxo.
- O estado "Aguardando confirmação" representa o momento em que o setor responsável considera a demanda solucionada, mas o chamado ainda não chegou ao seu fim efetivo.
- O estado "Finalizado" somente será alcançado após a aprovação da solução pelo solicitante.

## 8. Indicadores previstos

A partir dos registros realizados durante o ciclo dos chamados, o sistema poderá apresentar:

- Quantidade de chamados por setor;
- Quantidade de chamados abertos;
- Quantidade de chamados em atendimento;
- Quantidade de chamados aguardando informações;
- Quantidade de chamados aguardando confirmação;
- Quantidade de chamados finalizados;
- Tempo médio de primeira resposta;
- Tempo médio de resolução e de finalização;
- Duração média dos chamados;
- Quantidade de chamados que necessitaram de terceiros;
- Quantidade de chamados reabertos após não aprovação;
- Tempo médio entre resolução e aprovação do solicitante;
- Tempo médio de atendimento por setor;
- Evolução do volume de chamados por período.

### Regra para os indicadores de duração

Para fins de gestão, o fim efetivo do chamado será considerado o momento em que o solicitante aprovar a solução. Assim:

**Duração do chamado = Data/hora de aprovação − Data/hora de abertura**

No momento em que o setor responsável encerra o atendimento não será considerado o fim do chamado, pois ainda será necessária a confirmação do solicitante.

Os indicadores serão derivados dos eventos registrados no sistema e não deverão depender de preenchimento manual dos resultados.
