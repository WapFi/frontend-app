import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../assets/calendar icon.svg";

const pad = (n) => n.toString().padStart(2, "0");
const getLocalDateString = (date) =>
  date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : "";

function formatDateText(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DateRangeSelector({ onDateChange }) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const handleFromChange = (date) => {
    setFrom(date);
    if (date && to) {
      onDateChange({
        from: getLocalDateString(date),
        to: getLocalDateString(to),
      });
    }
  };

  const handleToChange = (date) => {
    setTo(date);
    if (from && date) {
      onDateChange({
        from: getLocalDateString(from),
        to: getLocalDateString(date),
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
      {/* From Date */}
      <div>
        <p className="text-[#222] text-[14px]">From</p>
        <div className="relative">
          <DatePicker
            selected={from}
            onChange={handleFromChange}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            placeholderText="Select Date"
            className="pl-8 py-2 rounded-[4px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] text-[16px] text-[rgba(34,34,34,0.80)] font-medium cursor-pointer outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            calendarClassName="z-50"
          />
          <img
            src={calendarIcon}
            alt="calendar icon"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          {from && (
            <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-white pr-2 pointer-events-none select-none">
              {formatDateText(from)}
            </span>
          )}
        </div>
      </div>

      {/* To Date */}
      <div>
        <p className="text-[#222] text-[14px]">To</p>
        <div className="relative">
          <DatePicker
            selected={to}
            onChange={handleToChange}
            dateFormat="yyyy-MM-dd"
            minDate={from || undefined}
            maxDate={new Date()}
            placeholderText="Select Date"
            className="pl-8 py-2 rounded-[4px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] text-[16px] text-[rgba(34,34,34,0.80)] font-medium cursor-pointer outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            calendarClassName="z-50"
          />
          <img
            src={calendarIcon}
            alt="calendar icon"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          {to && (
            <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-white pr-2 pointer-events-none select-none">
              {formatDateText(to)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DateRangeSelector;
