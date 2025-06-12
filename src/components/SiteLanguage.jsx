import WapfiLogo from "./WapfiLogo";
import UKFlag from "../assets/UK Flag.svg";
import NigerianFlag from "../assets/Nigerian Flag.svg";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

function SiteLanguage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleChange = (e) => {
    console.log(e.target.value);
    setLanguage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (language !== "") {
      navigate("/sign-in");
    }
  };

  return (
    <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:mt-6">
      <WapfiLogo />
      <div className="h-[50%] flex justify-center items-center">
        <form className="w-[562px] bg-white px-7 py-10 rounded-[8.89px] gap-8" onSubmit={handleSubmit}>
          <p className="text-center font-bold text-[28px]">
            Choose your language
          </p>
          <div>
            <label>
              <div
                className={`flex justify-between p-2 rounded-2xl my-3.5 border ${
                  language === "english"
                    ? "border-[#439182]"
                    : "border-[#999999]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img src={UKFlag} alt="Flag of the UK" />
                  <span className="text-[14px] md:text-[16px]">English</span>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="english"
                  checked={language === "english"}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              <div
                className={`flex justify-between p-2 rounded-2xl my-3.5 border ${
                  language === "hausa" ? "border-[#439182]" : "border-[#999999]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img src={NigerianFlag} alt="Flag of Nigeria" />
                  <span className="text-[14px] md:text-[16px]">Hausa</span>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="hausa"
                  checked={language === "hausa"}
                  onChange={handleChange}
                />
              </div>
            </label>
          </div>

          <button
            disabled={language === ""}
            type="submit"
            className={`text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 ${
              language === ""
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default SiteLanguage;
