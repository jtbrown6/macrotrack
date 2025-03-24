import React, { useState, useEffect } from 'react';
import { Food, FoodWithNutrition } from '../types';
import { calculateFoodNutrition } from '../utils/nutritionCalculator';

interface DailyFoodEntryProps {
  foods: Food[];
  foodEntries: FoodWithNutrition[];
  onAddEntry: (foodId: string, quantity: number) => void;
  onUpdateEntry: (entryId: string, quantity: number) => void;
  onDeleteEntry: (entryId: string) => void;
}

const DailyFoodEntry: React.FC<DailyFoodEntryProps> = ({
  foods,
  foodEntries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry
}) => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedFoodId) {
      const food = foods.find(f => f.id === selectedFoodId);
      setSelectedFood(food || null);
      
      if (food) {
        setQuantity(food.servingSize);
      }
    } else {
      setSelectedFood(null);
    }
  }, [selectedFoodId, foods]);

  const handleAddEntry = () => {
    if (!selectedFoodId) {
      setError('Please select a food');
      return;
    }
    
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    
    onAddEntry(selectedFoodId, quantity);
    
    // Reset form
    setSelectedFoodId('');
    setQuantity(1);
    setError('');
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      return;
    }
    
    onUpdateEntry(id, newQuantity);
  };

  return (
    <div className="daily-food-entry card">
      <h2 className="card-title">Food Entries</h2>
      
      <div className="add-food-entry">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="food-select">Select Food</label>
            <select
              id="food-select"
              className="form-control"
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
            >
              <option value="">-- Select a food --</option>
              {foods.map(food => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.servingSize} {food.unit})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity ({selectedFood?.unit || 'serving'})</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value)))}
              step="0.1"
              min="0.1"
              disabled={!selectedFood}
            />
          </div>
          
          <div className="form-group">
            <label>&nbsp;</label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddEntry}
              disabled={!selectedFood}
            >
              Add Food
            </button>
          </div>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {selectedFood && (
          <div className="selected-food-preview">
            <h4>Nutrition for {quantity} {selectedFood.unit} of {selectedFood.name}</h4>
            <div className="nutrition-preview">
              <div>Calories: {Math.round((selectedFood.calories * quantity) / selectedFood.servingSize)}</div>
              <div>Carbs: {((selectedFood.carbs * quantity) / selectedFood.servingSize).toFixed(1)}g</div>
              <div>Fat: {((selectedFood.fat * quantity) / selectedFood.servingSize).toFixed(1)}g</div>
              <div>Protein: {((selectedFood.protein * quantity) / selectedFood.servingSize).toFixed(1)}g</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="food-entries-list">
        <h3>Today's Food</h3>
        
        {foodEntries.length === 0 ? (
          <div className="empty-state">No food entries for today. Add some food above!</div>
        ) : (
          <table className="food-entries-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Quantity</th>
                <th>Calories</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Protein</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodEntries.map(entry => (
                <tr key={entry.id}>
                  <td data-label="Food">{entry.name}</td>
                  <td data-label="Quantity">
                <div className="quantity-control">
                  <input
                    type="number"
                    value={entry.quantity}
                    onChange={(e) => {
                      const newQuantity = parseFloat(e.target.value);
                      if (!isNaN(newQuantity) && newQuantity > 0) {
                        handleQuantityChange(entry.id, newQuantity);
                      }
                    }}
                    className="quantity-input"
                    step="0.1"
                    min="0.1"
                  />
                  <span className="unit-label">{entry.unit}</span>
                </div>
              </td>
                  <td data-label="Calories">{Math.round(entry.calculatedCalories)}</td>
                  <td data-label="Carbs">{entry.calculatedCarbs.toFixed(1)}g</td>
                  <td data-label="Fat">{entry.calculatedFat.toFixed(1)}g</td>
                  <td data-label="Protein">{entry.calculatedProtein.toFixed(1)}g</td>
                  <td data-label="Actions" className="actions-cell">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Delete button clicked for:', entry);
                        console.log('Full entry object:', JSON.stringify(entry));
                        // Extract the exact ID from the entry and log it
                        const entryId = String(entry.id);
                        console.log('Extracted entry ID (type):', typeof entryId);
                        console.log('Extracted entry ID (value):', entryId);
                        
                        // Add a confirmation dialog with detailed information
                        if (window.confirm(`Delete ${entry.name} (ID: ${entryId})?`)) {
                          try {
                            console.log('About to call delete with entry ID:', entryId);
                            onDeleteEntry(entryId);
                          } catch (err) {
                            console.error('Error in delete button handler:', err);
                            alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2}>Total</th>
                <th>
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.calculatedCalories, 0))}
                </th>
                <th>
                  {foodEntries.reduce((sum, entry) => sum + entry.calculatedCarbs, 0).toFixed(1)}g
                </th>
                <th>
                  {foodEntries.reduce((sum, entry) => sum + entry.calculatedFat, 0).toFixed(1)}g
                </th>
                <th>
                  {foodEntries.reduce((sum, entry) => sum + entry.calculatedProtein, 0).toFixed(1)}g
                </th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default DailyFoodEntry;
