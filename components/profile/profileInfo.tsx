import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { AlertCircle, Check } from "react-feather";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/useApi";
import { Donor } from "../../models";
import style from "../../styles/Profile.module.css";
import { EffektButton } from "../elements/effektbutton";
import { DonorContext } from "./donorProvider";
import { save } from "./_queries";

export const ProfileInfo: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const { donor: initialDonor, setDonor: setGlobalDonor } = useContext(DonorContext);
  const [donor, setDonor] = useState<Donor | null>(initialDonor);

  if (!donor || !user)
    return <div>Whaaat..</div>

  const saveDonor = async () => {
    const token = await getAccessTokenSilently();
    const result = await save(donor, user, token)
    if (result === null) {
      failureToast();
    } else {
      successToast();
      setGlobalDonor(donor);
    }
  }

  return (
    <>
      <h1 className={style.header}>Hei {donor.name.split(" ")[0]}!</h1>
      <section className={style.personalInfo}>
        Ditt navn <br />
        <input
          id="name"
          type="text"
          defaultValue={donor.name}
          className={style.input}
          onChange={(e) => {
            setDonor({ ...donor, name: e.target.value });
          }}
        />{" "}
        <br /> <br />
        E-post <br />
        <input
          id="email"
          type="email"
          disabled
          value={donor.email}
          className={style.input}
        />{" "}
        <br /> <br />
        Fødselsnummer / Organisasjonsnummer <br />
        <input
          id="ssn"
          type="text"
          defaultValue={donor.ssn}
          className={style.input}
          onChange={(e) => {
            setDonor({ ...donor, ssn: e.target.value });
          }}
        />{" "}
        <br /> <br />
        <input
          type="checkbox"
          className={donor.newsletter ? style.checkboxActive : style.checkbox}
          checked={donor.newsletter}
          onChange={() => {
            setDonor({ ...donor, newsletter: !donor.newsletter });
          }}
        />{" "}
        Send meg nyhetsbrev på e-post <br />
        <br />
        <EffektButton role={"submit"} onClick={saveDonor} cy="btn-save">
          Lagre
        </EffektButton>
      </section>
    </>
  );
};

const successToast = () => toast.success("Lagret", { icon: <Check size={24} color={'black'}/> });
const failureToast = () => toast.error("Noe gikk galt", { icon: <AlertCircle size={24} color={'black'}/> });