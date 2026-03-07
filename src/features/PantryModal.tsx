import React, { useState } from 'react';
import { usePantryStore } from '../store/usePantryStore';
import { X, Plus, Trash2, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PantryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PantryModal: React.FC<PantryModalProps> = ({ isOpen, onClose }) => {
    const { items, addItem, removeItem } = usePantryStore();
    const { t } = useTranslation();
    const [newItemName, setNewItemName] = useState('');

    if (!isOpen) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        addItem({
            name: newItemName,
            quantity: 1,
            unit: 'pcs'
        });
        setNewItemName('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md max-h-[80vh] rounded-xl shadow-xl border border-border flex flex-col">
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
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input
                            type="text"
                            placeholder={t('pantry.addPlaceholder')}
                            className="flex-1 bg-secondary px-3 py-2 rounded-md border border-border text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {items.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            {t('pantry.empty')}
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg group">
                                <span className="font-medium">{item.name}</span>
                                <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
