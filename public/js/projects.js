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
        
        div.className = "bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 hover:border-blue-500 hover:shadow-lg transition flex flex-col justify-between cursor-pointer group";
        div.onclick = () => window.location.href = `/projects/${project._id}`;

        div.innerHTML = `
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-semibold text-xl group-hover:text-blue-400 transition">
                ${project.name}
              </h2>
              <span class="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
                ${project.status || "Active"}
              </span>
            </div>
            <p class="text-slate-400 text-sm mb-6 line-clamp-3">
              ${project.description || "No description provided."}
            </p>
          </div>
          <div class="flex justify-between items-center text-sm pt-4 border-t border-slate-700/50">
            <span class="text-blue-400 font-medium group-hover:text-blue-300 transition flex items-center gap-1">
              Open Project <span class="text-lg leading-none">&rarr;</span>
            </span>
            <span class="text-slate-500 text-xs truncate max-w-[120px]">
              ${project.createdBy?.username ? "By " + project.createdBy.username : ""}
            </span>
          </div>
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
