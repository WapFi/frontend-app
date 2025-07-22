
function ToggleSwitch({ enabled, onToggle }) {

  // The 'thumb' or circle within the track
  const thumbX = enabled ? "28.6388" : "11.3612"; // X values to move the circle
  const trackFill = enabled ? "#333" : "rgba(51,51,51,0.43)"; // Colors for when on and off
  const thumbFill = enabled ? "#FFFFFF" : "#FFFFFF"; // White thumb regardless of state (or different colors)

  return (
    <button
      onClick={onToggle}
      className="focus:outline-none" // Remove default button outline on focus
      aria-checked={enabled} // Accessibility attribute
      role="switch" // Accessibility role
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="23"
        viewBox="0 0 40 23"
        fill="none"
      >
        {/* The main track of the switch */}
        <path
          d="M0 11.5C0.00132317 8.45159 1.19781 5.52832 3.32672 3.37214C5.45563 1.21595 8.34291 0.00312857 11.3545 0H28.6388C31.652 0 34.5417 1.2116 36.6724 3.36827C38.803 5.52494 40 8.45001 40 11.5C40 14.55 38.803 17.4751 36.6724 19.6317C34.5417 21.7884 31.652 23 28.6388 23H11.3629C8.35124 22.9987 5.46326 21.7876 3.3331 19.6326C1.20294 17.4777 0.00475741 14.5552 0.0016666 11.5067L0 11.5Z"
          fill={trackFill} // Dynamic fill based on state
          fillOpacity="1" // Ensure full opacity for the track
        />

        {/* The circular 'thumb' that moves */}
        <circle
          cx={thumbX} // Dynamic X position for the thumb
          cy="11.5" // Y position (center of height)
          r="7.6" // Radius of the circle (adjust as needed for your SVG)
          fill={thumbFill} // Dynamic fill for the thumb
        />
      </svg>
    </button>
  );
}

export default ToggleSwitch;