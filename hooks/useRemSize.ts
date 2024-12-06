import { useEffect, useState } from "react";

export const useRemSize = () => {
  const [remSize, setRemSize] = useState(16);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialRemSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      setRemSize(initialRemSize);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const queries = [
      window.matchMedia("(max-width: 1520px) and (min-width: 1181px)"),
      window.matchMedia("(max-width: 1180px)"),
    ];

    const updateRemSize = () => {
      const newRemSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      setRemSize(newRemSize);
    };

    queries.forEach((query) => {
      query.addEventListener("change", updateRemSize);
    });

    return () => {
      queries.forEach((query) => {
        query.removeEventListener("change", updateRemSize);
      });
    };
  }, []);

  return remSize;
};
