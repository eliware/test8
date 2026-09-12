# Test8 specifications

This directory contains the normative specification index for the Eliware
validation harness.

## Files

- [directives.json](directives.json) — harness directives.
- [authority.json](authority.json) — Test8-local authority distribution.

The CLI contract in `directives.json` defines the public stage flags, profile
applicability, focused versus aggregate behavior, formatter safety, and stable
exit-code precedence. Repository requirements and profile policy remain
authoritative in Eliware Conventions, including
[general.json](../../conventions/specs/general.json),
[cli.json](../../conventions/specs/cli.json), and
[npm-published.json](../../conventions/specs/npm-published.json); this
specification defines only how the harness exposes and enforces them.

The Docs authority map is the cross-repository tie-breaker, and Operations
remains authoritative for release, publication, deployment, and other
cross-cutting procedures. Test8 does not duplicate those policies or the
release handoff defined by Operations.

[Return to the root README](../README.md).
