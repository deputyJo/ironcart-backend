const AppError = require("../utils/AppError");

const rbac = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError("Access denied. Insufficient permissions.", 403));
        }
        next();
    };
};

module.exports = rbac;
