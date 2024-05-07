import { Card, Stack, ThemeProvider, Text, BoundaryElementProvider } from "@sanity/ui";
import React, { useEffect, useMemo } from "react";
import { EyeOff } from "react-feather";
import { DefaultPreview, Preview, PreviewProps, Reference, useClient } from "sanity";
import { schemas } from "../schemas/schema";

export const ContentSectionPreview = (
  props: PreviewProps & {
    inverted?: boolean;
    hidden?: boolean;
    heading?: string;
    nodivider?: string;
    blocks?: any[];
    _key?: string;
  },
) => {
  const hasHeader = !props.nodivider || props.heading;

  return (
    <ThemeProvider scheme={props.inverted ? "dark" : "light"}>
      <Card padding={2} radius={4} style={{ position: "relative" }}>
        {props.hidden && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,.9)",
              zIndex: 100,
            }}
          >
            <EyeOff
              size={24}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "black",
              }}
            />
          </div>
        )}
        <Stack space={1}>
          {hasHeader ? (
            <Stack marginBottom={props.heading ? 3 : 0}>
              {props.nodivider ? null : (
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    background: props.inverted ? "white" : "black",
                    marginBottom: "10px",
                    marginTop: "2px",
                  }}
                ></div>
              )}
              {props.heading ? <Text size={1}>{props.heading}</Text> : " "}
            </Stack>
          ) : null}
          {props.blocks
            ? props.blocks.map((b) => {
                if (b._type === "reference") {
                  return <ReferencePreview {...b} key={b._ref} />;
                }

                const schemaType = schemas.filter((s) => s.name == b._type)[0];
                if (!schemaType) {
                  return <Text size={1}>Missing schema type {b._type}</Text>;
                } else {
                  return (
                    <Preview
                      value={b}
                      schemaType={schemaType}
                      key={b._key}
                      skipVisibilityCheck={true}
                    />
                  );
                }
              })
            : null}
        </Stack>
      </Card>
    </ThemeProvider>
  );
};

const ReferencePreview = (props: Reference) => {
  const client = useClient({ apiVersion: "2021-03-25" });

  const [doc, setDoc] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    client.getDocument(props._ref).then((d) => {
      setDoc(d);
      setLoading(false);

      console.log(d);
    });
  }, [setDoc, setLoading, client, props._ref]);

  if (loading) {
    return <DefaultPreview media={true} isPlaceholder={true} />;
  }
  if (!doc) {
    return <Text size={1}>Missing document</Text>;
  }
  const schemaType = schemas.filter((s) => s.name == doc._type)[0];
  if (!schemaType) {
    return <Text size={1}>Missing schema type {doc._type}</Text>;
  } else {
    return <Preview value={doc} schemaType={schemaType} skipVisibilityCheck={true} />;
  }
};
