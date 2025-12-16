import { Router } from "express";
import todos from "./todos.js";
import ads from "./ads.js";

const router = Router();

router.use("/todos", todos);
router.use("/ads", ads);

export default router;
