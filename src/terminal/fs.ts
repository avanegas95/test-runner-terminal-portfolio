import {
  getFileContent,
  getVirtualFile,
  isHidden,
  VIRTUAL_DIRS,
} from "./files";

export const HOME = "/home/anderson";

export type DirEntry = {
  name: string;
  path: string;
  isDir: boolean;
  hidden: boolean;
};

/** Normalize a path: collapse slashes, resolve . and .. */
export function normalizePath(path: string, cwd: string, home: string): string {
  let raw = path;
  if (raw.startsWith("~")) {
    raw = raw === "~" ? home : home + raw.slice(1);
  } else if (!raw.startsWith("/")) {
    raw = cwd === "/" ? `/${raw}` : `${cwd}/${raw}`;
  }

  const parts = raw.split("/").filter(Boolean);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }

  return stack.length === 0 ? "/" : "/" + stack.join("/");
}

/** Path relative to home (~), e.g. experience/boston_dynamics */
export function relativeToHome(absPath: string, home: string): string {
  if (absPath === home) return "";
  if (absPath.startsWith(home + "/")) {
    return absPath.slice(home.length + 1);
  }
  return absPath;
}

/** Display path for prompt: ~ or ~/subdir */
export function displayPath(absPath: string, home: string): string {
  if (absPath === home) return "~";
  if (absPath.startsWith(home + "/")) {
    return "~" + absPath.slice(home.length);
  }
  return absPath;
}

export function resolvePath(
  input: string,
  cwd: string,
  home: string = HOME,
): string {
  return normalizePath(input, cwd, home);
}

function dirKey(relativePath: string): string {
  return relativePath.replace(/\/$/, "");
}

export function isDirectory(absPath: string, home: string = HOME): boolean {
  const rel = relativeToHome(absPath, home);
  return dirKey(rel) in VIRTUAL_DIRS;
}

export function listDirectory(
  absPath: string,
  home: string = HOME,
  options: { all?: boolean } = {},
): DirEntry[] {
  const rel = relativeToHome(absPath, home);
  const key = dirKey(rel);

  if (!(key in VIRTUAL_DIRS)) {
    return [];
  }

  const names = VIRTUAL_DIRS[key]!;
  const entries: DirEntry[] = [];

  for (const name of names) {
    const hidden = isHidden(name);
    if (hidden && !options.all) continue;

    const childRel = rel ? `${rel}/${name}` : name;
    const childAbs = `${home}/${childRel}`;
    const childIsDir = childRel in VIRTUAL_DIRS;

    entries.push({
      name,
      path: childAbs,
      isDir: childIsDir,
      hidden,
    });
  }

  return entries.sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function readFile(absPath: string, home: string = HOME): string | null {
  const rel = relativeToHome(absPath, home);
  if (rel in VIRTUAL_DIRS) return null;
  return getFileContent(rel);
}

export function fileExists(absPath: string, home: string = HOME): boolean {
  const rel = relativeToHome(absPath, home);
  if (rel in VIRTUAL_DIRS) return true;
  return getVirtualFile(rel) !== undefined;
}

export function pathIsDir(absPath: string, home: string = HOME): boolean {
  const rel = relativeToHome(absPath, home);
  return dirKey(rel) in VIRTUAL_DIRS;
}

/** Build tree lines for the tree command */
export function buildTree(
  absPath: string,
  home: string = HOME,
  prefix = "",
  isLast = true,
): string[] {
  const rel = relativeToHome(absPath, home);
  const name =
    absPath === home ? "~" : (rel.split("/").pop() ?? rel) || "~";
  const connector = prefix ? (isLast ? "└── " : "├── ") : "";
  const lines: string[] = [`${prefix}${connector}${name}${rel in VIRTUAL_DIRS || absPath === home ? "/" : ""}`];

  if (!(dirKey(rel) in VIRTUAL_DIRS) && absPath !== home) {
    return lines;
  }

  const entries = listDirectory(absPath === "/" ? home : absPath, home, {
    all: false,
  });
  const childPrefix = prefix + (prefix ? (isLast ? "    " : "│   ") : "");

  entries.forEach((entry, i) => {
    const last = i === entries.length - 1;
    lines.push(
      ...buildTree(entry.path, home, childPrefix, last),
    );
  });

  return lines;
}

/** All file/dir paths under home for tab completion */
export function allPaths(home: string = HOME): string[] {
  const paths: string[] = [];

  function walk(rel: string) {
    if (rel) paths.push(`${home}/${rel}`);
    const key = dirKey(rel);
    if (!(key in VIRTUAL_DIRS)) return;
    for (const name of VIRTUAL_DIRS[key]!) {
      const child = rel ? `${rel}/${name}` : name;
      if (child in VIRTUAL_DIRS || VIRTUAL_DIRS[child.split("/")[0] ?? ""]) {
        walk(child);
      } else {
        paths.push(`${home}/${child}`);
      }
    }
  }

  walk("");
  return paths;
}
