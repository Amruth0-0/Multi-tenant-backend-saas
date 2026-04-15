// Decode JWT to get workspaceId (no secret needed client-side)
function decodeToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// Load and render members table
async function loadMembers() {
  const decoded = decodeToken();
  if (!decoded?.workspaceId) return;

  const tbody = document.getElementById("memberTableBody");
  if (!tbody) return;

  const res = await callApi("/workspace-members/" + decoded.workspaceId + "/members", "GET");
  const members = res?.members || [];

  if (members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center py-10 text-slate-400">No members in this workspace</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => {
    const name = m.userId?.username || "Member";
    const email = m.userId?.email || "";
    const role = m.role;
    const memberId = m._id;
    return `
      <tr class="border-b border-slate-800">
        <td class="p-4 flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=fff"
               class="w-8 h-8 rounded-full" />
          <div>
            <div class="font-medium">${name}</div>
            <div class="text-xs text-slate-400">${email}</div>
          </div>
        </td>
        <td class="text-center">
          <span class="text-xs bg-slate-700 px-2 py-1 rounded capitalize">${role}</span>
        </td>
        <td class="text-center">
          ${role !== 'owner'
            ? `<button onclick="removeMember('${decoded.workspaceId}','${memberId}', this)"
                 class="text-red-400 hover:text-red-300 text-xs">Remove</button>`
            : `<span class="text-xs text-slate-500">Owner</span>`}
        </td>
      </tr>
    `;
  }).join("");
}

// Remove a member via API
async function removeMember(workspaceId, memberId, btn) {
  if (!confirm("Remove this member from the workspace?")) return;
  btn.disabled = true;
  btn.textContent = "Removing...";
  const res = await callApi(`/workspace-members/${workspaceId}/members/${memberId}`, "DELETE");
  if (res?.success) {
    loadMembers();
  } else {
    btn.disabled = false;
    btn.textContent = "Remove";
  }
}

loadMembers();

const inviteForm = document.getElementById("inviteForm");

if (inviteForm) {
  inviteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // CHANGED: trim and lowercase email before sending
    const email = document.getElementById("email").value.trim().toLowerCase();
    const role = document.getElementById("role").value;
    const btn = document.getElementById("inviteBtn");

    try {
      btn.innerText = "Sending...";
      btn.disabled = true;

      // CHANGED: removed /api because callApi already prefixes /api internally
      const data = await callApi("/workspace/invite", "POST", {
        email,
        role,
      });

      // CHANGED: since your callApi returns result even on failure,
      // check success manually before continuing
      if (!data || data.success === false) {
        btn.innerText = "Send Invitation";
        btn.disabled = false;
        return;
      }

      alert(data.message || "Invitation sent");

      if (data.inviteLink) {
        console.log("Invite Link:", data.inviteLink);
      }

      inviteForm.reset();
    } catch (error) {
      alert(error.message || "Failed to send invitation");
    } finally {
      btn.innerText = "Send Invitation";
      btn.disabled = false;
    }
  });
}
