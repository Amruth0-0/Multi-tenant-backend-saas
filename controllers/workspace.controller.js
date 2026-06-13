const workspaceService = require("../services/workspace.service");
const workspaceMemberModel = require("../models/workspaceMember.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign(
      {
        userId: userId.toString(),
        tenantId: workspace.tenantId,
        workspaceId: workspace._id.toString(),
        role: "owner",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === 'production'
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created",
      workspace,
      inviteCode: workspace.inviteCode,
      token,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Workspace creation failed",
    });
  }
};

const getWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ success: false, message: "Invalid workspaceId" });
    }

    const isMember = await workspaceMemberModel.findOne({
      userId: req.user.userId,
      workspaceId,
    });

    if (!isMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const Workspace = require("../models/workspace.model");
    const workspace = await Workspace.findById(workspaceId).select("name tenantId inviteCode status");

    if (!workspace) {
      return res.status(404).json({ success: false, message: "Workspace not found" });
    }

    return res.status(200).json({
      success: true,
      inviteCode: workspace.inviteCode,
      name: workspace.name,
      workspace,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to fetch workspace",
    });
  }
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid WorkspaceId",
      });
    }

    const isMember = await workspaceMemberModel.findOne({
      userId: req.user.userId,
      workspaceId: workspaceId,
    });

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 50), 100);
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      workspaceMemberModel
        .find({ workspaceId })
        .populate("userId", "username email")
        .skip(skip)
        .limit(limit),
      workspaceMemberModel.countDocuments({ workspaceId }),
    ]);

    return res.status(200).json({
      success: true,
      count: members.length,
      total,
      page,
      limit,
      members,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to fetch members",
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspaceId",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid memberId",
      });
    }

    const membership = await workspaceMemberModel.findOne({
      userId: req.user.userId,
      workspaceId: workspaceId,
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }

    const member = await workspaceMemberModel.findOne({
      _id: memberId,
      workspaceId: workspaceId,
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

    await workspaceMemberModel.findOneAndDelete({
      _id: memberId,
      workspaceId: workspaceId,
    });

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to delete Member",
    });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const role = req.body.role;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member Id",
      });
    }

    const membership = await workspaceMemberModel.findOne({
      userId: req.user.userId,
      workspaceId: workspaceId,
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (membership.role !== "owner" && membership.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }

    const member = await workspaceMemberModel.findOne({
      _id: memberId,
      workspaceId: workspaceId,
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

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const update = await workspaceMemberModel.findOneAndUpdate(
      {
        _id: memberId,
        workspaceId: workspaceId,
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
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to update member role",
    });
  }
};

const resetInviteLink = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspaceId",
      });
    }

    const newCode = await workspaceService.resetInviteCode(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Invite link reset successfully",
      inviteCode: newCode,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to reset invite link",
    });
  }
};

module.exports = {
  workspaceCreate,
  getWorkspace,
  getWorkspaceMembers,
  removeMember,
  updateMemberRole,
  resetInviteLink,
};
