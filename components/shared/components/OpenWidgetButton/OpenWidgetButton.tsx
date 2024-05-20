import { useContext } from "react";
import { WidgetContext } from "../../../main/layout/layout";
import { EffektButton } from "../EffektButton/EffektButton";
import { ctaButtonStyleOverrides } from "../../../main/layout/PageHeader/PageHeader";
import { usePlausible } from "next-plausible";

export const OpenWidgetButton: React.FC<{ label?: string; accent_color?: string }> = ({
  label,
  accent_color,
}) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const plausible = usePlausible();

  let giveButtonStyle = {};
  if (accent_color) {
    giveButtonStyle = {
      backgroundColor: accent_color,
      color: "white",
      border: `1px solid ${accent_color} !important`,
      borderColor: accent_color,
    };
  }

  return (
    <EffektButton
      onClick={() => {
        setWidgetContext({ ...widgetContext, open: true });
        plausible("OpenDonationWidget", {
          props: {
            page: window.location.pathname,
          },
        });
        plausible("OpenDonationWidgetHeroCTA", {
          props: {
            page: window.location.pathname,
          },
        });
      }}
      style={{
        ...ctaButtonStyleOverrides,
        ...giveButtonStyle,
      }}
    >
      {label}
    </EffektButton>
  );
};
