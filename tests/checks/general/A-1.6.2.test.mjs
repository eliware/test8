import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { expect, test } from "@jest/globals";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/A-1.6.2.mjs";

const execFile = promisify(execFileCallback);

async function gitRoot() {
  const root = await mkdtemp(join(tmpdir(), "eliware-secrets-"));
  await execFile("git", ["init", "--quiet"], { cwd: root });
  await execFile("git", ["config", "user.email", "test@example.com"], { cwd: root });
  await execFile("git", ["config", "user.name", "test"], { cwd: root });
  return root;
}

test("rejects tracked secret-like paths but allows the example template", async () => {
  const root = await gitRoot();
  await writeFile(join(root, ".env.example"), "TOKEN=example\n");
  await execFile("git", ["add", ".env.example"], { cwd: root });
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "password.txt"), "not a real secret\n");
  await execFile("git", ["add", "password.txt"], { cwd: root });
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
