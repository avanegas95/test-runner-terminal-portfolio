import { line, text, type Command } from "../types";

const STEPS: { title: string; body: string; tryCmd: string }[] = [
  {
    title: "Welcome",
    body: "This terminal is a playful way to explore Anderson's resume. You type commands; the computer responds. Don't worry — you can't break anything.",
    tryCmd: "ls",
  },
  {
    title: "List files (ls)",
    body: "A directory is a folder. ls lists what's inside the current folder. Files and folders with a / are directories you can cd into.",
    tryCmd: "ls",
  },
  {
    title: "Read a file (cat)",
    body: "cat prints a file's contents. Start with the welcome README.",
    tryCmd: "cat README.md",
  },
  {
    title: "Change folder (cd)",
    body: "cd moves you into a subfolder. experience/ holds work history.",
    tryCmd: "cd experience",
  },
  {
    title: "Look around",
    body: "ls again inside experience to see company folders.",
    tryCmd: "ls",
  },
  {
    title: "Go back (cd ..)",
    body: "cd .. moves up one folder, like the back button in a file browser.",
    tryCmd: "cd ..",
  },
  {
    title: "Run tests (pytest)",
    body: "pytest runs Anderson's resume as a test suite — 14 pass, 1 fails on purpose (the flaky-test joke).",
    tryCmd: "pytest",
  },
  {
    title: "Known Issues",
    body: "The intentional failure points here — hobbies filed like bug reports.",
    tryCmd: "cat KNOWN_ISSUES.md",
  },
  {
    title: "Done",
    body: "Type exit to close the terminal, or keep exploring. Everything here is also on the page above — no terminal required.",
    tryCmd: "exit",
  },
];

export const tutorialCommand: Command = {
  name: "tutorial",
  summary: "Guided walkthrough for newcomers",
  usage: "tutorial",
  details:
    "Step-by-step tour in plain English with clickable try-it examples: ls → cat → cd → pytest → exit.",
  examples: ["tutorial"],
  group: "Info",
  run() {
    const lines = [
      line(text("Portfolio Terminal Tutorial", "bold")),
      line(text("=".repeat(40), "dim")),
      line(text("")),
    ];

    STEPS.forEach((step, i) => {
      lines.push(
        line(text(`Step ${i + 1}: ${step.title}`, "accent")),
        line(text(`  ${step.body}`)),
        line(
          text("  ▸ try it: ", "dim"),
          text(step.tryCmd, "accent", { run: step.tryCmd }),
        ),
        line(text("")),
      );
    });

    return { lines };
  },
};
