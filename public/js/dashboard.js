// ─── Greeting ─────────────────────────────────────────────────────────────────
function setGreeting() {
  const hour = new Date().getHours();
  const timeEl = document.getElementById("greetingTime");
  if (!timeEl) return;
  if (hour < 12) timeEl.textContent = "Good morning ☀️";
  else if (hour < 17) timeEl.textContent = "Good afternoon 👋";
  else timeEl.textContent = "Good evening 🌙";
}

// ─── Decode JWT ────────────────────────────────────────────────────────────────
function decodeToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}


// ─── Status badge ──────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    todo:        { label: "To Do",       cls: "bg-slate-700 text-slate-300" },
    in_progress: { label: "In Progress", cls: "bg-yellow-900/60 text-yellow-300 border border-yellow-600/30" },
    completed:   { label: "Done",        cls: "bg-emerald-900/60 text-emerald-300 border border-emerald-600/30" },
  };
  const s = map[status] || map.todo;
  return `<span class="text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}">${s.label}</span>`;
}

// ─── Due date chip ─────────────────────────────────────────────────────────────
function dueDateChip(dueDate) {
  if (!dueDate) return "";
  const due  = new Date(dueDate);
  const now  = new Date();
  const diff = Math.ceil((due - now) / 86400000);
  let cls, label;
  if (diff < 0)      { cls = "text-red-400";    label = `Overdue ${Math.abs(diff)}d`; }
  else if (diff <= 1){ cls = "text-orange-400";  label = "Due today"; }
  else if (diff <= 3){ cls = "text-yellow-400";  label = `Due in ${diff}d`; }
  else               { cls = "text-slate-500";   label = `Due ${due.toLocaleDateString("en-GB", {day:"numeric",month:"short"})}`; }
  return `<span class="text-xs ${cls}">📅 ${label}</span>`;
}

// ─── Load Dashboard ─────────────────────────────────────────────────────────────
async function loadDashboard() {
  setGreeting();
  const decoded = decodeToken();
  if (!decoded) return;

  // Workspace name
  const wsName = localStorage.getItem("workspaceName") || "My Workspace";
  const wsEl = document.getElementById("workspaceNameEl");
  if (wsEl) wsEl.textContent = wsName;

  // Greeting name (use username from localStorage or fallback)
  const nameEl = document.getElementById("greetingName");
  if (nameEl) nameEl.textContent = localStorage.getItem("username") || "there";

  // ── My Tasks ──────────────────────────────────────────────────────────────────
  const myTaskList = document.getElementById("myTaskList");
  const myTaskCountEl = document.getElementById("myTaskCountEl");
  const myTaskRes = await callApi("/tasks/me", "GET");
  const myTasks = myTaskRes?.tasks || [];

  if (myTaskCountEl) myTaskCountEl.textContent = myTasks.length;

  if (myTaskList) {
    if (myTasks.length === 0) {
      myTaskList.innerHTML = `
        <div class="text-center py-8 text-slate-500">
          <p class="text-3xl mb-2">🎉</p>
          <p class="text-sm font-medium">You're all caught up!</p>
          <p class="text-xs mt-1">No open tasks assigned to you.</p>
        </div>`;
    } else {
      myTaskList.innerHTML = myTasks.map(t => `
        <a href="/tasks/${t._id}" class="flex items-start justify-between gap-4 p-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-700/40 hover:border-slate-600 rounded-xl transition group">
          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm truncate group-hover:text-blue-300 transition">${t.title}</div>
            <div class="text-xs text-slate-500 mt-0.5">${t.projectId?.name || "Project"}</div>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            ${statusBadge(t.status)}
            ${dueDateChip(t.dueDate)}
          </div>
        </a>`).join("");
    }
  }

  // ── Projects with Progress ─────────────────────────────────────────────────
  const projectRes = await callApi("/projects", "GET");
  const projects = projectRes?.projects || [];
  const projectCountEl = document.getElementById("projectCountEl");
  if (projectCountEl) projectCountEl.textContent = projects.length;

  const allTaskRes = await callApi("/tasks", "GET");
  const allTasks = allTaskRes?.tasks || [];

  const projectProgressList = document.getElementById("projectProgressList");
  if (projectProgressList) {
    if (projects.length === 0) {
      projectProgressList.innerHTML = `
        <div class="text-center py-8 text-slate-500">
          <p class="text-3xl mb-2">📁</p>
          <p class="text-sm font-medium">No projects yet</p>
          <a href="/projects/create" class="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block">Create your first project →</a>
        </div>`;
    } else {
      projectProgressList.innerHTML = projects.slice(0, 5).map(p => {
        const pId      = p._id?.toString();
        const pTasks   = allTasks.filter(t => {
          const tPid = t.projectId?._id?.toString() || t.projectId?.toString();
          return tPid === pId;
        });
        const done     = pTasks.filter(t => t.status === "completed").length;
        const total    = pTasks.length;
        const pct      = total === 0 ? 0 : Math.round((done / total) * 100);
        const barColor = pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-violet-500";
        return `
          <a href="/projects/${p._id}" class="block group">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm font-medium group-hover:text-blue-300 transition truncate">${p.name}</span>
              <span class="text-xs text-slate-500 shrink-0 ml-2">${done}/${total} tasks</span>
            </div>
            <div class="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
              <div class="progress-bar ${barColor} h-1.5 rounded-full" style="width:${pct}%"></div>
            </div>
            <div class="text-right text-xs text-slate-600 mt-0.5">${pct}%</div>
          </a>`;
      }).join("");
    }
  }

  // ── Members ───────────────────────────────────────────────────────────────────
  if (decoded.workspaceId) {
    const memberRes = await callApi(`/workspace-members/${decoded.workspaceId}/members`, "GET");
    const members = memberRes?.members || [];

    const memberCountEl = document.getElementById("memberCountEl");
    if (memberCountEl) memberCountEl.textContent = members.length;

    const memberList = document.getElementById("memberListWidget");
    if (memberList) {
      memberList.innerHTML = members.slice(0, 5).map(m => {
        const initials = (m.userId?.username || "?").slice(0,2).toUpperCase();
        const roleColor = { owner: "text-yellow-400", admin: "text-blue-400", member: "text-slate-400" }[m.role] || "text-slate-400";
        return `
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold shrink-0">${initials}</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">${m.userId?.username || "Member"}</div>
              <div class="text-xs text-slate-500 truncate">${m.userId?.email || ""}</div>
            </div>
            <span class="text-xs ${roleColor} font-medium capitalize">${m.role}</span>
          </div>`;
      }).join("");
    }

    // ── Invite Link ────────────────────────────────────────────────────────────
    // We fetch workspace details to get inviteCode - reuse member list response if available
    const inviteLinkEl = document.getElementById("inviteLinkEl");
    const copyBtn = document.getElementById("copyInviteBtn");
    // Compute link from workspaceId via workspace API
    const wsRes = await callApi(`/workspace/${decoded.workspaceId}`, "GET").catch(() => null);
    const inviteCode = wsRes?.inviteCode || localStorage.getItem("inviteCode");
    if (inviteLinkEl && inviteCode) {
      const link = `${window.location.origin}/invite/${inviteCode}`;
      inviteLinkEl.textContent = link;
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(link);
          copyBtn.textContent = "Copied!";
          setTimeout(() => copyBtn.textContent = "Copy", 2000);
        });
      }
    } else if (inviteLinkEl) {
      inviteLinkEl.textContent = "Generate a workspace first";
    }
  }
}

loadDashboard();
