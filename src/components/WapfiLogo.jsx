import logo from "../assets/wapfi-logo.jpg";

function WapfiLogo({ className = "" }) {
  return (
    <header>
      <img
        src={logo}
        alt="Wapfi Logo"
        className={`w-[124px] h-auto shrink-0 block object-contain mb-14 mt-14 md:w-[169px] lg:ml-2 lg:mt-0 xl:-mt-2.5 ${className}`}
      />
    </header>
  );
}

export default WapfiLogo;
