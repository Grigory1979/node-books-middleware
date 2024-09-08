const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const loggerMiddleware = require("./middleware/logger");
const errorMiddleware = require("./middleware/error");

const booksRouter = require("./routes/methods");
const indexRouter = require("./routes/indexRouter");
const urlBooksRouter = require("./routes/urlRouter/methods");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine", "ejs");

//app.use(loggerMiddleware);

app.use("/public", express.static(__dirname + "/public"));

app.use("/", indexRouter);
app.use("/library", urlBooksRouter);
app.use("/api/library", booksRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`start server PORT ${PORT}`);
});