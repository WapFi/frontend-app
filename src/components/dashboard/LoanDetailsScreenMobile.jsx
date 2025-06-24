// import { useParams, useNavigate } from "react-router-dom";
// import LoanDetails from "./LoanDetails";
// import calendarIcon from "../../assets/calendar icon.svg";

// function LoanDetailsScreen() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   return (
//     <div className="p-4 flex flex-col gap-4">
//       <div className="flex justify-between items-center mb-14">
//         <p className="font-raleway font-semibold text-[24px]">Repayments</p>
//         <div className="ml-3.5 flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
//           <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
//             May 2025
//           </p>
//           <span className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer">
//             <img src={calendarIcon} alt="calendar icon" />
//           </span>
//         </div>
//       </div>

//       <LoanDetails loanId={id} isVisible={true} />
//       <button
//         onClick={() => navigate(-1)}
//         className="text-[#2D6157] text-[14px] mt-4 underline"
//       >
//         ← Back
//       </button>
//     </div>
//   );
// }

// export default LoanDetailsScreen;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoanDetails from "./LoanDetails";
import calendarIcon from "../../assets/calendar icon.svg";
import DateDisplay from "./DateDisplay";
import { fetchRepayments } from "../../api/mockApi";

function LoanDetailsScreenMobile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [repayments, setRepayments] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(id);

  useEffect(() => {
    fetchRepayments().then((res) => {
      if (res.status) {
        setRepayments(res.data.repayments);
      }
    });
  }, []);

  const filteredRepayments = selectedMonth
    ? repayments.filter((repayment) => {
        const date = new Date(repayment.repayment_date);
        const monthString = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthString === selectedMonth;
      })
    : [];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-14 relative">
        <p className="font-raleway font-semibold text-[24px]">Repayments</p>

        <div className="ml-3.5 relative">
          <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
            <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
              {selectedMonth
                ? new Date(`${selectedMonth}-01`).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : "Select Month"}
            </p>
            <span
              className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
              onClick={() => setShowCalendar((prev) => !prev)}
            >
              <img src={calendarIcon} alt="calendar icon" />
            </span>
          </div>

          {/* {showCalendar && (
            <div className="absolute w-[150px] right-0 mt-2 z-50 bg-white border p-2 rounded shadow-md">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setShowCalendar(false);
                }}
                className="text-sm outline-none border-none"
              />
            </div>
          )} */}
          {showCalendar && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setShowCalendar(false);
              }}
              className="absolute right-0 mt-2 z-50 bg-white border rounded w-[160px] h-[40px] text-sm"
            />
          )}
        </div>
      </div>

      {/* Repayment Buttons */}
      <div className="flex flex-col gap-4">
        {filteredRepayments.length === 0 && selectedMonth ? (
          <p className="text-sm text-gray-500">No repayments for this month.</p>
        ) : (
          filteredRepayments.map((repayment) => (
            <button
              key={repayment._id}
              onClick={() => setSelectedLoanId(repayment.loan._id)}
              className={`${
                repayment.status === "VERIFIED"
                  ? "bg-[#fafafa] text-[#2C2C2C]"
                  : "bg-[#439182] text-white"
              } cursor-pointer rounded-[24px] flex justify-between items-center self-stretch py-[12px] px-[15px] gap-4 md:gap-8`}
            >
              <div className="flex flex-col items-start gap-1 text-[16px]">
                <span className="font-medium text-[15px]">
                  {repayment.loan._id}
                </span>
                <span className="text-[14px]">
                  {new Date(repayment.repayment_date).toLocaleDateString(
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
                className={`rounded-[16px] ${
                  repayment.status === "VERIFIED"
                    ? "bg-[#323232] text-white"
                    : "bg-white text-[#7D9776]"
                } font-medium text-[12px] py-1 px-2`}
              >
                {repayment.status === "VERIFIED" ? "Completed" : "Pending"}
              </span>

              <span
                className={`font-medium flex items-center text-[16px] gap-1 ${
                  repayment.status === "VERIFIED"
                    ? "text-[#484747]"
                    : "text-white"
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
                  {repayment.amount_paid.toLocaleString()}
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      {selectedLoanId && (
        <LoanDetails loanId={selectedLoanId} isVisible={true} />
      )}

      <button
        onClick={() => navigate(-1)}
        className="text-[#2D6157] text-[14px] mt-4 underline"
      >
        ← Back
      </button>
    </div>
  );
}

export default LoanDetailsScreenMobile;
