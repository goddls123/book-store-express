const express = require("express");
const conn = require("../mariadb.js");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const {
  join,
  login,
  passwordReset,
  passwordResetRequest,
} = require("../controller/UserController.js");

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty) {
    return res.status(400).json(err.array());
  }
  next();
};
//로그인
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("올바른 email와 password를 입력하세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("올바른 email와 password를 입력하세요"),
    validate,
  ],
  login
);

//회원가입
router.post(
  "/join",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("올바른 email와 password를 입력하세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("올바른 email와 password를 입력하세요"),
    validate,
  ],
  join
);

//비밀번호 변경 요청
router
  .route("/reset")
  .post(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("올바른 email와 password를 입력하세요"),
      validate,
    ],
    passwordResetRequest
  )
  .put(
    [
      body("password")
        .notEmpty()
        .isString()
        .withMessage("올바른 email와 password를 입력하세요"),
      validate,
    ],
    passwordReset
  );
module.exports = router;
