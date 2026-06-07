import { c as create } from "../_libs/zustand.mjs";
var OnboardingStep = /* @__PURE__ */ ((OnboardingStep2) => {
  OnboardingStep2["IDLE"] = "IDLE";
  OnboardingStep2["VALIDATING"] = "VALIDATING";
  OnboardingStep2["CREATING_SPACE"] = "CREATING_SPACE";
  OnboardingStep2["CONNECTING_REALTIME"] = "CONNECTING_REALTIME";
  OnboardingStep2["MOUNTING_DASHBOARD"] = "MOUNTING_DASHBOARD";
  OnboardingStep2["SUCCESS"] = "SUCCESS";
  OnboardingStep2["ERROR"] = "ERROR";
  return OnboardingStep2;
})(OnboardingStep || {});
const stepMessages = {
  [
    "IDLE"
    /* IDLE */
  ]: "",
  [
    "VALIDATING"
    /* VALIDATING */
  ]: "Verificando convite...",
  [
    "CREATING_SPACE"
    /* CREATING_SPACE */
  ]: "Criando seu espaço...",
  [
    "CONNECTING_REALTIME"
    /* CONNECTING_REALTIME */
  ]: "Conectando ao banco de dados...",
  [
    "MOUNTING_DASHBOARD"
    /* MOUNTING_DASHBOARD */
  ]: "Preparando seu Dashboard...",
  [
    "SUCCESS"
    /* SUCCESS */
  ]: "Tudo pronto!",
  [
    "ERROR"
    /* ERROR */
  ]: "Ops, algo deu errado."
};
const useSpaceOnboardingStore = create((set) => ({
  step: "IDLE",
  message: "",
  error: null,
  setStep: (step, message) => set((state) => ({
    step,
    message: message || stepMessages[step] || "",
    error: step === "ERROR" ? state.error : null
  })),
  setError: (error) => set({ step: "ERROR", error }),
  reset: () => set({ step: "IDLE", message: "", error: null })
}));
export {
  OnboardingStep as O,
  useSpaceOnboardingStore as u
};
