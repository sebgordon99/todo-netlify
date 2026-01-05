import Ad from "../models/ad.js";

// Get all ads
export const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.findAll({
      order: [["ad_id", "DESC"]], // newest first
    });
    res.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single ad by ID
export const getAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findByPk(id);

    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    res.json(ad);
  } catch (error) {
    console.error("Error fetching ad:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new ad
export const createAd = async (req, res) => {
  try {
    const {
      tutor_id,
      location_id,
      instrument_id,
      ad_description,
      years_experience,
      hourly_rate,
      img_url,
      destroy_at,
    } = req.body;

    // Required fields validation
    if (!tutor_id || !instrument_id || !ad_description) {
      return res.status(400).json({
        error: "tutor_id, instrument_id, and ad_description are required",
      });
    }

    const ad = await Ad.create({
      tutor_id,
      location_id: location_id || null,
      instrument_id,
      ad_description,
      years_experience: years_experience || 0,
      hourly_rate: hourly_rate || 0,
      img_url: img_url || null,
      destroy_at: destroy_at || null,
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing ad
export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tutor_id,
      location_id,
      instrument_id,
      ad_description,
      years_experience,
      hourly_rate,
      img_url,
      destroy_at,
    } = req.body;

    const ad = await Ad.findByPk(id);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    // Only update fields that are present in the request
    if (tutor_id !== undefined) ad.tutor_id = tutor_id;
    if (location_id !== undefined) ad.location_id = location_id;
    if (instrument_id !== undefined) ad.instrument_id = instrument_id;
    if (ad_description !== undefined) ad.ad_description = ad_description;
    if (years_experience !== undefined) ad.years_experience = years_experience;
    if (hourly_rate !== undefined) ad.hourly_rate = hourly_rate;
    if (img_url !== undefined) ad.img_url = img_url;
    if (destroy_at !== undefined) ad.destroy_at = destroy_at;

    await ad.save();
    res.json(ad);
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an ad
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findByPk(id);

    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    await ad.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ error: error.message });
  }
};