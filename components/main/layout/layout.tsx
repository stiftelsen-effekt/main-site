import { groq } from "next-sanity";
import { Dispatch, SetStateAction, createContext, useState, useMemo } from "react";
import { getClient } from "../../../lib/sanity.client";
import { withStaticProps } from "../../../util/withStaticProps";
import { Widget } from "../../shared/components/Widget/components/Widget";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { GiveButton } from "./GiveButton/GiveButton";
import { PreviewBlock } from "./PreviewBlock/PreviewBlock";
import { PrefilledDistribution, WidgetPane, WidgetPaneProps } from "./WidgetPane/WidgetPane";
import { token } from "../../../token";
import { useLiveQuery } from "next-sanity/preview";
import React from "react";

export type WidgetContextType = {
  open: boolean;
  prefilled: PrefilledDistribution | null;
};

export const WidgetContext = createContext<
  [WidgetContextType, Dispatch<SetStateAction<WidgetContextType>>]
>([{ open: false, prefilled: null }, () => {}]);

export type CookiesAcceptedContextType = {
  accepted: boolean | undefined;
  expired: boolean | undefined;
  lastMajorChange: Date | undefined;
  loaded: boolean;
};

export const CookiesAccepted = createContext<
  [CookiesAcceptedContextType, Dispatch<SetStateAction<CookiesAcceptedContextType>>]
>([
  {
    accepted: undefined,
    expired: undefined,
    lastMajorChange: undefined,
    loaded: false,
  },
  () => {},
]);

type QueryResult = {
  settings: [
    {
      donate_label_short: string;
      donate_label_title: string;
      accent_color: string;
    },
  ];
};

const query = groq`
  {
    "settings": *[_type == "site_settings"] {
      donate_label_short,
      donate_label_title,
      accent_color
    }
  }
`;

export const Layout = withStaticProps(async ({ draftMode = false }: { draftMode: boolean }) => {
  const result = await getClient(draftMode ? token : undefined).fetch<QueryResult>(query);
  const settings = result.settings[0];
  return {
    footer: await Footer.getStaticProps({ draftMode }),
    widget: await Widget.getStaticProps({ draftMode }),
    // isPreview: preview,
    giveButton: {
      donate_label_short: settings.donate_label_short,
      donate_label_title: settings.donate_label_title,
      accent_color: settings.accent_color,
    },
    draftMode,
  };
})(({ children, footer, widget, giveButton, draftMode }) => {
  const [widgetContext, setWidgetContext] = useState<WidgetContextType>({
    open: false,
    prefilled: null,
  });
  const widgetContextValue = useMemo<
    [WidgetContextType, Dispatch<SetStateAction<WidgetContextType>>]
  >(() => [widgetContext, setWidgetContext], [widgetContext]);

  const [cookiesAccepted, setCookiesAccepted] = useState<CookiesAcceptedContextType>({
    accepted: undefined,
    expired: undefined,
    lastMajorChange: undefined,
    loaded: false,
  });
  const cookiesAcceptedValue = useMemo<
    [CookiesAcceptedContextType, Dispatch<SetStateAction<CookiesAcceptedContextType>>]
  >(() => [cookiesAccepted, setCookiesAccepted], [cookiesAccepted]);

  if (widgetContext.open && window.innerWidth < 1180) {
    document.body.style.overflow = "hidden";
  } else if (typeof document !== "undefined") {
    document.body.style.overflow = "auto";
  }

  const containerClasses = [styles.container];
  if (cookiesAccepted.loaded && typeof cookiesAccepted.accepted === "undefined") {
    containerClasses.push(styles.containerCookieBanner);
  }

  return (
    <div className={containerClasses.join(" ")}>
      {draftMode && <PreviewBlock />}
      <GiveButton
        inverted={false}
        color={giveButton.accent_color}
        title={giveButton.donate_label_title}
        onClick={() => setWidgetContext({ open: true, prefilled: null })}
      >
        {giveButton.donate_label_short}
      </GiveButton>
      <WidgetContext.Provider value={widgetContextValue}>
        <CookiesAccepted.Provider value={cookiesAcceptedValue}>
          {draftMode ? (
            <PreviewWidgetPane {...widget} prefilled={widgetContext.prefilled} />
          ) : (
            <WidgetPane {...widget} prefilled={widgetContext.prefilled} />
          )}
          <main className={styles.main}>{children}</main>
        </CookiesAccepted.Provider>
      </WidgetContext.Provider>
      {draftMode ? <PreviewFooter {...footer} /> : <Footer {...footer} />}
    </div>
  );
});

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
