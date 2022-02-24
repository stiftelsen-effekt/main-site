import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useApi } from "../../hooks/useApi";
import { Donor } from "../../models";
import style from "../../styles/Profile.module.css";
import { save } from "./_queries";

export const ProfileInfo: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [donor, setDonor] = useState<null | Donor>(null);

  const { loading, error, data } = useApi<Donor>(
    `/donors/${user ? user["https://konduit.no/user-id"] : ""}/`,
    "GET",
    "read:donations",
    getAccessTokenSilently,
  );

  if (loading || !user)  {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Noe gikk galt </div>
  } else if (!donor) {
    setDonor(data)
    return <div>Loading...</div>;
  };
  
 const saveDonor = async () => {
   const token = await getAccessTokenSilently();
   const result = await save(donor, user, token)
   if (result === null) {
     failureToast();
   } else {
     successToast();
     setDonor(donor);
   }
 }

  return (
    <>
      <h1 className={style.header}>Hei {donor.name}!</h1>
      <section className={style.personalInfo}>
        <hr />
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
        <button role={"submit"} className={style.button} onClick={saveDonor}>
          Lagre
        </button>
        <ToastContainer
          theme="dark"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </section>
    </>
  );
};

const successToast = () => toast.success("Endringene dine er lagret");
const failureToast = () => toast.error("Noe gikk galt, prøv på nytt");