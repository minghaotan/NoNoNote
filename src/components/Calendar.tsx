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
  activeDates: Set<string>;
}

export const Calendar: React.FC<CalendarProps> = ({
  isOpen,
  onClose,
  dateRange,
  onChangeRange,
  activeDates,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

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

  const getCalendarDayClass = (
    isStart: boolean,
    isEnd: boolean,
    isInRange: boolean,
    hasNote: boolean,
    isTodayDate: boolean
  ) => {
    let className = 'calendar-day ';

    if (isStart || isEnd) {
      className += 'calendar-day-selected';
    } else if (isInRange) {
      className += 'calendar-day-in-range';
    } else {
      className += 'calendar-day-default';

      if (hasNote) {
        className += ' calendar-day-has-note';
      }

      if (isTodayDate) {
        className += ' calendar-day-today';
      }
    }

    return className;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const hasNote = activeDates.has(dateStr);
      const isTodayDate = isSameDay(date, today);

      const isStart = dateRange.start ? isSameDay(date, dateRange.start) : false;
      const isEnd = dateRange.end ? isSameDay(date, dateRange.end) : false;
      const isInRange = !!(
        dateRange.start &&
        dateRange.end &&
        date > dateRange.start &&
        date < dateRange.end
      );

      const buttonClass = getCalendarDayClass(isStart, isEnd, isInRange, hasNote, isTodayDate);

      days.push(
        <div key={day} className="relative p-0.5">
          {(isInRange || isStart) && dateRange.end && !isEnd && (
            <div className="calendar-range-connector right-0"></div>
          )}
          {(isInRange || isEnd) && dateRange.start && !isStart && (
            <div className="calendar-range-connector left-0"></div>
          )}

          <button onClick={() => handleDateClick(day)} className={buttonClass}>
            {day}
          </button>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="modal-backdrop z-40" onClick={onClose}>
      <div
        className="modal-container animate-zoom-in p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 px-1 section-border">
          <button onClick={handlePrevMonth} className="calendar-nav-btn">
            &lt;
          </button>
          <div className="text-center">
            <span className="block font-mono font-bold text-base text-ink">
              {currentMonth
                .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                .toUpperCase()}
            </span>
          </div>
          <button onClick={handleNextMonth} className="calendar-nav-btn">
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
            <div key={`${d}-${index}`} className="font-mono text-[10px] font-bold text-ink/40">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 place-items-center mb-4">{renderCalendarDays()}</div>

        <div className="text-center min-h-[1.5em] mb-4">
          <span className="font-mono text-xs text-ink/60">
            {dateRange.start ? dateRange.start.toLocaleDateString() : 'Select Start Date'}
            {dateRange.start && ' → '}
            {dateRange.end
              ? dateRange.end.toLocaleDateString()
              : dateRange.start
                ? 'Select End Date'
                : ''}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 divider">
          <button onClick={handleClear} className="btn-text text-ink/60 py-2 text-xs">
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
