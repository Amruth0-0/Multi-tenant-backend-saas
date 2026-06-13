const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.requireAuthUI = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.redirect("/login");
    }

    const user = await User.findById(decoded.userId).select("username");

    req.user = {
      userId: decoded.userId,
      workspaceId: decoded.workspaceId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    res.locals.__user__ = {
      userId: decoded.userId,
      workspaceId: decoded.workspaceId,
      tenantId: decoded.tenantId,
      role: decoded.role,
      username: user?.username || null,
    };

    next();
  } catch (error) {
    return res.redirect("/login");
  }
};
