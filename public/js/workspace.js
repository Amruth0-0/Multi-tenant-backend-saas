const form = document.getElementById("createForm");
const input = document.getElementById("workspaceName");
const btn = document.getElementById("submitBtn");
const errorMsg = document.getElementById("errorMsg");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");

if (input && btn) {
  input.addEventListener("input", () => {
    btn.disabled = input.value.trim().length === 0;

    if (errorMsg) {
      errorMsg.classList.add("hidden");
    }
  });
}

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = input.value.trim();
    if (!name) return;

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

      window.location.href = "/dashboard";
    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove("hidden");
      }

      btn.disabled = false;
      spinner.classList.add("hidden");
      btnText.textContent = "Create Workspace";
    }
  });
}
