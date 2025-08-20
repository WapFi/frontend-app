

import arrowTimer from "../../assets/arrow-timer.svg";
import { useState, useEffect, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { verifyIdentity } from "../../api/apiData";
import { use_UserData } from "../../context/UserContext";
import { useNotifications } from "../../context/NotificationContext";

export default function VerifyPhoneNumber() {
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData, refreshUserData } = use_UserData();
  const { refreshNotificationsCount } = useNotifications();


  // Refs for inputs
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourthRef = useRef(null);

  useEffect(() => {
    setFadeIn(true);
    if (firstRef.current) {
      firstRef.current.focus();
    }
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    firstDigit: yup
      .string()
      .required(t("verifyPhone.errors.digit_required"))
      .test("is-digit", t("verifyPhone.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),
    secondDigit: yup
      .string()
      .required(t("verifyPhone.errors.digit_required"))
      .test("is-digit", t("verifyPhone.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),
    thirdDigit: yup
      .string()
      .required(t("verifyPhone.errors.digit_required"))
      .test("is-digit", t("verifyPhone.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),
    fourthDigit: yup
      .string()
      .required(t("verifyPhone.errors.digit_required"))
      .test("is-digit", t("verifyPhone.errors.invalid_digit"), (value) => {
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
    const code =
      otpCode.firstDigit +
      otpCode.secondDigit +
      otpCode.thirdDigit +
      otpCode.fourthDigit;
    try {
      setLoading(true);
      const response = await verifyIdentity("phone", code);

      if (response.status) {
        setShowVerificationSuccess(response.data?.message);
        await refreshNotificationsCount();
        
        console.log(response.data?.message);

        // refresh user data to make sure we get the latest data
        const updatedUserData = await refreshUserData();

        setTimeout(() => {
          if (updatedUserData?.pending_loan?.status !== "PENDING") {
            navigate("/take-a-loan/form/loan-amount-purpose");
          } else if (updatedUserData?.pending_loan.status === "PENDING") {
            navigate("/take-a-loan/loan-repayment-overview");
          }
        }, 3000);
      } else {
        setShowFormError(response.data?.message);
      }
    } catch (error) {
      setShowFormError(error.response?.data?.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowFormError("");
        setShowVerificationSuccess("");
      }, 2500);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      setShowResendSuccess(true);
      setSecondsLeft(60);
    } catch (error) {
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

  // Handle input focus movement
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
      className={`rounded-[12px] flex flex-col w-[95%] justify-center items-center self-center mx-auto lg:w-[85%] lg:mr-30 gap-10 lg:border lg:border-[rgba(0,0,0,0.08)] lg:bg-white md:py-16 lg:px-28 lg:mt-14 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1 md:text-[18px]"
      >
        <div className="mt-36 mb-7 flex flex-col gap-[12px] text-center xl:mt-7">
          <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[28px] 2xl:gap-3">
            {t("verifyPhone.title")}
          </p>
          <p className="font-normal text-[18px] text-[#656565] lg:text-[18px]">
            {t("verifyPhone.subtext")}
          </p>

          {showFormError && (
            <p className="text-[#EF4444] text-center mb-3">
              {showFormError || t("verifyPhone.error")}
            </p>
          )}

          {showVerificationSuccess && (
            <p className="text-green-500 mb-3">{showVerificationSuccess || t("verifyPhone.success")}</p>
          )}

          {showResendSuccess && (
            <p className="text-green-500 mb-3">
              {showResendSuccess || t("verifyPhone.resend_success")}
            </p>
          )}

          <button className="text-[#656565] mt-10" type="button" disabled>
            {t("verifyPhone.resend_in")}{" "}
            <span className="text-[#2D6157]">{formatTime(secondsLeft)}</span>
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
          {loading ? <LoadingSpinner /> : t("verifyPhone.continue")}
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
          <p className="text-[18px] text-[#2D6157]">
            {t("verifyPhone.resend")}
          </p>
        </button>
      </form>
    </div>
  );
}
