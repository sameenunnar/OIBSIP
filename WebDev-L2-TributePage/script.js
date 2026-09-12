/**
 * script.js — Tribute Page (OIBSIP WebDev L2 Task 2)
 *
 * This page is otherwise static HTML/CSS. The one piece of JS here
 * exists purely to keep the hero portrait looking intentional if the
 * hotlinked Wikimedia Commons photo can't load (e.g. no internet
 * connection when the page is opened). The SVG's own background rect
 * already shows a plain navy panel with no visible photo — this just
 * adds a small "AL" monogram on top of that panel so it reads as a
 * deliberate placeholder rather than a missing image.
 */

/**
 * Intro splash screen (matches Task 1 Calculator pattern) — shows the
 * banner full-screen with a "Start Tribute" pill button, auto-dismisses
 * after 4 seconds, and can be skipped early by clicking the button.
 */
const introScreen = document.getElementById("introScreen");
const startTribute = document.getElementById("startTribute");

document.body.classList.add("intro-active");

function closeIntro() {
  if (!introScreen) return;
  introScreen.classList.add("is-hidden");
  document.body.classList.remove("intro-active");
  window.setTimeout(() => introScreen.remove(), 700);
}

if (startTribute) {
  startTribute.addEventListener("click", closeIntro);
}

// Automatically open the tribute page after 4 seconds.
window.setTimeout(closeIntro, 4000);

const SVG_NS = "http://www.w3.org/2000/svg";
const portraitImage = document.getElementById("portrait");

portraitImage.addEventListener("error", () => {
  const svg = portraitImage.closest("svg.hero__portrait");
  if (!svg) return;

  portraitImage.remove();

  const initials = document.createElementNS(SVG_NS, "text");
  initials.setAttribute("x", "110");
  initials.setAttribute("y", "128");
  initials.setAttribute("text-anchor", "middle");
  initials.setAttribute("font-family", "'Playfair Display', Georgia, serif");
  initials.setAttribute("font-weight", "700");
  initials.setAttribute("font-size", "48");
  initials.setAttribute("fill", "#b08d57");
  initials.textContent = "AL";
  svg.appendChild(initials);

  const note = document.createElementNS(SVG_NS, "text");
  note.setAttribute("x", "110");
  note.setAttribute("y", "170");
  note.setAttribute("text-anchor", "middle");
  note.setAttribute("font-family", "'Source Sans 3', sans-serif");
  note.setAttribute("font-size", "9");
  note.setAttribute("fill", "#e7d8bd");
  note.textContent = "Portrait unavailable offline";
  svg.appendChild(note);

  svg.setAttribute(
    "aria-label",
    "Portrait of Ada Lovelace (image unavailable — showing initials placeholder)"
  );
});
