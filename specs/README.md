# Test8 specifications

This directory contains the normative specification index for the Eliware
validation harness.

## Files

- [directives.json](directives.json) — harness directives.
- [authority.json](authority.json) — Test8-local authority distribution.

The CLI contract in `directives.json` defines the public stage flags, profile
applicability, focused versus aggregate behavior, formatter safety, and stable
exit-code precedence. Repository requirements and profile policy remain
authoritative in Eliware Conventions; this specification defines only how the
harness exposes and enforces them.

[Return to the root README](../README.md).
