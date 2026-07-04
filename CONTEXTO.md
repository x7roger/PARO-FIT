# PRD — Product Requirements Document
# PARO FIT

**Versão:** 1.0
**Data:** 04/07/2026
**Autor:** Documento elaborado em parceria com Claude (Anthropic) — Rogério
**Status:** Rascunho para validação

---

## 1. Sumário Executivo

**PARO FIT** é um aplicativo web (mobile-first, acessado via navegador, sem instalação) de acompanhamento de treinos de academia, projetado para uso compartilhado entre duas pessoas sem sistema de autenticação. O conceito central é **um espaço único e vivo**: qualquer marcação, edição ou inserção feita por um usuário é refletida automaticamente para o outro, em tempo real (ou quase real).

O produto resolve um problema simples e recorrente do dia a dia do casal: substituir anotações manuais/planilhas estáticas de treino por uma experiência visual, rápida de marcar ("fiz o exercício"), e que gera, como subproduto, um painel de consistência (frequência de treino) ao longo do tempo.

Este é o mesmo espírito do **PaRo Gastos** (app de gastos compartilhado já existente entre os dois usuários), agora aplicado a fitness — reaproveitando conceitos de UX de dados compartilhados sem login.

---

## 2. Contexto e Motivação

- Hoje o controle de treinos é manual (papel, planilha, memória).
- Não há visão histórica de frequência/consistência.
- Duas pessoas usam o mesmo plano/rotina de academia e precisam ver o estado um do outro sem fricção de conta/senha.
- Já existe estrutura técnica disponível e validada pelo usuário: **Neon (Postgres serverless, plano free)** + **Vercel** (hospedagem/deploy), replicando o padrão do PaRo Gastos.

---

## 3. Objetivos do Produto

| Objetivo | Descrição | Métrica de sucesso |
|---|---|---|
| O1 | Permitir marcar exercícios como feitos, com sincronização entre os 2 usuários | Marcação refletida em ≤10s para o outro usuário |
| O2 | Visualizar o treino do dia atual automaticamente, sem navegação manual | App abre direto no dia da semana vigente |
| O3 | Permitir configuração livre de exercícios por dia da semana | CRUD completo de exercícios via tela de configurações |
| O4 | Visualizar a evolução/consistência de frequência de treino | Gráfico de linha com 3 níveis (Baixa/Média/Alta) por semana |
| O5 | Entregar uma experiência visual diferenciada, não genérica | Validação qualitativa (não parecer "template de IA") |

---

## 4. Não-Objetivos (Fora do Escopo — v1)

Para manter o app simples e estável, os itens abaixo **não** fazem parte da primeira versão:

- Autenticação/login/multiusuário genérico (é fixo para 2 pessoas, sem login).
- Cadastro de séries com carga (kg) evolutiva por exercício (pode ser v2).
- Notificações push / lembretes.
- Cronômetro de descanso entre séries (pode ser v2 — ver seção 12).
- Múltiplas rotinas/mesociclos (ex: treino A/B intercalado) — v1 é fixo por dia da semana.
- Modo offline com sincronização posterior (assume conexão ativa).

---

## 5. Personas

### Persona 1 — Usuário Casal (uso primário)
Duas pessoas (ex: Rogério e Patrícia) que treinam de forma independente, cada um no seu ritmo, mas compartilham o mesmo "quadro" de treinos da semana e querem ver o progresso um do outro como incentivo mútuo (accountability leve, sem cobrança).

### Perfil de uso
- Acesso majoritariamente via celular, dentro ou a caminho da academia.
- Sessões curtas e frequentes (abrir → ver treino do dia → marcar exercício → fechar).
- Baixa tolerância a fricção: cada toque extra é atrito.

---

## 6. Conceito de Dados Compartilhados (Regra de Negócio Central)

> **Não há "usuário logado".** Existe um único espaço de dados compartilhado (workspace), assim como no PaRo Gastos. Toda alteração é global ao app.

Implicações de design:

1. **Não existe ownership de exercício por pessoa** — o quadro da semana é único e compartilhado.
2. Cada marcação de "feito" pode, opcionalmente, registrar **quem marcou** (ver seção 8.4 — sugestão de melhoria: um seletor simples de "Perfil Ativo" local, tipo toggle Rogério/Patrícia, salvo no `localStorage` do dispositivo, **apenas para fins de exibição/estatística**, nunca como autenticação).
3. Sincronização entre os dois dispositivos deve ocorrer sem exigir refresh manual (ver seção 11 — Arquitetura Técnica).

---

## 7. Escopo Funcional (Requisitos Funcionais)

### RF-01 — Visualização do Dia Atual
- Ao abrir o app, o sistema identifica automaticamente o dia da semana vigente (baseado na data/hora do dispositivo) e exibe o quadro de treino correspondente.
- Se o dia da semana não tiver nenhum exercício configurado, exibir estado vazio amigável ("Nenhum treino configurado para hoje — toque na engrenagem para montar").

### RF-02 — Navegação entre Dias
- Deve ser possível navegar manualmente para outros dias da semana (ex: ver o treino de quinta mesmo estando em uma segunda), através de abas/seletor de dias (Dom–Sáb), sem perder o destaque visual de "qual é o dia real de hoje".

### RF-03 — Estrutura do Quadro de Treino
Cada dia da semana pode ter **um ou mais grupos musculares/blocos** (ex: "Peito", "Tríceps"), e cada bloco contém uma lista de exercícios em tabela com colunas:

| Coluna | Descrição |
|---|---|
| # | Número sequencial dentro do bloco |
| Exercício | Nome cadastrado nas configurações |
| Séries x Reps | Ex: "4x 8-10" |
| Feito | Checkbox / toggle marcando conclusão |

### RF-04 — Marcação de Exercício Concluído
- Toque na linha (ou no checkbox) alterna o estado feito/não feito.
- A alteração é persistida no banco e refletida para o outro usuário sem necessidade de recarregar a página manualmente (polling automático ou atualização em tempo real — ver seção 11).
- Feedback visual imediato (micro-animação/confirmação) ao marcar.

### RF-05 — Reset Diário Automático
- Todo início de novo dia, os checkboxes "feito" voltam a ficar desmarcados para os exercícios daquele dia da semana (o quadro é semanal e recorrente — mesma estrutura toda semana), mas **o histórico de conclusões passadas é preservado** para fins do gráfico de frequência (RF-08).
- Regra tecnica: cada marcação "feito" gera um registro histórico com **data específica**, não apenas um campo booleano fixo no exercício. O campo booleano exibido em tela é derivado de "existe registro de conclusão para este exercício **na data de hoje**?".

### RF-06 — Configurações (Engrenagem)
Acessível via ícone de engrenagem, fixo (ex: canto superior direito), levando à tela de gestão:

- **Gestão de Exercícios por Dia:** criar, editar, excluir e reordenar exercícios dentro de cada dia da semana.
- Campos por exercício: Nome, Grupo/Bloco muscular (texto livre ou selecionável, ex: Peito, Tríceps, Costas, Perna, Ombro, Abdômen, Cardio), Séries, Repetições (faixa ou fixo, ex "8-10" ou "12"), Ordem/posição.
- **Gestão de Blocos:** permitir renomear/reordenar os blocos (ex: mudar ordem de "Tríceps" para antes de "Peito").
- Ação de exclusão com confirmação (evitar exclusão acidental).

### RF-07 — Persistência e Fixação
- Exercícios criados ficam fixos (persistidos) até serem editados/excluídos manualmente pelo usuário — não há regeneração automática.

### RF-08 — Painel de Evolução / Frequência (Dashboard)
- Tela dedicada (ícone separado, ex: ícone de gráfico na navegação) mostrando:
  - **Linha do tempo semanal**, desde o início do uso do app, com classificação de cada semana em 3 níveis de frequência: **Baixa, Média, Alta**.
  - Regra de classificação sugerida (parametrizável nas configurações):
    - **Baixa:** 0–1 dia com pelo menos 1 exercício marcado na semana
    - **Média:** 2–3 dias
    - **Alta:** 4+ dias
  - Visualização adicional complementar: heatmap tipo "GitHub contributions" (grade de dias, intensidade de cor = quantidade de exercícios feitos naquele dia) — reforça a sensação de progresso visual.
  - Indicadores numéricos de apoio: sequência atual (streak), maior sequência histórica, % de exercícios concluídos no mês.

### RF-09 — Estado Vazio / Onboarding
- Na primeira utilização (banco vazio), o app deve guiar o usuário para a tela de configurações para montar o primeiro treino, com uma mensagem clara de boas-vindas.

---

## 8. Requisitos Não-Funcionais

| ID | Requisito |
|---|---|
| RNF-01 | Aplicação 100% responsiva, mobile-first (uso majoritário em celular via navegador) |
| RNF-02 | Tempo de carregamento inicial < 2s em conexão 4G |
| RNF-03 | Sincronização entre os dois usuários com atraso máximo aceitável de 5–10s |
| RNF-04 | Sem necessidade de instalação — comportamento de PWA instalável é desejável, mas opcional |
| RNF-05 | Sem autenticação; segurança baseada em URL não indexada/obscura (ver seção 10 — riscos) |
| RNF-06 | Estabilidade: nenhuma ação do usuário pode resultar em perda de dados (ex: falha de rede durante marcação deve reverter visualmente ou re-tentar) |
| RNF-07 | Compatibilidade com Neon (Postgres) + Vercel (Node/Edge functions) |
| RNF-08 | Acessibilidade mínima: contraste adequado, área de toque ≥ 44px nos checkboxes |

---

## 9. Direção de UX/UI

O requisito explícito é: **"moderno, estiloso, sofisticado, fora dos padrões convencionais, que nenhuma IA pensaria em fazer"**. Isso é uma diretriz de posicionamento — abaixo, a tradução em decisões concretas de design (evitando o "template genérico de IA": cards brancos com sombra suave, gradiente azul-roxo, ícones arredondados padrão).

### 9.1 Direção estética proposta
- **Conceito visual: "Painel de Treino Analógico-Digital"** — inspirado em cadernos de treino físico e quadros de ginásio antigo (textura, tipografia robusta), mas executado com interações digitais modernas. Isso foge do padrão "app de fitness genérico" (que geralmente usa neon verde/preto ou azul corporativo).
- **Paleta sugerida:** tons terrosos/quentes contrastando com um "grafite" escuro — ex: `#1C1B19` (grafite quase preto) como base, `#F4EDE4` (papel/off-white) como superfície de conteúdo, e um accent color de assinatura vibrante mas não convencional (ex: laranja-queimado `#D9662B` ou verde-oliva `#7A8B5C`) para estados "feito"/ativo. Evitar azul-roxo-gradiente (marca registrada de "app feito por IA").
- **Tipografia:** uma serifada de impacto para títulos (ex: estilo "editorial/revista") combinada com uma mono ou grotesca para dados tabulares (números de séries/reps) — reforça o conceito "ficha técnica", não "app fofo".
- **Micro-interação de destaque:** ao marcar um exercício como feito, em vez de um simples checkmark, usar um efeito de "stamp" (carimbo), reforçando a metáfora do caderno de treino — memorável e não-genérico.
- **Navegação por dias:** ao invés de abas horizontais padrão, considerar um seletor tipo "régua/timeline" onde o dia atual tem destaque de tamanho/cor diferenciado dos demais.
- **Dashboard de frequência:** o heatmap estilo "contribution graph" pode ganhar uma leitura visual própria (ex: "trilha de pegadas" ou "trilha de intensidade") ao invés do quadrado clássico verde do GitHub.

### 9.2 Hierarquia de tela (Home / Dia Atual)
1. Cabeçalho fixo: Logo/nome do app + dia da semana atual em destaque + ícone de engrenagem.
2. Seletor de dias (navegação secundária).
3. Blocos por grupo muscular, cada um como uma "seção de ficha" com título de bloco.
4. Tabela/lista de exercícios dentro de cada bloco.
5. Acesso à tela de Dashboard (ícone de gráfico, navegação inferior fixa tipo tab bar mobile).

### 9.3 Navegação geral (proposta de IA — a validar)
Tab bar inferior fixa (padrão mobile-web) com 2–3 destinos:
- **Treino** (home/dia atual) — ícone padrão
- **Evolução** (dashboard de frequência)
- **Configurações** (engrenagem) — pode também ficar fixa no cabeçalho, redundante à tab bar, dado que é uma ação frequente.

---

## 10. Riscos e Mitigações

| Risco | Impacto | Mitigação sugerida |
|---|---|---|
| Ausência de autenticação expõe dados a qualquer pessoa com a URL | Baixo (uso privado entre 2 pessoas), mas existe | URL não listada + considerar um "PIN" simples opcional de 4 dígitos guardado em cookie, sem fricção de login formal |
| Conflito de edição simultânea (os dois marcam ao mesmo tempo) | Baixo | Estratégia "last write wins" é aceitável dado o baixo volume de escrita; não há necessidade de lock otimista na v1 |
| Sincronização em tempo real pode gerar custo/complexidade no plano free do Neon | Médio | Usar polling leve (ex: a cada 5–8s) em vez de WebSocket permanente, compatível com serverless + free tier |
| Reset diário mal implementado pode apagar histórico | Alto | Nunca sobrescrever registros passados — sempre criar novo registro por data (event sourcing simples, ver RF-05) |

---

## 11. Arquitetura Técnica (Proposta)

### 11.1 Stack
- **Frontend:** React (Vite) + TypeScript + Tailwind CSS — mesmo padrão já validado nos outros projetos do usuário (POC Manager, ClickMetrics, PaRo Gastos), reaproveitando conhecimento e agentes de codificação (Antigravity).
- **Backend:** Vercel Serverless Functions (Node) ou Vercel Edge Functions para as rotas de API.
- **Banco de Dados:** Neon (Postgres serverless, plano free) via biblioteca `@neondatabase/serverless` ou Prisma/Drizzle ORM.
- **Hospedagem:** Vercel (mesmo domínio ou subdomínio dedicado).

### 11.2 Estratégia de Sincronização entre os 2 usuários
Como não há WebSocket nativo simples em ambiente 100% serverless/Vercel sem serviço adicional, recomenda-se:

- **Opção A (recomendada para v1 — mais simples e estável):** *Polling leve* — o cliente consulta o backend a cada 5–8 segundos buscando apenas o "estado atual" (ou um `updated_at` global para saber se precisa buscar dados novos, evitando payload desnecessário).
- **Opção B (v2, se necessário mais "tempo real"):** Integração com serviço de pub/sub como *Pusher*, *Ably* ou *Supabase Realtime* (este último exigiria migrar de Neon — não recomendado agora). Vercel também oferece *Vercel KV/Edge Config* para casos simples, mas não é ideal para pub/sub complexo.
- Dado o volume de uso (2 pessoas, poucas marcações por dia), **Opção A é suficiente e mais estável/barata**, alinhada ao requisito de "simples e estável".

### 11.3 Modelo de Dados (Proposta Inicial)

```
tabela: exercicios
- id (uuid, pk)
- dia_semana (int, 0-6)
- bloco (text)            -- ex: "Peito", "Tríceps"
- ordem_bloco (int)
- nome (text)
- series (text)            -- ex: "4"
- reps (text)              -- ex: "8-10"
- ordem (int)
- criado_em (timestamp)
- atualizado_em (timestamp)

tabela: conclusoes
- id (uuid, pk)
- exercicio_id (uuid, fk -> exercicios.id)
- data (date)               -- dia específico da marcação
- concluido_em (timestamp)
- marcado_por (text, nullable)  -- "Rogério" / "Patrícia" (opcional, ver 6.3)

tabela: configuracoes  (opcional, v2)
- chave (text, pk)
- valor (jsonb)             -- ex: limiares de frequência baixa/média/alta
```

> A separação entre `exercicios` (estrutura fixa) e `conclusoes` (eventos históricos por data) é o que garante o reset diário automático (RF-05) sem perder histórico para o dashboard (RF-08).

### 11.4 Cálculo do Dashboard de Frequência
- Backend expõe endpoint que agrega `conclusoes` por semana ISO, contando dias distintos com ≥1 conclusão.
- Classificação (Baixa/Média/Alta) aplicada conforme regra da seção 7 (RF-08), configurável futuramente.

---

## 12. Sugestões de Valor Agregado (Backlog para v2 — não bloqueiam o MVP)

Como solicitado, seguem sugestões de um especialista de produto que agregam valor sem inflar o escopo do MVP:

1. **Toggle de "Perfil Ativo"** (Rogério/Patrícia) local, sem autenticação — apenas para registrar quem marcou e permitir estatísticas individuais dentro do espaço compartilhado (ex: "streak do Rogério" vs "streak da Patrícia").
2. **Cronômetro de descanso** entre séries, disparado ao marcar exercício como feito.
3. **Campo de carga (kg)** por marcação, permitindo evolução de carga por exercício ao longo do tempo (gráfico de progressão de força).
4. **Comentário/observação rápida** por exercício no dia (ex: "hoje senti dor no ombro") — histórico qualitativo simples.
5. **Modo "treino livre"** — permitir adicionar um exercício extra pontual no dia sem precisar ir às configurações.
6. **Exportação/backup** simples dos dados (JSON) por segurança, já que não há autenticação nem múltiplos ambientes.
7. **PWA instalável** (manifest + ícone) para acesso tipo "app nativo" direto da tela inicial do celular, sem necessidade de abrir o navegador manualmente.
8. **Modo escuro/claro automático** conforme preferência do sistema.

---

## 13. Fluxos Principais (Resumo)

### Fluxo 1 — Marcar exercício como feito
1. Usuário abre o app → vê o treino do dia atual.
2. Toca no checkbox/linha do exercício.
3. Frontend atualiza estado local imediatamente (otimista) + envia requisição ao backend.
4. Backend grava registro em `conclusoes`.
5. Outro dispositivo, no próximo ciclo de polling, recebe o novo estado e atualiza a tela.

### Fluxo 2 — Configurar novo exercício
1. Usuário toca na engrenagem.
2. Seleciona o dia da semana e o bloco (ou cria um novo bloco).
3. Preenche nome, séries e reps.
4. Salva → exercício passa a aparecer fixado na tela principal daquele dia, para ambos os usuários.

### Fluxo 3 — Consultar evolução
1. Usuário acessa a aba "Evolução".
2. Visualiza linha do tempo semanal com classificação Baixa/Média/Alta.
3. Visualiza heatmap complementar e indicadores de streak.

---

## 14. Critérios de Aceite do MVP

- [ ] App abre exibindo automaticamente o dia da semana correto.
- [ ] Marcar/desmarcar exercício sincroniza para o outro dispositivo em até 10s.
- [ ] Configurações permitem criar, editar, excluir e reordenar exercícios por dia/bloco.
- [ ] Reset diário funciona sem apagar histórico.
- [ ] Dashboard exibe corretamente a classificação semanal de frequência (Baixa/Média/Alta).
- [ ] Visual não reutiliza os padrões genéricos comuns (gradiente azul-roxo, cards com sombra suave padrão, ícones arredondados default).
- [ ] Aplicação estável em uso mobile via navegador, sem necessidade de instalação.

---

## 15. Próximos Passos Sugeridos

1. Validar com Patrícia a nomenclatura dos blocos musculares padrão e os treinos atuais reais, para popular o banco inicial.
2. Definir a identidade visual final (paleta, tipografia, ícone/stamp de "feito") — pode ser prototipado como wireframe/mockup antes do código.
3. Modelar o schema no Neon (tabelas `exercicios` e `conclusoes`).
4. Implementar a tela Home (dia atual + marcação) como primeiro entregável funcional.
5. Implementar tela de Configurações (CRUD de exercícios).
6. Implementar Dashboard de Evolução por último, pois depende de histórico acumulado para ter valor real.

---

*Documento sujeito a revisão conforme validação do usuário e evolução do desenvolvimento (vibe coding via Antigravity, seguindo o padrão de trabalho já estabelecido nos demais projetos).*
