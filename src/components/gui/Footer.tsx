import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>
          Tested with pytest + Playwright
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          Built with Next.js
        </p>
        <p className={styles.mono}>
          <span className={styles.pass} aria-hidden="true">
            ●
          </span>{" "}
          14 passed,{" "}
          <span className={styles.fail} aria-hidden="true">
            ●
          </span>{" "}
          1 failed — working as intended
        </p>
      </div>
    </footer>
  );
}
