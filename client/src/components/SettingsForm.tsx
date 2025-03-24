import React, { useState, useEffect } from 'react';
import { Settings } from '../types';

interface SettingsFormProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onReset: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onSave,
  onReset
}) => {
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number>(2400);
  const [carbPercentage, setCarbPercentage] = useState<number>(40);
  const [fatPercentage, setFatPercentage] = useState<number>(15);
  const [proteinPercentage, setProteinPercentage] = useState<number>(45);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (settings) {
      setDailyCalorieGoal(settings.dailyCalorieGoal);
      setCarbPercentage(settings.carbPercentage);
      setFatPercentage(settings.fatPercentage);
      setProteinPercentage(settings.proteinPercentage);
    }
  }, [settings]);

  // Calculate macro targets in grams based on percentages and calorie goal
  const calculateMacroGrams = () => {
    const carbsGrams = (carbPercentage / 100) * dailyCalorieGoal / 4; // 4 calories per gram
    const fatGrams = (fatPercentage / 100) * dailyCalorieGoal / 9; // 9 calories per gram
    const proteinGrams = (proteinPercentage / 100) * dailyCalorieGoal / 4; // 4 calories per gram
    
    return {
      carbsGrams: Math.round(carbsGrams),
      fatGrams: Math.round(fatGrams),
      proteinGrams: Math.round(proteinGrams)
    };
  };
  
  const { carbsGrams, fatGrams, proteinGrams } = calculateMacroGrams();
  
  const validateForm = (): boolean => {
    // Clear previous messages
    setError('');
    setSuccessMessage('');
    
    // Check if daily calorie goal is valid
    if (dailyCalorieGoal <= 0) {
      setError('Daily calorie goal must be greater than 0');
      return false;
    }
    
    // Check if macro percentages add up to 100%
    const totalPercentage = carbPercentage + fatPercentage + proteinPercentage;
    
    if (totalPercentage !== 100) {
      setError(`Macro percentages must add up to 100%. Current total: ${totalPercentage}%`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        dailyCalorieGoal,
        carbPercentage,
        fatPercentage,
        proteinPercentage
      });
      
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleReset = () => {
    onReset();
    setSuccessMessage('Settings reset to defaults!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="settings-form card">
      <h2 className="card-title">Nutrition Settings</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dailyCalorieGoal">Daily Calorie Goal</label>
          <input
            type="number"
            id="dailyCalorieGoal"
            className="form-control"
            value={dailyCalorieGoal}
            onChange={(e) => setDailyCalorieGoal(parseInt(e.target.value))}
            min="1"
            step="50"
          />
          <small className="form-text">Your target daily calorie intake</small>
        </div>
        
        <h3 className="settings-section-title">Macro Nutrient Distribution</h3>
        
        <div className="macro-breakdown">
          <div className="macro-totals-card">
            <h4>Macro Targets Based on Current Settings</h4>
            <div className="macro-targets">
              <div className="macro-target-item">
                <span className="macro-name">Carbs:</span>
                <span className="macro-value">{carbsGrams}g</span>
                <span className="macro-percent">({carbPercentage}%)</span>
              </div>
              <div className="macro-target-item">
                <span className="macro-name">Fat:</span>
                <span className="macro-value">{fatGrams}g</span>
                <span className="macro-percent">({fatPercentage}%)</span>
              </div>
              <div className="macro-target-item">
                <span className="macro-name">Protein:</span>
                <span className="macro-value">{proteinGrams}g</span>
                <span className="macro-percent">({proteinPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="macro-distribution">
          <div className="macro-percentage-display">
            <div className="macro-total">
              Current Total: {carbPercentage + fatPercentage + proteinPercentage}%
              <div className={`total-indicator ${carbPercentage + fatPercentage + proteinPercentage === 100 ? 'valid' : 'invalid'}`}>
                {carbPercentage + fatPercentage + proteinPercentage === 100 ? '✓' : '✗'}
              </div>
            </div>
            <div className="macro-bar">
              <div className="carbs-bar" style={{ width: `${carbPercentage}%` }}>{carbPercentage}%</div>
              <div className="fat-bar" style={{ width: `${fatPercentage}%` }}>{fatPercentage}%</div>
              <div className="protein-bar" style={{ width: `${proteinPercentage}%` }}>{proteinPercentage}%</div>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="carbPercentage">Carbs (%)</label>
              <input
                type="number"
                id="carbPercentage"
                className="form-control"
                value={carbPercentage}
                onChange={(e) => setCarbPercentage(parseInt(e.target.value))}
                min="0"
                max="100"
              />
              <small className="form-text">4 calories per gram = {carbsGrams}g</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="fatPercentage">Fat (%)</label>
              <input
                type="number"
                id="fatPercentage"
                className="form-control"
                value={fatPercentage}
                onChange={(e) => setFatPercentage(parseInt(e.target.value))}
                min="0"
                max="100"
              />
              <small className="form-text">9 calories per gram = {fatGrams}g</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="proteinPercentage">Protein (%)</label>
              <input
                type="number"
                id="proteinPercentage"
                className="form-control"
                value={proteinPercentage}
                onChange={(e) => setProteinPercentage(parseInt(e.target.value))}
                min="0"
                max="100"
              />
              <small className="form-text">4 calories per gram = {proteinGrams}g</small>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleReset}
          >
            Reset to Defaults
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
