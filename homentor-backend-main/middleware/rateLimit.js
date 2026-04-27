/**
 * Tiny in-memory rate limiter.
 *
 * Single-process only — fine for one-box deployments. Replace with
 * express-rate-limit + a Redis store if/when you scale horizontally.
 *
 * Usage:
 *   router.post("/change-password", rateLimit({ windowMs: 60_000, max: 5 }), handler)
 *
 * Keyed by `req.body.phone` if present, else by IP (`req.ip`).
 */

function rateLimit({ windowMs = 60_000, max = 5, keyBy } = {}) {
  const buckets = new Map(); // key -> { count, resetAt }

  return (req, res, next) => {
    const key = keyBy
      ? keyBy(req)
      : (req.body && req.body.phone) || req.ip || "anon";
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= max) {
      const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please try again shortly.",
      });
    }
    bucket.count += 1;
    next();
  };
}

module.exports = rateLimit;
