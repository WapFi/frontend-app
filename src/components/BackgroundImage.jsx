import bgImage from "../assets/pile-of-trash.svg";
import { useTranslation } from "react-i18next";

function BackgroundImage() {
  const { t } = useTranslation();

  return (
    <div
      className="border hidden bg-cover bg-center rounded-3xl text-[#FFF] lg:flex lg:w-[46%] lg:max-w-[669px] lg:min-w-0 lg:h-[calc(100vh-5rem)] lg:min-h-[680px] lg:max-h-[890px] lg:flex-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="w-[82%] p-6 mx-auto mb-12 self-end rounded-[12px] border border-[rgba(255,255,255,0.66)] bg-[rgba(255,255,255,0.45)] backdrop-blur-[18.25px] xl:w-[75%] xl:py-[54px] xl:px-[30px]"
      >
        <p className="font-raleway font-bold text-xl xl:text-[28px]">
           {t("background.headline")}
        </p>
        <p className="text-base font-heebo font-normal xl:text-[22px]">
          {t("background.subtext")}
        </p>
      </div>
    </div>
  );
}

export default BackgroundImage;