import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  cancelPendingLoan,
  confirmLoanApplication,
  updatePendingLoanDetails,
} from "../../api/loansApi";
import BackArrow from "../../assets/back arrow.svg";
import { useDashboard } from "../../context/DashboardContext";
import { useLoanForm } from "../../context/LoanFormContext";
import { use_UserData } from "../../context/UserContext";
import banks from "../../data/banks.json";
import LoadingSpinner from "../LoadingSpinner";
import LoanApprovalModal from "./LoanApprovalModal";

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
  const loanStatus = loanDetails?.status?.toUpperCase();
  const disbursementStatus = loanDetails?.disbursement_status?.toUpperCase();
  const isApprovedLoan = loanStatus === "APPROVED";
  const isProcessingDisbursement = disbursementStatus === "PROCESSING";
  const isSuccessfulDisbursement = disbursementStatus === "SUCCESSFUL";
  const isFailedDisbursement = disbursementStatus === "FAILED";
  const cancelButtonText = isApprovedLoan
    ? t("loanRepaymentOverview.cancelApprovedButton")
    : t("loanRepaymentOverview.cancelButton");
  const cancelModalTitle = isApprovedLoan
    ? t("loanRepaymentOverview.cancelApprovedModalTitle")
    : t("loanRepaymentOverview.cancelModalTitle");
  const cancelModalBody = isApprovedLoan
    ? t("loanRepaymentOverview.cancelApprovedModalBody")
    : t("loanRepaymentOverview.cancelModalBody");
  const cancelModalYes = isApprovedLoan
    ? t("loanRepaymentOverview.cancelApprovedModalYes")
    : t("loanRepaymentOverview.cancelModalYes");
  // Local UI states
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loanCancelled, setLoanCancelled] = useState(false);
  const [showBankUpdateForm, setShowBankUpdateForm] = useState(false);
  const [bankUpdateData, setBankUpdateData] = useState({
    account_number: "",
    bank_name: "",
    bank_code: "",
  });
  const [bankUpdateErrors, setBankUpdateErrors] = useState({});
  const [bankUpdateLoading, setBankUpdateLoading] = useState(false);
  const [bankUpdateSuccess, setBankUpdateSuccess] = useState("");
  const [bankUpdateError, setBankUpdateError] = useState("");

  // Form validation schema
  const schema = yup.object({
    password: yup
      .string()
      .required(t("loanRepaymentOverview.passwordRequired"))
      .min(8, t("loanRepaymentOverview.passwordMin")),
  });

  const bankUpdateSchema = yup.object({
    account_number: yup
      .string()
      .required(t("loanRepaymentOverview.bankAccountRequired"))
      .matches(/^\d{10}$/, t("loanRepaymentOverview.bankAccountInvalid")),
    bank_name: yup.string().required(t("loanRepaymentOverview.bankNameRequired")),
    bank_code: yup.string().required(t("loanRepaymentOverview.bankNameRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  useEffect(() => {
    if (!loanDetails) return;

    setBankUpdateData({
      account_number:
        loanDetails.bank_account?.account_number ||
        loanDetails.disbursement_account ||
        "",
      bank_name: loanDetails.bank_account?.bank_name || "",
      bank_code: loanDetails.bank_account?.bank_code || "",
    });
  }, [loanDetails]);

  // Reconstruct loanFormData from pending loan and userData if empty
  useEffect(() => {
    if (
      !loanCancelled &&
      (!loanFormData.loan_amount || loanFormData.loan_amount === "")
    ) {
      if (loanDetails) {
        const updatedFields = {
          loan_amount: loanDetails.loan_amount ?? "",
          loan_purpose: loanDetails.loan_purpose ?? "",
          wapan_member: loanDetails.wapan_member ?? false,
          account_name: loanDetails.bank_account?.account_name ?? "",
          account_number: loanDetails.disbursement_account ?? "",
          bank_name: loanDetails.bank_account?.bank_name ?? "",
          bank_code: loanDetails.bank_account?.bank_code ?? "",
          repayment_method: loanDetails.repayment_method ?? "",
          recyclable_drop_off_known:
            loanDetails.recyclable_drop_off_known ?? false,
          repayment_schedule: loanDetails.repayment_schedule ?? "",
        };

        // Only add recyclable_drop_off_location if recyclable_drop_off_known is false
        if (loanDetails.recyclable_drop_off_known === false) {
          updatedFields.recyclable_drop_off_location =
            loanDetails.recyclable_drop_off_location ?? "";
        } else {
          updatedFields.recyclable_drop_off_location = null;
        }

        updateLoanFormData(updatedFields);
      }
    }
  }, [
    loanCancelled,
    loanDetails,
    loanFormData.loan_amount,
    updateLoanFormData,
    userData,
  ]);

  // Guard rendering until form data is ready
  // if (!loanDetails || !isDataReady) {
  //   return <LoadingSpinner />;
  // }
  if (!isDataReady) {
    return <LoadingSpinner />;
  }

  if (!loanDetails) {
    return (
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
        <p className="text-[24px] font-raleway font-bold text-[#10172E]">
          {t("loanRepaymentOverview.noPendingTitle")}
        </p>
        <p className="text-[#656565]">
          {t("loanRepaymentOverview.noPendingBody")}
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-2 rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80"
        >
          {t("loanRepaymentOverview.noPendingButton")}
        </button>
      </div>
    );
  }

  const handleBackArrowClick = () => {
    navigate("/take-a-loan/form/loan-form-summary");
  };

  const onSubmit = async (passwordData) => {
    setLoading(true);

    try {
      // Refresh dashboard data to ensure correct loan id
      const freshDashboardRes = await refreshDashboardData();

      localStorage.setItem("pendingLoanID", freshDashboardRes.pending_loan._id);

      const loanIdToConfirm = freshDashboardRes?.pending_loan?._id;

      const response = await confirmLoanApplication(
        loanIdToConfirm,
        passwordData.password,
      );

      if (response.status === 200) {
        clearLoanFormData();
        localStorage.removeItem("pendingLoanID");
        setFormSuccess(
          response.data?.message || t("loanRepaymentOverview.processingSuccess"),
        );

        const updatedDashboardData = await refreshDashboardData();
        const updatedPendingLoan = updatedDashboardData?.pending_loan;
        const updatedDisbursementStatus =
          updatedPendingLoan?.disbursement_status?.toUpperCase();

        if (
          updatedDashboardData?.active_loan ||
          updatedPendingLoan?.status?.toUpperCase() === "DISBURSED"
        ) {
          setShowApprovalModal(true);
        } else if (updatedDisbursementStatus === "PROCESSING") {
          setFormSuccess(t("loanRepaymentOverview.processingSuccess"));
        }
      } else {
        setFormError(response.data?.message);
      }
    } catch (error) {
      setFormError(error.response?.data?.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setFormError("");
        setFormSuccess("");
      }, 2500);
    }
  };

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
        setLoanCancelled(true);
        clearLoanFormData();
        localStorage.removeItem("pendingLoanID");
        setShowCancelConfirm(false);
        setCancelSuccess(
          response.data?.message || t("loanRepaymentOverview.cancelSuccess"),
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 4000);
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

  const collectBankUpdateErrors = (validationError) => {
    const nextErrors = {};

    validationError.inner?.forEach((fieldError) => {
      if (fieldError.path && !nextErrors[fieldError.path]) {
        nextErrors[fieldError.path] = fieldError.message;
      }
    });

    return nextErrors;
  };

  const handleBankUpdateInputChange = (event) => {
    const { name, value } = event.target;

    setBankUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setBankUpdateErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBankSelectChange = (event) => {
    const selectedBank = banks.find((bank) => bank.code === event.target.value);

    setBankUpdateData((prev) => ({
      ...prev,
      bank_name: selectedBank?.name || "",
      bank_code: selectedBank?.code || "",
    }));

    setBankUpdateErrors((prev) => ({
      ...prev,
      bank_name: "",
      bank_code: "",
    }));
  };

  const handleBankDetailsUpdate = async (event) => {
    event.preventDefault();

    setBankUpdateErrors({});
    setBankUpdateError("");
    setBankUpdateSuccess("");

    try {
      await bankUpdateSchema.validate(bankUpdateData, { abortEarly: false });
    } catch (validationError) {
      setBankUpdateErrors(collectBankUpdateErrors(validationError));
      return;
    }

    setBankUpdateLoading(true);

    try {
      const payload = {
        account_name:
          userData?.full_name || loanDetails?.bank_account?.account_name || "",
        account_number: bankUpdateData.account_number.trim(),
        bank_name: bankUpdateData.bank_name,
        bank_code: bankUpdateData.bank_code,
      };

      const response = await updatePendingLoanDetails(payload, loanDetails._id);

      setBankUpdateSuccess(
        response.data?.message || t("loanRepaymentOverview.bankUpdateSuccess"),
      );
      setShowBankUpdateForm(false);
      await refreshDashboardData();
    } catch (error) {
      setBankUpdateError(
        error.response?.data?.message ||
          t("loanRepaymentOverview.bankUpdateError"),
      );
    } finally {
      setBankUpdateLoading(false);
    }
  };

  const cancelConfirmModal = showCancelConfirm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-lg">
        <p className="text-xl font-raleway font-bold text-[#10172E]">
          {cancelModalTitle}
        </p>

        <p className="mt-3 text-[#656565]">
          {cancelModalBody}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={cancelLoading}
            onClick={() => setShowCancelConfirm(false)}
            className="w-full rounded-[50px] border border-[#439182] px-4 py-3 text-sm font-medium text-[#439182] hover:bg-[#439182]/10 sm:w-auto sm:min-w-[150px]"
          >
            {t("loanRepaymentOverview.cancelModalNo")}
          </button>

          <button
            type="button"
            disabled={cancelLoading}
            onClick={handleCancelPendingLoan}
            className={`w-full rounded-[50px] bg-red-500 px-4 py-3 text-sm font-medium text-white hover:opacity-80 sm:w-auto sm:min-w-[160px] ${
              cancelLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {cancelLoading ? (
              <LoadingSpinner />
            ) : (
              cancelModalYes
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (loanStatus === "PENDING") {
    return (
      <>
        <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
          <div className="rounded-full bg-[#439182]/10 px-4 py-2 text-sm font-semibold text-[#2D6157]">
            {t("loanRepaymentOverview.pendingBadge")}
          </div>
          <p className="text-[24px] font-raleway font-bold text-[#10172E]">
            {t("loanRepaymentOverview.pendingTitle")}
          </p>
          <p className="max-w-xl text-[#656565]">
            {t("loanRepaymentOverview.pendingBody")}
          </p>

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
              {cancelButtonText}
            </button>
          </div>
        </div>
        {cancelConfirmModal}
      </>
    );
  }

  if (isProcessingDisbursement) {
    return (
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
        <div className="rounded-full bg-[#439182]/10 px-4 py-2 text-sm font-semibold text-[#2D6157]">
          {t("loanRepaymentOverview.processingBadge")}
        </div>
        <p className="text-[24px] font-raleway font-bold text-[#10172E]">
          {t("loanRepaymentOverview.processingTitle")}
        </p>
        <p className="max-w-xl text-[#656565]">
          {t("loanRepaymentOverview.processingBody")}
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-2 rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80"
        >
          {t("loanRepaymentOverview.pendingDashboardButton")}
        </button>
      </div>
    );
  }

  if (isSuccessfulDisbursement) {
    return (
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
        <div className="rounded-full bg-[#439182]/10 px-4 py-2 text-sm font-semibold text-[#2D6157]">
          {t("loanRepaymentOverview.successfulBadge")}
        </div>
        <p className="text-[24px] font-raleway font-bold text-[#10172E]">
          {t("loanRepaymentOverview.successfulTitle")}
        </p>
        <p className="max-w-xl text-[#656565]">
          {t("loanRepaymentOverview.successfulBody")}
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-2 rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80"
        >
          {t("loanRepaymentOverview.pendingDashboardButton")}
        </button>
      </div>
    );
  }

  if (isFailedDisbursement) {
    return (
      <>
        <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
          <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            {t("loanRepaymentOverview.failedBadge")}
          </div>
          <p className="text-[24px] font-raleway font-bold text-[#10172E]">
            {t("loanRepaymentOverview.failedTitle")}
          </p>
          <p className="max-w-xl text-[#656565]">
            {t("loanRepaymentOverview.failedBody")}
          </p>

          {bankUpdateError && (
            <p className="text-red-500" role="alert">
              {bankUpdateError}
            </p>
          )}

          {bankUpdateSuccess && (
            <p className="text-green-500" role="status">
              {bankUpdateSuccess}
            </p>
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

          {formError && (
            <p className="text-red-500" role="alert">
              {formError || t("loanRepaymentOverview.formError")}
            </p>
          )}

          {formSuccess && (
            <p className="text-green-500" role="status">
              {formSuccess || t("loanRepaymentOverview.processingSuccess")}
            </p>
          )}

          {showBankUpdateForm && (
            <form
              onSubmit={handleBankDetailsUpdate}
              className="mt-2 flex w-full max-w-xl flex-col gap-4 text-left"
            >
              <div>
                <label
                  htmlFor="failed-loan-account-number"
                  className="mb-1 block text-sm font-medium text-[#222]"
                >
                  {t("loanRepaymentOverview.bankAccountLabel")}
                </label>
                <input
                  id="failed-loan-account-number"
                  name="account_number"
                  type="text"
                  value={bankUpdateData.account_number}
                  onChange={handleBankUpdateInputChange}
                  className="w-full rounded-lg border border-[rgba(0,0,0,0.15)] p-3 text-[#222] focus:border-[#439182] focus:outline-none"
                  placeholder={t(
                    "loanRepaymentOverview.bankAccountPlaceholder",
                  )}
                />
                {bankUpdateErrors.account_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {bankUpdateErrors.account_number}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="failed-loan-bank"
                  className="mb-1 block text-sm font-medium text-[#222]"
                >
                  {t("loanRepaymentOverview.bankNameLabel")}
                </label>
                <select
                  id="failed-loan-bank"
                  name="bank_code"
                  value={bankUpdateData.bank_code}
                  onChange={handleBankSelectChange}
                  className="w-full rounded-lg border border-[rgba(0,0,0,0.15)] bg-white p-3 text-[#222] focus:border-[#439182] focus:outline-none"
                >
                  <option value="">
                    {t("loanRepaymentOverview.bankNamePlaceholder")}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                {(bankUpdateErrors.bank_name || bankUpdateErrors.bank_code) && (
                  <p className="mt-1 text-sm text-red-600">
                    {bankUpdateErrors.bank_name || bankUpdateErrors.bank_code}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={bankUpdateLoading}
                  className={`rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80 ${
                    bankUpdateLoading
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  {bankUpdateLoading ? (
                    <LoadingSpinner />
                  ) : (
                    t("loanRepaymentOverview.bankUpdateButton")
                  )}
                </button>
                <button
                  type="button"
                  disabled={bankUpdateLoading}
                  onClick={() => setShowBankUpdateForm(false)}
                  className="rounded-[50px] border border-[#439182] px-6 py-3 font-medium text-[#439182] hover:bg-[#439182]/10"
                >
                  {t("loanRepaymentOverview.bankUpdateCancelButton")}
                </button>
              </div>
            </form>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-2 flex w-full max-w-xl flex-col gap-3 text-left"
          >
            <label className="text-[#222]" htmlFor="failed-loan-password">
              {t("loanRepaymentOverview.passwordLabel")}
            </label>
            <div className="relative w-full">
              <input
                id="failed-loan-password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("loanRepaymentOverview.passwordPlaceholder")}
                className="w-full rounded-lg border border-[rgba(0,0,0,0.15)] p-3 pr-12 text-[#222] focus:border-[#439182] focus:outline-none"
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
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password?.message}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className={`rounded-[50px] bg-[#439182] px-6 py-3 text-center font-medium text-white hover:opacity-80 ${
                loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                t("loanRepaymentOverview.confirmAgainButton")
              )}
            </button>
          </form>

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setShowBankUpdateForm((prev) => !prev)}
              className="rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80"
            >
              {t("loanRepaymentOverview.bankUpdateToggleButton")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-[50px] border border-[#439182] px-6 py-3 font-medium text-[#439182] hover:bg-[#439182]/10"
            >
              {t("loanRepaymentOverview.pendingDashboardButton")}
            </button>
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
              {cancelButtonText}
            </button>
          </div>
        </div>
        {cancelConfirmModal}
      </>
    );
  }

  if (loanStatus && loanStatus !== "APPROVED") {
    return (
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col items-center gap-4 rounded-[12px] bg-white p-6 text-center lg:my-16">
        <p className="text-[24px] font-raleway font-bold text-[#10172E]">
          {t("loanRepaymentOverview.statusUnavailableTitle")}
        </p>
        <p className="max-w-xl text-[#656565]">
          {t("loanRepaymentOverview.statusUnavailableBody", {
            status: loanDetails.status,
          })}
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-2 rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white hover:opacity-80"
        >
          {t("loanRepaymentOverview.noPendingButton")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-[95%] mx-auto md:w-[80%] flex flex-col gap-3 pb-12 lg:bg-white lg:mr-34 rounded-[12px] lg:p-6 lg:my-16 border-[rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-2">
          <div className="my-6 lg:flex lg:items-center">
            {loanStatus !== "APPROVED" && (
              <button
                className="cursor-pointer ml-2"
                aria-label="Go Back"
                onClick={handleBackArrowClick}
              >
                <img src={BackArrow} alt="back arrow" />
              </button>
            )}
            <p className="text-[24px] text-center font-raleway font-bold md:text-[28px] py-12 flex-1 ">
              {t("loanRepaymentOverview.title")}
            </p>
          </div>

          {cancelError && (
            <p className="text-red-500 mb-3 text-center" role="alert">
              {cancelError}
            </p>
          )}

          {cancelSuccess && (
            <p className="text-green-500 mb-3 text-center" role="status">
              {cancelSuccess}
            </p>
          )}

          {formError && (
            <p className="text-red-500 mb-3 text-center">
              {formError || t("loanRepaymentOverview.formError")}
            </p>
          )}

          {formSuccess && (
            <p className="text-green-500 mb-3 text-center">
              {formSuccess || t("loanRepaymentOverview.formSuccess")}
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
              {loanDetails?.bank_account?.account_name || "N/A"} (
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

            <button
              type="button"
              disabled={loading || cancelLoading}
              onClick={() => setShowCancelConfirm(true)}
              className={`text-center w-full rounded-[50px] border border-red-500 text-red-500 my-2 font-medium py-3 px-3 hover:bg-red-50 transition-colors duration-300 ${
                loading || cancelLoading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
            >
              {cancelButtonText}
            </button>
          </form>
        </div>
      </div>
      {showApprovalModal && (
        <LoanApprovalModal
          data={loanDetails} // Pass loanDetails to the modal
        />
      )}

      {cancelConfirmModal}
    </>
  );
}
