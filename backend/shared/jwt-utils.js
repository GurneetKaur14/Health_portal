const jwt = require("jsonwebtoken");

function decodeToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
    return decoded;
  } catch (err) {
    console.error("Token decode error:", err.message);
    return null;
  }
}


function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "JWT_SECRET", {
    expiresIn: "7d",
  });
}

module.exports = {
  decodeToken,
  generateToken,
};
