import React, { useState, useEffect } from 'react';
import FoodForm from '../components/FoodForm';
import { Food } from '../types';
import { getFoods, createFood, updateFood, deleteFood } from '../utils/apiService';

const FoodDatabasePage: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Fetch foods on component mount
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError('');
        
        const foodsData = await getFoods();
        setFoods(foodsData);
      } catch (err) {
        console.error('Error fetching foods:', err);
        setError('Failed to load foods. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);
  
  // Filter foods based on search term
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle creating a new food
  const handleAddFood = async (foodData: Omit<Food, 'id'>) => {
    try {
      setError('');
      const newFood = await createFood(foodData);
      
      setFoods([...foods, newFood]);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding food:', err);
      setError('Failed to add food. Please try again.');
    }
  };
  
  // Handle updating a food
  const handleUpdateFood = async (foodData: Omit<Food, 'id'>) => {
    if (!editingFood) return;
    
    try {
      setError('');
      const updatedFood = await updateFood(editingFood.id, foodData);
      
      setFoods(foods.map(food => 
        food.id === updatedFood.id ? updatedFood : food
      ));
      
      setEditingFood(null);
    } catch (err) {
      console.error('Error updating food:', err);
      setError('Failed to update food. Please try again.');
    }
  };
  
  // Handle deleting a food
  const handleDeleteFood = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this food?')) {
      return;
    }
    
    try {
      setError('');
      await deleteFood(id);
      
      setFoods(foods.filter(food => food.id !== id));
    } catch (err) {
      console.error('Error deleting food:', err);
      setError('Failed to delete food. Please try again.');
    }
  };
  
  // Cancel form
  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingFood(null);
  };
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="food-database-page">
      <div className="page-header">
        <h1>Food Database</h1>
        
        {!showAddForm && !editingFood && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Food
          </button>
        )}
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {showAddForm && (
        <FoodForm
          onSubmit={handleAddFood}
          onCancel={handleCancelForm}
        />
      )}
      
      {editingFood && (
        <FoodForm
          food={editingFood}
          onSubmit={handleUpdateFood}
          onCancel={handleCancelForm}
        />
      )}
      
      <div className="food-search card">
        <h2 className="card-title">Search Foods</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="foods-list card">
        <h2 className="card-title">Foods List</h2>
        
        {filteredFoods.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? 'No foods match your search.' : 'No foods in the database yet. Add some!'}
          </div>
        ) : (
          <table className="nutrition-summary-table foods-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Calories</th>
                <th>Carbs (g)</th>
                <th>Fat (g)</th>
                <th>Protein (g)</th>
                <th>Serving Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map(food => (
                <tr key={food.id}>
                  <td data-label="Name">{food.name}</td>
                  <td data-label="Calories">{food.calories}</td>
                  <td data-label="Carbs">{food.carbs}g</td>
                  <td data-label="Fat">{food.fat}g</td>
                  <td data-label="Protein">{food.protein}g</td>
                  <td data-label="Serving Size">{food.servingSize} {food.unit}</td>
                  <td data-label="Actions" className="actions-cell">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingFood(food)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FoodDatabasePage;
