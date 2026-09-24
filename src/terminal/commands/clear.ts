import { type Command } from "../types";

export const clearCommand: Command = {
  name: "clear",
  summary: "Clear the terminal screen",
  usage: "clear",
  details: "Clears all output. Also bound to Ctrl+L.",
  examples: ["clear"],
  group: "Session",
  run() {
    return { lines: [], effects: [{ type: "clear" }] };
  },
};
