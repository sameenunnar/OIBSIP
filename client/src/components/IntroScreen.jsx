import React, { useEffect, useState } from "react";

/**
 * Intro splash screen (matches the Task 1 Calculator / Task 2 Tribute Page
 * pattern) — shows the banner full-screen with a "Start" pill button,
 * auto-dismisses after 4 seconds, and can be skipped early by clicking
 * the button.
 */
export default function IntroScreen() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    document.body.classList.add("intro-active");
    const autoClose = window.setTimeout(closeIntro, 4000);
    return () => window.clearTimeout(autoClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function closeIntro() {
    setHidden(true);
    document.body.classList.remove("intro-active");
    window.setTimeout(() => setRemoved(true), 700);
  }

  if (removed) return null;

  return (
    <section
      className={`intro-screen${hidden ? " intro-screen--hidden" : ""}`}
      aria-label="Login Authentication System introduction"
    >
      <img
        className="intro-screen__image"
        src="/task2-intro.png"
        alt="Sameen Unnar — Web Development &amp; Designing — Login Authentication System"
      />
      <button
        className="intro-screen__skip"
        type="button"
        onClick={closeIntro}
      >
        Start Login Authentication System
      </button>
    </section>
  );
}
