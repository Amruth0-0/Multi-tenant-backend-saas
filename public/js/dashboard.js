// ─── Decode JWT payload (no secret needed for display purposes) ───────────────
function decodeToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ─── Auth guard ───────────────────────────────────────────────────────────────
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }
})();

// ─── Load dashboard data ───────────────────────────────────────────────────────
async function loadDashboard() {
  const decoded = decodeToken();
  if (!decoded) return;

  // 1. Workspace name from localStorage (saved on create/select)
  const workspaceName =
    localStorage.getItem("workspaceName") || "My Workspace";
  const wsEl = document.getElementById("workspaceNameEl");
  if (wsEl) wsEl.textContent = workspaceName;

  // 2. Project count + recent projects
  const projectRes = await callApi("/projects", "GET");
  const projects = projectRes?.projects || [];

  const projectCountEl = document.getElementById("projectCountEl");
  if (projectCountEl) projectCountEl.textContent = projects.length;

  // Populate Recent Projects widget
  const recentProjectList = document.getElementById("recentProjectList");
  if (recentProjectList) {
    if (projects.length === 0) {
      recentProjectList.innerHTML =
        "<p class='text-slate-400 italic'>No projects yet</p>";
    } else {
      recentProjectList.innerHTML = projects
        .slice(0, 5)
        .map(
          (p) => `
        <div class="flex justify-between items-center">
          <a href="/projects/${p._id}" class="hover:underline">${p.name}</a>
          <span class="text-slate-400 text-xs">${p.status || "active"}</span>
        </div>`
        )
        .join("");
    }
  }

  // 3. Member count (requires workspaceId from token)
  if (decoded.workspaceId) {
    const memberRes = await callApi(
      `/workspace-members/${decoded.workspaceId}/members`,
      "GET"
    );
    const members = memberRes?.members || [];

    const memberCountEl = document.getElementById("memberCountEl");
    if (memberCountEl) memberCountEl.textContent = members.length;

    // Populate Members widget
    const memberList = document.getElementById("memberListWidget");
    if (memberList) {
      if (members.length === 0) {
        memberList.innerHTML =
          "<p class='text-slate-400 italic'>No members yet</p>";
      } else {
        memberList.innerHTML = members
          .slice(0, 5)
          .map(
            (m) => `
          <div class="flex justify-between items-center">
            <span>${m.userId?.username || "Member"}</span>
            <span class="text-xs text-slate-400">${m.role}</span>
          </div>`
          )
          .join("");
      }
    }
  }

  // 4. Task count + recent tasks
  const taskRes = await callApi("/tasks", "GET");
  const tasks = taskRes?.tasks || [];

  const taskCountEl = document.getElementById("taskCountEl");
  if (taskCountEl) taskCountEl.textContent = tasks.length;

  const recentTaskList = document.getElementById("recentTaskList");
  if (recentTaskList) {
    if (tasks.length === 0) {
      recentTaskList.innerHTML =
        "<p class='text-slate-400 italic'>No tasks yet</p>";
    } else {
      recentTaskList.innerHTML = tasks
        .slice(0, 5)
        .map(
          (t) => `
        <div class="flex justify-between items-center">
          <a href="/tasks/${t._id}" class="hover:underline truncate w-2/3">${t.title}</a>
          <span class="text-slate-400 text-xs">${t.status || "todo"}</span>
        </div>`
        )
        .join("");
    }
  }
}

loadDashboard();
