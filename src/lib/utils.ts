import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return Number(digits) / 100;
}
