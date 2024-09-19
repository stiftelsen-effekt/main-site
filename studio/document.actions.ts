import { useState } from "react";
import { DocumentActionComponent, DocumentActionProps, DocumentActionsContext } from "sanity";

const sensitiveFields = {
  bank: ["kontonr"],
  autogiro: ["account_number"],
};

export const documentActions: (
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
) => DocumentActionComponent[] = (prev, context) => {
  const { schemaType, currentUser } = context;

  if (sensitiveFields[schemaType]) {
    const publish = prev.find((item) => item.action === "publish");

    if (!publish) {
      return prev;
    }

    const prevWithoutPublish = prev.filter((item) => item.action !== "publish");

    const publishWrapper: DocumentActionComponent = (props: DocumentActionProps) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const publishAction = publish(props);

      let sensitiveFieldsChanged = false;
      let changedFields: string[] = [];

      if (props.draft && props.published) {
        sensitiveFields[schemaType].forEach((field) => {
          const draftValue = getNestedValue(props.draft, field);
          const publishedValue = getNestedValue(props.published, field);
          if (draftValue !== publishedValue) {
            sensitiveFieldsChanged = true;
            changedFields.push(field);
          }
        });
      }

      return {
        ...publishAction,
        onHandle: () => {
          if (sensitiveFieldsChanged) {
            setDialogOpen(true);
          } else {
            publishAction.onHandle();
          }
        },
        dialog: dialogOpen && {
          type: "confirm",
          title: "Sensitive fields changed",
          message: `You have changed the following sensitive fields: ${changedFields.join(
            ", ",
          )}. This will notify the administrators for security reasons. Are you sure you want to publish?`,
          onCancel: () => setDialogOpen(false),
          onConfirm: async () => {
            setDialogOpen(false);

            const notificationSent = await sendSecurityEmail(
              props,
              changedFields,
              `${currentUser.name} (${currentUser.email})`,
            );

            if (notificationSent) {
              publishAction.onHandle();
            } else {
              alert("Failed to send security email");
            }
          },
          color: "info",
        },
      };
    };

    return [publishWrapper, ...prevWithoutPublish];
  } else {
    return prev;
  }
};

function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
}

const sendSecurityEmail = async (
  props: DocumentActionProps,
  changedFields: string[],
  user: string,
) => {
  const api = process.env.SANITY_STUDIO_EFFEKT_API_URL;

  const result = await fetch(`${api}/mail/mailersend/security/sanitynotification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document: props.type,
      sanityUser: user,
      fields: changedFields.map((field) => ({
        name: field,
        prev: getNestedValue(props.published, field),
        new: getNestedValue(props.draft, field),
      })),
    }),
  });

  if (result.status === 200) {
    return true;
  } else {
    return false;
  }
};
