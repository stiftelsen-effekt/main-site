import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { AlertCircle, Check } from "react-feather";
import { toast } from "react-toastify";
import { Donor } from "../../../../models";
import style from "./ProfileInfo.module.scss";
import { DonorContext } from "../../layout/donorProvider";
import { save } from "../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { EffektCheckbox } from "../../../shared/components/EffektCheckbox/EffektCheckbox";

export const ProfileInfo: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const { donor: initialDonor, setDonor: setGlobalDonor } = useContext(DonorContext);
  const [donor, setDonor] = useState<Donor | null>(initialDonor);

  if (!donor || !user) return <div>Noe gikk galt.</div>;

  const saveDonor = async () => {
    const token = await getAccessTokenSilently();
    const result = await save(donor, user, token);
    if (result === null) {
      failureToast();
    } else {
      successToast();
      setGlobalDonor(donor);
    }
  };

  return (
    <>
      <h3 className={style.header}>Hei{donor.name ? " " + donor.name.split(" ")[0] : ""}!</h3>
      <section className={style.personalInfo}>
        <div className={style.inputContainer}>
          Ditt navn
          <input
            id="name"
            type="text"
            defaultValue={donor.name}
            className={style.input}
            onChange={(e) => {
              setDonor({ ...donor, name: e.target.value });
            }}
          />
        </div>
        <div className={style.inputContainer}>
          E-post
          <input id="email" type="email" disabled value={donor.email} className={style.input} />
        </div>
        <div className={style.inputContainer}>
          <EffektCheckbox
            checked={donor.newsletter}
            onChange={() => {
              setDonor({ ...donor, newsletter: !donor.newsletter });
            }}
          >
            Send meg nyhetsbrev på e-post
          </EffektCheckbox>
        </div>
        <EffektButton role={"submit"} onClick={saveDonor} cy="btn-save">
          Lagre
        </EffektButton>
      </section>
    </>
  );
};

const successToast = () => toast.success("Lagret", { icon: <Check size={24} color={"black"} /> });
const failureToast = () =>
  toast.error("Noe gikk galt", { icon: <AlertCircle size={24} color={"black"} /> });
