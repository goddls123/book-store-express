const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
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

const bookDetail = (req, res) => {
  let { id } = req.params;
  let { user_id } = req.body;
  const sql = `SELECT 
              a.id, a.title, a.form, a.category_id, b.name, a.isbn, a.detail, a.pages, a.contents, a.summary, a.author, a.price, a.pub_date,
                (SELECT count(*) FROM likes WHERE liked_book_id = ?) AS likes,
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? )) AS liked
              FROM books a
              LEFT JOIN category b
              ON a.category_id = b.id 
              WHERE a.id = ?`;

  let values = [id, user_id, id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

const bookByCategory = (req, res) => {
  let { category_id } = req.query;
  const sql = "SELECT * FROM books WHERE category_id = ?";

  console.log(category_id);
  conn.query(sql, category_id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = { allBooks, bookDetail, bookByCategory };
