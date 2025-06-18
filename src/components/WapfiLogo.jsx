import logo from "../assets/wapfi-logo.svg";

function WapfiLogo({ className = "" }) {
  return (
    <header>
      <img
        src={logo}
        alt="Wapfi Logo"
        className={`ml-2 w-[124px] h-[46.959px] shrink-0 block bg-contain bg-no-repeat mb-14 mt-14 md:ml-[20px] md:w-[169px] md:h-[64px] lg:ml-2 lg:mt-0 xl:-mt-2.5 ${className}`}
        // className={`w-[124px] h-[46.959px] shrink-0 block my-7 md:inline md:w-[169px] md:h-[64px] ${className}`}
      />
    </header>
  );
}

export default WapfiLogo;
