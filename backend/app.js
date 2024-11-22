const cors = require("cors");
const express = require("express");

const config = require("./config");
const User = require("./routes/user.routes");
const task = require("./routes/todo.routes");
const notification = require("./routes/notification.routes");
const app = express();

const options = {
  origin: "*",
  credentials: true,
};

app.use(cors(options));
app.use(express.json());

app.use(config.routePrefix + "/user", User);
app.use(config.routePrefix + "/task", task);
app.use(config.routePrefix + "/notifications", notification);
app.use("*", (req, res) => {
  res.status(200).end("Api is available.");
});

module.exports = app;
