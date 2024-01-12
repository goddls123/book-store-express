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

//주문목록 조회
router.get("/", [validate], (req, res) => {
  res.json("조회");
});

//결제
router.post("/", [validate], (req, res) => {
  res.json("결제");
});

//주문 상세 상품 조회
router.get("/:id", [validate], (req, res) => {
  res.json("상세조회");
});

module.exports = router;
