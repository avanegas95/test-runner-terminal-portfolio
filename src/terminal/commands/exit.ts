import { line, text, type Command } from "../types";

export const exitCommand: Command = {
  name: "exit",
  aliases: ["quit"],
  summary: "Close the terminal drawer",
  usage: "exit",
  details: "Closes the terminal and returns focus to the page.",
  examples: ["exit"],
  group: "Session",
  run() {
    return {
      lines: [line(text("Goodbye!", "dim"))],
      effects: [{ type: "close" }],
    };
  },
};
