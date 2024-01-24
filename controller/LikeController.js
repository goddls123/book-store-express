const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");
const { ensureAuthorization } = require("../uitl/auth.js");

const addLike = (req, res) => {
  const book_id = req.params.id;

  const authorization = ensureAuthorization(req, res);

  let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
  let values = [authorization.id, book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results[0]);
  });
};

const removeLike = (req, res) => {
  const book_id = req.params.id;

  const authorization = ensureAuthorization(req, res);

  let sql = `DELETE FROM likes WHERE user_id=? AND liked_book_id=?`;
  let values = [authorization.id, book_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addLike, removeLike };
