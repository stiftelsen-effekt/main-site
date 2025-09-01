import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AnimateHeight from "react-animate-height";
import { X, AlertCircle } from "react-feather";
import { State } from "../../../store/state";
import { clearApiError } from "../../../store/donation/actions";
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../store/donation/types";
import {
  NotificationWrapper,
  NotificationContent,
  NotificationIcon,
  NotificationMessage,
  NotificationCloseButton,
} from "./ApiErrorNotification.style";

export const ApiErrorNotification: React.FC<{ genericErrorMessage?: string }> = ({
  genericErrorMessage = "Something went wrong, please try again later.",
}) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes>>();
  const apiError = useSelector((state: State) => state.donation.apiError);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof apiError !== "undefined") {
      setMessage(apiError);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [apiError]);

  const handleClose = () => {
    setIsVisible(false);
    // Add a small delay before clearing the error to allow exit animation
    setTimeout(() => {
      dispatch(clearApiError());
    }, 250);
  };

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 100000000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimateHeight height={isVisible ? "auto" : 0} duration={300} animateOpacity>
      <NotificationWrapper data-cy="api-error-notification">
        <NotificationContent>
          <NotificationIcon>
            <AlertCircle size={24} />
          </NotificationIcon>
          <NotificationMessage>{message || genericErrorMessage}</NotificationMessage>
          <NotificationCloseButton onClick={handleClose} aria-label="Close notification">
            <X size={24} />
          </NotificationCloseButton>
        </NotificationContent>
      </NotificationWrapper>
    </AnimateHeight>
  );
};
