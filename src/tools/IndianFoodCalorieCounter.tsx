"use client";
import { useState, useMemo } from "react";

interface FoodEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  category: string;
}

const FOODS: FoodEntry[] = [
  // Breads & Staples
  { name: "Roti / Chapati", calories: 71, protein: 2.7, carbs: 12, fat: 1.7, serving: "1 piece", category: "Breads" },
  { name: "Paratha (plain)", calories: 180, protein: 4, carbs: 22, fat: 8, serving: "1 piece", category: "Breads" },
  { name: "Aloo Paratha", calories: 220, protein: 5, carbs: 28, fat: 9, serving: "1 piece", category: "Breads" },
  { name: "Naan", calories: 260, protein: 7, carbs: 45, fat: 5, serving: "1 piece", category: "Breads" },
  { name: "Puri", calories: 150, protein: 3, carbs: 16, fat: 8, serving: "2 pieces", category: "Breads" },
  { name: "Bhatura", calories: 300, protein: 6, carbs: 40, fat: 13, serving: "1 piece", category: "Breads" },
  { name: "Rumali Roti", calories: 90, protein: 3, carbs: 15, fat: 2, serving: "1 piece", category: "Breads" },
  { name: "Missi Roti", calories: 120, protein: 5, carbs: 18, fat: 3, serving: "1 piece", category: "Breads" },

  // Rice
  { name: "Steamed Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: "1 cup (150g)", category: "Rice" },
  { name: "Jeera Rice", calories: 180, protein: 3, carbs: 30, fat: 5, serving: "1 cup", category: "Rice" },
  { name: "Biryani (Chicken)", calories: 290, protein: 15, carbs: 35, fat: 10, serving: "1 cup", category: "Rice" },
  { name: "Biryani (Veg)", calories: 240, protein: 6, carbs: 38, fat: 7, serving: "1 cup", category: "Rice" },
  { name: "Pulao", calories: 210, protein: 4, carbs: 32, fat: 7, serving: "1 cup", category: "Rice" },
  { name: "Lemon Rice", calories: 180, protein: 3, carbs: 30, fat: 5, serving: "1 cup", category: "Rice" },
  { name: "Curd Rice", calories: 150, protein: 5, carbs: 25, fat: 3, serving: "1 cup", category: "Rice" },
  { name: "Khichdi", calories: 200, protein: 8, carbs: 30, fat: 5, serving: "1 cup", category: "Rice" },

  // Dals & Curries
  { name: "Dal Fry", calories: 150, protein: 9, carbs: 20, fat: 4, serving: "1 bowl", category: "Dals" },
  { name: "Dal Tadka", calories: 170, protein: 9, carbs: 22, fat: 5, serving: "1 bowl", category: "Dals" },
  { name: "Dal Makhani", calories: 260, protein: 10, carbs: 25, fat: 14, serving: "1 bowl", category: "Dals" },
  { name: "Rajma", calories: 210, protein: 12, carbs: 30, fat: 4, serving: "1 bowl", category: "Dals" },
  { name: "Chole / Chana Masala", calories: 240, protein: 11, carbs: 32, fat: 8, serving: "1 bowl", category: "Dals" },
  { name: "Sambar", calories: 130, protein: 7, carbs: 18, fat: 3, serving: "1 bowl", category: "Dals" },
  { name: "Rasam", calories: 50, protein: 2, carbs: 8, fat: 1, serving: "1 bowl", category: "Dals" },

  // Paneer & Veg
  { name: "Paneer Butter Masala", calories: 400, protein: 15, carbs: 12, fat: 32, serving: "1 bowl", category: "Veg Curry" },
  { name: "Shahi Paneer", calories: 350, protein: 14, carbs: 10, fat: 28, serving: "1 bowl", category: "Veg Curry" },
  { name: "Palak Paneer", calories: 280, protein: 14, carbs: 10, fat: 20, serving: "1 bowl", category: "Veg Curry" },
  { name: "Matar Paneer", calories: 300, protein: 14, carbs: 15, fat: 20, serving: "1 bowl", category: "Veg Curry" },
  { name: "Aloo Gobi", calories: 160, protein: 4, carbs: 20, fat: 7, serving: "1 bowl", category: "Veg Curry" },
  { name: "Bhindi Masala", calories: 120, protein: 3, carbs: 12, fat: 7, serving: "1 bowl", category: "Veg Curry" },
  { name: "Baingan Bharta", calories: 140, protein: 3, carbs: 14, fat: 8, serving: "1 bowl", category: "Veg Curry" },
  { name: "Mixed Veg Curry", calories: 150, protein: 5, carbs: 18, fat: 6, serving: "1 bowl", category: "Veg Curry" },
  { name: "Kadhai Paneer", calories: 330, protein: 15, carbs: 10, fat: 26, serving: "1 bowl", category: "Veg Curry" },
  { name: "Malai Kofta", calories: 380, protein: 10, carbs: 22, fat: 28, serving: "1 bowl", category: "Veg Curry" },

  // Non-Veg
  { name: "Chicken Curry", calories: 250, protein: 22, carbs: 8, fat: 15, serving: "1 bowl", category: "Non-Veg" },
  { name: "Butter Chicken", calories: 350, protein: 25, carbs: 10, fat: 24, serving: "1 bowl", category: "Non-Veg" },
  { name: "Chicken Tikka", calories: 180, protein: 25, carbs: 4, fat: 7, serving: "6 pieces", category: "Non-Veg" },
  { name: "Tandoori Chicken", calories: 220, protein: 28, carbs: 4, fat: 10, serving: "1 leg piece", category: "Non-Veg" },
  { name: "Mutton Curry", calories: 300, protein: 24, carbs: 6, fat: 20, serving: "1 bowl", category: "Non-Veg" },
  { name: "Mutton Rogan Josh", calories: 320, protein: 25, carbs: 8, fat: 22, serving: "1 bowl", category: "Non-Veg" },
  { name: "Fish Curry", calories: 200, protein: 22, carbs: 6, fat: 10, serving: "1 bowl", category: "Non-Veg" },
  { name: "Egg Curry", calories: 200, protein: 14, carbs: 8, fat: 13, serving: "1 bowl (2 eggs)", category: "Non-Veg" },
  { name: "Chicken Biryani", calories: 290, protein: 15, carbs: 35, fat: 10, serving: "1 plate", category: "Non-Veg" },
  { name: "Keema", calories: 280, protein: 20, carbs: 8, fat: 18, serving: "1 bowl", category: "Non-Veg" },

  // South Indian
  { name: "Dosa (plain)", calories: 120, protein: 3, carbs: 20, fat: 3, serving: "1 piece", category: "South Indian" },
  { name: "Masala Dosa", calories: 250, protein: 6, carbs: 35, fat: 10, serving: "1 piece", category: "South Indian" },
  { name: "Idli", calories: 39, protein: 2, carbs: 7, fat: 0.2, serving: "1 piece", category: "South Indian" },
  { name: "Vada (Medu)", calories: 130, protein: 5, carbs: 12, fat: 7, serving: "1 piece", category: "South Indian" },
  { name: "Uttapam", calories: 200, protein: 5, carbs: 30, fat: 6, serving: "1 piece", category: "South Indian" },
  { name: "Upma", calories: 180, protein: 5, carbs: 28, fat: 5, serving: "1 bowl", category: "South Indian" },
  { name: "Pongal", calories: 200, protein: 6, carbs: 30, fat: 6, serving: "1 bowl", category: "South Indian" },
  { name: "Appam", calories: 120, protein: 2, carbs: 22, fat: 2, serving: "1 piece", category: "South Indian" },

  // Snacks
  { name: "Samosa", calories: 262, protein: 5, carbs: 28, fat: 14, serving: "1 piece", category: "Snacks" },
  { name: "Pakoda / Bhajia", calories: 180, protein: 4, carbs: 18, fat: 10, serving: "5 pieces", category: "Snacks" },
  { name: "Kachori", calories: 200, protein: 4, carbs: 22, fat: 11, serving: "1 piece", category: "Snacks" },
  { name: "Pav Bhaji", calories: 350, protein: 8, carbs: 45, fat: 15, serving: "1 plate", category: "Snacks" },
  { name: "Vada Pav", calories: 290, protein: 6, carbs: 40, fat: 12, serving: "1 piece", category: "Snacks" },
  { name: "Pani Puri (6 pcs)", calories: 180, protein: 3, carbs: 30, fat: 5, serving: "6 pieces", category: "Snacks" },
  { name: "Sev Puri", calories: 200, protein: 4, carbs: 28, fat: 8, serving: "1 plate", category: "Snacks" },
  { name: "Bhel Puri", calories: 160, protein: 3, carbs: 26, fat: 5, serving: "1 plate", category: "Snacks" },
  { name: "Aloo Tikki", calories: 150, protein: 3, carbs: 20, fat: 7, serving: "1 piece", category: "Snacks" },
  { name: "Spring Roll", calories: 120, protein: 3, carbs: 14, fat: 6, serving: "1 piece", category: "Snacks" },

  // Sweets
  { name: "Gulab Jamun", calories: 175, protein: 3, carbs: 28, fat: 6, serving: "1 piece", category: "Sweets" },
  { name: "Rasgulla", calories: 120, protein: 3, carbs: 22, fat: 2, serving: "1 piece", category: "Sweets" },
  { name: "Jalebi", calories: 150, protein: 1, carbs: 30, fat: 5, serving: "2 pieces", category: "Sweets" },
  { name: "Ladoo (Besan)", calories: 180, protein: 4, carbs: 20, fat: 10, serving: "1 piece", category: "Sweets" },
  { name: "Barfi", calories: 160, protein: 4, carbs: 22, fat: 7, serving: "1 piece", category: "Sweets" },
  { name: "Kheer", calories: 200, protein: 5, carbs: 30, fat: 7, serving: "1 bowl", category: "Sweets" },
  { name: "Halwa (Sooji)", calories: 250, protein: 4, carbs: 32, fat: 12, serving: "1 bowl", category: "Sweets" },
  { name: "Gajar Halwa", calories: 220, protein: 4, carbs: 28, fat: 10, serving: "1 bowl", category: "Sweets" },

  // Drinks
  { name: "Chai (with sugar)", calories: 80, protein: 2, carbs: 12, fat: 2.5, serving: "1 cup", category: "Drinks" },
  { name: "Masala Chai", calories: 90, protein: 2, carbs: 14, fat: 2.5, serving: "1 cup", category: "Drinks" },
  { name: "Coffee (with milk & sugar)", calories: 70, protein: 2, carbs: 10, fat: 2, serving: "1 cup", category: "Drinks" },
  { name: "Lassi (sweet)", calories: 180, protein: 6, carbs: 28, fat: 5, serving: "1 glass", category: "Drinks" },
  { name: "Buttermilk / Chaas", calories: 40, protein: 2, carbs: 5, fat: 1, serving: "1 glass", category: "Drinks" },
  { name: "Mango Lassi", calories: 220, protein: 5, carbs: 35, fat: 6, serving: "1 glass", category: "Drinks" },
  { name: "Nimbu Pani", calories: 50, protein: 0, carbs: 12, fat: 0, serving: "1 glass", category: "Drinks" },
  { name: "Coconut Water", calories: 45, protein: 1, carbs: 9, fat: 0.5, serving: "1 glass", category: "Drinks" },

  // Breakfast
  { name: "Poha", calories: 180, protein: 4, carbs: 30, fat: 5, serving: "1 bowl", category: "Breakfast" },
  { name: "Aloo Puri", calories: 350, protein: 7, carbs: 42, fat: 16, serving: "2 puri + sabzi", category: "Breakfast" },
  { name: "Chole Bhature", calories: 500, protein: 14, carbs: 55, fat: 24, serving: "1 plate", category: "Breakfast" },
  { name: "Bread Toast (butter)", calories: 150, protein: 3, carbs: 18, fat: 7, serving: "2 slices", category: "Breakfast" },
  { name: "Egg Omelette", calories: 140, protein: 10, carbs: 1, fat: 10, serving: "2 eggs", category: "Breakfast" },
  { name: "Besan Chilla", calories: 130, protein: 6, carbs: 14, fat: 5, serving: "1 piece", category: "Breakfast" },
  { name: "Moong Dal Chilla", calories: 100, protein: 7, carbs: 12, fat: 3, serving: "1 piece", category: "Breakfast" },
  { name: "Thepla", calories: 120, protein: 4, carbs: 16, fat: 4, serving: "1 piece", category: "Breakfast" },

  // Misc
  { name: "Raita", calories: 80, protein: 4, carbs: 6, fat: 4, serving: "1 bowl", category: "Sides" },
  { name: "Pickle (1 tbsp)", calories: 30, protein: 0, carbs: 2, fat: 2.5, serving: "1 tbsp", category: "Sides" },
  { name: "Papad (roasted)", calories: 40, protein: 3, carbs: 5, fat: 1, serving: "1 piece", category: "Sides" },
  { name: "Green Chutney", calories: 15, protein: 0.5, carbs: 2, fat: 0.5, serving: "1 tbsp", category: "Sides" },
  { name: "Coconut Chutney", calories: 60, protein: 1, carbs: 4, fat: 4, serving: "2 tbsp", category: "Sides" },
  { name: "Ghee (1 tsp)", calories: 45, protein: 0, carbs: 0, fat: 5, serving: "1 tsp", category: "Sides" },
  { name: "Curd (plain)", calories: 60, protein: 4, carbs: 5, fat: 3, serving: "1 cup", category: "Sides" },
  { name: "Salad (Indian)", calories: 30, protein: 1, carbs: 5, fat: 0.5, serving: "1 bowl", category: "Sides" },
];

interface MealItem {
  id: number;
  foodIndex: number;
  quantity: number;
}

let nextMealId = 1;

export default function IndianFoodCalorieCounter() {
  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState<MealItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(FOODS.map((f) => f.category)))], []);

  const filtered = useMemo(() => {
    return FOODS.filter((f) => {
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "All" || f.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  const addToMeal = (foodIndex: number) => {
    setMeal([...meal, { id: nextMealId++, foodIndex, quantity: 1 }]);
  };

  const removeMealItem = (id: number) => {
    setMeal(meal.filter((m) => m.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    setMeal(meal.map((m) => (m.id === id ? { ...m, quantity: qty } : m)));
  };

  const mealTotals = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    meal.forEach((m) => {
      const food = FOODS[m.foodIndex];
      calories += food.calories * m.quantity;
      protein += food.protein * m.quantity;
      carbs += food.carbs * m.quantity;
      fat += food.fat * m.quantity;
    });
    return { calories, protein, carbs, fat };
  }, [meal]);

  return (
    <div className="space-y-8">
      {/* Meal Tracker */}
      {meal.length > 0 && (
        <div className="result-card space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Your Meal</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500">Calories</div>
              <div className="text-2xl font-extrabold text-red-500">{Math.round(mealTotals.calories)}</div>
              <div className="text-xs text-gray-400">kcal</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500">Protein</div>
              <div className="text-2xl font-extrabold text-blue-600">{mealTotals.protein.toFixed(1)}g</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500">Carbs</div>
              <div className="text-2xl font-extrabold text-amber-600">{mealTotals.carbs.toFixed(1)}g</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-xs font-medium text-gray-500">Fat</div>
              <div className="text-2xl font-extrabold text-green-600">{mealTotals.fat.toFixed(1)}g</div>
            </div>
          </div>
          <div className="space-y-2">
            {meal.map((m) => {
              const food = FOODS[m.foodIndex];
              return (
                <div key={m.id} className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{food.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({food.serving})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0.5} step={0.5} value={m.quantity}
                      onChange={(e) => updateQuantity(m.id, +e.target.value)}
                      className="w-16 text-center text-sm border rounded px-1 py-0.5"
                    />
                    <span className="text-sm font-bold text-gray-600 w-16 text-right">{Math.round(food.calories * m.quantity)}</span>
                    <button onClick={() => removeMealItem(m.id)} className="text-red-400 hover:text-red-600 font-bold px-1">x</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setMeal([])} className="btn-secondary text-sm">Clear Meal</button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="space-y-3">
        <input
          type="text" placeholder="Search food items..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="calc-input"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setSelectedCategory(c)} className={`text-xs px-3 py-1 rounded-full ${selectedCategory === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Food List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filtered.map((food, idx) => {
          const originalIdx = FOODS.indexOf(food);
          return (
            <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 hover:bg-gray-50 cursor-pointer border" onClick={() => addToMeal(originalIdx)}>
              <div>
                <div className="text-sm font-medium text-gray-800">{food.name}</div>
                <div className="text-xs text-gray-400">{food.serving} | {food.category}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-500">{food.calories} kcal</div>
                <div className="text-xs text-gray-400">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-4">No food items found.</p>}
      </div>
    </div>
  );
}
