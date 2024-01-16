const express = require("express");
const conn = require("../mariadb.js");
const router = express.Router();
const { addLike, removeLike } = require("../controller/LikeController.js");
const { validationResult, body } = require("express-validator");

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty) {
    return res.status(400).json(err.array());
  }
  next();
};

//좋아요 추가
router.post("/:id", [validate], addLike);

//좋아요 취소
router.delete("/:id", [validate], removeLike);

module.exports = router;
