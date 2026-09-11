import { spawnSync } from "node:child_process";

const result = spawnSync("npm", ["test"], { cwd: process.cwd(), stdio: "inherit", shell: false });
process.exitCode = result.status ?? 1;
