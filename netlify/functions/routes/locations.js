import { Router } from "express";
import * as locationController from "../controllers/locationController.js";

const router = Router();

router.get("/", locationController.getAllLocations);
router.get("/:id", locationController.getLocationById);
router.post("/", locationController.createLocation);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

export default router;
