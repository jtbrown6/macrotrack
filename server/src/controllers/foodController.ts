import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Food } from '../types';
import { getFoods, saveFoods } from '../utils/fileUtils';

// Get all foods
export const getAllFoods = (req: Request, res: Response) => {
  try {
    const foods = getFoods();
    res.status(200).json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods' });
  }
};

// Get food by ID
export const getFoodById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foods = getFoods();
    const food = foods.find(food => food.id === id);
    
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    
    res.status(200).json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ message: 'Error fetching food' });
  }
};

// Create new food
export const createFood = (req: Request, res: Response) => {
  try {
    const { name, calories, carbs, fat, protein, unit, servingSize } = req.body;
    
    // Validate required fields
    if (!name || calories === undefined || carbs === undefined || 
        fat === undefined || protein === undefined || !unit || servingSize === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const foods = getFoods();
    const newFood: Food = {
      id: uuidv4(),
      name,
      calories: Number(calories),
      carbs: Number(carbs),
      fat: Number(fat),
      protein: Number(protein),
      unit,
      servingSize: Number(servingSize)
    };
    
    foods.push(newFood);
    saveFoods(foods);
    
    res.status(201).json(newFood);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(500).json({ message: 'Error creating food' });
  }
};

// Update food
export const updateFood = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, calories, carbs, fat, protein, unit, servingSize } = req.body;
    
    let foods = getFoods();
    const foodIndex = foods.findIndex(food => food.id === id);
    
    if (foodIndex === -1) {
      return res.status(404).json({ message: 'Food not found' });
    }
    
    // Update food properties
    foods[foodIndex] = {
      ...foods[foodIndex],
      name: name || foods[foodIndex].name,
      calories: calories !== undefined ? Number(calories) : foods[foodIndex].calories,
      carbs: carbs !== undefined ? Number(carbs) : foods[foodIndex].carbs,
      fat: fat !== undefined ? Number(fat) : foods[foodIndex].fat,
      protein: protein !== undefined ? Number(protein) : foods[foodIndex].protein,
      unit: unit || foods[foodIndex].unit,
      servingSize: servingSize !== undefined ? Number(servingSize) : foods[foodIndex].servingSize
    };
    
    saveFoods(foods);
    
    res.status(200).json(foods[foodIndex]);
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ message: 'Error updating food' });
  }
};

// Delete food
export const deleteFood = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let foods = getFoods();
    
    const initialLength = foods.length;
    foods = foods.filter(food => food.id !== id);
    
    if (foods.length === initialLength) {
      return res.status(404).json({ message: 'Food not found' });
    }
    
    saveFoods(foods);
    
    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ message: 'Error deleting food' });
  }
};
