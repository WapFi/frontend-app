import arrowTimer from "../../assets/arrow-timer.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import WapfiLogo from "../WapfiLogo";
import BackgroundImage from "../BackgroundImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function VerifyPhoneEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    firstDigit: yup
      .string()
      .required(t("errors.digit_required"))
      .test("is-digit", t("errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    secondDigit: yup
      .string()
      .required(t("errors.digit_required"))
      .test("is-digit", t("errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    thirdDigit: yup
      .string()
      .required(t("errors.digit_required"))
      .test("is-digit", t("errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    fourthDigit: yup
      .string()
      .required(t("errors.digit_required"))
      .test("is-digit", t("errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),
  });

  const [showFormError, setShowFormError] = useState(false);
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
    const code =
      otpCode.firstDigit +
      otpCode.secondDigit +
      otpCode.thirdDigit +
      otpCode.fourthDigit;

    try {
      const response = await axios.get(`/auth/verify/${otpCode}`, {
        // firstDigit: otpCode.firstDigit,
        // secondDigit: otpCode.secondDigit,
        // thirdDigit: otpCode.thirdDigit,
        // fourthDigit: otpCode.fourthDigit,
      });
      // const code = localStorage.setItem("otpCode", otpCode);

      console.log("Code verification success:", response.data);
      setShowFormError(false);
      // navigate to dashboard
      navigate("/change-password");
    } catch (error) {
      console.error("Code verification error:", error);
      setShowFormError(true);
    }
  };

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }
  return (
    <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6">
      <WapfiLogo />

      <div className="md:w-[42%] md:m-14 md:mt-24">
        <div className="mt-10 mb-7 text-center">
          <p className="font-raleway font-bold text-[24px] text-[#10172E] mt-24 md:text-[32px]">
            {t("verify_title")}
          </p>
          <p className="text-[18px] text-[#656565] mt-3 mb-8 md:text-[24px]">
            {t("verify_subtext")}
          </p>

          {showFormError && (
            <p className="text-red-500 mb-3">{t("verify_error")}</p>
          )}

          <button className="text-[#656565] mt-20">
            {t("resend_code_in")}{" "}
            <span className="text-[#2D6157]">{formatTime(secondsLeft)}</span>
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:text-[18px] -mt-5"
        >
          <div className="flex justify-center gap-3.5 text-[rgba(34,34,34,0.50)]">
            <input
              type="text"
              maxLength={1}
              {...register("firstDigit")}
              className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
            />

            <input
              type="text"
              maxLength={1}
              {...register("secondDigit")}
              className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
            />

            <input
              type="text"
              maxLength={1}
              {...register("thirdDigit")}
              className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
            />

            <input
              type="text"
              maxLength={1}
              {...register("fourthDigit")}
              className="text-center w-[50px] h-[26px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
            />
          </div>
          <button
            type="submit"
            className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
          >
            {t("continue")}
          </button>
        </form>
        <button
          disabled={secondsLeft > 0}
          onClick={() => setSecondsLeft(60)}
          className={`flex justify-center mx-auto gap-1 ${
            secondsLeft > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <img src={arrowTimer} alt="Arrow Timer" />
          <p className="text-[18px] text-[#2D6157]">{t("resend")}</p>
        </button>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default VerifyPhoneEmail;
