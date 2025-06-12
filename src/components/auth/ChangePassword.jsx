import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import WapfiLogo from "../WapfiLogo";
import BackgroundImage from "../BackgroundImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function ChangePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = yup.object({
    newPassword: yup
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
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

  // const onSubmit = (data) => {
  //   console.log(data);

  //   if (data.newPassword !== data.confirmedPassword) {
  //     setShowFormError(true);
  //   } else {
  //     setShowFormError(false);
  //     navigate("/sign-in");
  //   }
  // };

  const onSubmit = async (passwordData) => {
    if (passwordData.newPassword !== passwordData.confirmedPassword) {
      setShowFormError(true);
      // setErrorMessage(t("errors.passwords_do_not_match"));
      return;
    }
    try {
      const response = await axios.patch("/auth/reset_password", {
        // code: localStorage.getItem("otpCode"),
        new_password: passwordData.newPassword,
        // confirmedPassword: passwordData.confirmedPassword,
      });

      console.log("Password change success:", response.data);
      setShowFormError(false);
      // navigate to sign in page
      navigate("/sign-in");
    } catch (error) {
      console.error("Password change error:", error);
      setShowFormError(true);
    }
  };
  return (
    <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6">
      <WapfiLogo />

      <div className="md:w-[42%] md:m-14 md:mt-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-[16px] md:text-[18px]"
        >
          <div className="mt-10 mb-7">
            <p className="font-bold text-2xl text-[#10172E] md:text-[32px]">
              {t("change_password.title")}
            </p>
            <p className="text-[18px] font-normal text-[#656565] md:text-[24px]">
              {t("change_password.subtext")}
            </p>
          </div>
          {showFormError && (
            <p className="text-red-500 mb-3">
              {t("change_password.general_error")}
            </p>
          )}
          <label>
            {t("change_password.new")} <br />
            <input
              {...register("newPassword")}
              type="password"
              placeholder={t("placeholders.password")}
              className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm text-center mt-1">
                {errors.newPassword?.message}
              </p>
            )}
          </label>
          <br />
          <label>
            {t("change_password.confirm")} <br />
            <input
              {...register("confirmedPassword")}
              type="password"
              placeholder={t("placeholders.password")}
              className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-1.5 border-1 rounded-lg p-[14px] md:text-[18px]"
            />
            {errors.confirmedPassword && (
              <p className="text-red-500 text-sm text-center mt-1">
                {errors.confirmedPassword?.message}
              </p>
            )}
          </label>
          <br />
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
  );
}

export default ChangePassword;
