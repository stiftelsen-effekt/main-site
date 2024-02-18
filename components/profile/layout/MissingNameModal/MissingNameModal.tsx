import { useContext, useEffect, useState } from "react";
import { DonorContext } from "../donorProvider";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { saveDonor } from "../../_queries";
import { useAuth0 } from "@auth0/auth0-react";
import { AlertCircle, Check } from "react-feather";
import { toast } from "react-toastify";

import styles from "./MissingNameModal.module.scss";

export type MissingNameModalConfig = {
  title: string;
  description: string;
  confirm_label: string;
  cancel_label: string;
  failure_message: string;
  success_message: string;
};

export const MissingNameModal: React.FC<{ config: MissingNameModalConfig }> = ({ config }) => {
  const { donor, setDonor } = useContext(DonorContext);
  const { user, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (donor && !donor.name) {
      setOpen(true);
    }
  }, [donor]);

  const saveName = async () => {
    setLoading(true);
    if (donor && user) {
      const updatedDonor = { ...donor, name };
      const token = await getAccessTokenSilently();
      const result = await saveDonor(updatedDonor, user, token);
      if (result === null) {
        failureToast(config.failure_message);
      } else {
        successToast(config.success_message);
        setDonor(updatedDonor);
        setOpen(false);
      }
    } else {
      failureToast(config.failure_message);
    }
    setLoading(false);
  };

  return (
    <Lightbox
      open={open}
      confirmLabel={config.confirm_label}
      onConfirm={saveName}
      valid={name.length > 0}
      loading={loading}
      cancelLabel={config.cancel_label}
      onCancel={() => setOpen(false)}
    >
      <div className={styles.container}>
        <h5>{config.title}</h5>
        <span>{config.description}</span>
        <div className={styles.inputContainer}>
          <EffektTextInput value={name} onChange={setName} />
        </div>
      </div>
    </Lightbox>
  );
};

const successToast = (msg: string) =>
  toast.success(msg, { icon: <Check size={24} color={"black"} /> });
const failureToast = (msg: string) =>
  toast.error(msg, { icon: <AlertCircle size={24} color={"black"} /> });
