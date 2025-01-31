import Link from "next/link";
import { Eye, LogOut } from "react-feather";

import styles from "./PreviewBlock.module.scss";

export const PreviewBlock: React.FC = () => {
  return (
    <div className={styles.container}>
      <Eye size={"0.8rem"} />
      <span>In preview</span>
      <span className={styles.divider}>|</span>
      <Link href="/api/exit-preview" className={styles.exitLink}>
        <span>Exit preview</span>
        <LogOut size={"0.8rem"} />
      </Link>
    </div>
  );
};
