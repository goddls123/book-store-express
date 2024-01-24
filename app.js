const express = require("express");
const dotenv = require("dotenv");

const app = express();
const usersRouter = require("./routes/users.js");
const booksRouter = require("./routes/books.js");
const likesRouter = require("./routes/likes.js");
const cartsRouter = require("./routes/carts.js");
const categoryRouter = require("./routes/category.js");
const ordersRouter = require("./routes/orders.js");

dotenv.config();

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("book store");
});
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/likes", likesRouter);
app.use("/carts", cartsRouter);
app.use("/category", categoryRouter);
app.use("/orders", ordersRouter);

app.listen(process.env.PORT);
