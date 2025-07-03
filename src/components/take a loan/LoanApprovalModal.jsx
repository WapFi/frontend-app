// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// export default function LoanApprovalModal() {
//   const location = useLocation();
//   const data = location.state;
//   const navigate = useNavigate();
//   console.log(data);

//   // I would like to navigate to dashboard after 2 seconds or when user clicks on anywhere on the screen

//   // Effect for automatic navigation after 2 seconds
//   useEffect(() => {
//     setTimeout(() => {
//       navigate("/dashboard"); // Navigate to dashboard after 2 seconds
//     }, 2000); // 2000 milliseconds = 2 seconds
//   }, []);

//   return (
//     <div className="w-[95%] mx-auto md:w-[80%] flex flex-col gap-6 lg:bg-white rounded-[12px] lg:text-[28px] lg:border-[rgba(0,0,0,0.08)] pt-40 pb-16 lg:px-5 lg:pt-50 lg:mt-30 lg:pb-22">
//       <p className="text-[#222] font-semibold text-center text-[18px] lg:text-[28px]">
//         Loan Approved & Sent!
//       </p>
//       <p className="text-center text-[14px] md:text-[22px] text-[rgba(34,34,34,0.70)]">
//         Your loan of ₦ has been successfully disbursed to your
//         bank account. You'll repay with{" "}
//         <span className="text-[#2D6157] font-semibold">
//           kg of recyclable plastics
//         </span>{" "}
//         based on your selected repayment plan.
//       </p>
//     </div>
//   );
// }

// import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LoanApprovalModal({ data, onClose }) {
  const { t } = useTranslation();
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onClose();
  //   }, 4000);
  //   return () => clearTimeout(timer);
  // }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-full p-6 text-center relative pt-30 md:w-[75%] md:mx-auto lg:pt-40 lg:pb-24">
        <p className="text-[#222] font-semibold text-center text-[18px] py-4 lg:text-[28px]">
          {t("loanApprovalModal.title")}
        </p>
        <p className="text-center text-[14px] md:text-[22px] text-[rgba(34,34,34,0.70)]">
          Your loan of ₦ has been successfully disbursed
          to your bank account. You'll repay with{" "}
          <span className="text-[#2D6157] font-semibold">
            kg of recyclable plastics
          </span>{" "}
          based on your selected repayment plan.
          {t("loanApprovalModal.message", {
            loan_amount: data.loan_amount || "",
            total_plastic_to_repay_kg: data.total_plastic_to_repay_kg || "",
          })}
        </p>
      </div>
    </div>
  );
}
