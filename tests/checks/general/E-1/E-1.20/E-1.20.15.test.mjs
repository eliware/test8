import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.15.mjs";

async function fixture(source, packageJson) {
  const root = await mkdtemp(join(tmpdir(), "eliware-barrel-"));
  await mkdir(join(root, "src"), { recursive: true });
  await writeFile(join(root, "src", "entry.mjs"), source);
  return { root, packageJson };
}

test("allows a declared public library entrypoint", async () => {
  const context = await fixture('export { value } from "./value.mjs";\n', {
    main: "src/entry.mjs",
    eliware: { apply: ["library"] },
  });
  await expect(run(context)).resolves.toMatchObject({ status: "pass" });
  await rm(context.root, { recursive: true, force: true });
});

test("rejects an internal pure export barrel", async () => {
  const context = await fixture('export { value } from "./value.mjs";\n', {
    main: "src/index.mjs",
    eliware: { apply: ["general"] },
  });
  await expect(run(context)).resolves.toMatchObject({ status: "fail" });
  await rm(context.root, { recursive: true, force: true });
});
