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

  tasks.forEach(function (task) {
    const div = document.createElement("div");

    div.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
        `;

    container.appendChild(div);
  });
}

const taskForm = document.getElementById("taskform")

if(taskForm){
    taskForm.addEventListener("submit", async function(event){
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const status = document.getElementById("status").value;
        const assignedTo = document.getElementById("assignedTo").value;
        const dueDate = document.getElementById("dueDate").value;
        const projectId = document.getElementById("projectId").value;

    const task = await callAPI("/tasks", "POST", {
        title: title,
        description: description,
        status: status,
        assignedTo: assignedTo,
        dueDate: dueDate,
        projectId: projectId
    })

     if (task) {
       alert("Task created");
       location.reload();
     }

  });
}

const listBtn = document.getElementById("listBtn");
const boardBtn = document.getElementById("boardBtn");

const listView = document.getElementById("listView");
const boardView = document.getElementById("boardView");

if (listBtn && boardBtn) {
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

        const data = await callApi("/tasks/" + taskId, "PUT", {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            status: document.getElementById("status").value,
            assignedTo: document.getElementById("assignedTo").value,
            dueDate: document.getElementById("dueDate").value
        });

        if (data) {
            alert("Task updated");
            window.location.href = "/projects/" + projectId;
        }

    });
}

const deleteBtn = document.getElementById("deleteBtn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async function () {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const taskId = document.getElementById("taskId").value;
    const projectId = document.getElementById("projectId").value;

    const res = await callApi("/tasks/" + taskId, "DELETE");

    if (res) {
      alert("Task deleted");
      window.location.href = "/projects/" + projectId;
    }
  });
}

loadTasks()