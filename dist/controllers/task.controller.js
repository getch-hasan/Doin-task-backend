"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTask = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
// CREATE Task
const createTask = async (req, res) => {
    try {
        const { title, description, category, status, assignedUser, dueDate } = req.body;
        if (!title || !description || !status || !assignedUser || !dueDate) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const newTask = new task_model_1.default({
            title,
            description,
            status,
            assignedUser,
            dueDate,
        });
        await newTask.save();
        // Populate category if it's a ref
        const populatedTask = await task_model_1.default.findById(newTask._id).populate("category");
        res.status(201).json({
            message: "Task created successfully",
            task: populatedTask,
        });
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Error creating task", details: error.message });
    }
};
exports.createTask = createTask;
// GET all Tasks by status and pagination 
const getTasks = async (req, res) => {
    try {
        const { status, page = "1", per_page = "10" } = req.query;
        const pageNum = parseInt(page, 10);
        const perPageNum = parseInt(per_page, 10);
        const filter = {};
        // ✅ Only apply restriction if NOT admin
        if (req.user?.role !== "admin") {
            filter.assignedUser = { $in: [req.user?.userId] };
        }
        // ✅ Optional status filter
        if (status) {
            filter.status = new RegExp(`^${status}$`, "i");
        }
        const tasks = await task_model_1.default.find(filter)
            .populate("assignedUser", "name email role")
            .skip((pageNum - 1) * perPageNum)
            .limit(perPageNum)
            .sort({ createdAt: -1 });
        const total = await task_model_1.default.countDocuments(filter);
        res.status(200).json({
            message: "Tasks fetched successfully",
            page: pageNum,
            per_page: perPageNum,
            total,
            tasks,
        });
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            message: "Tasks fetch failed",
            details: error.message,
        });
    }
};
exports.getTasks = getTasks;
// GET Task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_model_1.default.findById(id).populate("assignedUser");
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.status(200).json({ message: "Task fetched successfully", task });
    }
    catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
exports.getTaskById = getTaskById;
// UPDATE Task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, status, assignedUser, dueDate } = req.body;
        if (!id) {
            res.status(400).json({ error: "Task ID is required" });
            return;
        }
        const updatedTask = await task_model_1.default.findByIdAndUpdate(id, { title, description, status, assignedUser, dueDate }, { new: true, runValidators: true }).populate("assignedUser");
        if (!updatedTask) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Error updating task", details: error.message });
    }
};
exports.updateTask = updateTask;
// DELETE Task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_model_1.default.findById(id);
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        await task_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Error deleting task", details: error.message });
    }
};
exports.deleteTask = deleteTask;
// SEARCH Task (by title or description)
const searchTask = async (req, res) => {
    try {
        const { keyword } = req.query; // use query instead of body
        if (!keyword) {
            res.status(400).json({ message: "Search keyword is required" });
            return;
        }
        const tasks = await task_model_1.default.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).populate("category");
        if (tasks.length === 0) {
            res.status(404).json({ message: "No tasks found" });
            return;
        }
        res.status(200).json({ message: "Tasks fetched successfully", tasks });
    }
    catch (error) {
        console.error("Error searching tasks:", error);
        res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
};
exports.searchTask = searchTask;
