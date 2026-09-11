import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.20.8.mjs";

async function fixture(source, env = "API_KEY=example\n") {
  const root = await mkdtemp(join(tmpdir(), "eliware-env-"));
  await mkdir(join(root, "src"));
  await writeFile(join(root, "package.json"), JSON.stringify({ type: "module" }));
  await writeFile(join(root, "src", "index.mjs"), source);
  await writeFile(join(root, ".env.example"), env);
  return root;
}

const environmentReference = (name) => ["process", "env", name].join(".");

test("passes when environment variables are documented safely", async () => {
  const root = await fixture(`export const key = ${environmentReference("API_KEY")};\n`);
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});

test("fails when environment configuration has no example or is undocumented", async () => {
  const root = await fixture(
    `export const key = ${environmentReference("MISSING_KEY")};\n`,
    "API_KEY=example\n",
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});

test("does not require an example when no environment configuration is used", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-env-"));
  await writeFile(join(root, "package.json"), JSON.stringify({ type: "module" }));
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
