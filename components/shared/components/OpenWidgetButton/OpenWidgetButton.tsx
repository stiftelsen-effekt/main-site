import { useContext } from "react";
import { WidgetContext } from "../../../main/layout/layout";
import { EffektButton, EffektButtonVariant } from "../EffektButton/EffektButton";
import { ctaButtonStyleOverrides } from "../../../main/layout/PageHeader/PageHeader";
import { usePlausible } from "next-plausible";

export const OpenWidgetButton: React.FC<{
  label?: string;
  accent_color?: string;
  cy?: string;
  causeAreaId?: number;
  organizationId?: number;
}> = ({ label, accent_color, cy, causeAreaId, organizationId }) => {
  const [, setWidgetContext] = useContext(WidgetContext);
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
        setWidgetContext({
          open: true,
          prefilled:
            causeAreaId === undefined
              ? null
              : [
                  {
                    causeAreaId,
                    share: 100,
                    organizations:
                      organizationId === undefined ? [] : [{ organizationId, share: 100 }],
                  },
                ],
          prefilledSum: null,
        });
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
