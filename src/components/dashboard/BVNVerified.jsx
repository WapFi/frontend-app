import VerifiedIcon from "../../assets/verified icon.svg";
import UnverifiedIcon from "../../assets/unverified icon.svg";
import { useTranslation } from "react-i18next";

function BVNVerified() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col py-4 px-[18px] gap-2 md:gap-4 justify-center items-start self-strech rounded-xl bg-[#fafafa]">
      <p className="font-medium text-[#222]">{t("creditScore.tier1Message")}</p>
      <div className="flex justify-between self-stretch items-center">
        <p className="text-[14px] text-[#888] md:text-[18px]">
          {t("creditScore.bvnVerification")}
        </p>
        <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5]">
          <img src={VerifiedIcon} alt="verified icon" />
          <p className="text-[14px] text-[#16A34A] bg-[#F2FDF5]">
            {t("creditScore.completed")}
          </p>
        </div>
      </div>
      <div className="flex justify-between self-stretch items-center">
        <p className="text-[14px] text-[#888] md:text-[18px]">
          {t("creditScore.ninVerification")}
        </p>
        <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]">
          <img src={UnverifiedIcon} alt="unverified icon" />
          <p className="text-[14px] text-[#EF4444] bg-[rgba(239,68,68,0.15)]">
            {t("creditScore.unverified")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BVNVerified;
