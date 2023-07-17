import React from "react";
import style from "./Lightbox.module.scss";
import { EffektButton, EffektButtonType } from "../EffektButton/EffektButton";
import { X } from "react-feather";
import { Spinner } from "../Spinner/Spinner";
import { LoadingButtonSpinner } from "../Spinner/LoadingButtonSpinner";

export const Lightbox: React.FC<{
  showOkay?: boolean;
  children: React.ReactNode;
  open: boolean;
  valid?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}> = ({ showOkay, children, open, valid, loading, onConfirm, onCancel }) => {
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
          {showOkay && (
            <EffektButton
              onClick={onConfirm}
              cy="lightbox-confirm"
              disabled={typeof valid === "boolean" ? !valid : false}
            >
              {loading ? <LoadingButtonSpinner /> : onCancel ? "Bekreft" : "OK"}
            </EffektButton>
          )}

          {onCancel && (
            <EffektButton onClick={onCancel} type={EffektButtonType.SECONDARY} cy="lightbox-cancel">
              Avbryt
            </EffektButton>
          )}
        </div>
      </div>
    </div>
  );
};
