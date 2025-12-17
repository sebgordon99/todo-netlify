import Tutor from "../models/tutor.js";
import initializeDatabase from "../models/index.js";

// Get all tutors
export const getAllTutors = async (req, res) => {
  try {
    await initializeDatabase();
    const tutors = await Tutor.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
};

// Get a single tutor by ID
export const getTutorById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const tutor = await Tutor.findByPk(id);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    res.json(tutor);
  } catch (error) {
    console.error("Error fetching tutor:", error);
    res.status(500).json({ error: "Failed to fetch tutor" });
  }
};

// Create a new tutor
export const createTutor = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const tutor = await Tutor.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(tutor);
  } catch (error) {
    console.error("Error creating tutor:", error);
    res.status(500).json({ error: "Failed to create tutor" });
  }
};

// Update a tutor
export const updateTutor = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const tutor = await Tutor.findByPk(id);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      tutor.title = title.trim();
    }

    if (description !== undefined) {
      tutor.description = description;
    }

    if (completed !== undefined) {
      tutor.completed = completed;
    }

    await tutor.save();
    res.json(tutor);
  } catch (error) {
    console.error("Error updating tutor:", error);
    res.status(500).json({ error: "Failed to update tutor" });
  }
};

// Delete a tutor
export const deleteTutor = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    await tutor.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tutor:", error);
    res.status(500).json({ error: "Failed to delete tutor" });
  }
};
