import { useEffect, useState } from "react";

export const useRemSize = () => {
  const [remSize, setRemSize] = useState(() =>
    typeof window !== "undefined"
      ? parseFloat(getComputedStyle(document.documentElement).fontSize)
      : 16,
  );

  useEffect(() => {
    const queries = [
      window.matchMedia("(max-width: 1520px) and (min-width: 1181px)"),
      window.matchMedia("(max-width: 1180px)"),
    ];

    const updateRemSize = () => {
      console.log("updateRemSize");
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
