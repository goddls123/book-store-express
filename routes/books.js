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

//전체 도서 조회
router.get("/", [validate], (req, res) => {
  res.json("전체 도서 조회");
});

//개졀 도서 조회
router.get("/:id", [validate], (req, res) => {
  res.json("개별 도서 조회");
});

//전체 도서 조회
router.get("/", [validate], (req, res) => {
  res.json("전체 도서 조회");
});

module.exports = router;
