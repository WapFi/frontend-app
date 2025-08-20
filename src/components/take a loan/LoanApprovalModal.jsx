
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function LoanApprovalModal({ data }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // function to handle navigation and close the modal
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-full py-6 px-10 md:p-10 text-center relative pt-30 md:w-[65%] md:mx-auto lg:pt-40 lg:pb-24">
        <p className="text-[#222] font-semibold text-center text-[18px] py-4 lg:text-[28px]">
          {t("loanApprovalModal.title")}
        </p>
        
        <p className="text-center text-[14px] md:text-[22px] text-[rgba(34,34,34,0.70)]">
          <Trans
            i18nKey="loanApprovalModal.message"
            values={{
              loan_amount: data.loan_amount || "",
              total_plastic_to_repay_kg: data.total_plastic_to_repay_kg || "",
            }}
            components={[<span className="text-[#2D6157] font-semibold" />]}
          />
        </p>

        <button
          onClick={handleGoToDashboard}
          className="w-full cursor-pointer lg:w-[60%] mx-auto rounded-[50px] text-white font-medium bg-[#439182] py-2 px-3 lg:py-3 my-5 hover:opacity-80 transition-opacity duration-300"
        >
          {t("loanApprovalModal.goToDashboard")}
        </button>
      </div>
    </div>
  );
}
