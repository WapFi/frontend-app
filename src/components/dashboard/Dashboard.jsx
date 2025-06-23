// import { Link } from "react-router-dom";
// import Layout from "./layout/Layout";
// import NairaIcon from "../../assets/naira icon.svg";
// import CreditProgress from "../../assets/credit progress icon.svg";
// import CreditScoreStarIcon from "../../assets/credit score star icon.svg";

// function Dashboard() {
//     const requiredScore = 19;
//     currentScore = 0;
//     // stroke length is current score / required score
//   return (
//     // <Layout />
//     <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-[23px]">
//       <p className="font-raleway font-semibold text-[32px] self-start">
//         Dashboard
//       </p>
//       <div className="rounded-xl flex flex-col self-start justify-center w-full items-start gap-6 border-[#008F4C] border-[1.2px] bg-[#fff] pt-6 pr-[18px] pb-8 pl-[18px]">
//         <div className="md:flex self-stretch items-center gap-4">
//           <p>Time left to next repayment:</p>
//           <p>Days</p>
//         </div>
//         <div className="flex flex-col flex-start gap-2">
//           <p>Outstanding Loan Balance</p>
//           <div className="flex items-center gap-2">
//             <img src={NairaIcon} alt="Naira Icon" />
//             <p className="md:text-[24px] font-semibold">2000</p>
//           </div>
//         </div>
//         <Link className="text-[14px] flex self-end font-medium text-[#2D6157]">
//           Repayment History
//         </Link>
//       </div>

//       <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         <p className="font-raleway font-semibold text-[24px]">Overview</p>
//         <div className="flex items-start gap-6 self-stretch">
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">
//               Total Loan Taken
//             </p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />

//               <p className="text-[30px]">40000</p>
//             </div>
//             <p className="text-[14px] text-[#666]">Last Loan:</p>
//           </div>
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">Amount Repaid</p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />

//               <p className="text-[30px]">40000</p>
//             </div>
//             <p className="text-[14px] text-[#666]">Repayment History:</p>
//           </div>
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">
//               Total Loan Taken
//             </p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />

//               <p className="text-[30px]">40000</p>
//             </div>
//             <p className="text-[14px] text-[#EA0000]">Due by:</p>
//           </div>
//         </div>
//       </div>
//       {/*
//       <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         <div>
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">Repayments</p>
//             <div></div>
//           </div>
//           <p>Repayment history goes here</p>
//         </div>
//         <div>
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">Repayments</p>
//             <div></div>
//           </div>
//           <p>Loan details goes here</p>
//         </div>
//       </div> */}
//       <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         <div>
//           <div>
//             <img src={CreditScoreStarIcon} alt="credit score star icon" />
//             <p className="text-[24px]">Credit score</p>
//           </div>
//           <p className="text-[#BB8C2D] md:text-[24px]">80</p>
//         </div>
//         <div>
//           <div>
//             {/* credit progress ring */}
//             <img src={CreditProgress} alt="credit score ellipse" />
//             <div>
//               <p></p>
//               <p></p>
//               <p></p>
//             </div>
//             <p></p>
//           </div>
//           {/* <div>
//             <p></p>
//             <div></div>
//             <div></div>
//             <div></div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// import { Link } from "react-router-dom";
// import Layout from "./layout/Layout";
// import NairaIcon from "../../assets/naira icon.svg";
// import CreditScoreStarIcon from "../../assets/credit score star icon.svg";
// import BVNUnverified from "./BVNUnverified";
// import BVNVerified from "./BVNVerified";
// import AddressUnverified from "./AddressUnverified";
// import AddressVerified from "./AddressVerified";

// function Dashboard() {
//   const requiredScore = 100;
//   const currentScore = 100;

//   const progressPercentage = (currentScore / requiredScore) * 100;

//   const size = 301;
//   const strokeWidth = 20;
//   const radius = 135.8;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference * (1 - progressPercentage / 100);

//   const tierInfo = (() => {
//     if (currentScore === 0) {
//       return {
//         tier: "Tier 0",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//         // message: "Verify Your BVN to Unlock Loan Access",
//         // nextLevel: "19 TO THE NEXT LEVEL",
//       };
//     } else if (currentScore === 19) {
//       return {
//         tier: "Tier 1",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//         // message: "Complete BVN Verification to Unlock Tier 2",
//         // nextLevel: "60 TO COMPLETE",
//       };
//     } else if (currentScore === 60) {
//       return {
//         tier: "Tier 2",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//         // message:
//         //   "Tier 2 Incomplete – Verify NIN, BVN and Address to Access ₦50,000 Loans",
//         // nextLevel: "100 TO COMPLETE",
//       };
//     } else if (currentScore === 100) {
//       return {
//         tier: "Tier 2",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//         // message:
//         //   "Tier 2 Incomplete – Verify NIN, BVN and Address to Access ₦50,000 Loans",
//         // nextLevel: "100 TO COMPLETE",
//       };
//     }
//   })();

//   return (
//     <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-[23px]">
//       <p className="font-raleway font-semibold text-[32px] self-start">
//         Dashboard
//       </p>

//       <div className="rounded-xl flex flex-col self-start justify-center w-full items-start gap-6 border-[#008F4C] border-[1.2px] bg-[#fff] pt-6 pr-[18px] pb-8 pl-[18px]">
//         <div className="md:flex self-stretch items-center gap-4">
//           <p>Time left to next repayment:</p>
//           <p>Days</p>
//         </div>
//         <div className="flex flex-col flex-start gap-2">
//           <p>Outstanding Loan Balance</p>
//           <div className="flex items-center gap-2">
//             <img src={NairaIcon} alt="Naira Icon" />
//             <p className="md:text-[24px] font-semibold">2000</p>
//           </div>
//         </div>
//         <Link className="text-[14px] flex self-end font-medium text-[#2D6157]">
//           Repayment History
//         </Link>
//       </div>

//       <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start gap-6 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         <p className="font-raleway font-semibold md:text-[24px]">Overview</p>
//         <div className="flex items-start gap-6 self-stretch">
//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">
//               Total Loan Taken
//             </p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               <p className="text-[30px]">40000</p>
//             </div>
//             <p className="text-[14px] text-[#666]">Last Loan:</p>
//           </div>

//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">Amount Repaid</p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               <p className="text-[30px]">40000</p>
//             </div>
//             <p className="text-[14px] text-[#666]">Repayment History:</p>
//           </div>

//           <div className="flex flex-col justify-center items-start gap-2.5 py-[22px] px-6 grow shrink-0 basis-0 rounded-xl shadow-sm ring-1 ring-[#ECECEE]">
//             <p className="text-[16px] text-[#888] font-medium">
//               Total Loan Taken
//             </p>
//             <div className="flex items-center gap-2">
//               <img src={NairaIcon} alt="Naira Icon" />
//               <p className="text-[30px]">40000</p>
//             </div>
//             <p className="text-[14px] text-[#EA0000]">Due by:</p>
//           </div>
//         </div>
//       </div>

//       {/* Credit Score Section */}
//       <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start md:gap-0 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//         <div className="flex items-center justify-between w-full">
//           <div className="flex items-center gap-2">
//             <img src={CreditScoreStarIcon} alt="credit score star icon" />
//             <p className="md:text-[24px] font-raleway font-semibold">
//               Credit Score
//             </p>
//           </div>
//           <p className="text-[#BB8C2D] md:text-[24px]">{currentScore}</p>
//         </div>

//         <div className="flex flex-col items-center self-stretch gap-6 md:flex-row md:items-end md:justify-between">
//           <div className="flex flex-col items-center gap-6">
//             <div className="relative flex items-center justify-center">
//               <svg
//                 width="301"
//                 height="301"
//                 viewBox="0 0 301 301"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="transform -rotate-90"
//               >
//                 {/* Background Ring */}
//                 <circle
//                   cx="150.5"
//                   cy="150.5"
//                   r={radius}
//                   stroke="#43918236"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                 />

//                 {/* Progress Ring */}
//                 <circle
//                   cx="150.5"
//                   cy="150.5"
//                   r={radius}
//                   stroke="#2D6157"
//                   strokeWidth={strokeWidth}
//                   fill="none"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={strokeDashoffset}
//                   strokeLinecap="round"
//                   style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
//                 />
//               </svg>

//               <div className="absolute flex flex-col items-center">
//                 <div
//                   className={`${tierInfo.tierBadgeStyles} px-3 py-1 mb-2 font-medium`}
//                 >
//                   {tierInfo.tier}
//                 </div>
//                 <p className="text-[12px] text-[#888] font-medium text-center md:text-[18px]">
//                   Total Credit
//                 </p>
//                 <p className="md:text-[48px] font-medium text-[#222]">
//                   {currentScore}
//                 </p>
//               </div>
//             </div>
//             <p className="text-center text-[#444] text-[16px] font-medium uppercase md:text-[20px]">
//               {requiredScore} to the next level
//             </p>
//           </div>

//           {/* <p>Tier 0 – Verify Your BVN to Unlock Loan Access</p> */}
//           {/* <div>
//               <p className="text-xl font-medium mb-2">{tierInfo.message}</p>
//               <p className="text-lg font-semibold text-gray-600">{tierInfo.nextLevel}</p>
//             </div> */}

//           {/* <div className="flex flex-col gap-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-base">BVN Verification</span>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   currentScore > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                 }`}>
//                   {currentScore > 0 ? '✓ Completed' : '○ Unverified'}
//                 </span>
//               </div>

//               {currentScore >= 60 && (
//                 <>
//                   <div className="flex items-center justify-between">
//                     <span className="text-base">NIN Verification</span>
//                     <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
//                       ✓ Completed
//                     </span>
//                   </div>

//                   {currentScore >= 80 && (
//                     <div className="flex items-center justify-between">
//                       <span className="text-base">Address Verification</span>
//                       <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
//                         ⏳ Pending
//                       </span>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div> */}
//           {currentScore === 0 && <BVNUnverified />}
//           {currentScore === 19 && <BVNVerified />}
//           {currentScore === 60 && <AddressUnverified />}
//           {currentScore === 100 && <AddressVerified />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { Link } from "react-router-dom";
import NairaIcon from "../../assets/naira icon.svg";
import RepaymentsSection from "./RepaymentsSection";
import RepaymentProgressBar from "./RepaymentProgressBar";
import New_User_Dashboard from "./New_User_Dashboard";
import CountdownTimer from "./CountdownTimer";
import CreditScore from "./CreditScore";
import Overview from "./Overview";
import { fetchDashboardData } from "../../api/mockApi";
import { useState, useEffect } from "react";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then((res) => {
      if (res.status) {
        setDashboardData(res.data);
      }
    });
  }, []);

  if (!dashboardData?.activeLoan?.due_date) return <p>Loading...</p>;

  const dueDate = new Date(dashboardData.activeLoan.due_date);
  const targetTime = dueDate.getTime(); // milliseconds

  const { totalLoanTaken, amountRepaid, activeLoan, creditScore } =
    dashboardData;

  return (
    <div className="text-[18px] text-[#222] flex flex-col items-end md:items-start md:shrink-0 gap-8 py-4 px-2.5 lg:px-[23px]">
      <p className="font-raleway font-semibold text-[24px] md:text-[32px] self-start">
        Dashboard
      </p>

      <div className="rounded-xl flex flex-col self-start justify-center w-full items-start gap-6 border-[#008F4C] border-[1.2px] bg-[#fff] pt-6 pr-[18px] pb-8 pl-[18px]">
        {/* <div className="md:flex self-stretch items-center gap-4">
          <p>Time left to next repayment:</p>
          <p>Days</p>
        </div> */}
        <CountdownTimer targetTime={targetTime} />
        <div className="flex flex-col flex-start gap-2">
          <p>Outstanding Loan Balance</p>
          <div className="flex items-center gap-2">
            <img src={NairaIcon} alt="Naira Icon" />
            <p className="md:text-[24px] font-semibold">
              {activeLoan.outstanding_balance}
            </p>
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
          <RepaymentProgressBar />
        </div>
        {/* <div className="relative">
          <p className="absolute left-[71%] md:left-[74%] top-[30%] flex gap-1 items-center font-raleway font-medium text-[#444]">
            <img src={NairaIcon} alt="naira icon" />
            <span>20,000</span>
          </p>
          <RepaymentProgressBar />
        </div> */}

        <Link className="text-[14px] flex self-end font-medium text-[#2D6157]">
          Repayment History
        </Link>
      </div>

      <Overview />

      <RepaymentsSection />

      {/* Credit Score Section */}

      <CreditScore />
    </div>
  );
}

export default Dashboard;
