// ─── Toast Notification System ────────────────────────────────────────────────
function showToast(message, type = "success") {
  const existing = document.getElementById("_tfToast");
  if (existing) existing.remove();

  const colors = {
    success: "bg-emerald-600 border-emerald-500",
    error:   "bg-red-700 border-red-600",
    info:    "bg-blue-600 border-blue-500",
    warn:    "bg-amber-600 border-amber-500",
  };

  const icons = { success: "✓", error: "✕", info: "ℹ", warn: "⚠" };

  const toast = document.createElement("div");
  toast.id = "_tfToast";
  toast.className = [
    "fixed top-5 right-5 z-[9999] flex items-center gap-3",
    "px-5 py-3 rounded-2xl border text-white text-sm font-medium",
    "shadow-2xl backdrop-blur-sm transition-all duration-300 opacity-100",
    colors[type] || colors.success,
  ].join(" ");
  toast.style.maxWidth = "360px";
  toast.innerHTML = `<span class="text-lg leading-none">${icons[type] || "✓"}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  // Fade out
  setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateY(-8px)"; }, 2800);
  setTimeout(() => toast.remove(), 3100);
}

function getToken() {
  return localStorage.getItem("token");
}

async function callApi(url, method, data) {
  let response;
  const token = getToken();

  const headers = {
    ...(token && { Authorization: "Bearer " + token }),
    ...(data && { "Content-Type": "application/json" }),
  };

  response = await fetch("/api" + url, {
    method: method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  });

  const result = await response.json();
  if (!response.ok) {
    showToast(result.message || "Something went wrong", "error");
  }

  return result;
}
