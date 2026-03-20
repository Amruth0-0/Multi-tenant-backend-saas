const inviteModel = require("../models/invite.model");
const userModel = require("../models/user.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const generateInviteToken = require("../utils/generateToken");

const createInvite = async ({ email, workspaceId, role }) => {
  const existingPendingInvite = await inviteModel.findOne({
    email,
    workspaceId,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  if (existingPendingInvite) {
    throw new Error("A pending invite already exists for this email");
  }

  const token = generateInviteToken();

  const invite = await inviteModel.create({
    email,
    workspaceId,
    role,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  return invite;
};

const getInviteByToken = async (token) => {
  const invite = await inviteModel
    .findOne({ token })
    .populate("workspaceId", "name");

  if (!invite) {
    throw new Error("Invalid invite");
  }

  if (invite.status === "accepted") {
    throw new Error("Invite already used");
  }

  if (invite.expiresAt < new Date()) {
    throw new Error("Invite expired");
  }

  return invite;
};

const acceptInvite = async ({ token, userId }) => {
  const invite = await inviteModel.findOne({ token });

  if (!invite) {
    throw new Error("Invalid invite");
  }

  if (invite.status === "accepted") {
    throw new Error("Invite already used");
  }

  if (invite.expiresAt < new Date()) {
    throw new Error("Invite expired");
  }

  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
    throw new Error("This invite is not assigned to your account");
  }

  const existingMember = await workspaceMemberModel.findOne({
    user: userId,
    workspace: invite.workspaceId,
  });

  if (existingMember) {
    throw new Error("You are already a member of this workspace");
  }

  await workspaceMemberModel.create({
    user: userId,
    workspace: invite.workspaceId,
    role: invite.role,
  });

  invite.status = "accepted";
  await invite.save();

  return invite;
};

module.exports = {
  createInvite,
  getInviteByToken,
  acceptInvite,
};
