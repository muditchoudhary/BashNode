import express from "express";
import DraftController from "../controllers/publish.js";

const { handleDraft } = DraftController();

const router = express.Router();

router.get("/", handleDraft);

export default router;