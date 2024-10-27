import express from "express";
import { createExpense, getExpenses, deleteExpense, updateExpense } from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected


router.use(verifyJWT)

router.post("/create", createExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

export default router;
