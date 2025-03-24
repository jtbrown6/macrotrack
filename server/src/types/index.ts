export interface Food {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  unit: string;
  servingSize: number;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  quantity: number;
  date: string;
}

export interface DailyLog {
  id: string;
  date: string;
  entries: FoodEntry[];
}

export interface Settings {
  dailyCalorieGoal: number;
  carbPercentage: number;
  fatPercentage: number;
  proteinPercentage: number;
}
