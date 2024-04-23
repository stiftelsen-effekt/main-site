import { Card, Stack, ThemeProvider, Text } from "@sanity/ui";
import React from "react";
import { EyeOff } from "react-feather";
import { Preview, PreviewProps } from "sanity";
import { schemas } from "../schemas/schema";

export const ContentSectionPreview = (
  props: PreviewProps & {
    inverted?: boolean;
    hidden?: boolean;
    heading?: string;
    nodivider?: string;
    blocks?: any[];
  },
) => {
  const hasHeader = !props.nodivider || props.heading;

  const referencePreview = (id) => (
    /*
    <QueryContainer query="*[_id==$id]" params={{ id }}>
      {({ result, loading }) =>
        loading ? (
          <Spinner center message="Loading items…" />
        ) : (
          result && (
            <div>
              {result.documents.map((document) => (
                <Fragment key={document._id}>
                  <Preview value={document} type={schema.get(document._type)} />
                </Fragment>
              ))}
            </div>
          )
        )
      }
    </QueryContainer>
    */
    <div>
      <Text size={1}>Referanse til {id}</Text>
    </div>
  );

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
        <Stack space={4}>
          {hasHeader ? (
            <Stack>
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
                console.log(schemas);
                const schemaType = schemas.filter((s) => s.name == b._type)[0];
                if (!schemaType) {
                  return <Text size={1}>Missing schema type {b._type}</Text>;
                } else {
                  return b._type !== "reference" ? (
                    <Preview value={b} schemaType={schemaType} />
                  ) : (
                    referencePreview(b._ref)
                  );
                }
              })
            : null}
        </Stack>
      </Card>
    </ThemeProvider>
  );
};

/**
 *           
          {props.blocks
            ? props.blocks.map((b) =>
                b._type !== "reference" ? (
                  <Preview value={b} type={b} />
                ) : (
                  referencePreview(b._ref)
                ),
              )
            : null}
 */
