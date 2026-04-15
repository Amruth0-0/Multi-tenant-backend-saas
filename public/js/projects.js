async function loadProjects() {
   const container = document.getElementById("projectList");

    if(!container){
      return;
    } 

    const projects = await callApi("/projects", "GET");

    if(!projects){
        return;
    }

    container.innerHTML = "";

    const projectList = projects?.projects || [];

    if (projectList.length === 0) {
        container.innerHTML = "<p class='text-slate-400 italic'>No projects yet</p>";
        return;
    }

    projectList.forEach(function (project) {
       const div = document.createElement("div");

        div.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <a href="/projects/${project._id}">Open</a>
        `;

        container.appendChild(div);
  })
}

const projectForm = document.getElementById("projectForm")

if(projectForm){
    projectForm.addEventListener("submit", async function(event){
        event.preventDefault()

        const btn = document.getElementById("submitBtn");
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;

        if (btn) { btn.disabled = true; btn.textContent = "Creating..."; }

        const project = await callApi("/projects", "POST", {
          name: name,
          description: description
        });

        if (project?.success && project?.project?._id) {
            showToast("Project created!", "success");
            setTimeout(() => { window.location.href = "/projects/" + project.project._id; }, 800);
        } else if (project?.success) {
            location.reload();
        } else {
            if (btn) { btn.disabled = false; btn.textContent = "Create Project"; }
        }
    })
}

loadProjects()
