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
