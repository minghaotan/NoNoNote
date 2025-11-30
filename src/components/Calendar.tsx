/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { colors, shadows, transitions, fonts, fontSize, zIndex, mixins } from '../styles';

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

const overlayStyles = css`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.calendar};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(26, 26, 26, 0.2);
  backdrop-filter: blur(4px);
`;

const containerStyles = css`
  background-color: ${colors.paper};
  border: 2px solid ${colors.ink};
  box-shadow: ${shadows.retro};
  padding: 1.5rem;
  width: 100%;
  max-width: 24rem;
  ${mixins.paperTexture}

  @keyframes zoomIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  animation: zoomIn 200ms ease-out;
`;

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.25rem 0.5rem 0.25rem;
  border-bottom: 2px solid ${colors.ink};
`;

const navButtonStyles = css`
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: ${fontSize.base};
  color: ${colors.ink};

  &:hover {
    background-color: rgba(26, 26, 26, 0.05);
  }
`;

const monthTitleStyles = css`
  font-family: ${fonts.mono};
  font-weight: 700;
  font-size: ${fontSize.lg};
  color: ${colors.ink};
  text-align: center;
`;

const weekdaysGridStyles = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  text-align: center;
  margin-bottom: 0.25rem;
`;

const weekdayStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.xs};
  font-weight: 700;
  color: rgba(26, 26, 26, 0.4);
`;

const daysGridStyles = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  place-items: center;
  margin-bottom: 1rem;
`;

const dayContainerStyles = css`
  position: relative;
  padding: 2px;
`;

const dayButtonBase = css`
  height: 2.25rem;
  width: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  transition: ${transitions.fast};
  position: relative;
  z-index: 10;
  border-radius: 2px;
  background: none;
  border: none;
  cursor: pointer;
`;

const dayButtonDefault = css`
  color: ${colors.ink};

  &:hover {
    background-color: rgba(26, 26, 26, 0.05);
  }
`;

const dayButtonHasNote = css`
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: rgba(255, 82, 82, 0.5);
`;

const dayButtonToday = css`
  border: 2px dashed ${colors.ink};
`;

const dayButtonSelected = css`
  background-color: ${colors.ink};
  color: ${colors.white};
  font-weight: 700;
  box-shadow: ${shadows.retroLight};
`;

const dayButtonInRange = css`
  background-color: rgba(26, 26, 26, 0.1);
  color: ${colors.ink};
  font-weight: 700;
`;

const rangeConnectorRight = css`
  position: absolute;
  top: 50%;
  right: 0;
  width: 50%;
  height: 4px;
  background-color: rgba(26, 26, 26, 0.1);
  transform: translateY(-50%);
  z-index: 0;
`;

const rangeConnectorLeft = css`
  position: absolute;
  top: 50%;
  left: 0;
  width: 50%;
  height: 4px;
  background-color: rgba(26, 26, 26, 0.1);
  transform: translateY(-50%);
  z-index: 0;
`;

const rangeInfoStyles = css`
  text-align: center;
  min-height: 1.5em;
  margin-bottom: 1rem;
`;

const rangeTextStyles = css`
  font-family: ${fonts.mono};
  font-size: ${fontSize.sm};
  color: rgba(26, 26, 26, 0.6);
`;

const footerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 2px solid rgba(26, 26, 26, 0.1);
`;

const clearButtonStyles = css`
  font-size: ${fontSize.sm};
  font-family: ${fonts.mono};
  color: rgba(26, 26, 26, 0.6);
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${colors.accent};
  }
`;

const doneButtonStyles = css`
  background-color: ${colors.ink};
  color: ${colors.white};
  padding: 0.25rem 1rem;
  font-size: ${fontSize.sm};
  font-family: ${fonts.mono};
  text-transform: uppercase;
  font-weight: 700;
  box-shadow: ${shadows.retroLight};
  transition: ${transitions.fast};
  border: none;
  cursor: pointer;

  &:hover {
    box-shadow: none;
    transform: translate(1px, 1px);
  }
`;

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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          css={css`
            height: 2.25rem;
            width: 2.25rem;
          `}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const hasNote = activeDates.has(dateStr);
      const isTodayDate = isSameDay(date, today);

      const isStart = dateRange.start && isSameDay(date, dateRange.start);
      const isEnd = dateRange.end && isSameDay(date, dateRange.end);
      const isInRange =
        dateRange.start && dateRange.end && date > dateRange.start && date < dateRange.end;

      const buttonStyles = [dayButtonBase];

      if (isStart || isEnd) {
        buttonStyles.push(dayButtonSelected);
      } else if (isInRange) {
        buttonStyles.push(dayButtonInRange);
      } else {
        buttonStyles.push(dayButtonDefault);
        if (hasNote) {
          buttonStyles.push(dayButtonHasNote);
        }
        if (isTodayDate) {
          buttonStyles.push(dayButtonToday);
        }
      }

      days.push(
        <div key={day} css={dayContainerStyles}>
          {(isInRange || isStart) && dateRange.end && !isEnd && <div css={rangeConnectorRight} />}
          {(isInRange || isEnd) && dateRange.start && !isStart && <div css={rangeConnectorLeft} />}
          <button onClick={() => handleDateClick(day)} css={buttonStyles}>
            {day}
          </button>
        </div>
      );
    }

    return days;
  };

  return (
    <div css={overlayStyles} onClick={onClose}>
      <div css={containerStyles} onClick={(e) => e.stopPropagation()}>
        <div css={headerStyles}>
          <button onClick={handlePrevMonth} css={navButtonStyles}>
            &lt;
          </button>
          <div css={monthTitleStyles}>
            {currentMonth
              .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              .toUpperCase()}
          </div>
          <button onClick={handleNextMonth} css={navButtonStyles}>
            &gt;
          </button>
        </div>

        <div css={weekdaysGridStyles}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`${d}-${i}`} css={weekdayStyles}>
              {d}
            </div>
          ))}
        </div>

        <div css={daysGridStyles}>{renderCalendarDays()}</div>

        <div css={rangeInfoStyles}>
          <span css={rangeTextStyles}>
            {dateRange.start ? dateRange.start.toLocaleDateString() : 'Select Start Date'}
            {dateRange.start && ' → '}
            {dateRange.end
              ? dateRange.end.toLocaleDateString()
              : dateRange.start
                ? 'Select End Date'
                : ''}
          </span>
        </div>

        <div css={footerStyles}>
          <button onClick={handleClear} css={clearButtonStyles}>
            Clear Filter
          </button>
          <button onClick={onClose} css={doneButtonStyles}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
