import Footer from "../../shared/layout/Footer/Footer";
import { Widget } from "../../shared/components/Widget/components/Widget";
import { getClient } from "../../../lib/sanity.client";
import { token } from "../../../token";
import { ConsentState } from "../../../proxy.page";
import type { MissingNameModalConfig } from "./MissingNameModal/MissingNameModal";

// Kept apart from the layout component so _app can fetch these props without
// pulling the Min side layout (and Auth0) into every page's client bundle.

type QueryResult = {
  data: {
    site_title: string;
    main_locale: string | null;
    login_error_configuration: {
      login_abort_label: string;
      login_button_label: string;
    };
    general_banner?: any;
    missing_name_modal_config?: MissingNameModalConfig;
  };
};

export const profileQuery = `
  {
    "data": {
      "site_title": *[_type == "site_settings"][0].title,
      "main_locale": *[_type == "site_settings"][0].main_locale,
      "general_banner": *[_type == "site_settings"][0].general_banner->,
      "login_error_configuration": *[_id == "dashboard"][0].login_error_configuration,
      "missing_name_modal_config": *[_id == "dashboard"][0].missing_name_modal_configuration
    }
  }
`;

export const getProfileLayoutStaticProps = async ({
  draftMode = false,
  consentState,
}: {
  draftMode: boolean;
  consentState: ConsentState;
}) => {
  const result = await getClient(draftMode ? token : undefined).fetch<QueryResult>(profileQuery);

  return {
    footerData: await Footer.getStaticProps({ draftMode }),
    widgetData: await Widget.getStaticProps({ draftMode }),
    profileData: result.data,
    consentState,
    draftMode,
  };
};
