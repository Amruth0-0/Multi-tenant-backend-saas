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

    projects.forEach(function (project) {
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

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;

        const project = await callApi("/projects", "POST", {
          name: name,
          description: description
        });

         if (project) {
            alert("Project created");
            location.reload();
        }
    })
}

loadProjects()
