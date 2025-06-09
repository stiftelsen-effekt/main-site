import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const DKRenewPayment: React.FC<{
  loading_text?: string;
}> = ({ loading_text = "Loading..." }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const request = async () => {
      try {
        const id = searchParams.get("id");
        if (!id) {
          setError("Unable to find ID in the URL");
          setIsLoading(false);
          throw new Error("Unable to find ID in the URL");
        }

        const response = await fetch(`${process.env.EFFEKT_API}/prod/renew-payment`, {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          const message =
            (await response.json()).message || "An error occurred while renewing payment";
          setError(message);
          throw new Error(`${response.status}`);
        }

        const body = await response.json();
        setUrl(body.url);
        setError(null);
      } catch (err) {
        setUrl(null);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("renew-payment error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    request();
  }, [searchParams]);

  const handleRenewClick = () => {
    if (url) {
      window.open(url, "_parent");
    }
  };

  // Show error state
  if (error && error.length > 0) {
    return <div className="error">An error occurred while loading payment renewal</div>;
  }

  // Show loading state
  if (isLoading || !url) {
    return <div className="loading">{loading_text}</div>;
  }

  // Show button when URL is ready
  return (
    <button onClick={handleRenewClick} className="renew-payment-button">
      Renew Payment
    </button>
  );
};
