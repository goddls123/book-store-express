const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
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

const makeToken = (loginUser) => {
  const token = jwt.sign(
    {
      id: loginUser.id,
      email: loginUser.email,
    },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "30m",
      issuer: "test",
    }
  );
  return token;
};

const makeHashPassword = (password) => {
  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");
  return { salt, hashPassword };
};

const hashingPassword = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");
};
module.exports = {
  ensureAuthorization,
  makeToken,
  makeHashPassword,
  hashingPassword,
};
