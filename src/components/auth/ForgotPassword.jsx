import WapfiLogo from "../WapfiLogo";
import BackgroundImage from "../BackgroundImage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function ForgotPassword() {
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
      .required(t("errors.email_or_phone_required"))
      .test("is-email-phone", t("errors.invalid_email_or_phone"), (value) => {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
        );
      }),
  });

  const [showFormError, setShowFormError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

  // const onSubmit = (data) => {
  //   console.log(data);

  //   if (data.emailPhone !== "test@gmail.com") {
  //     setShowFormError(true);
  //   } else {
  //     setShowFormError(false);
  //     navigate("/change-password");
  //   }
  // };

  const onSubmit = async (phoneEmailData) => {
    try {
      const response = await axios.post("/auth/request_reset", {
        identifier: phoneEmailData.emailPhone,
      });

      console.log("Forgot password success:", response.data);
      setShowFormError(false);
      navigate("/verify-code");
    } catch (error) {
      console.error("Forgot password error:", error);
      setShowFormError(true);
    }
  };

  return (
    <div>
      <WapfiLogo />
      <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6 lg:gap-12 lg:mb-9 lg:flex-row">
        <div className="md:w-[70%] md:mx-auto md:m-14 lg:w-[511px] lg:h-[621px]">
          <div className="mt-10 mb-7">
            <p className="font-raleway font-bold text-[24px] text-[#10172E] mt-24 md:text-[32px]">
              {t("forgot_password")}
            </p>
            <p className="text-[18px] text-[#656565] mt-3 mb-8 md:text-[24px]">
              {t("forgot_password_subtext")}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="md:text-[18px]">
            {showFormError && (
              <p className="text-red-500 mb-3">{t("forgot_password_error")}</p>
            )}

            <label>
              {t("email_or_phone")} <br />
              <input
                {...register("emailPhone")}
                type="text"
                placeholder={t("placeholders.email_phone")}
                className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
              />
            </label>
            <br />
            {errors.emailPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailPhone?.message}
              </p>
            )}

            <button
              type="submit"
              className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
            >
              {t("continue")}
            </button>
          </form>
        </div>
        <BackgroundImage />
      </div>
    </div>
  );
}

export default ForgotPassword;
