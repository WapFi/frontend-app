import plusIcon from "../../assets/plus icon.svg";
import { Link } from "react-router-dom";
import NairaIcon from "../../assets/naira icon.svg";
import CreditScore from "./CreditScore";

function New_User_Dashboard() {
  return (
    <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
      <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
        Dashboard
      </p>
      {/* <Overview /> */}
      <div className="hidden rounded-xl md:flex md:flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
        <p className="font-raleway font-semibold md:text-[24px]">Overview</p>
        <div className="flex items-start gap-6 self-stretch">
          <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
            <p className="text-[16px] text-[#888] font-medium">
              Total Loan Taken
            </p>
            <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="text-[30px]">0.00</p>
            </div>
            <p className="text-[14px] text-[#666]">
              Last Loan: None – You haven't taken any loans yet
            </p>
          </div>

          <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
            <p className="text-[16px] text-[#888] font-medium">Amount Repaid</p>
            <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="text-[30px]">0.00</p>
            </div>
            <p className="text-[14px] text-[#666]">
              Repayment History: 0 of 0 completed
            </p>
          </div>

          <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
            <p className="text-[16px] text-[#888] font-medium">Active Loan</p>
            <div className="flex items-center gap-2">
              <img src={NairaIcon} alt="Naira Icon" />
              <p className="text-[30px]">0.00</p>
            </div>
            <p className="text-[14px]">Due by: — (No current loan)</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
        {/* DESKTOP HEADER */}
        <div className="hidden md:flex justify-between items-start self-stretch w-full">
          <div className="flex justify-between items-center md:w-[45%] relative">
            <p className="font-raleway font-semibold md:text-[24px]">
              Repayments
            </p>
            <div className="ml-3.5 relative">
              <div className="flex md:items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
                <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                  {selectedMonth
                    ? new Date(`${selectedMonth}-01`).toLocaleString(
                        "default",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Select Month"}
                </p>
                <span
                  className="block p-4 rounded-[50%] bg-[#E6E6E6] cursor-pointer"
                  onClick={() => setShowCalendar((prev) => !prev)}
                >
                  <img src={calendarIcon} alt="calendar icon" />
                </span>
              </div>

              {showCalendar && (
                <div className="absolute left-0 mt-2 z-50 bg-white border p-2 rounded shadow-md">
                  <input
                    type="month"
                    className="text-sm outline-none border-none"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:w-[50%] flex justify-between items-center gap-4">
            <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full md:w-[60%] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
              <input
                type="search"
                placeholder="Search Loan ID and Amount...."
                className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
              />
              <button className="cursor-pointer">
                <img src={searchIcon} alt="search icon" />
              </button>
            </div>
            <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold shrink-0">
              View All
            </Link>
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="flex flex-col md:hidden w-full">
          <div className="flex justify-between items-center self-stretch mb-4">
            <p className="font-raleway font-semibold text-[24px]">Repayment</p>
            <Link className="text-[14px] md:text-[16px] text-[#2D6157] text-center font-semibold">
              View All
            </Link>
          </div>

          <div className="flex items-center justify-between gap-2.5 pl-3 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
            <input
              type="search"
              placeholder="Search Loan ID and Amount...."
              className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
            />
            <button className="cursor-pointer">
              <img src={searchIcon} alt="search icon" />
            </button>
          </div>
        </div>
        <div className="text-[18px] flex flex-col justify-center items-center gap-6">
          <p className="text-[#222] text-center">
            You haven’t taken any loans yet. Apply now to get started!
          </p>
          <button className="cursor-pointer flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6">
            <img src={plusIcon} alt="plus icon" />{" "}
            <span className="text-white text-[16px] font-medium">
              Take a Loan
            </span>
          </button>
        </div>
      </div>

      <CreditScore />
    </div>
  );
}

export default New_User_Dashboard;
