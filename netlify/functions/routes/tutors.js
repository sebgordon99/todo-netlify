import { Router } from "express";
import * as tutorController from "../controllers/tutorController.js";

const router = Router();

router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getTutorById);
router.post("/", tutorController.createTutor);
router.put("/:id", tutorController.updateTutor);
router.delete("/:id", tutorController.deleteTutor);

export default router;
