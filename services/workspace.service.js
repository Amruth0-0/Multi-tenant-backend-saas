const Workspace = require("../models/workspace.model");
const WorkspaceMember = require("../models/workspaceMember.model");

const createWorkspace = async ({ name, userId }) => {
  const wkspace = await Workspace.create({
    name: name,
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
