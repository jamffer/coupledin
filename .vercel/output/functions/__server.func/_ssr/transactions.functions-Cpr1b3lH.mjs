import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-D2QuztD3.mjs";
import { g as generateText } from "../_libs/ai.mjs";
import { c as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-aY7aY0n6.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, c as string, _ as _enum, n as number } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/@vercel/oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createLovableAiGatewayProvider(lovableApiKey) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk"
    }
  });
}
const InputSchema = object({
  text: string().min(3).max(500)
});
const TransactionSchema = object({
  date: string().describe("Data no formato YYYY-MM-DD"),
  description: string().describe("Descrição curta e clara do gasto/entrada"),
  category: _enum(["Alimentação", "Lazer", "Transporte", "Moradia", "Saúde", "Renda", "Outros"]),
  amount: number().describe("Valor absoluto positivo em reais"),
  type: _enum(["Crédito", "Débito", "Entrada"]),
  responsible: _enum(["Jorge", "Lilian"]),
  division: _enum(["Conjunta 50/50", "Proporcional", "Individual"])
});
const parseTransactionFromText_createServerFn_handler = createServerRpc({
  id: "ff0ad7c6eed40bcfc0fa108fa7a794fdd29fbdeedb9161f153630792ad349914",
  name: "parseTransactionFromText",
  filename: "src/lib/transactions.functions.ts"
}, (opts) => parseTransactionFromText.__executeServer(opts));
const parseTransactionFromText = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => InputSchema.parse(input)).handler(parseTransactionFromText_createServerFn_handler, async ({
  data
}) => {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY não configurada");
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const gateway = createLovableAiGatewayProvider(key);
  try {
    const {
      text
    } = await generateText({
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
      prompt: data.text
    });
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
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
export {
  parseTransactionFromText_createServerFn_handler
};
