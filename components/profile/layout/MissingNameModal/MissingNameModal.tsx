import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { saveDonor } from "../../_queries";
import { DonorContext } from "../donorProvider";

import { failureToast, successToast } from "../../shared/toast";
import styles from "./MissingNameModal.module.scss";

export const MissingNameModal: React.FC = () => {
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
        failureToast();
      } else {
        successToast();
        setDonor(updatedDonor);
        setOpen(false);
      }
    } else {
      failureToast();
    }
    setLoading(false);
  };

  return (
    <Lightbox
      open={open}
      onConfirm={saveName}
      valid={name.length > 0}
      loading={loading}
      onCancel={() => setOpen(false)}
    >
      <div className={styles.container}>
        <h5>Navn mangler</h5>
        <span>
          Vi mangler ditt navn. Vi bruker navnet ditt til å drive støttefunksjoner, finne
          facebook-donasjoner og slå sammen duplikate brukere i databasen vår.
        </span>
        <div className={styles.inputContainer}>
          <EffektTextInput value={name} onChange={setName} />
        </div>
      </div>
    </Lightbox>
  );
};
