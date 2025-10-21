import express, { Router } from "express";

import {
  getAssistance,
  getAssistances,
  postAssistance,
  putAssistance,
} from "../controllers";

const router: Router = express.Router();

router.get("/", getAssistances);
router.get("/:assistanceId", getAssistance);
router.post("/", postAssistance);
router.put("/:assistanceId", putAssistance);

export default router;
