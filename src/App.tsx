import { useState, useEffect } from 'react';
import { Scheduler } from './features/Scheduler';
import { MealSidebar } from './features/MealSidebar';
import { ShoppingListModal } from './features/ShoppingListModal';
import { SettingsModal } from './features/SettingsModal';
import { CreateMealModal } from './features/CreateMealModal';
import { PantryModal } from './features/PantryModal';
import { useMealStore } from './store/useMealStore';
import { Settings, ShoppingBag, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | null;
    meal?: any;
  }>({ type: null });
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const { settings } = useMealStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Prevent default drag behavior
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCreateClick = () => setModalState({ type: 'create' });
  const handleEditClick = (meal: any) => setModalState({ type: 'edit', meal });
  const handleCloseModal = () => setModalState({ type: null });

  return (
    <div className="flex h-screen bg-background/50 text-foreground overflow-hidden" onDragOver={handleDragOver}>
      <MealSidebar
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="relative z-40 h-16 border-b border-border flex items-center justify-between px-6 bg-card/70 backdrop-blur-xl shadow-sm">
          <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            {t('app.title')}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPantryOpen(true)}
              className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title={t('pantry.tooltip')}
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsShoppingListOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('app.generateList')}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <Scheduler />
      </div>

      <ShoppingListModal isOpen={isShoppingListOpen} onClose={() => setIsShoppingListOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <CreateMealModal
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        onClose={handleCloseModal}
        initialData={modalState.type === 'edit' ? modalState.meal : null}
      />
      <PantryModal isOpen={isPantryOpen} onClose={() => setIsPantryOpen(false)} />
    </div>
  );
}

export default App;
