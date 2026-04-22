const jwt = require("jsonwebtoken");

exports.requireAuthUI = (req, res, next) => {
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

    req.user = {
      userId: decoded.userId,
      workspaceId: decoded.workspaceId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.redirect("/login");
  }
};
