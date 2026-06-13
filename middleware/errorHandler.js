function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.expose !== false ? err.message : "Internal server error";

  if (status >= 500) {
    console.error("Unhandled error:", err.message, "userId:", req.user?.userId, "tenantId:", req.user?.tenantId);
  } else {
    console.warn("Request error:", err.message, "userId:", req.user?.userId, "tenantId:", req.user?.tenantId);
  }

  if (res.headersSent) return;

  res.status(status).json({
    success: false,
    message,
  });
}

function onUncaughtException(err, origin) {
  console.error(JSON.stringify({
    level: "fatal",
    timestamp: new Date().toISOString(),
    message: "Uncaught exception",
    error: { message: err.message, stack: err.stack },
    origin,
  }));
  process.exit(1);
}

function onUnhandledRejection(reason) {
  console.error(JSON.stringify({
    level: "fatal",
    timestamp: new Date().toISOString(),
    message: "Unhandled rejection",
    error: { message: reason?.message || String(reason), stack: reason?.stack },
  }));
}

module.exports = { errorHandler, onUncaughtException, onUnhandledRejection };
