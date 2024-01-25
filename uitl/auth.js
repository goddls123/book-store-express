const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
dotenv.config();

const ensureAuthorization = (req) => {
  try {
    const receivedJwt = req.headers["authorization"];
    if (!receivedJwt) {
      throw new jwt.JsonWebTokenError("로그인 하세요");
    }
    const decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return {
      ok: true,
      ...decoded,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      err.message = "로그인 세션이 만료되었습니다. 다시 로그인하세요";
    } else if (err instanceof jwt.JsonWebTokenError) {
      err.message = "잘못된 토큰입니다.";
    }
    return {
      ok: false,
      message: err.message,
    };
  }
};

module.exports = { ensureAuthorization };
