import { Router } from "express";
import todos from "./todos.js";
import ads from "./ads.js";
import availabilitys from "./availabilitys.js";
import locations from "./locations.js";
import instruments from "./instruments.js";
import users from "./users.js";
import tutors from "./tutors.js";

const router = Router();

router.use("/todos", todos);
router.use("/ads", ads);
router.use("/availabilitys", availabilitys);
router.use("/locations", locations);
router.use("/instruments", instruments);
router.use("/users", users);
router.use("/tutors", tutors);

export default router;
