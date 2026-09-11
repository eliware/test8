import { dirname, join } from "node:path";

export function resolveNpmLauncher() {
  if (process.env.npm_execpath) return [process.execPath, process.env.npm_execpath];
  if (process.platform === "win32") {
    return [
      process.execPath,
      join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js"),
    ];
  }
  return ["npm", ""];
}
