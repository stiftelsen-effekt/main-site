import {
  WidgetProps,
  OperationsConfig,
  CauseAreaDisplayConfig,
  UILabels,
} from "../types/WidgetProps";

export const DEFAULT_OPERATIONS_CONFIG: Omit<
  Required<OperationsConfig>,
  "operations_cause_area_id"
> & { operations_cause_area_id?: number } = {
  // Deliberately unset: cause area IDs are assigned per platform, so there is no
  // sensible cross-platform default. Platforms with a dedicated operations cause area
  // configure it in Sanity; platforms without one (where operations is an organization
  // inside a regular cause area) leave it unset.
  operations_cause_area_id: undefined,
  default_percentage: 5,
  operations_label_template: "of which {percentage}% to operations",
  enabled_by_default_global: false,
  enabled_by_default_single: true,
  excluded_cause_area_ids: [],
  // Empty label_text hides the info box until a label/description is configured
  x_factor_info: { label_text: "", description: [] },
};

export const DEFAULT_CAUSE_AREA_DISPLAY_CONFIG: Required<CauseAreaDisplayConfig> = {
  cause_area_selection_title: "Which cause do you want to make a difference in?",
  recommendation_button_text: "Our recommendation",
  multiple_cause_areas_button_text: "Choose multiple causes",
  // Cause area IDs are per-platform, so these are configured in Sanity rather than
  // defaulted here - a hardcoded ID would silently point at the wrong cause area.
  below_line_cause_area_ids: [],
  cause_area_contexts: [],
  // Empty label_text hides the info box until a label/description is configured
  other_cause_area_info: { label_text: "", description: [] },
};

export const DEFAULT_UI_LABELS: Required<UILabels> = {
  total_label: "Total",
  operations_summary_label: "Operations",
};

/**
 * Last-resort defaults for optional smart-distribution copy. Every platform should
 * configure these in Sanity - these only keep the UI usable if content is missing.
 */
export const DEFAULT_SMART_DISTRIBUTION_TEXTS = {
  show_all_organizations_text: "Show all",
};

/**
 * Applies default values to widget props where configuration is missing
 */
export function applyWidgetDefaults(widget: WidgetProps): WidgetProps {
  return {
    ...widget,
    operations_config: {
      ...DEFAULT_OPERATIONS_CONFIG,
      ...widget.operations_config,
    },
    cause_area_display_config: {
      ...DEFAULT_CAUSE_AREA_DISPLAY_CONFIG,
      ...widget.cause_area_display_config,
    },
    ui_labels: {
      ...DEFAULT_UI_LABELS,
      ...widget.ui_labels,
    },
    smart_distribution_context: {
      ...widget.smart_distribution_context,
      show_all_organizations_text:
        widget.smart_distribution_context?.show_all_organizations_text ||
        DEFAULT_SMART_DISTRIBUTION_TEXTS.show_all_organizations_text,
    },
  };
}
