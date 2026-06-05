import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  text: z.string().min(3).max(500),
});

const TransactionSchema = z.object({
  date: z.string().describe("Data no formato YYYY-MM-DD"),
  description: z.string().describe("Descrição curta e clara do gasto/entrada"),
  category: z.enum([
    "Alimentação",
    "Lazer",
    "Transporte",
    "Moradia",
    "Saúde",
    "Renda",
    "Outros",
  ]),
  amount: z.number().describe("Valor absoluto positivo em reais"),
  type: z.enum(["Crédito", "Débito", "Entrada"]),
  responsible: z.enum(["Felipe", "Beatriz"]),
  division: z.enum(["Conjunta 50/50", "Proporcional", "Individual"]),
});

export type ParsedTransaction = z.infer<typeof TransactionSchema>;

export const parseTransactionFromText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<ParsedTransaction> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");

    const today = new Date().toISOString().slice(0, 10);
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-3-flash-preview"),
        schema: TransactionSchema,
        system: `Você é um assistente financeiro de um casal (Felipe e Beatriz). Hoje é ${today}.
Extraia os campos de uma transação a partir da descrição em português.
Regras:
- "cartão de crédito" ou "no crédito" → type "Crédito"
- "débito", "pix", "dinheiro" ou "no débito" → type "Débito"
- "recebi", "salário", "freela", "rendimento" → type "Entrada"
- Se não disser quem pagou, assuma "Felipe"
- Padrão de divisão é "Conjunta 50/50"; use "Individual" se for claramente pessoal; "Proporcional" se mencionado
- date: se disser "hoje" use ${today}; "ontem" subtraia 1 dia; senão use ${today}
- amount sempre positivo`,
        prompt: data.text,
      });

      return object;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) {
        throw new Error("Limite de requisições atingido. Tente novamente em instantes.");
      }
      if (msg.includes("402")) {
        throw new Error("Créditos de IA esgotados. Adicione créditos no workspace.");
      }
      throw new Error(`Falha ao processar: ${msg}`);
    }
  });
