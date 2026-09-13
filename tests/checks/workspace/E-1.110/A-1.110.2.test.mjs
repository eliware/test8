import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/workspace/E-1.110/A-1.110.2.mjs";

test("validates runbook records", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-workspace-runbooks-"));
  await mkdir(join(root, "runbooks"));
  await writeFile(join(root, "README.md"), "runbooks/deploy.json#id=deploy");
  await writeFile(join(root, "runbooks", "README.md"), "index");
  await writeFile(join(root, "runbooks", "deploy.json"), JSON.stringify({ id: "deploy", purpose: "Deploy", owner: "Ops", boundaries: "Production", steps: ["verify"] }));
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.110.2", status: "pass", message: "" });
  await writeFile(join(root, "README.md"), "runbooks/deploy.json#id=missing");
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("missing") }));
  await rm(root, { recursive: true, force: true });
});
