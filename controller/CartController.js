const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");
const { ensureAuthorization } = require("../uitl/auth.js");

const getCartItems = (req, res) => {
  const { selected } = req.body;

  const authorization = ensureAuthorization(req);

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
            FROM cartItems LEFT JOIN books 
            ON cartItems.book_id = books.id
            WHERE cartItems.user_id = ?`;

  if (selected && selected.length) {
    sql += ` AND cartItems.id IN (?)`;
  }

  let values = [authorization.id, selected];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const addToCart = (req, res) => {
  const { quantity, book_id } = req.body;
  const authorization = ensureAuthorization(req);

  let sql = `INSERT INTO cartItems (user_id, quantity, book_id) VALUES (?, ? ,?)`;
  let values = [authorization.id, quantity, book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const removeToCart = (req, res) => {
  const cartItemId = req.params.id;
  let sql = `DELETE FROM cartItems WHERE id = ?`;

  conn.query(sql, cartItemId, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { getCartItems, addToCart, removeToCart };
