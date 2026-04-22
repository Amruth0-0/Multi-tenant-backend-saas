const Workspace = require("../models/workspace.model");
const WorkspaceMember = require("../models/workspaceMember.model");
const createError = require("../utils/createError");
const crypto = require("crypto");

const generateCode = () => crypto.randomBytes(4).toString("hex");

const createWorkspace = async ({ name, userId }) => {
  if (!name || !name.trim()) {
    throw createError("Workspace name is required", 400); // changed
  }

  if (!userId) {
    throw createError("UserId is required", 400); // changed
  }

  let wkspace;
  try {
    wkspace = await Workspace.create({
      name: name.trim(),
      ownerId: userId,
      inviteCode: generateCode(),
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createError("You already have a workspace with this name", 400);
    }
    throw error;
  }

  await WorkspaceMember.create({
    userId: userId, 
    workspaceId: wkspace._id, 
    role: "owner",
  });

  return {
    _id: wkspace._id,
    tenantId: wkspace.tenantId, 
    name: wkspace.name,
    inviteCode: wkspace.inviteCode,
  };
};

const resetInviteCode = async (workspaceId) => {
  const newCode = generateCode();
  const wkspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    { inviteCode: newCode },
    { new: true }
  );

  if (!wkspace) {
    throw createError("Workspace not found", 404);
  }

  return wkspace.inviteCode;
};

module.exports = { createWorkspace, resetInviteCode };
