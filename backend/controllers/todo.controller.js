const Notification = require("../db/models/Notification");
const ToDo = require("../db/models/ToDo");
const User = require("../db/models/User");
const { transporter } = require("../service/emailService");

const getTodos = async (req, res) => {
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  var options = {
    page,
    limit,
  };
  console.log(page, limit);

  try {
    var todos = await ToDo.paginate(query, options);
    return res.status(200).json({
      status: 200,
      data: todos,
      message: "Succesfully Todos Received",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

const getAllTodos = async (req, res) => {
  try {
    const todoTasks = await ToDo.find();
    res.json({ todoTasks });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const createTodo = async (req, res) => {
  const { userId, title, description, status, priority } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    var newTodo = new ToDo({
      userId,
      title: title,
      description: description,
      date: new Date(),
      status: status,
      priority: priority,
    });

    await newTodo.save();

    const message = `Your new task has been created`;
    const notification = new Notification({
      userId,
      message,
      type: "success",
    });

    await notification.save();
    await sendOrderEmail(user.email, newTodo);

    return res.status(201).json({
      status: 201,
      message: "Successfully Created ToDo",
      toDo: newTodo,
    });
  } catch (e) {
    console.log(e);

    return res
      .status(400)
      .json({ status: 400, message: "Todo Creation was Unsuccessful" });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  console.log(req.body);

  try {
    const updatedTodo = await ToDo.findByIdAndUpdate(
      id,
      { title, description, status, priority },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({
      message: "Succesfully Updated Todo",
      todo: updatedTodo,
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedToDo = await ToDo.findByIdAndDelete(id);

    if (!deletedToDo) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task deleted successfully",
      foodItem: deletedToDo,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const getToDoTask = async (req, res) => {
  const { id } = req.params;

  try {
    const todoTask = await ToDo.findById(id);

    if (!todoTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ todoTask });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const getUserTask = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await ToDo.find({ userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendOrderEmail = (userEmail, taskDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Task Created Confirmation",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #4CAF50;
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 10px;
            }
            .task-summary {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .task-summary p {
              font-size: 14px;
              color: #555;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #777;
              margin-top: 30px;
            }
            .footer a {
              color: #4CAF50;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>Task Created Confirmation</h1>
            <p>Dear User,</p>
            <p>Thank you for creating a new task! Here are the details:</p>
            
            <div class="task-summary">
              <p><strong>Task Title:</strong> ${taskDetails.title}</p>
              <p><strong>Description:</strong> ${
                taskDetails.description || "No description provided"
              }</p>
              <p><strong>Status:</strong> ${taskDetails.status}</p>
              <p><strong>Priority:</strong> ${
                taskDetails.priority || "No priority set"
              }</p>
              <p><strong>Created At:</strong> ${new Date(
                taskDetails.date
              ).toLocaleString()}</p>
            </div>

            <p>If you have any questions or need further assistance, feel free to contact us.</p>
            
            <div class="footer">
              <p>Best regards,<br>Your Task Management Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  getTodos,
  deleteTodo,
  updateTodo,
  createTodo,
  getToDoTask,
  getAllTodos,
  getUserTask,
  sendOrderEmail,
};
