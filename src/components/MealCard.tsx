import React from 'react';
import type { Meal } from '../types';
import { GripVertical, Youtube, ExternalLink, Pencil } from 'lucide-react';
import clsx from 'clsx';

interface MealCardProps {
    meal: Meal;
    isDragging?: boolean;
    onEditClick?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onEditClick }) => {

    const onDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('mealId', meal.id);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            className={clsx(
                "group bg-secondary/50 p-3 rounded-md shadow-sm border border-border flex items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-secondary/80 transition-colors relative"
            )}
        >
            <GripVertical className="w-5 h-5 text-muted-foreground shrink-0" />
            
            {meal.image && (
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border/50">
                    <img 
                        src={meal.image} 
                        alt={meal.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Hide broken images gracefully
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm truncate pr-2">{meal.name}</h4>
                    <div className="flex gap-1">
                        {onEditClick && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditClick(); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded-full transition-opacity"
                                aria-label="Edit meal"
                            >
                                <Pencil className="w-3 h-3 text-muted-foreground" />
                            </button>
                        )}
                        {meal.isLeftoverFriendly && (
                            <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                                Leftovers
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className={clsx(
                        "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                        meal.complexity === 'simple' ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                    )}>
                        {meal.complexity}
                    </span>
                    {meal.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-background text-muted-foreground text-[10px] rounded-full border border-border">
                            {tag}
                        </span>
                    ))}
                    {meal.tags && meal.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">+{meal.tags.length - 3}</span>
                    )}
                </div>

                {meal.nutrition && (
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground border-t border-border/50 pt-1.5 overflow-hidden">
                        <span className="font-bold text-orange-600 dark:text-orange-400 shrink-0">{meal.nutrition.calories} kcal</span>
                        <span className="hidden sm:inline">P: {meal.nutrition.protein}g</span>
                        <span className="hidden sm:inline">C: {meal.nutrition.carbs}g</span>
                        <span className="hidden sm:inline">F: {meal.nutrition.fat}g</span>
                    </div>
                )}

                {/* External Links */}
                {(meal.videoUrl || meal.sourceUrl) && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                        {meal.videoUrl && (
                            <a
                                href={meal.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/20 transition-colors z-10"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Youtube className="w-3.5 h-3.5" />
                                Watch
                            </a>
                        )}
                        {meal.sourceUrl && (
                            <a
                                href={meal.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md hover:bg-blue-500/20 transition-colors z-10"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Recipe
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
