import { line, text, type Command } from "../types";

export const sudoCommand: Command = {
  name: "sudo",
  summary: "Attempt elevated privileges (easter egg)",
  usage: "sudo …",
  details: "Not available on this portfolio system.",
  examples: ["sudo rm -rf /"],
  group: "Info",
  run() {
    return {
      lines: [
        line(
          text(
            "anderson is not in the sudoers file. This incident will be reported (to QA).",
            "error",
          ),
        ),
      ],
    };
  },
};

export const rmCommand: Command = {
  name: "rm",
  summary: "Remove files (read-only FS)",
  usage: "rm …",
  details: "This filesystem is read-only.",
  examples: ["rm -rf /"],
  group: "Info",
  run(argv) {
    const joined = argv.join(" ");
    if (joined.includes("-rf") || joined.includes("-fr")) {
      return {
        lines: [
          line(text("rm: cannot remove '/': Read-only file system", "error")),
          line(text("(Nice try. QA would like a word.)", "dim")),
        ],
      };
    }
    return {
      lines: [line(text("rm: read-only file system", "error"))],
    };
  },
};

export const vimCommand: Command = {
  name: "vim",
  aliases: ["vi", "nano"],
  summary: "Text editor (easter egg)",
  usage: "vim [file]",
  details: "Opens vim. Good luck exiting.",
  examples: ["vim README.md"],
  group: "Info",
  run() {
    return {
      lines: [
        line(text("VIM - Vi IMproved", "accent")),
        line(text("")),
        line(text("…how do I exit?", "dim")),
        line(text("Hint: :q!  (or just close the terminal drawer)", "comment")),
      ],
    };
  },
};

export const pythonCommand: Command = {
  name: "python",
  aliases: ["python3"],
  summary: "Python interpreter (easter egg)",
  usage: "python",
  details: "Prints a Zen-of-QA line instead of a REPL.",
  examples: ["python"],
  group: "Info",
  run() {
    return {
      lines: [
        line(text(">>> import this", "dim")),
        line(text("The Zen of QA, by Anderson Vanegas", "accent")),
        line(text("")),
        line(text("Reproducible is better than flaky.")),
        line(text("Explicit is better than assumed.")),
        line(text("Simple checks beat mysterious failures.")),
        line(text("Flat is better than nested test plans.")),
        line(text("Readability counts — especially in bug reports.")),
      ],
    };
  },
};
