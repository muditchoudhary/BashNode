import express from "express";
import { handleDraft } from "../controllers/draft.js";

const router = express.Router();

router.get("/", handleDraft);