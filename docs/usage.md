# Usage

Install dependencies with `npm ci`, then run `npm test` or
`npm run format:check`. Use `eliware-test --help` for the supported CLI modes,
including linting, formatting, timing diagnostics, focused Jest execution,
and explicit coverage or monolith enforcement opt-outs.

## Configuration

Repositories declare their applicable convention documents in
`package.json.eliware.apply`. Authorized rule exemptions are recorded in
`package.json.eliware.exempt` with the rule ID, reason, approver, approval
timestamp, and expiry.

The validator uses the repository's declared configuration and does not infer
applicability from its files, dependencies, or project shape.

## Common commands

```text
npm test
npm run lint
npm run format
npm run format:check
eliware-test --help
eliware-test --version
```

To validate one focused Jest path, pass it after the npm separator:

```text
npm test -- tests/example.test.mjs
```
