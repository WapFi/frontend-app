import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function EnterBVN() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(false);

    try {
      const response = await axios.patch("/users/verify-identity", {
        identity_type: "bvn",
        identity_value: data.bvn,
      });
      console.log("BVN Verification Success: ", response);
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate("/take-a-loan/verify-phone");
      }, 2000);
    } catch (error) {
      //   console.log("BVN Verification Error: ", error);
      setFormError(true);
    } finally {
      setLoading(false);
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
          <p className="text-red-500 mb-3">{t("bvn.errors.error")}</p>
        )}
        {showSuccessMessage && (
          <p className="text-green-500 mb-3">{t("bvn.success")}</p>
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
