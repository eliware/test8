import { runChild } from "./run-child.mjs";

export function buildJestArguments(args) {
  const focusedPath = args.find((argument) => /^(?:tests?|specs?)\//.test(argument));
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

export function runJest(root, args = [], execute = runChild) {
  const nodeOptions = process.env.NODE_OPTIONS?.includes("--experimental-vm-modules")
    ? process.env.NODE_OPTIONS
    : `${process.env.NODE_OPTIONS ?? ""} --experimental-vm-modules`.trim();
  return execute("node", ["node_modules/jest/bin/jest.js", ...buildJestArguments(args)], {
    cwd: root,
    env: { ...process.env, NODE_OPTIONS: nodeOptions },
  });
}
