// import arrowTimer from "../../assets/arrow-timer.svg";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useEffect, useState } from "react";
// import WapfiLogo from "../WapfiLogo";
// import BackgroundImage from "../BackgroundImage";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import axios from "../../api/axios";

// function VerifyPhoneEmail() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const schema = yup.object({
//     firstDigit: yup
//       .string()
//       .required(t("verify.errors.digit_required"))
//       .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
//         return /^\d{1}$/.test(value);
//       }),

//     secondDigit: yup
//       .string()
//       .required(t("verify.errors.digit_required"))
//       .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
//         return /^\d{1}$/.test(value);
//       }),

//     thirdDigit: yup
//       .string()
//       .required(t("verify.errors.digit_required"))
//       .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
//         return /^\d{1}$/.test(value);
//       }),

//     fourthDigit: yup
//       .string()
//       .required(t("verify.errors.digit_required"))
//       .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
//         return /^\d{1}$/.test(value);
//       }),
//   });

//   const [showFormError, setShowFormError] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState(60);

//   useEffect(() => {
//     if (secondsLeft === 0) return;
//     const interval = setInterval(() => {
//       setSecondsLeft((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [secondsLeft]);

//   const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

//   // const onSubmit = (code) => {
//   //   console.log(code);

//   //   if (
//   //     code.firstDigit !== "1" ||
//   //     code.secondDigit !== "1" ||
//   //     code.thirdDigit !== "1" ||
//   //     code.fourthDigit !== "1"
//   //   ) {
//   //     setShowFormError(true);
//   //   } else {
//   //     setShowFormError(false);
//   //     navigate("/change-password");
//   //   }
//   // };

//   const onSubmit = async (otpCode) => {
//     const code =
//       otpCode.firstDigit +
//       otpCode.secondDigit +
//       otpCode.thirdDigit +
//       otpCode.fourthDigit;

//     try {
//       const response = await axios.get(`/auth/verify/${code}`, {
//         // firstDigit: otpCode.firstDigit,
//         // secondDigit: otpCode.secondDigit,
//         // thirdDigit: otpCode.thirdDigit,
//         // fourthDigit: otpCode.fourthDigit,
//       });
//       // const code = localStorage.setItem("otpCode", otpCode);

//       console.log("Code verification success:", response.data);
//       setShowFormError(false);
//       // navigate to dashboard
//       navigate("/change-password");
//     } catch (error) {
//       console.error("Code verification error:", error);
//       setShowFormError(true);
//     }
//   };

//   function formatTime(totalSeconds) {
//     const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
//     const seconds = String(totalSeconds % 60).padStart(2, "0");
//     return `${minutes}:${seconds}`;
//   }
//   return (
//     <div>
//       <WapfiLogo />
//       <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6 lg:gap-12 lg:mb-9 lg:flex-row">
//         <div className="md:w-[70%] md:mx-auto md:m-14 lg:w-[511px] lg:h-[621px]">
//           <div className="mt-10 mb-7 text-center">
//             <p className="font-raleway font-bold text-[24px] text-[#10172E] mt-24 md:text-[32px]">
//               {t("verify.title")}
//             </p>
//             <p className="text-[18px] text-[#656565] mt-3 mb-3.5 md:text-[24px]">
//               {t("verify.subtext")}
//             </p>

//             {showFormError && (
//               <p className="text-red-500 mb-3">{t("verify.error")}</p>
//             )}

//             <button className="text-[#656565] mt-20">
//               {t("verify.resend_in")}{" "}
//               <span className="text-[#2D6157]">{formatTime(secondsLeft)}</span>
//             </button>
//           </div>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="md:text-[18px] -mt-5"
//           >
//             <div className="flex justify-center gap-3.5 text-[rgba(34,34,34,0.50)]">
//               <input
//                 type="text"
//                 maxLength={1}
//                 {...register("firstDigit")}
//                 className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
//               />

//               <input
//                 type="text"
//                 maxLength={1}
//                 {...register("secondDigit")}
//                 className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
//               />

//               <input
//                 type="text"
//                 maxLength={1}
//                 {...register("thirdDigit")}
//                 className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
//               />

//               <input
//                 type="text"
//                 maxLength={1}
//                 {...register("fourthDigit")}
//                 className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
//               />
//             </div>
//             <button
//               type="submit"
//               className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
//             >
//               {t("verify.continue")}
//             </button>
//           </form>
//           <button
//             disabled={secondsLeft > 0}
//             onClick={() => setSecondsLeft(60)}
//             className={`flex justify-center mx-auto gap-1 ${
//               secondsLeft > 0
//                 ? "opacity-50 cursor-not-allowed"
//                 : "cursor-pointer"
//             }`}
//           >
//             <img src={arrowTimer} alt="Arrow Timer" />
//             <p className="text-[18px] text-[#2D6157]">{t("verify.resend")}</p>
//           </button>
//         </div>
//         <BackgroundImage />
//       </div>
//     </div>
//   );
// }

// export default VerifyPhoneEmail;

import arrowTimer from "../../assets/arrow-timer.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import WapfiLogo from "../WapfiLogo";
import LoadingSpinner from "../LoadingSpinner";
import BackgroundImage from "../BackgroundImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function VerifyPhoneEmail() {
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    firstDigit: yup
      .string()
      .required(t("verify.errors.digit_required"))
      .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    secondDigit: yup
      .string()
      .required(t("verify.errors.digit_required"))
      .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    thirdDigit: yup
      .string()
      .required(t("verify.errors.digit_required"))
      .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    fourthDigit: yup
      .string()
      .required(t("verify.errors.digit_required"))
      .test("is-digit", t("verify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });

  // const onSubmit = (code) => {
  //   console.log(code);

  //   if (
  //     code.firstDigit !== "1" ||
  //     code.secondDigit !== "1" ||
  //     code.thirdDigit !== "1" ||
  //     code.fourthDigit !== "1"
  //   ) {
  //     setShowFormError(true);
  //   } else {
  //     setShowFormError(false);
  //     navigate("/change-password");
  //   }
  // };

  const onSubmit = async (otpCode) => {
    setLoading(true);

    const code =
      otpCode.firstDigit +
      otpCode.secondDigit +
      otpCode.thirdDigit +
      otpCode.fourthDigit;

    try {
      const response = await axios.get(`/auth/verify/${code}`, {
        // firstDigit: otpCode.firstDigit,
        // secondDigit: otpCode.secondDigit,
        // thirdDigit: otpCode.thirdDigit,
        // fourthDigit: otpCode.fourthDigit,
      });
      const otpCode = localStorage.setItem("otpCode", code);

      console.log("Code verification success:", response.data);
      setShowFormError(false);
      setShowVerificationSuccess(true);

      localStorage.removeItem("userIdentifier");

      setTimeout(() => {
        navigate("/change-password");
      }, 2000);
    } catch (error) {
      console.error("Code verification error:", error);
      setShowFormError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const identifier = localStorage.getItem("userIdentifier");
      await axios.post("/auth/request_reset", {
        identifier,
      });
      setShowResendSuccess(true);
      setSecondsLeft(60);
    } catch (error) {
      // should probably display an error message on the screen and navigate to 'Forgot Password' page
      console.error("Failed to resend code:", error);
    } finally {
      setResending(false);
    }
  };

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }
  return (
    <div
      className={`w-full max-w-screen flex flex-col lg:flex-row justify-between lg:flex lg:justify-center lg:my-10 2xl:gap-10 transition-opacity duration-[2500ms] ease-in-out ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div>
        <WapfiLogo />
        <div className="mx-auto flex flex-col items-center gap-[40px] w-full mb-12 max-w-[95%] md:text-[18px] md:max-w-[75%] lg:max-w-[511px] lg:gap-[40px] lg:self-center lg:mx-12 xl:mx-14 2xl:ml-32">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-1 self-stretch md:text-[18px]"
          >
            <div className="mt-18 mb-7 flex flex-col gap-[12px] text-center xl:mt-7">
              <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[32px] lg:mt-14 2xl:gap-3">
                {t("verify.title")}
              </p>
              <p className="font-normal text-[18px] text-[#656565] lg:text-[24px]">
                {t("verify.subtext")}
              </p>

              {showFormError && (
                <p className="text-red-500 mb-3">{t("verify.error")}</p>
              )}

              {showVerificationSuccess && (
                <p className="text-green-500 mb-3">{t("verify.success")}</p>
              )}

              {showResendSuccess && (
                <p className="text-green-500 mb-3">
                  {t("verify.resend_success")}
                </p>
              )}

              <button className="text-[#656565] mt-16">
                {t("verify.resend_in")}{" "}
                <span className="text-[#2D6157]">
                  {formatTime(secondsLeft)}
                </span>
              </button>
            </div>

            <div className="w-[263px] flex justify-center items-center gap-3 mx-auto -mt-2.5 text-[rgba(34,34,34,0.50)]">
              <input
                type="text"
                maxLength={1}
                {...register("firstDigit")}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />

              <input
                type="text"
                maxLength={1}
                {...register("secondDigit")}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />

              <input
                type="text"
                maxLength={1}
                {...register("thirdDigit")}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />

              <input
                type="text"
                maxLength={1}
                {...register("fourthDigit")}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className={`text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 hover:opacity-80 transition-opacity duration-300 ${
                loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? <LoadingSpinner /> : t("verify.continue")}
            </button>

            <button
              disabled={secondsLeft > 0 || resending}
              onClick={handleResend}
              className={`flex justify-center items-center mx-auto gap-2 ${
                secondsLeft > 0 || resending
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <img src={arrowTimer} alt="Arrow Timer" className="block" />
              <p className="text-[18px] text-[#2D6157]">{t("verify.resend")}</p>

              {/* {resending ? (
                <span className="text-[16px] text-[#2D6157]">
                  <LoadingSpinner /> {t("resending")}
                </span>
              ) : (
                <p className="text-[18px] text-[#2D6157]">{t("verify.resend")}</p>
              )} */}
            </button>
          </form>
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default VerifyPhoneEmail;
