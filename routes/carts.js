const express = require("express");
const conn = require("../mariadb.js");
const router = express.Router();
const { validationResult, body } = require("express-validator");

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty) {
    return res.status(400).json(err.array());
  }
  next();
};

//장바구니 조회
router.get("/", [validate], (req, res) => {
  res.json("조회");
});

//장바구니 담기
router.post("/", [validate], (req, res) => {
  res.json("담기");
});

//장바구니 삭제
router.post("/:id", [validate], (req, res) => {
  res.json("삭제");
});

module.exports = router;
