import React from "react";
import Carousel from "../../../main/widget/components/Carousel";
import { FirstPane } from "./panes/FirstPane/FirstPane";
import { ResultPane } from "./panes/ResultPane/ResultPane";

export const FacebookTaxWidget: React.FC = () => {
  return (
    <div id="center-widget">
      <div id="widget">
        <Carousel minHeight={600}>
          <FirstPane />
          <ResultPane />
        </Carousel>
      </div>
    </div>
  );
};
