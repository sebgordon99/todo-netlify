import { Router } from "express";
import * as instrumentController from "../controllers/instrumentController.js";

const router = Router();

router.get("/", instrumentController.getAllInstruments);
router.get("/:id", instrumentController.getInstrumentById);
router.post("/", instrumentController.createInstrument);
router.put("/:id", instrumentController.updateInstrument);
router.delete("/:id", instrumentController.deleteInstrument);

export default router;
