import React, { useState } from 'react';
import { useMealStore } from '../store/useMealStore';
import { MealCard } from '../components/MealCard';
import { Search, Filter, PlusCircle, X } from 'lucide-react';
import type { DietaryTag } from '../types';
import { useTranslation } from 'react-i18next';

interface MealSidebarProps {
    onCreateClick: () => void;
    onEditClick: (meal: any) => void;
    onClose: () => void;
}

export const MealSidebar: React.FC<MealSidebarProps> = ({ onCreateClick, onEditClick, onClose }) => {
    const { meals } = useMealStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<DietaryTag | 'all'>('all');
    const { t } = useTranslation();

    const filteredMeals = meals.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTag === 'all' || (meal.tags && meal.tags.includes(selectedTag)))
    );

    const dietaryOptions: { value: DietaryTag | 'all', label: string }[] = [
        { value: 'all', label: t('sidebar.filters.all') },
        { value: 'vegetarian', label: t('sidebar.filters.vegetarian') },
        { value: 'vegan', label: t('sidebar.filters.vegan') },
        { value: 'gluten-free', label: t('sidebar.filters.glutenFree') },
        { value: 'keto', label: t('sidebar.filters.keto') },
        { value: 'paleo', label: t('sidebar.filters.paleo') },
        { value: 'pescatarian', label: t('sidebar.filters.pescatarian') },
    ];

    return (
        <div className="w-[310px] bg-card/40 backdrop-blur-xl border-r border-border flex flex-col h-full overflow-hidden shadow-2xl relative z-40">
            <div className="p-5 border-b border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-black text-xl tracking-tight text-foreground/80">{t('sidebar.title')}</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Filter className="w-4 h-4 text-primary" />
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center lg:hidden"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={t('sidebar.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary/50 backdrop-blur-sm pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none ring-offset-background border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                    />
                </div>

                <div className="relative group">
                    <Filter className="w-4 h-4 absolute left-3 top-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value as any)}
                        className="w-full bg-secondary/50 backdrop-blur-sm pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none ring-offset-background border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner appearance-none cursor-pointer font-medium"
                    >
                        {dietaryOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-card">{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredMeals.map(meal => (
                    <MealCard
                        key={meal.id}
                        meal={meal}
                        onEditClick={() => onEditClick(meal)}
                    />
                ))}
                {filteredMeals.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-10">
                        {t('sidebar.noMeals')}
                    </div>
                )}
            </div>

            <div className="p-5 border-t border-border/50 bg-secondary/20 backdrop-blur-md">
                <button
                    onClick={onCreateClick}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-bold text-sm shadow-lg shadow-primary/30 active:scale-[0.98]"
                >
                    <PlusCircle className="w-5 h-5" />
                    {t('app.createMeal')}
                </button>
            </div>
        </div>
    );
};
