import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.1/E-1.1.0.mjs";

const readme = `# [![eliware.org](https://eliware.org/logos/brand.png)](https://github.com/eliware/fixture)
## Purpose
## Requirements
## Setup
## Configuration
## Usage
## Validation
## Operations
## Security
## Support
## License
[license](LICENSE)
`;

test("accepts a complete branded project README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-readme-"));
  await writeFile(join(root, "README.md"), readme);
  await expect(run({ root, packageJson: {} })).resolves.toEqual({ ruleId: "E-1.1.0", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("reports missing README sections", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-readme-"));
  await writeFile(join(root, "README.md"), "# fixture");
  await expect(run({ root, packageJson: {} })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("Purpose") }));
  await rm(root, { recursive: true, force: true });
});
