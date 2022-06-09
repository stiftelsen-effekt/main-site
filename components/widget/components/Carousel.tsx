import React, { useRef, useState, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";

import { State } from "../store/state";

interface ICarouselProps {
  children: React.ReactNode[];
  minHeight: number;
}

export const Carousel: React.FC<ICarouselProps> = ({ children, minHeight }) => {
  const [currentPaneNumber, setCurrentPaneNumber] = useState(0); // get from redux global state
  const reduxPaneNumber = useSelector((state: State) => state.layout.paneNumber);
  const [renderedPanes, setRenderedPanes] = useState([1]);
  const renderedPanesRef = useRef(renderedPanes);
  renderedPanesRef.current = renderedPanes;
  const currentPaneNumberRef = useRef(currentPaneNumber);
  currentPaneNumberRef.current = currentPaneNumber;

  const changePaneByOffset = (offset: number) => {
    const newRenderedPanes = [...renderedPanes];
    newRenderedPanes[currentPaneNumber + offset] = 1;
    setRenderedPanes(newRenderedPanes);

    setCurrentPaneNumber(currentPaneNumber + offset);

    setTimeout(() => {
      const newRenderedPanes2 = [...renderedPanesRef.current];
      newRenderedPanes2[currentPaneNumberRef.current - offset] = 0;
      setRenderedPanes(newRenderedPanes2);
    }, 200);
  };

  // This hook detects when paneNumber changes in the Redux store
  useEffect(() => {
    if (reduxPaneNumber > currentPaneNumber) {
      changePaneByOffset(1);
    } else if (reduxPaneNumber < currentPaneNumber) {
      changePaneByOffset(-1);
    }
  }, [reduxPaneNumber]);

  /*
  // TODO: Remove
  const prevPane = () => {
    if (currentPaneNumber > 0) {
      changePaneByOffset(-1);
    }
  };

  // TODO: Remove
  const nextPane = () => {
    if (currentPaneNumber < numberOfPanes - 1) {
      changePaneByOffset(1);
    }
  };
  */

  return (
    <div id="carousel-wrapper" style={{ minHeight: `${minHeight}px` }}>
      <div
        id="carousel"
        style={{
          transform: `translate3d(${currentPaneNumber * -100}%, 0px, 0px)`,
        }}
      >
        {children &&
          children
            .filter((child: ReactNode) => child !== false)
            .map((child: ReactNode, i: number) => {
              return (
                <div className="pane" key={i}>
                  {renderedPanes[i] === 1 && child}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Carousel;
