import { access } from "node:fs/promises";
import { extname, join } from "node:path";
import { runChild } from "./run-child.mjs";

function focusedPathFrom(args) {
  return args.find((argument) => /^(?:tests?|specs?)[\\/]/.test(argument));
}

export function buildJestArguments(args) {
  const focusedPath = focusedPathFrom(args);
  const forwarded = args.filter(
    (argument) =>
      argument !== focusedPath &&
      argument !== "--ignore-100x4" &&
      argument !== "--ignore-monolith-limits" &&
      argument !== "--debug-timing",
  );
  const concurrency = forwarded.includes("--no-runInBand") ? [] : ["--runInBand"];
  return [
    "--coverage",
    ...(focusedPath ? ["--runTestsByPath", focusedPath] : []),
    ...concurrency,
    ...forwarded,
  ];
}

async function resolveFocusedCoverage(root, focusedPath) {
  if (!focusedPath) return [];
  const normalized = focusedPath.replaceAll("\\", "/").replace(/^\.\//, "");
  const marker = normalized.match(/^(?:tests?|specs?)\/(.*)$/i);
  if (!marker || !/\.(?:test|spec)\.[^.]+$/i.test(marker[1])) return [];
  const sourceBase = marker[1].replace(/\.(?:test|spec)(?=\.[^.]+$)/i, "");
  const extension = extname(sourceBase);
  const sourcePath = join(root, "src", `${sourceBase.slice(0, -extension.length)}${extension}`);
  try {
    await access(sourcePath);
    return [`--collectCoverageFrom`, `src/${sourceBase}`];
  } catch {
    return [];
  }
}

export async function runJest(root, args = [], execute = runChild) {
  const focusedPath = focusedPathFrom(args);
  if (focusedPath) {
    const normalized = focusedPath.replaceAll("\\", "/").replace(/^\.\//, "");
    try {
      await access(join(root, normalized));
    } catch {
      throw new Error(`Focused test path does not exist: ${focusedPath}`);
    }
  }
  const focusedCoverage = await resolveFocusedCoverage(root, focusedPath);
  const nodeOptions = process.env.NODE_OPTIONS?.includes("--experimental-vm-modules")
    ? process.env.NODE_OPTIONS
    : `${process.env.NODE_OPTIONS ?? ""} --experimental-vm-modules`.trim();
  return execute(
    "node",
    [
      "node_modules/jest/bin/jest.js",
      ...buildJestArguments(args).slice(0, 1),
      ...focusedCoverage,
      ...buildJestArguments(args).slice(1),
    ],
    {
      cwd: root,
      env: { ...process.env, NODE_OPTIONS: nodeOptions },
    },
  );
}
