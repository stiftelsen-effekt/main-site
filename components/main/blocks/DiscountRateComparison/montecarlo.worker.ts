import { randomTruncSkewNormal } from "./util";
import {
  discountRateSensitivitiesInterventions,
  discountRateSensitivitiesMap,
  getDefaultRunningAverages,
} from "./data";

/**
 * A web worker that runs a monte carlo simulation to compute running averages
 * of cost effectiveness at different discount rates
 */

// New worker code

{
  const MAX_SAMPLES = 1000;
  addEventListener(
    "message",
    (
      e: MessageEvent<{ min: number; max: number; discountRate: { mean: number; stdv: number } }>,
    ) => {
      const { min, max, discountRate } = e.data;
      let drawn = 0;
      const runningAverages = getDefaultRunningAverages();
      while (drawn < MAX_SAMPLES) {
        const sample = randomTruncSkewNormal({
          range: [min, max],
          mean: discountRate.mean,
          stdDev: discountRate.stdv,
          skew: 0,
        });

        // Round to nearest integer
        const roundedSample = Math.round(sample);
        if (roundedSample >= min && roundedSample <= max) {
          discountRateSensitivitiesInterventions.forEach((intervention) => {
            runningAverages[intervention] =
              (runningAverages[intervention] * drawn +
                discountRateSensitivitiesMap[roundedSample][intervention]) /
              (drawn + 1);
          });
          drawn++;
        }
      }
      postMessage({
        runningAverages,
        samples: drawn,
      });
    },
  );
}
