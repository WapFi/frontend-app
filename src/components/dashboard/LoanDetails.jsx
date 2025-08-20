


import calendarIcon from "../../assets/calendar icon.svg";
import NairaIcon from "../../assets/naira icon.svg";
import defaultBankLogo from "../../assets/default bank logo.png";
import DateDisplay from "./DateDisplay";
import RepaymentProgressBar from "./RepaymentProgressBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import banks from "../../data/banks.json";

function LoanDetails({ loanDetails }) {
 
  if (!loanDetails || !loanDetails.data) {
    console.log("LoanDetails is not available yet, rendering null.");
    return null; 
  }

  console.log("loan details: ", loanDetails)
  console.log("loan amount: ", loanDetails.data.loan_amount)

  const { data } = loanDetails;
  
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRepaymentHistoryClick = () => {
    const loanID = data.loan_id;
    navigate(`/repayments/repayment-history/${loanID}`);
  };

  // Find the bank object based on the bank name from loanDetails
  const bankInfo = banks.find(
    (bank) =>
      bank.name.toLowerCase() ===
      data.bank_account.bank_name.toLowerCase()
  );

  // Get the logo URL, or a default if not found
  const bankLogoUrl = bankInfo ? bankInfo.logo : defaultBankLogo;

  return (
    <div className="w-full lg:flex lg:flex-col lg:gap-14 lg:w-[50%]">
      <div className="bg-white md:bg-[#fafafa] flex flex-col gap-12 px-3.5 md:px-[18px] py-[22px] rounded-[24px]">
        <div className="flex justify-between items-center self-stretch">
          <p className="font-raleway text-[#222] rounded-[24px] md:rounded-[12px] text-[18px] font-semibold md:text-[20px] flex flex-col items-start">
            {t("loanDetails.title")}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-medium text-[rgba(34,34,34,0.80)] md:text-[16px]">
              {data.loan_id}
            </span>
            <span className="rounded-[16px] bg-white font-medium text-[#7D9776] border border-[#7D9776] text-[12px] px-1.5 py-0.5">
              {data.status}
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-5.5">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              {t("loanDetails.paymentMethod")}
            </p>
            <p className="md:text-[22px] text-[#222] font-medium">
              {data.repayment_method}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              {t("loanDetails.disbursedTo")}
            </p>

            <div className="w-25 h-10 flex items-center justify-center overflow-hidden">
              <img
                src={bankLogoUrl}
                alt={`${data.bank_account.bank_name} logo`}
                className="w-full object-contain"
              />
            </div>
            <p className="text-[12px] md:text-[14px] text-[#222] font-medium uppercase">
              {data.bank_account.bank_name}
            </p>
          </div>
          <div>
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              {t("loanDetails.amount")}
            </p>
            <div className="flex items-center gap-1 font-medium">
              <img src={NairaIcon} alt="naira icon" />
              <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "decimal",
                  maximumFractionDigits: 2,
                }).format(data.loan_amount)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#F9F9F9] border border-[rgba(255,255,255,0.16)] rounded-[12px] self-stretch py-4 px-3 md:bg-[rgba(255,255,255,0.83)] md:border-[rgba(255,255,255,0.68)]">
          <p className="text-[#242424] text-[18px]">
            {t("loanDetails.repaymentProgress")}
          </p>
          <div className="relative">
            <RepaymentProgressBar
              totalloanAmount={data.loan_amount + data.interest_amount}
              amountRepaid={data.amount_paid}
            />
          </div>
          <button
            role="button"
            tabIndex={0}
            onClick={() => handleRepaymentHistoryClick()}
            className="text-[14px] text-right flex font-medium text-[#2D6157] cursor-pointer justify-self-end"
          >
            {t("loanDetails.repaymentHistory")}
          </button>
        </div>
        <div className="flex justify-between items-center py-[12px] bg-[#f9f9f9] self-stretch rounded-xl border border-[rgba(255,255,255,0.68)]">
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">
              {t("loanDetails.term")}
            </p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              {data.loan_term_months}
            </p>
          </div>
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">
              {t("loanDetails.startDate")}
            </p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              {new Date(data.disbursement_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">
              {t("loanDetails.dueDate")}
            </p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              {new Date(data.due_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <p className="text-[rgba(34,34,34,0.50)]">
          {t("loanDetails.loanPurpose")}{" "}
          <span className="text-[#222]">{data.loan_purpose}</span>
        </p>
      </div>
    </div>
  );
}

export default LoanDetails;
