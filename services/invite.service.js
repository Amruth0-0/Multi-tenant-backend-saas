const inviteModel = require("../models/invite.model");
const userModel = require("../models/user.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const generateInviteToken = require("../utils/generateToken");
const createError = require("../utils/createError")

const createInvite = async ({ email, workspaceId, role }) => {
  const existingPendingInvite = await inviteModel.findOne({
    email,
    workspaceId,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  if (existingPendingInvite) {
   throw createError("A pending invite already exists for this email", 409);
  }

  const token = generateInviteToken();

  const invite = await inviteModel.create({
    email,
    workspaceId: workspaceId,
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
    throw createError("Invalid invite", 404);
  }

  if (invite.status === "accepted") {
   throw createError("Invite already used", 409);
  }

  if (invite.expiresAt < new Date()) {
   throw createError("Invite expired", 410);
  }

  return invite;
};

const acceptInvite = async ({ token, userId }) => {
  const invite = await inviteModel.findOne({ token });

  if (!invite) {
    throw createError("Invite expired", 410);
  }

  if (invite.status === "accepted") {
    throw createError("Invite already used", 409);
  }

  if (invite.expiresAt < new Date()) {
    throw createError("Invite expired", 410);
  }

  const user = await userModel.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
     throw createError("This invite is not assigned to your account", 403);
  }

  const existingMember = await workspaceMemberModel.findOne({
    userId: userId,
    workspaceId: invite.workspaceId,
  });

  if (existingMember) {
    throw createError("You are already a member of this workspace", 409);
  }

  await workspaceMemberModel.create({
    userId: userId,
    workspaceId: invite.workspaceId,
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
