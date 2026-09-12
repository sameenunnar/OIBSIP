![To-Do Web App](./task3-intro.png)

# To-Do Web App — OIBSIP Web Development & Designing (Level 2, Task 3)

An interactive to-do list with full CRUD, split Pending/Completed lists, timestamps, and
localStorage persistence — built with HTML5, CSS3, and vanilla JavaScript.

## Live features

- Input field + "Add Task" button (form-based, so pressing Enter also works)
- Newly added tasks appear immediately at the top of the **Pending** list
- Each task has a checkbox "Mark Complete" toggle — checking it instantly moves the task to
  the **Completed** list; unchecking moves it back
- Each task has an **Edit** (✎) button that switches the task text to an inline input; **Save**
  (✓) commits the change, `Enter` also saves, `Escape` cancels
- Each task has a **Delete** (🗑) button that permanently removes it from whichever list it's in
- Task count indicators — "X pending" / "Y completed" — sit above each list and update live
- **Bonus:** every task shows a timestamp — "Added ⟨time⟩" while pending, which switches to
  "Completed ⟨time⟩" once checked off
- **Bonus:** tasks persist across page refreshes via `localStorage`
- Empty-state messaging in both lists when there is nothing to show
- Input validation: blank/whitespace-only submissions are rejected with an inline error message
- All interactivity wired with `addEventListener` and event delegation on the two list
  containers — no inline `onclick` attributes anywhere in the HTML

## Tech stack

- HTML5 (`<template>` element used to stamp out task rows)
- CSS3 (CSS Grid for the two-column layout, custom checkbox styling, no framework)
- JavaScript (Vanilla, ES6+) — `localStorage` for persistence

## How it works

Tasks are stored as an in-memory array of
`{ id, text, completed, createdAt, completedAt }` objects, and every mutation (`addTask`,
`toggleComplete`, `updateTaskText`, `deleteTask`) immediately persists the whole array to
`localStorage` before re-rendering. Rendering is a full re-draw of both `<ul>` lists from the
current state, which keeps the UI and the stored data from ever drifting apart. Clicks and
checkbox changes inside each list are handled with a single delegated listener per list
(rather than one listener per task), so newly added or edited tasks are interactive without
any extra wiring.

## How to run

1. Clone this repository.
2. Open `OIBSIP/WebDev-L2-TodoWebApp/index.html` directly in any modern browser.
3. No build step, server, or dependencies are required. Refresh the page — your tasks will
   still be there.

## How to test

Manual test checklist used during development, plus an automated headless-DOM run:

| Scenario | Expected result | Verified |
|---|---|---|
| Submit a task via the form | Appears at top of Pending, count updates to match | ✅ |
| Submit a blank/whitespace task | Inline error shown, no task added | ✅ |
| Check a pending task's checkbox | Moves to Completed, strikethrough applied, timestamp switches to "Completed ⟨time⟩" | ✅ |
| Uncheck a completed task | Moves back to Pending, timestamp reverts to "Added ⟨time⟩" | ✅ |
| Click Edit, change text, click Save | Task text updates in place, list re-renders correctly | ✅ |
| Click Edit, press `Escape` | Reverts to view mode with the original text intact | ✅ |
| Click Delete on a pending or completed task | Task is removed permanently from that list | ✅ |
| Delete the only item in a list | Empty-state message appears for that list | ✅ |
| Refresh the page after adding tasks | Tasks and their completed/pending state persist via `localStorage` | ✅ |
| Resize to a 360px-wide viewport | Two-column layout collapses to a single column, no overlap | ✅ |

An automated test script (run with Node + `jsdom`) exercised the full flow programmatically:
add → validate-empty-rejected → complete-toggle → inline-edit → delete → confirmed the final
`localStorage` state was an empty array after the delete, matching the UI.

## Folder contents

```
WebDev-L2-TodoWebApp/
├── index.html
├── style.css
└── README.md
```
