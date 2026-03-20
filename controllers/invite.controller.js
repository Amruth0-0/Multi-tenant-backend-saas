const inviteService = require("../services/invite.service");

const createInvite = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const role = req.body.role || "member";
    const workspaceId = req.user.tenantId;

    const invite = await inviteService.createInvite({
      email,
      workspaceId,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      data: invite,
      inviteLink: `http://localhost:3000/invite/${invite.token}`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getInviteDetails = async (req, res) => {
  try {
    const token = req.params.token?.trim();

    const invite = await inviteService.getInviteByToken(token);

    res.status(200).json({
      success: true,
      message: "Invite is valid",
      data: {
        email: invite.email,
        role: invite.role,
        workspace: invite.workspaceId,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const token = req.body.token?.trim();
    const userId = req.user.userId;

    const invite = await inviteService.acceptInvite({ token, userId });

    res.status(200).json({
      success: true,
      message: "Joined workspace successfully",
      data: invite,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createInvite,
  getInviteDetails,
  acceptInvite,
};
