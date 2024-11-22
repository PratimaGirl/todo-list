const mongoose = require("mongoose");
const { Schema } = mongoose;

const ToDoSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    default: "Pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
});

module.exports = mongoose.model("Todo", ToDoSchema);
