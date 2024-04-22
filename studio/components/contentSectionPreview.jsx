import React, { Fragment } from "react";
import { EyeOff } from "react-feather";
// These are react components

export const ContentSectionPreview = React.forwardRef((props, ref) => {
  if (!props.value) return null;

  const hasHeader = !props.value.nodivider || props.value.title;

  const referencePreview = (id) => (
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
  );

  return (
    <ThemeProvider scheme={props.value.inverted ? "dark" : "light"}>
      <Card padding={2} radius={4} style={{ position: "relative" }}>
        {props.value.hidden && (
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
              {props.value.nodivider ? null : <hr width="100%" />}
              {props.value.title ? <Text size={1}>{props.value.title}</Text> : null}
            </Stack>
          ) : null}
          {props.value.blocks
            ? props.value.blocks.map((b) =>
                b._type !== "reference" ? (
                  <Preview value={b} type={schema.get(b._type)} />
                ) : (
                  referencePreview(b._ref)
                ),
              )
            : null}
        </Stack>
      </Card>
    </ThemeProvider>
  );
});
