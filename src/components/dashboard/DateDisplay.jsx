
function DateDisplay() {
  const today = new Date(); 

  const weekdayOptions = { weekday: 'short' };
  const weekday = today.toLocaleDateString('en-US', weekdayOptions); 

  const monthOptions = { month: 'long' };
  const month = today.toLocaleDateString('en-US', monthOptions);

  const day = today.getDate();

  return (
    
      <>{weekday} {day} {month}</>
    
  );
}

export default DateDisplay;