import bgImage from "../assets/pile-of-trash.svg";
import { useTranslation } from "react-i18next";

function BackgroundImage() {
  const { t } = useTranslation();

  return (
    <div
      className="hidden bg-cover rounded-b-3xl md:ml-10 md:w-[42%] md:h-[70%] md:flex md:bg-no-repeat text-[#FFF]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="w-[75%] py-4 px-3 mx-auto rounded-[12px] border border-[rgba(255,255,255,0.66)] 
                bg-[rgba(255,255,255,0.45)] backdrop-blur-[18.25px] md:self-end md: mb-12"
      >
        <p className="font-raleway font-bold text-[28px]">
           {t("background.headline")}
        </p>
        <p className="text-[22px] font-heebo font-normal">
          {t("background.subtext")}
        </p>
      </div>
    </div>
  );
}

export default BackgroundImage;