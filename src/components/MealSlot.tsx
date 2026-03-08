import React, { useState } from 'react';
import { useMealStore } from '../store/useMealStore';
import { Trash2, Repeat, Minus, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import type { MealSlotData, Meal } from '../types';
import { useTranslation } from 'react-i18next';
import { format, subDays } from 'date-fns';

interface MealSlotProps {
    dayDate: string;
    type: 'lunch' | 'dinner';
    data: MealSlotData;
}

export const MealSlot: React.FC<MealSlotProps> = ({ dayDate, type, data }) => {
    const { updateDayPlan, meals, planningData } = useMealStore();
    const [isHovered, setIsHovered] = useState(false);
    const [showLeftoverPicker, setShowLeftoverPicker] = useState(false);
    const { t } = useTranslation();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const mealId = e.dataTransfer.getData('mealId');
        if (mealId) {
            updateDayPlan(dayDate, type, { type: 'meal', mealId });
        }
        setIsHovered(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHovered(true);
    };

    const handleDragLeave = () => {
        setIsHovered(false);
    };

    const clearSlot = () => {
        updateDayPlan(dayDate, type, { type: null });
    };

    const setLeftovers = (mealId?: string) => {
        updateDayPlan(dayDate, type, { type: 'leftovers', inheritedMealId: mealId });
        setShowLeftoverPicker(false);
    };

    const getAvailableLeftovers = () => {
        const available: Meal[] = [];
        const seenIds = new Set<string>();

        // Check last 3 days
        for (let i = 1; i <= 3; i++) {
            const prevDate = format(subDays(new Date(dayDate), i), 'yyyy-MM-dd');
            const dayPlan = planningData[prevDate];
            if (dayPlan) {
                ['lunch', 'dinner'].forEach(slotType => {
                    const slot = (dayPlan as any)[slotType];
                    if (slot?.type === 'meal' && slot.mealId) {
                        const meal = meals.find(m => m.id === slot.mealId);
                        if (meal?.isLeftoverFriendly && !seenIds.has(meal.id)) {
                            available.push(meal);
                            seenIds.has(meal.id);
                            seenIds.add(meal.id);
                        }
                    }
                });
            }
        }
        return available;
    };

    const updatePortions = (delta: number) => {
        const currentPortions = data.portions || 1;
        const newPortions = Math.max(1, currentPortions + delta);
        updateDayPlan(dayDate, type, { portions: newPortions });
    };

    const meal = data.type === 'meal' ? meals.find(m => m.id === data.mealId) :
        data.type === 'leftovers' && data.inheritedMealId ? meals.find(m => m.id === data.inheritedMealId) : null;

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={clsx(
                "flex-1 rounded-xl border-2 transition-all duration-300 p-4 flex flex-col justify-center min-h-[110px] relative group overflow-hidden",
                isHovered ? "scale-[0.99] shadow-md" : "shadow-sm",
                // Lunch Theme (Green)
                type === 'lunch' 
                    ? (isHovered ? "border-green-500/60 bg-green-500/10" : "border-green-500/20 bg-green-500/5") 
                    : (isHovered ? "border-blue-500/60 bg-blue-500/10" : "border-blue-500/20 bg-blue-500/5"),
                // Active State (Meal or Leftovers)
                (data.type === 'meal' || data.type === 'leftovers') && (
                    type === 'lunch' 
                        ? "border-green-500/40 bg-green-500/10 backdrop-blur-sm" 
                        : "border-blue-500/40 bg-blue-500/10 backdrop-blur-sm"
                )
            )}
        >
            {/* Background highlight for active slots */}
            {(data.type === 'meal' || data.type === 'leftovers') && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
            )}

            {data.type === 'meal' && meal ? (
                <div className="relative z-10 w-full">
                    <div className="flex justify-between items-start gap-2">
                        {meal.image && (
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-border/50">
                                <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <span className="font-bold text-[13px] leading-tight block line-clamp-2 transition-all text-foreground/90">
                                {meal.name}
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={clsx(
                                    "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                    meal.complexity === 'simple' ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                )}>
                                    {meal.complexity}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); clearSlot(); }}
                            className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 p-0.5 shadow-sm group/portions">
                            <button
                                onClick={(e) => { e.stopPropagation(); updatePortions(-1); }}
                                className="p-1 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            >
                                <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[10px] font-black px-2 min-w-[2.5rem] text-center border-x border-border/30">
                                {data.portions || 1}<span className="text-[9px] opacity-60 ml-0.5 font-bold">P</span>
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); updatePortions(1); }}
                                className="p-1 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            >
                                <Plus className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : data.type === 'leftovers' ? (
                <div className="flex items-center justify-between text-muted-foreground relative z-10 w-full">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 bg-orange-500/10 rounded-full shrink-0">
                            <Repeat className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">{t('scheduler.leftovers')}</span>
                            <span className="text-xs font-bold truncate">
                                {meal ? meal.name : t('scheduler.leftovers')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); clearSlot(); }}
                        className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all shrink-0"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground/30 relative z-10 py-2 w-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t(`scheduler.${type}`)}</span>
                    {type === 'lunch' && !showLeftoverPicker && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowLeftoverPicker(true); }}
                            className="text-[9px] font-bold text-primary/60 hover:text-primary hover:underline transition-all"
                        >
                            {t('scheduler.useLeftovers')}
                        </button>
                    )}
                    {showLeftoverPicker && (
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-20 flex flex-col p-2 overflow-y-auto animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">{t('scheduler.selectLeftover', 'Available Leftovers')}</span>
                                <button onClick={() => setShowLeftoverPicker(false)} className="p-1 hover:bg-secondary rounded-full">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {getAvailableLeftovers().map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setLeftovers(m.id)}
                                        className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-bold bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all truncate"
                                    >
                                        {m.name}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setLeftovers()}
                                    className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-medium italic text-muted-foreground hover:bg-secondary transition-all"
                                >
                                    {t('common.generic', 'Generic Leftovers')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

