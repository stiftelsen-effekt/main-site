import React, { useState, useEffect } from "react";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { LoadingButtonSpinner } from "../../../shared/components/Spinner/LoadingButtonSpinner";

export const DKRenewPayment: React.FC<{
  loading_text?: string;
}> = ({ loading_text = "Loading..." }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const request = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) {
          setError("Unable to find ID in the URL");
          setIsLoading(false);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_EFFEKT_API}/api/renew-payment `, {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({ id }),
        });

        const body = await response.json();
        if (body.url) {
          setUrl(body.url);
          setError(null);
        } else {
          setError("Something went wrong, please try again later.");
        }
      } catch (err) {
        setUrl(null);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("renew-payment error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    request();
  }, []);

  const handleRenewClick = () => {
    if (url) {
      window.open(url, "_parent");
    }
  };

  if (error && error.length > 0) {
    return <div className="error">An error occurred while loading payment renewal</div>;
  }

  if (isLoading || !url) {
    return (
      <EffektButton disabled className="renew-payment-button">
        <LoadingButtonSpinner />
      </EffektButton>
    );
  }

  return (
    <EffektButton onClick={handleRenewClick} className="renew-payment-button">
      Forny betaling
    </EffektButton>
  );
};
