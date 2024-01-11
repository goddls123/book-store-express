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

//카테고리 전체 조회
router.get("/", [validate], (req, res) => {
  res.json("조회");
});

module.exports = router;
