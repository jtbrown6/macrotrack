import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MacroPieChart from '../components/MacroPieChart';
import { Food, DailyLog, Settings, FoodWithNutrition, DailyNutrition } from '../types';
import { getFoods, getDailyLogByDate, getSettings } from '../utils/apiService';
import { calculateFoodNutrition, calculateDailyNutrition } from '../utils/nutritionCalculator';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [foods, setFoods] = useState<Food[]>([]);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodWithNutrition[]>([]);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [error, setError] = useState<string>('');
  
  // Get the current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch foods, daily log, and settings in parallel
        const [foodsData, logData, settingsData] = await Promise.all([
          getFoods(),
          getDailyLogByDate(today),
          getSettings()
        ]);
        
        setFoods(foodsData);
        setDailyLog(logData);
        setSettings(settingsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [today]);

  // Calculate food entries with nutrition data when foods or daily log changes
  useEffect(() => {
    if (foods.length > 0 && dailyLog && dailyLog.entries) {
      const entries: FoodWithNutrition[] = dailyLog.entries.map(entry => {
        const food = foods.find(f => f.id === entry.foodId);
        
        if (!food) {
          return null;
        }
        
        return calculateFoodNutrition(food, entry.quantity);
      }).filter((entry): entry is FoodWithNutrition => entry !== null);
      
      setFoodEntries(entries);
    } else {
      setFoodEntries([]);
    }
  }, [foods, dailyLog]);

  // Calculate daily nutrition when food entries or settings change
  useEffect(() => {
    if (settings && foodEntries.length > 0) {
      const nutrition = calculateDailyNutrition(foodEntries, settings);
      setDailyNutrition(nutrition);
    } else if (settings) {
      // If there are no food entries, show empty values but the targets
      setDailyNutrition({
        totalCalories: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalProtein: 0,
        remainingCalories: settings.dailyCalorieGoal,
        remainingCarbs: (settings.carbPercentage / 100) * settings.dailyCalorieGoal / 4,
        remainingFat: (settings.fatPercentage / 100) * settings.dailyCalorieGoal / 9,
        remainingProtein: (settings.proteinPercentage / 100) * settings.dailyCalorieGoal / 4
      });
    }
  }, [foodEntries, settings]);

  const navigateToTodaysLog = () => {
    navigate(`/daily/${today}`);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Nutrition Dashboard</h1>
        <p className="date-display">Today: {new Date().toLocaleDateString()}</p>
      </div>
      
      {dailyNutrition && (
        <div className="dashboard-summary">
          <div className="summary-card card">
            <h2 className="card-title">Daily Summary</h2>
            
            <table className="nutrition-summary-table">
              <thead>
                <tr>
                  <th>Nutrient</th>
                  <th>Consumed</th>
                  <th>Target</th>
                  <th>Remaining</th>
                  <th>% Complete</th>
                </tr>
              </thead>
              <tbody>
                <tr className="calories-row">
                  <td><strong>Calories</strong></td>
                  <td>{Math.round(dailyNutrition.totalCalories)}</td>
                  <td>{settings?.dailyCalorieGoal}</td>
                  <td>{Math.round(dailyNutrition.remainingCalories)}</td>
                  <td>
                    <div className="progress-inline">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(100, (dailyNutrition.totalCalories / settings!.dailyCalorieGoal) * 100)}%` 
                        }}
                      ></div>
                      <span className="progress-text">
                        {Math.round((dailyNutrition.totalCalories / settings!.dailyCalorieGoal) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="carbs-row">
                  <td><strong className="carbs">Carbs</strong></td>
                  <td>{Math.round(dailyNutrition.totalCarbs)}g</td>
                  <td>{Math.round(dailyNutrition.totalCarbs + dailyNutrition.remainingCarbs)}g</td>
                  <td>{Math.round(dailyNutrition.remainingCarbs)}g</td>
                  <td>
                    <div className="progress-inline">
                      <div 
                        className="progress-fill carbs-fill" 
                        style={{ 
                          width: `${Math.min(100, (dailyNutrition.totalCarbs / (dailyNutrition.totalCarbs + dailyNutrition.remainingCarbs)) * 100)}%` 
                        }}
                      ></div>
                      <span className="progress-text">
                        {Math.round((dailyNutrition.totalCarbs / (dailyNutrition.totalCarbs + dailyNutrition.remainingCarbs)) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="fat-row">
                  <td><strong className="fat">Fat</strong></td>
                  <td>{Math.round(dailyNutrition.totalFat)}g</td>
                  <td>{Math.round(dailyNutrition.totalFat + dailyNutrition.remainingFat)}g</td>
                  <td>{Math.round(dailyNutrition.remainingFat)}g</td>
                  <td>
                    <div className="progress-inline">
                      <div 
                        className="progress-fill fat-fill" 
                        style={{ 
                          width: `${Math.min(100, (dailyNutrition.totalFat / (dailyNutrition.totalFat + dailyNutrition.remainingFat)) * 100)}%` 
                        }}
                      ></div>
                      <span className="progress-text">
                        {Math.round((dailyNutrition.totalFat / (dailyNutrition.totalFat + dailyNutrition.remainingFat)) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="protein-row">
                  <td><strong className="protein">Protein</strong></td>
                  <td>{Math.round(dailyNutrition.totalProtein)}g</td>
                  <td>{Math.round(dailyNutrition.totalProtein + dailyNutrition.remainingProtein)}g</td>
                  <td>{Math.round(dailyNutrition.remainingProtein)}g</td>
                  <td>
                    <div className="progress-inline">
                      <div 
                        className="progress-fill protein-fill" 
                        style={{ 
                          width: `${Math.min(100, (dailyNutrition.totalProtein / (dailyNutrition.totalProtein + dailyNutrition.remainingProtein)) * 100)}%` 
                        }}
                      ></div>
                      <span className="progress-text">
                        {Math.round((dailyNutrition.totalProtein / (dailyNutrition.totalProtein + dailyNutrition.remainingProtein)) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <button 
              className="btn btn-primary add-food-btn" 
              onClick={navigateToTodaysLog}
            >
              Add Food to Today's Log
            </button>
          </div>
          
          <div className="chart-container card">
            <MacroPieChart dailyNutrition={dailyNutrition} />
          </div>
        </div>
      )}
      
      <div className="recent-entries card">
        <h2 className="card-title">Today's Food Entries</h2>
        
        {foodEntries.length === 0 ? (
          <div className="empty-state">
            <p>No food entries for today.</p>
            <button 
              className="btn btn-primary" 
              onClick={navigateToTodaysLog}
            >
              Add Your First Food
            </button>
          </div>
        ) : (
          <div className="entries-list">
            <table className="nutrition-summary-table food-entries-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Calories</th>
                  <th>Carbs</th>
                  <th>Fat</th>
                  <th>Protein</th>
                </tr>
              </thead>
              <tbody>
                {foodEntries.map(entry => (
                  <tr key={entry.id}>
                    <td data-label="Food">{entry.name}</td>
                    <td data-label="Quantity">{entry.quantity} {entry.unit}</td>
                    <td data-label="Calories">{Math.round(entry.calculatedCalories)}</td>
                    <td data-label="Carbs">{entry.calculatedCarbs.toFixed(1)}g</td>
                    <td data-label="Fat">{entry.calculatedFat.toFixed(1)}g</td>
                    <td data-label="Protein">{entry.calculatedProtein.toFixed(1)}g</td>
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
                </tr>
              </tfoot>
            </table>
            
            <div className="view-all">
              <button 
                className="btn btn-secondary" 
                onClick={navigateToTodaysLog}
              >
                View & Edit All Entries
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
