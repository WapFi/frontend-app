
function DateDisplay() {
  const today = new Date(); 

  const weekdayOptions = { weekday: 'short' };
  const weekday = today.toLocaleDateString('en-US', weekdayOptions); 

  const monthOptions = { month: 'short' };
  const month = today.toLocaleDateString('en-US', monthOptions);

  const day = today.getDate();

  return (
    <div>
      <p className="text-[#2D6157] font-semibold">Today, {weekday} {day} {month}</p>
    </div>
  );
}

export default DateDisplay;