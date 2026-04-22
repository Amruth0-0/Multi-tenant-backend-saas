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
  const token = getToken();

  const headers = {
    ...(token && { Authorization: "Bearer " + token }),
    ...(data && { "Content-Type": "application/json" }),
  };

  let response;
  try {
    response = await fetch("/api" + url, {
      method,
      headers,
      credentials: "include",
      ...(data && { body: JSON.stringify(data) }),
    });
  } catch {
    // Network error — server unreachable or offline
    showToast("Network error. Please check your connection.", "error");
    return { success: false, message: "Network error" };
  }

  const result = await response.json();

  if (!response.ok) {
    // If express-validator returned a 422 with an errors array, surface the first message
    if (response.status === 422 && Array.isArray(result.errors) && result.errors.length > 0) {
      const firstMsg = result.errors[0].msg || "Validation error";
      showToast(firstMsg, "error");
      result.message = firstMsg;
      return result;
    }

    let msg = result.message || "Something went wrong";
    const lower = msg.toLowerCase();

    // Sanitize raw Mongoose/BSON internals — but NOT user-friendly validation messages
    if (
      lower.includes("validation failed") ||
      lower.includes("cast to") ||
      lower.startsWith("path ") ||
      lower.includes("bson") ||
      lower.includes("e11000") ||
      lower.includes("duplicate key")
    ) {
      msg = "An unexpected error occurred. Please check your inputs or try again.";
      result.message = msg;
    }

    showToast(msg, "error");
  }

  return result;
}
