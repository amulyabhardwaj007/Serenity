const createRateLimiter = ({ windowMs, maxRequests, message }) => {
    const requests = new Map();

    return (req, res, next) => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const record = requests.get(key);

        if (!record || now - record.windowStart >= windowMs) {
            requests.set(key, { count: 1, windowStart: now });
            return next();
        }

        if (record.count >= maxRequests) {
            return res.status(429).json({ message });
        }

        record.count += 1;
        requests.set(key, record);
        return next();
    };
};

const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-XSS-Protection', '0');
    next();
};

const apiRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 300,
    message: 'Too many requests. Try again later.',
});

const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
    message: 'Too many authentication attempts. Try again later.',
});

module.exports = {
    securityHeaders,
    apiRateLimiter,
    authRateLimiter,
};
