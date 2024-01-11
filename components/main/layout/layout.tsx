import { groq } from "next-sanity";
import { createContext, useState } from "react";
import { getClient } from "../../../lib/sanity.server";
import { withStaticProps } from "../../../util/withStaticProps";
import { Widget } from "../../shared/components/Widget/components/Widget";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { GiveButton } from "./GiveButton/GiveButton";
import { PreviewBlock } from "./PreviewBlock/PreviewBlock";
import { WidgetPane } from "./WidgetPane/WidgetPane";

export const WidgetContext = createContext<[boolean, any]>([false, () => {}]);
export const CookiesAccepted = createContext<[boolean, any]>([false, () => {}]);

type QueryResult = {
  settings: [
    {
      donate_label_short: string;
    },
  ];
};

const query = groq`
  {
    "settings": *[_type == "site_settings"] {
      donate_label_short,
    }
  }
`;

export const Layout = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<QueryResult>(query);
  const settings = result.settings[0];
  return {
    footerData: await Footer.getStaticProps({ preview }),
    widgetData: await Widget.getStaticProps({ preview }),
    isPreview: preview,
    labels: {
      donate_label_short: settings.donate_label_short,
    },
  };
})(({ children, footerData, widgetData, labels, isPreview }) => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  // Set true as default to prevent flashing on first render
  const [cookiesAccepted, setCookiesAccepted] = useState(true);

  if (widgetOpen && window.innerWidth < 1180) {
    document.body.style.overflow = "hidden";
  } else if (typeof document !== "undefined") {
    document.body.style.overflow = "auto";
  }

  const containerClasses = [styles.container];
  if (!cookiesAccepted) containerClasses.push(styles.containerCookieBanner);

  return (
    <div className={containerClasses.join(" ")}>
      {isPreview && <PreviewBlock />}
      <GiveButton inverted={false} onClick={() => setWidgetOpen(true)}>
        {labels.donate_label_short}
      </GiveButton>
      <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
        <CookiesAccepted.Provider value={[cookiesAccepted, setCookiesAccepted]}>
          <WidgetPane {...widgetData} />
          <main className={styles.main}>{children}</main>
        </CookiesAccepted.Provider>
      </WidgetContext.Provider>
      <Footer {...footerData} />
    </div>
  );
});
