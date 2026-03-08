import React, { useState } from 'react';
import { usePantryStore } from '../store/usePantryStore';
import { X, Plus, Trash2, Package, Minus, Globe, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PriceScraperService } from '../services/PriceScraperService';

interface PantryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PantryModal: React.FC<PantryModalProps> = ({ isOpen, onClose }) => {
    const { items, addItem, removeItem, updateItem } = usePantryStore();
    const { t } = useTranslation();
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState(1);
    const [newItemUnit, setNewItemUnit] = useState('pcs');
    const [scrapingId, setScrapingId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        
        // Basic deduplication check
        const existing = items.find(i => 
            i.name.toLowerCase().trim() === newItemName.toLowerCase().trim() &&
            i.unit === newItemUnit
        );

        if (existing) {
            updateItem(existing.id, { quantity: existing.quantity + newItemQty });
        } else {
            addItem({
                name: newItemName.trim(),
                quantity: newItemQty,
                unit: newItemUnit
            });
        }
        
        setNewItemName('');
        setNewItemQty(1);
        setNewItemUnit('pcs');
    };

    const handleQuantityChange = (id: string, currentQty: number, delta: number) => {
        const newQty = Math.max(0, currentQty + delta);
        if (newQty === 0) {
            removeItem(id);
        } else {
            updateItem(id, { quantity: parseFloat(newQty.toFixed(2)) });
        }
    };

    const handleScrapePrice = async (id: string) => {
        const url = prompt("Paste Carrefour URL:");
        if (!url) return;
        
        setScrapingId(id);
        try {
            const price = await PriceScraperService.scrapePrice(url);
            if (price) {
                updateItem(id, { priceEstimate: price, productUrl: url });
            } else {
                alert("Could not find a price. Please check the URL or enter manually.");
            }
        } catch (e) {
            alert("Error fetching price. Please enter manually.");
        } finally {
            setScrapingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg max-h-[85vh] rounded-xl shadow-xl border border-border flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        {t('pantry.title')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-border bg-secondary/10">
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={t('pantry.addPlaceholder')}
                                className="w-full bg-secondary px-3 py-2 rounded-md border border-border text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="0.1"
                                step="any"
                                className="w-20 bg-secondary px-3 py-2 rounded-md border border-border text-sm outline-none focus:ring-2 focus:ring-primary"
                                value={newItemQty || ''}
                                onChange={(e) => setNewItemQty(parseFloat(e.target.value))}
                                required
                                placeholder={t('pantry.qty')}
                            />
                            <select
                                className="w-24 bg-secondary px-3 py-2 rounded-md border border-border text-sm outline-none focus:ring-2 focus:ring-primary"
                                value={newItemUnit}
                                onChange={(e) => setNewItemUnit(e.target.value)}
                            >
                                <option value="pcs">pcs</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="tbsp">tbsp</option>
                                <option value="tsp">tsp</option>
                                <option value="cup">cup</option>
                            </select>
                            <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 flex-shrink-0" title="Add Item">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-12 flex flex-col items-center">
                            <Package className="w-12 h-12 mb-3 text-muted-foreground/30" />
                            {t('pantry.empty')}
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-lg group border border-border/50 hover:border-border transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 font-medium truncate pr-4">
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-card rounded-md border border-border overflow-hidden">
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                className="px-2 py-1 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <div className="px-3 py-1 text-sm font-semibold min-w-[3rem] text-center border-x border-border">
                                                {item.quantity} {item.unit}
                                            </div>
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                className="px-2 py-1 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.id)} 
                                            className="text-muted-foreground hover:text-destructive opacity-50 hover:opacity-100 transition-opacity p-1"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="relative flex-1 max-w-[150px]">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                        <input
                                            type="number"
                                            className="w-full bg-card pl-7 pr-3 py-1 rounded-md border border-border text-sm"
                                            placeholder="Price"
                                            value={item.priceEstimate || ''}
                                            onChange={e => updateItem(item.id, { priceEstimate: parseFloat(e.target.value) || undefined })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleScrapePrice(item.id)}
                                        disabled={scrapingId === item.id}
                                        title="Fetch price from Carrefour URL"
                                        className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors disabled:opacity-50"
                                    >
                                        {scrapingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
