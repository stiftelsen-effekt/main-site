import React from "react";
import styles from "../../styles/Contact.module.css";

export type ContactInfoProps = {
  title: string;
  description: string;
  email: string;
  phone: string;
};

export const ContactInfo: React.FC<ContactInfoProps> = ({ title, description, email, phone }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <p className="inngress">{description}</p>
      <div className={styles.channels}>
        <div>{email}</div>
        <div>{phone}</div>
      </div>
    </div>
  );
};
