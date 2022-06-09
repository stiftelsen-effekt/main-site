import React from "react";
import styles from "../../styles/QuestionsAndAnswers.module.css";
import { Expander } from "./expander";

export const QuestionsAndAnswersGroup: React.FC<{ group: any }> = ({ group }) => {
  return (
    <>
      <div className={styles.grid} key={group._key || group._id}>
        <div className={styles.groupheader}>
          <h2>{group.title}</h2>
        </div>
        <div className={styles.groupanswers}>
          {group.answers.map((answer: any) => (
            <Expander
              key={answer._key}
              title={answer.question}
              content={answer.answer}
              links={answer.links}
            />
          ))}
        </div>
      </div>
    </>
  );
};