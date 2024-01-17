const express = require("express");
const router = express.Router();
const { allCategory } = require("../controller/CategoryController");
const { validationResult, body } = require("express-validator");

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty) {
    return res.status(400).json(err.array());
  }
  next();
};

//카테고리 전체 조회
router.get("/", [validate], allCategory);

module.exports = router;
