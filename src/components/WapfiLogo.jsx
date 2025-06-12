import logo from "../assets/wapfi-logo.svg";

function WapfiLogo({ className = "" }) {
  return (
    <header>
      <img
        src={logo}
        alt="Wapfi Logo"
        className={`w-[124px] h-[46.959px] shrink-0 block -mx-3 mt-3.5 mb-5 md:mt-0 md:inline md:w-[169px] md:h-[64px] ${className}`}
      />
    </header>
  );
}

export default WapfiLogo;
