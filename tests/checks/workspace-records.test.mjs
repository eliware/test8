import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/workspace/A-1.110.2.mjs";
import { run as runSchema } from "../../src/checks/workspace/A-1.110.3.mjs";

const validRecord = {
  id: "runbook-1",
  purpose: "Validate a workspace record",
  owner: "test",
  boundaries: { owns: ["validation"], excludes: ["deployment"] },
  steps: ["run validation"],
};

test("accepts valid runbook records", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-"));
  await writeFile(join(root, "runbooks.json"), JSON.stringify({ runbooks: [validRecord] }));
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.110.2", status: "pass" });
});

test("rejects incomplete workspace records", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-"));
  await writeFile(join(root, "workflows.json"), JSON.stringify({ workflows: [{ id: "broken" }] }));
  await expect(run({ root })).resolves.toMatchObject({ ruleId: "A-1.110.2", status: "fail" });
});

test("validates item records, duplicate IDs, boundaries, and steps", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-"));
  await writeFile(
    join(root, "workflows.json"),
    JSON.stringify({ items: [validRecord, validRecord] }),
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(
    join(root, "workflows.json"),
    JSON.stringify({ items: [{ ...validRecord, boundaries: {}, steps: [] }] }),
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "workflows.json"), JSON.stringify({}));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "workflows.json"), JSON.stringify({ items: [{}] }));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "runbooks.json"), "not-json");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("rejects workspace records missing declared schema fields and index", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-"));
  await writeFile(
    join(root, "records.json"),
    JSON.stringify({ schema: { requiredFields: ["status"] }, items: [{}] }),
  );
  await expect(runSchema({ root })).resolves.toMatchObject({ ruleId: "A-1.110.3", status: "fail" });
});

test("rejects a malformed workspace schema declaration", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-"));
  await writeFile(join(root, "records.json"), JSON.stringify({ schema: {}, items: [] }));
  await expect(runSchema({ root })).resolves.toMatchObject({ ruleId: "A-1.110.3", status: "fail" });
});

test("accepts indexed schema records and handles collections without records", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-workspace-"));
  await writeFile(
    join(root, "records.json"),
    JSON.stringify({ schema: { requiredFields: ["status"] }, items: [{ status: "ready" }] }),
  );
  await expect(runSchema({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "README.md"), "records.json\n");
  await expect(runSchema({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "noschema.json"), JSON.stringify({ value: "none" }));
  await expect(runSchema({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "README.md"), "wrong index\n");
  await expect(runSchema({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(
    join(root, "empty.json"),
    JSON.stringify({ schema: { requiredFields: ["status"] }, value: "none" }),
  );
  await writeFile(join(root, "README.md"), "records.json\n");
  await expect(runSchema({ root })).resolves.toMatchObject({ status: "pass" });
  await mkdir(join(root, "nested"));
  await writeFile(join(root, "nested", "bad.json"), "not-json");
  await expect(runSchema({ root })).resolves.toMatchObject({ status: "fail" });
});
