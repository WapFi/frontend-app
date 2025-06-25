// import BVNUnverified from "./BVNUnverified";
// import BVNVerified from "./BVNVerified";
// import AddressUnverified from "./AddressUnverified";
// import AddressVerified from "./AddressVerified";
// import CreditScoreStarIcon from "../../assets/credit score star icon.svg";

// function CreditScore() {
//   const requiredScore = 100;
//   const currentScore = 100; // Change this to test

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
//       };
//     } else if (currentScore === 19) {
//       return {
//         tier: "Tier 1",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//       };
//     } else if (currentScore === 60) {
//       return {
//         tier: "Tier 2",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//       };
//     } else if (currentScore === 100) {
//       return {
//         tier: "Tier 2",
//         progressColor: "#2D6157",
//         tierBadgeStyles:
//           "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
//       };
//     }
//   })();

//   // ➕ Calculate knob position at tip of progress ring
//   const centerX = 150.5;
//   const centerY = 150.5;
//   const progress = currentScore / requiredScore;
//   const angle = progress * 2 * Math.PI - Math.PI / 2;
//   const knobX = centerX + radius * Math.cos(angle);
//   const knobY = centerY + radius * Math.sin(angle);

//   return (
//     <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start md:gap-0 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
//       <div className="flex items-center justify-between w-full">
//         <div className="flex items-center gap-2">
//           <img src={CreditScoreStarIcon} alt="credit score star icon" />
//           <p className="md:text-[24px] font-raleway font-semibold">
//             Credit Score
//           </p>
//         </div>
//         <p className="text-[#BB8C2D] md:text-[24px]">{currentScore}</p>
//       </div>

//       <div className="flex flex-col items-center self-stretch gap-6 md:flex-row md:items-end md:justify-between">
//         <div className="flex flex-col items-center gap-6">
//           <div className="relative flex items-center justify-center">
//             <svg
//               width="360"
//               height="360"
//               viewBox="0 0 360 360"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               {/* Updated center values since SVG is now 360x360 */}
//               <circle
//                 cx="180"
//                 cy="180"
//                 r={radius}
//                 stroke="#43918236"
//                 strokeWidth={strokeWidth}
//                 fill="none"
//               />
//               <circle
//                 cx="180"
//                 cy="180"
//                 r={radius}
//                 stroke={tierInfo.progressColor}
//                 strokeWidth={strokeWidth}
//                 fill="none"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={strokeDashoffset}
//                 strokeLinecap="round"
//                 transform="rotate(-90 180 180)"
//                 style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
//               />
//               {/* Recalculate knob position using new center */}
//               <circle
//                 cx={180 + radius * Math.cos(angle)}
//                 cy={180 + radius * Math.sin(angle)}
//                 className="block md:hidden"
//                 r="13.8"
//                 fill="#fff"
//                 stroke="#2D6157"
//                 strokeWidth="2"
//               />
//               <text
//                 x={180 + radius * Math.cos(angle)}
//                 y={180 + radius * Math.sin(angle) + 1}
//                 className="block md:hidden"
//                 textAnchor="middle"
//                 dominantBaseline="central"
//                 fontSize="13.5"
//                 fill="#fff"
//                 stroke="#2D6157"
//                 strokeWidth="1"
//               >
//                 {currentScore}
//               </text>

//               <circle
//                 cx={180 + radius * Math.cos(angle)}
//                 cy={180 + radius * Math.sin(angle)}
//                 className="hidden md:block"
//                 r="20.93"
//                 fill="#fff"
//                 stroke="#2D6157"
//                 strokeWidth="2"
//               />
//               <text
//                 x={180 + radius * Math.cos(angle)}
//                 y={180 + radius * Math.sin(angle) + 1}
//                 className="hidden md:block"
//                 textAnchor="middle"
//                 dominantBaseline="central"
//                 fontSize="19.108"
//                 fontWeight="400"
//                 fill="#2D6157"
//               >
//                 {currentScore}
//               </text>
//             </svg>

//             <div className="absolute flex flex-col items-center mr-4">
//               <div
//                 className={`${tierInfo.tierBadgeStyles} px-3 py-1 mb-2 font-medium`}
//               >
//                 {tierInfo.tier}
//               </div>
//               <p className="text-[12px] text-[#888] font-medium text-center md:text-[18px]">
//                 Total Credit
//               </p>
//               <p className="md:text-[48px] font-medium text-[#222] text-right">
//                 {currentScore}
//               </p>
//             </div>
//           </div>
//           <p className="text-center text-[#444] text-[16px] font-medium uppercase md:text-[20px]">
//             {requiredScore} to the next level
//           </p>
//         </div>

//         {currentScore === 0 && <BVNUnverified />}
//         {currentScore === 19 && <BVNVerified />}
//         {currentScore === 60 && <AddressUnverified />}
//         {currentScore === 100 && <AddressVerified />}
//       </div>
//     </div>
//   );
// }

// export default CreditScore;

import BVNUnverified from "./BVNUnverified";
import BVNVerified from "./BVNVerified";
import AddressUnverified from "./AddressUnverified";
import AddressVerified from "./AddressVerified";
import CreditScoreStarIcon from "../../assets/credit score star icon.svg";
// import { fetchDashboardData } from "../../api/mockApi";
import { useTranslation } from "react-i18next";

function CreditScore({ userCreditScore }) {
  // console.log(userCreditScore);
  const tier = userCreditScore.tier;

  const { t } = useTranslation();

  // const [scoreData, setScoreData] = useState(null);

  // useEffect(() => {
  //   fetchDashboardData().then((res) => {
  //     if (res.status) {
  //       setScoreData(res.data.creditScore);
  //     }
  //   });
  // }, []);

  // if (!scoreData) return <p>{t("creditScore.loading")}</p>;

  // const { current_score, tier, next_tier_threshold } = scoreData;

  const radius = 135.8;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const progress =
    userCreditScore.current_score / userCreditScore.next_tier_threshold;
  const strokeDashoffset = circumference * (1 - progress);

  const angle = progress * 2 * Math.PI - Math.PI / 2;

  const tierInfo = {
    tier: `Tier ${userCreditScore.tier}`,
    progressColor: "#2D6157",
    tierBadgeStyles:
      "text-[#B08D57] border border-[#B08D57] text-[12px] md:text-[14px] bg-[rgba(176,141,87,0.14)] rounded-[21.333px]",
  };

  return (
    <div className="rounded-xl flex flex-col self-stretch justify-center w-full items-start md:gap-0 border-[rgba(255,255,255,0.80)] border-1 bg-[#fff] p-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <img src={CreditScoreStarIcon} alt="credit score star icon" />
          <p className="md:text-[24px] font-raleway font-semibold">
            {t("creditScore.title")}
          </p>
        </div>
        <p className="text-[#BB8C2D] md:text-[24px]">
          {userCreditScore.current_score}
        </p>
      </div>

      <div className="flex flex-col items-center self-stretch gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg
              width="360"
              height="360"
              viewBox="0 0 360 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="180"
                cy="180"
                r={radius}
                stroke="#43918236"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx="180"
                cy="180"
                r={radius}
                stroke={tierInfo.progressColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 180 180)"
                style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
              />

              {/* Small knob on circle path */}
              <circle
                cx={180 + radius * Math.cos(angle)}
                cy={180 + radius * Math.sin(angle)}
                className="block md:hidden"
                r="13.8"
                fill="#fff"
                stroke="#2D6157"
                strokeWidth="2"
              />
              <text
                x={180 + radius * Math.cos(angle)}
                y={180 + radius * Math.sin(angle) + 1}
                className="block md:hidden"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13.5"
                fill="#fff"
                stroke="#2D6157"
                strokeWidth="1"
              >
                {userCreditScore.current_score}
              </text>

              <circle
                cx={180 + radius * Math.cos(angle)}
                cy={180 + radius * Math.sin(angle)}
                className="hidden md:block"
                r="20.93"
                fill="#fff"
                stroke="#2D6157"
                strokeWidth="2"
              />
              <text
                x={180 + radius * Math.cos(angle)}
                y={180 + radius * Math.sin(angle) + 1}
                className="hidden md:block"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="19.108"
                fontWeight="400"
                fill="#2D6157"
              >
                {userCreditScore.current_score}
              </text>
            </svg>

            <div className="absolute flex flex-col items-center mr-4">
              <div
                className={`${tierInfo.tierBadgeStyles} px-3 py-1 mb-2 font-medium`}
              >
                {tierInfo.tier}
              </div>
              <p className="text-[12px] text-[#888] font-medium text-center md:text-[18px]">
                {t("creditScore.totalCredit")}
              </p>
              <p className="md:text-[48px] font-medium text-[#222] text-right">
                {userCreditScore.current_score}
              </p>
            </div>
          </div>

          <p className="text-center text-[#444] text-[16px] font-medium uppercase md:text-[20px]">
            {userCreditScore.next_tier_threshold}{" "}
            {t("creditScore.nextLevelSuffix")}
          </p>
        </div>

        {tier === 0 && <BVNUnverified />}
        {tier === 1 && <BVNVerified />}
        {tier === 2 && <AddressUnverified />}
        {tier >= 3 && <AddressVerified />}
      </div>
    </div>
  );
}

export default CreditScore;
