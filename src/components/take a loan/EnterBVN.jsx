import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { verifyIdentity } from "../../api/apiData";
import { use_UserData } from "../../context/UserContext";
import { useNotifications } from "../../context/NotificationContext";

export default function EnterBVN() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const { refreshNotificationsCount } = useNotifications();

  const { refreshUserData } = use_UserData();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const schema = yup.object({
    bvn: yup
      .string()
      .required(t("bvn.errors.required"))
      .matches(/^\d{11}$/, t("bvn.errors.invalid")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await verifyIdentity("bvn", data.bvn);
      if (response.status === 200) {
        console.log("BVN Verification Success: ", response);
        reset();
        // refresh user data to make sure we get the latest data
        await refreshUserData();
        setShowSuccessMessage(response.data?.message);

        await refreshNotificationsCount();

        setTimeout(() => {
          navigate("/take-a-loan/verify-phone");
        }, 3500);
      } else {
        setFormError(response.data?.message);
      }
    } catch (error) {
      setFormError(error.response?.data?.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setFormError("");
        setShowSuccessMessage("");
      }, 3000);
    }
  };
  return (
    <div
      className={`flex flex-col justify-center items-center self-stretch h-full ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="rounded-[12px] flex flex-col w-[95%] mx-auto md:w-[90%] lg:w-[85%] lg:mr-30 gap-10 lg:border lg:border-[rgba(0,0,0,0.08)] lg:bg-white md:py-16 lg:px-10">
        <p className="font-raleway text-[24px] font-bold text-[#10172E] text-center">
          {t("bvn.title")}
        </p>
        <p className="text-[18px] text-[#656565]">{t("bvn.subtext")}</p>

        {formError && (
          <p className="text-red-500 mb-3">{formError || "bvn.errors.error"}</p>
        )}
        {showSuccessMessage && (
          <p className="text-green-500 mb-3">
            {showSuccessMessage || t("bvn.success")}
          </p>
        )}

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("bvn")}
            type="text"
            placeholder={t("bvn.placeholders.bvn")}
            className="text-[rgba(34,34,34,0.50)] border-[rgba(0,0,0,0.15)] w-full gap-2.5 border-1 rounded-lg p-[14px]"
          />
          {errors.bvn && (
            <p className="text-red-600 text-sm mt-1">{errors.bvn.message}</p>
          )}

          <button
            disabled={loading}
            className={`text-center w-full py-3 px-2.5 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] mt-10 hover:opacity-80 transition-opacity duration-300 ${
              loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? <LoadingSpinner /> : t("bvn.cta")}
          </button>
        </form>
      </div>
    </div>
  );
}
