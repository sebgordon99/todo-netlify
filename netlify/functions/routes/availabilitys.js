import express from "express";
import { 
  getAllAvailability,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability
} from "../controllers/availabilityController.js";

const router = express.Router();

// Get all availability records
router.get("/", getAllAvailability);

// Get a single availability by ID
router.get("/:id", getAvailabilityById);

// Create a new availability
router.post("/", createAvailability);

// Update an availability by ID
router.put("/:id", updateAvailability);

// Delete an availability by ID
router.delete("/:id", deleteAvailability);

export default router;