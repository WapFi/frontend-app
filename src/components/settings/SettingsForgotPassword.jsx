

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import LoadingSpinner from "../LoadingSpinner";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = yup.object({
    emailPhone: yup
      .string()
      .transform((value) =>
        value
          ?.replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
          .trim()
          .toLowerCase()
      )
      .required(t("settingsForgotPassword.errors.email_or_phone_required"))
      .test(
        "is-email-phone",
        t("settingsForgotPassword.errors.invalid_email_or_phone"),
        (value) => {
          return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
          );
        }
      ),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (phoneEmailData) => {
    setLoading(true);
    try {
      await axios.post("/auth/request_reset", {
        identifier: phoneEmailData.emailPhone,
      });

      setShowFormError(false);
      setShowSuccessMessage(true);

      // For resending code
      localStorage.setItem("userIdentifier", phoneEmailData.emailPhone);

      setTimeout(() => {
        navigate("/settings/verify-phone-email");
      }, 2000);
    } catch (error) {
      setShowFormError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1 self-stretch md:text-[18px]"
      >
        <div className="mb-7 flex flex-col gap-[9px]">
          <p className="font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold text-[#10172E]">
            {t("settingsForgotPassword.title")}
          </p>
          <p className="font-normal text-[18px] text-[#656565] lg:text-[20px]">
            {t("settingsForgotPassword.subtext")}
          </p>
        </div>

        {showFormError && (
          <p className="text-red-500 mb-3">{t("settingsForgotPassword.error")}</p>
        )}

        {showSuccessMessage && (
          <p className="text-green-500 mb-3">{t("settingsForgotPassword.success")}</p>
        )}

        <label className="text-[#222] gap-2">
          {t("settingsForgotPassword.email_or_phone")} <br />
          <input
            type="text"
            {...register("emailPhone")}
            placeholder={t("settingsForgotPassword.placeholders.email_phone")}
            className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
          />
        </label>

        {errors.emailPhone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.emailPhone?.message}
          </p>
        )}

        <br />
        <button
          disabled={loading}
          type="submit"
          className={`text-center w-full py-3 px-2.5 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : t("settingsForgotPassword.continue")}
        </button>
      </form>
    </div>
  );
}
