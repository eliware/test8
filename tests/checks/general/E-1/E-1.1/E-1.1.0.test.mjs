import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.1/E-1.1.0.mjs";

const readme = `# [![eliware.org](https://eliware.org/logos/brand.png)](https://github.com/eliware/fixture)
## Purpose
A maintained fixture.
## Requirements
Node.js 26.
## Setup
Install dependencies.
## Configuration
Use package.json.
## Usage
Run the test command.
## Validation
Run validation.
## Operations
Use the runbooks.
## Security
Do not commit secrets.
## Support
Use GitHub issues.
## License
[license](LICENSE)
Description: Fixture project.
Keywords: fixture.
Author: Eliware.
Repository: https://github.com/eliware/fixture
License: MIT.
[![CI](https://github.com/eliware/fixture/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/fixture/actions/workflows/nodejs.yml)
`;

test("accepts a complete branded project README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-readme-"));
  await writeFile(join(root, "README.md"), readme);
  await expect(run({ root, packageJson: { description: "Fixture project.", keywords: ["fixture"], author: "Eliware", repository: "https://github.com/eliware/fixture", license: "MIT" } })).resolves.toEqual({ ruleId: "E-1.1.0", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});

test("reports missing README sections", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-readme-"));
  await writeFile(join(root, "README.md"), "# fixture");
  await expect(run({ root, packageJson: {} })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("Purpose") }));
  await rm(root, { recursive: true, force: true });
});
