import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects — Anderson Vanegas",
};

export default function ProjectsPage() {
  return (
    <main className="plain-page">
      <p className="plain-page__eyebrow">{"// Projects"}</p>
      <h1 className="plain-page__title">Projects</h1>
      <p className="plain-page__text">
        Project listings coming soon. In the meantime, explore the test run on the{" "}
        <Link href="/">homepage</Link> or reach out via{" "}
        <Link href="/contact">Contact</Link>.
      </p>
    </main>
  );
}
