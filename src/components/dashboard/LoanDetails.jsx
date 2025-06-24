import calendarIcon from "../../assets/calendar icon.svg";
import NairaIcon from "../../assets/naira icon.svg";
import AccessBankLogo from "../../assets/access bank logo.svg";
import DateDisplay from "./DateDisplay";
import RepaymentProgressBar from "./RepaymentProgressBar";
import { Link } from "react-router-dom";

function LoanDetails() {
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
            Loan Details
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-medium text-[rgba(34,34,34,0.80)] md:text-[16px]">
              # 012 -012{" "}
            </span>
            <span className="rounded-[16px] bg-white font-medium text-[#7D9776] border border-[#7D9776] text-[12px] px-1.5 py-0.5">
              Pending
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-5.5">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              Payment Method
            </p>
            <p className="md:text-[22px] text-[#222] font-medium">
              Recyclables
            </p>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              Disbursed To
            </p>
            <img src={AccessBankLogo} alt="bank logo" />
            <p className="text-[12px] md:text-[14px] text-[#222] font-medium uppercase">
              Access Bank
            </p>
          </div>
          <div>
            <p className="text-[12px] md:text-[16px] text-[rgba(34,34,34,0.50)]">
              Amount
            </p>
            <div className="flex gap-2">
              <img src={NairaIcon} alt="naira icon" />{" "}
              <span className="block md:text-[22px] text-[#222] font-medium">
                20,000
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#F9F9F9] border border-[rgba(255,255,255,0.16)] rounded-[12px] self-stretch py-4 px-3 md:bg-[rgba(255,255,255,0.83)] md:border-[rgba(255,255,255,0.68)]">
          <p className="text-[#242424] text-[18px]">Repayment Progress</p>
          <div className="relative">
            {/* <p className="absolute left-[67%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
              <img src={NairaIcon} alt="naira icon" />
              <span>20,000</span>
            </p> */}
            <RepaymentProgressBar />
          </div>

          <Link className="text-[14px] text-right block font-medium text-[#2D6157]">
            Repayment History
          </Link>
        </div>
        <div className="flex justify-between items-center py-[12px] bg-[#f9f9f9] self-stretch rounded-xl border border-[rgba(255,255,255,0.68)]">
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">Term</p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              3 months
            </p>
          </div>
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">Start Date</p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              <DateDisplay />
            </p>
          </div>
          <div>
            <p className="text-[rgba(34,34,34,0.50)] text-[14px]">Due Date</p>
            <p className="text-[#222] font-medium text-[14px] md:text-[18px]">
              July 15, 2025
            </p>
          </div>
        </div>
        <p className="text-[rgba(34,34,34,0.50)]">
          Loan Purpose: <span className="text-[#222]">School Fees</span>
        </p>
      </div>
    </div>
  );
}

export default LoanDetails;
