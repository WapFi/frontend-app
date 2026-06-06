import arrowTimer from "../../assets/arrow-timer.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState, useRef } from "react";

import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

export default function SettingsVerifyEmailPhone() {
  const [loading, setLoading] = useState(false);

  // Input refs for auto-focus
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourthRef = useRef(null);

  useEffect(() => {
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
      .required(t("settingsVerify.errors.digit_required"))
      .test("is-digit", t("settingsVerify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    secondDigit: yup
      .string()
      .required(t("settingsVerify.errors.digit_required"))
      .test("is-digit", t("settingsVerify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    thirdDigit: yup
      .string()
      .required(t("settingsVerify.errors.digit_required"))
      .test("is-digit", t("settingsVerify.errors.invalid_digit"), (value) => {
        return /^\d{1}$/.test(value);
      }),

    fourthDigit: yup
      .string()
      .required(t("settingsVerify.errors.digit_required"))
      .test("is-digit", t("settingsVerify.errors.invalid_digit"), (value) => {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

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
      localStorage.setItem("otpCode", code);

      if (response.status === 200) {
        setShowVerificationSuccess(response.data?.message);
        reset();
        setTimeout(() => {
          navigate("/settings/reset-password");
        }, 3000);
      } else {
        setShowFormError(response.data?.message);
      }

      localStorage.removeItem("userIdentifier");
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
      const identifier = localStorage.getItem("userIdentifier");
      const response = await axios.post("/auth/request_reset", {
        identifier,
      });

      if (response.status === 200) {
        setShowResendSuccess(response.data?.message);
        setSecondsLeft(60);
        // Optionally reset input fields:
        setValue("firstDigit", "");
        setValue("secondDigit", "");
        setValue("thirdDigit", "");
        setValue("fourthDigit", "");
        firstRef.current && firstRef.current.focus();
      } else {
        setShowResendFailure(response.data?.message);
      }
    } catch (error) {
      setShowResendFailure(error.response?.data?.message);
    } finally {
      setResending(false);
      setTimeout(() => {
        setShowResendSuccess("");
        setShowResendFailure("");
      }, 2500);
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
    <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1 self-stretch md:text-[18px]"
      >
        <div className="mb-7 flex flex-col gap-[12px] md:text-center lg:text-left">
          <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[28px] 2xl:gap-3">
            {t("settingsVerify.title")}
          </p>
          <p className="font-normal text-[18px] text-[#656565] lg:text-[20px]">
            {t("settingsVerify.subtext")}
          </p>

          {showFormError && (
            <p className="text-red-500 mb-3 text-center">
              {showFormError || t("settingsVerify.error")}
            </p>
          )}

          {showVerificationSuccess && (
            <p className="text-green-500 mb-3 text-center">
              {showVerificationSuccess || t("settingsVerify.success")}
            </p>
          )}

          {showResendFailure && (
            <p className="text-red-500 mb-3 text-center">{showResendFailure}</p>
          )}
          {showResendSuccess && (
            <p className="text-green-500 mb-3 text-center">
              {showResendSuccess || t("settingsVerify.resend_success")}
            </p>
          )}

          <button className="text-[#656565] mt-16" type="button" disabled>
            {t("settingsVerify.resend_in")}{" "}
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
          {loading ? <LoadingSpinner /> : t("settingsVerify.continue")}
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
            {t("settingsVerify.resend")}
          </p>
        </button>
      </form>
    </div>
  );
}
