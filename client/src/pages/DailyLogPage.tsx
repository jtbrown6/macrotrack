import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DailyFoodEntry from '../components/DailyFoodEntry';
import MacroPieChart from '../components/MacroPieChart';
import { Food, DailyLog, Settings, FoodWithNutrition, DailyNutrition } from '../types';
import { 
  getFoods, 
  getDailyLogByDate, 
  getSettings, 
  addFoodEntry, 
  updateFoodEntry, 
  deleteFoodEntry 
} from '../utils/apiService';
import { calculateFoodNutrition, calculateDailyNutrition } from '../utils/nutritionCalculator';

const DailyLogPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [foods, setFoods] = useState<Food[]>([]);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodWithNutrition[]>([]);
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [error, setError] = useState<string>('');
  
  // If no date is provided, use today's date
  const currentDate = date || new Date().toISOString().split('T')[0];
  
  // Format date for display: YYYY-MM-DD -> Month DD, YYYY
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch foods, daily log for the current date, and settings in parallel
        const [foodsData, logData, settingsData] = await Promise.all([
          getFoods(),
          getDailyLogByDate(currentDate),
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
  }, [currentDate]);
  
  // Calculate food entries with nutrition data when foods or daily log changes
  useEffect(() => {
    if (foods.length > 0 && dailyLog && dailyLog.entries) {
      const entries: FoodWithNutrition[] = dailyLog.entries.map(entry => {
        const food = foods.find(f => f.id === entry.foodId);
        
        if (!food) {
          return null;
        }
        
        // Pass the entry ID to preserve it for deletion
        return calculateFoodNutrition(food, entry.quantity, entry.id);
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
  
  // Navigate to the previous or next day
  const navigateToDate = (offset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + offset);
    const newDate = date.toISOString().split('T')[0];
    navigate(`/daily/${newDate}`);
  };
  
  // Handler for adding a new food entry
  const handleAddFoodEntry = async (foodId: string, quantity: number) => {
    try {
      setError('');
      const newEntry = await addFoodEntry(currentDate, { foodId, quantity });
      
      // Update the daily log with the new entry
      if (dailyLog) {
        setDailyLog({
          ...dailyLog,
          entries: [...dailyLog.entries, newEntry]
        });
      }
    } catch (err) {
      console.error('Error adding food entry:', err);
      setError('Failed to add food entry. Please try again.');
    }
  };
  
  // Handler for updating a food entry
  const handleUpdateFoodEntry = async (entryId: string, quantity: number) => {
    try {
      setError('');
      await updateFoodEntry(currentDate, entryId, quantity);
      
      // Update the quantity in the local state
      if (dailyLog) {
        const updatedEntries = dailyLog.entries.map(entry => 
          entry.id === entryId ? { ...entry, quantity } : entry
        );
        
        setDailyLog({
          ...dailyLog,
          entries: updatedEntries
        });
      }
    } catch (err) {
      console.error('Error updating food entry:', err);
      setError('Failed to update food entry. Please try again.');
    }
  };
  
  // Handler for deleting a food entry
  const handleDeleteFoodEntry = async (entryId: string) => {
    try {
      setError('');
      console.log(`[DAILY LOG PAGE] Starting delete process for entry ID: ${entryId}`);
      console.log(`[DAILY LOG PAGE] Current date: ${currentDate}`);
      
      // Looking for this exact entry in our current data
      console.log('[DAILY LOG PAGE] Current daily log entries:', 
        dailyLog?.entries.map(e => ({ id: e.id, foodId: e.foodId, quantity: e.quantity })));
      
      // Find the entry to be deleted for debugging
      const entryToDelete = dailyLog?.entries.find(entry => entry.id === entryId);
      console.log('[DAILY LOG PAGE] Entry to delete:', entryToDelete);
      
      if (!entryToDelete) {
        console.error(`[DAILY LOG PAGE] Could not find entry with ID ${entryId} to delete`);
        throw new Error(`Entry with ID ${entryId} not found in the current log`);
      }
      
      // Make sure we're working with the correct data types (string IDs)
      const dateStr = String(currentDate);
      const idStr = String(entryId);
      
      // Call the API function with explicit strings
      console.log(`[DAILY LOG PAGE] Calling deleteFoodEntry with date=${dateStr}, entryId=${idStr}`);
      await deleteFoodEntry(dateStr, idStr);
      
      // Remove the entry from the local state
      if (dailyLog) {
        // Create a new filtered array explicitly
        const beforeCount = dailyLog.entries.length;
        console.log(`[DAILY LOG PAGE] Entries before delete: ${beforeCount}`);
        
        // Do the filtering more explicitly to check what's happening
        const updatedEntries = [];
        for (const entry of dailyLog.entries) {
          if (entry.id !== entryId) {
            updatedEntries.push(entry);
          } else {
            console.log(`[DAILY LOG PAGE] Filtering out entry:`, entry);
          }
        }
        
        console.log(`[DAILY LOG PAGE] Entries after delete: ${updatedEntries.length}`);
        
        if (updatedEntries.length === beforeCount) {
          console.warn('[DAILY LOG PAGE] No entries were removed during filtering!');
        }
        
        // Update state with the filtered list
        setDailyLog({
          ...dailyLog,
          entries: updatedEntries
        });
        
        // Force a UI refresh to show the update
        // We'll refresh the page data after deletion success
        setTimeout(() => {
          getDailyLogByDate(currentDate).then(refreshedLog => {
            console.log('[DAILY LOG PAGE] Refreshed daily log after deletion');
            setDailyLog(refreshedLog);
          });
        }, 1000);
      }
      
      // Success message
      console.log('[DAILY LOG PAGE] Delete operation completed successfully');
      
    } catch (err) {
      console.error('[DAILY LOG PAGE] Error deleting food entry:', err);
      setError('Failed to delete food entry. Please try again.');
      
      // Show a browser alert for visibility
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to delete entry: ${errorMessage}`);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="daily-log-page">
      <div className="page-header">
        <h1>Daily Food Log</h1>
        
        <div className="date-navigation">
          <button 
            className="btn btn-secondary" 
            onClick={() => navigateToDate(-1)}
          >
            Previous Day
          </button>
          
          <h2 className="current-date">{formatDateForDisplay(currentDate)}</h2>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => navigateToDate(1)}
          >
            Next Day
          </button>
        </div>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="daily-log-content">
        {dailyNutrition && (
          <div className="summary-section card">
            <h2 className="card-title">Daily Summary</h2>
            
            <div className="summary-content">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Calories</span>
                  <span className="stat-value">
                    {Math.round(dailyNutrition.totalCalories)} / {settings?.dailyCalorieGoal}
                  </span>
                  <div className="stat-progress">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${Math.min(100, (dailyNutrition.totalCalories / settings!.dailyCalorieGoal) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="macro-stats">
                  <div className="macro-stat">
                    <span className="macro-label carbs">Carbs</span>
                    <span className="macro-value">
                      {dailyNutrition.totalCarbs.toFixed(1)}g / {(dailyNutrition.totalCarbs + dailyNutrition.remainingCarbs).toFixed(1)}g
                    </span>
                  </div>
                  
                  <div className="macro-stat">
                    <span className="macro-label fat">Fat</span>
                    <span className="macro-value">
                      {dailyNutrition.totalFat.toFixed(1)}g / {(dailyNutrition.totalFat + dailyNutrition.remainingFat).toFixed(1)}g
                    </span>
                  </div>
                  
                  <div className="macro-stat">
                    <span className="macro-label protein">Protein</span>
                    <span className="macro-value">
                      {dailyNutrition.totalProtein.toFixed(1)}g / {(dailyNutrition.totalProtein + dailyNutrition.remainingProtein).toFixed(1)}g
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="chart-container">
                <MacroPieChart dailyNutrition={dailyNutrition} />
              </div>
            </div>
          </div>
        )}
        
        <DailyFoodEntry 
          foods={foods}
          foodEntries={foodEntries}
          onAddEntry={handleAddFoodEntry}
          onUpdateEntry={handleUpdateFoodEntry}
          onDeleteEntry={handleDeleteFoodEntry}
        />
      </div>
    </div>
  );
};

export default DailyLogPage;
