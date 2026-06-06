import { create } from 'zustand';

export enum OnboardingStep {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  CREATING_SPACE = 'CREATING_SPACE',
  CONNECTING_REALTIME = 'CONNECTING_REALTIME',
  MOUNTING_DASHBOARD = 'MOUNTING_DASHBOARD',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

interface OnboardingState {
  step: OnboardingStep;
  message: string;
  error: string | null;
  setStep: (step: OnboardingStep, message?: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const stepMessages: Record<OnboardingStep, string> = {
  [OnboardingStep.IDLE]: '',
  [OnboardingStep.VALIDATING]: 'Verificando convite...',
  [OnboardingStep.CREATING_SPACE]: 'Criando seu espaço...',
  [OnboardingStep.CONNECTING_REALTIME]: 'Conectando ao banco de dados...',
  [OnboardingStep.MOUNTING_DASHBOARD]: 'Preparando seu Dashboard...',
  [OnboardingStep.SUCCESS]: 'Tudo pronto!',
  [OnboardingStep.ERROR]: 'Ops, algo deu errado.'
};

export const useSpaceOnboardingStore = create<OnboardingState>((set) => ({
  step: OnboardingStep.IDLE,
  message: '',
  error: null,
  setStep: (step, message) => set((state) => ({ 
    step, 
    message: message || stepMessages[step] || '',
    error: step === OnboardingStep.ERROR ? state.error : null 
  })),
  setError: (error) => set({ step: OnboardingStep.ERROR, error }),
  reset: () => set({ step: OnboardingStep.IDLE, message: '', error: null }),
}));
