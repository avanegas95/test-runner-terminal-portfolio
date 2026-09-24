import { displayPath, listDirectory, resolvePath } from "../fs";
import { line, text, type Command } from "../types";

export const lsCommand: Command = {
  name: "ls",
  summary: "List directory contents",
  usage: "ls [-a] [-l] [path]",
  details:
    "Shows files and folders in a directory. Directories are marked with a trailing slash and can be clicked to cd into them.",
  examples: ["ls", "ls -l experience", "ls -a"],
  group: "Navigate",
  run(argv, ctx) {
    const showAll = argv.includes("-a") || argv.some((a) => a === "-la" || a === "-al");
    const long = argv.includes("-l") || argv.some((a) => a === "-la" || a === "-al");
    const pathArgs = argv.filter((a) => !a.startsWith("-"));
    const target = pathArgs[0]
      ? resolvePath(pathArgs[0], ctx.cwd, ctx.home)
      : ctx.cwd;

    const entries = listDirectory(target, ctx.home, { all: showAll });
    if (entries.length === 0 && pathArgs[0]) {
      return {
        lines: [
          line(text(`ls: cannot access '${pathArgs[0]}': No such file or directory`, "error")),
        ],
      };
    }

    if (long) {
      return {
        lines: entries.map((e) =>
          line(
            text(e.isDir ? "d" : "-", "dim"),
            text("rwxr-xr-x ", "dim"),
            text(" 1 anderson anderson ", "dim"),
            text("  --- ", "dim"),
            text(
              e.isDir ? `${e.name}/` : e.name,
              e.isDir ? "dir" : "file",
              e.isDir
                ? { run: `cd ${displayPath(e.path, ctx.home)}` }
                : { run: `cat ${displayPath(e.path, ctx.home)}` },
            ),
          ),
        ),
      };
    }

    const segments = entries.flatMap((e, i) => {
      const seg = text(
        e.isDir ? `${e.name}/` : e.name,
        e.isDir ? "dir" : "file",
        e.isDir
          ? { run: `cd ${displayPath(e.path, ctx.home)}` }
          : { run: `cat ${displayPath(e.path, ctx.home)}` },
      );
      return i === 0 ? [seg] : [text("  "), seg];
    });

    return { lines: [line(...segments)] };
  },
};
