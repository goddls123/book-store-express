const express = require("express");
const {
  order,
  getOrders,
  getOrderDetail,
} = require("../controller/OrderController.js");
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
router.get("/", [validate], getOrders);

//결제
router.post("/", [validate], order);

//주문 상세 상품 조회
router.get("/:id", [validate], getOrderDetail);

module.exports = router;
