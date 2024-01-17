const express = require("express");
const {
  getCartItems,
  addToCart,
  removeToCart,
} = require("../controller/CartController.js");
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
router.get("/", [validate], getCartItems);

//장바구니 담기
router.post("/", [validate], addToCart);

//장바구니 삭제
router.post("/:id", [validate], removeToCart);

module.exports = router;
