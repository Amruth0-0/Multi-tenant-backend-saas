const inviteInfo = document.getElementById("inviteInfo");
const workspaceName = document.getElementById("workspaceName");
const inviteEmail = document.getElementById("inviteEmail");
const inviteRole = document.getElementById("inviteRole");
const inviteExpiry = document.getElementById("inviteExpiry");
const message = document.getElementById("message");
const acceptInviteBtn = document.getElementById("acceptInviteBtn");

const token = window.INVITE_TOKEN;

const loadInviteDetails = async () => {
  try {
    const response = await fetch(`/api/workspace/invite/${token}`);
    const result = await response.json();

    if (!result.success) {
      message.textContent = result.message || "Invalid invite";
      return;
    }

    const invite = result.data;

    workspaceName.textContent = invite.workspace?.name || "Workspace";
    inviteEmail.textContent = invite.email;
    inviteRole.textContent = invite.role;
    inviteExpiry.textContent = new Date(invite.expiresAt).toLocaleString();

    inviteInfo.classList.remove("hidden");

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      message.textContent = "Please login first to accept this invite";
      acceptInviteBtn.textContent = "Go to Login";
      acceptInviteBtn.classList.remove("hidden");
      return;
    }

    message.textContent = "Invite is valid";
    acceptInviteBtn.textContent = "Accept Invite";
    acceptInviteBtn.classList.remove("hidden");
  } catch (error) {
    message.textContent = "Something went wrong while checking the invite";
  }
};

const handleAcceptInvite = async () => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    window.location.href = `/auth/login?inviteToken=${token}`;
    return;
  }

  try {
    acceptInviteBtn.disabled = true;
    acceptInviteBtn.textContent = "Accepting...";

    const result = await callApi("/workspace/accept-invite", "POST", {
      token,
    });

    if (!result || result.success === false) {
      acceptInviteBtn.disabled = false;
      acceptInviteBtn.textContent = "Accept Invite";
      return;
    }

    alert(result.message || "Invite accepted successfully");
    window.location.href = "/dashboard";
  } catch (error) {
    message.textContent = error.message || "Could not accept invite";
    acceptInviteBtn.disabled = false;
    acceptInviteBtn.textContent = "Accept Invite";
  }
};

if (acceptInviteBtn) {
  acceptInviteBtn.addEventListener("click", handleAcceptInvite);
}

loadInviteDetails();
