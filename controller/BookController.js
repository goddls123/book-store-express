const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
  const { category_id, news } = req.query;

  console.log(news);
  let sql = `SELECT * FROM books`;
  let values = [];
  if (category_id && news) {
    sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH ) AND NOW()`;
    values = [category_id, news];
  } else if (category_id) {
    sql += ` WHERE category_id=?`;
    values = category_id;
  } else if (news) {
    sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH ) AND NOW()`;
    values = news;
  }
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
  const sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;
  conn.query(sql, id, (err, results) => {
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
  res.json("전체 도서 조회");
};

module.exports = { allBooks, bookDetail, bookByCategory };
