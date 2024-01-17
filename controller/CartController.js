const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");

const getCartItems = (req, res) => {
  const { user_id, selected } = req.body;

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
            FROM cartItems LEFT JOIN books 
            ON cartItems.book_id = books.id
            WHERE cartItems.user_id = ?`;

  if (selected && selected.length) {
    sql += ` AND cartItems.id IN (?)`;
  }

  let values = [user_id, selected];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const addToCart = (req, res) => {
  const { user_id, quantity, book_id } = req.body;
  let sql = `INSERT INTO cartItems (user_id, quantity, book_id) VALUES (?, ? ,?)`;
  let values = [user_id, quantity, book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const removeToCart = (req, res) => {
  const { id } = req.params;
  let sql = `DELETE FROM cartItems WHERE id = ?`;
  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { getCartItems, addToCart, removeToCart };
