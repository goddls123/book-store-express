const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");

const getCartItems = (req, res) => {
  const { category_id, news, limit, currentPage } = req.query;

  let sql = `SELECT * FROM books`;
  let values = [];
  if (category_id && news) {
    sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH ) AND NOW()`;
    values = [category_id];
  } else if (category_id) {
    sql += ` WHERE category_id=?`;
    values = [category_id];
  } else if (news) {
    sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH ) AND NOW()`;
  }

  sql += ` LIMIT ? OFFSET ?`;
  let offset = (currentPage - 1) * limit;
  values = [...values, parseInt(limit), offset];
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
  const { user_id } = req.body;
  let sql = `DELETE FROM cartItems WHERE id=? AND liked_book_id=?`;
  let values = [user_id, id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { getCartItems, addToCart, removeToCart };
