import { Router } from "express";
import * as adController from "../controllers/adController.js";

const router = Router();

router.get("/", adController.getAllAds);
router.get("/:id", adController.getAdById);
router.post("/", adController.createAd);
router.put("/:id", adController.updateAd);
router.delete("/:id", adController.deleteAd);

export default router;
