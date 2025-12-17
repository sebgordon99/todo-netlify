import User from "../models/user.js";
import initializeDatabase from "../models/index.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    await initializeDatabase();
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const user = await User.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      user.title = title.trim();
    }

    if (description !== undefined) {
      user.description = description;
    }

    if (completed !== undefined) {
      user.completed = completed;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
