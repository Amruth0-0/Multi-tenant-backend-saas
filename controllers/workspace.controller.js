const workspaceService = require("../services/workspace.service");
const workspaceMemberModel = require("../models/workspaceMember.model");
const mongoose = require("mongoose");

const workspaceCreate = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    const userId = req.user.userId;

    const workspace = await workspaceService.createWorkspace({
      name,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created",
      workspace,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Workspace creation failed",
    });
  }
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const workspaceId = req.user.tenantId;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid WorkspaceId",
      });
    }

    const members = await workspaceMemberModel
      .find({
        workspaceId,
      })
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Member ID",
      });
    }

    const member = await workspaceMemberModel.findOne({
      _id: memberId,
      workspaceId: req.user.tenantId,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(400).json({
        success: false,
        message: "Workspace owner cannot be removed",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to delete",
      });
    }

    await workspaceMemberModel.deleteOne({
      _id: memberId,
      workspaceId: req.user.tenantId,
    });

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete Member",
    });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member Id",
      });
    }

    const member = await workspaceMemberModel.findOne({
      _id: memberId,
      workspaceId: req.user.tenantId,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(400).json({
        success: false,
        message: "Owner cannot be Updated",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to Update",
      });
    }

    const role = req.body.role;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const update = await workspaceMemberModel.findOneAndUpdate(
      {
        _id: memberId,
        workspaceId: req.user.tenantId,
      },
      {
        role,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      member: update,
      message: "Member role updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update member role",
    });
  }
};

module.exports = {
  workspaceCreate,
  getWorkspaceMembers,
  removeMember,
  updateMemberRole,
};
