const badRequest = (message, details = []) => {
    const error = new Error(message);
    error.status = 400;
    error.details = details;
    return error;
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSignup = (req, res, next) => {
    const errors = [];
    const { username, email, password } = req.body;

    if (!isNonEmptyString(username) || username.trim().length < 3 || username.trim().length > 30) {
        errors.push('username must be between 3 and 30 characters');
    }

    if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
        errors.push('email must be a valid email address');
    }

    if (!isNonEmptyString(password) || password.length < 8 || password.length > 72) {
        errors.push('password must be between 8 and 72 characters');
    }

    if (errors.length) {
        return next(badRequest('Validation failed', errors));
    }

    req.body.username = username.trim();
    req.body.email = email.trim().toLowerCase();
    return next();
};

const validateLogin = (req, res, next) => {
    const errors = [];
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
        errors.push('email must be a valid email address');
    }

    if (!isNonEmptyString(password)) {
        errors.push('password is required');
    }

    if (errors.length) {
        return next(badRequest('Validation failed', errors));
    }

    req.body.email = email.trim().toLowerCase();
    return next();
};

const validateJournalCreate = (req, res, next) => {
    const errors = [];
    const { title, content, mood } = req.body;

    if (!isNonEmptyString(title) || title.trim().length > 120) {
        errors.push('title is required and must be at most 120 characters');
    }

    if (!isNonEmptyString(content) || content.trim().length > 5000) {
        errors.push('content is required and must be at most 5000 characters');
    }

    if (mood !== undefined && mood !== null && (!isNonEmptyString(mood) || mood.trim().length > 30)) {
        errors.push('mood must be a non-empty string up to 30 characters');
    }

    if (errors.length) {
        return next(badRequest('Validation failed', errors));
    }

    req.body.title = title.trim();
    req.body.content = content.trim();
    if (typeof mood === 'string') req.body.mood = mood.trim();
    return next();
};

const validateRoomCodeParam = (req, res, next) => {
    const roomCode = String(req.params.roomCode || '').trim().toUpperCase();

    if (!/^[A-Z0-9]{6}$/.test(roomCode)) {
        return next(badRequest('Validation failed', ['roomCode must be 6 alphanumeric characters']));
    }

    req.params.roomCode = roomCode;
    return next();
};

const validateGameMove = (req, res, next) => {
    const { index } = req.body;

    if (!Number.isInteger(index) || index < 0 || index > 8) {
        return next(badRequest('Validation failed', ['index must be an integer from 0 to 8']));
    }

    return next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateJournalCreate,
    validateRoomCodeParam,
    validateGameMove,
};
