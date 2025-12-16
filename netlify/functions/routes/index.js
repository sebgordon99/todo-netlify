import { Router } from "express";
import todos from "./todos.js";
import ads from "./ads.js";
import availabilitys from "./availabilities.js";

const router = Router();

router.use("/todos", todos);
router.use("/ads", ads);
router.use("/availabilitys", availabilitys);

export default router;
