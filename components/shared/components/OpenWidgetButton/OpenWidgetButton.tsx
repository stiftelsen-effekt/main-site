import { useContext } from "react";
import { WidgetContext } from "../../../main/layout/layout";
import { EffektButton, EffektButtonVariant } from "../EffektButton/EffektButton";
import { ctaButtonStyleOverrides } from "../../../main/layout/PageHeader/PageHeader";
import { usePlausible } from "next-plausible";

export const OpenWidgetButton: React.FC<{ label?: string; accent_color?: string; cy?: string }> = ({
  label,
  accent_color,
  cy,
}) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const plausible = usePlausible();

  let giveButtonStyle = {};
  if (accent_color) {
    giveButtonStyle = {
      "--accent-color": accent_color,
    } as React.CSSProperties;
  }

  return (
    <EffektButton
      cy={cy}
      variant={accent_color ? EffektButtonVariant.ACCENT : EffektButtonVariant.PRIMARY}
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
