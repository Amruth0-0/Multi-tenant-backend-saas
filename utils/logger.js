const CREATE_ERROR = new Error("Logger created outside request context. Use req.log in routes.");

const levelLabels = {
  60: "fatal",
  50: "error",
  40: "warn",
  30: "info",
  20: "debug",
  10: "trace",
};

function serializeError(err) {
  if (!(err instanceof Error)) return err;
  return { message: err.message, status: err.status, stack: process.env.NODE_ENV === "development" ? err.stack : undefined };
}

class Logger {
  constructor(ctx = {}) {
    this.ctx = ctx;
  }

  child(extra) {
    return new Logger({ ...this.ctx, ...extra });
  }

  _log(level, msg, meta = {}) {
    const entry = {
      level: levelLabels[level] || "info",
      timestamp: new Date().toISOString(),
      message: msg,
      ...this.ctx,
      ...meta,
    };
    if (meta.error) entry.error = serializeError(meta.error);
    if (meta.err) entry.error = serializeError(meta.err);
    if (level >= 50) {
      console.error(JSON.stringify(entry));
    } else if (level >= 40) {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  info(msg, meta) { this._log(30, msg, meta); }
  warn(msg, meta) { this._log(40, msg, meta); }
  error(msg, meta) { this._log(50, msg, meta); }
  debug(msg, meta) { this._log(20, msg, meta); }
  fatal(msg, meta) { this._log(60, msg, meta); }
}

function requestLogger(req, res, next) {
  const start = Date.now();
  req.log = new Logger({
    reqId: req.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection?.remoteAddress,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    req.log[level](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      statusCode: res.statusCode,
      durationMs: duration,
      userId: req.user?.userId,
      tenantId: req.user?.tenantId,
    });
  });

  next();
}

function loggerMiddleware(req, res, next) {
  if (!req.log) {
    req.log = new Logger({
      reqId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      method: req.method,
      url: req.originalUrl || req.url,
    });
  }
  next();
}

module.exports = { Logger, requestLogger, loggerMiddleware };
