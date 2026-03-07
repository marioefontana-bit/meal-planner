export interface StorePrice {
    ingredientId: string;
    price: number;
    unit: string;
    storeId: string;
}

export interface StoreSummary {
    storeId: string;
    storeName: string;
    totalCost: number;
    missingItemCount: number;
    prices: StorePrice[];
}

export interface PriceProvider {
    id: string;
    name: string;
    description?: string;
    currency: string;
    // Returns prices for a list of ingredient names/IDs
    getPrices(items: { name: string; quantity: number; unit: string }[]): Promise<StorePrice[]>;
}
