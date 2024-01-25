const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");
const { ensureAuthorization } = require("../uitl/auth.js");

const order = async (req, res) => {
  try {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body;

    const authorization = ensureAuthorization(req);

    if (!authorization.ok) {
      throw Error(authorization.message);
    }

    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let delivery_id = "";
    let order_id = "";
    let results = await conn.promise().query(sql, values);
    delivery_id = results[0].insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
    VALUES (?, ?, ?, ?, ?)`;
    values = [
      firstBookTitle,
      totalQuantity,
      totalPrice,
      authorization.id,
      delivery_id,
    ];

    results = await conn.promise().query(sql, values);
    order_id = results[0].insertId;

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

    values = items.map((item) => [order_id, item.book_id, item.quatity]);

    results = await conn.promise().query(sql, [values]);

    results = await deleteCartItems(items.map((i) => i.cartItem_id));

    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const deleteCartItems = async (values) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;

  let result = await conn.promise().query(sql, [values]);
  return result;
};

const getOrders = (req, res) => {
  const authorization = ensureAuthorization(req);

  if (!authorization.ok) {
    throw Error(authorization.message);
  }

  let sql = `SELECT 
                a.id,
                a.book_title,
                a.total_quantity,
                a.total_price,
                a.created_at, 
                b.address,
                b.receiver,
                b.contact
                FROM orders a LEFT JOIN delivery b
                ON a.delivery_id = b.id
                WHERE a.user_id = ?`;

  conn.query(sql, authorization.id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const getOrderDetail = (req, res) => {
  const orderId = req.params.id;

  let sql = `SELECT 
                b.book_id,
                b.book_title,
                b.author,
                b.price,
                a.quatity, 
                FROM orderedBook a LEFT JOIN books b
                ON a.book_id = b.id
                WHERE a.order_id = ?`;

  conn.query(sql, orderId, (err, results) => {
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

module.exports = { order, getOrders, getOrderDetail };
