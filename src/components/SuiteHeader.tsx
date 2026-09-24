import type { TestStatus } from "@/content/types";

type SuiteHeaderProps = {
  file: string;
  status: TestStatus;
  mobile?: boolean;
  revealDelay?: number;
  animate?: boolean;
};

export function SuiteHeader({
  file,
  status,
  mobile,
  revealDelay,
  animate,
}: SuiteHeaderProps) {
  const badgeClass =
    status === "pass" ? "badge badge--pass" : "badge badge--fail";
  const mobileBadge = mobile ? " badge--mobile" : "";

  return (
    <div
      className={`suite-header${mobile ? " suite-header--mobile" : ""}${animate ? " reveal-line" : ""}`}
      style={animate && revealDelay !== undefined ? { animationDelay: `${revealDelay}s` } : undefined}
    >
      <span className={`${badgeClass}${mobileBadge}`}>
        {status === "pass" ? "PASS" : "FAIL"}
      </span>
      <span>{file}</span>
    </div>
  );
}
