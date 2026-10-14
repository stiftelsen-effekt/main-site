import React, { useEffect, useState } from "react";
import { FieldProps, useClient } from "sanity";

/**
 * Field component that only renders the field when the site's main locale (from site settings)
 * is one of the given locales. Field-level `hidden` callbacks can't look up other documents,
 * so this fetches the main locale once and caches it for the session.
 */
let cachedMainLocale: Promise<string | null> | null = null;

export const mainLocaleConditionalField =
  (locales: string[]) =>
  (props: FieldProps): React.ReactElement | null => {
    const client = useClient({ apiVersion: "2023-01-01" });
    const [mainLocale, setMainLocale] = useState<string | null | undefined>(undefined);

    useEffect(() => {
      cachedMainLocale ??= client.fetch<string | null>(
        `*[_type == "site_settings"][0].main_locale`,
      );
      cachedMainLocale.then(setMainLocale, () => setMainLocale(null));
    }, [client]);

    if (!mainLocale || !locales.includes(mainLocale)) return null;
    return props.renderDefault(props);
  };
