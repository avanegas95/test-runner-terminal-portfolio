import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume — Anderson Vanegas",
};

export default function ResumePage() {
  return (
    <main style={{ padding: "72px 80px", maxWidth: 720 }}>
      <p style={{ color: "var(--dim)", fontSize: 14 }}>{"// Resume"}</p>
      <h1 style={{ color: "var(--text-strong)", fontSize: 32, margin: "8px 0 16px" }}>
        Resume
      </h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
        Full resume PDF coming soon. Career highlights are in the{" "}
        <Link href="/#boston-dynamics">Boston Dynamics</Link> and{" "}
        <Link href="/#sharkninja">SharkNinja</Link> test panels on the{" "}
        <Link href="/">homepage</Link>.
      </p>
    </main>
  );
}
