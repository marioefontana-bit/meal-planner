import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PantryItem {
    id: string;
    name: string;
    category?: string;
    quantity: number;
    unit: string;
    expiryDate?: string;
}

interface PantryStore {
    items: PantryItem[];
    addItem: (item: Omit<PantryItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, updates: Partial<PantryItem>) => void;
    hasItem: (name: string) => boolean;
}

export const usePantryStore = create<PantryStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => ({
                items: [...state.items, { ...item, id: crypto.randomUUID() }]
            })),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),
            updateItem: (id, updates) => set((state) => ({
                items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i))
            })),
            hasItem: (name) => {
                const state = get();
                // Simple fuzzy match
                return state.items.some(i => i.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(i.name.toLowerCase()));
            }
        }),
        {
            name: 'pantry-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
