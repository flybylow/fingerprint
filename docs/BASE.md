# Docs conventions

`docs/` is the project knowledge base: decisions, setup quirks, issues, and session notes. The root stays limited to `README.md` plus app config and source.

## Naming

- `kebab-case.md` for a living topic (`backlog.md`, `brand` notes already live as `BRAND.md`).
- `YYYY-MM-DD-short-topic.md` for a session, a milestone, or a solved issue worth keeping as a record.

## Index

`INDEX.md` is the table of contents. Every new, renamed, or removed file under `docs/` gets a link and a one-line summary in `INDEX.md` in the same change.

## What to record

Non-obvious facts: why a key lives where it does, a bug we chased, a milestone that landed, an idea we are not building yet. Skip chat restatement. One note per topic. Solved breakthroughs get their own dated file and a line in the backlog.
