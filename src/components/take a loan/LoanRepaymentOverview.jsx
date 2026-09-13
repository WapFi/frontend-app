import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cancelPendingLoan } from "../../api/loansApi";
import { useDashboard } from "../../context/DashboardContext";
import { useLoanForm } from "../../context/LoanFormContext";
import LoadingSpinner from "../LoadingSpinner";

export default function LoanRepaymentOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearLoanFormData } = useLoanForm();
  const { dashboardData, refreshDashboardData } = useDashboard();

  const [isDataReady, setIsDataReady] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataReady(false);
      await refreshDashboardData();
      setIsDataReady(true);
    };

    fetchData();
  }, [refreshDashboardData]);

  const loanDetails = dashboardData?.pending_loan;
  const loanStatus = loanDetails?.status?.toUpperCase();
  const disbursementStatus = loanDetails?.disbursement_status?.toUpperCase();
  const canCancel = loanStatus === "PENDING";

  if (!isDataReady) {
    return <LoadingSpinner />;
  }

  const handleCancelPendingLoan = async () => {
    const loanIdToCancel = loanDetails?._id;

    if (!loanIdToCancel) {
      setCancelError(t("loanRepaymentOverview.cancelMissingLoan"));
      return;
    }

    setCancelLoading(true);
    setCancelError("");
    setCancelSuccess("");

    try {
      const response = await cancelPendingLoan(loanIdToCancel);

      if (response.status === 200) {
        clearLoanFormData();
        setShowCancelConfirm(false);
        setCancelSuccess(
          response.data?.message || t("loanRepaymentOverview.cancelSuccess"),
        );
        await refreshDashboardData();

        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        setCancelError(
          response.data?.message || t("loanRepaymentOverview.cancelError"),
        );
      }
    } catch (error) {
      setCancelError(
        error.response?.data?.message || t("loanRepaymentOverview.cancelError"),
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const statusContent = (() => {
    if (!loanDetails) {
      return {
        badge: "",
        badgeClass: "bg-[#439182]/10 text-[#2D6157]",
        title: t("loanRepaymentOverview.noPendingTitle"),
        body: t("loanRepaymentOverview.noPendingBody"),
      };
    }

    if (disbursementStatus === "PROCESSING") {
      return {
        badge: t("loanRepaymentOverview.processingBadge"),
        badgeClass: "bg-[#439182]/10 text-[#2D6157]",
        title: t("loanRepaymentOverview.processingTitle"),
        body: t("loanRepaymentOverview.processingBody"),
      };
    }

    if (disbursementStatus === "SUCCESSFUL" || loanStatus === "DISBURSED") {
      return {
        badge: t("loanRepaymentOverview.successfulBadge"),
        badgeClass: "bg-[#439182]/10 text-[#2D6157]",
        title: t("loanRepaymentOverview.successfulTitle"),
        body: t("loanRepaymentOverview.successfulBody"),
      };
    }

    if (disbursementStatus === "FAILED") {
      return {
        badge: t("loanRepaymentOverview.failedBadge"),
        badgeClass: "bg-red-50 text-red-600",
        title: t("loanRepaymentOverview.failedTitle"),
        body: t("loanRepaymentOverview.failedBody"),
      };
    }

    if (loanStatus === "APPROVED") {
      return {
        badge: t("loanRepaymentOverview.approvedBadge"),
        badgeClass: "bg-[#439182]/10 text-[#2D6157]",
        title: t("loanRepaymentOverview.approvedTitle"),
        body: t("loanRepaymentOverview.approvedBody"),
      };
    }

    if (loanStatus === "PENDING") {
      return {
        badge: t("loanRepaymentOverview.pendingBadge"),
        badgeClass: "bg-[#9C6D10]/10 text-[#9C6D10]",
        title: t("loanRepaymentOverview.pendingTitle"),
        body: t("loanRepaymentOverview.pendingBody"),
      };
    }

    return {
      badge: loanDetails.status || "",
      badgeClass: "bg-gray-100 text-gray-700",
      title: t("loanRepaymentOverview.statusUnavailableTitle"),
      body: t("loanRepaymentOverview.statusUnavailableBody", {
        status: loanDetails.status,
      }),
    };
  })();

  return (
    <>
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
        {statusContent.badge && (
          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${statusContent.badgeClass}`}
          >
            {statusContent.badge}
          </div>
        )}

        <p className="text-[24px] font-raleway font-bold text-[#10172E]">
          {statusContent.title}
        </p>
        <p className="max-w-xl text-[#656565]">{statusContent.body}</p>

        {loanDetails && (
          <div className="mt-2 grid w-full max-w-xl grid-cols-1 gap-3 rounded-[12px] border border-[#439182]/10 bg-[#439182]/5 p-4 text-left text-sm md:grid-cols-2">
            <div>
              <p className="text-[#656565]">
                {t("loanRepaymentOverview.howMuchToBorrow")}
              </p>
              <p className="font-semibold text-[#10172E]">
                {loanDetails.loan_amount != null
                  ? new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 2,
                    }).format(loanDetails.loan_amount)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[#656565]">
                {t("loanRepaymentOverview.disbursementTo")}
              </p>
              <p className="font-semibold text-[#10172E]">
                {loanDetails.bank_account?.account_name || "N/A"} (
                {loanDetails.disbursement_account ||
                  loanDetails.bank_account?.account_number ||
                  "N/A"}
                )
              </p>
            </div>
          </div>
        )}

        {cancelError && (
          <p className="text-red-500" role="alert">
            {cancelError}
          </p>
        )}

        {cancelSuccess && (
          <p className="text-green-500" role="status">
            {cancelSuccess}
          </p>
        )}

        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80"
          >
            {t("loanRepaymentOverview.pendingDashboardButton")}
          </button>

          {canCancel && (
            <button
              type="button"
              disabled={cancelLoading}
              onClick={() => setShowCancelConfirm(true)}
              className={`rounded-[50px] border border-red-500 px-6 py-3 font-medium text-red-500 hover:bg-red-50 ${
                cancelLoading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
            >
              {t("loanRepaymentOverview.cancelButton")}
            </button>
          )}
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-lg">
            <p className="text-xl font-raleway font-bold text-[#10172E]">
              {t("loanRepaymentOverview.cancelModalTitle")}
            </p>

            <p className="mt-3 text-[#656565]">
              {t("loanRepaymentOverview.cancelModalBody")}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                disabled={cancelLoading}
                onClick={() => setShowCancelConfirm(false)}
                className="w-full rounded-[50px] border border-[#439182] px-4 py-3 text-sm font-medium text-[#439182] hover:bg-[#439182]/10"
              >
                {t("loanRepaymentOverview.cancelModalNo")}
              </button>

              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleCancelPendingLoan}
                className={`w-full rounded-[50px] bg-red-500 px-4 py-3 text-sm font-medium text-white hover:opacity-80 ${
                  cancelLoading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
              >
                {cancelLoading ? (
                  <LoadingSpinner />
                ) : (
                  t("loanRepaymentOverview.cancelModalYes")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
