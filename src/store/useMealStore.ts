import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Meal, DayPlan, AppSettings, ShoppingList, Ingredient, ShoppingItem } from '../types';
import { usePantryStore } from './usePantryStore';
import { mockMeals } from '../data/mockMeals';
import { addDays, format, isSaturday, isSunday } from 'date-fns';

interface MealStore {
    meals: Meal[];
    planningData: Record<string, DayPlan>; // Keyed by date string 'YYYY-MM-DD'
    settings: AppSettings;
    currentShoppingList: ShoppingList | null;

    // Actions
    addMeal: (meal: Meal) => void;
    updateMeal: (meal: Meal) => void;
    updateDayPlan: (date: string, type: 'lunch' | 'dinner', value: any) => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
    generateShoppingList: () => void;
    updateShoppingListItems: (items: any[]) => void;
    updateShoppingItem: (itemId: string, updates: Partial<any>) => void;
    addShoppingItem: (item: any) => void;
    clearCheckedItems: () => void;
    autoPopulateWeek: (startDate: string, days: number, filter: string, preserveExisting: boolean) => void;

    // Selectors helpers
    getDayPlan: (date: string) => DayPlan;
}

export const useMealStore = create<MealStore>()(
    persist(
        (set, get) => ({
            meals: mockMeals,
            planningData: {},
            settings: {
                shoppingFrequencyDays: 7,
                theme: 'dark',
            },
            currentShoppingList: null,

            addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
            updateMeal: (updatedMeal) => set((state) => ({
                meals: state.meals.map(m => m.id === updatedMeal.id ? updatedMeal : m)
            })),

            getDayPlan: (date) => {
                const state = get();
                const dayPlan = state.planningData[date];
                if (dayPlan) return dayPlan;

                // Smart defaults for portions if creating new slot
                const d = new Date(date);
                const isWeekend = isSaturday(d) || isSunday(d);

                return {
                    date: date,
                    lunch: { type: null, portions: isWeekend ? 4 : 2 },
                    dinner: { type: null, portions: 4 }
                };
            },

            updateDayPlan: (date, type, value) => set((state) => {
                const existingDay = state.planningData[date] || {
                    date: date,
                    lunch: { type: null, portions: 2 },
                    dinner: { type: null, portions: 4 }
                };

                // If updating type, ensure portions are preserved or set to default
                const newSlotValue = {
                    ...existingDay[type],
                    ...value
                };

                return {
                    planningData: {
                        ...state.planningData,
                        [date]: {
                            ...existingDay,
                            [type]: newSlotValue
                        }
                    }
                };
            }),

            autoPopulateWeek: (startDateStr, days, filter, preserveExisting) => set((state) => {
                const startDate = new Date(startDateStr);
                const newPlanningData = { ...state.planningData };
                
                // Filter available meals
                const availableMeals = state.meals.filter(meal => 
                    filter === 'all' || (meal.tags && meal.tags.includes(filter as any))
                );

                if (availableMeals.length === 0) return {}; // Nothing to populate with

                for (let i = 0; i < days; i++) {
                    const currentDate = addDays(startDate, i);
                    const dateStr = format(currentDate, 'yyyy-MM-dd');
                    const existingDay = newPlanningData[dateStr] || {
                        date: dateStr,
                        lunch: { type: null, portions: isSaturday(currentDate) || isSunday(currentDate) ? 4 : 2 },
                        dinner: { type: null, portions: 4 }
                    };

                    const newDay = { ...existingDay };

                    // Populate Lunch
                    if (!preserveExisting || !newDay.lunch.type) {
                        const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
                        newDay.lunch = { ...newDay.lunch, type: 'meal', mealId: randomMeal.id };
                    }

                    // Populate Dinner
                    if (!preserveExisting || !newDay.dinner.type) {
                        const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
                        newDay.dinner = { ...newDay.dinner, type: 'meal', mealId: randomMeal.id };
                    }

                    newPlanningData[dateStr] = newDay;
                }

                return { planningData: newPlanningData };
            }),

            updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),

            updateShoppingListItems: (items) => set((state) => {
                if (!state.currentShoppingList) return {};
                return {
                    currentShoppingList: {
                        ...state.currentShoppingList,
                        items: items
                    }
                };
            }),

            updateShoppingItem: (itemId, updates) => set((state) => {
                if (!state.currentShoppingList) return {};
                return {
                    currentShoppingList: {
                        ...state.currentShoppingList,
                        items: state.currentShoppingList.items.map(item =>
                            item.id === itemId ? { ...item, ...updates } : item
                        )
                    }
                };
            }),

            addShoppingItem: (newItem) => set((state) => {
                if (!state.currentShoppingList) return {};
                return {
                    currentShoppingList: {
                        ...state.currentShoppingList,
                        items: [...state.currentShoppingList.items, newItem]
                    }
                };
            }),

            clearCheckedItems: () => set((state) => {
                if (!state.currentShoppingList) return {};
                return {
                    currentShoppingList: {
                        ...state.currentShoppingList,
                        items: state.currentShoppingList.items.filter(item => !item.checked)
                    }
                };
            }),

            generateShoppingList: () => {
                const state = get();
                const startDate = new Date(); // Start from today
                const daysToPlan = state.settings.shoppingFrequencyDays;

                const endDate = addDays(startDate, daysToPlan - 1);

                const allIngredients: Ingredient[] = [];

                // Iterate through planned days
                for (let i = 0; i < daysToPlan; i++) {
                    const currentDate = addDays(startDate, i);
                    const dateStr = format(currentDate, 'yyyy-MM-dd');
                    const dayPlan = state.planningData[dateStr];

                    if (dayPlan) {
                        (['lunch', 'dinner'] as const).forEach(type => {
                            const slot = dayPlan[type];
                            if (slot?.type === 'meal' && slot.mealId) {
                                const meal = state.meals.find(m => m.id === slot.mealId);
                                if (meal) {
                                    // Scale ingredients by portions
                                    const portions = slot.portions || 1;
                                    const servings = meal.servings || 1;
                                    const multiplier = portions / servings;

                                    meal.ingredients.forEach(ing => {
                                        allIngredients.push({
                                            ...ing,
                                            quantity: ing.quantity * multiplier
                                        });
                                    });
                                }
                            }
                        });
                    }
                }

                // Consolidate ingredients
                const consolidated: { [key: string]: Ingredient } = {};

                allIngredients.forEach(ing => {
                    // Unique key by name + unit to avoid mixing 'kg' vs 'pcs'
                    const key = `${ing.name.toLowerCase()}-${ing.unit}`;
                    if (consolidated[key]) {
                        consolidated[key].quantity += ing.quantity;
                    } else {
                        consolidated[key] = { ...ing };
                    }
                });

                // Create Item List
                const pantryItems = usePantryStore.getState().items;
                const items: ShoppingItem[] = [];
                
                Object.values(consolidated).forEach((ing) => {
                    let neededQuantity = ing.quantity;

                    // Find matching item in pantry (fuzzy match by name and unit)
                    const pantryMatch = pantryItems.find((p: any) => 
                        p.name.toLowerCase().trim() === ing.name.toLowerCase().trim() && 
                        p.unit.toLowerCase().trim() === ing.unit.toLowerCase().trim()
                    );

                    if (pantryMatch) {
                        neededQuantity -= pantryMatch.quantity;
                    }

                    // Only add to shopping list if we still need some
                    if (neededQuantity > 0) {
                        items.push({
                            id: `item-${crypto.randomUUID()}`,
                            name: ing.name,
                            quantity: parseFloat(neededQuantity.toFixed(2)),
                            unit: ing.unit,
                            checked: false,
                            category: ing.category,
                            estimatedCost: (ing.priceEstimate || 0) * neededQuantity
                        });
                    }
                });

                const newList: ShoppingList = {
                    id: crypto.randomUUID(),
                    startDate: format(startDate, 'yyyy-MM-dd'),
                    endDate: format(endDate, 'yyyy-MM-dd'),
                    items: items.sort((a, b) => (a.category || '').localeCompare(b.category || '')),
                    createdAt: new Date().toISOString(),
                    status: 'active'
                };

                set({ currentShoppingList: newList });
            }
        }),
        {
            name: 'meal-planner-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
