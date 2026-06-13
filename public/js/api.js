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
    "fixed top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-[9999] flex items-center gap-3",
    "px-5 py-3 rounded-2xl border text-white text-sm font-medium",
    "shadow-2xl backdrop-blur-sm transition-all duration-300 opacity-100",
    colors[type] || colors.success,
  ].join(" ");
  toast.style.maxWidth = "90vw";
  toast.style.width = "auto";
  toast.innerHTML = `<span class="text-lg leading-none">${icons[type] || "✓"}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateY(-8px)"; }, 2800);
  setTimeout(() => toast.remove(), 3100);
}

async function callApi(url, method, data) {
  const headers = {
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
    showToast("Network error. Please check your connection.", "error");
    return { success: false, message: "Network error" };
  }

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 422 && Array.isArray(result.errors) && result.errors.length > 0) {
      const firstMsg = result.errors[0].msg || "Validation error";
      showToast(firstMsg, "error");
      result.message = firstMsg;
      return result;
    }

    let msg = result.message || "Something went wrong";
    const lower = msg.toLowerCase();

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
