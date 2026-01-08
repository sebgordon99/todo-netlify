import Availability from "../models/Availability.js";

// Get all availability
export const getAllAvailability = async (req, res) => {
  try {
    const availabilities = await Availability.findAll({
      order: [["availability_id", "DESC"]],
    });
    res.json(availabilities);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single availability by ID
export const getAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await Availability.findByPk(id);

    if (!availability)
      return res.status(404).json({ error: "Availability not found" });

    res.json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new availability
export const createAvailability = async (req, res) => {
  try {
    const { user_id, ad_id, start_time, end_time, is_booked, user_capacity } =
      req.body;

    if (!user_id || !ad_id || !start_time || !end_time) {
      return res.status(400).json({
        error: "user_id, ad_id, start_time, and end_time are required",
      });
    }

    const availability = await Availability.create({
      user_id,
      ad_id,
      start_time,
      end_time,
      is_booked: is_booked || false,
      user_capacity: user_capacity || 1,
    });

    res.status(201).json(availability);
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an availability
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, ad_id, start_time, end_time, is_booked, user_capacity } =
      req.body;

    const availability = await Availability.findByPk(id);
    if (!availability)
      return res.status(404).json({ error: "Availability not found" });

    if (user_id !== undefined) availability.user_id = user_id;
    if (ad_id !== undefined) availability.ad_id = ad_id;
    if (start_time !== undefined) availability.start_time = start_time;
    if (end_time !== undefined) availability.end_time = end_time;
    if (is_booked !== undefined) availability.is_booked = is_booked;
    if (user_capacity !== undefined) availability.user_capacity = user_capacity;

    await availability.save();
    res.json(availability);
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an availability
export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await Availability.findByPk(id);

    if (!availability)
      return res.status(404).json({ error: "Availability not found" });

    await availability.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ error: error.message });
  }
};

//book an availability
export const bookAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required to book" });
    }

    const slot = await Availability.findByPk(id);
    if (!slot) {
      return res.status(404).json({ error: "Availability not found" });
    }

    // Already booked?
    if (slot.is_booked) {
      return res.status(409).json({ error: "This time is already booked" });
    }

    // Capacity guard (optional)
    if (typeof slot.user_capacity === "number" && slot.user_capacity <= 0) {
      return res.status(409).json({ error: "No capacity left for this slot" });
    }

    slot.is_booked = true;
    slot.user_id = user_id;

    // Optional: decrement capacity when booking
    // If you want 1 slot = 1 booking, keep this:
    if (typeof slot.user_capacity === "number") {
      slot.user_capacity = Math.max(0, slot.user_capacity - 1);
    }

    await slot.save();
    return res.json(slot);
  } catch (error) {
    console.error("Error booking availability:", error);
    return res.status(500).json({ error: error.message });
  }
};