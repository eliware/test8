import { execFile as nodeExecFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/general/A-1.6.2.mjs";

const execFile = promisify(nodeExecFile);

async function repository() {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-secrets-"));
  await execFile("git", ["init", "--quiet"], { cwd: root });
  return root;
}

test("accepts a repository without secret-like tracked paths", async () => {
  const root = await repository();
  await writeFile(join(root, "README.md"), "safe\n");
  await execFile("git", ["add", "README.md"], { cwd: root });
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.6.2", status: "pass", message: "" });
});

test("rejects tracked secret-like paths while allowing env examples", async () => {
  const root = await repository();
  await writeFile(join(root, ".env.example"), "TOKEN=placeholder\n");
  await mkdir(join(root, "credentials"));
  await writeFile(join(root, "credentials", "service.key"), "secret\n");
  await execFile("git", ["add", "."], { cwd: root });
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.6.2",
    status: "fail",
    message: expect.stringContaining("service.key"),
  });
});

test("reports git inspection failures", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-secrets-"));
  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.6.2",
    status: "fail",
    message: expect.stringContaining("Unable to inspect"),
  });
});
