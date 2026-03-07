import React, { Suspense } from 'react';
import { useMealStore } from '../store/useMealStore';
import { X, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModalContent: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useMealStore();
    const { t, i18n } = useTranslation();

    if (!isOpen) return null;

    if (!settings) {
        return null; // Safety check
    }

    const currentLang = i18n?.language || 'en';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('modals.settings.title', 'Settings')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
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

                    {/* Language Setting */}
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
