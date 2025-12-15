import Todo from "../models/Todo.js";
import sequelize from "../config/database.js";

// Initialize database connection and sync models
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      await sequelize.authenticate();
      await Todo.sync({ alter: true }); // Use alter in production, or migrate properly
      dbInitialized = true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }
}

// Get all todos
export const getAllTodos = async (req, res) => {
  try {
    await initializeDatabase();
    const todos = await Todo.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// Get a single todo by ID
export const getTodoById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Update a todo
export const updateTodo = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      todo.description = description;
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
