export interface CacheEntry {
  value: number;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

function getCachedPrice(key: string): number | null {
  const cached = localStorage.getItem(`finance_cache_${key}`);
  if (cached) {
    try {
      const entry: CacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.value;
      }
    } catch (e) {
      // Falha ao fazer parse do cache, continua e busca de novo
    }
  }
  return null;
}

function setCachedPrice(key: string, value: number) {
  const entry: CacheEntry = { value, timestamp: Date.now() };
  localStorage.setItem(`finance_cache_${key}`, JSON.stringify(entry));
}

/**
 * Busca a cotação de uma Ação ou FII usando a Brapi
 */
export async function fetchBrapiQuote(ticker: string): Promise<number | null> {
  const cleanTicker = ticker.toUpperCase().trim();
  const cacheKey = `brapi_${cleanTicker}`;
  const cached = getCachedPrice(cacheKey);
  if (cached !== null) return cached;

  const token = import.meta.env.VITE_BRAPI_TOKEN;
  const url = token 
    ? `https://brapi.dev/api/quote/${cleanTicker}?token=${token}`
    : `https://brapi.dev/api/quote/${cleanTicker}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao buscar cotação na Brapi");
    const data = await res.json();
    if (data.results && data.results[0] && data.results[0].regularMarketPrice) {
      const price = data.results[0].regularMarketPrice;
      setCachedPrice(cacheKey, price);
      return price;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar Brapi para ${cleanTicker}:`, error);
    return null;
  }
}

const CRYPTO_DICTIONARY: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'DOGE': 'dogecoin',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'XRP': 'ripple'
};

/**
 * Busca a cotação de uma Criptomoeda usando a CoinGecko
 */
export async function fetchCryptoQuote(tickerId: string): Promise<number | null> {
  const rawTicker = tickerId.toUpperCase().trim();
  const cleanTicker = CRYPTO_DICTIONARY[rawTicker] || tickerId.toLowerCase().trim();
  const cacheKey = `crypto_${cleanTicker}`;
  const cached = getCachedPrice(cacheKey);
  if (cached !== null) return cached;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cleanTicker}&vs_currencies=brl`);
    if (!res.ok) throw new Error("Falha ao buscar preço na CoinGecko");
    const data = await res.json();
    if (data[cleanTicker] && data[cleanTicker].brl) {
      const price = data[cleanTicker].brl;
      setCachedPrice(cacheKey, price);
      return price;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar Crypto para ${cleanTicker}:`, error);
    return null;
  }
}

/**
 * Busca a cotação de Tesouro Direto usando a Brapi
 */
export async function fetchTreasuryQuote(ticker: string): Promise<number | null> {
  const cleanTicker = ticker.trim();
  const cacheKey = `treasury_${cleanTicker}`;
  const cached = getCachedPrice(cacheKey);
  if (cached !== null) return cached;

  const token = import.meta.env.VITE_BRAPI_TOKEN;
  const url = token 
    ? `https://brapi.dev/api/v2/treasury/indicators?symbols=${cleanTicker}&token=${token}`
    : `https://brapi.dev/api/v2/treasury/indicators?symbols=${cleanTicker}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao buscar Tesouro na Brapi");
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    
    // De acordo com o endpoint de treasury, a cotação (valor do título) costuma vir no array de results
    // Ajustaremos para extrair o valor mais atual disponível no response
    if (data.results && data.results[0] && data.results[0].value) {
      const price = data.results[0].value;
      setCachedPrice(cacheKey, price);
      return price;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar Tesouro Direto para ${cleanTicker}:`, error);
    return null;
  }
}

/**
 * Simula rendimento de Renda Fixa (juros compostos mensais)
 * @param averagePrice Preço médio de compra (ou valor unitário)
 * @param quantity Quantidade
 * @param purchaseDate Data da compra (ISO string)
 * @param customRatePercentage Taxa mensal em porcentagem (ex: 1 para 1% a.m.)
 */
export function calculateFixedIncomeCurrentValue(
  averagePrice: number,
  quantity: number,
  purchaseDate: string,
  customRatePercentage: number
): number {
  const start = new Date(purchaseDate);
  const now = new Date();
  const principal = averagePrice * quantity;
  
  if (isNaN(start.getTime())) return principal;

  // Calcula a diferença em meses
  const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  
  if (monthsDiff <= 0) return principal;

  // Juros compostos: M = P * (1 + i)^t
  const rateDecimal = customRatePercentage / 100;
  return principal * Math.pow(1 + rateDecimal, monthsDiff);
}
