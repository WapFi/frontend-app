import logo from "../assets/wapfi-logo.svg";

function WapfiLogo({ className = "" }) {
  return (
    <header>
      <img
        src={logo}
        alt="Wapfi Logo"
        className={`w-[124px] h-[46.959px] shrink-0 block bg-contain bg-no-repeat mb-14 mt-14 md:w-[169px] md:h-[64px] lg:ml-2 lg:mt-0 xl:-mt-2.5 ${className}`}
      />
    </header>
  );
}

export default WapfiLogo;
