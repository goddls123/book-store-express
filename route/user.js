const express = require("express");

const router = express.Router();

//로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    if (email) {
      res.status(201).send("로그인 성공");
    } else {
      res.status(404).json({ message: "다른 비밀 번호 입니다" });
    }
  } else {
    res.status(404).json({ message: "올바른 email와 password를 입력하세요" });
  }
});

//회원가입
router.post("/join", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    if (email) {
      res.status(201).send("가입 성공");
    } else {
      res.status(404).json({ message: "중복된 아이디가 존재 합니다." });
    }
  } else {
    res.status(404).json({ message: "올바른 email와 password를 입력하세요" });
  }
});

//비밀번호 변경 요청
router
  .route("/reset")
  .post((req, res) => {
    const { email } = req.body;
    if (email) {
      res.status(201).json(true);
    } else {
      res.status(404).json({ message: "없는 아이디 입니다." });
    }
  })
  .put((req, res) => {
    const { email, password } = req.body;
    if (password) {
      res.status(201).json(true);
    } else {
      res.status(404).json({ message: "없는 아이디 입니다." });
    }
  });
module.exports = router;
