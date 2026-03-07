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
import { Calendar as CalendarIcon, ArrowDown, List, LayoutGrid, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type ViewType = 'list' | 'week' | 'month';

export const Scheduler: React.FC = () => {
    const { getDayPlan } = useMealStore();
    const { t, i18n } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const todayRef = useRef<HTMLDivElement>(null);

    // State
    const [viewType, setViewType] = useState<ViewType>('list');
    const [anchorDate, setAnchorDate] = useState(new Date());

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
                            "relative p-5 md:p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                            isTodayDate
                                ? "bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl ring-1 ring-primary/20"
                                : "bg-card/40 backdrop-blur-sm border-border hover:bg-card/60",
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

    const renderWeekView = () => (
        <div className="flex flex-col h-full gap-6">
            <div className="grid grid-cols-7 gap-4">
                {weekDays.map(date => (
                    <div key={date.toString()} className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                            {format(date, 'EEEE', { locale })}
                        </span>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 flex-1">
                {weekDays.map((date) => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayPlan = getDayPlan(dateKey);
                    const isTodayDate = isToday(date);

                    return (
                        <div key={dateKey} className={clsx(
                            "flex flex-col gap-4 p-5 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden",
                            isTodayDate
                                ? "bg-card/80 backdrop-blur-md border-primary/40 shadow-2xl ring-1 ring-primary/20"
                                : "bg-card/40 backdrop-blur-sm border-border hover:bg-card/60 hover:border-primary/20"
                        )}>
                            <div className="flex justify-between items-center relative z-10">
                                <span className={clsx(
                                    "w-10 h-10 flex items-center justify-center rounded-2xl font-black text-lg transition-all",
                                    isTodayDate ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "text-foreground group-hover:text-primary group-hover:bg-primary/5"
                                )}>
                                    {format(date, 'd')}
                                </span>
                                {isTodayDate && (
                                    <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                                        Today
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col gap-4 relative z-10">
                                <div className="space-y-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{t('scheduler.lunch')}</span>
                                    <MealSlot dayDate={dateKey} type="lunch" data={dayPlan.lunch} />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{t('scheduler.dinner')}</span>
                                    <MealSlot dayDate={dateKey} type="dinner" data={dayPlan.dinner} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderMonthView = () => {
        const weekDayNames = eachDayOfInterval({
            start: startOfWeek(new Date(), { weekStartsOn: 1 }),
            end: endOfWeek(new Date(), { weekStartsOn: 1 })
        }).map(d => format(d, 'eee', { locale }));

        return (
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-7 gap-3">
                    {weekDayNames.map(name => (
                        <div key={name} className="text-center font-black text-muted-foreground/40 text-[9px] uppercase tracking-[0.3em] py-2">
                            {name}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 pb-10">
                    {monthDays.map((date) => {
                        const dateKey = format(date, 'yyyy-MM-dd');
                        const dayPlan = getDayPlan(dateKey);
                        const isTodayDate = isToday(date);
                        const isCurrentMonth = isSameMonth(date, anchorDate);

                        return (
                            <div key={dateKey} className={clsx(
                                "min-h-[160px] p-3 rounded-2xl border transition-all duration-300 flex flex-col gap-2 group relative overflow-hidden",
                                isTodayDate
                                    ? "bg-primary/5 border-primary/30 shadow-xl ring-1 ring-primary/20 z-10"
                                    : "bg-card/40 border-border hover:bg-card/60 hover:border-primary/20",
                                !isCurrentMonth && "opacity-20 grayscale scale-[0.98]"
                            )}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={clsx(
                                        "text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                                        isTodayDate ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/60 group-hover:text-primary group-hover:bg-primary/5"
                                    )}>
                                        {format(date, 'd')}
                                    </span>
                                    {!isCurrentMonth && (
                                        <span className="text-[8px] font-bold text-muted-foreground/30 uppercase">{format(date, 'MMM', { locale })}</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2 overflow-hidden relative z-10 shrink-0">
                                    <MealSlot dayDate={dateKey} type="lunch" data={dayPlan.lunch} />
                                    <MealSlot dayDate={dateKey} type="dinner" data={dayPlan.dinner} />
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
