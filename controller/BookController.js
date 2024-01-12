const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");

const allBooks = (req, res) => {
  const sql = "SELECT * FROM books";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  let { id } = req.params;
  const sql = "SELECT * FROM books WHERE id = ?";
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
