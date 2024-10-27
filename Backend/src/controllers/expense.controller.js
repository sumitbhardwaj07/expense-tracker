import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Expense from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Add new expense
const createExpense = asyncHandler(async (req, res) => {
    const { category, amount, date, description } = req.body;
    
    if (!category || !amount || !date || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const expense = new Expense({
        category,
        amount,
        date,
        description,
        user: req.user._id
    });

    await expense.save();
    return res.status(201).json(new ApiResponse(201, expense, "Expense created successfully"));
});

// Get all expenses for the current user
const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    return res.status(200).json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
});

// Delete an expense
const deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Expense deleted successfully"));
});

// Update an expense
const updateExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { category, amount, date, description } = req.body;
    console.log(id);


    const expense = await Expense.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { category, amount, date, description },
        { new: true, runValidators: true }
    );

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    return res.status(200).json(new ApiResponse(200, expense, "Expense updated successfully"));
});

export { createExpense, getExpenses, deleteExpense, updateExpense };