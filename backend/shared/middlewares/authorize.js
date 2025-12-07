const { decodeToken } = require("../jwt-utils");

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"] || "";
      const token = authHeader;

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const userRoles = decoded.roles || [decoded.role].filter(Boolean);
      const hasRole =
        allowedRoles.length === 0 ||
        userRoles.some((r) => allowedRoles.includes(r));

      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access this resource" });
      }

      req.account = decoded; // attach user info
      next();
    } catch (err) {
      console.log("Authorization error:", err.message);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

module.exports = authorize;
