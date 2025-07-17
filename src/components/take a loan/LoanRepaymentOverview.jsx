import BackArrow from "../../assets/back arrow.svg";
import LoanApprovalModal from "./LoanApprovalModal";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoanForm } from "../../context/LoanFormContext";
import { confirmLoanApplication } from "../../api/apiData";
import { useDashboard } from "../../context/DashboardContext";
import { use_UserData } from "../../context/UserContext";

export default function LoanRepaymentOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { loanFormData, updateLoanFormData, clearLoanFormData } = useLoanForm();
  const { dashboardData, refreshDashboardData } = useDashboard();
  const { userData } = use_UserData();

  // Local state to track if fresh dashboard data is ready 
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    // Set loading to false initially to show spinner
    setIsDataReady(false);

    // Fetch the fresh dashboard data
    const fetchData = async () => {
      await refreshDashboardData();
      setIsDataReady(true); // Show data after it's loaded
    };

    fetchData();
  }, []);

  // This is the single source of truth for display
  const loanDetails = dashboardData?.pending_loan;
  console.log("loan details: ", loanDetails);

  // Local UI states
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form validation schema
  const schema = yup.object({
    password: yup
      .string()
      .required(t("loanRepaymentOverview.passwordRequired"))
      .min(8, t("loanRepaymentOverview.passwordMin")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  // Reconstruct loanFormData from active loan and userData if empty
  useEffect(() => {
    // Check a key which determines if loanFormData is empty or invalid
    if (!loanFormData.loan_amount || loanFormData.loan_amount === "") {
      if (loanDetails) {
        updateLoanFormData({
          loan_amount: loanDetails.loan_amount ?? "",
          loan_purpose: loanDetails.loan_purpose ?? "",
          wapan_member: loanDetails.wapan_member ?? false,
          account_name: loanDetails.bank_account.account_name ?? "",
          account_number: loanDetails.disbursement_account ?? "",
          bank_name: loanDetails.bank_account.bank_name ?? "",
          repayment_method: loanDetails.repayment_method ?? "",
          recyclable_drop_off_known:
            loanDetails.recyclable_drop_off_known ?? false,
          repayment_schedule: loanDetails.repayment_schedule ?? "",
          // repayment_drop_off_location: loanDetails.repayment_location ?? "N/A",
        });
      }
    }
  }, [loanDetails, loanFormData.loan_amount, updateLoanFormData, userData]);

  // Guard rendering until form data is ready
  if (!loanDetails || !isDataReady) {
    return <LoadingSpinner />;
  }

  const handleBackArrowClick = () => {
    navigate("/take-a-loan/form/loan-form-summary");
  };

  const onSubmit = async (passwordData) => {
    setLoading(true);
    setFormError(false);

    try {
      // Refresh dashboard data to ensure correct loan id
      const freshDashboardRes = await refreshDashboardData();

      localStorage.setItem("pendingLoanID", freshDashboardRes.pending_loan._id);

      const loanIdToConfirm = freshDashboardRes?.pending_loan?._id;

      // if (!loanIdToConfirm) {
      //   setFormError(true);
      //   setLoading(false);
      //   return;
      // }

      await confirmLoanApplication(loanIdToConfirm, passwordData.password);

      clearLoanFormData();
      localStorage.removeItem("pendingLoanID");
      setShowApprovalModal(true);
    } catch (error) {
      setFormError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowApprovalModal(false);
    navigate("/dashboard");
    refreshDashboardData();
  };

  // If no active loan after loading, show this fallback
  // if (!loanDetails) {
  //   return (
  //     <div className="text-center py-20">
  //       <p className="text-xl font-semibold">{t("loanRepaymentOverview.noLoanFound")}</p>
  //       <button
  //         onClick={() => navigate("/take-a-loan/form/loan-amount-purpose")}
  //         className="mt-5 text-center rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-6 cursor-pointer hover:opacity-80 transition-opacity duration-300"
  //       >
  //         {t("loanRepaymentOverview.startNewLoan")}
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col gap-3 pb-12 lg:bg-white lg:mr-34 rounded-[12px] lg:p-6 lg:my-16 border-[rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-2">
          <div className="my-6 lg:flex lg:items-center">
            <button
              className="cursor-pointer ml-2"
              aria-label="Go Back"
              onClick={handleBackArrowClick}
            >
              <img src={BackArrow} alt="back arrow" />
            </button>
            <p className="text-[24px] text-center font-raleway font-bold md:text-[28px] py-12 flex-1 ">
              {t("loanRepaymentOverview.title")}
            </p>
          </div>

          {formError && (
            <p className="text-red-500 mb-3">
              {t("loanRepaymentOverview.formError")}
            </p>
          )}

          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.howMuchToBorrow")}
            </span>
            <span className="font-medium">
              {loanDetails?.loan_amount != null
                ? new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 2,
                  }).format(loanDetails.loan_amount)
                : "N/A"}
            </span>
          </p>

          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.loanTerm")}
            </span>
            <span className="font-medium">
              {loanDetails?.loan_term_months != null
                ? `${loanDetails.loan_term_months} ${
                    loanDetails.loan_term_months === 1
                      ? t("loanRepaymentOverview.oneMonth")
                      : t("loanRepaymentOverview.months")
                  }`
                : "N/A"}
            </span>
          </p>

          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.monthlyRepayment")}
            </span>
            <span className="font-medium">
              {loanDetails?.monthly_payment_plastic_kg != null
                ? `${loanDetails.monthly_payment_plastic_kg} kg`
                : "N/A"}
            </span>
          </p>

          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.totalPlastics")}
            </span>
            <span className="font-medium">
              {loanDetails?.total_plastic_to_repay_kg != null
                ? `${loanDetails.total_plastic_to_repay_kg} kg`
                : "N/A"}
            </span>
          </p>

          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.disbursementTo")}
            </span>
            <span className="font-medium">
              {loanDetails?.bank_account.account_name || "N/A"} (
              {loanDetails?.disbursement_account || "N/A"})
            </span>
          </p>

          <p className="text-[#9C6D10] font-medium">
            {loanDetails?.early_repayment_incentive || ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 my-6">
          <p className="text-[#2D6157] pb-3">
            {t("loanRepaymentOverview.confirmationNotice")}
          </p>

          <label className="text-[#222] gap-2">
            {t("loanRepaymentOverview.passwordLabel")} <br />
            <div className="relative w-full">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("loanRepaymentOverview.passwordPlaceholder")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px] my-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.083.182-2.127.525-3.1M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </label>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              disabled={loading}
              type="submit"
              className={`text-center w-full rounded-[50px] text-[#FFF] my-4 font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
                loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? <LoadingSpinner /> : t("loanRepaymentOverview.button")}
            </button>
          </form>
        </div>
      </div>
      {showApprovalModal && (
        <LoanApprovalModal
          data={loanDetails} // Pass loanDetails to the modal
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
