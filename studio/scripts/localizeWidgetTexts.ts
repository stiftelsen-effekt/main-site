/**
 * Populates the per-platform localized widget copy that the donation widget reads
 * from Sanity, so no user-facing string falls back to a hardcoded English default.
 *
 * Run once per dataset, e.g.:
 *   SANITY_STUDIO_API_PROJECT_ID=vf0df6h3 SANITY_STUDIO_API_DATASET=production \
 *     npx sanity exec scripts/localizeWidgetTexts.ts --with-user-token
 *
 * Only writes fields that are currently missing (null/undefined), unless the field
 * is listed in FORCE_OVERWRITE - so existing hand-authored copy is never clobbered.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

type LocaleKey = "no" | "dk" | "sv";

/** Fields we deliberately replace even when already set (placeholder/untranslated copy). */
const FORCE_OVERWRITE: Record<LocaleKey, string[]> = {
  no: [],
  dk: [],
  // These were left in English in the Swedish dataset.
  sv: ["cause_area_display_config.cause_area_contexts"],
};

const CONTENT: Record<LocaleKey, Record<string, unknown>> = {
  no: {
    "ui_labels.total_label": "Sum",
    "ui_labels.operations_summary_label": "Drift",
    "operations_config.operations_label_template": "hvorav {percentage} % til drift",
    // Declares which cause area *is* operations, so it never gets tipped on top of
    // itself. Inert until the platform actually has a cause area with this ID.
    "operations_config.operations_cause_area_id": 4,
    "cause_area_display_config.below_line_cause_area_ids": [4],
    "cause_area_display_config.cause_area_selection_title": "Hvilket formål vil du støtte?",
    "cause_area_display_config.recommendation_button_text": "Vår anbefaling",
    "cause_area_display_config.multiple_cause_areas_button_text": "Velg flere formål",
    "smart_distribution_context.smart_distribution_title": "Smart fordeling",
    "smart_distribution_context.show_all_organizations_text": "Vis alle",
    referral_code_placeholder: "Kampanjekode",
  },
  dk: {
    "ui_labels.total_label": "Sum",
    "ui_labels.operations_summary_label": "Drift",
    "operations_config.operations_label_template": "heraf {percentage} % til drift",
    // Declares which cause area *is* operations, so it never gets tipped on top of
    // itself. Inert until the platform actually has a cause area with this ID.
    "operations_config.operations_cause_area_id": 4,
    "cause_area_display_config.below_line_cause_area_ids": [4],
    "cause_area_display_config.cause_area_selection_title":
      "Hvilket formål vil du gøre en forskel for?",
    "cause_area_display_config.recommendation_button_text": "Vores anbefaling",
    "cause_area_display_config.multiple_cause_areas_button_text": "Vælg flere formål",
    "smart_distribution_context.smart_distribution_title": "Smart fordeling",
    "smart_distribution_context.show_all_organizations_text": "Vis alle",
    tax_deduction_ssn_suspicious_message: "Kontroller venligst at det er korrekt.",
    referral_code_placeholder: "Kampagnekode",
  },
  sv: {
    "ui_labels.total_label": "Summa",
    "ui_labels.operations_summary_label": "Drift",
    "operations_config.operations_label_template": "varav {percentage} % till drift",
    "operations_config.operations_cause_area_id": 4,
    "cause_area_display_config.cause_area_selection_title":
      "Vilket ändamål vill du göra skillnad för?",
    "cause_area_display_config.recommendation_button_text": "Vår rekommendation",
    "cause_area_display_config.multiple_cause_areas_button_text": "Välj flera ändamål",
    "smart_distribution_context.smart_distribution_title": "Smart fördelning",
    "smart_distribution_context.show_all_organizations_text": "Visa alla",
    referral_code_placeholder: "Kampanjkod",
    // Replaces the previous mix of English placeholders and typo'd Swedish.
    "cause_area_display_config.cause_area_contexts": [
      {
        _key: "ca77ebdc272b",
        cause_area_id: 4,
        context_text:
          "För varje krona till drift förväntar vi oss att samla in minst 10 kronor till ändamålen.",
      },
      {
        _key: "2e6b10e58501",
        cause_area_id: 5,
        context_text: "Endast efter överenskommelse med Ge Effektivt",
      },
      {
        _key: "3a35ae99a587",
        cause_area_id: -1,
        context_text: "Smart fördelning går till det som gör störst nytta vid varje tidpunkt",
      },
    ],
  },
};

function getAtPath(doc: any, path: string) {
  return path.split(".").reduce((node, key) => (node == null ? node : node[key]), doc);
}

async function run() {
  const siteSettings = await client.fetch<{ main_locale?: string } | null>(
    `*[_type == "site_settings"][0]{main_locale}`,
  );
  const locale = siteSettings?.main_locale as LocaleKey | undefined;

  if (!locale || !CONTENT[locale]) {
    throw new Error(
      `Unsupported or missing site_settings.main_locale: ${JSON.stringify(locale)}. ` +
        `Expected one of: ${Object.keys(CONTENT).join(", ")}`,
    );
  }

  const widget = await client.fetch<{ _id: string } | null>(`*[_type == "donationwidget"][0]{...}`);
  if (!widget?._id) {
    throw new Error("No donationwidget document found in this dataset");
  }

  console.log(
    `\n=== ${locale.toUpperCase()} (project ${client.config().projectId}, dataset ${
      client.config().dataset
    }) ===`,
  );

  const content: Record<string, unknown> = { ...CONTENT[locale] };

  const setPatch: Record<string, unknown> = {};
  const skipped: string[] = [];

  for (const [path, value] of Object.entries(content)) {
    const existing = getAtPath(widget, path);
    const forced = FORCE_OVERWRITE[locale].includes(path);
    const isEmpty =
      existing === null ||
      existing === undefined ||
      (typeof existing === "string" && existing.trim() === "");

    if (isEmpty || forced) {
      setPatch[path] = value;
      console.log(`  ${forced && !isEmpty ? "overwrite" : "set"}  ${path}`);
    } else {
      skipped.push(path);
    }
  }

  if (skipped.length) {
    console.log(`  keeping existing values for:\n    - ${skipped.join("\n    - ")}`);
  }

  if (!Object.keys(setPatch).length) {
    console.log("  nothing to do");
    return;
  }

  await client.patch(widget._id).set(setPatch).commit();
  console.log(`  committed ${Object.keys(setPatch).length} field(s) to ${widget._id}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
