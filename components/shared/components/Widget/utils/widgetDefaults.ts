import {
  WidgetProps,
  OperationsConfig,
  CauseAreaDisplayConfig,
  UILabels,
} from "../types/WidgetProps";

export const DEFAULT_OPERATIONS_CONFIG: Required<OperationsConfig> = {
  default_percentage: 5,
  operations_label_template: "{percentage}% to operations",
  enabled_by_default_global: false,
  enabled_by_default_single: true,
  excluded_cause_area_ids: [5], // Admin cause area
};

export const DEFAULT_CAUSE_AREA_DISPLAY_CONFIG: Required<CauseAreaDisplayConfig> = {
  below_line_cause_area_ids: [4, 5], // Operations and Admin
  cause_area_contexts: [
    {
      cause_area_id: 4,
      context_text:
        "For every dollar donated to operations, we expect to raise at least 10 dollars for our cause areas.",
    },
  ],
};

export const DEFAULT_UI_LABELS: Required<UILabels> = {
  total_label: "Total",
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
  };
}
