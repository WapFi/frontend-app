
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

export default function PasswordResetForm() {
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();
  const schema = yup.object({
    newPassword: yup
      .string()
      .required(t("passwordResetForm.errors.password_required"))
      .min(8, t("passwordResetForm.errors.password_min")),
    confirmedPassword: yup
      .string()
      .required(t("passwordResetForm.errors.password_required"))
      .min(8, t("passwordResetForm.errors.password_min"))
      .oneOf(
        [yup.ref("newPassword"), null],
        t("passwordResetForm.errors.passwords_do_not_match")
      ),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (passwordData) => {
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmedPassword) {
      setShowFormError(true);
      setLoading(false);
      return;
    }
    try {
      // get otp code
      const otp = localStorage.getItem("otpCode");
      await axios.patch("/auth/reset_password", {
        code: otp,
        new_password: passwordData.newPassword,
      });

      setShowFormError(false);
      setShowSuccessMessage(true);

      // now remove otp code
      localStorage.removeItem("otpCode");
      reset();
    } catch (error) {
      setShowFormError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setShowSuccessMessage(false);
        setShowFormError(false);
      }, 3000);
    }
  };

  return (
    <div className="rounded-[24px] w-full flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
        {t("passwordResetForm.title")}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1 self-stretch md:text-[18px]"
      >
        {showFormError && (
          <p className="text-red-500 mb-3">
            {t("passwordResetForm.errors.passwords_do_not_match")}
          </p>
        )}
        {showSuccessMessage && (
          <p className="text-green-500 mb-3">{t("passwordResetForm.success")}</p>
        )}

        <label className="text-[#222] gap-2">
          {t("passwordResetForm.new")} <br />
          <div className="relative w-full">
            <input
              {...register("newPassword")}
              type={showNewPassword ? "text" : "password"}
              placeholder={t("passwordResetForm.placeholders.password")}
              className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Eye off icon path */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.083.182-2.127.525-3.1M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Eye icon path */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword?.message}
            </p>
          )}
        </label>
        <br />
        <label className="text-[#222] gap-2">
          {t("passwordResetForm.confirm")} <br />
          <div className="relative w-full">
            <input
              {...register("confirmedPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("passwordResetForm.placeholders.password")}
              className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Eye off icon path */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.083.182-2.127.525-3.1M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {/* Eye icon path */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmedPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmedPassword?.message}
            </p>
          )}
        </label>
        <br />
        <button
          disabled={loading}
          type="submit"
          className="text-center w-full py-3 px-2.5 mt-40 lg:mt-0 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] cursor-pointer hover:opacity-80 transition-opacity duration-300"
        >
          {loading ? <LoadingSpinner /> : t("passwordResetForm.save")}
        </button>
      </form>
    </div>
  );
}

