import React, { Suspense, useRef } from 'react';
import { useMealStore } from '../store/useMealStore';
import { usePantryStore } from '../store/usePantryStore';
import { X, Moon, Sun, Download, Upload } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModalContent: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useMealStore();
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    if (!settings) {
        return null; // Safety check
    }

    const currentLang = i18n?.language || 'en';

    const handleExport = () => {
        const backupData = {
            meals: useMealStore.getState().meals,
            planningData: useMealStore.getState().planningData,
            shoppingLists: useMealStore.getState().currentShoppingList ? [useMealStore.getState().currentShoppingList] : [],
            settings: useMealStore.getState().settings,
            pantry: usePantryStore.getState().items,
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-eat-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(t('modals.settings.exportSuccess', 'Data exported successfully'));
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                
                // Basic validation
                if (data && typeof data === 'object') {
                    if (data.meals && Array.isArray(data.meals)) {
                        useMealStore.setState({
                            meals: data.meals,
                            planningData: data.planningData || {},
                            currentShoppingList: data.shoppingLists ? data.shoppingLists[0] : null,
                            settings: data.settings || useMealStore.getState().settings
                        });
                    }
                    if (data.pantry && Array.isArray(data.pantry)) {
                        usePantryStore.setState({ items: data.pantry });
                    }
                    alert(t('modals.settings.importSuccess', 'Data imported successfully'));
                    onClose(); // Optional: close modal on success
                } else {
                    throw new Error("Invalid structure");
                }
            } catch (error) {
                alert(t('modals.settings.importError', 'Invalid backup file'));
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                    <h2 className="text-xl font-bold">{t('modals.settings.title', 'Settings')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Appearance */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Appearance & Locale
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('modals.settings.theme', 'Theme')}</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateSettings({ theme: 'light' })}
                                        className={clsx(
                                            "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors flex items-center justify-center gap-2",
                                            settings.theme === 'light'
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                                        )}
                                    >
                                        <Sun className="w-4 h-4" /> Light
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ theme: 'dark' })}
                                        className={clsx(
                                            "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors flex items-center justify-center gap-2",
                                            settings.theme === 'dark'
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                                        )}
                                    >
                                        <Moon className="w-4 h-4" /> Dark
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('modals.settings.language', 'Language')}</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => i18n.changeLanguage('en')}
                                        className={clsx(
                                            "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                                            currentLang === 'en' || currentLang.startsWith('en')
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                                        )}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => i18n.changeLanguage('es')}
                                        className={clsx(
                                            "flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                                            currentLang === 'es' || currentLang.startsWith('es')
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                                        )}
                                    >
                                        Español
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Preferences
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('modals.settings.frequency', 'Shopping Frequency')}</label>
                            <select
                                value={settings.shoppingFrequencyDays || 7}
                                onChange={(e) => updateSettings({ shoppingFrequencyDays: Number(e.target.value) || 7 })}
                                className="w-full bg-secondary px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="1">1 {t('modals.settings.days', 'day')}</option>
                                <option value="3">3 {t('modals.settings.days', 'days')}</option>
                                <option value="7">7 {t('modals.settings.days', 'days')} (Weekly)</option>
                                <option value="14">14 {t('modals.settings.days', 'days')} (Bi-Weekly)</option>
                            </select>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="space-y-4 border-t border-border pt-6">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {t('modals.settings.dataManagement', 'Data Management')}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors text-sm font-medium border border-transparent shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                {t('modals.settings.exportData', 'Export Data')}
                            </button>
                            
                            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md transition-colors text-sm font-medium cursor-pointer shadow-sm">
                                <Upload className="w-4 h-4" />
                                {t('modals.settings.importData', 'Import Data')}
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Backup all your meals, plans, and pantry lists to move between devices.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export const SettingsModal: React.FC<SettingsModalProps> = (props) => {
    return (
        <Suspense fallback={null}>
            <SettingsModalContent {...props} />
        </Suspense>
    );
};
