import { useNavigate } from "react-router-dom";
import NairaIcon from "../../assets/naira icon.svg";
import RepaymentsSection from "./RepaymentsSection";
import RepaymentProgressBar from "./RepaymentProgressBar";
import CountdownTimer from "./CountdownTimer";
import CreditScore from "./CreditScore";
import Overview from "./Overview";
import { useTranslation } from "react-i18next";
import { RepaymentsProvider } from "../../context/RepaymentsContext";

function Dashboard({ dashboardData }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRepaymentHistoryClick = () => {
    // retrieve loan ID and repayments
    const loanID = dashboardData.active_loan._id;

    // navigate to repayments history page and pass the loanID
    navigate(`/repayments/repayment-history/${loanID}`);
  };

  console.log("dashboard data: ", dashboardData);

  const dueDate = new Date(dashboardData.active_loan.due_date);
  const targetTime = dueDate.getTime();

  const initialTimeLeft = dashboardData.active_loan.time_left;

  return (
    <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
      <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
        {t("dashboard.title")}
      </p>

      {dashboardData.active_loan.status === "DISBURSED" && (
        <div className="rounded-xl flex flex-col self-start justify-center w-full items-start gap-6 border-[#008F4C] border-[1.2px] bg-[#fff] pt-6 pr-[18px] pb-8 pl-[18px]">
          {/* <div className="md:flex self-stretch items-center gap-4">
          <p>Time left to next repayment:</p>
          <p>Days</p>
        </div> */}
          <CountdownTimer
            targetTime={targetTime}
            initialDays={initialTimeLeft.days}
            initialHours={initialTimeLeft.hours}
            initialMinutes={initialTimeLeft.minutes}
            initialSeconds={initialTimeLeft.seconds}
          />
          <div className="flex flex-col flex-start gap-2">
            <p>{t("dashboard.outstandingLoanBalance")}</p>
            {/* <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="md:text-[24px] font-semibold">
                {dashboardData.active_loan.outstanding_balance}
              </p>
            </div> */}
            <div className="flex items-center gap-1">
              <img src={NairaIcon} alt="naira icon" />
              <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "decimal",

                  maximumFractionDigits: 2,
                }).format(dashboardData.active_loan.outstanding_balance)}
              </span>
            </div>
          </div>
          {/* <div className="relative">
          <p className="absolute left-[71%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
            <img src={NairaIcon} alt="naira icon" />
            <span>20,000</span>
          </p>
          <RepaymentProgressBar />
        </div> */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              {/* <p className="flex gap-1 items-center font-raleway font-medium text-[#444]">
              <img src={NairaIcon} alt="naira icon" />
              <span>20,000</span>
            </p> */}
            </div>
            <RepaymentProgressBar
              amountRepaid={dashboardData.active_loan.amount_paid}
              loanAmount={dashboardData.active_loan.loan_amount}
            />
          </div>
          {/* <div className="relative">
          <p className="absolute left-[71%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
            <img src={NairaIcon} alt="naira icon" />
            <span>20,000</span>
          </p>
          <RepaymentProgressBar />
        </div> */}

          <button
            className="text-[14px] flex self-end font-medium text-[#2D6157] cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => handleRepaymentHistoryClick()}
          >
            {t("dashboard.repaymentHistory")}
          </button>
        </div>
      )}

      {dashboardData.active_loan.status === "DISBURSED" && (
        <Overview
          totalLoanTaken={dashboardData.total_loans_taken}
          amountRepaid={dashboardData.amount_repaid}
          activeLoan={dashboardData.active_loan}
        />
      )}

      {/* <RepaymentsSection /> */}
      <RepaymentsProvider>
        <RepaymentsSection />
      </RepaymentsProvider>

      {/* Credit Score Section */}

      <CreditScore userCreditScore={dashboardData.credit_score} />
    </div>
  );
}

export default Dashboard;
