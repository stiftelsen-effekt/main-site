export const splitOperationsLabelTemplate = (template?: string) => {
  if (!template) return { prefix: "", suffix: "" };

  const placeholderIndex = template.indexOf("{percentage}");
  if (placeholderIndex === -1) return { prefix: "", suffix: template.trim() };

  return {
    prefix: template.slice(0, placeholderIndex).trim(),
    suffix: template.slice(placeholderIndex + "{percentage}".length).trim(),
  };
};
