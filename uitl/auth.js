const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers["authorization"];
    return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다.",
    });
  }
};

module.exports = { ensureAuthorization };
