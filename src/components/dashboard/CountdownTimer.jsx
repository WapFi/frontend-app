

import { useEffect, useState, useRef } from "react";
import colonIcon from "../../assets/colon icon.svg";
import { useTranslation } from "react-i18next";

function CountdownTimer({
  targetTime,
  initialDays,
  initialHours,
  initialMinutes,
  initialSeconds,
}) {
  const { t } = useTranslation();
  // const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize state with backend's provided time_left for immediate accuracy
    return {
      total: 0, // Will be calculated on first effective update
      days: String(initialDays).padStart(2, "0"),
      hours: String(initialHours).padStart(2, "0"),
      minutes: String(initialMinutes).padStart(2, "0"),
      seconds: String(initialSeconds).padStart(2, "0"),
    };
  });

  // Use a ref to store the initial server time offset
  // This helps us account for the network delay between server sending time and client receiving it
  const serverTimeOffsetRef = useRef(0);

  // Calculate time left based on the targetTime (due_date) and an adjusted "now"
  const calculateTimeLeft = () => {
    // Calculate the total milliseconds from the initial time_left
    const initialTotalMilliseconds =
      initialDays * 24 * 60 * 60 * 1000 +
      initialHours * 60 * 60 * 1000 +
      initialMinutes * 60 * 1000 +
      initialSeconds * 1000;

    // Calculate how much time has passed since the component mounted (or data last fetched)
    const timeSinceFetch = Date.now() - serverTimeOffsetRef.current; // serverTimeOffsetRef.current holds Date.now() at first render

    // The remaining time is the initial time left, minus the time passed on the client
    const totalRemaining = Math.max(
      0,
      initialTotalMilliseconds - timeSinceFetch
    );

    const seconds = Math.floor((totalRemaining / 1000) % 60);
    const minutes = Math.floor((totalRemaining / 1000 / 60) % 60);
    const hours = Math.floor((totalRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totalRemaining / (1000 * 60 * 60 * 24));

    return {
      total: totalRemaining,
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  useEffect(() => {
    // When the component mounts or targetTime/initialTimeLeft changes (e.g., new data fetch)
    // capture the current client time. This will be our "anchor" for calculations.
    serverTimeOffsetRef.current = Date.now();

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, initialDays, initialHours, initialMinutes, initialSeconds]);

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
          <p className="text-[12px] font-medium md:text-[18px]">
            {t("countdown.days")}
          </p>
        </div>
        <img src={colonIcon} alt="colon" />
        <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.hours}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">
            {t("countdown.hours")}
          </p>
        </div>
        <img src={colonIcon} alt="colon" />
        <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.minutes}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">
            {t("countdown.minutes")}
          </p>
        </div>
        <img src={colonIcon} alt="colon" />
        <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
          <p className="text-[18px] font-semibold md:text-[24px]">
            {timeLeft.seconds}
          </p>
          <p className="text-[12px] font-medium md:text-[18px]">
            {t("countdown.seconds")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
