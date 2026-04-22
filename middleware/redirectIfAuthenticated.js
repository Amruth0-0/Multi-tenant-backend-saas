const jwt = require("jsonwebtoken");

/**
 * Middleware: redirectIfAuthenticated
 * Redirects logged-in users away from public-only pages like /login and /register.
 * If the cookie token is valid and has a userId, redirect to the appropriate page.
 * If not authenticated, call next() to render the page as normal.
 */
exports.redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.userId) {
      return res.redirect(decoded.workspaceId ? "/dashboard" : "/create-workspace");
    }
  } catch {
    // Token is invalid/expired — treat as unauthenticated and proceed to the page
  }

  next();
};
