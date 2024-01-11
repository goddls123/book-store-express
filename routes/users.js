const express = require("express");

const router = express.Router();
const { validationResult, body } = require("express-validator");

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
  (req, res) => {
    const { email, password } = req.body;
    if (password) {
      res.status(201).send("로그인 성공");
    } else {
      res.status(403).json({ message: "올바른 email와 password를 입력하세요" });
    }
  }
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
  (req, res) => {
    const { email, password } = req.body;

    if (email) {
      res.status(201).send("가입 성공");
    } else {
      res.status(400).json({ message: "중복된 아이디가 존재 합니다." });
    }
  }
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
    (req, res) => {
      const { email } = req.body;
      if (email) {
        res.status(201).json(true);
      } else {
        res.status(400).json({ message: "없는 아이디 입니다." });
      }
    }
  )
  .put(
    [
      body("password")
        .notEmpty()
        .isString()
        .withMessage("올바른 email와 password를 입력하세요"),
      validate,
    ],
    (req, res) => {
      const { email, password } = req.body;

      if (password) {
        res.status(201).json(true);
      }
    }
  );
module.exports = router;
