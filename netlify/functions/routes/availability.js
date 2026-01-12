import express from "express";
import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  bookAvailability,
  getAvailabilityForMyAd,
  getAvailabilityForAdPublic,
} from "../controllers/availabilityController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * Tutor-only:
 * - view slots for one of your ads
 * - create/edit/delete slots
 */
router.get("/ad/:adId", requireAuth, getAvailabilityForMyAd);
router.post("/", requireAuth, createAvailability);
router.put("/:id", requireAuth, updateAvailability);
router.delete("/:id", requireAuth, deleteAvailability);

/**
 * Public:
 * - book a slot (demo)
 * - public view slots by ad (optional helper endpoint)
 */
router.post("/:id/book", bookAvailability);
router.get("/ad/:adId/public", getAvailabilityForAdPublic);

export default router;
