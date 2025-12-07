const { decodeToken } = require("../jwt-utils");

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const parts = authHeader.split(" ");
      const token = parts.length === 2 ? parts[1] : authHeader;

      const decoded = decodeToken(token);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (
        Array.isArray(allowedRoles) &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access this resource" });
      }

      req.account = decoded;
      next();
    } catch (err) {
      console.log("Authorization error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

module.exports = authorize;