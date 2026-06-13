const crypto = require("crypto");

const generateInviteToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = generateInviteToken;
