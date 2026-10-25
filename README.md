# CSE 309 - Compiler Study Atlas

A complete local study website with **127 worked answers covering all 45 main questions across five exam papers**, organized by year, section, and topic. The package includes both reference lecture PDFs and the original question papers.

## Run it

1. Extract the entire ZIP.
2. Open a terminal in the extracted `CSE309_Compiler_Atlas` folder.
3. Run:

```bash
python3 start.py
```

Your default browser opens the website. Normally its address is **http://127.0.0.1:8000/**. If that port is occupied, the launcher selects a free port and prints the actual address.

Keep the terminal open while studying. Press **Ctrl+C** in that terminal to stop the server. The server accepts connections only from this computer.

**Requirements:** Python 3 and a modern browser. No Node, npm, account, hosting, or internet connection is needed to use the bundled website. On Windows, `py start.py` can be used instead of `python3 start.py`.

If the browser does not open automatically, copy the printed address into your browser. To suppress automatic opening:

```bash
python3 start.py --no-browser
```

Opening `website/index.html` directly as a file is not the supported launch method, because browsers restrict JavaScript modules on file URLs. Use the launcher above.

## Use it

- **Browse by year:** open a paper or jump directly to Section A/B.
- **Topic catalog:** view each topic's question counts broken down by year and section.
- **Search:** searches titles, original questions, and worked solutions. Combine it with the three filters.
- **Practice:** hide/reveal a worked solution, star questions for revision, or mark them reviewed.
- **Reference basis:** open exact merged-PDF pages supporting the methods in an answer.
- **Print / PDF:** from a question, prints that answer; from a catalog, prints all answers matching the current filters. Choose “Save as PDF” in the browser's print dialog.
- **Download solutions:** exports the complete Markdown solution book.

Saved/reviewed questions and the color theme are stored only in that browser's local storage. Using a different browser or a different port creates a separate set of revision choices.

## Included files

- `website/`: ready-to-run HTML, CSS, JavaScript, rendered solution data, fonts, and graph-rendering assets.
- `website/CSE_309_Worked_Solutions.md`: the complete question-and-solution book in Markdown.
- `website/solutions.json`: structured editable answer data.
- `website/references/rumi.pdf`: Rumi Sir Merged(1).pdf, 727 pages.
- `website/references/kms.pdf`: KMS Merged.pdf, 568 pages.
- `website/references/exam-papers.pdf`: original five exam papers, 30 pages.
- `source/`: optional editable source, individual question/answer files, pinned dependency manifest and lockfile.
- `VERIFICATION.md`: coverage and verification notes.

PDF citations count from the first page of each merged PDF, rather than the slide's printed numbering. Solutions are worked derivations from the reference methods, not an official marking scheme. Printed errors, missing assumptions, and LR(1) derivations extending beyond the supplied lectures are identified in the relevant answers.

## Optional: rebuild after editing content

You do not need this to run the website. For development only, install Node.js, then from `source/` run:

```bash
npm ci
npm run build
```

The regenerated website is written to `source/dist/`. It reuses the reference PDFs in `../website/references/`. Copy the regenerated files into `website/` and restart the launcher if necessary. Edit `source/content/answers-YYYY-YYYY.json` for answers and `source/site/` for the interface.

Bundled Mermaid, KaTeX and marked libraries use the MIT license; notices are retained under `website/vendor/` and in the pinned dependencies. The lecture PDFs are the copies you supplied.
