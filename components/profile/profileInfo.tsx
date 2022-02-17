import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useApi } from "../../hooks/useApi";
import { Donor } from "../../models";
import style from "../../styles/Profile.module.css";

export const ProfileInfo: React.FC = () => {
  const successToast = () =>
    toast.success("Endringene dine er lagret", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const failureToast = () =>
    toast.error("Noe gikk galt, prøv på nytt", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const warningToast = () =>
    toast.warn("Du har ikke lagt inn noen endringer", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const { getAccessTokenSilently, user } = useAuth0();

  const [donor, setDonor] = useState<null | Donor>(null);
  const [originalDonor, setOriginalDonor] = useState<null | Donor>(null);

  useApi<Donor>(
    `/donors/${user ? user["https://konduit.no/user-id"] : ""}/`,
    "GET",
    "read:donations",
    getAccessTokenSilently,
    (res) => {
      setDonor(res);
      setOriginalDonor(res);
    }
  );

  if (donor === null) {
    return <div>Loading...</div>;
  }

  async function save() {
    if (originalDonor == donor) {
      warningToast();
    } else {
      const token = await getAccessTokenSilently();
      const api = process.env.NEXT_PUBLIC_EFFEKT_API || 'http://localhost:5050'

      fetch(
        `${api}/donors/${
          user ? user["https://konduit.no/user-id"] : ""
        }/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          body: JSON.stringify(donor),
        }
      )
        .then((response) => response.json())
        .then((donor) => {
          successToast();
        })
        .catch((error) => {
          failureToast();
        });
      setOriginalDonor(donor);
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
        <button className={style.button} onClick={save}>
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
          limit={2}
        />
      </section>
    </>
  );
};
