import { line, text, type Command } from "../types";

export const echoCommand: Command = {
  name: "echo",
  summary: "Print arguments",
  usage: "echo [text…]",
  details: "Prints the arguments separated by spaces.",
  examples: ['echo "hello world"'],
  group: "Info",
  run(argv) {
    return { lines: [line(text(argv.join(" ")))] };
  },
};
