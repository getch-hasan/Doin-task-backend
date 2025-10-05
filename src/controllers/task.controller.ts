import { Request, Response } from "express";
import Task from "../models/task.model"; 
import { AuthRequest } from "../middlewares/auth.middleware";

// CREATE Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, category, status, assignedUser, dueDate } = req.body;

    if (!title || !description  || !status || !assignedUser || !dueDate) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const newTask = new Task({
      title,
      description,
      status,
      assignedUser,
      dueDate,
    });

    await newTask.save();

    // Populate category if it's a ref
    const populatedTask = await Task.findById(newTask._id).populate("category");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Error creating task", details: (error as Error).message });
  }
};

// GET all Tasks by status and pagination 


export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = "1", per_page = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const perPageNum = parseInt(per_page as string, 10);

    const filter: any = {};

    // ✅ Only apply restriction if NOT admin
    if (req.user?.role !== "admin") {
      filter.assignedUser = { $in: [req.user?.userId] };
    }

    // ✅ Optional status filter
    if (status) {
      filter.status = new RegExp(`^${status}$`, "i");
    }


    const tasks = await Task.find(filter)
      .populate("assignedUser", "name email role")
      .skip((pageNum - 1) * perPageNum)
      .limit(perPageNum)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      message: "Tasks fetched successfully",
      page: pageNum,
      per_page: perPageNum,
      total,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Tasks fetch failed",
      details: (error as Error).message,
    });
  }
};





// GET Task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("assignedUser");

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Internal Server Error", details: (error as Error).message });
  }
};

// UPDATE Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, status, assignedUser, dueDate } = req.body;

    if (!id) {
      res.status(400).json({ error: "Task ID is required" });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, assignedUser, dueDate },
      { new: true, runValidators: true }
    ).populate("assignedUser");

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task", details: (error as Error).message });
  }
};

// DELETE Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task", details: (error as Error).message });
  }
};

// SEARCH Task (by title or description)
export const searchTask = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query; // use query instead of body

    if (!keyword) {
      res.status(400).json({ message: "Search keyword is required" });
      return;
    }

    const tasks = await Task.find({
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
  } catch (error) {
    console.error("Error searching tasks:", error);
    res.status(500).json({ message: "Internal Server Error", details: (error as Error).message });
  }
};
