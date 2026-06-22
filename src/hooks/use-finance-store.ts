import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Heart,
  TrendingUp,
  HelpCircle,
  User,
  Users,
  Split,
  type LucideIcon,
} from "lucide-react";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
  responsible: string;
  division: string;
  user_id: string;
  couple_id: string;
  card_id?: string | null;
  billing_date?: string | null;
  notes?: string | null;
  responsible_id?: string | null;
  is_recurring?: boolean;
  recurrence_rule?: string | null;
  recurrence_day?: number | null;
  recurrence_status?: string;
  recurrence_parent_id?: string | null;
  generated_for_month?: string | null;
  profiles?: {
    display_name: string;
    avatar_url: string;
  };
};

type FinanceStore = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (txs: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  incomeUser: number;
  incomePartner: number;
  setIncomes: (userIncome: number, partnerIncome: number) => void;
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: [],
      incomeUser: 0,
      incomePartner: 0,

      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      updateTransaction: (id, updatedTx) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updatedTx } : tx,
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
      setTransactions: (transactions) =>
        set((state) => ({
          transactions:
            typeof transactions === "function" ? transactions(state.transactions) : transactions,
        })),
      setIncomes: (incomeUser, incomePartner) => set({ incomeUser, incomePartner }),
    }),
    {
      name: "finance-storage",
      partialize: (state) => ({
        incomeUser: state.incomeUser,
        incomePartner: state.incomePartner,
      }),
    },
  ),
);

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Alimentação: ShoppingBag,
  Lazer: Coffee,
  Transporte: Car,
  Moradia: Home,
  Saúde: Heart,
  Salário: TrendingUp,
  Renda: TrendingUp,
  "Renda extra": TrendingUp,
  Freelance: TrendingUp,
  Vendas: ShoppingBag,
  Reembolso: TrendingUp,
  "Presente recebido": Heart,
  Rendimentos: TrendingUp,
  "Aluguel recebido": Home,
  Bônus: TrendingUp,
  Outros: HelpCircle,
  "Outros ganhos": HelpCircle,
};

export const DIVISION_ICONS: Record<string, LucideIcon> = {
  "Conjunta 50/50": Users,
  Proporcional: Split,
  Individual: User,
};

// Removendo AVATARS estáticos para usar os do store dinamicamente
