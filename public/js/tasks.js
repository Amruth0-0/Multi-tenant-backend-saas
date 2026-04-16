async function loadTasks(projectId) {
  const container = document.getElementById("taskList");

  if(!container){
    return;
  }
        
  const tasks = await callApi("/tasks/project/" + projectId, "GET");

  if (!tasks){
    return;
  }

  container.innerHTML = "";

  const taskList = tasks?.tasks || [];

  if (taskList.length === 0) {
    container.innerHTML = "<tr><td colspan='3' class='text-center py-10 text-slate-400'>No tasks yet</td></tr>";
    if(document.getElementById("boardTodo")) document.getElementById("boardTodo").innerHTML = "<p class='text-slate-400 italic text-xs'>No tasks yet</p>";
    if(document.getElementById("boardProgress")) document.getElementById("boardProgress").innerHTML = "<p class='text-slate-400 italic text-xs'>No tasks yet</p>";
    if(document.getElementById("boardDone")) document.getElementById("boardDone").innerHTML = "<p class='text-slate-400 italic text-xs'>No tasks yet</p>";
    return;
  }

  const boardTodo = document.getElementById("boardTodo");
  const boardProgress = document.getElementById("boardProgress");
  const boardDone = document.getElementById("boardDone");

  if(boardTodo) boardTodo.innerHTML = "";
  if(boardProgress) boardProgress.innerHTML = "";
  if(boardDone) boardDone.innerHTML = "";

  taskList.forEach(function (task) {
    const row = document.createElement("tr");
    row.className = "border-b border-slate-800";
    row.innerHTML = `
      <td class="p-4">
        <div class="font-medium">${task.title}</div>
        <div class="text-slate-400 text-xs">${task.description || ""}</div>
      </td>
      <td class="text-center">
        <span class="text-xs bg-slate-700 px-2 py-1 rounded">${task.status}</span>
      </td>
      <td class="text-center">
        <a href="/tasks/${task._id}" class="text-blue-400 hover:text-blue-300 text-xs">View</a>
      </td>
    `;
    container.appendChild(row);

    const cardHtml = `
      <div class="bg-slate-900 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-slate-500 transition" onclick="window.location.href='/tasks/${task._id}'">
        <div class="text-sm font-medium">${task.title}</div>
        <div class="text-xs text-slate-400 mt-1 line-clamp-2">${task.description || ""}</div>
      </div>
    `;

    if (task.status === "todo" && boardTodo) {
      boardTodo.insertAdjacentHTML("beforeend", cardHtml);
    } else if (task.status === "in_progress" && boardProgress) {
      boardProgress.insertAdjacentHTML("beforeend", cardHtml);
    } else if (task.status === "completed" && boardDone) {
      boardDone.insertAdjacentHTML("beforeend", cardHtml);
    }
  });
}

const taskForm = document.getElementById("taskform")

if(taskForm){
    taskForm.addEventListener("submit", async function(event){
        event.preventDefault();

        const btn = document.getElementById("taskBtn");
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const status = document.getElementById("status").value;
        const assignedTo = document.getElementById("assignedTo").value;
        const dueDate = document.getElementById("dueDate").value;
        const projectId = document.getElementById("projectId").value;

        if (btn) { btn.disabled = true; btn.textContent = "Creating..."; }

    const task = await callApi("/tasks/" + projectId, "POST", {
        title: title,
        description: description,
        status: status,
        assignedTo: assignedTo,
        dueDate: dueDate
    })

     if (task?.success) {
       showToast("Task created successfully", "success");
       setTimeout(() => location.reload(), 1000);
     } else {
       if (btn) { btn.disabled = false; btn.textContent = "Create Task"; }
     }

  });
}

const listBtn = document.getElementById("listBtn");
const boardBtn = document.getElementById("boardBtn");

const listView = document.getElementById("taskListView");
const boardView = document.getElementById("boardView");

if (listBtn && boardBtn && listView && boardView) {
  listBtn.addEventListener("click", function () {
    listView.classList.remove("hidden");
    boardView.classList.add("hidden");
  });

  boardBtn.addEventListener("click", function () {
    boardView.classList.remove("hidden");
    listView.classList.add("hidden");
  });
}

const taskDetailForm = document.getElementById("taskDetailForm");

if (taskDetailForm) {

    taskDetailForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const taskId = document.getElementById("taskId").value;
        const projectId = document.getElementById("projectId").value;
        const updateBtn = document.getElementById("updateBtn");

        if (updateBtn) { updateBtn.disabled = true; updateBtn.textContent = "Saving..."; }

        const data = await callApi("/tasks/" + taskId, "PUT", {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            status: document.getElementById("status").value,
            assignedTo: document.getElementById("assignedTo").value,
            dueDate: document.getElementById("dueDate").value
        });

        if (data?.success) {
            showToast("Task updated successfully", "success");
            setTimeout(() => { window.location.href = "/projects/" + projectId; }, 1000);
        } else {
            if (updateBtn) { updateBtn.disabled = false; updateBtn.textContent = "Update Task"; }
        }

    });
}

const deleteBtn = document.getElementById("deleteBtn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async function () {
    if (!confirm("Delete this task? This cannot be undone.")) return;

    const taskId = document.getElementById("taskId").value;
    const projectId = document.getElementById("projectId").value;

    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";

    const res = await callApi("/tasks/" + taskId, "DELETE");

    if (res?.success) {
      showToast("Task deleted", "warn");
      setTimeout(() => { window.location.href = "/projects/" + projectId; }, 1000);
    } else {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete";
    }
  });
}

// Load project details into page header if on project-view page
async function loadProjectDetails(projectId) {
  const nameEl = document.getElementById("projectNameEl");
  const descEl = document.getElementById("projectDescEl");
  const createTaskLink = document.querySelector('a[href*="/tasks/create"]');

  const res = await callApi("/projects/" + projectId, "GET");
  const project = res?.project;

  if (project) {
    if (nameEl) nameEl.textContent = project.name;
    if (descEl) descEl.textContent = project.description || "";
    if (createTaskLink) createTaskLink.href = "/tasks/create?projectId=" + projectId;
  }
}

// Load and populate task detail form from API
async function loadTaskDetail(taskId) {
  const res = await callApi("/tasks/" + taskId, "GET");
  const task = res?.task;

  if (!task) return;

  // Populate hidden inputs
  const taskIdEl = document.getElementById("taskId");
  const projectIdEl = document.getElementById("projectId");
  if (taskIdEl) taskIdEl.value = task._id;
  if (projectIdEl) projectIdEl.value = task.projectId;

  // Populate visible fields
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const statusEl = document.getElementById("status");
  const dueDateEl = document.getElementById("dueDate");
  const assignedEl = document.getElementById("assignedTo");
  const backLink = document.querySelector("a[href*='/projects/']");

  if (titleEl) titleEl.value = task.title || "";
  if (descEl) descEl.value = task.description || "";
  if (statusEl) statusEl.value = task.status || "todo";
  if (dueDateEl && task.dueDate)
    dueDateEl.value = new Date(task.dueDate).toISOString().split("T")[0];
  if (assignedEl && task.assignedTo)
    assignedEl.value = task.assignedTo._id || task.assignedTo;
  if (backLink && task.projectId)
    backLink.href = "/projects/" + task.projectId;
}

// Auto-load on project-view page using window.PROJECT_ID
const pageProjectId = window.PROJECT_ID || document.getElementById("projectId")?.value;
if (pageProjectId && !window.TASK_ID) {
  loadProjectDetails(pageProjectId);
  loadTasks(pageProjectId);
}

// Auto-load on task-detail page using window.TASK_ID
if (window.TASK_ID) {
  loadTaskDetail(window.TASK_ID);
}