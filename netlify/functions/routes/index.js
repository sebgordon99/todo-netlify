import { Router } from "express";
import todos from "./todos.js";
import ads from "./ads.js";
import availabilitys from "./availabilitys.js";
import locations from "./locations.js"

const router = Router();

router.use("/todos", todos);
router.use("/ads", ads);
router.use("/availabilitys", availabilitys);
router.use("/locations", locations);

export default router;
