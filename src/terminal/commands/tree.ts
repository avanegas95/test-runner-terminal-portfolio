import { buildTree, resolvePath } from "../fs";
import { line, text, type Command } from "../types";

export const treeCommand: Command = {
  name: "tree",
  aliases: ["tre"],
  summary: "Display directory tree",
  usage: "tree [path]",
  details: "Shows a visual tree of files and folders.",
  examples: ["tree", "tree experience"],
  group: "Navigate",
  run(argv, ctx) {
    const target = argv[0]
      ? resolvePath(argv[0], ctx.cwd, ctx.home)
      : ctx.cwd;

    const treeLines = buildTree(target, ctx.home);
    return {
      lines: treeLines.map((l) => line(text(l))),
    };
  },
};
