"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategory = exports.createCategory = void 0;
const category_modal_1 = require("./../models/category.modal");
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }
        // Check if category already exists
        const existingCategory = await category_modal_1.Category.findOne({ name: name.trim() });
        if (existingCategory) {
            res.status(409).json({ message: 'Category already exists' });
            return;
        }
        const newCategory = new category_modal_1.Category({ name: name.trim() });
        await newCategory.save();
        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory,
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.createCategory = createCategory;
const getAllCategory = async (req, res) => {
    try {
        const category = await category_modal_1.Category.find();
        res.status(200).json({ "message": "Category Fethc successfully ", category });
        return;
    }
    catch (error) {
        res.status(400).json({ "message": "faild to fethc category" });
    }
};
exports.getAllCategory = getAllCategory;
