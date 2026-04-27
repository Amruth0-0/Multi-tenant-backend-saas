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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function showError(msg) {
  // Show in errorBox if present, toast already fires from callApi
  if (errorBox) {
    errorBox.textContent = msg || "Something went wrong. Please try again.";
    errorBox.classList.remove("hidden");
  }
}

function hideError() {
  if (errorBox) errorBox.classList.add("hidden");
}

// ─── Invite Token Link Preserver ──────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("inviteToken");
  
  if (inviteToken) {
    const links = document.querySelectorAll('a[href="/login"], a[href="/register"]');
    links.forEach(link => {
      const base = link.getAttribute('href');
      link.setAttribute('href', `${base}?inviteToken=${inviteToken}`);
    });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn      = document.getElementById("loginBtn") || loginForm.querySelector("button[type=submit]");

    if (btn) { btn.disabled = true; btn.textContent = "Signing in…"; }

    try {
      const data = await callApi("/auth/login", "POST", { email, password });

      if (!data || data.success === false) {
        showError(data?.message || "Invalid email or password.");
        return;
      }

      const token = data.token || data.data?.token;
      if (!token) {
        showError("Login succeeded but no session was returned. Please try again.");
        return;
      }

      localStorage.setItem("token", token);
      if (data.username) localStorage.setItem("username", data.username);

      const params      = new URLSearchParams(window.location.search);
      const inviteToken = params.get("inviteToken");
      const workspaces  = data.workspaces || [];

      // CASE 1: Invite flow
      if (inviteToken) {
        window.location.href = `/invite/${inviteToken}`;
        return;
      }

      // CASE 2: No workspace yet
      if (workspaces.length === 0) {
        window.location.href = "/create-workspace";
        return;
      }

      // CASE 3: Has workspaces → auto-select the first
      const selectedWs = workspaces[0];
      const res = await callApi("/auth/workspace/select", "POST", {
        workspaceId: selectedWs.workspaceId,
      });

      // If select fails, don't redirect to a broken dashboard
      if (!res || res.success === false) {
        showError("Could not activate your workspace. Please try again.");
        return;
      }

      if (res.token) localStorage.setItem("token", res.token);
      if (selectedWs.name) localStorage.setItem("workspaceName", selectedWs.name);

      window.location.href = "/dashboard";

    } catch (err) {
      // Handles network failures / server down
      showError("Network error. Please check your connection and try again.");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Sign In"; }
    }
  });
}

// ─── Register ─────────────────────────────────────────────────────────────────
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideError();

    const name     = document.getElementById("name").value.trim();
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn      = document.getElementById("registerBtn") || registerForm.querySelector("button[type=submit]");

    if (btn) { btn.disabled = true; btn.textContent = "Creating account…"; }

    try {
      const data = await callApi("/auth/register", "POST", { username: name, email, password });

      if (!data || data.success === false) {
        showError(data?.message || "Registration failed. Please try again.");
        return;
      }

      // Guard: ensure token actually exists before storing
      if (!data.token) {
        showError("Account created but session could not be established. Please log in.");
        window.location.href = "/login";
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.username) localStorage.setItem("username", data.username);
      
      const params      = new URLSearchParams(window.location.search);
      const inviteToken = params.get("inviteToken");
      
      if (inviteToken) {
        window.location.href = `/invite/${inviteToken}`;
      } else {
        window.location.href = data.redirectTo || "/create-workspace";
      }

    } catch (err) {
      showError("Network error. Please check your connection and try again.");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Create Account"; }
    }
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async function () {
    await callApi("/auth/logout", "POST");
    localStorage.clear();
    window.location.href = "/login";
  });
}
