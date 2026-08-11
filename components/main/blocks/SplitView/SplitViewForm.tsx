import React, { useId, useState } from "react";
import { API_URL } from "../../../shared/components/Widget/config/api";
import { IServerResponse } from "../../../shared/components/Widget/types/Temp";
import styles from "./SplitView.module.scss";

export interface SplitViewFormConfiguration {
  formType: string;
  inputLabel: string;
  inputPlaceholder?: string;
  buttonLabel: string;
  successMessage?: string;
  errorMessage?: string;
}

interface SplitViewFormPayload {
  type: string;
  email: string;
}

export const SplitViewForm: React.FC<{ form: SplitViewFormConfiguration }> = ({ form }) => {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const payload: SplitViewFormPayload = {
        type: form.formType,
        email,
      };
      const response = await fetch(`${API_URL}/forms/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      const result: IServerResponse<unknown> = await response.json();

      if (result.status !== 200) throw new Error(result.content as string);

      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor={inputId}>{form.inputLabel}</label>
      <div className={styles.formControls}>
        <input type="hidden" name="type" value={form.formType} />
        <input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={form.inputPlaceholder}
          value={email}
          disabled={status === "submitting"}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" disabled={status === "submitting"}>
          {form.buttonLabel}
        </button>
      </div>
      {status === "success" && form.successMessage && (
        <p className={styles.formMessage} role="status">
          {form.successMessage}
        </p>
      )}
      {status === "error" && (
        <p className={styles.formMessage} role="alert">
          {form.errorMessage || "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
};
