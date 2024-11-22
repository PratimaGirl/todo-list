const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getUser,
} = require("../controllers/user.controller");

router.post("/", createUser);

router.post("/login", login);

router.get("/", getUser);

module.exports = router;
