import React, { useState } from 'react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onChangeRange: (range: DateRange) => void;
  activeDates: Set<string>; // 'YYYY-MM-DD'
}

export const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose, dateRange, onChangeRange, activeDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Get today's date for highlighting
  const today = new Date();

  if (!isOpen) return null;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Logic: 
    // 1. If no start, set start.
    // 2. If start exists but no end:
    //    a. If clicked < start, set as new start.
    //    b. If clicked >= start, set as end.
    // 3. If both exist, reset and set as new start.

    let newRange: DateRange = { ...dateRange };

    if (!dateRange.start || (dateRange.start && dateRange.end)) {
        newRange = { start: clickedDate, end: null };
    } else if (dateRange.start && !dateRange.end) {
        if (clickedDate < dateRange.start) {
            newRange = { start: clickedDate, end: null };
        } else {
            newRange = { ...dateRange, end: clickedDate };
        }
    }

    onChangeRange(newRange);
  };

  const handleClear = () => {
    onChangeRange({ start: null, end: null });
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const hasNote = activeDates.has(dateStr);
      const isTodayDate = isSameDay(date, today);
      
      // Range status
      const isStart = dateRange.start && isSameDay(date, dateRange.start);
      const isEnd = dateRange.end && isSameDay(date, dateRange.end);
      const isInRange = dateRange.start && dateRange.end && date > dateRange.start && date < dateRange.end;

      let buttonClass = `h-9 w-9 flex items-center justify-center font-mono text-xs transition-all relative z-10 rounded-sm `;
      
      if (isStart || isEnd) {
          buttonClass += `bg-ink text-white font-bold shadow-[2px_2px_0px_0px_rgba(26,26,26,0.3)] `;
      } else if (isInRange) {
          buttonClass += `bg-ink/10 text-ink font-bold `;
      } else {
          // Default
          buttonClass += `text-ink hover:bg-ink/5 `;
          
          if (hasNote) {
              buttonClass += `font-bold underline decoration-2 decoration-accent/50 `;
          }
          
          // Today Highlight
          if (isTodayDate) {
              buttonClass += `border-2 border-dashed border-ink `;
          }
      }

      days.push(
        <div key={day} className="relative p-0.5">
            {/* Visual connector for range */}
            {(isInRange || isStart) && dateRange.end && !isEnd && (
                <div className="absolute top-1/2 right-0 w-1/2 h-1 bg-ink/10 -translate-y-1/2 z-0"></div>
            )}
            {(isInRange || isEnd) && dateRange.start && !isStart && (
                <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-ink/10 -translate-y-1/2 z-0"></div>
            )}
            
            <button
                onClick={() => handleDateClick(day)}
                className={buttonClass}
            >
                {day}
            </button>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm" onClick={onClose}>
        <div 
            className="bg-paper border-2 border-ink shadow-retro p-6 w-full max-w-sm paper-texture animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4 px-1 border-b-2 border-ink pb-2">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-ink/5 text-ink font-mono font-bold text-sm">
                &lt;
                </button>
                <div className="text-center">
                    <span className="block font-mono font-bold text-base text-ink">
                    {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                    </span>
                </div>
                <button onClick={handleNextMonth} className="p-1 hover:bg-ink/5 text-ink font-mono font-bold text-sm">
                &gt;
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="font-mono text-[10px] font-bold text-ink/40">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0 place-items-center mb-4">
                {renderCalendarDays()}
            </div>

            <div className="text-center min-h-[1.5em] mb-4">
                <span className="font-mono text-xs text-ink/60">
                    {dateRange.start ? dateRange.start.toLocaleDateString() : 'Select Start Date'}
                    {dateRange.start && ' → '}
                    {dateRange.end ? dateRange.end.toLocaleDateString() : (dateRange.start ? 'Select End Date' : '')}
                </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t-2 border-ink/10">
                <button 
                    onClick={handleClear} 
                    className="text-xs font-mono text-ink/60 hover:text-accent uppercase font-bold py-2"
                >
                    Clear Filter
                </button>
                <button 
                    onClick={onClose} 
                    className="bg-ink text-white px-4 py-1 text-xs font-mono uppercase font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                    Done
                </button>
            </div>
        </div>
    </div>
  );
};