// ─────────────────────────────────────────────────────────────
// Asset Search Service
// Routes searches to Brapi (stocks/FIIs), CoinGecko (crypto),
// or a local static list (fixed income).
// ─────────────────────────────────────────────────────────────

export interface AssetSearchResult {
  /** Value stored in the form (ticker symbol or id) */
  value: string;
  /** Human-readable label shown in the dropdown */
  label: string;
  /** Optional secondary text (exchange, full name, etc.) */
  subtitle?: string;
}

// ── Static fixed-income list ─────────────────────────────────
const FIXED_INCOME_PUBLIC: AssetSearchResult[] = [
  { value: "SELIC2026", label: "Tesouro Selic 2026", subtitle: "Pós-fixado · Selic" },
  { value: "SELIC2029", label: "Tesouro Selic 2029", subtitle: "Pós-fixado · Selic" },
  { value: "IPCA2029", label: "Tesouro IPCA+ 2029", subtitle: "Híbrido · IPCA + taxa" },
  { value: "IPCA2035", label: "Tesouro IPCA+ 2035", subtitle: "Híbrido · IPCA + taxa" },
  { value: "IPCA2045", label: "Tesouro IPCA+ c/ Juros 2045", subtitle: "Híbrido · Juros semestrais" },
  { value: "PREFIXADO2027", label: "Tesouro Prefixado 2027", subtitle: "Prefixado" },
  { value: "PREFIXADO2031", label: "Tesouro Prefixado 2031", subtitle: "Prefixado · Juros semestrais" },
  { value: "RENDA+2030", label: "Tesouro Renda+ 2030", subtitle: "Aposentadoria complementar" },
  { value: "EDUCA+2030", label: "Tesouro Educa+ 2030", subtitle: "Educação" },
];

const FIXED_INCOME_PRIVATE: AssetSearchResult[] = [
  { value: "CDB_PRE", label: "CDB Prefixado", subtitle: "Banco · Taxa fixa" },
  { value: "CDB_CDI", label: "CDB Pós-fixado (CDI)", subtitle: "Banco · % do CDI" },
  { value: "CDB_IPCA", label: "CDB IPCA+", subtitle: "Banco · IPCA + spread" },
  { value: "LCI", label: "LCI", subtitle: "Letra de Crédito Imobiliário · Isenta de IR" },
  { value: "LCA", label: "LCA", subtitle: "Letra de Crédito do Agronegócio · Isenta de IR" },
  { value: "LC", label: "LC (Letra de Câmbio)", subtitle: "Financeira · Renda fixa" },
  { value: "DEBENTURE", label: "Debênture", subtitle: "Empresa · Crédito privado" },
  { value: "CRI", label: "CRI", subtitle: "Certificado de Recebíveis Imobiliários" },
  { value: "CRA", label: "CRA", subtitle: "Certificado de Recebíveis do Agronegócio" },
];

export function searchFixedIncome(
  query: string,
  subType: "PUBLIC" | "PRIVATE"
): AssetSearchResult[] {
  const list = subType === "PUBLIC" ? FIXED_INCOME_PUBLIC : FIXED_INCOME_PRIVATE;
  if (!query) return list;
  const q = query.toLowerCase();
  return list.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.value.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q)
  );
}

// ── Brapi (Stocks & FIIs) ────────────────────────────────────
// We pre-fetch the full available list once and filter locally.
// This avoids per-keystroke requests and is immune to rate limits.

let brapiCache: AssetSearchResult[] | null = null;
let brapiFetchPromise: Promise<AssetSearchResult[]> | null = null;

async function fetchBrapiList(): Promise<AssetSearchResult[]> {
  if (brapiCache) return brapiCache;
  if (brapiFetchPromise) return brapiFetchPromise;

  brapiFetchPromise = (async () => {
    try {
      const res = await fetch("https://brapi.dev/api/available");
      if (!res.ok) throw new Error(`Brapi ${res.status}`);
      const json = await res.json();
      // The API returns { stocks: ["PETR4", "VALE3", …] }
      const tickers: string[] = json.stocks || [];
      brapiCache = tickers.map((t) => ({
        value: t,
        label: t,
        subtitle: "B3",
      }));
      return brapiCache;
    } catch (err) {
      console.warn("[asset-search] Brapi fetch failed, falling back to empty list", err);
      brapiFetchPromise = null; // allow retry
      return [];
    }
  })();

  return brapiFetchPromise;
}

export async function searchBrapi(query: string): Promise<AssetSearchResult[]> {
  const list = await fetchBrapiList();
  if (!query) return list.slice(0, 30); // show top 30 by default
  const q = query.toUpperCase();
  return list.filter((item) => item.value.includes(q)).slice(0, 30);
}

// ── CoinGecko (Crypto) ──────────────────────────────────────
// Uses the public /search endpoint with the debounced query.

export async function searchCoinGecko(query: string): Promise<AssetSearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const json = await res.json();
    const coins: { id: string; symbol: string; name: string; market_cap_rank: number | null }[] =
      json.coins || [];

    return coins.slice(0, 20).map((c) => ({
      value: c.id,
      label: `${c.symbol.toUpperCase()}`,
      subtitle: c.name,
    }));
  } catch (err) {
    console.warn("[asset-search] CoinGecko search failed", err);
    return [];
  }
}
