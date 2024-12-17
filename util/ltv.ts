import { API_URL } from "../components/shared/components/Widget/config/api";
import { Donation } from "../components/shared/components/Widget/store/state";
import { PaymentMethod } from "../components/shared/components/Widget/types/Enums";

interface LtvEstimate {
  label: string;
  expectedLtv: number;
  median: number | null;
}

interface EstimateResponse {
  content: LtvEstimate[];
}

interface GetEstimatedLtvParams {
  method: PaymentMethod;
  sum: number;
}

export async function getEstimatedLtv({
  method,
  sum,
}: GetEstimatedLtvParams): Promise<number | null> {
  // Only proceed for VIPPS or AVTALEGIRO
  if (method !== PaymentMethod.VIPPS && method !== PaymentMethod.AVTALEGIRO) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/ltv/recentestimate`);
    if (!response.ok) {
      throw new Error("Failed to fetch LTV estimates");
    }

    const estimates: EstimateResponse = await response.json();

    // Find the relevant estimate based on payment method
    const label = method === PaymentMethod.VIPPS ? "Vipps" : "AvtaleGiro";
    const estimate = estimates.content.find((e) => e.label === label);

    if (!estimate) {
      return null;
    }

    let ltv = estimate.expectedLtv;

    // Apply median weighting if both median and donation sum exist
    if (estimate.median) {
      ltv = estimate.expectedLtv * Math.sqrt(sum / estimate.median);
    }

    return ltv;
  } catch (error) {
    console.error("Error fetching LTV estimate:", error);
    return null;
  }
}
