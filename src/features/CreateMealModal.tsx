import React, { useState } from 'react';
import { useMealStore } from '../store/useMealStore';
import { X, Plus, Trash2, Globe, Loader2 } from 'lucide-react';
import type { Meal, Ingredient, MealType, MealComplexity, DietaryTag } from '../types';
import { useTranslation } from 'react-i18next';
import { RecipeImportService } from '../services/RecipeImportService';

interface CreateMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Meal | null;
}

export const CreateMealModal: React.FC<CreateMealModalProps> = ({ isOpen, onClose, initialData }) => {
    const { addMeal, updateMeal } = useMealStore();
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [complexity, setComplexity] = useState<MealComplexity>('simple');
    const [types] = useState<MealType[]>(['lunch', 'dinner']);
    const [tags, setTags] = useState<DietaryTag[]>([]);
    const [ingredients, setIngredients] = useState<Partial<Ingredient>[]>([{ id: crypto.randomUUID(), name: '', quantity: 1, unit: 'pcs' }]);
    const [isLeftoverFriendly, setIsLeftoverFriendly] = useState(false);
    const [steps, setSteps] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [importUrl, setImportUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState('');

    // Load initial data when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setComplexity(initialData.complexity);
            setTags(initialData.tags || []);
            setIngredients(initialData.ingredients.map(i => ({ ...i })));
            setIsLeftoverFriendly(initialData.isLeftoverFriendly || false);
            setSteps(initialData.steps || []);
            setVideoUrl(initialData.videoUrl || '');
            setSourceUrl(initialData.sourceUrl || '');
        } else if (isOpen && !initialData) {
            // Reset if opening in create mode
            setName('');
            setComplexity('simple');
            setTags([]);
            setIngredients([{ id: crypto.randomUUID(), name: '', quantity: 1, unit: 'pcs' }]);
            setIsLeftoverFriendly(false);
            setSteps([]);
            setVideoUrl('');
            setSourceUrl('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { id: crypto.randomUUID(), name: '', quantity: 1, unit: 'pcs' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: any) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const handleAddStep = () => setSteps([...steps, '']);
    const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const toggleTag = (tag: DietaryTag) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleImport = async () => {
        if (!importUrl.trim()) return;
        setIsImporting(true);
        setImportError('');
        try {
            const data = await RecipeImportService.importFromUrl(importUrl);
            if (data.name) setName(data.name);
            if (data.ingredients && data.ingredients.length > 0) {
                setIngredients(data.ingredients.map(ing => ({
                    ...ing,
                    id: crypto.randomUUID()
                })));
            }
            if (data.steps && data.steps.length > 0) setSteps(data.steps);
            if (data.sourceUrl) setSourceUrl(data.sourceUrl);
            setImportUrl('');
        } catch (e) {
            setImportError('Failed to import recipe. Please try a different URL or enter manually.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const mealData: Meal = {
            id: initialData?.id || crypto.randomUUID(),
            name,
            complexity,
            type: types,
            isLeftoverFriendly,
            tags,
            steps: steps.filter(s => s.trim()),
            videoUrl: videoUrl.trim() || undefined,
            sourceUrl: sourceUrl.trim() || undefined,
            ingredients: ingredients.filter(i => i.name?.trim()).map(i => ({
                id: i.id || crypto.randomUUID(),
                name: i.name || 'Unknown Ingredient',
                quantity: Number(i.quantity) || 0,
                unit: i.unit || 'pcs',
                category: i.category || 'Custom',
                priceEstimate: i.priceEstimate || 1.0
            }))
        };

        if (initialData) {
            updateMeal(mealData);
        } else {
            addMeal(mealData);
        }

        onClose();
    };

    const dietaryOptions: DietaryTag[] = ['vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo', 'pescatarian'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-xl shadow-xl border border-border flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">{initialData ? t('modals.createMeal.editTitle') : t('modals.createMeal.title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Import Section */}
                    {!initialData && (
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Globe className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Auto-Import from Website</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 bg-card px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="Paste recipe URL (e.g., BBC Good Food...)"
                                    value={importUrl}
                                    onChange={e => setImportUrl(e.target.value)}
                                />
                                <button
                                    type="button"
                                    disabled={isImporting || !importUrl.trim()}
                                    onClick={handleImport}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                                </button>
                            </div>
                            {importError && <p className="text-[10px] text-destructive font-medium">{importError}</p>}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('modals.createMeal.nameLabel')}</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-secondary px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary outline-none"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={t('modals.createMeal.namePlaceholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('modals.createMeal.complexityLabel')}</label>
                                <select
                                    className="w-full bg-secondary px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary outline-none"
                                    value={complexity}
                                    onChange={e => setComplexity(e.target.value as MealComplexity)}
                                >
                                    <option value="simple">{t('modals.createMeal.simple')}</option>
                                    <option value="complex">{t('modals.createMeal.complex')}</option>
                                </select>
                            </div>
                        </div>

                        {/* External Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('modals.createMeal.videoUrl', 'YouTube URL')}</label>
                                <input
                                    type="url"
                                    className="w-full bg-secondary px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
                                    value={videoUrl}
                                    onChange={e => setVideoUrl(e.target.value)}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('modals.createMeal.sourceUrl', 'Recipe Source URL')}</label>
                                <input
                                    type="url"
                                    className="w-full bg-secondary px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
                                    value={sourceUrl}
                                    onChange={e => setSourceUrl(e.target.value)}
                                    placeholder="https://recipe-blog.com/..."
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex flex-wrap gap-4 p-4 bg-secondary/20 rounded-lg">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isLeftoverFriendly}
                                    onChange={e => setIsLeftoverFriendly(e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm">{t('modals.createMeal.leftoverFriendly')}</span>
                            </label>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('modals.createMeal.tagsLabel')}</label>
                            <div className="flex flex-wrap gap-2">
                                {dietaryOptions.map(tag => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${tags.includes(tag)
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-secondary border-border'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">{t('modals.createMeal.ingredientsLabel')}</label>
                                <button type="button" onClick={handleAddIngredient} className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> {t('modals.createMeal.addItem')}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {ingredients.map((ing, idx) => (
                                    <div key={ing.id} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="flex-1 bg-secondary px-3 py-2 rounded-md border border-border text-sm"
                                            placeholder={t('modals.createMeal.ingredientNamePlaceholder')}
                                            value={ing.name}
                                            onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            className="w-20 bg-secondary px-3 py-2 rounded-md border border-border text-sm"
                                            placeholder={t('modals.createMeal.qtyPlaceholder')}
                                            value={ing.quantity}
                                            min="0"
                                            onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="w-24 bg-secondary px-3 py-2 rounded-md border border-border text-sm"
                                            placeholder={t('modals.createMeal.unitPlaceholder')}
                                            value={ing.unit}
                                            onChange={e => handleIngredientChange(idx, 'unit', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveIngredient(idx)}
                                            className="p-2 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recipe Steps */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">{t('modals.createMeal.stepsLabel', 'Preparation Steps')}</label>
                                <button type="button" onClick={handleAddStep} className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> {t('modals.createMeal.addStep', 'Add Step')}
                                </button>
                            </div>
                            <div className="space-y-3">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-3 items-start group">
                                        <span className="mt-2 text-xs font-black text-muted-foreground/40 w-4">{idx + 1}.</span>
                                        <textarea
                                            rows={2}
                                            className="flex-1 bg-secondary px-3 py-2 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                                            placeholder={t('modals.createMeal.stepPlaceholder', 'e.g., Boil water with salt...')}
                                            value={step}
                                            onChange={e => handleStepChange(idx, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStep(idx)}
                                            className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {steps.length === 0 && (
                                    <p className="text-xs text-muted-foreground/60 italic px-7">No steps added yet. Plan how to cook this meal!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-4 border-t border-border bg-secondary/20 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                        {t('common.cancel')}
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        {t('common.save')}
                    </button>
                </div>
            </div >
        </div >
    );
};
