import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createGeminiProvider } from "./ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  text: z.string().min(3).max(500),
  userName: z.string().min(1).max(100).optional(),
  partnerName: z.string().min(1).max(100).optional(),
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
  responsible: z.enum(["user", "partner"]),
  division: z.enum(["Conjunta 50/50", "Proporcional", "Individual"]),
});

export type ParsedTransaction = z.infer<typeof TransactionSchema>;

export const parseTransactionFromText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<ParsedTransaction> => {
    const today = new Date().toISOString().slice(0, 10);

    // Cria o provider Gemini — lança erro claro se a chave estiver ausente
    const gemini = createGeminiProvider();

    try {
      const { text } = await generateText({
        // gemini-2.0-flash: modelo rápido, gratuito no tier free do AI Studio
        model: gemini("gemini-2.0-flash"),
        system: `Você é um assistente financeiro de um casal. A pessoa logada se chama ${data.userName || "Usuário"} e o parceiro se chama ${data.partnerName || "Parceiro(a)"}. Hoje é ${today}.
Extraia os campos de uma transação a partir da descrição em português e responda APENAS com um JSON válido (sem markdown, sem texto extra, sem \`\`\`json) com este formato exato:
{
  "date": "YYYY-MM-DD",
  "description": "texto curto",
  "category": "Alimentação" | "Lazer" | "Transporte" | "Moradia" | "Saúde" | "Renda" | "Outros",
  "amount": <número positivo>,
  "type": "Crédito" | "Débito" | "Entrada",
  "responsible": "user" | "partner",
  "division": "Conjunta 50/50" | "Proporcional" | "Individual"
}
Regras:
- "cartão de crédito" / "no crédito" → "Crédito"
- "débito" / "pix" / "dinheiro" / "transferência" → "Débito"
- "recebi" / "salário" / "freela" / "rendimento" → "Entrada"
- Use "user" para a pessoa logada e "partner" para o parceiro. Se não disser quem pagou, use "user"
- Padrão de divisão: "Conjunta 50/50"; "Individual" se claramente pessoal; "Proporcional" se mencionado
- "hoje" → ${today}; "ontem" → ${new Date(Date.now() - 86400000).toISOString().slice(0, 10)}; senão → ${today}
- Retorne SOMENTE o JSON, sem nenhum texto antes ou depois.`,
        prompt: data.text,
      });

      // Extrai e limpa o JSON da resposta (defesa contra markdown ocasional)
      const cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("A IA não retornou um JSON válido. Tente novamente.");
      }

      const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
      return TransactionSchema.parse(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      // Mensagens de erro amigáveis sem expor a chave
      if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
        throw new Error(
          "Limite de requisições da IA atingido. Aguarde alguns segundos e tente novamente."
        );
      }
      if (msg.includes("400") || msg.toLowerCase().includes("api_key")) {
        throw new Error(
          "Chave da API inválida. Verifique a configuração GEMINI_API_KEY no servidor."
        );
      }
      if (msg.includes("503") || msg.toLowerCase().includes("unavailable")) {
        throw new Error(
          "Serviço de IA temporariamente indisponível. Tente novamente em instantes."
        );
      }

      // Erro de validação Zod (JSON veio mas com campos errados)
      if (msg.toLowerCase().includes("invalid") || msg.includes("ZodError")) {
        throw new Error(
          "Não consegui interpretar o lançamento. Tente descrever de forma mais clara."
        );
      }

      throw new Error(`Falha ao processar com IA: ${msg}`);
    }
  });
