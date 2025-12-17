import Location from "../models/location.js";
import initializeDatabase from "../models/index.js";

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    await initializeDatabase();
    const locations = await Location.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// Get a single location by ID
export const getLocationById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to fetch location" });
  }
};

// Create a new location
export const createLocation = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const location = await Location.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(location);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Failed to create location" });
  }
};

// Update a location
export const updateLocation = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      location.title = title.trim();
    }

    if (description !== undefined) {
      location.description = description;
    }

    if (completed !== undefined) {
      location.completed = completed;
    }

    await location.save();
    res.json(location);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
};

// Delete a location
export const deleteLocation = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    await location.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
};
