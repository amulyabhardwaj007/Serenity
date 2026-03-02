const notFoundHandler = (req, res) => {
    res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const payload = {
        message: status >= 500 ? 'Internal server error' : err.message,
    };

    if (Array.isArray(err.details) && err.details.length > 0) {
        payload.details = err.details;
    }

    if (process.env.NODE_ENV !== 'production' && status >= 500) {
        payload.debug = err.message;
    }

    res.status(status).json(payload);
};

module.exports = {
    notFoundHandler,
    errorHandler,
};
