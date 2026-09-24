import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Anderson Vanegas",
};

export default function ContactPage() {
  return (
    <main className="plain-page">
      <p className="plain-page__eyebrow">{"// Contact"}</p>
      <h1 className="plain-page__title">Contact</h1>
      <ul className="plain-page__links">
        <li>
          <span className="plain-page__label">Email</span>{" "}
          <a href="mailto:avanegas95@gmail.com">avanegas95@gmail.com</a>
        </li>
        <li>
          <span className="plain-page__label">LinkedIn</span>{" "}
          <a
            href="https://www.linkedin.com/in/avanegas95/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/avanegas95
          </a>
        </li>
        <li>
          <span className="plain-page__label">GitHub</span>{" "}
          <a
            href="https://github.com/avanegas95"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/avanegas95
          </a>
        </li>
      </ul>
      <p className="plain-page__text">
        <Link href="/">← Back to test run</Link>
      </p>
    </main>
  );
}
