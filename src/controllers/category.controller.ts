import { Category } from './../models/category.modal';
import { Request, Response } from 'express';



export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
       res.status(400).json({ message: 'Category name is required' });
       return
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
       res.status(409).json({ message: 'Category already exists' });
       return
    }

    const newCategory = new Category({ name: name.trim() });
    await newCategory.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
    return
  }
};
export const getAllCategory=async(req:Request,res:Response)=>{
try {
     const category= await Category.find()
     res.status(200).json({"message":"Category Fethc successfully ",category})
     return

} catch (error) {
    res.status(400).json({"message":"faild to fethc category"})
}
}
