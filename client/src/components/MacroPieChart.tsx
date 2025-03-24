import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DailyNutrition } from '../types';

interface MacroPieChartProps {
  dailyNutrition: DailyNutrition;
}

const MacroPieChart: React.FC<MacroPieChartProps> = ({ dailyNutrition }) => {
  // Colors for different macros - more muted, professional colors
  const COLORS = {
    carbs: '#3D7A8C', // Blue-teal
    fat: '#CA7649', // Rust
    protein: '#5B7553', // Sage green
  };
  
  // Prepare data for pie chart - consumed values only
  const macroData = [
    {
      name: 'Carbs',
      value: dailyNutrition.totalCarbs,
      color: COLORS.carbs
    },
    {
      name: 'Fat',
      value: dailyNutrition.totalFat,
      color: COLORS.fat
    },
    {
      name: 'Protein',
      value: dailyNutrition.totalProtein,
      color: COLORS.protein
    }
  ];

  // Filter out any macros with zero value to avoid empty segments
  const filteredData = macroData.filter(item => item.value > 0);
  
  return (
    <div className="macro-pie-chart">
      <h3 className="chart-title">Macros Consumed Today</h3>
      
      {filteredData.length === 0 ? (
        <div className="no-data-message">
          <p>No macros consumed today yet.</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={30}
                paddingAngle={3}
                dataKey="value"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `${Math.round(Number(value))}g`} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="macro-summary">
            <div className="macro-item">
              <span className="macro-label" style={{ color: COLORS.carbs }}>Carbs:</span>
              <span className="macro-value">
                <strong>{Math.round(dailyNutrition.totalCarbs)}g</strong> consumed 
                <span className="macro-remaining"> ({Math.round(dailyNutrition.remainingCarbs)}g remaining)</span>
              </span>
            </div>
            <div className="macro-item">
              <span className="macro-label" style={{ color: COLORS.fat }}>Fat:</span>
              <span className="macro-value">
                <strong>{Math.round(dailyNutrition.totalFat)}g</strong> consumed
                <span className="macro-remaining"> ({Math.round(dailyNutrition.remainingFat)}g remaining)</span>
              </span>
            </div>
            <div className="macro-item">
              <span className="macro-label" style={{ color: COLORS.protein }}>Protein:</span>
              <span className="macro-value">
                <strong>{Math.round(dailyNutrition.totalProtein)}g</strong> consumed
                <span className="macro-remaining"> ({Math.round(dailyNutrition.remainingProtein)}g remaining)</span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MacroPieChart;
