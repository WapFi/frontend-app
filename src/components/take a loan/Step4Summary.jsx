import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { applyForLoan, updatePendingLoanDetails } from "../../api/loansApi";
import editIcon from "../../assets/edit icon.svg";
import { useDashboard } from "../../context/DashboardContext";
import { useLoanForm } from "../../context/LoanFormContext";
import LoadingSpinner from "../LoadingSpinner";

export default function Step4Summary() {
  const { t } = useTranslation();
  const { loanFormData, updateLoanFormData } = useLoanForm();
  // const { refreshDashboardData } = useDashboard();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { dashboardData, refreshDashboardData } = useDashboard();
  const isUpdatingPendingLoan = Boolean(dashboardData.pending_loan);

  const schema = yup.object({
    password: isUpdatingPendingLoan
      ? yup.string()
      : yup
          .string()
          .required(t("loanStep4.passwordRequired"))
          .min(8, t("loanStep4.passwordMin")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  // useEffect to ensure loanFormData is synced from backend on mount
  useEffect(() => {
    const fetchAndSyncLoanData = async () => {
      // 2. ADD THIS CONDITION AT THE START OF YOUR FETCH LOGIC
      // This ensures it only runs if a pending loan exists AND it hasn't run before
      if (dashboardData.pending_loan && !loanFormData.loan_amount) {
        try {
          const freshDashboardRes = await refreshDashboardData();
          if (freshDashboardRes && freshDashboardRes.pending_loan) {
            updateLoanFormData({
              loan_amount: freshDashboardRes.pending_loan.loan_amount ?? "",
              loan_purpose: freshDashboardRes.pending_loan.loan_purpose ?? "",
              other_purpose:
                freshDashboardRes.pending_loan.loan_purpose_other ?? "",
              association_membership:
                freshDashboardRes.pending_loan.association_membership ??
                (freshDashboardRes.pending_loan.wapan_member
                  ? "WAPAN"
                  : "NONE"),
              account_name:
                freshDashboardRes.pending_loan.bank_account?.account_name ?? "",
              account_number:
                freshDashboardRes.pending_loan.disbursement_account ?? "",
              bank_name:
                freshDashboardRes.pending_loan.bank_account?.bank_name ?? "",
              bank_code:
                freshDashboardRes.pending_loan.bank_account?.bank_code ?? "",
              repayment_method:
                freshDashboardRes.pending_loan.repayment_method ?? "",
              recyclable_drop_off_known:
                freshDashboardRes.pending_loan.recyclable_drop_off_known ??
                false,
              recyclable_drop_off_location:
                freshDashboardRes.pending_loan.recyclable_drop_off_location ??
                "",
              repayment_schedule:
                freshDashboardRes.pending_loan.repayment_schedule ?? "",
            });
          }
        } catch {
          // Keep the existing form state when dashboard refresh fails.
        }
      }
    };

    fetchAndSyncLoanData();
  }, [dashboardData.pending_loan, refreshDashboardData, updateLoanFormData]);

  const onSubmit = async (passwordData) => {
    setLoading(true);
    setFormError("");
    setFormSuccess("");

    const payload = {
      loan_amount: loanFormData.loan_amount,
      loan_purpose: loanFormData.loan_purpose,
      association_membership: loanFormData.association_membership,
      account_name: loanFormData.account_name,
      account_number: loanFormData.account_number,
      bank_name: loanFormData.bank_name,
      bank_code: loanFormData.bank_code,
      recyclable_drop_off_known: loanFormData.recyclable_drop_off_known,

      repayment_method: loanFormData.repayment_method,
      repayment_schedule: loanFormData.repayment_schedule,
    };

    // include the location choice only if user does not know the location
    if (loanFormData.recyclable_drop_off_known === false) {
      payload.recyclable_drop_off_location =
        loanFormData.recyclable_drop_off_location;
    }

    // include in payload only if user chooses 'Other' for loan purpose
    if (loanFormData.loan_purpose === "OTHER") {
      payload.loan_purpose_other = loanFormData.other_purpose;
    }

    if (isUpdatingPendingLoan) {
      try {
        // update loan details
        // pendingLoanID = localStorage.getItem("pendingLoanID");
        const updatedLoanDetails = await updatePendingLoanDetails(
          payload,
          // pendingLoanID
          dashboardData.pending_loan._id,
        );
        if (updatedLoanDetails.status === 200) {
          setFormSuccess(updatedLoanDetails.data?.message);
          // save updatedLoanDetails and navigate to overview page
          localStorage.setItem(
            "latestLoanApplicationData",
            JSON.stringify(updatedLoanDetails.data?.data),
          );
          setTimeout(() => {
            navigate("/take-a-loan/loan-repayment-overview");
          }, 3500);
        } else {
          setFormError(updatedLoanDetails.data?.message);
        }
      } catch (error) {
        setFormError(error.response?.data?.message);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setFormError("");
          setFormSuccess("");
        }, 3000);
      }
    } else {
      try {
        const response = await applyForLoan({
          ...payload,
          password: passwordData.password,
        });
        if (response.status === 201) {
          reset({ password: "" });
          setFormSuccess(response.data?.message);
          localStorage.setItem(
            "latestLoanApplicationData",
            JSON.stringify(response.data?.data),
          );
          setTimeout(() => {
            navigate("/dashboard");
          }, 3500);
        } else {
          setFormError(response.data?.message);
        }
      } catch (error) {
        setFormError(error.response?.data?.message);
      } finally {
        reset({ password: "" });
        setLoading(false);
        setTimeout(() => {
          setFormError("");
          setFormSuccess("");
        }, 3000);
      }
    }
  };

  return (
    <div className="w-[95%] mx-auto md:w-[75%] flex flex-col gap-3">
      {formError && (
        <p className="text-red-500 mb-3 text-center">
          {formError || t("loanStep4.errorForm")}
        </p>
      )}

      {formSuccess && (
        <p className="text-green-500 mb-3 text-center">{formSuccess || ""}</p>
      )}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[#222]">
          <span className="font-semibold">
            {t("loanStep4.loanAmountPurposeLabel")}
          </span>
          <div
            className="flex gap-2.5 cursor-pointer"
            onClick={() => {
              navigate("/take-a-loan/form/loan-amount-purpose", {
                state: { fromSummary: true },
              });
            }}
          >
            <img src={editIcon} alt="edit icon" />
            <span className="text-[#439182] font-medium">
              {t("loanStep4.editButton")}
            </span>
          </div>
        </div>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.howMuchToBorrowLabel")}
          </span>
          {/* <span className="font-medium">₦{loanFormData.loan_amount}</span> */}
          <span className="font-medium">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
            }).format(loanFormData.loan_amount) || "N/A"}
          </span>
        </p>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.loanPurposeLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.loan_purpose || "N/A"}
          </span>
        </p>
        {loanFormData.loan_purpose === "OTHER" && (
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanStep4.otherPurposeLabel")}
            </span>
            <span className="font-medium">
              {loanFormData.other_purpose || "N/A"}
            </span>
          </p>
        )}

        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.associationMembershipLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.association_membership
              ? t(
                  `loanStep1.associationOptions.${loanFormData.association_membership}`,
                )
              : "N/A"}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="font-semibold">
            {t("loanStep4.bankConfirmationLabel")}
          </span>
          <div
            className="flex gap-2.5 cursor-pointer"
            onClick={() => {
              navigate("/take-a-loan/form/bank-account-confirmation", {
                state: { fromSummary: true },
              });
            }}
          >
            <img src={editIcon} alt="edit icon" />
            <span className="text-[#439182] font-medium">
              {t("loanStep4.editButton")}
            </span>
          </div>
        </div>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.accountNameLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.account_name || "N/A"}
          </span>
        </p>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.accountNumberLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.account_number || "N/A"}
          </span>
        </p>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.bankNameLabel")}
          </span>
          <span className="font-medium">{loanFormData.bank_name || "N/A"}</span>
        </p>
      </div>

      <div className="flex flex-col gap-1.5 mb-12">
        <div className="flex justify-between">
          <span className="font-semibold">
            {t("loanStep4.repaymentUnderstandingLabel")}
          </span>
          <div
            className="flex gap-2.5 cursor-pointer"
            onClick={() => {
              navigate("/take-a-loan/form/loan-repayment-method", {
                state: { fromSummary: true },
              });
            }}
          >
            <img src={editIcon} alt="edit icon" />
            <span className="text-[#439182] font-medium">
              {t("loanStep4.editButton")}
            </span>
          </div>
        </div>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.repaymentMethodLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.repayment_method || "N/A"}
          </span>
        </p>
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.knowWhereToRepayLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.recyclable_drop_off_known === true
              ? t("loanStep4.yes")
              : t("loanStep4.no")}
          </span>
        </p>
        {loanFormData.recyclable_drop_off_known === false && (
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanStep4.repaymentLocationLabel")}
            </span>
            <span className="font-medium">
              {loanFormData.recyclable_drop_off_location || "N/A"}
            </span>
          </p>
        )}
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep3.repaymentScheduleLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.repayment_schedule || "N/A"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {!isUpdatingPendingLoan && (
          <>
            <p className="text-[#2D6157] text-sm md:text-base">
              {t("loanStep4.passwordNotice")}
            </p>

            <label className="text-[#222]" htmlFor="loan-application-password">
              {t("loanStep4.passwordLabel")}
            </label>
            <div className="relative w-full">
              <input
                id="loan-application-password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("loanStep4.passwordPlaceholder")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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
                      d="M13.875 18.825A10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.083.182-2.127.525-3.1M3 3l18 18"
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
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password?.message}
              </p>
            )}
          </>
        )}

        <button
          disabled={loading}
          type="submit"
          className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : t("loanStep4.continueButton")}
        </button>
      </form>
    </div>
  );
}
