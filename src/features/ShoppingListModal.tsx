import React, { useState, useEffect } from 'react';
import { useMealStore } from '../store/useMealStore';
import { usePantryStore } from '../store/usePantryStore';
import { storeRegistry } from '../services/stores/StoreRegistry';
import type { StoreSummary } from '../services/stores/types';
import {
    X, Check, ShoppingBag, ArrowRight, RefreshCw, AlertCircle,
    TrendingDown, Store, GripVertical, ArrowUpDown, Plus, Minus, Trash,
    Apple, Beef, Milk, Cookie, Coffee, Package, Droplets, Utensils
} from 'lucide-react';
import clsx from 'clsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ShoppingListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    'Produce': Apple,
    'Meat': Beef,
    'Dairy': Milk,
    'Bakery': Cookie,
    'Pantry': Package,
    'Beverages': Coffee,
    'Oils & Spices': Droplets,
    'Frozen': Utensils,
    'Other': ShoppingBag
};

// Sortable Item Component
const SortableCategory = ({ id, category, children }: { id: string, category: string, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={clsx("mb-4 rounded-xl border bg-card overflow-hidden", isDragging ? "shadow-2xl ring-2 ring-primary rotate-1 opacity-90" : "border-border shadow-sm")}>
            <div className="bg-secondary/40 p-3 flex items-center gap-3 border-b border-border/50 select-none">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded touch-none">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{category || 'Uncategorized'}</h4>
            </div>
            <div className="p-2 space-y-2">
                {children}
            </div>
        </div>
    );
};

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ isOpen, onClose }) => {
    const {
        currentShoppingList,
        generateShoppingList,
        updateShoppingListItems,
        updateShoppingItem,
        addShoppingItem,
        clearCheckedItems
    } = useMealStore();
    const { hasItem } = usePantryStore();
    const { t } = useTranslation();

    const [mode, setMode] = useState<'view' | 'review' | 'compare' | 'sort'>('view');
    const [reviewItems, setReviewItems] = useState<any[]>([]);
    const [comparisons, setComparisons] = useState<StoreSummary[]>([]);
    const [loadingComparison, setLoadingComparison] = useState(false);
    const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
    const [newItemName, setNewItemName] = useState('');

    // DND Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (isOpen && !currentShoppingList) {
            handleStartGeneration();
        } else {
            setMode('view');
            setComparisons([]);
        }
    }, [isOpen]);

    // Initialize categories when list changes
    useEffect(() => {
        if (currentShoppingList?.items) {
            const cats = Array.from(new Set(currentShoppingList.items.map(i => i.category || 'Uncategorized')));
            setCategoryOrder(cats.sort());
        }
    }, [currentShoppingList]);

    const handleStartGeneration = () => {
        generateShoppingList();
        setMode('review');
    };

    useEffect(() => {
        if (mode === 'review' && currentShoppingList) {
            const initialItems = currentShoppingList.items.map(item => ({
                ...item,
                checked: !hasItem(item.name)
            }));
            setReviewItems(initialItems);
        }
    }, [mode, currentShoppingList]);

    const toggleReviewItem = (index: number) => {
        const newItems = [...reviewItems];
        newItems[index].checked = !newItems[index].checked;
        setReviewItems(newItems);
    };

    const confirmList = () => {
        const finalItems = reviewItems
            .filter(i => i.checked)
            .map(i => ({ ...i, checked: false }));

        updateShoppingListItems(finalItems);
        setMode('view');
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setCategoryOrder((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over?.id as string);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleStartComparison = async () => {
        if (!currentShoppingList) return;
        setMode('compare');
        setLoadingComparison(true);

        const itemsToPrice = currentShoppingList.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit
        }));

        const providers = storeRegistry.getProviders();
        const results: StoreSummary[] = [];

        for (const provider of providers) {
            try {
                const prices = await provider.getPrices(itemsToPrice);
                const total = prices.reduce((sum, p) => sum + p.price, 0);
                results.push({
                    storeId: provider.id,
                    storeName: provider.name,
                    totalCost: total,
                    missingItemCount: 0,
                    prices
                });
            } catch (error) {
                console.error(`Failed to get prices for ${provider.name}`, error);
            }
        }

        results.sort((a, b) => a.totalCost - b.totalCost);
        setComparisons(results);
        setLoadingComparison(false);
    };

    const handleExportPDF = () => {
        if (!currentShoppingList) return;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(t('modals.shoppingList.title'), 14, 22);
        // ... rest of PDF logic ...
        autoTable(doc, {
            startY: 45,
            head: [['Item', 'Category', 'Quantity']],
            // Group by category order before export? For PDF maybe just simple list
            body: currentShoppingList.items.map(i => [i.name, i.category || '-', `${i.quantity} ${i.unit}`]),
        });
        doc.save(`shopping-list.pdf`);
    };

    const handleShareWhatsApp = () => {
        if (!currentShoppingList) return;
        // Share by category
        let text = `*${t('modals.shoppingList.title')}*\n\n`;
        categoryOrder.forEach(cat => {
            const items = currentShoppingList.items.filter(i => (i.category || 'Uncategorized') === cat);
            if (items.length > 0) {
                text += `*${cat}*\n`;
                items.forEach(i => text += `- [ ] ${i.name} (${i.quantity} ${i.unit})\n`);
                text += '\n';
            }
        });
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleAddManualItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        const newItem = {
            id: crypto.randomUUID(),
            name: newItemName,
            quantity: 1,
            unit: 'pcs',
            checked: false,
            category: 'Other'
        };

        addShoppingItem(newItem);
        setNewItemName('');
    };

    const updateQty = (itemId: string, currentQty: number, delta: number) => {
        const newQty = Math.max(0, currentQty + delta);
        if (newQty === 0) {
            updateShoppingListItems(currentShoppingList?.items.filter(i => i.id !== itemId) || []);
        } else {
            updateShoppingItem(itemId, { quantity: parseFloat(newQty.toFixed(2)) });
        }
    };

    const getCategoryIcon = (category: string) => {
        const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['Other'];
        return <Icon className="w-3.5 h-3.5" />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-3xl max-h-[85vh] rounded-xl shadow-2xl border border-border flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-card rounded-t-xl z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {mode === 'review' ? t('modals.shoppingList.reviewTitle') :
                                    mode === 'compare' ? t('modals.shoppingList.comparePrices') :
                                        mode === 'sort' ? t('modals.shoppingList.sortAisles') :
                                            t('modals.shoppingList.title')}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {mode === 'review' ? t('modals.shoppingList.reviewDesc') :
                                    mode === 'sort' ? 'Drag categories to match your supermarket layout' :
                                        currentShoppingList ? `${currentShoppingList.items.length} items` : ''}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Action Bar */}
                {mode === 'view' && currentShoppingList && (
                    <div className="px-6 py-3 bg-secondary/30 flex gap-3 overflow-x-auto items-center border-b border-border/50">
                        <button onClick={handleExportPDF} className="bg-card border border-border px-3 py-1.5 rounded-md text-sm hover:bg-secondary transition-colors shadow-sm whitespace-nowrap">{t('modals.shoppingList.download')}</button>
                        <button onClick={handleShareWhatsApp} className="bg-card border border-border px-3 py-1.5 rounded-md text-sm hover:bg-secondary transition-colors shadow-sm whitespace-nowrap">{t('modals.shoppingList.share')}</button>

                        <div className="h-6 w-px bg-border mx-1" />

                        <button onClick={() => setMode('sort')} className="bg-secondary border border-border text-foreground px-3 py-1.5 rounded-md text-sm hover:bg-secondary/80 transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
                            <ArrowUpDown className="w-4 h-4" /> {t('modals.shoppingList.sortAisles')}
                        </button>
                        <button onClick={handleStartComparison} className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-md text-sm hover:bg-primary/20 transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
                            <Store className="w-4 h-4" /> {t('modals.shoppingList.comparePrices')}
                        </button>

                        <div className="flex-1" />
                        <button onClick={handleStartGeneration} className="text-primary text-sm hover:underline flex items-center gap-1 whitespace-nowrap">
                            <RefreshCw className="w-3 h-3" /> {t('modals.shoppingList.regenerate')}
                        </button>

                        <div className="h-6 w-px bg-border mx-1" />

                        <button onClick={clearCheckedItems} className="text-destructive text-sm hover:underline flex items-center gap-1 whitespace-nowrap">
                            <Trash className="w-3 h-3" /> Clear Checked
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-background/50">
                    {mode === 'sort' && currentShoppingList ? (
                        <div className="max-w-xl mx-auto">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
                                    {categoryOrder.map(cat => {
                                        const items = currentShoppingList.items.filter(i => (i.category || 'Uncategorized') === cat);
                                        if (items.length === 0) return null;
                                        return (
                                            <SortableCategory key={cat} id={cat} category={cat}>
                                                {items.map((item, idx) => (
                                                    <div key={`${item.id}-${idx}`} className="flex items-center gap-3 p-2 bg-background/80 rounded border border-border/50 text-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                        <span className="flex-1">{item.name}</span>
                                                        <span className="text-muted-foreground text-xs">{item.quantity} {item.unit}</span>
                                                    </div>
                                                ))}
                                            </SortableCategory>
                                        );
                                    })}
                                </SortableContext>
                            </DndContext>
                        </div>
                    ) : mode === 'compare' ? (
                        // Compare Mode (Same as before)
                        loadingComparison ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                <p className="text-muted-foreground animate-pulse font-medium">Analyzing store prices...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comparisons.length > 0 && (
                                    <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-center gap-4 shadow-sm">
                                        <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full shrink-0">
                                            <TrendingDown className="w-6 h-6 text-green-700 dark:text-green-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-green-900 dark:text-green-300 text-lg">{comparisons[0].storeName}</h3>
                                            <p className="text-green-800 dark:text-green-400 text-sm">
                                                Best value at <span className="font-bold">${comparisons[0].totalCost.toFixed(2)}</span>.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {comparisons.map((store, idx) => (
                                        <div key={store.storeId} className={clsx("p-4 rounded-xl border", idx === 0 ? "bg-card border-primary ring-1" : "bg-card/50")}>
                                            <h4 className="font-bold">{store.storeName}</h4>
                                            <div className="text-2xl font-bold mt-2 text-primary">${store.totalCost.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : mode === 'review' ? (
                        // Review Mode (Same as before)
                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-4 border border-blue-200 dark:border-blue-900/50">
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-300">
                                    <p className="font-bold mb-1">Check your pantry!</p>
                                    <p className="opacity-90">Items in Pantry are unchecked.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {reviewItems.map((item, idx) => (
                                    <div key={idx} className={clsx("flex items-center gap-3 p-3 rounded-lg border cursor-pointer", item.checked ? "bg-card border-primary/50" : "bg-secondary/30 border-transparent opacity-60")} onClick={() => toggleReviewItem(idx)}>
                                        <div className={clsx("w-5 h-5 rounded border flex items-center justify-center shrink-0", item.checked ? "bg-primary border-primary" : "border-muted-foreground")}>
                                            {item.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                                        </div>
                                        <span className="flex-1 text-sm font-medium">{item.name} {hasItem(item.name) && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded ml-2">In Pantry</span>}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // View Mode - Grouped by Category Order
                        !currentShoppingList ? (
                            <div className="text-center py-20 text-muted-foreground"><p>{t('modals.shoppingList.empty')}</p></div>
                        ) : (
                            <div className="space-y-6">
                                {categoryOrder.length === 0 ? (
                                    <div className="p-4 text-center">Loading list...</div>
                                ) : (
                                    categoryOrder.map(cat => {
                                        const items = currentShoppingList.items.filter(i => (i.category || 'Uncategorized') === cat);
                                        if (items.length === 0) return null;
                                        return (
                                            <div key={cat} className="mb-6">
                                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-1">{cat}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {items.map((item, idx) => (
                                                        <div key={`${item.id}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm group/item">
                                                            <div
                                                                onClick={() => updateShoppingItem(item.id, { checked: !item.checked })}
                                                                className={clsx("w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors", item.checked ? "bg-primary border-primary" : "border-muted-foreground/30 hover:border-primary/50")}
                                                            >
                                                                {item.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                                                <div className="p-1.5 bg-secondary/50 rounded-lg text-muted-foreground">
                                                                    {getCategoryIcon(cat)}
                                                                </div>
                                                                <div className={clsx("font-medium text-sm truncate", item.checked && "line-through opacity-40")}>{item.name}</div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center bg-secondary/30 rounded-lg border border-border/50 p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => updateQty(item.id, item.quantity, -1)}
                                                                        className="p-1 hover:text-primary transition-colors"
                                                                    >
                                                                        <Minus className="w-3 h-3" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateQty(item.id, item.quantity, 1)}
                                                                        className="p-1 hover:text-primary transition-colors"
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                                <div className="font-mono text-xs font-semibold bg-secondary px-2 py-1 rounded border border-border min-w-[4rem] text-center">
                                                                    {item.quantity} {item.unit}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {/* Manual Item Input */}
                                <div className="mt-8 border-t border-border pt-6 pb-10">
                                    <form onSubmit={handleAddManualItem} className="flex gap-2 max-w-md mx-auto">
                                        <input
                                            type="text"
                                            placeholder="Add manual item (e.g. Toilet paper...)"
                                            className="flex-1 bg-card px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                                            value={newItemName}
                                            onChange={e => setNewItemName(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="bg-secondary text-foreground p-2 px-4 rounded-lg hover:bg-secondary/70 transition-all font-bold text-sm"
                                        >
                                            Add
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-card rounded-b-xl flex justify-end gap-3">
                    {mode !== 'view' ? (
                        <button onClick={() => setMode('view')} className="px-5 py-2 rounded-lg text-sm font-medium hover:bg-secondary text-foreground flex items-center gap-2 border border-border bg-card">
                            <ArrowRight className="w-4 h-4 rotate-180" /> {t('modals.shoppingList.backToList')}
                        </button>
                    ) : (
                        <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-foreground border border-transparent hover:border-border">
                            {t('common.close')}
                        </button>
                    )}
                    {mode === 'review' && (
                        <button onClick={confirmList} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 shadow-sm">
                            {t('modals.shoppingList.createList')} <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
