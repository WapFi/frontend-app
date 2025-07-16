// import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useState } from "react";
// import WapfiLogo from "../WapfiLogo";
// import BackgroundImage from "../BackgroundImage";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import axios from "../../api/axios";

// function SignUpAccountVerification() {
//   const { t } = useTranslation();

//   const navigate = useNavigate();

//   const schema = yup.object({
//     fullName: yup
//       .string()
//       .required(t("sign_up.errors.full_name_required"))
//       .transform((value) =>
//         value?.replace(/[\u{1F600}-\u{1F6FF}]/gu, "").trim()
//       )
//       .test("is-fullName", t("sign_up.errors.full_name_invalid"), (value) => {
//         return /^[a-zA-Z]+(?:[' -][a-zA-Z]+)+$/.test(value);
//       }),
//     emailPhone: yup
//       .string()
//       .transform((value) =>
//         value
//           ?.replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
//           .trim()
//           .toLowerCase()
//       )
//       .required(t("sign_up.errors.email_or_phone_required"))
//       .test("is-email-phone", t("sign_up.errors.invalid_email_or_phone"), (value) => {
//         return (
//           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
//         );
//       }),
//     password: yup
//       .string()
//       .required(t("sign_up.errors.password_required"))
//       .min(8, t("sign_up.errors.password_min")),
//     confirmedPassword: yup
//       .string()
//       .required(t("sign_up.errors.password_required"))
//       .min(8, t("sign_up.errors.password_min"))
//       .oneOf([yup.ref("password"), null], t("sign_up.errors.passwords_do_not_match"))
//   });

//   const [showFormError, setShowFormError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     // setValue,
//     formState: { errors },
//   } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

//   //   const onSubmit = (loginData) => {
//   //     console.log(loginData);

//   //     if (
//   //       loginData.fullName !== "John Doe" ||
//   //       loginData.emailPhone !== "test@gmail.com" ||
//   //       loginData.password !== "secret123" ||
//   //       loginData.confirmedPassword !== "secret123"
//   //     ) {
//   //       setShowFormError(true);
//   //     } else {
//   //       setShowFormError(false);
//   //       navigate("/sign-in");
//   //     }
//   //   };

//   const onSubmit = async (signUpData) => {
//     // if (signUpData.password !== signUpData.confirmedPassword) {
//     //   setShowFormError(true);
//     //   // setErrorMessage(t("sign_up.errors.passwords_do_not_match"));
//     //   return;
//     // }

//     try {
//       const response = await axios.post("/auth/sign_up", {
//         full_name: signUpData.fullName,
//         identifier: signUpData.emailPhone,
//         password: signUpData.password,
//         // confirmedPassword: signUpData.confirmedPassword,
//       });

//       console.log("Sign up success:", response.data);
//       setShowFormError(false);
//       navigate("/sign-in");
//     } catch (error) {
//       console.error("Sign up error:", error);
//       setShowFormError(true);
//     }
//   };

//   return (
//     <div>
//       <WapfiLogo />
//       <div className="w-[85%] mb-20 min-h-screen mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6 lg:gap-12 lg:mb-9 lg:flex-row">
//         <div className="md:w-[70%] md:m-14 md:mx-auto md:mt-0 lg:w-[511px] lg:h-[621px]">
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="text-[16px] md:text-[18px]"
//           >
//             <div className="mt-10 mb-7">
//               <p className="font-bold text-2xl text-[#10172E] md:text-[32px] font-raleway">
//                 {t("sign_up.title")}
//               </p>
//               <p className="text-[18px] font-normal text-[#656565] md:text-[24px]">
//                 {t("sign_up.subtitle")}
//               </p>
//             </div>

//             {showFormError && (
//               <p className="text-red-500 mb-3">{t("sign_up.error")}</p>
//             )}

//             <label>
//               {t("sign_up.full_name")} <br />
//               <input
//                 type="text"
//                 {...register("fullName")}
//                 placeholder={t("sign_up.placeholders.full_name")}
//                 className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//               />
//             </label>

//             {errors.fullName && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.fullName?.message}
//               </p>
//             )}
//             <br />

//             <label>
//               {t("sign_up.email_or_phone")} <br />
//               <input
//                 type="text"
//                 {...register("emailPhone")}
//                 placeholder={t("sign_up.placeholders.email_phone")}
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
//               {t("sign_up.password")}
//               <br />
//               <input
//                 {...register("password")}
//                 type="password"
//                 placeholder={t("sign_up.placeholders.password")}
//                 className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//               />
//             </label>

//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password?.message}
//               </p>
//             )}

//             <br />

//             <label>
//               {t("sign_up.confirm_password")} <br />
//               <input
//                 {...register("confirmedPassword")}
//                 type="password"
//                 placeholder={t("sign_up.placeholders.confirm_password")}
//                 className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//               />
//               {errors.confirmedPassword && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.confirmedPassword?.message}
//                 </p>
//               )}
//             </label>
//             <br />

//             <button
//               type="submit"
//               className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
//             >
//               {t("sign_up.sign_up")}
//             </button>
//           </form>
//           <div>
//             <p className="font-normal text-center my-4">
//               {t("sign_up.already_have_account")}{" "}
//               <Link
//                 to="/sign-in"
//                 className="text-[#439182] font-medium cursor-pointer"
//               >
//                 {t("sign_up.sign_in")}
//               </Link>
//             </p>
//             <p className="text-[rgba(51,51,51,0.8)] text-center">
//               {t("sign_up.agree_terms")}{" "}
//               <Link
//                 to="/terms"
//                 className="cursor-pointer font-medium text-[#333]"
//               >
//                 {t("sign_up.terms_conditions")}
//               </Link>
//               ,
//               <Link to="/privacy" className="font-normal cursor-pointer">
//                 {" "}
//                 {t("sign_up.privacy_policy")}
//               </Link>
//             </p>
//           </div>
//         </div>
//         <BackgroundImage />
//       </div>
//     </div>
//   );
// }

// export default SignUpAccountVerification;

import { Link } from "react-router-dom";
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

function SignUpAccountVerification() {
  const [fadeIn, setFadeIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const schema = yup.object({
    fullName: yup
      .string()
      .required(t("sign_up.errors.full_name_required"))
      .transform((value) =>
        value?.replace(/[\u{1F600}-\u{1F6FF}]/gu, "").trim()
      )
      .test("is-fullName", t("sign_up.errors.full_name_invalid"), (value) => {
        return /^[a-zA-Z]+(?:[' -][a-zA-Z]+)+$/.test(value);
      }),
    emailPhone: yup
      .string()
      .transform((value) =>
        value
          ?.replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
          .trim()
          .toLowerCase()
      )
      .required(t("sign_up.errors.email_or_phone_required"))
      .test(
        "is-email-phone",
        t("sign_up.errors.invalid_email_or_phone"),
        (value) => {
          return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
          );
        }
      ),
    password: yup
      .string()
      .required(t("sign_up.errors.password_required"))
      .min(8, t("sign_up.errors.password_min")),
    confirmedPassword: yup
      .string()
      .required(t("sign_up.errors.password_required"))
      .min(8, t("sign_up.errors.password_min"))
      .oneOf(
        [yup.ref("password"), null],
        t("sign_up.errors.passwords_do_not_match")
      ),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

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
    setLoading(true);
    // if (signUpData.password !== signUpData.confirmedPassword) {
    //   setShowFormError(true);
    //   // setErrorMessage(t("sign_up.errors.passwords_do_not_match"));
    //   return;
    // }

    try {
      const response = await axios.post("/auth/sign_up", {
        full_name: signUpData.fullName,
        identifier: signUpData.emailPhone,
        password: signUpData.password,
        // confirmedPassword: signUpData.confirmedPassword,
      });

      console.log("Sign up success:", response.data);
      setShowFormError(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Sign up error:", error);
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
            <div className="flex h-[82px] flex-col items-start shrink-0 self-stretch lg:mb-8 lg:mt-0 2xl:mb-12 2xl:gap-3">
              <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[32px]">
                {t("sign_up.title")}
              </p>
              <p className="font-normal text-[18px] text-[#656565] lg:text-[24px]">
                {t("sign_up.subtitle")}
              </p>
            </div>

            {showFormError && (
              <p className="text-red-500 mb-3">{t("sign_up.error")}</p>
            )}

            {showSuccessMessage && (
              <p className="text-green-500 mb-3">{t("sign_up.success")}</p>
            )}

            <label className="text-[#222] gap-2">
              {t("sign_up.full_name")} <br />
              <input
                type="text"
                {...register("fullName")}
                placeholder={t("sign_up.placeholders.full_name")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              />
            </label>

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName?.message}
              </p>
            )}
            <br />

            <label className="text-[#222] gap-2">
              {t("sign_up.email_or_phone")} <br />
              <input
                type="text"
                {...register("emailPhone")}
                placeholder={t("sign_up.placeholders.email_phone")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
              />
            </label>

            {errors.emailPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailPhone?.message}
              </p>
            )}

            <br />
            <label className="text-[#222] gap-2">
              {t("sign_up.password")}
              <br />
              {/* <input
                {...register("password")}
                type="password"
                placeholder={t("sign_up.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
              /> */}
              <div className="relative w-full">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("sign_up.placeholders.password")}
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

            <label className="text-[#222] gap-2">
              {t("sign_up.confirm_password")} <br />
              {/* <input
                {...register("confirmedPassword")}
                type="password"
                placeholder={t("sign_up.placeholders.confirm_password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
              /> */}
              <div className="relative w-full">
                <input
                  {...register("confirmedPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("sign_up.placeholders.confirm_password")}
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
              className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
                loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? <LoadingSpinner /> : t("sign_up.sign_up")}
            </button>
          </form>
          <div>
            <p className="font-normal text-center mb-6 text-[#333]">
              {t("sign_up.already_have_account")}{" "}
              <Link
                to="/sign-in"
                className="text-[#439182] font-medium cursor-pointer"
              >
                {t("sign_up.sign_in")}
              </Link>
            </p>
            <p className="text-[rgba(51,51,51,0.8)] text-center lg:mt-8">
              {t("sign_up.agree_terms")}{" "}
              <Link
                to="/terms"
                className="cursor-pointer font-medium text-[#333] hover:underline"
              >
                {t("sign_up.terms_conditions")}
              </Link>
              <span className="font-medium text-[#333] hover:underline">
                ,{" "}
              </span>
              <Link
                to="/privacy"
                className="cursor-pointer font-medium text-[#333] hover:underline"
              >
                {" "}
                {t("sign_up.privacy_policy")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default SignUpAccountVerification;
