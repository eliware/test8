# `@eliware/test` contributor guidance

Applies to: repository-wide.

This is the native v8 implementation of the shared Eliware deterministic
validation CLI. The older repository is reference material only; test8 does
not provide a compatibility layer.

Before changing files, read `README.md`, this file, and the applicable
documentation and specifications under `docs/` and `specs/`.

## Rules

- Use Node.js 26, native ESM, and `.mjs` source and test files.
- Runtime commands are the package scripts in `package.json`; `.env.example`
  documents the repository's environment configuration, and no runtime secret
  or local `.env` file belongs in version control.
- The CLI entrypoint is `bin/eliware-test.mjs`. Supported modes include the
  default validation run, `--lint`, `--format`, `--format-check`, `--help`,
  `--version`, focused Jest arguments, and the documented diagnostic flags.
  Usage validation rejects unsupported or missing paths before Jest starts.
- Platform-specific process behavior must use Node APIs and argument arrays;
  do not assume a Unix shell or platform-specific executable names.
- Keep new modules single-purpose and keep orchestrators limited to composition.
- Exercise new modules through the existing Jest suites where possible; add
  mirrored test files when required by applicable conventions or explicitly
  requested.
- Keep fixtures and source-less test support under one root `artifacts/` directory.
- Add new orchestrators, sub-orchestrators, adapters, and registry modules;
  do not add v8 behavior to the older reference repository.
- Preserve stable rule IDs, deterministic diagnostics, and the public CLI boundary.
- Do not commit secrets, private runtime state, or generated output.
- Web-specific repositories must document routes, assets, configuration,
  browser validation, deployment boundaries, and assigned ports.
- Library-specific repositories must document the public API, exports,
  declarations, compatibility expectations, packaging, and consumer validation.
- Application-specific repositories must document configuration validation,
  connection lifecycle, repeatable shutdown, and externally observable workflows.
- Repository identity, purpose, scope, boundaries, subdirectory instructions,
  security handling, deviations, required files, and validation commands are
  documented here; contributors must read README.md, AGENTS.md, and applicable
  documentation before changes.

## Validation

Run `npm test`, `npm run lint`, `npm run format:check`, and `git diff --check`.

The self-hosting scripts use the local CLI because `@eliware/test` cannot
install itself as its own development dependency.
