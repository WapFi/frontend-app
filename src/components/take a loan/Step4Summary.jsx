import editIcon from "../../assets/edit icon.svg";
import LoadingSpinner from "../LoadingSpinner";
import { useLoanForm } from "../../context/LoanFormContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { applyForLoan } from "../../api/apiData";
import { useTranslation } from "react-i18next";
import { useDashboard } from "../../context/DashboardContext";
import { updatePendingLoanDetails } from "../../api/apiData";

export default function Step4Summary() {
  const { t } = useTranslation();
  const { loanFormData, updateLoanFormData } = useLoanForm();
  // const { refreshDashboardData } = useDashboard();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const { dashboardData, refreshDashboardData } = useDashboard();

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
              other_purpose: freshDashboardRes.pending_loan.loan_purpose_other ?? "",
              wapan_member:
                freshDashboardRes.pending_loan.wapan_member ?? false,
              account_name:
                freshDashboardRes.pending_loan.bank_account?.account_name ?? "",
              account_number:
                freshDashboardRes.pending_loan.disbursement_account ?? "",
              bank_name:
                freshDashboardRes.pending_loan.bank_account?.bank_name ?? "",
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
        } catch (error) {
          console.log("Failed to refresh dashboard data for summary:", error);
        }
      }
    };

    fetchAndSyncLoanData();
  }, [dashboardData.pending_loan, refreshDashboardData, updateLoanFormData]);

  // // useEffect to ensure loanFormData is synced from backend on mount
  // useEffect(() => {
  //   const fetchAndSyncLoanData = async () => {
  //     try {
  //       const freshDashboardRes = await refreshDashboardData(); // Fetch latest from backend
  //       if (freshDashboardRes && freshDashboardRes.pending_loan) {
  //         // If there's a pending loan, update the context with its details
  //         updateLoanFormData({
  //           loan_amount: freshDashboardRes.pending_loan.loan_amount ?? "",
  //           loan_purpose: freshDashboardRes.pending_loan.loan_purpose ?? "",
  //           wapan_member: freshDashboardRes.pending_loan.wapan_member ?? false,
  //           account_name:
  //             freshDashboardRes.pending_loan.bank_account?.account_name ?? "",
  //           account_number:
  //             freshDashboardRes.pending_loan.disbursement_account ?? "",
  //           bank_name:
  //             freshDashboardRes.pending_loan.bank_account?.bank_name ?? "",
  //           repayment_method:
  //             freshDashboardRes.pending_loan.repayment_method ?? "",
  //           recyclable_drop_off_known:
  //             freshDashboardRes.pending_loan.recyclable_drop_off_known ?? false,
  //           recyclable_drop_off_location:
  //             freshDashboardRes.pending_loan.recyclable_drop_off_location ?? "",
  //           repayment_schedule:
  //             freshDashboardRes.pending_loan.repayment_schedule ?? "",
  //         });
  //       }
  //     } catch (error) {
  //       console.log("Failed to refresh dashboard data for summary:", error);
  //       // Optionally, set an error state to inform the user
  //     }
  //   };

  //   fetchAndSyncLoanData();
  // }, [refreshDashboardData, updateLoanFormData]);

  console.log("loan form data: ", loanFormData);

  // logging for test only
  console.log(
    "loan application data: ",
    localStorage.getItem("latestLoanApplicationData")
  );

  // console.log("pending loan: ", dashboardData.pending_loan);

  const onSubmit = async () => {
    setLoading(true);
    // setFormError(false);

    const payload = {
      loan_amount: loanFormData.loan_amount,
      loan_purpose: loanFormData.loan_purpose,
      wapan_member: loanFormData.wapan_member,
      account_name: loanFormData.account_name,
      account_number: loanFormData.account_number,
      bank_name: loanFormData.bank_name,
      recyclable_drop_off_known: loanFormData.recyclable_drop_off_known,
      // recyclable_drop_off_location: loanFormData.recyclable_drop_off_location,
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

    console.log("payload: ", payload);

    if (dashboardData.pending_loan) {
      console.log("i am Updating loan");
      try {
        // update loan details
        // pendingLoanID = localStorage.getItem("pendingLoanID");
        const updatedLoanDetails = await updatePendingLoanDetails(
          payload,
          // pendingLoanID
          dashboardData.pending_loan._id
        );
        console.log("updated: ", updatedLoanDetails);

        if (updatedLoanDetails.status === 200) {
          setFormSuccess(updatedLoanDetails.data?.message);
          // save updatedLoanDetails and navigate to overview page
          localStorage.setItem(
            "latestLoanApplicationData",
            JSON.stringify(updatedLoanDetails.data?.data)
          );
          console.log(
            "my loan is here: ",
            localStorage.getItem("latestLoanApplicationData")
          );
          setTimeout(() => {
            navigate("/take-a-loan/loan-repayment-overview");
          }, 3500);
        } else {
          setFormError(updatedLoanDetails.data?.message);
        }
      } catch (error) {
        // console.log("Something went wrong: ", error);

        setFormError(error.response?.data?.message);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setFormError("");
          setFormSuccess("");
        }, 3000);
      }
    } else {
      // console.log("payload: ", payload);
      try {
        const response = await applyForLoan(payload);
        if (response.status === 201) {
          console.log("applying");
          setFormSuccess(response.data?.message);
          // console.log("api data: ", response.data);
          localStorage.setItem(
            "latestLoanApplicationData",
            JSON.stringify(response.data?.data)
          );
          setTimeout(() => {
            navigate("/take-a-loan/loan-repayment-overview");
          }, 3500);
        } else {
          console.log("in else block");
          setFormError(response.data?.message);
        }
      } catch (error) {
        console.log("error: ", error);
        // console.log("Something went wrong: ", error);
        setFormError(error.response?.data?.message);
      } finally {
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
