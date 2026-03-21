const Workspace = require("../models/workspace.model");
const WorkspaceMember = require("../models/workspaceMember.model");
const createError = require("../utils/createError")

const createWorkspace = async ({ name, userId }) => {
  if (!name || !name.trim()) {
    throw createError("Workspace name is required", 400); // changed
  }

  if (!userId) {
    throw createError("UserId is required", 400); // changed
  }

  const wkspace = await Workspace.create({
    name: name.trim(),
    ownerId: userId, 
  });

  await WorkspaceMember.create({
    userId: userId, 
    workspaceId: wkspace._id, 
    role: "owner",
  });

  return {
    tenantId: wkspace.tenantId, 
    name: wkspace.name,
  };
};

module.exports = { createWorkspace };
