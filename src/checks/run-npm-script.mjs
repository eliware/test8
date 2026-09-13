import { spawn } from "node:child_process";

const MAX_OUTPUT_LENGTH = 100_000;

function npmCommand() {
  return process.env.npm_execpath
    ? [process.execPath, [process.env.npm_execpath]]
    : [process.platform === "win32" ? "npm.cmd" : "npm", []];
}

function execute(command, args, options) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout = `${stdout}${chunk.toString()}`.slice(0, MAX_OUTPUT_LENGTH);
    });
    child.stderr.on("data", (chunk) => {
      stderr = `${stderr}${chunk.toString()}`.slice(0, MAX_OUTPUT_LENGTH);
    });
    child.on("error", reject);
    child.on("close", (code, signal) => resolveResult({ code, signal, stdout, stderr }));
  });
}

export function buildNpmScriptArguments(scriptName) {
  return ["run", scriptName, "--silent"];
}

export async function runNpmScript(root, scriptName, run = execute) {
  const [command, prefix] = npmCommand();
  return run(command, [...prefix, ...buildNpmScriptArguments(scriptName)], { cwd: root });
}
