import { PortableText } from "@portabletext/react";
import { MonthlyDonationsPerOutputResult, Outputs } from "../Graphs/Results/Outputs/Outputs";
import styles from "./ResultsOutput.module.scss";
import { thousandize } from "../../../../util/formatting";

export const ResultsOutput: React.FC<{
  graphData: MonthlyDonationsPerOutputResult;
  description: any[];
}> = ({ graphData, description }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.inner}>
          <h2 className={styles.outputNumber}>
            {thousandize(Math.round(graphData.total.numberOfOutputs))}
          </h2>
          <span className={styles.outputName}>{graphData.output}</span>
          <PortableText value={description} />
        </div>
      </div>
      <Outputs monthlyDonationsPerOutput={graphData}></Outputs>
    </div>
  );
};
