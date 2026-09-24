import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects — Anderson Vanegas",
};

export default function ProjectsPage() {
  return (
    <main style={{ padding: "72px 80px", maxWidth: 720 }}>
      <p style={{ color: "var(--dim)", fontSize: 14 }}>{"// Projects"}</p>
      <h1 style={{ color: "var(--text-strong)", fontSize: 32, margin: "8px 0 16px" }}>
        Projects
      </h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
        Project listings coming soon. In the meantime, explore the test run on the{" "}
        <Link href="/">homepage</Link> or reach out via{" "}
        <Link href="/contact">Contact</Link>.
      </p>
    </main>
  );
}
