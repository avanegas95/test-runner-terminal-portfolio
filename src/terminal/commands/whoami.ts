import { resume } from "@/content/resume";
import { line, text, type Command } from "../types";

export const whoamiCommand: Command = {
  name: "whoami",
  summary: "Print current user",
  usage: "whoami",
  details: "Shows who is logged in — always anderson on this portfolio.",
  examples: ["whoami"],
  group: "Info",
  run(_argv, ctx) {
    return {
      lines: [
        line(text(ctx.username)),
        line(text(resume.profile.title + " @ " + resume.profile.company, "dim")),
      ],
    };
  },
};
