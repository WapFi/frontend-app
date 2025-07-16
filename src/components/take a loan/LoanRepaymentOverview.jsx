// import LoadingSpinner from "../LoadingSpinner";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { confirmLoanApplication } from "../../api/apiData";

// export default function LoanRepaymentOverview() {
//   const location = useLocation();
//   const apiResponse = location.state;

//   const navigate = useNavigate();
//   const schema = yup.object({
//     password: yup
//       .string()
//       .required("Please enter your password")
//       .min(8, "Password must be at least 8 characters"),
//   });

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

//   const [loading, setLoading] = useState(false);
//   const [formError, setFormError] = useState(false);

//   const onSubmit = async (passwordData) => {
//     setLoading(true);
//     setFormError(false);

//     try {
//       const response = await confirmLoanApplication(
//         apiResponse._id,
//         passwordData.password
//       );

//       setTimeout(() => {
//         navigate("/take-a-loan/loan-approval-modal", { state: apiResponse });
//       }, 2000);
//     } catch (error) {
//       console.log("Something went wrong: ", error);
//       setFormError(true);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="w-[95%] mx-auto md:w-[80%] flex flex-col gap-3 pb-12 lg:bg-white lg:mr-34 rounded-[12px] lg:p-6 lg:my-16 border-[rgba(0,0,0,0.08)]">
//       <div className="flex flex-col gap-2">
//         <p className="text-[24px] text-center font-raleway font-bold md:text-[28px] py-12">
//           Loan Terms & Repayment Overview
//         </p>

//         <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
//           <span className="text-[rgba(34,34,34,0.50)]">
//             How much would you like to borrow?
//           </span>
//           <span className="font-medium">
//             ₦{apiResponse.loan_amount || "N/A"}
//           </span>
//         </p>
//         <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
//           <span className="text-[rgba(34,34,34,0.50)]">
//             Loan Repayment Term
//           </span>
//           <span className="font-medium">
//             {apiResponse.loan_term_months}{" "}
//             {apiResponse.loan_term_months === 1 ? " month" : " months"}
//           </span>
//         </p>
//         <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
//           <span className="text-[rgba(34,34,34,0.50)]">
//             Monthly Repayment (Plastics)
//           </span>
//           <span className="font-medium">
//             {apiResponse.monthly_payment_plastic_kg} kg
//           </span>
//         </p>
//         <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
//           <span className="text-[rgba(34,34,34,0.50)]">
//             Total Plastics to Repay
//           </span>
//           <span className="font-medium">
//             {apiResponse.total_plastic_to_repay_kg} kg
//           </span>
//         </p>
//         <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
//           <span className="text-[rgba(34,34,34,0.50)]">Disbursement To</span>
//           <span className="font-medium">
//             {apiResponse.disbursement_account}
//           </span>
//         </p>
//         <p className="text-[#9C6D10] font-medium">
//           {apiResponse.early_repayment_incentive}
//         </p>
//       </div>
//       <div className="flex flex-col gap-2 my-6">
//         <p className="text-[#2D6157] pb-3">
//           By entering your password, you confirm acceptance of the loan terms
//           and authorize disbursement to the selected bank account.
//         </p>

//         {formError && (
//           <p className="text-red-500 mb-3">
//             Something went wrong. Please try again.
//           </p>
//         )}

//         <label className="text-[#222] gap-2">
//           Password <br />
//           <input
//             {...register("password")}
//             type="password"
//             placeholder="Enter your password"
//             className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px] my-3"
//           />
//         </label>
//         {errors.password && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.password?.message}
//           </p>
//         )}

//         <form>
//           <button
//             disabled={loading}
//             type="submit"
//             onClick={handleSubmit(onSubmit)}
//             className={`text-center w-full rounded-[50px] text-[#FFF] my-4 font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
//               loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
//             }`}
//           >
//             {loading ? <LoadingSpinner /> : "Confirm and Receive Loan"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import BackArrow from "../../assets/back arrow.svg";
import LoanApprovalModal from "./LoanApprovalModal";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoanForm } from "../../context/LoanFormContext";
import LoanDetails from "../dashboard/LoanDetails";
import { confirmLoanApplication } from "../../api/apiData";

export default function LoanRepaymentOverview() {
  // const { attemptNavigation } = useLoanForm();
  const { loanFormData, clearLoanFormData, loanConfirmationData } =
    useLoanForm();

  const account_name = loanFormData.account_name;

  const { t } = useTranslation();
  // const location = useLocation();
  // const apiResponse = location.state;
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBackArrowClick = () => {
    // Explicitly go back to the summary step of the form
    navigate("/take-a-loan/form/loan-form-summary");
  };
  const onSubmit = async (passwordData) => {
    console.log(loanConfirmationData);
    setLoading(true);
    setFormError(false);

    try {
      await confirmLoanApplication(
        loanConfirmationData._id,
        passwordData.password
      );
      clearLoanFormData();
      setShowApprovalModal(true); // Show modal on success
      // console.log("In overview page");
      // console.log(loanConfirmationData._id);
    } catch (error) {
      setFormError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowApprovalModal(false);
    navigate("/dashboard");
  };

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
            {/* <span className="font-medium">
              ₦{apiResponse.loan_amount || "N/A"}
              
            </span> */}
            <span className="font-medium">
              {
                loanConfirmationData?.loan_amount != null // Safely access loan_amount
                  ? new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 2,
                    }).format(loanConfirmationData.loan_amount)
                  : "N/A" // Placeholder if data is not available
              }
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.loanTerm")}
            </span>
            {/* <span className="font-medium">
              {apiResponse.loan_term_months}{" "}
              {apiResponse.loan_term_months === 1
                ? t("loanRepaymentOverview.oneMonth")
                : t("loanRepaymentOverview.months")}
            </span> */}
            <span className="font-medium">
              {loanConfirmationData?.loan_term_months != null // Safely access loan_term_months
                ? `${loanConfirmationData.loan_term_months} ${
                    loanConfirmationData.loan_term_months === 1
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
            {/* <span className="font-medium">
              {apiResponse.monthly_payment_plastic_kg} kg
            </span> */}
            <span className="font-medium">
              {loanConfirmationData?.monthly_payment_plastic_kg != null // Safely access
                ? `${loanConfirmationData.monthly_payment_plastic_kg} kg`
                : "N/A"}
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.totalPlastics")}
            </span>
            {/* <span className="font-medium">
              {apiResponse.total_plastic_to_repay_kg} kg
            </span> */}
            <span className="font-medium">
              {loanConfirmationData?.total_plastic_to_repay_kg != null // Safely access
                ? `${loanConfirmationData.total_plastic_to_repay_kg} kg`
                : "N/A"}
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.disbursementTo")}
            </span>
            <span className="font-medium">
              {account_name} (
              {loanConfirmationData?.disbursement_account || "N/A"})
            </span>
          </p>
          <p className="text-[#9C6D10] font-medium">
            {/* {apiResponse.early_repayment_incentive} */}
            {loanConfirmationData?.early_repayment_incentive || ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 my-6">
          <p className="text-[#2D6157] pb-3">
            {t("loanRepaymentOverview.confirmationNotice")}
          </p>

          {formError && (
            <p className="text-red-500 mb-3">
              {t("loanRepaymentOverview.formError")}
            </p>
          )}

          <label className="text-[#222] gap-2">
            {t("loanRepaymentOverview.passwordLabel")} <br />
            {/* <input
              {...register("password")}
              type="password"
              placeholder={t("loanRepaymentOverview.passwordPlaceholder")}
              className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px] my-3"
            /> */}
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
                    {/* Eye off icon path */}
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
                    {/* Eye icon path */}
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

          <form>
            <button
              disabled={loading}
              type="submit"
              onClick={handleSubmit(onSubmit)}
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
          data={loanConfirmationData}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
