# CLAUDE.md

Claude Code follows the same project rules as every other agent working in this repository.
They are kept in one place so the two files cannot drift apart:

@AGENTS.md

`.specify/memory/constitution.md` governs both files. If a request conflicts with it, stop and
raise the conflict instead of overriding it; resolve it through the feature spec or a
constitution amendment.

## Claude Code specifics

- Use the Spec Kit skills in `.claude/skills/speckit-*` for the
  constitution → specify → clarify → plan → tasks → implement sequence.
- Never commit `.claude/settings.local.json` or `.serena/`.
