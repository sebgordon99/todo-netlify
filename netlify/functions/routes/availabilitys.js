import { Router } from "express";
import * as availabilityController from "../controllers/availabilityController.js";

const router = Router();

router.get("/", availabilityController.getAllAvailabilitys);
router.get("/:id", availabilityController.getAvailabilityById);
router.post("/", availabilityController.createAvailability);
router.put("/:id", availabilityController.updateAvailability);
router.delete("/:id", availabilityController.deleteAvailability);

export default router;
