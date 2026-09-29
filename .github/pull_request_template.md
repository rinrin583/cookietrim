## Summary

## Safety impact

- [ ] Never clicks an accept-all control
- [ ] Does not hide unresolved banners
- [ ] Does not delete or rewrite site cookies
- [ ] Does not add telemetry, remote code, or external requests

## Verification

- [ ] `npm test` passes
- [ ] I tested a safe fallback when no reliable reject control exists
