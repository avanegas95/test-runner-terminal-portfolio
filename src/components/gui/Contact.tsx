import { resume } from "@/content/resume";
import shared from "./shared.module.css";
import styles from "./Contact.module.css";

export function Contact() {
  const { contact } = resume;

  return (
    <section
      id="contact"
      className={`${shared.section} ${styles.contact}`}
      data-testid="section-contact"
      aria-labelledby="contact-heading"
    >
      <div className={shared.inner}>
        <h2 id="contact-heading" className={shared.heading}>
          Contact
        </h2>
        <p className={shared.subheading}>
          Email, LinkedIn, or GitHub — no phone or street address on this site.
        </p>

        <ul className={styles.links}>
          <li>
            <a href={`mailto:${contact.email}`} className={styles.link}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{contact.email}</span>
            </a>
          </li>
          <li>
            <a
              href={contact.linkedIn}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.label}>LinkedIn</span>
              <span className={styles.value}>andersonvanegas</span>
            </a>
          </li>
          <li>
            <a
              href={contact.github}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.label}>GitHub</span>
              <span className={styles.value}>{contact.githubHandle}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
