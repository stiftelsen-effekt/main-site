import { useRef, useState } from "react";
import { useAgreementFeedbackTypes } from "../../../../_queries";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { AgreementTypes } from "../../shared/lists/agreementList/AgreementList";
import styles from "./StoppedAgreementFeedback.module.scss";
import {
  addStoppedAgreementFeedback,
  deleteStoppedAgreementFeedback,
} from "../../shared/lists/agreementList/_queries";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { AlertCircle } from "react-feather";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { useDebouncedCallback } from "use-debounce";
import { add } from "cypress/types/lodash";

interface FeedbackSelection {
  feedbackTypeId: number;
  otherComement?: string;
  backendId: string | undefined;
}

type OperationType = "add" | "delete";

interface QueuedOperation {
  feedbackTypeId: number;
  otherComement?: string;
  type: OperationType;
  backendId?: string; // For delete operations
  timestamp: number;
}

export const StoppedAgreementFeedback = ({
  agreementId,
  KID,
  agreementType,
}: {
  title: string;
  text: string;
  agreementId: string;
  KID: string;
  agreementType: AgreementTypes;
}) => {
  const { loading, isValidating, data, error } = useAgreementFeedbackTypes();
  const { getAccessTokenSilently } = useAuth0();

  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackSelection[]>([]);
  const [otherComment, setOtherComment] = useState<string | undefined>(undefined);
  const operationQueue = useRef<QueuedOperation[]>([]);
  const processingQueue = useRef<boolean>(false);

  const addToQueue = (operation: QueuedOperation) => {
    operationQueue.current.push(operation);
    processQueue();
  };

  const debouncedSetOtherComment = useDebouncedCallback(
    (val: string, feedbackId: number, existingBackendId?: string) => {
      if (val === "" || val === undefined || val === null) {
        if (existingBackendId) {
          addToQueue({
            feedbackTypeId: feedbackId,
            type: "delete",
            timestamp: Date.now(),
            backendId: existingBackendId,
          });
        }
      } else {
        addToQueue({
          feedbackTypeId: feedbackId,
          type: "add",
          otherComement: val,
          timestamp: Date.now(),
        });
      }
    },
    750,
    { trailing: true },
  );

  const processQueue = async () => {
    if (processingQueue.current || operationQueue.current.length === 0) {
      return;
    }

    processingQueue.current = true;
    const operation = operationQueue.current[0];

    try {
      const token = await getAccessTokenSilently();

      if (operation.type === "add") {
        const insertedId = await addStoppedAgreementFeedback(
          agreementId,
          KID,
          agreementType,
          operation.feedbackTypeId,
          operation.otherComement,
          token,
        );

        // Find the latest operation for this feedbackTypeId
        const latestOp = [...operationQueue.current]
          .reverse()
          .find((op) => op.feedbackTypeId === operation.feedbackTypeId);

        if (latestOp?.type === "add") {
          // If latest operation is also an add, we can remove all intermediate operations
          // for this feedbackTypeId and update the UI
          operationQueue.current = operationQueue.current.filter(
            (op) => op.feedbackTypeId !== operation.feedbackTypeId || op === latestOp,
          );

          setSelectedFeedback((prev) => {
            const existing = prev.find((f) => f.feedbackTypeId === operation.feedbackTypeId);
            if (existing) {
              return prev.map((f) =>
                f.feedbackTypeId === operation.feedbackTypeId ? { ...f, backendId: insertedId } : f,
              );
            }
            return [...prev, { feedbackTypeId: operation.feedbackTypeId, backendId: insertedId }];
          });
        } else {
          // Latest operation is delete, so we need to delete this record
          await deleteStoppedAgreementFeedback(insertedId, KID, token);
        }
      } else {
        // delete operation
        if (operation.backendId) {
          await deleteStoppedAgreementFeedback(operation.backendId, KID, token);
        }

        // Find the latest operation for this feedbackTypeId
        const latestOp = [...operationQueue.current]
          .reverse()
          .find((op) => op.feedbackTypeId === operation.feedbackTypeId);

        if (latestOp?.type === "delete") {
          // If latest operation is also a delete, we can remove all intermediate operations
          // for this feedbackTypeId and update the UI
          operationQueue.current = operationQueue.current.filter(
            (op) => op.feedbackTypeId !== operation.feedbackTypeId || op === latestOp,
          );

          setSelectedFeedback((prev) =>
            prev.filter((f) => f.feedbackTypeId !== operation.feedbackTypeId),
          );
        }
      }
    } catch (error) {
      // On error, we only show a toast if this is the latest operation for this feedbackTypeId
      const latestOp = [...operationQueue.current]
        .reverse()
        .find((op) => op.feedbackTypeId === operation.feedbackTypeId);

      if (operation === latestOp) {
        failureToast(
          `Kunne ikke ${operation.type === "add" ? "legge til" : "slette"} tilbakemelding`,
        );

        // Revert UI state
        if (operation.type === "add") {
          setSelectedFeedback((prev) =>
            prev.filter((f) => f.feedbackTypeId !== operation.feedbackTypeId),
          );
        } else {
          if (operation.backendId) {
            setSelectedFeedback((prev) => [
              ...prev,
              {
                feedbackTypeId: operation.feedbackTypeId,
                backendId: operation.backendId,
              },
            ]);
          }
        }
      }
    } finally {
      // Remove the processed operation
      operationQueue.current = operationQueue.current.slice(1);
      processingQueue.current = false;

      // Process next operation if any
      processQueue();
    }
  };

  const handleFeedbackToggle = (feedbackTypeId: number) => {
    const existingSelection = selectedFeedback.find((f) => f.feedbackTypeId === feedbackTypeId);

    if (existingSelection) {
      // Queue delete operation
      addToQueue({
        feedbackTypeId,
        type: "delete",
        backendId: existingSelection.backendId ?? undefined,
        timestamp: Date.now(),
      });

      // Optimistically update UI
      setSelectedFeedback((prev) => prev.filter((f) => f.feedbackTypeId !== feedbackTypeId));
    } else {
      // Queue add operation
      addToQueue({
        feedbackTypeId,
        type: "add",
        timestamp: Date.now(),
      });

      // Optimistically update UI
      setSelectedFeedback((prev) => [
        ...prev,
        {
          feedbackTypeId,
          backendId: undefined,
        },
      ]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div>
      <div>
        <h5>Avtale avsluttet</h5>
        <p>
          Vi har avsluttet din avtale. Det er nyttig for oss om du ønsker å si noe om hvorfor du
          avslutter din avtale, slik at vi kan utvikle oss videre.
        </p>
        <div className={styles.grid}>
          {data
            .filter((d) => !d.isOther)
            .map((feedbackType: { ID: number; name: string }) => {
              return (
                <EffektButton
                  key={feedbackType.ID}
                  squared
                  onClick={() => handleFeedbackToggle(feedbackType.ID)}
                  selected={selectedFeedback.some((f) => f.feedbackTypeId === feedbackType.ID)}
                  variant={EffektButtonVariant.SECONDARY}
                >
                  {feedbackType.name}
                </EffektButton>
              );
            })}
        </div>
        <div className={styles.otherFeedback}>
          {data
            .filter((d) => d.isOther)
            .map((feedbackType: { ID: number; name: string }) => {
              return (
                <>
                  <label>{feedbackType.name}:</label>
                  <EffektTextInput
                    key={feedbackType.ID}
                    value={otherComment}
                    onChange={(val) => {
                      const existingSelection = selectedFeedback.find(
                        (f) => f.feedbackTypeId === feedbackType.ID,
                      );
                      if (existingSelection) {
                        setSelectedFeedback((prev) =>
                          prev.map((f) =>
                            f.feedbackTypeId === feedbackType.ID ? { ...f, otherComement: val } : f,
                          ),
                        );
                        debouncedSetOtherComment(val, feedbackType.ID, existingSelection.backendId);
                      } else {
                        setSelectedFeedback((prev) => [
                          ...prev,
                          {
                            feedbackTypeId: feedbackType.ID,
                            otherComement: val,
                            backendId: undefined,
                          },
                        ]);
                        debouncedSetOtherComment(val, feedbackType.ID);
                      }
                    }}
                  />
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const failureToast = (msg: string) =>
  toast.error(msg, { icon: <AlertCircle size={24} color={"black"} /> });
