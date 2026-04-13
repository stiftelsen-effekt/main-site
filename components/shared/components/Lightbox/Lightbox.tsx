import React from "react";
import style from "./Lightbox.module.scss";
import { EffektButton, EffektButtonVariant } from "../EffektButton/EffektButton";
import { X } from "react-feather";
import { LoadingButtonSpinner } from "../Spinner/LoadingButtonSpinner";
import { useMainLocale } from "../../../../context/MainLocaleContext";

export const Lightbox: React.FC<{
  children: React.ReactNode;
  open: boolean;
  valid?: boolean;
  loading?: boolean;
  confirmLabel?: string;
  okLabel?: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
}> = ({
  children,
  open,
  valid,
  loading,
  confirmLabel,
  okLabel,
  onConfirm,
  cancelLabel,
  onCancel,
}) => {
  const mainLocale = useMainLocale();

  const defaultConfirmLabel =
    mainLocale === "dk" ? "Bekræft" : mainLocale === "sv" ? "Bekräfta" : "Bekreft";
  const defaultCancelLabel =
    mainLocale === "dk" ? "Annuller" : mainLocale === "sv" ? "Avbryt" : "Avbryt";

  if (!open) return null;

  return (
    <div className={style.lightboxWrapper} onClick={(e) => e.stopPropagation()} data-cy="lightbox">
      <div className={style.lightbox}>
        {onCancel && (
          <div className={style.lightboxCloseButton} onClick={onCancel}>
            <X size={"1.5rem"} />
          </div>
        )}
        {children}
        <div className={style.buttonWrapper}>
          <EffektButton
            onClick={onConfirm}
            cy="lightbox-confirm"
            disabled={typeof valid === "boolean" ? !valid : false}
          >
            {loading ? (
              <LoadingButtonSpinner />
            ) : onCancel ? (
              confirmLabel ?? defaultConfirmLabel
            ) : (
              okLabel ?? "OK"
            )}
          </EffektButton>
          {onCancel && (
            <EffektButton
              onClick={onCancel}
              variant={EffektButtonVariant.SECONDARY}
              cy="lightbox-cancel"
            >
              {cancelLabel ?? defaultCancelLabel}
            </EffektButton>
          )}
        </div>
      </div>
    </div>
  );
};
