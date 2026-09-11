import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/workspace/A-1.110.2.mjs";

test("validates runbook and workflow records", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-workspace-"));
  await writeFile(
    join(root, "runbooks.json"),
    JSON.stringify({
      runbooks: [
        {
          id: "deploy",
          purpose: "deploy",
          owner: "ops",
          boundaries: { owns: [], excludes: [] },
          steps: ["run"],
        },
      ],
    }),
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "runbooks.json"), JSON.stringify({ runbooks: [{ id: "deploy" }] }));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
