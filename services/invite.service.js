const Workspace = require("../models/workspace.model");
const userModel = require("../models/user.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const createError = require("../utils/createError");

const getInviteByToken = async (token) => {
  const workspace = await Workspace.findOne({ inviteCode: token }).select("name _id");

  if (!workspace) {
    throw createError("Invalid or expired invite link", 404);
  }

  return {
    workspaceId: workspace,
    role: "member"
  };
};

const acceptInvite = async ({ token, userId }) => {
  const workspace = await Workspace.findOne({ inviteCode: token });

  if (!workspace) {
    throw createError("Invalid or expired invite link", 404);
  }

  const user = await userModel.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  const existingMember = await workspaceMemberModel.findOne({
    userId: userId,
    workspaceId: workspace._id,
  });

  if (existingMember) {
    throw createError("You are already a member of this workspace", 409);
  }

  await workspaceMemberModel.create({
    userId: userId,
    workspaceId: workspace._id,
    role: "member",
  });

  return {
    workspaceId: workspace._id,
    name: workspace.name
  };
};

module.exports = {
  getInviteByToken,
  acceptInvite,
};
