import { parseArgs } from "../parser";
import { parsePytestArgs, runPytest } from "../pytest";
import { line, text, type Command } from "../types";

export const pytestCommand: Command = {
  name: "pytest",
  summary: "Run the resume test suite",
  usage: "pytest [path] [-v] [-q] [-k expr] [-m marker] [--lf] [-x] [--html]",
  details:
    "Runs pytest against the portfolio test suite. Default output is verbose and human-friendly; -q shows compact dots. Every run ends with a plain-English recap and report link.",
  examples: [
    "pytest",
    "pytest -q",
    "pytest -k appium",
    "pytest -m regression",
    "pytest --lf",
    "pytest --html",
  ],
  group: "Run",
  run(argv) {
    const { positional, flags } = parseArgs(argv);
    const options = parsePytestArgs(positional, flags);
    return runPytest(options);
  },
};
