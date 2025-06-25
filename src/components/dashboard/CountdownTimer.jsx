// import colonIcon from "../../assets/colon icon.svg";

// function CountdownTimer() {
//   return (
//     <div className="md:flex justify-between self-stretch">
//       <p className="lg:w-[33%] 2xl:w-[20%] lg:flex lg:self-center">Time left to next payment:</p>
//       {/* <p>
//         <span>30 Days</span> :<span>05 Hours</span> :<span>10 Miniutes</span> :
//         <span>15 Seconds</span> :
//       </p> */}
//       <div className="flex gap-4 justify-center border w-full items-center md:justify-between">
//         <div className="text-[#222] flex flex-col items-center justify-center md:flex-row md:gap-2">
//           <p className="text-[18px] font-semibold md:text-[24px]">30</p>
//           <p className="text-[12px] font-medium md:text-[18px]">Days</p>
//         </div>
//         <img src={colonIcon} alt="time colon icon" />
//         <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
//           <p className="text-[18px] font-semibold md:text-[24px]">05</p>
//           <p className="text-[12px] font-medium md:text-[18px]">Hours</p>
//         </div>
//         <img src={colonIcon} alt="time colon icon" />
//         <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
//           <p className="text-[18px] font-semibold md:text-[24px]">10</p>
//           <p className="text-[12px] font-medium md:text-[18px]">Minutes</p>
//         </div>
//         <img src={colonIcon} alt="time colon icon" />
//         <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
//           <p className="text-[18px] font-semibold md:text-[24px]">15</p>
//           <p className="text-[12px] font-medium md:text-[18px]">Seconds</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CountdownTimer;

import { useEffect, useState } from "react";
import colonIcon from "../../assets/colon icon.svg";
import { useTranslation } from "react-i18next";

function CountdownTimer({ targetTime }) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const total = targetTime - new Date().getTime();

    const clamped = Math.max(total, 0); // ensures it doesn't go negative

    const seconds = Math.floor((clamped / 1000) % 60);
    const minutes = Math.floor((clamped / 1000 / 60) % 60);
    const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
    const days = Math.floor(clamped / (1000 * 60 * 60 * 24));

    return {
      total: clamped,
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="md:flex justify-between self-stretch">
      <p className="lg:w-[33%] 2xl:w-[30%] lg:flex lg:self-center">
         {t("countdown.title")}
      </p>

      <div className="flex gap-4 justify-center w-full items-center md:justify-between">
        <div className="text-[#222] flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.days}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">{t("countdown.days")}</p>
        </div>
        <img src={colonIcon} alt="colon" />
        <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.hours}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">{t("countdown.hours")}</p>
        </div>
        <img src={colonIcon} alt="colon" />
        <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.minutes}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">{t("countdown.minutes")}</p>
        </div>
        <img src={colonIcon} alt="colon" />
        <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.seconds}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">{t("countdown.seconds")}</p>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
