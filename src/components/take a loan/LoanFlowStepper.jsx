// import { useLocation } from "react-router-dom";
// import React from "react";

// export default function LoanFlowStepper() {
//   const location = useLocation();

//   const steps = [
//     {
//       path: "/take-a-loan/form/loan-amount-purpose",
//       label: "Loan Amount & Purpose"
//     },
//     {
//       path: "/take-a-loan/form/bank-account-confirmation",
//       label: "Bank Account Confirmation"
//     },
//     {
//       path: "/take-a-loan/form/loan-repayment-method",
//       label: "Loan Repayment Understanding"
//     },
//     {
//       path: "/take-a-loan/form/loan-form-summary",
//       label: "Summary"
//     }
//   ];

//   // Find the index of the current active step based on the URL
//   const currentIndex = steps.findIndex(step =>
//     location.pathname.startsWith(step.path)
//   );

//   return (
//     <div className="flex flex-col items-center w-full">
//       <p className="text-center text-[#10172E] text-[24px] my-7 lg:my-14 font-raleway font-bold md:text-[28px]">
//         Take a Loan
//       </p>

//       {/* Container for step labels */}
//       <div className="flex justify-between w-[98%] mx-auto md:w-[95%] mb-4">
//         {steps.map((step, index) => (
//           <div
//             key={step.label}
//             className={`
//               flex-1 text-center text-sm md:text-[16px] font-medium
//               ${index <= currentIndex ? 'text-[#439182]' : 'text-[#444]'}
//               px-1 // Add some horizontal padding to prevent text overlap
//             `}
//           >
//             {step.label}
//           </div>
//         ))}
//       </div>

//       {/* Container for circles and connecting lines */}
//       <div className="flex w-[90%] mx-auto md:w-[75%] items-center relative">
//         {/* Background line (optional, but can help with consistency) */}
//         {/* <div className="absolute left-0 right-0 h-1 bg-[#E6E6E6] z-0 mx-4" /> */}

//         {steps.map((step, index) => {
//           const isCompleted = index < currentIndex;
//           const isActive = index === currentIndex;
//           const isCurrentOrCompleted = index <= currentIndex; // For coloring current and completed circles/lines

//           return (
//             <React.Fragment key={step.label}>
//               {/* Connecting Line (before the circle, for all but the first circle) */}
//               {index > 0 && (
//                 <div
//                   className={`
//                     flex-1 h-0.5 transition-colors duration-300 ease-in-out
//                     ${isCurrentOrCompleted ? 'bg-[#2D6157]' : 'bg-[#E3E3E3]'}
//                     // Negative margins to ensure line connects seamlessly
//                     -ml-1 -mr-1 md:-ml-2 md:-mr-2
//                   `}
//                 />
//               )}

//               {/* Step Circle */}
//               <div
//                 className={`
//                   flex items-center justify-center font-heebo rounded-full z-10 shrink-0
//                   w-8 h-8 md:w-10 md:h-10
//                   text-sm md:text-base font-medium transition-colors duration-300 ease-in-out
//                   ${isCurrentOrCompleted ? 'bg-[#2D6157] text-white' : 'bg-[#E3E3E3] text-[#444]'}
//                 `}
//               >
//                 {index + 1}
//               </div>
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
import { useLocation } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";
import BackArrow from "../../assets/back arrow.svg";
// import { useLoanForm } from "../../context/LoanFormContext";
import { useNavigate } from "react-router-dom";

export default function LoanFlowStepper() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const location = useLocation();
  // const { attemptNavigation } = useLoanForm();

  const handleBackArrowClick = () => {
    navigate(-1);
  };

  const steps = [
    {
      path: "/take-a-loan/form/loan-amount-purpose",
      label: t("loanStepper.steps.loanAmountPurpose"),
    },
    {
      path: "/take-a-loan/form/bank-account-confirmation",
      label: t("loanStepper.steps.bankAccountConfirmation"),
    },
    {
      path: "/take-a-loan/form/loan-repayment-method",
      label: t("loanStepper.steps.loanRepaymentMethod"),
    },
    {
      path: "/take-a-loan/form/loan-form-summary",
      label: t("loanStepper.steps.summary"),
    },
  ];

  const currentIndex = steps.findIndex((step) =>
    location.pathname.startsWith(step.path)
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="my-6 w-full lg:flex lg:items-center">
        <button
          className="cursor-pointer ml-6 lg:ml-12"
          aria-label="Go Back"
          onClick={handleBackArrowClick}
        >
          <img src={BackArrow} alt="back arrow" />
        </button>
        <p className="flex-1 text-center text-[#10172E] text-[24px] pt-9 pb-16 lg:py-0 lg:my-14 font-raleway font-bold md:text-[28px]">
          {t("loanStepper.title")}
        </p>
        {/* <div>for symmetry</div> */}
      </div>

      {/* Step Labels (Desktop Only) */}
      <div className="hidden md:flex justify-between w-[98%] mx-auto md:w-[95%] mb-4">
        {steps.map((step, index) => {
          return (
            <div
              key={step.label}
              className={`
                flex-1 text-center text-sm md:text-[16px] font-medium
                ${index <= currentIndex ? "text-[#439182]" : "text-[#444]"}
                px-1
              `}
            >
              {step.label}
            </div>
          );
        })}
      </div>

      {/* Step Circles and Lines */}
      {/* Changed w-[90%] mx-auto to w-full px-4 for better mobile edge spacing */}
      <div className="flex w-full px-4 items-center relative md:w-[75%] md:px-0">
        {steps.map((step, index) => {
          const isCurrentOrCompleted = index <= currentIndex;
          const isActive = index === currentIndex; // Re-declare isActive for use here

          // Determine specific positioning for active mobile labels
          let mobileLabelPositionClasses = "";
          if (index === 0) {
            // For the first step, align to the left
            mobileLabelPositionClasses = "left-0 text-left";
          } else if (index === steps.length - 1) {
            // For the last step, align to the right
            mobileLabelPositionClasses = "right-0 text-right";
          } else {
            // For middle steps, keep centered
            mobileLabelPositionClasses =
              "left-1/2 -translate-x-1/2 text-center";
          }

          return (
            <React.Fragment key={step.label}>
              {index > 0 && (
                <div
                  className={`
                    flex-1 h-0.5 transition-colors duration-300 ease-in-out
                    ${isCurrentOrCompleted ? "bg-[#2D6157]" : "bg-[#E3E3E3]"}
                    -ml-1 -mr-1 md:-ml-2 md:-mr-2
                  `}
                />
              )}
              {/* Individual Step Container - now relative for label positioning */}
              <div className="relative flex flex-col items-center">
                {/* Mobile Label (positioned absolutely above the circle) */}
                {isActive && (
                  <div
                    className={`
                      absolute bottom-full mb-4 // Positions above, with a small margin
                      text-sm md:text-[16px] font-medium whitespace-nowrap
                      text-[#439182] // Always active color for the displayed label
                      block md:hidden // Only show on mobile
                      ${mobileLabelPositionClasses} // Apply dynamic positioning
                    `}
                    style={{ minWidth: "max-content" }} // Ensures label takes at least necessary width
                  >
                    {step.label}
                  </div>
                )}
                <div
                  className={`
                    flex items-center justify-center font-heebo rounded-full z-10 shrink-0
                    w-8 h-8 md:w-10 md:h-10
                    text-sm md:text-base font-medium transition-colors duration-300 ease-in-out
                    ${
                      isCurrentOrCompleted
                        ? "bg-[#2D6157] text-white"
                        : "bg-[#E3E3E3] text-[#444]"
                    }
                  `}
                >
                  {index + 1}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
