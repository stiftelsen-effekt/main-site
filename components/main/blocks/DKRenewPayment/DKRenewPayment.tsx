import React, { useState, useEffect } from "react";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { LoadingButtonSpinner } from "../../../shared/components/Spinner/LoadingButtonSpinner";

export const DKRenewPayment: React.FC = () => {
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
          setError("Kunne ikke finde ID i URL'en.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_EFFEKT_API}/api/renew-payment `, {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({ id }),
        });

        if (response.status === 404) {
          setError(
            "Dette link er ikke længere aktivt. Vi sender dig gerne et nyt link, hvis du besvarer den email, hvori du fik dette link. Alternativt kan du altid oprette en ny månedlig donation på forsiden.",
          );
        } else {
          const body = await response.json();
          if (body.url) {
            setUrl(body.url);
            setError(null);
          } else {
            setError("Der opstod en fejl. Prøv igen senere.");
          }
        }
      } catch (err) {
        setUrl(null);
        setError(err instanceof Error ? err.message : "Der opstod en fejl. Prøv igen senere.");
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
    return (
      <div className="error">{error} Du kan altid kontakte os på donation@giveffektivt.dk.</div>
    );
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
