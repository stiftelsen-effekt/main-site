import { PaymentMethodString } from "./hooks/useFundraiserForm";

export const fundraiserSubmitButtonText = (paymentMethod: PaymentMethodString): string => {
  switch (paymentMethod) {
    case "bank":
      return "Gi med bank";
    case "vipps":
      return "Gi med Vipps";
    case "quickpay_card":
      return "Giv med kort";
    case "quickpay_mobilepay":
      return "Giv med MobilePay";
    case "dkbank":
      return "Giv med bank";
    default:
      return "Gi";
  }
};
