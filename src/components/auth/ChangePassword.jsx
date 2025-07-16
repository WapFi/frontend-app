// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useState } from "react";
// import WapfiLogo from "../WapfiLogo";
// import BackgroundImage from "../BackgroundImage";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import axios from "../../api/axios";

// function ChangePassword() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const schema = yup.object({
//     newPassword: yup
//       .string()
//       .required(t("change_password.errors.password_required"))
//       .min(8, t("change_password.errors.password_min")),
//     confirmedPassword: yup
//       .string()
//       .required(t("change_password.errors.password_required"))
//       .min(8, t("change_password.errors.password_min")),
//   });

//   const [showFormError, setShowFormError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

//   // const onSubmit = (data) => {
//   //   console.log(data);

//   //   if (data.newPassword !== data.confirmedPassword) {
//   //     setShowFormError(true);
//   //   } else {
//   //     setShowFormError(false);
//   //     navigate("/sign-in");
//   //   }
//   // };

//   const onSubmit = async (passwordData) => {
//     if (passwordData.newPassword !== passwordData.confirmedPassword) {
//       setShowFormError(true);
//       // setErrorMessage(t("change_password.errors.passwords_do_not_match"));
//       return;
//     }
//     try {
//       const response = await axios.patch("/auth/reset_password", {
//         // code: localStorage.getItem("otpCode"),
//         new_password: passwordData.newPassword,
//         // confirmedPassword: passwordData.confirmedPassword,
//       });

//       console.log("Password change success:", response.data);
//       setShowFormError(false);
//       // navigate to sign in page
//       navigate("/sign-in");
//     } catch (error) {
//       console.error("Password change error:", error);
//       setShowFormError(true);
//     }
//   };
//   return (
//     <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6">
//       <WapfiLogo />

//       <div className="md:w-[42%] md:m-14 md:mt-24">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="text-[16px] md:text-[18px]"
//         >
//           <div className="mt-10 mb-7">
//             <p className="font-bold text-2xl text-[#10172E] md:text-[32px] font-raleway">
//               {t("change_password.title")}
//             </p>
//             <p className="text-[18px] font-normal text-[#656565] md:text-[24px]">
//               {t("change_password.subtext")}
//             </p>
//           </div>
//           {showFormError && (
//             <p className="text-red-500 mb-3">
//               {t("change_password.general_error")}
//             </p>
//           )}
//           <label>
//             {t("change_password.new")} <br />
//             <input
//               {...register("newPassword")}
//               type="password"
//               placeholder={t("change_password.placeholders.password")}
//               className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//             />
//             {errors.newPassword && (
//               <p className="text-red-500 text-sm text-center mt-1">
//                 {errors.newPassword?.message}
//               </p>
//             )}
//           </label>
//           <br />
//           <label>
//             {t("change_password.confirm")} <br />
//             <input
//               {...register("confirmedPassword")}
//               type="password"
//               placeholder={t("change_password.placeholders.password")}
//               className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-1.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//             />
//             {errors.confirmedPassword && (
//               <p className="text-red-500 text-sm text-center mt-1">
//                 {errors.confirmedPassword?.message}
//               </p>
//             )}
//           </label>
//           <br />
//           <button
//             type="submit"
//             className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
//           >
//             {t("change_password.continue")}
//           </button>
//         </form>
//       </div>
//       <BackgroundImage />
//     </div>
//   );
// }

// export default ChangePassword;

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import WapfiLogo from "../WapfiLogo";
import LoadingSpinner from "../LoadingSpinner";
import BackgroundImage from "../BackgroundImage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

function ChangePassword() {
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = yup.object({
    newPassword: yup
      .string()
      .required(t("change_password.errors.password_required"))
      .min(8, t("change_password.errors.password_min")),
    confirmedPassword: yup
      .string()
      .required(t("change_password.errors.password_required"))
      .min(8, t("change_password.errors.password_min"))
      .oneOf(
        [yup.ref("newPassword"), null],
        t("change_password.errors.passwords_do_not_match")
      ),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

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
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmedPassword) {
      setShowFormError(true);
      // setErrorMessage(t("change_password.errors.passwords_do_not_match"));
      return;
    }
    try {
      console.log(localStorage.getItem("otpCode"));
      const response = await axios.patch("/auth/reset_password", {
        code: localStorage.getItem("otpCode"),
        new_password: passwordData.newPassword,
        // confirmedPassword: passwordData.confirmedPassword,
      });

      console.log("Password change success:", response.data);
      setShowFormError(false);
      setShowSuccessMessage(true);

      localStorage.removeItem("otpCode");
      // navigate to sign in page
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Password change error:", error);
      setShowFormError(true);
    } finally {
      setLoading(false);
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
            <div className="self-stretch mb-7 flex items-start flex-col gap-[9px] lg:mt-12">
              <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[32px] lg:mt-14 2xl:gap-3">
                {t("change_password.title")}
              </p>
              <p className="font-normal text-[18px] text-[#656565] lg:text-[24px]">
                {t("change_password.subtext")}
              </p>
            </div>
            {showFormError && (
              <p className="text-red-500 mb-3">
                {t("change_password.general_error")}
              </p>
            )}
            {showSuccessMessage && (
              <p className="text-green-500 mb-3">
                {t("change_password.success")}
              </p>
            )}

            <label className="text-[#222] gap-2">
              {t("change_password.new")} <br />
              {/* <input
                {...register("newPassword")}
                type="password"
                placeholder={t("change_password.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              /> */}
              <div className="relative w-full">
                <input
                  {...register("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("change_password.placeholders.password")}
                  className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
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
              {t("change_password.confirm")} <br />
              {/* <input
                {...register("confirmedPassword")}
                type="password"
                placeholder={t("change_password.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              /> */}
              <div className="relative w-full">
                <input
                  {...register("confirmedPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("change_password.placeholders.password")}
                  className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
              className="text-center w-full py-3 px-2.5 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              {loading ? <LoadingSpinner /> : t("change_password.continue")}
            </button>
          </form>
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default ChangePassword;
