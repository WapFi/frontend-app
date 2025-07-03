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

import LoanApprovalModal from "./LoanApprovalModal";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function LoanRepaymentOverview() {
  const { t } = useTranslation();
  const location = useLocation();
  const apiResponse = location.state;
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
  } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const onSubmit = async (passwordData) => {
    setLoading(true);
    setFormError(false);

    try {
      await confirmLoanApplication(apiResponse._id, passwordData.password);
      setShowApprovalModal(true); // Show modal on success
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
          <p className="text-[24px] text-center font-raleway font-bold md:text-[28px] py-12">
            {t("loanRepaymentOverview.title")}
          </p>

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
              ₦{apiResponse.loan_amount || "N/A"}
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.loanTerm")}
            </span>
            <span className="font-medium">
              {apiResponse.loan_term_months}{" "}
              {apiResponse.loan_term_months === 1
                ? t("loanRepaymentOverview.oneMonth")
                : t("loanRepaymentOverview.months")}
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.monthlyRepayment")}
            </span>
            <span className="font-medium">
              {apiResponse.monthly_payment_plastic_kg} kg
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.totalPlastics")}
            </span>
            <span className="font-medium">
              {apiResponse.total_plastic_to_repay_kg} kg
            </span>
          </p>
          <p className="flex justify-between text-[#222] text-[14px] md:text-[16px]">
            <span className="text-[rgba(34,34,34,0.50)]">
              {t("loanRepaymentOverview.disbursementTo")}
            </span>
            <span className="font-medium">
              {apiResponse.disbursement_account}
            </span>
          </p>
          <p className="text-[#9C6D10] font-medium">
            {apiResponse.early_repayment_incentive}
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
            <input
              {...register("password")}
              type="password"
              placeholder={t("loanRepaymentOverview.passwordPlaceholder")}
              className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px] my-3"
            />
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
        <LoanApprovalModal data={apiResponse} onClose={handleModalClose} />
      )}
    </>
  );
}
