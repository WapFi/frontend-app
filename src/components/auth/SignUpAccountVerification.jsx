import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import WapfiLogo from "../WapfiLogo";
import BackgroundImage from "../BackgroundImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function SignUpAccountVerification() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const schema = yup.object({
    fullName: yup
      .string()
      .required(t("errors.full_name_required"))
      .test("is-fullName", t("errors.full_name_invalid"), (value) => {
        return /^[a-zA-Z]+(?:[' -][a-zA-Z]+)+$/.test(value);
      }),
    emailPhone: yup
      .string()
      .required(t("errors.email_or_phone_required"))
      .test("is-email-phone", t("errors.invalid_email_or_phone"), (value) => {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
        );
      }),
    password: yup
      .string()
      .required(t("errors.password_required"))
      .min(8, t("errors.password_min")),
    confirmedPassword: yup
      .string()
      .required(t("errors.password_required"))
      .min(8, t("errors.password_min")),
  });

  const [showFormError, setShowFormError] = useState(false);

  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

  //   const onSubmit = (loginData) => {
  //     console.log(loginData);

  //     if (
  //       loginData.fullName !== "John Doe" ||
  //       loginData.emailPhone !== "test@gmail.com" ||
  //       loginData.password !== "secret123" ||
  //       loginData.confirmedPassword !== "secret123"
  //     ) {
  //       setShowFormError(true);
  //     } else {
  //       setShowFormError(false);
  //       navigate("/sign-in");
  //     }
  //   };

  const onSubmit = async (signUpData) => {
    if (signUpData.password !== signUpData.confirmedPassword) {
      setShowFormError(true);
      // setErrorMessage(t("errors.passwords_do_not_match"));
      return;
    }

    try {
      const response = await axios.post("/auth/sign_up", {
        full_name: signUpData.fullName,
        identifier: signUpData.emailPhone,
        password: signUpData.password,
        // confirmedPassword: signUpData.confirmedPassword,
      });

      console.log("Sign up success:", response.data);
      setShowFormError(false);
      navigate("/sign-in");
    } catch (error) {
      console.error("Sign up error:", error);
      setShowFormError(true);
    }
  };

  return (
    <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6">
      <WapfiLogo />
      <div className="md:w-[42%] md:m-14">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-[16px] md:text-[18px]"
        >
          <div className="mt-10 mb-7">
            <p className="font-bold text-2xl text-[#10172E] md:text-[32px]">
              {t("signup_title")}
            </p>
            <p className="text-[18px] font-normal text-[#656565] md:text-[24px]">
              {t("signup_subtitle")}
            </p>
          </div>

          {showFormError && (
            <p className="text-red-500 mb-3">{t("sign_up_error")}</p>
          )}

          <label>
            {t("full_name")} <br />
            <input
              type="text"
              {...register("fullName")}
              placeholder={t("placeholders.full_name")}
              className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
            />
          </label>

          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName?.message}
            </p>
          )}
          <br />

          <label>
            {t("email_or_phone")} <br />
            <input
              type="text"
              {...register("emailPhone")}
              placeholder={t("placeholders.email_phone")}
              className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
            />
          </label>

          {errors.emailPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.emailPhone?.message}
            </p>
          )}

          <br />
          <label>
            {t("password")}
            <br />
            <input
              {...register("password")}
              type="password"
              placeholder={t("placeholders.password")}
              className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-1.5 border-1 rounded-lg p-[14px] md:text-[18px]"
            />
          </label>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          )}

          <br />

          <label>
            {t("confirm_password")} <br />
            <input
              {...register("confirmedPassword")}
              type="password"
              placeholder={t("placeholders.confirm_password")}
              className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-1.5 border-1 rounded-lg p-[14px] md:text-[18px]"
            />
            {errors.confirmedPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmedPassword?.message}
              </p>
            )}
          </label>
          <br />

          <button
            type="submit"
            className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
          >
            {t("sign_up")}
          </button>
        </form>
        <div>
          <p className="font-normal text-center my-4">
            {t("already_have_account")}{" "}
            <Link
              to="/sign-in"
              className="text-[#439182] font-medium cursor-pointer"
            >
              {t("sign_in")}
            </Link>
          </p>
          <p className="text-[rgba(51,51,51,0.8)] text-center">
            {t("agree_terms")}{" "}
            <Link
              to="/terms"
              className="cursor-pointer font-medium text-[#333]"
            >
              {t("terms_conditions")}
            </Link>
            ,
            <Link to="/privacy" className="font-normal cursor-pointer">
              {" "}
              {t("privacy_policy")}
            </Link>
          </p>
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default SignUpAccountVerification;
