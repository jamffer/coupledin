import { parseISO, format, addMonths, setDate, isAfter, isSameDay } from "date-fns";

/**
 * Calcula a data efetiva (mês de cobrança) da fatura de um cartão de crédito.
 * 
 * Regra: Se a data da compra for maior ou igual ao dia de fechamento (closingDay),
 * a despesa rola para a fatura do mês seguinte.
 * 
 * A data retornada será sempre o primeiro dia do mês de competência da fatura (YYYY-MM-01).
 * 
 * @param purchaseDate Data da compra no formato YYYY-MM-DD ou ISO
 * @param closingDay O melhor dia de compra / dia de fechamento do cartão (1 a 31)
 * @returns Data da fatura no formato YYYY-MM-01
 */
export function calculateBillingMonth(purchaseDate: string | null | undefined, closingDay: number): string {
  if (!purchaseDate) return format(setDate(new Date(), 1), "yyyy-MM-01");
  const date = typeof purchaseDate === "string" ? parseISO(purchaseDate) : purchaseDate;
  
  // Normalizar a data de fechamento para o mesmo mês/ano da data da compra
  // Cuidado: se closingDay for 31 e o mês tiver 30 dias, o date-fns lida com isso (vira pro dia 1 ou 2 do prox mes)
  // Mas vamos assumir que o usuário digita algo coerente, ou podemos fixar no maximo do mês.
  
  // Para comparar apenas os dias de forma segura:
  const purchaseDay = date.getDate();
  
  let billingMonthDate = date;

  // Se o dia da compra for >= dia de fechamento, rola pro próximo mês
  if (purchaseDay >= closingDay) {
    billingMonthDate = addMonths(billingMonthDate, 1);
  }

  // Normaliza para o dia 1 do mês calculado
  const resultDate = setDate(billingMonthDate, 1);
  
  return format(resultDate, "yyyy-MM-01");
}
