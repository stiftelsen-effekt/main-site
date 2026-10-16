import { RecurringDonation } from "../../../shared/components/Widget/types/Enums";
import { PaymentMethodString } from "./hooks/useFundraiserForm";

export const fundraiserSubmitButtonText = (
  paymentMethod: PaymentMethodString,
  recurring: RecurringDonation = RecurringDonation.NON_RECURRING,
): string => {
  switch (paymentMethod) {
    case "bank":
      // Monthly bank donations are set up as AvtaleGiro
      return recurring === RecurringDonation.RECURRING ? "Gi med AvtaleGiro" : "Gi med bank";
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
