const inviteService = require("../services/invite.service");

const getInviteDetails = async (req, res) => {
  try {
    const token = req.params.token?.trim();

    const invite = await inviteService.getInviteByToken(token);

    res.status(200).json({
      success: true,
      message: "Invite is valid",
      data: invite,
    });
  } catch (err) {
    res.status(err.status || 400).json({
      success: false,
      message: err.message || "Invite details failed"
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
    res.status(err.status || 400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getInviteDetails,
  acceptInvite,
};
