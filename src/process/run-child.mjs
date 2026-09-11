import { spawn } from "node:child_process";

const MAX_OUTPUT_LENGTH = 100_000;

export function runChild(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > MAX_OUTPUT_LENGTH) stdout = `${stdout.slice(0, MAX_OUTPUT_LENGTH)}…`;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > MAX_OUTPUT_LENGTH) stderr = `${stderr.slice(0, MAX_OUTPUT_LENGTH)}…`;
    });
    child.on("error", reject);
    child.on("close", (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
}
