import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";

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

  if (error && error.length > 0) {
    return <div className="error">An error occurred while loading payment renewal</div>;
  }

  if (isLoading || !url) {
    return <div className="loading">{loading_text}</div>;
  }

  return (
    <EffektButton onClick={handleRenewClick} className="renew-payment-button">
      Renew Payment
    </EffektButton>
  );
};
