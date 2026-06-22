export const TRANSACTION_TYPES = ["Entrada", "Débito", "Crédito"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export function normalizeTransactionType(type: string, cardId?: string | null): TransactionType {
  if (type === "Entrada" || type === "INCOME") return "Entrada";
  if (type === "Crédito" || (cardId && ["Saída", "EXPENSE", "expense"].includes(type))) {
    return "Crédito";
  }
  return "Débito";
}

export function isIncomeType(type: string, amount = 0) {
  return normalizeTransactionType(type) === "Entrada" || amount > 0;
}

export function isExpenseType(type: string, amount = 0) {
  return normalizeTransactionType(type) !== "Entrada" || amount < 0;
}

