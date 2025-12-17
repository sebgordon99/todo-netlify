import Instrument from "../models/instrument.js";
import initializeDatabase from "../models/index.js";

// Get all instruments
export const getAllInstruments = async (req, res) => {
  try {
    await initializeDatabase();
    const instruments = await Instrument.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(instruments);
  } catch (error) {
    console.error("Error fetching instruments:", error);
    res.status(500).json({ error: "Failed to fetch instruments" });
  }
};

// Get a single instrument by ID
export const getInstrumentById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const instrument = await Instrument.findByPk(id);

    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    res.json(instrument);
  } catch (error) {
    console.error("Error fetching instrument:", error);
    res.status(500).json({ error: "Failed to fetch instrument" });
  }
};

// Create a new instrument
export const createInstrument = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const instrument = await Instrument.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(instrument);
  } catch (error) {
    console.error("Error creating instrument:", error);
    res.status(500).json({ error: "Failed to create instrument" });
  }
};

// Update a instrument
export const updateInstrument = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const instrument = await Instrument.findByPk(id);

    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      instrument.title = title.trim();
    }

    if (description !== undefined) {
      instrument.description = description;
    }

    if (completed !== undefined) {
      instrument.completed = completed;
    }

    await instrument.save();
    res.json(instrument);
  } catch (error) {
    console.error("Error updating instrument:", error);
    res.status(500).json({ error: "Failed to update instrument" });
  }
};

// Delete a instrument
export const deleteInstrument = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const instrument = await Instrument.findByPk(id);

    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    await instrument.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting instrument:", error);
    res.status(500).json({ error: "Failed to delete instrument" });
  }
};
