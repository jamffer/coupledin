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
};

type FinanceStore = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (txs: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  incomeJorge: number;
  incomeLilian: number;
  setIncomes: (jorge: number, lilian: number) => void;
  userNames: { Jorge: string; Lilian: string };
  userAvatars: { Jorge: string; Lilian: string };
  updateUserProfile: (user: "Jorge" | "Lilian", name: string, avatar: string) => void;
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: [],
      incomeJorge: 0,
      incomeLilian: 0,

      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      updateTransaction: (id, updatedTx) => set((state) => ({
        transactions: state.transactions.map((tx) => tx.id === id ? { ...tx, ...updatedTx } : tx)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id)
      })),
      setTransactions: (transactions) => set((state) => ({ 
        transactions: typeof transactions === 'function' ? transactions(state.transactions) : transactions 
      })),
      setIncomes: (jorge, lilian) => set({ incomeJorge: jorge, incomeLilian: lilian }),
      userNames: { Jorge: "Jorge", Lilian: "Lilian" },
      userAvatars: { 
        Jorge: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", 
        Lilian: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" 
      },
      updateUserProfile: (user, name, avatar) => set((state) => ({
        userNames: { ...state.userNames, [user]: name },
        userAvatars: { ...state.userAvatars, [user]: avatar }
      })),
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

// Removendo AVATARS estáticos para usar os do store dinamicamente
export const AVATARS_DEFAULT: Record<string, string> = {
  Jorge: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  Lilian: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
};