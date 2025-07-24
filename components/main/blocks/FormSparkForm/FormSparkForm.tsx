import React, { useState } from "react";
import { Formsparkform } from "../../../../studio/sanity.types";
import styles from "./FormSparkForm.module.scss";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { RadioButton } from "../../../shared/components/RadioButton/RadioButton";
import { EffektCheckbox } from "../../../shared/components/EffektCheckbox/EffektCheckbox";

// Type definitions for form state
type FormState = Record<string, string | boolean>;

// Type guard to check if a field has options
const hasOptions = (field: any): field is { options: Array<{ value: string; label: string }> } => {
  return field.options && Array.isArray(field.options);
};

export const FormsparkForm: React.FC<{ formData: Formsparkform }> = ({ formData }) => {
  const [formState, setFormState] = useState<FormState>({});

  // Initialize form state for controlled inputs
  React.useEffect(() => {
    const initialState: FormState = {};
    formData.fields?.forEach((field) => {
      if (field.field_type === "checkbox") {
        initialState[field.field_name || ""] = false;
      } else {
        initialState[field.field_name || ""] = "";
      }
    });
    setFormState(initialState);
  }, [formData.fields]);

  const handleInputChange = (fieldName: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderField = (field: any) => {
    const fieldName = field.field_name || "";
    const validation = field.validation || {};

    const commonProps: any = {
      name: fieldName,
      id: fieldName,
      required: validation.required,
    };

    // Add HTML5 validation attributes
    if (validation.min_length) commonProps.minLength = validation.min_length;
    if (validation.max_length) commonProps.maxLength = validation.max_length;
    if (validation.pattern) {
      commonProps.pattern = validation.pattern;
      if (validation.pattern_message) {
        commonProps.title = validation.pattern_message;
      }
    }

    if (field.autocomplete) {
      commonProps.autoComplete = field.autocomplete;
    }

    switch (field.field_type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={(formState[fieldName] as string) || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
          />
        );

      case "select":
        return (
          <select
            {...commonProps}
            value={(formState[fieldName] as string) || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
          >
            <option value="">Choose an option</option>
            {hasOptions(field) &&
              field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        );

      case "radio":
        return (
          <div
            role="radiogroup"
            aria-labelledby={`${fieldName}-label`}
            className={styles.radioGroup}
          >
            {hasOptions(field) &&
              field.options.map((option, index) => (
                <div key={index}>
                  <RadioButton
                    name={fieldName}
                    selected={formState[fieldName] === option.value}
                    onSelect={() => handleInputChange(fieldName, option.value)}
                    title={option.label}
                    data_cy={`${fieldName}-${index}`}
                    required={
                      index === 0 &&
                      (formState[fieldName] === "" || formState[fieldName] === undefined)
                    }
                  />
                </div>
              ))}
          </div>
        );

      case "checkbox":
        return (
          <div>
            <EffektCheckbox
              required={commonProps.required}
              checked={!!formState[fieldName]}
              onChange={(checked) => handleInputChange(fieldName, checked)}
            >
              {field.field_label}
            </EffektCheckbox>
          </div>
        );

      case "number":
        const numberProps = { ...commonProps };
        if (validation.min_value !== undefined) numberProps.min = validation.min_value;
        if (validation.max_value !== undefined) numberProps.max = validation.max_value;

        return (
          <input
            {...numberProps}
            type="number"
            value={(formState[fieldName] as string) || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.field_type || "text"}
            value={(formState[fieldName] as string) || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  if (!formData || !formData.fields) {
    return <div>No form data provided</div>;
  }

  return (
    <div className={styles.wrapper}>
      <form
        action={`https://submit-form.com/${formData.form_id}`}
        method="POST"
        target={formData.submit_target || "_self"}
        className={styles.form}
      >
        {formData.fields.map((field, index) => {
          const fieldName = field.field_name || "";
          return (
            <div key={index} className={styles.fieldWrapper}>
              {field.field_type !== "checkbox" && (
                <label htmlFor={fieldName} id={`${fieldName}-label`}>
                  {field.field_label}
                </label>
              )}

              {renderField(field)}
            </div>
          );
        })}

        {/* Honeypot field for spam protection */}
        {formData.honeypot_field && (
          <input
            type="text"
            name="_gotcha"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
        )}

        <EffektButton variant={EffektButtonVariant.PRIMARY} type="submit">
          {formData.submit_button_text || "Submit"}
        </EffektButton>
      </form>
    </div>
  );
};
