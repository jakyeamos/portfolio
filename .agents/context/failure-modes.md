# Common failure modes

| Symptom                           | Likely cause                                             | Recovery                                                                    |
| --------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `tracker:check` reports drift     | reviewed source projection changed                       | inspect the diff, then run `pnpm tracker:sync` deliberately                 |
| leverage source is missing        | source is not mounted or is not review-gated             | keep the project manual until the evidence source is restored               |
| project/content check fails       | manifest, allowlist, or public fields diverged           | fix the narrowest source record and rerun `pnpm test`                       |
| shot clip check fails             | unverified source, invalid window, or allowlist mismatch | re-review the clip; do not relax the provenance gate                        |
| build fails after content changes | generated page or asset contract is stale                | run `pnpm build`, inspect generated output, and commit only intended source |
| Netlify status cannot verify      | missing credentials, site ID, or expected commit         | report verification unavailable; do not claim deployment success            |
| weekly refresh refuses to run     | branch is not the configured main branch                 | use the documented local dry-run flag or move the approved change to main   |
| secret scan finds a match         | real credential or high-confidence false positive        | remove/rotate the credential or add a narrow reviewed placeholder exception |

Never repair these symptoms by weakening a check, copying private sibling data,
or reintroducing an operational database dependency.
