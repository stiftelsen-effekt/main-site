import { useState, useRef } from "react";
import { useMultipleElementHeights } from "../../../../../hooks/useElementHeight";
import styles from "../FundraiserWidget.module.scss";

interface TransitionState {
  activePane: number;
  enteringPane: number | null;
  exitingPane: number | null;
  direction: "forward" | "backward";
}

export function usePaneTransition(totalPanes: number) {
  const [step, setStep] = useState<number>(0);
  const [paneTransition, setPaneTransition] = useState<TransitionState>({
    activePane: 0,
    enteringPane: null,
    exitingPane: null,
    direction: "forward",
  });

  const paneRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const paneHeights = useMultipleElementHeights(paneRefs as React.RefObject<HTMLDivElement>[]);

  const goToNextStep = (): void => {
    // Start transition animation - keep both panes visible
    setPaneTransition({
      activePane: step,
      enteringPane: step + 1,
      exitingPane: step,
      direction: "forward",
    });

    // After animation fully completes, clean up the transition state
    setTimeout(() => {
      setStep(step + 1);
      setPaneTransition({
        activePane: step + 1,
        enteringPane: null,
        exitingPane: null,
        direction: "forward",
      });
    }, 50);
  };

  const goToPreviousStep = (): void => {
    if (step === 0) return; // Prevent going back from the first step
    // Start transition animation
    setPaneTransition({
      activePane: step,
      enteringPane: step - 1,
      exitingPane: step,
      direction: "backward",
    });

    // After animation completes, update the active pane
    setTimeout(() => {
      setStep(step - 1);
      setPaneTransition({
        activePane: step - 1,
        enteringPane: null,
        exitingPane: null,
        direction: "backward",
      });
    }, 50);
  };

  const getPaneClassName = (paneIndex: number): string => {
    // Base class for the pane
    const baseClass = styles["donation-widget__pane"];

    // Determine the state of this pane (entering, exiting, active)
    let stateClass = "";

    if (paneTransition.enteringPane === paneIndex) {
      stateClass = styles[`donation-widget__pane--entering-${paneTransition.direction}`];
    } else if (paneTransition.exitingPane === paneIndex) {
      stateClass = styles[`donation-widget__pane--exiting-${paneTransition.direction}`];
    } else if (step === paneIndex) {
      stateClass = styles["donation-widget__pane--active"];
    }

    return `${baseClass} ${stateClass}`;
  };

  const isPaneVisible = (paneIndex: number): boolean => {
    return (
      step === paneIndex ||
      paneTransition.enteringPane === paneIndex ||
      paneTransition.exitingPane === paneIndex
    );
  };

  // Determine current height based on active pane
  const currentHeight = paneHeights[paneTransition.activePane] || "auto";

  return {
    step,
    goToNextStep,
    goToPreviousStep,
    paneRefs,
    getPaneClassName,
    isPaneVisible,
    currentHeight,
  };
}
