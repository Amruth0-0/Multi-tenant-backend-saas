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

      if (inviteToken) {
        window.location.href = `/invite/${inviteToken}`;
      } else {
        window.location.href = "/dashboard";
      }
      return;
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
    const workspaceName = document.getElementById("workspaceName").value.trim();

    
    const data = await callApi("/auth/register", "POST", {
      name: name,
      email: email,
      password: password,
      workspaceName: workspaceName,
    });

    if (!data || data.success === false) {
      if (errorBox) {
        errorBox.classList.remove("hidden");
      }
      return;
    }

    alert(data.message || "Account created successfully");
    window.location.href = "/login";
  });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");

    window.location.href = "/login";
  });
}
