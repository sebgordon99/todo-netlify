import express from "express";
import { 
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd
} from "../controllers/adController.js";

const router = express.Router();

// Get all ads
router.get("/", getAllAds);

// Get a single ad by ID
router.get("/:id", getAdById);

// Create a new ad
router.post("/", createAd);

// Update an ad by ID
router.put("/:id", updateAd);

// Delete an ad by ID
router.delete("/:id", deleteAd);

export default router;
