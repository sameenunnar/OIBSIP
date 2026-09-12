
// Opening Task 1 splash screen
const introScreen = document.getElementById("introScreen");
const startCalculator = document.getElementById("startCalculator");

document.body.classList.add("intro-active");

function closeIntro() {
  if (!introScreen) return;
  introScreen.classList.add("is-hidden");
  document.body.classList.remove("intro-active");
  window.setTimeout(() => introScreen.remove(), 700);
}

if (startCalculator) {
  startCalculator.addEventListener("click", closeIntro);
}

// Automatically open the calculator after 4 seconds.
window.setTimeout(closeIntro, 4000);

/**
 * Calculator — OIBSIP WebDev L2 Task 1
 * Vanilla JS state machine. No eval(). No inline onclick attributes.
 */

const MAX_DIGITS = 14;

const state = {
  current: "0",       // value currently shown / being typed
  previous: null,      // stored left-hand operand (string)
  operator: null,       // pending operator symbol
  overwrite: true,      // next digit press should replace current display
  error: false,          // true when in a division-by-zero / error state
};

const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const keys = document.querySelectorAll(".key");

function render() {
  resultEl.textContent = state.current;
  resultEl.classList.toggle("is-error", state.error);

  if (state.previous !== null && state.operator) {
    historyEl.textContent = `${formatForHistory(state.previous)} ${state.operator}`;
  } else {
    historyEl.textContent = "";
  }

  keys.forEach((key) => {
    const isActiveOperator =
      key.dataset.action === "operator" &&
      key.dataset.value === state.operator &&
      state.overwrite;
    key.classList.toggle("is-active", isActiveOperator);
  });
}

function formatForHistory(value) {
  return value.length > 10 ? Number(value).toExponential(4) : value;
}

function resetAll() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  state.error = false;
}

function inputDigit(digit) {
  if (state.error) resetAll();

  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
  } else {
    if (state.current.replace("-", "").replace(".", "").length >= MAX_DIGITS) return;
    state.current = state.current === "0" ? digit : state.current + digit;
  }
}

function inputDecimal() {
  if (state.error) resetAll();

  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
    return;
  }
  if (!state.current.includes(".")) {
    state.current += ".";
  }
}

function backspace() {
  if (state.error) {
    resetAll();
    return;
  }
  if (state.overwrite) return;

  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  if (state.current === "-") state.current = "0";
}

function clearAll() {
  resetAll();
}

function toggleSignOrPercent(kind) {
  if (state.error) return;
  const value = parseFloat(state.current);
  if (Number.isNaN(value)) return;

  if (kind === "percent") {
    state.current = trimNumber(value / 100);
  }
  state.overwrite = false;
}

function trimNumber(num) {
  if (!Number.isFinite(num)) return "0";
  const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  return String(rounded);
}

function compute(a, operator, b) {
  const left = parseFloat(a);
  const right = parseFloat(b);

  switch (operator) {
    case "+":
      return trimNumber(left + right);
    case "−":
      return trimNumber(left - right);
    case "×":
      return trimNumber(left * right);
    case "÷":
      if (right === 0) return null; // signals division-by-zero
      return trimNumber(left / right);
    default:
      return b;
  }
}

function chooseOperator(symbol) {
  if (state.error) return;

  if (state.operator && !state.overwrite) {
    const outcome = compute(state.previous, state.operator, state.current);
    if (outcome === null) {
      showError();
      return;
    }
    state.previous = outcome;
    state.current = outcome;
  } else {
    state.previous = state.current;
  }

  state.operator = symbol;
  state.overwrite = true;
}

function showError() {
  state.error = true;
  state.current = "Cannot divide by zero";
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
}

function equals() {
  if (state.error) return;
  if (state.operator === null || state.previous === null) return;

  const outcome = compute(state.previous, state.operator, state.current);
  if (outcome === null) {
    showError();
    return;
  }
  state.current = outcome;
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
}

function handleKey(event) {
  const button = event.currentTarget;
  const { action, value } = button.dataset;

  switch (action) {
    case "number":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      chooseOperator(value);
      break;
    case "equals":
      equals();
      break;
    case "clear":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
    case "percent":
      toggleSignOrPercent("percent");
      break;
    default:
      break;
  }
  render();
}

keys.forEach((key) => key.addEventListener("click", handleKey));

// Optional keyboard support (bonus, not required by spec) — kept minimal.
window.addEventListener("keydown", (event) => {
  const map = {
    "+": '[data-action="operator"][data-value="+"]',
    "-": '[data-action="operator"][data-value="−"]',
    "*": '[data-action="operator"][data-value="×"]',
    "/": '[data-action="operator"][data-value="÷"]',
    Enter: '[data-action="equals"]',
    "=": '[data-action="equals"]',
    Backspace: '[data-action="backspace"]',
    Escape: '[data-action="clear"]',
    ".": '[data-action="decimal"]',
  };

  let selector = null;
  if (/^[0-9]$/.test(event.key)) {
    selector = `[data-action="number"][data-value="${event.key}"]`;
  } else if (map[event.key]) {
    selector = map[event.key];
  }

  if (selector) {
    const target = document.querySelector(selector);
    if (target) {
      event.preventDefault();
      target.click();
    }
  }
});

render();
