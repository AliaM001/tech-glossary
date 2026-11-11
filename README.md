# Technology Education Glossary

[Open the staff glossary](https://aliam001.github.io/tech-glossary/)

A searchable staff reference with **220 entries**, junior and senior explanations, and examples across Food, Textiles, Resistant Materials, Spatial and Product Design, Digital Technology, Systems and Control, Early Childhood Education (ECE), Baking and Hospitality.

59 shared entries have examples in the six core Technology domains at both levels; 16 also have applications in the three new subject areas. There are 161 specialist entries, including 24 each for ECE, Baking and Hospitality. Each new subject button shows 40 entries. Curriculum filters connect vocabulary to NZC 2007+, Phase 4 and proposed Phase 5 teaching content. Subject references separately connect ECE to Te Whāriki and Baking/Hospitality to relevant professional and food-safety sources.

[Read the curriculum review](CURRICULUM-REVIEW.md). Reviewed 11 November 2026. It supports planning and vocabulary teaching; it does not certify full programme coverage. Phase 5 is labelled as proposed.

## Updating vocabulary

1. Edit `terms.json`: term, junior/senior definitions, examples by domain, and source references.
2. Update `sources.json` if a source or its status changes.
3. Run `node build.mjs`. No package installation is needed. The build validates data and produces `index.html` and `coverage.csv`.
4. Commit source changes and generated files to `main`. GitHub Pages republishes automatically.

Shared entries require junior and senior examples for all six keys: `food`, `textiles`, `hard`, `design`, `digital`, `systems`. Selected shared entries also include `ece`, `baking` and `hospitality` examples. Specialist entries contain applicable domains. Junior/senior labels describe secondary students’ explanation levels, including when studying ECE; they do not describe children’s ages. Give a curriculum source and location rather than implying an official mandatory word list.

For layout/behaviour changes edit `index.template.html`, `style.css` and `app.js`. Rebuild after template changes. The generated HTML embeds the vocabulary so search does not depend on a data fetch.

For a quick edit through GitHub, change the embedded vocabulary in `index.html` and make the same correction in `terms.json` so it survives the next build. Prefer the source/build workflow, or ask for the change to be made for you.

## Hosting

GitHub Pages publishes **main / (root)**. `.nojekyll` serves static files directly. The site is public and staff do not need a GitHub account to read it.

