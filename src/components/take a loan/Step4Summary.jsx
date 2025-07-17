
import editIcon from "../../assets/edit icon.svg";
import LoadingSpinner from "../LoadingSpinner";
import { useLoanForm } from "../../context/LoanFormContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { applyForLoan } from "../../api/apiData";
import { useTranslation } from "react-i18next";
import { useDashboard } from "../../context/DashboardContext";
import {updatePendingLoanDetails} from "../../api/apiData";

export default function Step4Summary() {
  const { t } = useTranslation();
  const { loanFormData } = useLoanForm();
  // const { refreshDashboardData } = useDashboard();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const { dashboardData } = useDashboard();
  // const [freshDashboardData, setfreshDashboardData] = useState(null);

  // const getFreshDashboardData = async () => {
  //   const freshData = await refreshDashboardData();
  //   setfreshDashboardData(freshData);
  // };
  // getFreshDashboardData();

  // console.log(loanFormData);

  console.log(dashboardData.pending_loan)

  const onSubmit = async () => {
    setLoading(true);
    setFormError(false);

    if (dashboardData.pending_loan) {
      try {
        // update loan details
        // pendingLoanID = localStorage.getItem("pendingLoanID");
        const updatedLoanDetails = await updatePendingLoanDetails(
          loanFormData,
          // pendingLoanID
          dashboardData.pending_loan._id
        );

        // save updatedLoanDetails and navigate to overview page
        localStorage.setItem(
          "latestLoanApplicationData",
          JSON.stringify(updatedLoanDetails.data)
        );

        navigate("/take-a-loan/loan-repayment-overview");
      } catch (error) {
        console.log("Something went wrong: ", error);
        setFormError(true);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await applyForLoan(loanFormData);

        // console.log("api data: ", response.data);
        console.log(loanFormData);
        localStorage.setItem(
          "latestLoanApplicationData",
          JSON.stringify(response.data)
        );
        navigate("/take-a-loan/loan-repayment-overview");
      } catch (error) {
        console.log("Something went wrong: ", error);
        setFormError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-[95%] mx-auto md:w-[75%] flex flex-col gap-3">
      {formError && (
        <p className="text-red-500 mb-3">{t("loanStep4.errorForm")}</p>
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
        <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
          <span className="text-[rgba(34,34,34,0.50)]">
            {t("loanStep4.wapanMemberLabel")}
          </span>
          <span className="font-medium">
            {loanFormData.wapan_member === true
              ? t("loanStep4.yes")
              : t("loanStep4.no") || "N/A"}
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
              {loanFormData.repayment_location || "N/A"}
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

      <button
        disabled={loading}
        type="button"
        onClick={onSubmit}
        className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
          loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {loading ? <LoadingSpinner /> : t("loanStep4.continueButton")}
      </button>
    </div>
  );
}
