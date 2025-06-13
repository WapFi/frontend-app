import bgImage from "../assets/pile-of-trash.svg";
import { useTranslation } from "react-i18next";

function BackgroundImage() {
  const { t } = useTranslation();

  return (
    <div
      className="hidden bg-cover rounded-3xl w-[669px] h-[890px] text-[#FFF] lg:flex"
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