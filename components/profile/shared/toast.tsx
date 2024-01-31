import { Check, AlertCircle, Info } from "react-feather";
import { toast } from "react-toastify";

export const successToast = (message = "Lagret") =>
  toast.success(message, { icon: <Check size={24} color={"black"} /> });

export const failureToast = (message = "Noe gikk galt") =>
  toast.error(message, {
    icon: <AlertCircle size={24} color={"black"} />,
  });

export const noChangesToast = (message = "Ingen endringer") =>
  toast.error(message, {
    icon: <Info size={24} color={"black"} />,
  });

export const invalidInputToast = (message: "Ugyldig data inntastet") =>
  toast.error(message, {
    icon: <AlertCircle size={24} color={"black"} />,
  });
