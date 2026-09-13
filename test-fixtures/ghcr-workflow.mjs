import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const agents = "GHCR image visibility publication workflow provenance deployment managed image.";
const validation = "name: validation\non:\n  push:\n  pull_request:\njobs:\n  validate:\n    steps:\n      - run: npm ci\n      - run: npm test\n";
const publication = `name: publish
on:
  push:
    tags: ["v1.2.3"]
permissions:
  contents: read
  packages: write
  id-token: write
  attestations: write
jobs:
  publish:
    if: startsWith(github.ref, 'refs/tags/v')
    env:
      RELEASE_REF: refs/tags/v1.2.3
    steps:
      - uses: actions/checkout@v6
      - run: docker build -t ghcr.io/eliware/example:v1.2.3 .
      - run: docker push ghcr.io/eliware/example:v1.2.3
      - uses: actions/attest-build-provenance@v2
      - run: docker inspect ghcr.io/eliware/example@sha256:abc123
      - run: verify digest
`;

export async function createGhcrFixture() {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-ghcr-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, "AGENTS.md"), agents);
  await writeFile(join(root, "Dockerfile"), "FROM node:26\n");
  await writeFile(join(root, ".github", "workflows", "validation.yml"), validation);
  await writeFile(join(root, ".github", "workflows", "publish.yml"), publication);
  return { root, publicationPath: join(root, ".github", "workflows", "publish.yml") };
}
