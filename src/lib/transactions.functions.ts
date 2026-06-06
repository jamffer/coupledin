import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
  responsible: z.enum(["Jorge", "Lilian"]),
  division: z.enum(["Conjunta 50/50", "Proporcional", "Individual"]),
});

export type ParsedTransaction = z.infer<typeof TransactionSchema>;

export const parseTransactionFromText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<ParsedTransaction> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");

    const today = new Date().toISOString().slice(0, 10);
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: `Você é um assistente financeiro de um casal (Jorge e Lilian). Hoje é ${today}.
Extraia os campos de uma transação a partir da descrição em português e responda APENAS com um JSON válido (sem markdown, sem texto extra) com este formato exato:
{
  "date": "YYYY-MM-DD",
  "description": "texto curto",
  "category": "Alimentação" | "Lazer" | "Transporte" | "Moradia" | "Saúde" | "Renda" | "Outros",
  "amount": number positivo,
  "type": "Crédito" | "Débito" | "Entrada",
  "responsible": "Jorge" | "Lilian",
  "division": "Conjunta 50/50" | "Proporcional" | "Individual"
}
Regras:
- "cartão de crédito" / "no crédito" → "Crédito"
- "débito" / "pix" / "dinheiro" → "Débito"
- "recebi" / "salário" / "freela" / "rendimento" → "Entrada"
- Se não disser quem pagou, use "Jorge"
- Padrão de divisão: "Conjunta 50/50"; "Individual" se claramente pessoal; "Proporcional" se mencionado
- "hoje" → ${today}; "ontem" → subtraia 1 dia; senão → ${today}`,
        prompt: data.text,
      });

      const cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Resposta da IA sem JSON válido");
      }
      const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
      return TransactionSchema.parse(parsed);
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