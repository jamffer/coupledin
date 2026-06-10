import { b as parseISO, c as addMonths, d as setDate, f as format } from "../_libs/date-fns.mjs";
function calculateBillingMonth(purchaseDate, closingDay) {
  const date = typeof purchaseDate === "string" ? parseISO(purchaseDate) : purchaseDate;
  const purchaseDay = date.getDate();
  let billingMonthDate = date;
  if (purchaseDay >= closingDay) {
    billingMonthDate = addMonths(billingMonthDate, 1);
  }
  const resultDate = setDate(billingMonthDate, 1);
  return format(resultDate, "yyyy-MM-01");
}
export {
  calculateBillingMonth as c
};
