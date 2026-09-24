import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Anderson Vanegas",
};

export default function ContactPage() {
  return (
    <main style={{ padding: "72px 80px", maxWidth: 720 }}>
      <p style={{ color: "var(--dim)", fontSize: 14 }}>{"// Contact"}</p>
      <h1 style={{ color: "var(--text-strong)", fontSize: 32, margin: "8px 0 16px" }}>
        Contact
      </h1>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "24px 0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          lineHeight: 1.75,
        }}
      >
        <li>
          <span style={{ color: "var(--dim)" }}>Email</span>{" "}
          <a href="mailto:avanegas95@gmail.com">avanegas95@gmail.com</a>
        </li>
        <li>
          <span style={{ color: "var(--dim)" }}>LinkedIn</span>{" "}
          <a
            href="https://www.linkedin.com/in/avanegas95/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/avanegas95
          </a>
        </li>
        <li>
          <span style={{ color: "var(--dim)" }}>GitHub</span>{" "}
          <a
            href="https://github.com/avanegas95"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/avanegas95
          </a>
        </li>
      </ul>
      <p style={{ color: "var(--muted)" }}>
        <Link href="/">← Back to test run</Link>
      </p>
    </main>
  );
}
