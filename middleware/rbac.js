const AppError = require("../utils/AppError");

const rbac = (allowedRoles) => {
    return (req, res, next) => {
        console.log("RBAC Check - user:", req.user); // ✅ NOW IT'S CORRECT
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            console.warn(`RBAC DENIED - User Role: ${req.user?.role}, Required: ${allowedRoles}`);
            return next(new AppError("Access denied. Insufficient permissions.", 403));
        }
        next();
    };
};

module.exports = rbac;
