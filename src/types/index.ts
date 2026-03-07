export type MealType = 'lunch' | 'dinner' | 'snack';
export type MealComplexity = 'simple' | 'complex' | 'leftovers';
export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'keto' | 'paleo' | 'pescatarian';

export interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category?: string;
    priceEstimate?: number; // Phase 3: Cost estimator
}

export interface Meal {
    id: string;
    name: string;
    type: MealType[];
    complexity: MealComplexity;
    ingredients: Ingredient[];
    isLeftoverFriendly?: boolean;
    tags?: DietaryTag[]; // Phase 3: Dietary filtering
    nutrition?: Nutrition; // Phase 4
    image?: string; // Phase 3: Custom meals
    videoUrl?: string; // Phase 5: YouTube integration
    sourceUrl?: string; // Phase 5: Blog/Recipe Link
    steps?: string[]; // Phase 2: Recipe preparation steps
}

export interface MealSlotData {
    type: 'meal' | 'leftovers' | 'out' | null;
    mealId?: string;
    inheritedMealId?: string; // Store original meal ID for leftovers
    portions?: number; // Phase 3: Portion control
}

export interface DayPlan {
    date: string;
    lunch: MealSlotData;
    dinner: MealSlotData;
}

export interface ShoppingItem extends Ingredient {
    checked: boolean;
    estimatedCost?: number; // Phase 3
}

export interface ShoppingList {
    id: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    items: ShoppingItem[];
    status: 'active' | 'archived';
}

export interface AppSettings {
    shoppingFrequencyDays: number;
    theme: 'light' | 'dark';
}
