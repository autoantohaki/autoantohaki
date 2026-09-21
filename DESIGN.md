# Profile design

The README uses native GitHub text, transparent SVG assets and paired light/dark images selected with `picture`. No background panels, JavaScript or custom README CSS are required.

Run `node scripts/build-profile.mjs` to regenerate the README and assets. Edit its content lists for badges and project copy. Assets are checked in so rendering does not depend on a build server.

## Existing artwork

- `assets/source/phorminx-illustration.svg` is an unchanged geometry export of the portfolio's `StaticDiagram` Phorminx artwork. The banner scales it and changes foreground color only.
- Phorminx's official mark comes from https://phorminx.net/brand/phorminx-mark.svg.
- Impossible G's mark is the existing portfolio asset, also used by https://www.impossibleg.org/.
- Dispersal Wolves' original vector comes from https://dispersalwolves.com/brand/mark.svg; theme variants change its foreground only.

The previous README remains available in Git history. Its static activity figures are retained without claiming they were recalculated. The compact live statistics card uses the existing github-readme-streak-stats provider and can temporarily be unavailable independently of the profile's local assets. The old contribution-graph provider returned HTTP 402 (deployment disabled) during verification and is no longer embedded.

Use GitHub's Preview tab to check supported markup. Test light, dark, dimmed and narrow widths when changing assets. Keep long-form text and navigation outside images for accessibility.
