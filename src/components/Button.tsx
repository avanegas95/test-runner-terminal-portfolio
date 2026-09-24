import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  sidebar?: boolean;
  small?: boolean;
  mobile?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  onClick,
  primary,
  sidebar,
  small,
  mobile,
  disabled,
  className = "",
  children,
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
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
