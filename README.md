# CoupleDin

<p align="center">
  <img src="public/coupledin.png" alt="CoupleDin" width="180" />
</p>

<p align="center">
  Financas do casal em um so lugar.
</p>

O **CoupleDin** e uma aplicacao web responsiva para casais organizarem a vida financeira compartilhada. O app reune receitas, despesas, cartoes, investimentos, metas e relatorios em um espaco privado para duas pessoas, com atualizacoes em tempo real e regras de divisao de gastos.

> O projeto esta em desenvolvimento ativo. As funcionalidades descritas abaixo refletem o que existe atualmente no codigo.

## Principais recursos

### Espaco financeiro do casal

- Cadastro e login por e-mail e senha.
- Criacao de um espaco financeiro compartilhado.
- Entrada do parceiro por codigo de convite de uso unico.
- Limite de duas pessoas por espaco.
- Perfil individual com nome e foto.
- Saudacao e interface atualizadas quando o parceiro entra no espaco.
- Isolamento dos dados de cada casal por Row Level Security (RLS).

### Dashboard

- Visao consolidada de saldo, entradas, saidas e compras no credito.
- Grafico de fluxo de caixa dos ultimos seis meses.
- Lista de transacoes recentes.
- Navegacao apenas pelos meses que possuem movimentacoes.
- Paineis detalhados para saldo, receitas, despesas e faturas.
- Atualizacao automatica das transacoes por Supabase Realtime.
- Estados de carregamento, erro e ausencia de dados.

### Lancamentos

- Cadastro, edicao e exclusao de transacoes.
- Tipos de lancamento: entrada, debito e credito.
- Categorias como alimentacao, lazer, transporte, moradia, saude, renda e outros.
- Identificacao de quem realizou o pagamento.
- Divisao individual, proporcional ou conjunta em 50/50.
- Filtros por mes, categoria, tipo e responsavel.
- Vinculo de compras no credito a um cartao.
- Parcelamento automatico, com geracao das parcelas nos meses seguintes.
- Cadastro rapido em linguagem natural com Google Gemini.

Exemplo de lancamento por texto:

```text
Paguei R$ 120 no mercado hoje no credito, dividido entre nos dois.
```

A IA interpreta data, descricao, categoria, valor, tipo, responsavel e forma de divisao. Antes de salvar, o usuario pode revisar os dados interpretados.

### Cartoes e faturas

- Cadastro e edicao de cartoes pessoais, do parceiro ou conjuntos.
- Limite total, cor, final do cartao, dia de fechamento e dia de vencimento.
- Calculo do limite utilizado e disponivel.
- Fatura organizada por cartao e mes de competencia.
- Compras feitas no dia de fechamento ou depois sao movidas para a proxima fatura.
- Detalhamento das compras e indicador visual de uso do limite.

### Investimentos

- Carteira consolidada do casal.
- Suporte a acoes, FIIs, criptomoedas e renda fixa.
- Multiplos aportes no mesmo ativo, agrupados por ticker.
- Calculo de quantidade, preco medio, valor investido, patrimonio atual e rentabilidade.
- Historico de aportes com edicao e exclusao.
- Atualizacao automatica de precos a cada cinco minutos.
- Busca de ativos da B3 pela Brapi e de criptomoedas pela CoinGecko.
- Lista de titulos publicos e produtos privados de renda fixa.
- Estimativa de evolucao da renda fixa por taxa personalizada.
- Fallback para o preco medio quando uma API externa estiver indisponivel.

### Metas e sonhos

- Criacao de objetivos financeiros compartilhados.
- Valor alvo, valor ja guardado e prazo opcional.
- Imagem de capa personalizada.
- Barra de progresso e calculo de quanto falta.
- Indicacao de prazo restante ou vencido.
- Aportes em uma meta, registrados tambem como transacoes.
- Edicao e exclusao de metas.

### Relatorios

- Fechamento das despesas conjuntas.
- Calculo de quanto cada pessoa deveria pagar.
- Divisao em 50/50 ou proporcional a renda configurada.
- Indicacao de quem precisa transferir para quem e qual valor.
- Resumo copiavel para compartilhamento.
- Evolucao dos gastos por semana ou mes.
- Taxa estimada de economia.
- Categoria com maior gasto.
- Distribuicao de despesas por categoria.
- Lista dos maiores gastos.

### Configuracoes

- Visualizacao dos perfis do casal.
- Alteracao de nome e avatar.
- Copia do codigo de convite.
- Escolha do modelo de divisao das despesas.
- Percentuais personalizados ou proporcionais as rendas.
- Tema claro e escuro com preferencia salva no navegador.
- Logout.

## Regras de negocio importantes

- Cada usuario pertence a no maximo um casal.
- Um espaco aceita no maximo dois membros.
- O codigo de convite e rotacionado depois que o parceiro entra.
- Os membros visualizam os dados compartilhados do proprio casal.
- Cada lancamento registra o usuario que o criou; as permissoes efetivas devem ser revisadas ao consolidar as migrations antigas e atuais.
- Compras parceladas geram um lancamento para cada parcela.
- A primeira parcela recebe eventuais centavos restantes do arredondamento.
- A competencia da fatura considera o dia de fechamento do cartao.
- Metas, investimentos, cartoes e transacoes sao vinculados ao casal.

## Stack

| Camada | Tecnologias |
| --- | --- |
| Aplicacao | React 19, TypeScript e TanStack Start |
| Rotas e SSR | TanStack Router, Vite e Nitro |
| Dados e cache | TanStack Query e Zustand |
| Interface | Tailwind CSS 4, Radix UI e shadcn/ui |
| Graficos e animacoes | Recharts e Framer Motion |
| Formularios | React Hook Form e Zod |
| Backend | Supabase Auth, Postgres, Storage e Realtime |
| Inteligencia artificial | Google Gemini via Vercel AI SDK |
| Cotacoes | Brapi e CoinGecko |
| Testes | Vitest, Testing Library e jsdom |
| Deploy | Vercel |

## Arquitetura

```text
src/
|-- components/          componentes compartilhados, modais e UI
|-- hooks/               autenticacao, perfis, dados financeiros e mutations
|-- integrations/        clientes, middleware e tipos do Supabase
|-- lib/                 regras financeiras, IA e utilitarios
|-- routes/              paginas e rotas do TanStack Router
|-- services/api/        integracoes com APIs de cotacao
`-- store/               estado do fluxo de onboarding

supabase/
|-- migrations/          schema, funcoes, triggers, buckets e policies RLS
`-- config.toml           configuracao local do projeto Supabase
```

O frontend consulta o Supabase diretamente usando a chave publica. A autorizacao real fica no banco por meio das policies RLS. Operacoes sensiveis do onboarding, como criar um casal ou entrar por convite, usam funcoes Postgres protegidas.

### Modelo de dados

| Tabela | Responsabilidade |
| --- | --- |
| `profiles` | Nome, avatar e vinculo do usuario com o casal |
| `couples` | Espaco compartilhado, convite e configuracoes |
| `transactions` | Entradas, despesas, compras, parcelas e aportes |
| `cards` | Cartoes, limites e datas de fechamento/vencimento |
| `investments` | Aportes e posicoes de investimento |
| `goals` | Metas financeiras compartilhadas |

O Supabase Storage possui buckets para avatares e capas de metas.

## Como executar localmente

### Pre-requisitos

- Node.js 20 ou superior
- npm ou Bun
- Um projeto no Supabase
- Uma chave do Google Gemini para o cadastro por linguagem natural
- Opcionalmente, um token da Brapi

### Instalacao

```bash
git clone <url-do-repositorio>
cd CoupleFinance
npm install
cp .env.example .env
npm run dev
```

No PowerShell, use `Copy-Item .env.example .env` no lugar de `cp`.

A aplicacao sera iniciada pelo Vite; consulte no terminal a URL e a porta selecionadas.

### Variaveis de ambiente

```env
SUPABASE_PROJECT_ID="seu-project-id"
SUPABASE_PUBLISHABLE_KEY="sua-chave-publica"
SUPABASE_URL="https://seu-projeto.supabase.co"

VITE_SUPABASE_PROJECT_ID="seu-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica"
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"

GEMINI_API_KEY="sua-chave-do-gemini"
VITE_BRAPI_TOKEN="seu-token-brapi"
```

`GEMINI_API_KEY` e usada somente no servidor pela funcao que interpreta lancamentos. Nao use o prefixo `VITE_` para essa chave, pois variaveis com esse prefixo podem ser enviadas ao navegador. Nunca publique `.env`, chaves privadas ou a chave `service_role` do Supabase.

### Banco de dados

As migrations em `supabase/migrations` criam as tabelas, funcoes, triggers, buckets e policies do projeto. Aplique-as ao seu projeto Supabase usando a CLI oficial:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Antes de usar o app, confirme que o Auth por e-mail/senha esta habilitado e que todas as migrations foram aplicadas.

## Scripts

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera o build de producao |
| `npm run preview` | Executa uma previa do build |
| `npm run lint` | Executa o ESLint |
| `npm run format` | Formata o projeto com Prettier |
| `npx vitest run` | Executa os testes automatizados |

## Testes existentes

- Validacao do nome durante o cadastro.
- Saudacao sem parceiro vinculado.
- Atualizacao da interface via Realtime quando o parceiro entra.
- Script de ponta a ponta para cadastro de dois usuarios, criacao do espaco e entrada por convite.

O script `e2e-test.js` usa um projeto Supabase real e deve ser revisado/configurado antes da execucao em outro ambiente.

## Status atual e limitacoes

Funcionalidades principais de cadastro, espaco do casal, lancamentos, cartoes, investimentos, metas e relatorios ja estao implementadas. Alguns pontos ainda representam estado de interface e nao um historico financeiro persistente:

- **Pagar fatura** exibe confirmacao, mas ainda nao grava um pagamento ou fechamento no banco.
- **Marcar acerto como resolvido** dura apenas durante a sessao da pagina.
- Os relatorios sao calculados no cliente a partir das transacoes carregadas.
- Ainda nao existe exportacao CSV/PDF, orcamento mensal por categoria ou exclusao de conta pela interface.
- Alguns filtros e nomes padrao ainda usam dados fixos do casal original e precisam ser generalizados.
- A cobertura automatizada ainda e pequena para regras financeiras criticas.

## Seguranca

- RLS esta habilitado nas tabelas financeiras.
- As tabelas financeiras usam policies baseadas no casal autenticado.
- Funcoes de convite e criacao do espaco exigem autenticacao.
- A chave publica do Supabase pode ficar no cliente; `service_role` nunca deve ser exposta.
- Dados financeiros exigem revisao continua das migrations e policies antes de producao.
- As migrations acumulam policies de fases diferentes do projeto; recomenda-se uma auditoria e consolidacao antes de uma liberacao publica.
- O projeto nao deve registrar tokens, senhas ou dados financeiros sensiveis em logs.

## Deploy

O projeto esta preparado para deploy na Vercel com Nitro:

1. Importe o repositorio na Vercel.
2. Cadastre as variaveis de ambiente do `.env.example`.
3. Use `npm run build` como comando de build.
4. Aponte o frontend para o projeto Supabase que recebeu as migrations.

## Roadmap sugerido

- Persistir pagamentos de fatura e fechamentos mensais.
- Generalizar nomes, responsaveis e regras para qualquer casal.
- Adicionar orcamentos por categoria.
- Exportar dados em CSV e PDF.
- Ampliar testes de parcelamento, faturas, metas, investimentos e RLS.
- Criar historico de acertos entre o casal.
- Melhorar observabilidade, acessibilidade e tratamento de falhas das APIs externas.

## Aviso

O CoupleDin e uma ferramenta de organizacao financeira. Cotacoes e calculos exibidos podem depender de APIs externas e nao constituem recomendacao de investimento.
