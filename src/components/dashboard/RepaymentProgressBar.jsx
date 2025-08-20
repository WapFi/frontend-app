import { useRef, useEffect, useState } from "react";
import NairaIcon from "../../assets/naira icon.svg"; 

export default function RepaymentProgressBar({ totalloanAmount, amountRepaid }) {
  
  const containerRef = useRef(null); 
  const [barWidth, setBarWidth] = useState(0); 

  useEffect(() => {
    // if (!dashboardData) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setBarWidth(containerRef.current.offsetWidth);
      }
    };

    // Use requestAnimationFrame for better layout sync
    const raf = requestAnimationFrame(updateWidth);

    // Also handle window resizing
    window.addEventListener("resize", updateWidth);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateWidth);
    };
  }, [totalloanAmount]); 


  const barHeight = 8;
  const tagWidth = 60;
  const progress = Math.max(0, Math.min(amountRepaid / totalloanAmount, 1));

  const anchorX = Math.max(
    tagWidth / 2,
    Math.min(barWidth * progress, barWidth - tagWidth / 2)
  );


  return (
    <div className="w-full sm:px-0">
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "70px", width: "100%" }}
      >
        {/* Floating Paid Tag */}
        {barWidth > 0 && (
          <div
            className="absolute flex flex-col items-center transition-all duration-300"
            style={{
              left: anchorX - tagWidth / 2,
              top: 11, // maintain lift from top
              width: tagWidth,
            }}
          >
            <div
              className="text-white text-center flex justify-between items-center gap-1 font-raleway text-[14px] font-semibold bg-[#937100] py-0.5 px-1.5"
              style={{
                borderRadius: 12,
                whiteSpace: "nowrap",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="11"
                viewBox="0 0 12 11"
                fill="none"
                className="text-white"
              >
                <path
                  d="M2.68101 9.69434V1.48334C2.68096 1.30883 2.73612 1.13925 2.83781 1.00122C2.93951 0.863202 3.08199 0.764556 3.24287 0.720779C3.40375 0.677002 3.57392 0.690575 3.72666 0.759366C3.8794 0.828156 4.00605 0.948267 4.08673 1.10084L8.41816 9.28784C8.49883 9.4404 8.62548 9.56052 8.77822 9.62931C8.93096 9.6981 9.10113 9.71167 9.26202 9.66789C9.4229 9.62412 9.56538 9.52547 9.66707 9.38745C9.76877 9.24942 9.82392 9.07984 9.82387 8.90534V0.694336M1.25244 3.69434H11.2524M1.25244 6.69434H11.2524"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {amountRepaid.toLocaleString()}
            </div>
            <svg
              width="16"
              height="8"
              viewBox="0 0 16 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: "-1px" }}
            >
              <polygon points="0,0 8,8 16,0" fill="#937100" />
            </svg>
          </div>
        )}

        {/* Total Loan Amount Positioned Top Right */}
        <p
          className="absolute flex gap-1 items-center font-raleway font-medium text-[#444]"
          style={{
            top: 15,
            right: 0,
          }}
        >
          <img src={NairaIcon} alt="naira icon" className="w-3 h-3" />
          <span>
            {new Intl.NumberFormat("en-NG", {
              style: "decimal",

              maximumFractionDigits: 2,
            }).format(totalloanAmount)}
          </span>
        </p>

        {/* Progress Bar Background */}
        <div
          className="absolute top-[50px] w-full"
          style={{
            height: barHeight,
            background: "rgba(147, 113, 0, 0.40)",
            borderRadius: barHeight / 2,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: barHeight,
              background: "#937100",
              borderRadius: barHeight / 2,
              transition: "width 0.4s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}
