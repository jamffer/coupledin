import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Cria e retorna um provider Google Gemini usando o Vercel AI SDK.
 * A chave é lida do ambiente do servidor (process.env.GEMINI_API_KEY).
 */
export function createGeminiProvider() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY não configurada. Adicione-a ao arquivo .env."
    );
  }

  return createGoogleGenerativeAI({ apiKey });
}
