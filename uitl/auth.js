const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req) => {
  const receivedJwt = req.headers["authorization"];
  return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
};

module.exports = { ensureAuthorization };
