import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/library/A-1.40.1.mjs";

async function createExamplesRoot() {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-examples-"));
  await mkdir(join(root, "examples"));
  await writeFile(join(root, "examples", "README.md"), "Examples\n");
  return root;
}

test("accepts a scoped library with a runnable example", async () => {
  const root = await createExamplesRoot();
  await writeFile(join(root, "examples", "basic.mjs"), "console.log('ok');\n");

  await expect(run({ root, packageJson: { name: "@eliware/example" } })).resolves.toMatchObject({
    ruleId: "A-1.40.1",
    status: "pass",
  });
});

test("rejects a library without examples README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-examples-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.1",
    status: "fail",
    message: "Libraries require examples/README.md.",
  });
});

test("rejects an examples directory without a runnable example", async () => {
  const root = await createExamplesRoot();

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.1",
    status: "fail",
    message: "Libraries require a runnable example under examples/.",
  });
});

test("rejects an examples path that is not a directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-examples-"));
  await writeFile(join(root, "examples"), "not a directory\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.1",
    status: "fail",
    message: "Libraries require examples/README.md.",
  });
});

test("rejects an unscoped public library", async () => {
  const root = await createExamplesRoot();
  await writeFile(join(root, "examples", "basic.mjs"), "console.log('ok');\n");

  await expect(run({ root, packageJson: { name: "other-library" } })).resolves.toMatchObject({
    ruleId: "A-1.40.1",
    status: "fail",
    message: "Public Eliware libraries must use the @eliware scope.",
  });
});
