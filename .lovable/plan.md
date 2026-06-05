## Objetivo
Transformar a descrição em linguagem natural digitada no Smart Input em uma transação estruturada (data, descrição, categoria, valor, tipo, responsável, divisão) usando IA, e adicioná-la automaticamente à lista de Lançamentos.

## Arquitetura

```text
[Textarea] -> useMutation -> serverFn parseTransaction
                                  |
                                  v
                          Lovable AI Gateway
                          (google/gemini-3-flash-preview)
                          structured output (Zod schema)
                                  |
                                  v
                          { date, description, category,
                            amount, type, responsible, division }
                                  |
                                  v
                          Inserida no topo da tabela (estado local)
```

Sem banco de dados nesta etapa — as transações ficam em estado React (Zustand-like via `useState` no nível de `/transacoes` ou um simples store em memória). Persistência fica para uma próxima iteração.

## Etapas

1. **Habilitar Lovable Cloud** para provisionar `LOVABLE_API_KEY` no servidor.
2. **Criar helper do AI Gateway** em `src/lib/ai-gateway.server.ts` (provider OpenAI-compatible apontando para `ai.gateway.lovable.dev/v1`).
3. **Criar server function** `src/lib/transactions.functions.ts` com `parseTransactionFromText`:
   - Input: `{ text: string }` validado com Zod.
   - Usa `generateText` + `Output.object` com schema Zod dos campos da transação.
   - Categorias e tipos restritos a enums (Alimentação, Lazer, Transporte, Moradia, Renda, Outros / Crédito, Débito, Entrada / Felipe, Beatriz / Conjunta 50/50, Proporcional, Individual).
   - Prompt do sistema em português, com a data atual e padrões (ex: se mencionar "cartão de crédito" → tipo Crédito).
   - Retorna o objeto estruturado; trata 429/402 com mensagens claras.
4. **Atualizar `src/routes/transacoes.tsx`**:
   - Migrar as transações para `useState` inicializado com os mocks atuais.
   - No clique de "Processar": chamar `useServerFn(parseTransactionFromText)` via `useMutation`.
   - Estado de loading no botão (ícone Sparkles girando, disabled).
   - Em sucesso: prepend a transação na lista, limpar textarea, mostrar toast (`sonner`).
   - Em erro: toast de erro com a mensagem do servidor.
5. **Mapear ícone** da categoria retornada para o `lucide-react` correspondente (helper local).

## Detalhes técnicos

- Modelo: `google/gemini-3-flash-preview` (padrão Lovable AI).
- Schema enxuto para evitar limite de estados do Gemini: enums curtos, sem `format`/`pattern`.
- `responsible` default = "Felipe" caso o modelo não consiga inferir; `division` default = "Conjunta 50/50".
- `amount` sempre positivo no schema; o sinal vem do `type` (Entrada → positivo, Crédito/Débito → negativo) ao montar a linha.
- `date`: o modelo retorna `YYYY-MM-DD`; formatamos para `DD MMM, YYYY` no client.
- Avatar do responsável reaproveita os URLs `dicebear` já usados.
- Botão "Adicionar Manualmente" continua mockado nesta etapa (sem formulário ainda).

## Fora de escopo (próximas etapas)
- Persistência em banco (tabela `transactions` + RLS).
- Formulário manual real.
- Filtros funcionais (hoje seguem mockados).
- Autenticação / múltiplos casais.
