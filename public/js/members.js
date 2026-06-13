async function loadInviteLink() {
  const user = window.__USER__;
  if (!user?.workspaceId) return;
  const display = document.getElementById("inviteLinkDisplay");
  const copyBtn = document.getElementById("copyLinkBtn");
  const resetBtn = document.getElementById("resetLinkBtn");

  const res = await callApi("/workspace/" + user.workspaceId, "GET");
  const code = res?.inviteCode;

  if (code && display) {
    const link = window.location.origin + "/invite/" + code;
    display.textContent = link;

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(link);
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy", 2000);
      });
    }
  } else if (display) {
    display.textContent = "Could not load invite link.";
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (!confirm("This will invalidate the current invite link. Continue?")) return;
      resetBtn.textContent = "Resetting\u2026";
      const r = await callApi("/workspace/" + user.workspaceId + "/reset-invite", "POST");
      if (r?.inviteCode && display) {
        const newLink = window.location.origin + "/invite/" + r.inviteCode;
        display.textContent = newLink;
        showToast("Invite link reset! Old link is now dead.", "warn");
      }
      resetBtn.textContent = "\u21BA Reset link";
    });
  }
}

async function loadMembers() {
  const user = window.__USER__;
  if (!user?.workspaceId) return;

  const tbody = document.getElementById("memberTableBody");
  if (!tbody) return;

  const res = await callApi("/workspace-members/" + user.workspaceId + "/members", "GET");
  const members = res?.members || [];

  if (members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-slate-500">No members yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => {
    const name     = m.userId?.username || "Member";
    const email    = m.userId?.email || "";
    const role     = m.role;
    const memberId = m._id;
    const initials = name.slice(0, 2).toUpperCase();
    const roleColors = {
      owner:  "bg-yellow-900/50 text-yellow-300 border border-yellow-600/30",
      admin:  "bg-blue-900/50 text-blue-300 border border-blue-600/30",
      member: "bg-slate-700 text-slate-300"
    };
    const badge = roleColors[role] || roleColors.member;

    return `
      <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
        <td class="px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold shrink-0">${initials}</div>
            <span class="font-medium text-sm">${name}</span>
          </div>
        </td>
        <td class="px-5 py-3 text-sm text-slate-400">${email}</td>
        <td class="px-4 py-3 text-center">
          <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize ${badge}">${role}</span>
        </td>
        <td class="px-4 py-3 text-center">
          ${role !== "owner"
            ? `<button onclick="removeMember('${user.workspaceId}','${memberId}', this)"
                 class="text-xs text-red-400 hover:text-red-300 transition">Remove</button>`
            : `<span class="text-xs text-slate-600">\u2014</span>`}
        </td>
      </tr>`;
  }).join("");
}

async function removeMember(workspaceId, memberId, btn) {
  if (!confirm("Remove this member from the workspace?")) return;
  btn.disabled = true;
  btn.textContent = "Removing\u2026";
  const res = await callApi(`/workspace-members/${workspaceId}/members/${memberId}`, "DELETE");
  if (res?.success) {
    showToast("Member removed", "warn");
    loadMembers();
  } else {
    btn.disabled = false;
    btn.textContent = "Remove";
  }
}

loadInviteLink();
loadMembers();
