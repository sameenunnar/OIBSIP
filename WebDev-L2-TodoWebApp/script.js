/**
 * TaskFlow — OIBSIP WebDev L2 Task 3
 * CRUD + localStorage + search + categories + views + important/trash states.
 */

/**
 * Intro splash screen (matches Task 1 Calculator pattern) — shows the
 * banner full-screen with a "Start To-Do App" pill button, auto-dismisses
 * after 4 seconds, and can be skipped early by clicking the button.
 */
const introScreen = document.getElementById("introScreen");
const startTodo = document.getElementById("startTodo");

document.body.classList.add("intro-active");

function closeIntro() {
  if (!introScreen) return;
  introScreen.classList.add("is-hidden");
  document.body.classList.remove("intro-active");
  window.setTimeout(() => introScreen.remove(), 700);
}

if (startTodo) {
  startTodo.addEventListener("click", closeIntro);
}

// Automatically open the To-Do app after 4 seconds.
window.setTimeout(closeIntro, 4000);

const STORAGE_KEY = "oibsip-todo-tasks-v2";

const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const categoryInput = document.getElementById("category-input");
const formError = document.getElementById("form-error");
const addBtn = document.getElementById("add-btn");
const cancelAdd = document.getElementById("cancel-add");
const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const emptyTitle = document.getElementById("empty-title");
const emptyText = document.getElementById("empty-text");
const emptyAdd = document.getElementById("empty-add");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");
const taskHeading = document.getElementById("tasks-heading");
const taskCountLabel = document.getElementById("task-count-label");
const summaryTitle = document.getElementById("summary-title");
const summaryText = document.getElementById("summary-text");
const clearCompletedBtn = document.getElementById("clear-completed");
const template = document.getElementById("task-template");

const VIEW_COPY = {
  my: ["My Tasks", "Stay focused and get things done."],
  all: ["All Tasks", "Everything in one place."],
  today: ["Today", "Focus on what needs your attention today."],
  important: ["Important", "Your highest-priority work."],
  completed: ["Completed", "A record of everything you've finished."],
  trash: ["Trash", "Restore tasks or remove them permanently."]
};

let tasks = loadTasks();
let currentView = "my";
let activeCategory = "all";
let searchTerm = "";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrate tasks from the previous version when available.
      const legacy = localStorage.getItem("oibsip-todo-tasks-v1");
      if (!legacy) return [];
      const parsedLegacy = JSON.parse(legacy);
      return Array.isArray(parsedLegacy)
        ? parsedLegacy.map((task) => ({ ...task, category: task.category || "Frontend", important: !!task.important, trashed: !!task.trashed }))
        : [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load tasks:", err);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Failed to save tasks:", err);
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimestamp(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function isToday(iso) {
  if (!iso) return false;
  const date = new Date(iso);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function addTask(text, category) {
  const trimmed = text.trim();
  if (!trimmed) {
    formError.textContent = "Please type a task before adding it.";
    return false;
  }

  const now = new Date().toISOString();
  tasks.unshift({
    id: makeId(),
    text: trimmed.slice(0, 140),
    category: category || "Frontend",
    completed: false,
    important: false,
    trashed: false,
    createdAt: now,
    completedAt: null
  });

  saveTasks();
  render();
  return true;
}

function toggleComplete(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;
  saveTasks();
  render();
}

function toggleImportant(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task || task.trashed) return;
  task.important = !task.important;
  saveTasks();
  render();
}

function updateTaskText(id, text) {
  const task = tasks.find((item) => item.id === id);
  const trimmed = text.trim();
  if (!task || !trimmed) return false;
  task.text = trimmed.slice(0, 140);
  saveTasks();
  render();
  return true;
}

function moveToTrash(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.trashed = true;
  saveTasks();
  render();
}

function restoreTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.trashed = false;
  saveTasks();
  render();
}

function permanentlyDelete(id) {
  tasks = tasks.filter((item) => item.id !== id);
  saveTasks();
  render();
}

function getVisibleTasks() {
  let visible = tasks.filter((task) => {
    switch (currentView) {
      case "all": return !task.trashed;
      case "today": return !task.trashed && isToday(task.createdAt);
      case "important": return !task.trashed && task.important;
      case "completed": return !task.trashed && task.completed;
      case "trash": return task.trashed;
      case "my":
      default: return !task.trashed && !task.completed;
    }
  });

  if (activeCategory !== "all") {
    visible = visible.filter((task) => task.category === activeCategory);
  }

  if (searchTerm) {
    visible = visible.filter((task) =>
      `${task.text} ${task.category}`.toLowerCase().includes(searchTerm)
    );
  }

  return visible;
}

function buildTaskElement(task) {
  const fragment = template.content.cloneNode(true);
  const li = fragment.querySelector(".task");
  li.dataset.id = task.id;
  if (task.completed) li.classList.add("task--completed");
  if (task.important) li.classList.add("task--important");
  if (task.trashed) li.classList.add("task--trashed");

  const checkbox = fragment.querySelector(".task__checkbox");
  checkbox.checked = task.completed;
  checkbox.disabled = task.trashed;

  fragment.querySelector(".task__text").textContent = task.text;

  const editInput = fragment.querySelector(".task__edit-input");
  editInput.value = task.text;

  const category = fragment.querySelector(".task__category");
  category.textContent = task.category || "Frontend";

  fragment.querySelector(".task__timestamp").textContent = task.trashed
    ? `Moved to trash ${formatTimestamp(task.trashedAt || task.createdAt)}`
    : task.completed
      ? `Completed ${formatTimestamp(task.completedAt)}`
      : `Added ${formatTimestamp(task.createdAt)}`;

  const importantBtn = fragment.querySelector(".task__important-btn");
  importantBtn.classList.toggle("is-active", !!task.important);
  importantBtn.setAttribute("aria-label", task.important ? "Remove important" : "Mark important");

  const editBtn = fragment.querySelector(".task__edit-btn");
  const deleteBtn = fragment.querySelector(".task__delete-btn");
  const restoreBtn = fragment.querySelector(".task__restore-btn");
  const permanentDeleteBtn = fragment.querySelector(".task__permanent-delete-btn");

  editBtn.hidden = task.trashed;
  importantBtn.hidden = task.trashed;
  deleteBtn.hidden = task.trashed;
  restoreBtn.hidden = !task.trashed;
  permanentDeleteBtn.hidden = !task.trashed;

  return fragment;
}

function updateCounts() {
  const active = tasks.filter((task) => !task.trashed);
  const counts = {
    my: active.filter((task) => !task.completed).length,
    all: active.length,
    today: active.filter((task) => isToday(task.createdAt)).length,
    important: active.filter((task) => task.important).length,
    completed: active.filter((task) => task.completed).length,
    trash: tasks.filter((task) => task.trashed).length
  };

  Object.entries(counts).forEach(([key, value]) => {
    const el = document.getElementById(`${key}-count`);
    if (el) el.textContent = value;
  });
}

function updateSummary() {
  const active = tasks.filter((task) => !task.trashed);
  const completed = active.filter((task) => task.completed).length;
  const remaining = active.filter((task) => !task.completed).length;

  summaryTitle.textContent = remaining === 0 ? "All caught up!" : `${remaining} task${remaining === 1 ? "" : "s"} to go`;
  summaryText.textContent = completed
    ? `You've completed ${completed} task${completed === 1 ? "" : "s"}. Keep the momentum going.`
    : "Start with one small task and build your momentum.";
}

function render() {
  const [title, subtitle] = VIEW_COPY[currentView];
  pageTitle.textContent = title;
  pageSubtitle.textContent = subtitle;
  taskHeading.textContent = currentView === "trash" ? "Trash" : "Tasks";

  const visible = getVisibleTasks();
  taskList.innerHTML = "";
  visible.forEach((task) => taskList.appendChild(buildTaskElement(task)));

  taskCountLabel.textContent = `${visible.length} task${visible.length === 1 ? "" : "s"}`;
  emptyState.hidden = visible.length !== 0;

  if (currentView === "trash") {
    emptyTitle.textContent = "Trash is empty";
    emptyText.textContent = "Deleted tasks will appear here until you remove them permanently.";
  } else if (searchTerm) {
    emptyTitle.textContent = "No matching tasks";
    emptyText.textContent = "Try a different search term.";
  } else {
    emptyTitle.textContent = "No tasks here";
    emptyText.textContent = "Add a task to start organizing your work.";
  }

  emptyAdd.hidden = currentView === "trash";
  clearCompletedBtn.hidden = currentView === "trash";

  updateCounts();
  updateSummary();
}

function openAddForm() {
  form.hidden = false;
  addBtn.hidden = true;
  input.focus();
}

function closeAddForm() {
  form.reset();
  form.hidden = true;
  addBtn.hidden = false;
  formError.textContent = "";
}

function enterEditMode(li) {
  li.querySelector(".task__text").hidden = true;
  li.querySelector(".task__edit-input").hidden = false;
  li.querySelector(".task__edit-btn").hidden = true;
  li.querySelector(".task__save-btn").hidden = false;
  const editInput = li.querySelector(".task__edit-input");
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);
}

function exitEditMode(li) {
  li.querySelector(".task__text").hidden = false;
  li.querySelector(".task__edit-input").hidden = true;
  li.querySelector(".task__edit-btn").hidden = false;
  li.querySelector(".task__save-btn").hidden = true;
}

function commitEdit(li) {
  const ok = updateTaskText(li.dataset.id, li.querySelector(".task__edit-input").value);
  if (!ok) exitEditMode(li);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (addTask(input.value, categoryInput.value)) {
    closeAddForm();
  }
});

addBtn.addEventListener("click", openAddForm);
emptyAdd.addEventListener("click", openAddForm);
cancelAdd.addEventListener("click", closeAddForm);

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  render();
});

document.getElementById("view-nav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  currentView = button.dataset.view;
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  render();
});

document.getElementById("category-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  render();
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed || task.trashed);
  saveTasks();
  render();
});

taskList.addEventListener("click", (event) => {
  const li = event.target.closest(".task");
  if (!li) return;
  const id = li.dataset.id;

  if (event.target.closest(".task__delete-btn")) return moveToTrash(id);
  if (event.target.closest(".task__restore-btn")) return restoreTask(id);
  if (event.target.closest(".task__permanent-delete-btn")) return permanentlyDelete(id);
  if (event.target.closest(".task__important-btn")) return toggleImportant(id);
  if (event.target.closest(".task__edit-btn")) return enterEditMode(li);
  if (event.target.closest(".task__save-btn")) return commitEdit(li);
});

taskList.addEventListener("change", (event) => {
  if (!event.target.classList.contains("task__checkbox")) return;
  const li = event.target.closest(".task");
  toggleComplete(li.dataset.id);
});

taskList.addEventListener("keydown", (event) => {
  if (!event.target.classList.contains("task__edit-input")) return;
  const li = event.target.closest(".task");
  if (event.key === "Enter") {
    event.preventDefault();
    commitEdit(li);
  } else if (event.key === "Escape") {
    event.preventDefault();
    exitEditMode(li);
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

input.addEventListener("input", () => {
  if (formError.textContent) formError.textContent = "";
});

render();
