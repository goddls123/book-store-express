const express = require("express");
const dotenv = require("dotenv");

const app = express();
const userRouter = require("./route/user.js");

dotenv.config();

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("book store");
});
app.use("/user", userRouter);

app.listen(process.env.PORT);
