import React, { useRef, useState, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";

import { State } from "../store/state";
import AnimateHeight from "react-animate-height";

interface ICarouselProps {
  children: React.ReactNode[];
  minHeight: number;
  inline?: boolean;
}

function smoothScrollTo(element: any, to: number, duration: number) {
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-in-out)
    const easeProgress =
      progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    element.scrollTop = start + change * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export const Carousel: React.FC<ICarouselProps> = ({ children, minHeight, inline }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentPaneNumber, setCurrentPaneNumber] = useState(0); // get from redux global state
  const reduxPaneNumber = useSelector((state: State) => state.layout.paneNumber);
  const [renderedPanes, setRenderedPanes] = useState([1]);
  const [temporaryHeight, setTemporaryHeight] = useState<number | null>(null);
  const renderedPanesRef = useRef(renderedPanes);
  renderedPanesRef.current = renderedPanes;
  const currentPaneNumberRef = useRef(currentPaneNumber);
  currentPaneNumberRef.current = currentPaneNumber;

  const changePaneByOffset = (offset: number) => {
    const newRenderedPanes = [...renderedPanes];
    newRenderedPanes[currentPaneNumber + offset] = 1;
    setRenderedPanes(newRenderedPanes);
    setCurrentPaneNumber(currentPaneNumber + offset);

    // Smooth scroll carousel wrapper to top
    if (carouselRef.current?.parentElement) {
      if (inline) {
        window.scrollTo({
          top: carouselRef.current.parentElement.offsetTop,
          behavior: "smooth",
        });
      } else {
        smoothScrollTo(carouselRef.current.parentElement, 0, 200);
      }
    }

    setTimeout(() => {
      const currentHeight = carouselRef.current?.clientHeight;
      setTemporaryHeight(currentHeight || null);
    }, 1);

    setTimeout(() => {
      const newRenderedPanes2 = [...renderedPanesRef.current];
      newRenderedPanes2[currentPaneNumberRef.current - offset] = 0;
      setRenderedPanes(newRenderedPanes2);
      setTemporaryHeight(null);
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

  return (
    <div className="carousel-wrapper" style={{ minHeight: `${minHeight}px` }} ref={carouselRef}>
      <AnimateHeight height={temporaryHeight ? temporaryHeight : "auto"} duration={200}>
        <div
          className="carousel"
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
      </AnimateHeight>
    </div>
  );
};

export default Carousel;
