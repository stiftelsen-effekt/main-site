import { groq } from "next-sanity";
import { Dispatch, SetStateAction, createContext, useState, useMemo, useEffect } from "react";
import { getClient } from "../../../lib/sanity.client";
import { withStaticProps } from "../../../util/withStaticProps";
import { Widget } from "../../shared/components/Widget/components/Widget";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { GiveButton } from "./GiveButton/GiveButton";
import { PreviewBlock } from "./PreviewBlock/PreviewBlock";
import { PrefilledDistribution, WidgetPane, WidgetPaneProps } from "./WidgetPane/WidgetPane";
import { token } from "../../../token";
import { useLiveQuery } from "@sanity/preview-kit";
import React from "react";
import { stegaClean } from "@sanity/client/stega";
import { ConsentState } from "../../../types/routing";
import CookieBannerWrapper from "../../shared/layout/CookieBanner/CookieBannerWrapper";

export type WidgetContextType = {
  open: boolean;
  prefilled: PrefilledDistribution | null;
  prefilledSum: number | null;
};

export const WidgetContext = createContext<
  [WidgetContextType, Dispatch<SetStateAction<WidgetContextType>>]
>([{ open: false, prefilled: null, prefilledSum: null }, () => {}]);

export type BanerContextType = {
  consentState: ConsentState;
  consentExpired: boolean;
  privacyPolicyLastMajorChange: Date | undefined;
  generalBannerDismissed: boolean;
};

export const BannerContext = createContext<
  [BanerContextType, Dispatch<SetStateAction<BanerContextType>>]
>([
  {
    consentState: "undecided",
    consentExpired: false,
    privacyPolicyLastMajorChange: undefined,
    generalBannerDismissed: false,
  },
  () => {},
]);

type QueryResult = {
  settings: {
    donate_label_short: string;
    donate_label_title: string;
    accent_color: string;
    general_banner?: any;
    cookie_banner_configuration?: any;
  };
};

const query = groq`
  {
    "settings": *[_type == "site_settings"][0] {
      donate_label_short,
      donate_label_title,
      accent_color,
      general_banner,
      cookie_banner_configuration
    }
  }
`;

export const Layout = withStaticProps(
  async ({
    draftMode = false,
    showGiveButton = true,
    consentState,
  }: {
    draftMode: boolean;
    showGiveButton: boolean;
    consentState: ConsentState;
  }) => {
    const result = await getClient(draftMode ? token : undefined).fetch<QueryResult>(query);
    const settings = result.settings;
    return {
      footer: await Footer.getStaticProps({ draftMode }),
      widget: await Widget.getStaticProps({ draftMode }),
      // isPreview: preview,
      giveButton: {
        donate_label_short: settings.donate_label_short,
        donate_label_title: settings.donate_label_title,
        accent_color: stegaClean(settings.accent_color),
      },
      general_banner: settings.general_banner,
      cookie_banner_configuration: settings.cookie_banner_configuration,
      showGiveButton: showGiveButton,
      draftMode,
      consentState,
    };
  },
)(
  ({
    children,
    footer,
    widget,
    giveButton,
    general_banner,
    cookie_banner_configuration,
    consentState,
    showGiveButton,
    draftMode,
  }) => {
    const [widgetContext, setWidgetContext] = useState<WidgetContextType>({
      open: false,
      prefilled: null,
      prefilledSum: null,
    });
    const widgetContextValue = useMemo<
      [WidgetContextType, Dispatch<SetStateAction<WidgetContextType>>]
    >(() => [widgetContext, setWidgetContext], [widgetContext]);

    const [banners, setBanners] = useState<BanerContextType>({
      consentState,
      consentExpired: false,
      privacyPolicyLastMajorChange: undefined,
      generalBannerDismissed: false,
    });

    if (widgetContext.open && window.innerWidth < 1180) {
      document.body.style.overflow = "hidden";
    } else if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return (
      <div className={styles.container}>
        {draftMode && <PreviewBlock />}
        {showGiveButton && (
          <GiveButton
            inverted={false}
            color={giveButton.accent_color}
            title={giveButton.donate_label_title}
            onClick={() => setWidgetContext({ open: true, prefilled: null, prefilledSum: null })}
          >
            {giveButton.donate_label_short}
          </GiveButton>
        )}
        <WidgetContext.Provider value={widgetContextValue}>
          <BannerContext.Provider value={[banners, setBanners]}>
            <CookieBannerWrapper cookieBannerConfig={cookie_banner_configuration} />
            {draftMode ? (
              <PreviewWidgetPane
                {...widget}
                prefilled={widgetContext.prefilled}
                prefilledSum={widgetContext.prefilledSum}
              />
            ) : (
              <WidgetPane
                {...widget}
                prefilled={widgetContext.prefilled}
                prefilledSum={widgetContext.prefilledSum}
              />
            )}
            <main className={styles.main}>{children}</main>
          </BannerContext.Provider>
        </WidgetContext.Provider>
        {draftMode ? <PreviewFooter {...footer} /> : <Footer {...footer} />}
      </div>
    );
  },
);

const PreviewFooter: React.FC<Awaited<ReturnType<typeof Footer.getStaticProps>>> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query);

  if (result) {
    props.data.result = result;
  }

  return <Footer {...(props as any)} />;
};

const PreviewWidgetPane: React.FC<
  Awaited<ReturnType<typeof Widget.getStaticProps>> & WidgetPaneProps
> = (props) => {
  const [result] = useLiveQuery(props.data.result, props.data.query);

  if (result) {
    props.data.result = result;
  }

  return <WidgetPane {...(props as any)} />;
};
