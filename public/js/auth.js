const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");
const errorBox = document.getElementById("errorBox");

if (togglePassword && passwordField) {
  togglePassword.addEventListener("click", function () {
    if (passwordField.type === "password") {
      passwordField.type = "text";
      togglePassword.innerText = "Hide";
    } else {
      passwordField.type = "password";
      togglePassword.innerText = "Show";
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const data = await callApi("/auth/login", "POST", {
      email: email,
      password: password,
    });

    if (!data || data.success === false) {
      if (errorBox) {
        errorBox.classList.remove("hidden");
      }
      return;
    }

    const token = data.token || data.data?.token;

    if (token) {
      localStorage.setItem("token", token);

      const params = new URLSearchParams(window.location.search);
      const inviteToken = params.get("inviteToken");

      const workspaces = data.workspaces || [];

      // 🔥 CASE 1: Invite flow (keep as is)
      if (inviteToken) {
        window.location.href = `/invite/${inviteToken}`;
        return;
      }

      // 🔥 CASE 2: No workspace
      if (workspaces.length === 0) {
        window.location.href = "/create-workspace";
        return;
      }

      // 🔥 CASE 3: Has workspaces → AUTO SELECT the first one
      if (workspaces.length > 0) {
        const selectedWs = workspaces[0];
        const res = await callApi("/auth/workspace/select", "POST", {
          workspaceId: selectedWs.workspaceId,
        });

        if (res?.token) {
          localStorage.setItem("token", res.token);
        }
        // Save workspace name so dashboard can display it
        if (selectedWs.name) {
          localStorage.setItem("workspaceName", selectedWs.name);
        }

        window.location.href = "/dashboard";
        return;
      }
    }

    if (errorBox) {
      errorBox.classList.remove("hidden");
    }
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const data = await callApi("/auth/register", "POST", {
      username: name,
      email: email,
      password: password,
    });

    if (!data || data.success === false) {
      if (errorBox) {
        errorBox.classList.remove("hidden");
      }
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = data.redirectTo || "/create-workspace";
  });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");

    window.location.href = "/login";
  });
}
