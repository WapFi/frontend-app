import NigerianFlag from "../../../assets/Nigerian Flag.svg";
import UKFlag from "../../../assets/UK Flag.svg";
import DateDisplay from "../DateDisplay";
import calendarIcon from "../../../assets/calendar icon.svg";
import bellIcon from "../../../assets/bell icon.svg";
import { useLanguage } from "../../../context/LanguageContext";

function HeaderBar() {
  const { language, setLanguage } = useLanguage();

  const fullName = "Pmina Gogo Roy"; // later you can get this from user context
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="border text-[#222] flex justify-between items-center shrink-0 pt-8 px-[28px] w-[1192px] h-[76px]">
      <div className="flex items-center gap-2">
        <img
          src={calendarIcon}
          alt="calendar icon"
          className="w-[18px] h-[17.582px]"
        />
        <DateDisplay />
      </div>
      <div className="flex justify-center items-center gap-6 cursor-pointer">
        <div
          className="flex items-center gap-2.5"
          onClick={() => setLanguage("en")}
        >
          <img src={UKFlag} alt="Flag of the UK" />
          <span
            className={`text-[14px] md:text-[16px]  ${
              language === "en" ? "text-[#2D6157]" : "text-[#222]"
            }`}
          >
            English
          </span>
        </div>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setLanguage("ha")}
        >
          <img src={NigerianFlag} alt="Flag of Nigeria" />
          <span
            className={`text-[14px] md:text-[16px]  ${
              language === "ha" ? "text-[#2D6157]" : "text-[#222]"
            }`}
          >
            Hausa
          </span>
        </div>

        <div className="rounded-full py-2 px-[8px] bg-[#fff] text-white text-center font-medium relative">
          <img src={bellIcon} alt="notification bell" />
          <span className="border-[rgba(229,62,62,0.30)] bg-[rgba(229,62,62,0.08)] absolute -top-1 -right-[3px] text-[#E53E3E] text-[12px] w-5 h-5 p-[1px] gap-[10px] flex items-center justify-center rounded-[6px] font-semibold">
            4
          </span>
        </div>
        <div className="rounded-full py-1 px-[7px] bg-[#171717] text-white text-center font-medium">
          <p>{initials}</p>
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
