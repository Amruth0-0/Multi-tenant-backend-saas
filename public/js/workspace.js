// 🔐 Auth Guard (same pattern as other pages)
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
})();

const form = document.getElementById("createForm");
const input = document.getElementById("workspaceName");
const btn = document.getElementById("submitBtn");
const errorMsg = document.getElementById("errorMsg");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");

// Enable / disable button based on input
if (input && btn) {
  input.addEventListener("input", () => {
    btn.disabled = input.value.trim().length === 0;

    if (errorMsg) {
      errorMsg.classList.add("hidden");
    }
  });
}

// Form submit
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = input.value.trim();
    if (!name) return;

    // 🔄 Loading UI
    btn.disabled = true;
    spinner.classList.remove("hidden");
    btnText.textContent = "Creating...";

    try {
      const data = await callApi("/workspace", "POST", {
        name: name,
      });

      if (!data || data.success === false) {
        throw new Error(data?.message || "Failed to create workspace");
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Save workspace name so dashboard can display it
      if (data.workspace?.name) {
        localStorage.setItem("workspaceName", data.workspace.name);
      }

      window.location.href = "/dashboard";
    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove("hidden");
      }

      // Reset UI
      btn.disabled = false;
      spinner.classList.add("hidden");
      btnText.textContent = "Create Workspace";
    }
  });
}
