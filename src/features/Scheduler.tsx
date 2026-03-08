import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useMealStore } from '../store/useMealStore';
import { MealSlot } from '../components/MealSlot';
import {
    format,
    eachDayOfInterval,
    addWeeks,
    subWeeks,
    isToday,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    addMonths,
    subMonths,
    isSameMonth
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowDown, List, LayoutGrid, CalendarDays, ChevronLeft, ChevronRight, Wand2, X } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type ViewType = 'list' | 'week' | 'month';

export const Scheduler: React.FC = () => {
    const { getDayPlan, autoPopulateWeek, meals } = useMealStore();
    const { t, i18n } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const todayRef = useRef<HTMLDivElement>(null);

    // State
    const [viewType, setViewType] = useState<ViewType>('list');
    const [anchorDate, setAnchorDate] = useState(new Date());
    const [showAutoPlan, setShowAutoPlan] = useState(false);
    const [autoPlanFilter, setAutoPlanFilter] = useState('all');
    const [autoPlanOverwrite, setAutoPlanOverwrite] = useState(false);

    // Select locale based on i18n language
    const currentLang = i18n.language || 'en';
    const locale = currentLang.startsWith('es') ? es : enUS;

    // View-specific date generation
    const listDays = useMemo(() => {
        const start = startOfWeek(subWeeks(new Date(), 4), { weekStartsOn: 1 });
        const end = addWeeks(start, 20);
        return eachDayOfInterval({ start, end });
    }, []);

    const weekDays = useMemo(() => {
        const start = startOfWeek(anchorDate, { weekStartsOn: 1 });
        const end = endOfWeek(anchorDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [anchorDate]);

    const monthDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [anchorDate]);

    // Effects
    useEffect(() => {
        if (viewType === 'list' && todayRef.current && scrollContainerRef.current) {
            todayRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    }, [viewType]);

    // Handlers
    const handlePrev = () => {
        if (viewType === 'month') setAnchorDate(subMonths(anchorDate, 1));
        else if (viewType === 'week') setAnchorDate(subWeeks(anchorDate, 1));
    };

    const handleNext = () => {
        if (viewType === 'month') setAnchorDate(addMonths(anchorDate, 1));
        else if (viewType === 'week') setAnchorDate(addWeeks(anchorDate, 1));
    };

    const scrollToToday = () => {
        if (viewType === 'list') {
            todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            setAnchorDate(new Date());
        }
    };

    const handleAutoPlan = () => {
        let startDate = anchorDate;
        if (viewType === 'list') {
            startDate = new Date(); // Start from today in list view
        } else if (viewType === 'week') {
            startDate = startOfWeek(anchorDate, { weekStartsOn: 1 });
        } else if (viewType === 'month') {
            startDate = startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 });
        }
        
        let daysToPlan = 7;
        if (viewType === 'month') {
            daysToPlan = 35; // Rough estimate for a month grid
        }

        autoPopulateWeek(format(startDate, 'yyyy-MM-dd'), daysToPlan, autoPlanFilter, !autoPlanOverwrite);
        setShowAutoPlan(false);
    };

    // Render Helpers
    const renderListView = () => (
        <div className="max-w-4xl mx-auto space-y-12">
            {listDays.map((date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayPlan = getDayPlan(dateKey);
                const isTodayDate = isToday(date);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                return (
                    <div
                        key={dateKey}
                        ref={isTodayDate ? todayRef : null}
                        className={clsx(
                            "grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-6 items-start transition-all duration-700 group",
                            isTodayDate ? "opacity-100" : "opacity-80 hover:opacity-100"
                        )}
                    >
                        <div className="md:sticky md:top-24 flex md:flex-col items-center md:items-end gap-2 md:gap-0 z-10">
                            <span className={clsx(
                                "text-[10px] md:text-xs font-black uppercase tracking-[0.2em]",
                                isTodayDate ? "text-primary" : "text-muted-foreground/60"
                            )}>
                                {format(date, 'EEEE', { locale })}
                            </span>
                            <div className="flex items-center gap-2 md:mt-1">
                                <span className={clsx(
                                    "text-2xl md:text-4xl font-black tabular-nums",
                                    isTodayDate ? "text-primary shadow-primary/20" : "text-foreground"
                                )}>
                                    {format(date, 'd')}
                                </span>
                                <span className="text-xs font-bold text-muted-foreground/40 uppercase">
                                    {format(date, 'MMM', { locale })}
                                </span>
                            </div>
                            {isTodayDate && (
                                <div className="md:mt-2 px-2 py-0.5 bg-primary text-primary-foreground text-[8px] font-black uppercase rounded-sm">
                                    Today
                                </div>
                            )}
                        </div>

                        <div className={clsx(
                            "relative p-5 md:p-8 rounded-[3rem] border transition-all duration-500 overflow-hidden",
                            isTodayDate
                                ? "bg-card/90 backdrop-blur-2xl border-primary/40 shadow-2xl ring-2 ring-primary/20"
                                : "glass-premium border-white/5 hover:border-primary/20",
                            isWeekend && !isTodayDate && "bg-secondary/10"
                        )}>
                            <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                                <div className="flex-1 space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('scheduler.lunch')}</span>
                                    <MealSlot dayDate={dateKey} type="lunch" data={dayPlan.lunch} />
                                </div>
                                <div className="hidden lg:block w-px bg-border/50 self-stretch my-4" />
                                <div className="flex-1 space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('scheduler.dinner')}</span>
                                    <MealSlot dayDate={dateKey} type="dinner" data={dayPlan.dinner} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderWeekView = () => {
        const weekDayNames = eachDayOfInterval({
            start: weekDays[0],
            end: weekDays[6]
        }).map(d => format(d, 'EEEE', { locale }));

        return (
            <div className="flex flex-col h-full gap-2">
                {/* Unified Week Header Row */}
                <div className="grid grid-cols-7 gap-4 px-4 min-w-[1200px]">
                    {weekDayNames.map(name => (
                        <div key={name} className="text-center font-black text-primary/40 text-[10px] uppercase tracking-[0.4em] py-4">
                            {name}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-4 px-4 h-full min-w-[1200px] flex-1">
                    {weekDays.map((date) => {
                        const dateKey = format(date, 'yyyy-MM-dd');
                        const dayPlan = getDayPlan(dateKey);
                        const isTodayDate = isToday(date);

                        return (
                            <div key={dateKey} className={clsx(
                                "flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden",
                                isTodayDate 
                                    ? "bg-primary/5 border-primary/50 ring-2 ring-primary/20 shadow-2xl scale-[1.02] z-10" 
                                    : "bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 hover:border-primary/20"
                            )}>
                                {/* Simplified Day Number */}
                                <div className={clsx(
                                    "p-3 border-b border-border/20 text-center",
                                    isTodayDate ? "bg-primary/10" : "bg-black/5"
                                )}>
                                    <span className={clsx(
                                        "text-xl font-black",
                                        isTodayDate ? "text-primary text-glow" : "text-foreground/40"
                                    )}>
                                        {format(date, 'd')}
                                    </span>
                                </div>

                                {/* Slots with explicit L/D labels for better clarity */}
                                <div className="flex-1 p-3 flex flex-col gap-8 overflow-y-auto scroll-hide">
                                    <div className="space-y-2">
                                        <MealSlot dayDate={dateKey} type="lunch" data={dayPlan.lunch} />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <MealSlot dayDate={dateKey} type="dinner" data={dayPlan.dinner} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const weekDayNames = eachDayOfInterval({
            start: startOfWeek(new Date(), { weekStartsOn: 1 }),
            end: endOfWeek(new Date(), { weekStartsOn: 1 })
        }).map(d => format(d, 'eee', { locale }));

        return (
            <div className="flex flex-col gap-2 h-full">
                <div className="grid grid-cols-7 gap-2 px-2">
                    {weekDayNames.map(name => (
                        <div key={name} className="text-center font-black text-muted-foreground/30 text-[10px] uppercase tracking-[0.3em] py-2">
                            {name}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 flex-1 pb-10">
                    {monthDays.map((date) => {
                        const dateKey = format(date, 'yyyy-MM-dd');
                        const dayPlan = getDayPlan(dateKey);
                        const isTodayDate = isToday(date);
                        const isCurrentMonth = isSameMonth(date, anchorDate);

                        const lunchMeal = dayPlan.lunch.type === 'meal' ? meals.find(m => m.id === dayPlan.lunch.mealId) : null;
                        const dinnerMeal = dayPlan.dinner.type === 'meal' ? meals.find(m => m.id === dayPlan.dinner.mealId) : null;

                        return (
                            <div key={dateKey} className={clsx(
                                "min-h-[140px] p-2 rounded-xl border transition-all duration-300 flex flex-col gap-1 group relative overflow-hidden",
                                isTodayDate
                                    ? "bg-primary/5 border-primary/40 shadow-xl ring-1 ring-primary/20 z-10"
                                    : "bg-card/40 border-border/50 hover:bg-card/60 hover:border-primary/20",
                                !isCurrentMonth && "opacity-10 grayscale"
                            )}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={clsx(
                                        "text-xs font-black w-6 h-6 flex items-center justify-center rounded-lg transition-all",
                                        isTodayDate ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/40"
                                    )}>
                                        {format(date, 'd')}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                    {/* Unified high-contrast labels for Month view */}
                                    {dayPlan.lunch.type && (
                                        <div className={clsx(
                                            "px-1.5 py-1 rounded text-[9px] font-bold truncate border flex items-center gap-1.5",
                                            dayPlan.lunch.type === 'meal' ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30" : "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30 shadow-sm"
                                        )}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)] shrink-0" />
                                            <span className="opacity-70 text-[7px] font-black uppercase">L</span>
                                            {lunchMeal?.name || (dayPlan.lunch.type === 'leftovers' ? t('scheduler.leftovers') : '')}
                                        </div>
                                    )}
                                    {dayPlan.dinner.type && (
                                        <div className={clsx(
                                            "px-1.5 py-1 rounded text-[9px] font-bold truncate border flex items-center gap-1.5",
                                            dayPlan.dinner.type === 'meal' ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30" : "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30 shadow-sm"
                                        )}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)] shrink-0" />
                                            <span className="opacity-70 text-[7px] font-black uppercase">D</span>
                                            {dinnerMeal?.name || (dayPlan.dinner.type === 'leftovers' ? t('scheduler.leftovers') : '')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background/30 backdrop-blur-3xl relative">
            {/* Contextual Header */}
            <div className="flex items-center justify-between p-6 bg-card/60 backdrop-blur-xl border-b border-border shadow-sm z-30 sticky top-0">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black capitalize text-foreground tracking-tighter drop-shadow-sm flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-primary" />
                            {format(anchorDate, 'MMMM yyyy', { locale })}
                        </h2>
                    </div>

                    {/* Navigation Contols (Visible for logic-based views) */}
                    {viewType !== 'list' && (
                        <div className="flex gap-1 bg-secondary/30 backdrop-blur-md rounded-full p-1 border border-border">
                            <button onClick={handlePrev} className="p-1 px-2 hover:bg-background rounded-full transition-all">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={handleNext} className="p-1 px-2 hover:bg-background rounded-full transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* View Switcher */}
                    <div className="flex p-1 bg-secondary/40 backdrop-blur-md rounded-xl border border-border/50">
                        <button
                            onClick={() => setViewType('list')}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                viewType === 'list' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('scheduler.view.list')}</span>
                        </button>
                        <button
                            onClick={() => setViewType('week')}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                viewType === 'week' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('scheduler.view.week')}</span>
                        </button>
                        <button
                            onClick={() => setViewType('month')}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                viewType === 'month' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <CalendarDays className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('scheduler.view.month')}</span>
                        </button>
                    </div>

                    <div className="h-6 w-px bg-border/50" />

                    <div className="relative">
                        <button
                            onClick={() => setShowAutoPlan(!showAutoPlan)}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                showAutoPlan ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:bg-secondary border-border"
                            )}
                        >
                            <Wand2 className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('scheduler.autoPlan', 'Auto-Plan')}</span>
                        </button>

                        {showAutoPlan && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl border border-border shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm tracking-tight">{t('scheduler.autoPlanSettings', 'Auto-Plan Settings')}</h3>
                                    <button onClick={() => setShowAutoPlan(false)} className="p-1 hover:bg-secondary rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">{t('scheduler.dietaryFilter', 'Dietary Filter')}</label>
                                        <select 
                                            value={autoPlanFilter}
                                            onChange={(e) => setAutoPlanFilter(e.target.value)}
                                            className="w-full bg-secondary px-3 py-2 rounded-lg text-sm outline-none border border-border focus:border-primary transition-colors cursor-pointer appearance-none"
                                        >
                                            <option value="all">{t('sidebar.filters.all', 'All')}</option>
                                            <option value="vegetarian">{t('sidebar.filters.vegetarian', 'Vegetarian')}</option>
                                            <option value="vegan">{t('sidebar.filters.vegan', 'Vegan')}</option>
                                            <option value="gluten-free">{t('sidebar.filters.glutenFree', 'Gluten-Free')}</option>
                                            <option value="keto">{t('sidebar.filters.keto', 'Keto')}</option>
                                            <option value="paleo">{t('sidebar.filters.paleo', 'Paleo')}</option>
                                            <option value="pescatarian">{t('sidebar.filters.pescatarian', 'Pescatarian')}</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary/50 rounded-lg transition-colors border border-transparent hover:border-border/50">
                                        <input 
                                            type="checkbox" 
                                            checked={autoPlanOverwrite}
                                            onChange={(e) => setAutoPlanOverwrite(e.target.checked)}
                                            className="w-4 h-4 rounded text-primary border-border focus:ring-primary focus:ring-offset-background bg-secondary"
                                        />
                                        <span className="text-xs font-medium">{t('scheduler.overwriteExisting', 'Overwrite existing meals')}</span>
                                    </label>
                                    <button 
                                        onClick={handleAutoPlan}
                                        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm"
                                    >
                                        {t('scheduler.generatePlan', 'Generate Plan')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-border/50" />

                    <button
                        onClick={scrollToToday}
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-primary/20 flex items-center gap-2"
                    >
                        {t('common.today')}
                        <ArrowDown className={clsx("w-3 h-3 animate-bounce", viewType !== 'list' && "rotate-180 animate-none")} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth scroll-hide bg-gradient-to-b from-transparent via-primary/5 to-transparent"
            >
                {viewType === 'list' && renderListView()}
                {viewType === 'week' && renderWeekView()}
                {viewType === 'month' && renderMonthView()}

                <div className="h-32" />
            </div>

            {/* List Scroll Indicator */}
            {viewType === 'list' && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-none opacity-20">
                    <ArrowDown className="w-6 h-6 text-primary" />
                </div>
            )}
        </div>
    );
};
