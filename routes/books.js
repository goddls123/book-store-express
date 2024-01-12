const express = require("express");
const conn = require("../mariadb.js");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const {
  bookByCategory,
  bookDetail,
  allBooks,
} = require("../controller/BookController.js");

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty) {
    return res.status(400).json(err.array());
  }
  next();
};

//전체 도서 조회
router.get("/", [validate], allBooks);

//개졀 도서 조회
router.get("/:id", [validate], bookDetail);

//카테고리별 도서 조회
router.get("/", [validate], bookByCategory);

module.exports = router;
