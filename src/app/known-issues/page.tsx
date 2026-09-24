import type { Metadata } from "next";
import { PortfolioPage } from "@/components/PortfolioPage";

export const metadata: Metadata = {
  title: "Known Issues — Anderson Vanegas",
  description:
    "The person behind the test plans, filed like a bug report.",
};

export default function KnownIssuesPage() {
  return (
    <PortfolioPage initialMode="known-issues" initialExpandedId="flaky-test" />
  );
}
