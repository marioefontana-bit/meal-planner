import type { PriceProvider } from './types';
import { createMockProvider } from './providers/mockFactory';

class StoreRegistry {
    private providers: PriceProvider[] = [];

    constructor() {
        // Initialize with default mock providers
        this.register(createMockProvider('budget-mart', 'Budget Mart', 0.85, 0.05)); // Cheap, low variance
        this.register(createMockProvider('fresh-choice', 'Fresh Choice', 1.0, 0.1)); // Standard
        this.register(createMockProvider('organic-whole', 'Organic Whole', 1.4, 0.1)); // Expensive
    }

    register(provider: PriceProvider) {
        this.providers.push(provider);
    }

    getProviders(): PriceProvider[] {
        return this.providers;
    }

    getProvider(id: string): PriceProvider | undefined {
        return this.providers.find(p => p.id === id);
    }
}

export const storeRegistry = new StoreRegistry();
