import type { PriceProvider } from '../types';

// Mock prices database for demo purposes
// In a real plugin, this would be an API call or web scraper
const DATABASE: Record<string, number> = {
    'chicken': 3.5, // per kg/unit
    'beef': 5.0,
    'rice': 1.2,
    'pasta': 0.8,
    'tomato': 1.0,
    'lettuce': 0.8,
    'cheese': 4.0,
    'milk': 1.0,
    'bread': 1.5,
    'onion': 0.5,
    'garlic': 0.4,
    'potato': 0.6,
    'carrot': 0.7,
    'apple': 1.2,
    'banana': 0.9,
    'orange': 1.1,
    'egg': 0.2, // per piece logic
    'oil': 2.5,
    'salt': 0.5,
    'pepper': 1.0,
    'sugar': 0.9,
    'flour': 0.8,
    'butter': 2.0,
    'yogurt': 1.5,
    'salmon': 8.0,
    'tofu': 2.0,
    'asparagus': 3.0,
    'lemon': 0.5,
    'tortilla': 0.2,
    'salsa': 1.0
};

export const createMockProvider = (
    id: string,
    name: string,
    priceMultiplier: number,
    variance: number = 0
): PriceProvider => {
    return {
        id,
        name,
        currency: '$',
        getPrices: async (items) => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return items.map(item => {
                // Fuzzy match item name to database
                const key = Object.keys(DATABASE).find(k => item.name.toLowerCase().includes(k));
                const basePrice = key ? DATABASE[key] : 1.0; // Default $1 if unknown

                // Calculate price with multiplier and some random variance
                const randomVar = 1 + (Math.random() * variance * 2 - variance);
                const finalUnitPrice = basePrice * priceMultiplier * randomVar;
                const totalItemPrice = finalUnitPrice * item.quantity;

                return {
                    ingredientId: item.name, // Using name as ID for now
                    storeId: id,
                    price: totalItemPrice,
                    unit: item.unit
                };
            });
        }
    };
};
