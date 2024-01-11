import AnimateHeight from "react-animate-height";
import { ErrorsWrapper } from "./ErrorTextsContainer.style";
import { DonationErrorTypeNames } from "../../../store/state";
import { ErrorText } from "../../panes/DonationPane/DonationPane";
import { useEffect, useState } from "react";

type ErrorTextMap = { [key in DonationErrorTypeNames]: { visible: boolean; text: string } };
const defaultErrorTextMap: ErrorTextMap = {
  causeAreaSumError: {
    visible: false,
    text: "",
  },
  causeAreaOrganizationsSumError: {
    visible: false,
    text: "",
  },
  causeAreaShareNegativeError: {
    visible: false,
    text: "",
  },
  causeAreaOrganizationsShareNegativeError: {
    visible: false,
    text: "",
  },
  donationSumError: {
    visible: false,
    text: "",
  },
};

export const ErrorTextsContainer: React.FC<{ errorTexts: ErrorText[] }> = ({ errorTexts }) => {
  const [errorTextMap, setErrorTextMap] = useState<ErrorTextMap>(defaultErrorTextMap);

  useEffect(() => {
    const newErrorTextMap = { ...errorTextMap };
    Object.keys(newErrorTextMap).forEach((errorType) => {
      const errorText = errorTexts.find((errorText) => errorText.error.type === errorType);
      const visible = errorText !== undefined;
      if (visible) {
        newErrorTextMap[errorType as DonationErrorTypeNames] = {
          visible: true,
          text: errorText.text,
        };
      } else {
        newErrorTextMap[errorType as DonationErrorTypeNames].visible = false;
      }
    });
    setErrorTextMap(newErrorTextMap);
  }, [errorTexts]);

  return (
    <ErrorsWrapper>
      <div>{/** Only used as a helper for css selectors */}</div>
      {Object.keys(errorTextMap).map((errorType) => {
        const text = errorTextMap[errorType as DonationErrorTypeNames].text;

        return (
          <div key={errorType}>
            <AnimateHeight
              key={errorType}
              height={errorTextMap[errorType as DonationErrorTypeNames].visible ? "auto" : 0}
              duration={200}
              animateOpacity
            >
              <button
                onClick={(e) => {
                  e.currentTarget.blur();
                  /** Scroll to relevant section */
                  const errorElement = document.querySelector(`[data-error=${errorType}]`);
                  if (errorElement) {
                    errorElement.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    });
                  }
                }}
              >
                <span>↑</span>
                <span>{text}</span>
              </button>
            </AnimateHeight>
          </div>
        );
      })}
    </ErrorsWrapper>
  );
};
