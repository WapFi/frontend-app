// import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useState, useEffect } from "react";
// import WapfiLogo from "../WapfiLogo";
// import BackgroundImage from "../BackgroundImage";
// import AuthFooter from "./AuthFooter";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import { useTranslation } from "react-i18next";

// function SignIn() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const schema = yup.object({
//     emailPhone: yup
//       .string()
//       .transform((value) =>
//         value
//           ?.replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
//           .trim()
//           .toLowerCase()
//       )
//       .required(t("sign_in.errors.email_or_phone_required"))
//       .test("is-email-phone", t("sign_in.errors.invalid_email_or_phone"), (value) => {
//         return (
//           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
//         );
//       }),
//     password: yup
//       .string()
//       .required(t("sign_in.errors.password_required"))
//       .min(8, t("sign_in.errors.password_min")),
//   });

//   const [showFormError, setShowFormError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

//   useEffect(() => {
//     const remembered = localStorage.getItem("rememberedEmailPhone");
//     if (remembered) {
//       setValue("emailPhone", remembered);
//     }
//   }, [setValue]);

//   // const onSubmit = (loginData) => {
//   //   console.log(loginData);
//   //   // if(loginData.remember) {
//   //   //   localStorage.setItem("rememberedEmailPhone", loginData.emailPhone);
//   //   // }
//   //   // else {
//   //   //   localStorage.removeItem("rememberedEmailPhone");
//   //   // }

//   //   if (
//   //     loginData.emailPhone !== "test@gmail.com" ||
//   //     loginData.password !== "secret123"
//   //   ) {
//   //     setShowFormError(true);
//   //   } else {
//   //     setShowFormError(false);
//   //     // navigate to dashboard
//   //   }
//   // };

//   const onSubmit = async (loginData) => {
//     try {
//       if (loginData.rememberMe) {
//         localStorage.setItem("rememberedEmailPhone", loginData.emailPhone);
//       } else {
//         localStorage.removeItem("rememberedEmailPhone");
//       }

//       const response = await axios.post("/auth/sign_in", {
//         identifier: loginData.emailPhone,
//         password: loginData.password,
//         // rememberMe: loginData.rememberMe,
//       });

//       console.log("Login success:", response.data);
//       setShowFormError(false);
//       // navigate to dashboard
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login error:", error);
//       setShowFormError(true);
//     }
//   };

//   return (
//     <div>
//       <WapfiLogo />
//       <div className="w-[85%] mb-20 min-h-screen mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6 lg:gap-12 lg:mb-9 lg:flex-row">
//         {/* <WapfiLogo /> */}
//         <div className="md:w-[70%] md:m-14 md:mx-auto lg:w-[511px] lg:h-[621px]">
//           <form onSubmit={handleSubmit(onSubmit)} className="md:text-[18px]">
//             <div className="mt-10 mb-7">
//               <p className="font-bold font-raleway text-2xl text-[#10172E] md:text-[32px]">
//                 {t("sign_in.welcome")}
//               </p>
//               <p className="text-[18px] font-normal text-[#656565] md:text-[24px]">
//                 {t("sign_in.login_prompt")}
//               </p>
//             </div>

//             {showFormError && (
//               <p className="text-red-500 mb-3">{t("sign_in.invalid_credentials")}</p>
//             )}

//             <label>
//               {t("sign_in.email_or_phone")} <br />
//               <input
//                 type="text"
//                 {...register("emailPhone")}
//                 placeholder={t("sign_in.placeholders.email_phone")}
//                 className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//               />
//             </label>

//             {errors.emailPhone && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.emailPhone?.message}
//               </p>
//             )}

//             <br />
//             <label>
//               {t("sign_in.password")} <br />
//               <input
//                 {...register("password")}
//                 type="password"
//                 placeholder={t("sign_in.placeholders.password")}
//                 className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-1.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//               />
//             </label>

//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password?.message}
//               </p>
//             )}

//             <br />
//             <div className="flex justify-between">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="block mr-1.5"
//                   {...register("rememberMe")}
//                 />
//                 <span className="block">{t("sign_in.remember_me")}</span>
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-[#439182] cursor-pointer"
//               >
//                 {t("sign_in.forgot_password")}
//               </Link>
//             </div>
//             <button
//               type="submit"
//               className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
//             >
//               {t("sign_in.sign_in")}
//             </button>
//           </form>
//           <AuthFooter />
//         </div>
//         <BackgroundImage />
//       </div>
//     </div>
//   );
// }

// export default SignIn;

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import WapfiLogo from "../WapfiLogo";
import BackgroundImage from "../BackgroundImage";
import AuthFooter from "./AuthFooter";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";

function SignIn() {
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

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
      .required(t("sign_in.errors.email_or_phone_required"))
      .test(
        "is-email-phone",
        t("sign_in.errors.invalid_email_or_phone"),
        (value) => {
          return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
          );
        }
      ),
    password: yup
      .string()
      .required(t("sign_in.errors.password_required"))
      .min(8, t("sign_in.errors.password_min")),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmailPhone");
    if (remembered) {
      setValue("emailPhone", remembered);
    }
  }, [setValue]);

  const onSubmit = async (loginData) => {
    setLoading(true);

    try {
      console.log(loginData.rememberMe);
      if (loginData.rememberMe) {
        localStorage.setItem("rememberedEmailPhone", loginData.emailPhone);
      } else {
        localStorage.removeItem("rememberedEmailPhone");
      }

      const response = await axios.post(
        "/auth/sign_in",
        {
          identifier: loginData.emailPhone,
          password: loginData.password,
          remember_me: loginData.rememberMe,
        }
        // { withCredentials: true }
      );

      // console.log("Login success:", response.data);
      localStorage.setItem("auth_token", response.data.token);
      // console.log("Token saved:", response.data.token);
      setShowFormError(false);
      setShowSuccessMessage(true);

      // navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
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
      {/* <WapfiLogo /> */}
      <div className="px-3">
        <WapfiLogo />
        <div className="mx-auto flex flex-col items-center gap-[40px] w-full mb-12 max-w-[95%] md:text-[18px] md:max-w-[75%] lg:max-w-[511px] lg:gap-[40px] lg:self-center lg:mx-12 xl:mx-14 2xl:ml-32">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-1 self-stretch md:text-[18px]"
          >
            {/* <div className="mt-10 mb-7"> */}
            <div className="flex h-[82px] flex-col items-start shrink-0 self-stretch lg:my-8 2xl:mb-12 2xl:gap-3">
              <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[32px]">
                {t("sign_in.welcome")}
              </p>
              <p className="font-normal text-[18px] text-[#656565] lg:text-[24px]">
                {t("sign_in.login_prompt")}
              </p>
            </div>

            {showFormError && (
              <p className="text-red-500 mb-3">
                {t("sign_in.invalid_credentials")}
              </p>
            )}

            {showSuccessMessage && (
              <p className="text-green-500 mb-3">{t("sign_in.success")}</p>
            )}

            <label className="text-[#222] gap-2">
              {t("sign_in.email_or_phone")} <br />
              <input
                type="text"
                {...register("emailPhone")}
                placeholder={t("sign_in.placeholders.email_phone")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              />
            </label>

            {errors.emailPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailPhone?.message}
              </p>
            )}

            <br />
            <label className="text-[#222] gap-2">
              {t("sign_in.password")} <br />
              {/* <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("sign_in.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
              /> */}
              <div className="relative w-full">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("sign_in.placeholders.password")}
                  className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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
            </label>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            )}

            <br />
            <div className="flex justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px] mt-0 block stroke-[1.333px] stroke-[rgba(0,0,0,0.15)] mr-1.5 border-[#00000026] 2xl:w-[18px] 2xl:h-[18px] 2xl:aspect-[1/1]"
                  {...register("rememberMe")}
                />
                <span className="block">{t("sign_in.remember_me")}</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[#439182] cursor-pointer"
              >
                {t("sign_in.forgot_password")}
              </Link>
            </div>
            <button
              disabled={loading}
              type="submit"
              className={`text-center w-full py-3 px-2.5 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] mt-10 hover:opacity-80 transition-opacity duration-300 ${
                loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? <LoadingSpinner /> : t("sign_in.sign_in")}
            </button>
          </form>
          <AuthFooter />
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default SignIn;
