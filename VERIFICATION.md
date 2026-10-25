# Verification record

## Coverage

| Paper | Main questions | Worked answer cards |
| --- | --- | --- |
| 2023-2024 | 8 | 25 |
| 2022-2023 | 8 | 32 |
| 2021-2022 | 8 | 27 |
| 2020-2021 | 8 | 22 |
| 2019-2020 / January 2021 Term | 13 | 21 |
| Total | 45 | 127 |

Every main question and lettered subquestion is included. Requested subparts such as (i)/(ii) remain within their parent answer card. Original code, grammar, tables and figure relationships accompany the relevant questions.

## Content checks

- Reference citations were checked against the two supplied lecture PDFs using merged-PDF page numbers.
- Grammar transformations were checked with bounded-language enumeration and left-corner analysis where applicable. Finite enumeration is a bug check, not a general equivalence proof; answers also explain the transformations.
- FIRST/FOLLOW results, predictive parsing traces, canonical item collections, parse-table conflicts and repaired-table traces were computed and checked.
- Optimized code was compared with the original on randomized inputs under each answer's explicit arithmetic, aliasing and liveness assumptions. Tests support those assumptions and do not establish behavior for undefined C programs.
- Register-allocation liveness/interference results and the shared garbage-collection network received independent calculation checks.
- Undefined C behavior, malformed source expressions, ambiguous wording and source inconsistencies are exposed in answer notes instead of silently repaired.

## Website checks

- All 127 IDs, expected year/section/subquestion coverage, canonical topic names and source-page bounds pass build validation.
- All question/solution Markdown is parsed; code fences and mathematical rendering were checked.
- All 13 Mermaid diagrams were rendered in the browser with zero diagram fallbacks.
- Year/section filtering, question opening, hide/reveal solution and save/unsave interactions were exercised in the browser.
- The archive and local launcher are checked during packaging. All study/runtime assets and PDFs are bundled locally.

These are worked study solutions, not an official examiner answer key. Necessary interpretations and assumptions appear alongside the affected answers.
