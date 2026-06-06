import arrowTimer from "../../assets/arrow-timer.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState, useRef } from "react";
import WapfiLogo from "../WapfiLogo";
import LoadingSpinner from "../LoadingSpinner";
import BackgroundImage from "../BackgroundImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function VerifyPhoneEmail() {
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Input refs for auto-focus
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourthRef = useRef(null);

  useEffect(() => {
    setFadeIn(true);
    // Focus the first input on mount
    if (firstRef.current) {
      firstRef.current.focus();
    }
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

  const [showFormError, setShowFormError] = useState("");
  const [showVerificationSuccess, setShowVerificationSuccess] = useState("");
  const [showResendSuccess, setShowResendSuccess] = useState("");
  const [showResendFailure, setShowResendFailure] = useState("");
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

  // Merge react-hook-form ref and your ref
  function mergeRefs(rhfRef, userRef) {
    return (el) => {
      rhfRef(el);
      userRef.current = el;
    };
  }

  const onSubmit = async (otpCode) => {
    setLoading(true);

    const code =
      otpCode.firstDigit +
      otpCode.secondDigit +
      otpCode.thirdDigit +
      otpCode.fourthDigit;

    try {
      const response = await axios.get(`/auth/verify/${code}`);

      if (response.status === 200) {
        localStorage.setItem("otpCode", code);

        setShowVerificationSuccess(response.data?.message);

        localStorage.removeItem("userIdentifier");

        setTimeout(() => {
          navigate("/change-password");
        }, 4000);
      } else {
        setShowFormError(response.data?.message);
      }
    } catch (error) {
      console.error("Code verification error:", error);
      setShowFormError(error.response?.data?.message);
      // setLoading(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowFormError("");
        setShowVerificationSuccess("");
      }, 3500);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const identifier = localStorage.getItem("userIdentifier");
      const response = await axios.post("/auth/request_reset", {
        identifier,
      });
      if (response.status === 200) {
        setShowResendSuccess(response.data?.message);
        setSecondsLeft(60);
      } else {
        setShowResendFailure(response.data?.message);
      }
    } catch (error) {
      console.error("Failed to resend code:", error);
      setShowResendFailure(error.response?.data?.message);
    } finally {
      setResending(false);
      setTimeout(() => {
        setShowResendFailure("");
        setShowResendSuccess("");
      }, 4000);
    }
  };

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // Handler for moving focus
  const handleInput = (e, nextRef, prevRef) => {
    const { value } = e.target;
    if (e.type === "change" && value.length === 1 && nextRef) {
      nextRef.current.focus();
    }
    if (e.type === "keydown" && e.key === "Backspace" && !value && prevRef) {
      prevRef.current.focus();
    }
  };

  return (
    <div
      className={`w-full max-w-screen flex flex-col lg:flex-row justify-between lg:flex lg:justify-center lg:my-10 2xl:gap-10 transition-opacity duration-[2500ms] ease-in-out ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="px-3">
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
                <p className="text-red-500 mb-3">
                  {showFormError || t("verify.error")}
                </p>
              )}

              {showVerificationSuccess && (
                <p className="text-green-500 mb-3">
                  {showVerificationSuccess || t("verify.success")}
                </p>
              )}

              {showResendFailure && (
                <p className="text-red-500 mb-3">{showResendFailure}</p>
              )}

              {showResendSuccess && (
                <p className="text-green-500 mb-3">
                  {showResendSuccess || t("verify.resend_success")}
                </p>
              )}

              <button className="text-[#656565] mt-16" type="button" disabled>
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
                ref={mergeRefs(register("firstDigit").ref, firstRef)}
                onChange={(e) => handleInput(e, secondRef)}
                onKeyDown={(e) => handleInput(e, secondRef)}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />

              <input
                type="text"
                maxLength={1}
                {...register("secondDigit")}
                ref={mergeRefs(register("secondDigit").ref, secondRef)}
                onChange={(e) => handleInput(e, thirdRef, firstRef)}
                onKeyDown={(e) => handleInput(e, thirdRef, firstRef)}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />

              <input
                type="text"
                maxLength={1}
                {...register("thirdDigit")}
                ref={mergeRefs(register("thirdDigit").ref, thirdRef)}
                onChange={(e) => handleInput(e, fourthRef, secondRef)}
                onKeyDown={(e) => handleInput(e, fourthRef, secondRef)}
                className="text-center w-[50px] h-[50px] border p-3.5 rounded-[8px] border-[rgba(0,0,0,0.15)]"
              />

              <input
                type="text"
                maxLength={1}
                {...register("fourthDigit")}
                ref={mergeRefs(register("fourthDigit").ref, fourthRef)}
                onChange={(e) => handleInput(e, null, thirdRef)}
                onKeyDown={(e) => handleInput(e, null, thirdRef)}
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
              type="button"
            >
              <img src={arrowTimer} alt="Arrow Timer" className="block" />
              <p className="text-[18px] text-[#2D6157]">{t("verify.resend")}</p>
            </button>
          </form>
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default VerifyPhoneEmail;
