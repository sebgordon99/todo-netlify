import Ad from "../models/ad.js";
import initializeDatabase from "../models/index.js";

// Get all ads
export const getAllAds = async (req, res) => {
  try {
    await initializeDatabase();
    const ads = await Ad.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: "Failed to fetch ads" });
  }
};

// Get a single ad by ID
export const getAdById = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const ad = await Ad.findByPk(id);

    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    res.json(ad);
  } catch (error) {
    console.error("Error fetching ad:", error);
    res.status(500).json({ error: "Failed to fetch ad" });
  }
};

// Create a new ad
export const createAd = async (req, res) => {
  try {
    await initializeDatabase();
    const { title, description, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const ad = await Ad.create({
      title: title.trim(),
      description: description || null,
      completed: completed || false,
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({ error: "Failed to create ad" });
  }
};

// Update a ad
export const updateAd = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const ad = await Ad.findByPk(id);

    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      ad.title = title.trim();
    }

    if (description !== undefined) {
      ad.description = description;
    }

    if (completed !== undefined) {
      ad.completed = completed;
    }

    await ad.save();
    res.json(ad);
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ error: "Failed to update ad" });
  }
};

// Delete a ad
export const deleteAd = async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    const ad = await Ad.findByPk(id);

    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    await ad.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ error: "Failed to delete ad" });
  }
};
