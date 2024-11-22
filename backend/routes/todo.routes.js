const express = require("express");
const router = express.Router();
const {
  createTodo,
  getAllTodos,
  deleteTodo,
  updateTodo,
  getToDoTask,
  getUserTask,
} = require("../controllers/todo.controller");

router.get("/", getAllTodos);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);
router.get("/:id", getToDoTask);
router.get("/user/:userId", getUserTask);

module.exports = router;
