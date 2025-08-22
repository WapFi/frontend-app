// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// function DisbursedLoansList({ onSelect, loans }) { 
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     if (window.innerWidth < 1024) {
//       navigate(`/loans/disbursed-loans/${id}`);
//     } else {
//       onSelect?.(id);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-4 lg:w-[45%]">
//       {loans.length === 0 ? ( 
//         <p className="text-sm text-gray-500">
//           {/* {t("repaymentsList.noRepayments")} */}
//           No loans matched.
//         </p>
//       ) : (
        
//         [...loans]
//           .sort(
//             (a, b) =>
//               new Date(b.disbursement_date).getTime() -
//               new Date(a.disbursement_date).getTime()
//           )
//           .map((loan) => { 
//             const isCompleted = loan.status === "COMPLETED"; 
//             return (
//               <button
//                 key={loan._id} 
//                 onClick={() => handleClick(loan._id)}
//                 className={`${
//                   isCompleted ? "bg-[#fafafa]" : "bg-[#439182] text-white"
//                 } cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8`}
//               >
//                 <div
//                   className={`flex flex-col items-start gap-1 text-[16px] ${
//                     isCompleted ? "text-[#2C2C2C]" : ""
//                   }`}
//                 >
//                   <span className="font-medium text-[15px]">
//                     {loan.loan_id} 
//                   </span>
//                   <span className="text-[14px]">
//                     {new Date(loan.disbursement_date).toLocaleDateString(
//                       "en-US",
//                       {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       }
//                     )}
//                   </span>
//                 </div>

//                 <span
//                   className={`rounded-[16px] font-medium text-[12px] py-1 px-2 ${
//                     isCompleted
//                       ? "bg-[#323232] text-white"
//                       : "bg-white text-[#7D9776]"
//                   }`}
//                 >
//                   {isCompleted
//                     ? t("repaymentsList.statusCompleted")
//                     : t("repaymentsList.statusPending")}
//                 </span>

//                 <span
//                   className={`font-medium text-[16px] flex items-center gap-1 ${
//                     isCompleted ? "text-[#484747]" : "text-white"
//                   }`}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="14"
//                     height="13"
//                     viewBox="0 0 14 13"
//                     fill="currentColor"
//                   >
//                     <path
//                       d="M2.71429 11.5V2.37667C2.71423 2.18277 2.78041 1.99435 2.90245 1.84099C3.02448 1.68763 3.19545 1.57802 3.38851 1.52938C3.58157 1.48074 3.78578 1.49582 3.96907 1.57226C4.15235 1.64869 4.30433 1.78215 4.40114 1.95167L9.59886 11.0483C9.69567 11.2179 9.84765 11.3513 10.0309 11.4277C10.2142 11.5042 10.4184 11.5193 10.6115 11.4706C10.8045 11.422 10.9755 11.3124 11.0976 11.159C11.2196 11.0057 11.2858 10.8172 11.2857 10.6233V1.5M1 4.83333H13M1 8.16667H13"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   <span className="md:text-[20px]">
//                     {loan.loan_amount.toLocaleString()} 
//                   </span>
//                 </span>
//               </button>
//             );
//           })
//       )}
//     </div>
//   );
// }

// export default DisbursedLoansList;

// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// function DisbursedLoansList({ onSelect, loans, selectedLoanId, isLargeScreen }) {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     if (window.innerWidth < 1024) {
//       navigate(`/loans/disbursed-loans/${id}`);
//     } else {
//       onSelect?.(id);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-4 lg:w-[45%]">
//       {loans.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           No loans matched.
//         </p>
//       ) : (
//         [...loans]
//           .sort(
//             (a, b) =>
//               new Date(b.disbursement_date).getTime() -
//               new Date(a.disbursement_date).getTime()
//           )
//           .map((loan) => {
//             const isCompleted = loan.status === "COMPLETED";
//             const isSelected = loan._id === selectedLoanId;
//             
//             // Corrected logic to prevent blurring on initial mobile render
//             const isBlurred = isLargeScreen ? !isSelected : selectedLoanId && !isSelected;

//             return (
//               <button
//                 key={loan._id}
//                 onClick={() => handleClick(loan._id)}
//                 className={`
//                   ${isCompleted ? "bg-[#fafafa]" : "bg-[#439182] text-white"}
//                   cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8
//                   ${isBlurred ? "opacity-50" : ""}
//                 `}
//               >
//                 <div
//                   className={`flex flex-col items-start gap-1 text-[16px] ${
//                     isCompleted ? "text-[#2C2C2C]" : ""
//                   }`}
//                 >
//                   <span className="font-medium text-[15px]">
//                     {loan.loan_id}
//                   </span>
//                   <span className="text-[14px]">
//                     {new Date(loan.disbursement_date).toLocaleDateString(
//                       "en-US",
//                       {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       }
//                     )}
//                   </span>
//                 </div>

//                 <span
//                   className={`rounded-[16px] font-medium text-[12px] py-1 px-2 ${
//                     isCompleted
//                       ? "bg-[#323232] text-white"
//                       : "bg-white text-[#7D9776]"
//                   }`}
//                 >
//                   {isCompleted
//                     ? t("repaymentsList.statusCompleted")
//                     : t("repaymentsList.statusPending")}
//                 </span>

//                 <span
//                   className={`font-medium text-[16px] flex items-center gap-1 ${
//                     isCompleted ? "text-[#484747]" : "text-white"
//                   }`}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="14"
//                     height="13"
//                     viewBox="0 0 14 13"
//                     fill="currentColor"
//                   >
//                     <path
//                       d="M2.71429 11.5V2.37667C2.71423 2.18277 2.78041 1.99435 2.90245 1.84099C3.02448 1.68763 3.19545 1.57802 3.38851 1.52938C3.58157 1.48074 3.78578 1.49582 3.96907 1.57226C4.15235 1.64869 4.30433 1.78215 4.40114 1.95167L9.59886 11.0483C9.69567 11.2179 9.84765 11.3513 10.0309 11.4277C10.2142 11.5042 10.4184 11.5193 10.6115 11.4706C10.8045 11.422 10.9755 11.3124 11.0976 11.159C11.2196 11.0057 11.2858 10.8172 11.2857 10.6233V1.5M1 4.83333H13M1 8.16667H13"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   <span className="md:text-[20px]">
//                     {loan.loan_amount.toLocaleString()}
//                   </span>
//                 </span>
//               </button>
//             );
//           })
//       )}
//     </div>
//   );
// }

// export default DisbursedLoansList;


import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function DisbursedLoansList({ onSelect, loans, selectedLoanId, isLargeScreen }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (id) => {
    if (window.innerWidth < 1024) {
      navigate(`/loans/disbursed-loans/${id}`);
    } else {
      onSelect?.(id);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 lg:w-[45%]">
      {loans.length === 0 ? (
        <p className="text-sm text-gray-500">
          {t("disbursedLoansList.noResultsMessage")}
        </p>
      ) : (
        [...loans]
          .sort(
            (a, b) =>
              new Date(b.disbursement_date).getTime() -
              new Date(a.disbursement_date).getTime()
          )
          .map((loan) => {
            const isCompleted = loan.status === "COMPLETED";
            const isSelected = loan._id === selectedLoanId;
            
            // Corrected logic to prevent blurring on initial mobile render
            const isBlurred = isLargeScreen ? !isSelected : selectedLoanId && !isSelected;

            return (
              <button
                key={loan._id}
                onClick={() => handleClick(loan._id)}
                className={`
                  ${isCompleted ? "bg-[#fafafa]" : "bg-[#439182] text-white"}
                  cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8
                  ${isBlurred ? "opacity-50" : ""}
                `}
              >
                <div
                  className={`flex flex-col items-start gap-1 text-[16px] ${
                    isCompleted ? "text-[#2C2C2C]" : ""
                  }`}
                >
                  <span className="font-medium text-[15px]">
                    {loan.loan_id}
                  </span>
                  <span className="text-[14px]">
                    {new Date(loan.disbursement_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                <span
                  className={`rounded-[16px] font-medium text-[12px] py-1 px-2 ${
                    isCompleted
                      ? "bg-[#323232] text-white"
                      : "bg-white text-[#7D9776]"
                  }`}
                >
                  {isCompleted
                    ? t("disbursedLoansList.statusCompleted")
                    : t("disbursedLoansList.statusPending")}
                </span>

                <span
                  className={`font-medium text-[16px] flex items-center gap-1 ${
                    isCompleted ? "text-[#484747]" : "text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="currentColor"
                  >
                    <path
                      d="M2.71429 11.5V2.37667C2.71423 2.18277 2.78041 1.99435 2.90245 1.84099C3.02448 1.68763 3.19545 1.57802 3.38851 1.52938C3.58157 1.48074 3.78578 1.49582 3.96907 1.57226C4.15235 1.64869 4.30433 1.78215 4.40114 1.95167L9.59886 11.0483C9.69567 11.2179 9.84765 11.3513 10.0309 11.4277C10.2142 11.5042 10.4184 11.5193 10.6115 11.4706C10.8045 11.422 10.9755 11.3124 11.0976 11.159C11.2196 11.0057 11.2858 10.8172 11.2857 10.6233V1.5M1 4.83333H13M1 8.16667H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="md:text-[20px]">
                    {loan.loan_amount.toLocaleString()}
                  </span>
                </span>
              </button>
            );
          })
      )}
    </div>
  );
}

export default DisbursedLoansList;