import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const MAX_OUTPUT_LENGTH = 100_000;

export function buildOxlintArguments() {
  return ["--deny-warnings", "."];
}

export async function resolveOxlintExecutable() {
  const require = createRequire(import.meta.url);
  const packagePath = require.resolve("oxlint/package.json");
  const metadata = JSON.parse(await readFile(packagePath, "utf8"));
  const binary = typeof metadata.bin === "string" ? metadata.bin : metadata.bin?.oxlint;
  if (!binary) throw new Error("Oxlint package does not declare an executable.");
  return resolve(dirname(packagePath), binary);
}

function execute(command, args, options) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    for (const [stream, name] of [[child.stdout, "stdout"], [child.stderr, "stderr"]]) {
      stream.on("data", (chunk) => {
        const value = name === "stdout" ? stdout : stderr;
        const next = `${value}${chunk.toString()}`;
        if (name === "stdout") stdout = next.slice(0, MAX_OUTPUT_LENGTH);
        else stderr = next.slice(0, MAX_OUTPUT_LENGTH);
      });
    }
    child.on("error", reject);
    child.on("close", (code, signal) => resolveResult({ code, signal, stdout, stderr }));
  });
}

export async function runOxlint(root, run = execute) {
  const executable = await resolveOxlintExecutable();
  return run(process.execPath, [executable, ...buildOxlintArguments()], { cwd: root });
}
