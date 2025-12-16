import Availability from "../models/availability.js";
import initializeDatabase from "../models/index.js";

// Get all availabilitys
export const getAllAvailabilitys = async (req, res) => {
  try {
    await initializeDatabase();
    const availabilitys = await Availability.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(availabilitys);
  } catch (error) {
    console.error("Error fetching availabilitys:", error);
    res.status(500).json({ error: "Failed to fetch availabilitys" });
  }
};

// Get a single availability by ID
export const getAvailabilityById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const availability = await Availability.findByPk(id);

    if (!availability) {
      return res.status(404).json({ error: "Availability not found" });
    }

    res.json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
};

// Create a new availability
export const createAvailability = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const availability = await Availability.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(availability);
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({ error: "Failed to create availability" });
  }
};

// Update a availability
export const updateAvailability = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const availability = await Availability.findByPk(id);

    if (!availability) {
      return res.status(404).json({ error: "Availability not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      availability.title = title.trim();
    }

    if (description !== undefined) {
      availability.description = description;
    }

    if (completed !== undefined) {
      availability.completed = completed;
    }

    await availability.save();
    res.json(availability);
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ error: "Failed to update availability" });
  }
};

// Delete a availability
export const deleteAvailability = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const availability = await Availability.findByPk(id);

    if (!availability) {
      return res.status(404).json({ error: "Availability not found" });
    }

    await availability.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ error: "Failed to delete availability" });
  }
};
