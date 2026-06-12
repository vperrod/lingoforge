# Lessons

## 2026-06-12 — Preselected toggle = UX trap automation can't catch
Profile creation had Russian preselected as a toggle button. Real users tap it
to "choose" it → deselects → submit stays disabled with no explanation.
Automated E2E missed it because the script toggled the OTHER option on.

Rules:
- Never preselect multi-select toggle options on first-run forms. Empty start,
  tap = select.
- Any disabled primary button must say WHY it is disabled (live helper text).
- When testing forms, include the "user taps what is already selected" path.
