import React, { useState, useEffect } from 'react';
import { Food } from '../types';

interface FoodFormProps {
  food?: Food;
  onSubmit: (food: Omit<Food, 'id'>) => void;
  onCancel: () => void;
}

const FoodForm: React.FC<FoodFormProps> = ({ food, onSubmit, onCancel }) => {
  const [name, setName] = useState<string>('');
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [unit, setUnit] = useState<string>('oz');
  const [servingSize, setServingSize] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Auto-calculate calories based on macros
  const calories = (carbs * 4) + (fat * 9) + (protein * 4);

  // If editing an existing food, populate the form
  useEffect(() => {
    if (food) {
      setName(food.name);
      setCarbs(food.carbs);
      setFat(food.fat);
      setProtein(food.protein);
      setUnit(food.unit);
      setServingSize(food.servingSize);
    }
  }, [food]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (calories < 0) {
      newErrors.calories = 'Calories must be a positive number';
    }
    
    if (carbs < 0) {
      newErrors.carbs = 'Carbs must be a positive number';
    }
    
    if (fat < 0) {
      newErrors.fat = 'Fat must be a positive number';
    }
    
    if (protein < 0) {
      newErrors.protein = 'Protein must be a positive number';
    }
    
    if (!unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    
    if (servingSize <= 0) {
      newErrors.servingSize = 'Serving size must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name,
        calories,
        carbs,
        fat,
        protein,
        unit,
        servingSize
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="food-form card">
      <h2 className="card-title">{food ? 'Edit Food' : 'Add New Food'}</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Food Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="servingSize">Serving Size</label>
          <div className="input-group">
            <input
              type="number"
              id="servingSize"
              className="form-control"
              value={servingSize}
              onChange={(e) => setServingSize(parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="form-control"
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="cup">cup</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
              <option value="piece">piece</option>
              <option value="serving">serving</option>
            </select>
          </div>
          {errors.servingSize && <div className="error-message">{errors.servingSize}</div>}
          {errors.unit && <div className="error-message">{errors.unit}</div>}
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="calories">Calories (auto-calculated)</label>
          <input
            type="number"
            id="calories"
            className="form-control"
            value={calories}
            readOnly
            disabled
          />
          <small className="form-text">Based on macros: (carbs×4) + (fat×9) + (protein×4)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="carbs">Carbs (g)</label>
          <input
            type="number"
            id="carbs"
            className="form-control"
            value={carbs}
            onChange={(e) => setCarbs(parseFloat(e.target.value))}
            step="0.1"
            min="0"
          />
          {errors.carbs && <div className="error-message">{errors.carbs}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="fat">Fat (g)</label>
          <input
            type="number"
            id="fat"
            className="form-control"
            value={fat}
            onChange={(e) => setFat(parseFloat(e.target.value))}
            step="0.1"
            min="0"
          />
          {errors.fat && <div className="error-message">{errors.fat}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="protein">Protein (g)</label>
          <input
            type="number"
            id="protein"
            className="form-control"
            value={protein}
            onChange={(e) => setProtein(parseFloat(e.target.value))}
            step="0.1"
            min="0"
          />
          {errors.protein && <div className="error-message">{errors.protein}</div>}
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {food ? 'Update Food' : 'Add Food'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
