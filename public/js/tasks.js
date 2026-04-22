// ─── Shared Helpers ───────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    todo:        { label: "To Do",       cls: "bg-slate-700 text-slate-300" },
    in_progress: { label: "In Progress", cls: "bg-yellow-900/60 text-yellow-300 border border-yellow-600/30" },
    completed:   { label: "Done",        cls: "bg-emerald-900/60 text-emerald-300 border border-emerald-600/30" },
  };
  const s = map[status] || map.todo;
  return `<span class="text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}">${s.label}</span>`;
}

function dueDateChip(dueDate) {
  if (!dueDate) return "—";
  const due  = new Date(dueDate);
  const diff = Math.ceil((due - new Date()) / 86400000);
  if (diff < 0) return `<span class="text-red-400 text-xs">Overdue</span>`;
  if (diff <= 1) return `<span class="text-orange-400 text-xs">Today</span>`;
  return `<span class="text-slate-400 text-xs">${due.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>`;
}

// ─── Update progress bar ──────────────────────────────────────────────────────
function updateProgress() {
  const allCards = document.querySelectorAll("[data-task-id]");
  const doneCards = document.querySelectorAll("#boardDone [data-task-id]");
  const total = allCards.length;
  const done  = doneCards.length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  const bar = document.getElementById("progressBar");
  const lbl = document.getElementById("progressLabel");
  if (bar) bar.style.width = pct + "%";
  if (lbl) lbl.textContent = `${done} / ${total} tasks completed`;

  // Update column counts
  ["countTodo","countProgress","countDone"].forEach((id, i) => {
    const col = ["#boardTodo","#boardProgress","#boardDone"][i];
    const el = document.getElementById(id);
    if (el) el.textContent = document.querySelectorAll(col + " [data-task-id]").length;
  });
}

// ─── Build Kanban card ────────────────────────────────────────────────────────
function buildCard(task) {
  const assignee = task.assignedTo?.username || null;
  const initials = assignee ? assignee.slice(0, 2).toUpperCase() : null;

  const div = document.createElement("div");
  div.className = "task-card bg-slate-900/70 hover:bg-slate-900 border border-slate-700/50 hover:border-slate-500 rounded-xl p-4 group";
  div.setAttribute("data-task-id", task._id);
  div.setAttribute("data-status", task.status);

  div.innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-2">
      <a href="/tasks/${task._id}" class="text-sm font-medium leading-snug group-hover:text-blue-300 transition line-clamp-2 flex-1">${task.title}</a>
    </div>
    ${task.description ? `<p class="text-xs text-slate-500 mb-3 line-clamp-2">${task.description}</p>` : ""}
    <div class="flex items-center justify-between mt-2 gap-2">
      <div class="flex items-center gap-2">
        ${initials ? `<div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-[10px] font-bold">${initials}</div>` : ""}
        ${task.dueDate ? dueDateChip(task.dueDate) : ""}
      </div>
      <a href="/tasks/${task._id}" class="text-xs text-slate-600 group-hover:text-blue-400 transition opacity-0 group-hover:opacity-100">Edit →</a>
    </div>
  `;
  return div;
}

// ─── Build List Row ───────────────────────────────────────────────────────────
function buildRow(task) {
  const tr = document.createElement("tr");
  tr.className = "border-b border-slate-800/60 hover:bg-slate-800/30 transition";
  tr.innerHTML = `
    <td class="px-5 py-3">
      <div class="font-medium text-sm">${task.title}</div>
      ${task.description ? `<div class="text-xs text-slate-500 truncate max-w-xs">${task.description}</div>` : ""}
    </td>
    <td class="px-5 py-3">
      ${task.assignedTo?.username
        ? `<span class="text-xs bg-slate-700 px-2 py-0.5 rounded-full">${task.assignedTo.username}</span>`
        : `<span class="text-xs text-slate-600">Unassigned</span>`}
    </td>
    <td class="px-4 py-3 text-center">${statusBadge(task.status)}</td>
    <td class="px-4 py-3 text-center">${dueDateChip(task.dueDate)}</td>
    <td class="px-4 py-3 text-center">
      <a href="/tasks/${task._id}" class="text-xs text-blue-400 hover:text-blue-300 transition">Edit →</a>
    </td>
  `;
  return tr;
}

// ─── Load Tasks ───────────────────────────────────────────────────────────────
async function loadTasks(projectId) {
  const res = await callApi("/tasks/project/" + projectId, "GET");
  if (!res) return;
  const taskList = res?.tasks || [];

  // Clear all columns
  const boardTodo     = document.getElementById("boardTodo");
  const boardProgress = document.getElementById("boardProgress");
  const boardDone     = document.getElementById("boardDone");
  const listBody      = document.getElementById("taskList");

  if (boardTodo)     boardTodo.innerHTML     = "";
  if (boardProgress) boardProgress.innerHTML = "";
  if (boardDone)     boardDone.innerHTML     = "";
  if (listBody)      listBody.innerHTML      = "";

  if (taskList.length === 0) {
    if (boardTodo)  boardTodo.innerHTML     = `<p class="text-slate-600 italic text-xs text-center py-6">No tasks yet</p>`;
    if (listBody)   listBody.innerHTML      = `<tr><td colspan="5" class="text-center py-12 text-slate-500">No tasks yet. <a href="/tasks/create?projectId=${projectId}" class="text-blue-400 hover:underline">Create the first one →</a></td></tr>`;
    updateProgress();
    return;
  }

  taskList.forEach(task => {
    // Kanban
    const card = buildCard(task);
    if (task.status === "todo" && boardTodo) boardTodo.appendChild(card);
    else if (task.status === "in_progress" && boardProgress) boardProgress.appendChild(card);
    else if (task.status === "completed" && boardDone) boardDone.appendChild(card);

    // List
    if (listBody) listBody.appendChild(buildRow(task));
  });

  updateProgress();
  initSortable();
}

// ─── Drag-and-Drop with SortableJS ───────────────────────────────────────────
function initSortable() {
  const cols = {
    boardTodo:     "todo",
    boardProgress: "in_progress",
    boardDone:     "completed",
  };

  Object.keys(cols).forEach(colId => {
    const el = document.getElementById(colId);
    if (!el || el._sortable) return;

    el._sortable = Sortable.create(el, {
      group: "tasks",
      animation: 150,
      ghostClass: "sortable-ghost",
      dragClass: "sortable-drag",
      onStart(evt) {
        document.querySelectorAll(".kanban-col").forEach(c => c.classList.add("col-dropping"));
      },
      onEnd(evt) {
        document.querySelectorAll(".kanban-col").forEach(c => c.classList.remove("col-dropping"));

        const card      = evt.item;
        const taskId    = card.getAttribute("data-task-id");
        const newStatus = evt.to.getAttribute("data-status");
        const oldStatus = card.getAttribute("data-status");

        if (newStatus === oldStatus) return;

        card.setAttribute("data-status", newStatus);
        updateProgress();

        // Persist to backend
        callApi("/tasks/" + taskId, "PUT", { status: newStatus }).then(res => {
          if (res?.success) {
            showToast(`Task moved to "${newStatus.replace("_", " ")}"`, "success");
          } else {
            // Revert card on failure
            showToast("Could not update task status", "error");
            const origCol = document.getElementById(
              Object.keys(cols).find(k => cols[k] === oldStatus)
            );
            if (origCol) origCol.appendChild(card);
            card.setAttribute("data-status", oldStatus);
            updateProgress();
          }
        });
      }
    });
  });
}

// ─── Load Project Details ─────────────────────────────────────────────────────
async function loadProjectDetails(projectId) {
  const res = await callApi("/projects/" + projectId, "GET");
  const project = res?.project;
  if (!project) return;

  const nameEl = document.getElementById("projectNameEl");
  const descEl = document.getElementById("projectDescEl");
  const link   = document.getElementById("createTaskLink");

  if (nameEl) nameEl.textContent = project.name;
  if (descEl) descEl.textContent = project.description || "";
  if (link)   link.href = "/tasks/create?projectId=" + projectId;
}

// ─── View Toggle ──────────────────────────────────────────────────────────────
const boardBtn  = document.getElementById("boardBtn");
const listBtn   = document.getElementById("listBtn");
const boardView = document.getElementById("boardView");
const listView  = document.getElementById("taskListView");

if (boardBtn && listBtn) {
  boardBtn.addEventListener("click", () => {
    boardView?.classList.remove("hidden");
    listView?.classList.add("hidden");
    boardBtn.classList.add("active");
    listBtn.classList.remove("active");
  });
  listBtn.addEventListener("click", () => {
    listView?.classList.remove("hidden");
    boardView?.classList.add("hidden");
    listBtn.classList.add("active");
    boardBtn.classList.remove("active");
  });
}

// ─── Create Task Form ─────────────────────────────────────────────────────────
const taskForm = document.getElementById("taskform");
if (taskForm) {
  taskForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const btn = document.getElementById("taskBtn");
    if (btn) { btn.disabled = true; btn.textContent = "Creating…"; }

    const res = await callApi("/tasks/" + document.getElementById("projectId").value, "POST", {
      title:       document.getElementById("title").value,
      description: document.getElementById("description").value,
      status:      document.getElementById("status").value,
      assignedTo:  document.getElementById("assignedTo").value,
      dueDate:     document.getElementById("dueDate").value,
    });

    if (res?.success) {
      showToast("Task created!", "success");
      setTimeout(() => location.reload(), 800);
    } else {
      if (btn) { btn.disabled = false; btn.textContent = "Create Task"; }
    }
  });
}

// ─── Task Detail Form ─────────────────────────────────────────────────────────
const taskDetailForm = document.getElementById("taskDetailForm");
if (taskDetailForm) {
  taskDetailForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const taskId    = document.getElementById("taskId").value;
    const projectId = document.getElementById("projectId").value;
    const btn       = document.getElementById("updateBtn");
    if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }

    const res = await callApi("/tasks/" + taskId, "PUT", {
      title:       document.getElementById("title").value,
      description: document.getElementById("description").value,
      status:      document.getElementById("status").value,
      assignedTo:  document.getElementById("assignedTo").value,
      dueDate:     document.getElementById("dueDate").value,
    });

    if (res?.success) {
      showToast("Task updated!", "success");
      setTimeout(() => window.location.href = "/projects/" + projectId, 800);
    } else {
      if (btn) { btn.disabled = false; btn.textContent = "Update Task"; }
    }
  });
}

// ─── Delete Task ──────────────────────────────────────────────────────────────
const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    const taskId    = document.getElementById("taskId").value;
    const projectId = document.getElementById("projectId").value;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting…";
    const res = await callApi("/tasks/" + taskId, "DELETE");
    if (res?.success) {
      showToast("Task deleted", "warn");
      setTimeout(() => window.location.href = "/projects/" + projectId, 800);
    } else {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete";
    }
  });
}

// ─── Load task detail (task-detail page) ─────────────────────────────────────
async function loadTaskDetail(taskId) {
  const res  = await callApi("/tasks/" + taskId, "GET");
  const task = res?.task;
  if (!task) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
  set("taskId",      task._id);
  set("projectId",   task.projectId);
  set("title",       task.title);
  set("description", task.description);
  set("status",      task.status);
  set("dueDate",     task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
  if (task.assignedTo) set("assignedTo", task.assignedTo._id || task.assignedTo);

  const backLink = document.querySelector("a[href*='/projects/']");
  if (backLink && task.projectId) backLink.href = "/projects/" + task.projectId;
}

// ─── Auto-init ────────────────────────────────────────────────────────────────
const pageProjectId = window.PROJECT_ID;
if (pageProjectId && !window.TASK_ID) {
  loadProjectDetails(pageProjectId);
  loadTasks(pageProjectId);
}
if (window.TASK_ID) {
  loadTaskDetail(window.TASK_ID);
}