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
  Split
} from "lucide-react";

export type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
  responsible: "Jorge" | "Lilian";
  division: "Conjunta 50/50" | "Proporcional" | "Individual";
};

type FinanceStore = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  incomeJorge: number;
  incomeLilian: number;
  setIncomes: (jorge: number, lilian: number) => void;
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: [
        {
          id: 1,
          date: "05 Jun, 2024",
          description: "Supermercado Pão de Açúcar",
          category: "Alimentação",
          amount: -350.20,
          type: "Débito",
          responsible: "Jorge",
          division: "Conjunta 50/50",
        },
        {
          id: 2,
          date: "05 Jun, 2024",
          description: "Assinatura Netflix",
          category: "Lazer",
          amount: -55.90,
          type: "Crédito",
          responsible: "Lilian",
          division: "Proporcional",
        },
        {
          id: 3,
          date: "04 Jun, 2024",
          description: "Salário Empresa X",
          category: "Renda",
          amount: 5200.00,
          type: "Entrada",
          responsible: "Lilian",
          division: "Individual",
        },
      ],
      incomeJorge: 6000,
      incomeLilian: 4000,
      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      setIncomes: (jorge, lilian) => set({ incomeJorge: jorge, incomeLilian: lilian }),
    }),
    {
      name: "finance-storage",
    }
  )
);

export const CATEGORY_ICONS: Record<string, any> = {
  "Alimentação": ShoppingBag,
  "Lazer": Coffee,
  "Transporte": Car,
  "Moradia": Home,
  "Saúde": Heart,
  "Renda": TrendingUp,
  "Outros": HelpCircle,
};

export const DIVISION_ICONS: Record<string, any> = {
  "Conjunta 50/50": Users,
  "Proporcional": Split,
  "Individual": User,
};

export const AVATARS: Record<string, string> = {
  Jorge: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  Lilian: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
};