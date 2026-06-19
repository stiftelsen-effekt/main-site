import React from "react";
import { AlertCircle } from "react-feather";
import { toast } from "react-toastify";
import { useMainLocale } from "../../context/MainLocaleContext";

const getFailureMessage = (locale: ReturnType<typeof useMainLocale>): string =>
  locale === "dk" ? "Noget gik galt" : locale === "sv" ? "Något gick fel" : "Noe gikk galt";

export const useFailureToast = () => {
  const locale = useMainLocale();

  return (message?: string) =>
    toast.error(message ?? getFailureMessage(locale), {
      icon: <AlertCircle size={24} color={"black"} />,
    });
};

export const useFailureMessage = (): string => {
  const locale = useMainLocale();
  return getFailureMessage(locale);
};
