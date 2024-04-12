import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { AlertCircle, Check } from "react-feather";
import { toast } from "react-toastify";
import { Donor } from "../../../../models";
import style from "./ProfileInfo.module.scss";
import { DonorContext } from "../../layout/donorProvider";
import { saveDonor } from "../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { EffektCheckbox } from "../../../shared/components/EffektCheckbox/EffektCheckbox";

export type ProfilePageInfoConfiguration = {
  name_label: string;
  email_label: string;
  newsletter_label: string;
  save_button_label: string;
  success_message: string;
  failure_message: string;
};

export const ProfileInfo: React.FC<{
  config: ProfilePageInfoConfiguration;
  titleTemplate: string;
}> = ({ config, titleTemplate }) => {
  const { getAccessTokenSilently, user } = useAuth0();

  const { donor: initialDonor, setDonor: setGlobalDonor } = useContext(DonorContext);
  const [donor, setDonor] = useState<Donor | null>(initialDonor);

  if (!donor || !user) return <div>Noe gikk galt.</div>;

  const save = async () => {
    const token = await getAccessTokenSilently();
    const result = await saveDonor(donor, user, token);
    if (result === null) {
      failureToast(config.failure_message);
    } else {
      successToast(config.success_message);
      setGlobalDonor(donor);
    }
  };

  return (
    <>
      <h3 className={style.header}>
        {titleTemplate.replace("{{name}}", donor.name ? " " + donor.name.split(" ")[0] : "")}
      </h3>
      <section className={style.personalInfo}>
        <div className={style.inputContainer}>
          {config.name_label}
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
          {config.email_label}
          <input id="email" type="email" disabled value={donor.email} className={style.input} />
        </div>
        <div className={style.inputContainer}>
          <EffektCheckbox
            checked={donor.newsletter}
            onChange={() => {
              setDonor({ ...donor, newsletter: !donor.newsletter });
            }}
          >
            {config.newsletter_label}
          </EffektCheckbox>
        </div>
        <EffektButton role={"submit"} onClick={save} cy="btn-save">
          {config.save_button_label}
        </EffektButton>
      </section>
    </>
  );
};

const successToast = (msg: string) =>
  toast.success(msg, { icon: <Check size={24} color={"black"} /> });
const failureToast = (msg: string) =>
  toast.error(msg, { icon: <AlertCircle size={24} color={"black"} /> });
