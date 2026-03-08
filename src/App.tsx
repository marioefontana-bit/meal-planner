import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Scheduler } from './features/Scheduler';
import { MealSidebar } from './features/MealSidebar';
import { ShoppingListModal } from './features/ShoppingListModal';
import { SettingsModal } from './features/SettingsModal';
import { CreateMealModal } from './features/CreateMealModal';
import { PantryModal } from './features/PantryModal';
import { useMealStore } from './store/useMealStore';
import { Settings, ShoppingBag, Package, Menu, X as CloseIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | null;
    meal?: any;
  }>({ type: null });
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
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
    <div className="flex h-screen bg-background/50 text-foreground overflow-hidden relative" onDragOver={handleDragOver}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 outline-none",
        isSidebarOpen ? "translate-x-0 w-[310px]" : "-translate-x-full w-0"
      )}>
        <MealSidebar
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="relative z-30 h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-card/70 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <CloseIcon className="w-5 h-5 lg:hidden" /> : <Menu className="w-5 h-5" />}
              {!isSidebarOpen && <Menu className="w-5 h-5 hidden lg:block" />}
            </button>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter truncate">
              {t('app.title')}
            </h1>
          </div>
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
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t('app.generateList')}</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <Scheduler onEditMeal={handleEditClick} />
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
