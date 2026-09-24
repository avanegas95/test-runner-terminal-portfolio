import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume — Anderson Vanegas",
};

export default function ResumePage() {
  return (
    <main className="plain-page">
      <p className="plain-page__eyebrow">{"// Resume"}</p>
      <h1 className="plain-page__title">Resume</h1>
      <p className="plain-page__text">
        Full resume PDF coming soon. Career highlights are in the{" "}
        <Link href="/#boston-dynamics">Boston Dynamics</Link> and{" "}
        <Link href="/#sharkninja">SharkNinja</Link> test panels on the{" "}
        <Link href="/">homepage</Link>.
      </p>
    </main>
  );
}
