import logo from "../assets/wapfi-logo.svg";

function WapfiLogo({ className = "" }) {
  return (
    <header>
      <img
        src={logo}
        alt="Wapfi Logo"
        className={`w-[124px] h-[46.959px] shrink-0 block my-7 md:inline md:w-[220px] md:h-[64px] ${className}`}
      />
    </header>
  );
}

export default WapfiLogo;
