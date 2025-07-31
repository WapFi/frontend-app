import calendarIcon from "../../assets/calendar icon.svg";
import NairaIcon from "../../assets/naira icon.svg";
import defaultBankLogo from "../../assets/default bank logo.png";
import DateDisplay from "./DateDisplay";
import RepaymentProgressBar from "./RepaymentProgressBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import banks from "../../data/banks.json";

function LoanDetails({ loanDetails }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRepaymentHistoryClick = () => {
    // retrieve loan ID and repayments
    const loanID = loanDetails.data._id;

    // navigate to repayments history page and pass the loanID
    navigate(`/repayments/repayment-history/${loanID}`);
  };

  // Find the bank object based on the bank name from loanDetails
  const bankInfo = banks.find(
    (bank) =>
      bank.name.toLowerCase() ===
      loanDetails.data.bank_account.bank_name.toLowerCase()
  );

  // Get the logo URL, or a default if not found
  const bankLogoUrl = bankInfo ? bankInfo.logo : defaultBankLogo;

  return (
    <div className="w-full lg:flex lg:flex-col lg:gap-14 lg:w-[50%]">
      {/* <div className="flex justify-between items-center">
        <p className="font-raleway font-semibold text-[24px]">Repayments</p>
        <div className="ml-3.5 flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
          <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
            May 2025
          </p>
          <span className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer">
            <img src={calendarIcon} alt="calendar icon" />
          </span>
        </div>
      </div> */}
      <div className="bg-white md:bg-[#fafafa] flex flex-col gap-12 px-3.5 md:px-[18px] py-[22px] rounded-[24px]">
        <div className="flex justify-between items-center self-stretch">
          <p className="font-raleway text-[#222] rounded-[24px] md:rounded-[12px] text-[18px] font-semibold md:text-[20px] flex flex-col items-start">
            {t("loanDetails.title")}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-medium text-[rgba(34,34,34,0.80)] md:text-[16px]">
              {loanDetails.data._id}
            </span>
            <span className="rounded-[16px] bg-white font-medium text-[#7D9776] border border-[#7D9776] text-[12px] px-1.5 py-0.5">
              {loanDetails.data.status}
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-5.5">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              {t("loanDetails.paymentMethod")}
            </p>
            <p className="md:text-[22px] text-[#222] font-medium">
              {loanDetails.data.repayment_method}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              {t("loanDetails.disbursedTo")}
            </p>

            <div className="w-25 h-10 flex items-center justify-center overflow-hidden">
              {/* Container for consistent sizing */}
              <img
                src={bankLogoUrl}
                alt={`${loanDetails.data.bank_account.bank_name} logo`}
                className="w-full object-contain" // Ensures image fits within container without distortion
              />
            </div>

            {/* <img
              src={bankLogoUrl}
              alt={`${loanDetails.data.bank_account.bank_name} logo`}
              className="max-w-full max-h-full object-contain"
            /> */}
            <p className="text-[12px] md:text-[14px] text-[#222] font-medium uppercase">
              {loanDetails.data.disbursement_account}
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
                }).format(loanDetails.data.loan_amount)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#F9F9F9] border border-[rgba(255,255,255,0.16)] rounded-[12px] self-stretch py-4 px-3 md:bg-[rgba(255,255,255,0.83)] md:border-[rgba(255,255,255,0.68)]">
          <p className="text-[#242424] text-[18px]">
            {" "}
            {t("loanDetails.repaymentProgress")}
          </p>
          <div className="relative">
            {/* <p className="absolute left-[67%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
              <img src={NairaIcon} alt="naira icon" />
              <span>20,000</span>
            </p> */}
            {/* {loanDetails && <RepaymentProgressBar loanDetails={loanDetails} />} */}

            {loanDetails && loanDetails.data && (
              <RepaymentProgressBar
                loanAmount={loanDetails.data.loan_amount}
                amountRepaid={loanDetails.data.amount_paid}
              />
            )}
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
              {loanDetails.data.loan_term_months}
            </p>
          </div>
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">
              {t("loanDetails.startDate")}
            </p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              {new Date(loanDetails.data.disbursement_date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">
              {" "}
              {t("loanDetails.dueDate")}
            </p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              {new Date(loanDetails.data.due_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <p className="text-[rgba(34,34,34,0.50)]">
          {t("loanDetails.loanPurpose")}{" "}
          <span className="text-[#222]">{loanDetails.data.loan_purpose}</span>
        </p>
      </div>
    </div>
  );
}

export default LoanDetails;
