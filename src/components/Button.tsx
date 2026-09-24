import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  sidebar?: boolean;
  small?: boolean;
  mobile?: boolean;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  ariaExpanded?: boolean;
  ariaControls?: string;
};

export function Button({
  href,
  onClick,
  primary,
  sidebar,
  small,
  mobile,
  className = "",
  children,
  type = "button",
  ariaExpanded,
  ariaControls,
}: ButtonProps) {
  const classes = [
    "btn",
    primary && "btn--primary",
    sidebar && "btn--sidebar",
    small && "btn--small",
    mobile && "btn--mobile",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {children}
    </button>
  );
}
