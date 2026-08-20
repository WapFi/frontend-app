import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  retryLoanDisbursement,
  updateLoanApplicationStatus,
} from "../../../api/adminApi";
import { getFunds } from "../../../api/fundsApi";

function getErrorMessage(error, fallback) {
  const responseData = error.response?.data;

  if (responseData?.errors?.[0]?.message) return responseData.errors[0].message;
  if (responseData?.message) return responseData.message;

  return fallback;
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `NGN ${amount.toLocaleString()}`;
}

function getFundIneligibility(fund, loanAmount) {
  const availableCapital = Number(fund.available_capital || 0);
  const maxLoanAmount =
    fund.terms?.max_loan_amount === undefined ||
    fund.terms?.max_loan_amount === null ||
    fund.terms?.max_loan_amount === ""
      ? null
      : Number(fund.terms.max_loan_amount);

  if (availableCapital < loanAmount) {
    return "Insufficient available capital";
  }

  if (maxLoanAmount !== null && maxLoanAmount < loanAmount) {
    return "Max loan amount is below this loan";
  }

  return "";
}

function LoanApplicationModal({ loan, onClose, onUpdated }) {
  const [availableFunds, setAvailableFunds] = useState([]);
  const [selectedFundId, setSelectedFundId] = useState("");
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [fundsError, setFundsError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const loanStatus = loan?.status?.toUpperCase();
  const disbursementStatus = loan?.disbursementStatus?.toUpperCase();
  const isPending = loanStatus === "PENDING";
  const isFailedDisbursement = disbursementStatus === "FAILED";
  const loanAmount = Number(loan?.loanAmountValue || 0);

  useEffect(() => {
    if (!isPending) return;

    const fetchAvailableFunds = async () => {
      try {
        setLoadingFunds(true);
        setFundsError("");
        const response = await getFunds({ available_only: true, limit: 100 });

        if (response.status && response.data) {
          setAvailableFunds(response.data.funds || []);
        } else {
          setFundsError(response.message || "Unable to load available funds.");
        }
      } catch (error) {
        setFundsError(
          getErrorMessage(error, "Unable to load available funds."),
        );
      } finally {
        setLoadingFunds(false);
      }
    };

    fetchAvailableFunds();
  }, [isPending]);

  const eligibleFunds = useMemo(
    () =>
      availableFunds.filter(
        (fund) => !getFundIneligibility(fund, loanAmount),
      ),
    [availableFunds, loanAmount],
  );

  if (!loan) return null;

  const handleApprove = async () => {
    if (!selectedFundId) {
      setActionError("Select an eligible fund before approving this loan.");
      return;
    }

    try {
      setActionLoading("approve");
      setActionError("");
      const response = await updateLoanApplicationStatus(loan.id, {
        status: "APPROVED",
        fund_id: selectedFundId,
      });

      if (response.status) {
        toast.success(response.message || "Loan approved successfully.");
        onUpdated?.();
        onClose();
      } else {
        setActionError(response.message || "Unable to approve loan.");
      }
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to approve loan."));
    } finally {
      setActionLoading("");
    }
  };

  const handleDecline = async () => {
    try {
      setActionLoading("decline");
      setActionError("");
      const response = await updateLoanApplicationStatus(loan.id, "REJECTED");

      if (response.status) {
        toast.success(response.message || "Loan declined successfully.");
        onUpdated?.();
        onClose();
      } else {
        setActionError(response.message || "Unable to decline loan.");
      }
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to decline loan."));
    } finally {
      setActionLoading("");
    }
  };

  const handleRetryDisbursement = async () => {
    try {
      setActionLoading("retry");
      setActionError("");
      const response = await retryLoanDisbursement(loan.id);

      if (response.status) {
        toast.success(response.message || "Disbursement retry started.");
        onUpdated?.();
        onClose();
      } else {
        setActionError(response.message || "Unable to retry disbursement.");
      }
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Unable to retry disbursement."),
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Loan Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar and Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {loan.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{loan.name}</h3>
              <p className="text-sm text-gray-500">{loan.email}</p>
              <p className="text-sm text-gray-500">{loan.phone}</p>
            </div>
          </div>

          {/* Loan Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-lg font-semibold text-gray-900">{loan.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Loan Term</span>
                <span className="text-sm text-gray-900">{loan.loanTerm}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Purpose</span>
                <span className="text-sm text-gray-900">{loan.reason}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Application Date</span>
                <span className="text-sm text-gray-900">{loan.date}</span>
              </div>
            </div>
          </div>

          {isPending && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Select funding source
                </h3>
                <p className="text-xs text-gray-500">
                  Approval reserves capital from the selected fund. No payout is
                  made until the borrower confirms the loan.
                </p>
              </div>

              {loadingFunds ? (
                <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-500">
                  Loading available funds...
                </div>
              ) : fundsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {fundsError}
                </div>
              ) : availableFunds.length === 0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                  No active funds with available capital were found.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {availableFunds.map((fund) => {
                    const ineligibleReason = getFundIneligibility(
                      fund,
                      loanAmount,
                    );
                    const isDisabled = Boolean(ineligibleReason);

                    return (
                      <label
                        key={fund._id}
                        className={`block rounded-lg border p-3 text-sm ${
                          isDisabled
                            ? "border-gray-200 bg-gray-50 opacity-70"
                            : "border-gray-200 hover:border-yellow-500 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="fund"
                            value={fund._id}
                            checked={selectedFundId === fund._id}
                            disabled={isDisabled}
                            onChange={(event) =>
                              setSelectedFundId(event.target.value)
                            }
                            className="mt-1"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900">
                              {fund.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {fund.fund_id} - {fund.sponsor?.name || "No sponsor"}
                            </div>
                            <div className="mt-1 text-xs text-gray-600">
                              Available: {formatCurrency(fund.available_capital)}
                              {fund.terms?.max_loan_amount !== undefined &&
                                ` - Max loan: ${formatCurrency(
                                  fund.terms.max_loan_amount,
                                )}`}
                            </div>
                            {ineligibleReason && (
                              <div className="mt-1 text-xs text-red-600">
                                {ineligibleReason}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {actionError && (
            <p className="text-sm text-red-600" role="alert">
              {actionError}
            </p>
          )}

          {/* Action Buttons */}
          {isPending ? (
            <div className="flex space-x-3">
              <button 
                onClick={handleApprove}
                disabled={
                  Boolean(actionLoading) ||
                  loadingFunds ||
                  eligibleFunds.length === 0
                }
                className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-md font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {actionLoading === "approve" ? "Approving..." : "Approve Loan"}
              </button>
              <button 
                onClick={handleDecline}
                disabled={Boolean(actionLoading)}
                className="flex-1 bg-red-100 text-red-700 py-3 px-4 rounded-md font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {actionLoading === "decline" ? "Declining..." : "Decline Loan"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Current status: {loan.status || "Unknown"}
                </p>
                {loan.disbursementStatus && (
                  <p className="mt-1 text-sm text-gray-600">
                    Disbursement status: {loan.disbursementStatus}
                  </p>
                )}
              </div>

              {isFailedDisbursement && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="text-sm font-semibold text-red-800">
                    Disbursement failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    Retry the payout for this failed disbursement. If the
                    borrower has already re-confirmed it, the request will no
                    longer be accepted.
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryDisbursement}
                    disabled={Boolean(actionLoading)}
                    className="mt-4 w-full rounded-md bg-yellow-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading === "retry"
                      ? "Retrying..."
                      : "Retry Disbursement"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanApplicationModal;
