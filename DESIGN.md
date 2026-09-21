# Profile design

The README uses native GitHub text, transparent SVG assets and paired light/dark images selected with `picture`. No background panels, JavaScript or custom README CSS are required.

Run `node scripts/build-profile.mjs` to regenerate the README and assets. Edit its content lists for badges and project copy. Assets are checked in so rendering does not depend on a build server.

Selected work uses nine SVG panels per theme: three unchanged project descriptions with their existing logos, three outlined GitHub buttons and three solid website buttons. Project buttons have 6px corner radii, not pill-shaped ends. No table, dividers or card backgrounds are used inside this section.

GitHub preserves `picture` sources with media queries and width/height attributes. At 1200px and above, the panels are ordered as three columns; below that, they are ordered project / GitHub / website. Both layouts reuse the same assets. The inactive layout selects a zero-sized SVG with explicit zero source dimensions. The active narrow images occupy a full line while preserving their artwork size. This works without custom CSS or JavaScript; keep the media sources before the theme source. Because both arrangements remain in the document, assistive technologies can encounter duplicate descriptive links. This is a GitHub README workaround, not the responsive component pattern to use on the actual website.

Category labels use solid inverted fills; other pills remain transparent with stronger outlines. All four badge categories share one wrapping cloud.

## Existing artwork

- `assets/source/aperture-signed.svg` is the exact approved "Aperture, signed" vector from the portfolio illustration lab. The banner reuses its wave paths, original square opening, and website m. geometry without redrawing them; only foreground color changes per theme. The old Phorminx source remains archived below but is no longer used in the banner.

- `assets/source/phorminx-illustration.svg` is an unchanged geometry export of the portfolio's `StaticDiagram` Phorminx artwork. The banner scales it and changes foreground color only.
- Phorminx's official mark comes from https://phorminx.net/brand/phorminx-mark.svg.
- Impossible G's mark is the existing portfolio asset, also used by https://www.impossibleg.org/.
- Dispersal Wolves' original vector comes from https://dispersalwolves.com/brand/mark.svg; theme variants change its foreground only.

The previous README remains available in Git history. Its static activity figures are retained without claiming they were recalculated. The compact live statistics card uses the existing github-readme-streak-stats provider and can temporarily be unavailable independently of the profile's local assets. The old contribution-graph provider returned HTTP 402 (deployment disabled) during verification and is no longer embedded.

Use GitHub's Preview tab to check supported markup. Test light, dark, dimmed and narrow widths when changing assets. Keep long-form text and navigation outside images for accessibility.
