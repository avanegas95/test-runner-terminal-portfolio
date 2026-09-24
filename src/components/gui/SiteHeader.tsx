"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { resume } from "@/content/resume";
import { useTerminalContext } from "@/components/terminal/TerminalProvider";
import shared from "./shared.module.css";
import styles from "./SiteHeader.module.css";

const NAV_ITEMS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { toggle } = useTerminalContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) {
        setResumeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="#hero" className={styles.logo}>
          <span className={styles.logoMark} aria-hidden="true">
            AV
          </span>
          <span className={styles.logoName}>{resume.profile.name.split(" ")[0]}</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={styles.navLink}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.resumeDropdown} ref={resumeRef}>
            <button
              type="button"
              className={`${shared.btn} ${shared.btnPrimary} ${styles.resumeBtn}`}
              aria-expanded={resumeOpen}
              aria-haspopup="true"
              onClick={() => setResumeOpen((v) => !v)}
            >
              Resume
              <span aria-hidden="true">▾</span>
            </button>
            {resumeOpen && (
              <ul className={styles.dropdownMenu} role="menu">
                <li role="none">
                  <Link
                    href="/Anderson_Vanegas_Resume.pdf"
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => setResumeOpen(false)}
                  >
                    Resume (PDF)
                  </Link>
                </li>
                <li role="none">
                  <Link
                    href="/report"
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => setResumeOpen(false)}
                  >
                    Test report view
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <button
            type="button"
            className={styles.terminalBtn}
            data-testid="terminal-toggle"
            onClick={toggle}
            aria-label="Open terminal"
          >
            <span className={styles.terminalIcon} aria-hidden="true">
              &gt;_
            </span>
            <span className={styles.terminalLabel}>Terminal</span>
            <kbd className={styles.kbd} aria-hidden="true">
              Ctrl+\`
            </kbd>
          </button>

          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className={styles.mobileNav} aria-label="Mobile">
          <ul className={styles.mobileNavList}>
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/Anderson_Vanegas_Resume.pdf"
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                Resume
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
