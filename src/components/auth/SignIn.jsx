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
      .test("is-email-phone", t("sign_in.errors.invalid_email_or_phone"), (value) => {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
        );
      }),
    password: yup
      .string()
      .required(t("sign_in.errors.password_required"))
      .min(8, t("sign_in.errors.password_min")),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

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

      const response = await axios.post("/auth/sign_in", {
        identifier: loginData.emailPhone,
        password: loginData.password,
        remember_me: loginData.rememberMe,
      });

      console.log("Login success:", response.data);
      setShowFormError(false);
      setShowSuccessMessage(true);

      // navigate to dashboard
      setTimeout(() => {
        navigate("/sidebar");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setShowFormError(true);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`justify-between lg:flex lg:justify-center lg:my-10 2xl:gap-10 transition-opacity duration-[2500ms] ease-in-out ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* <WapfiLogo /> */}
      <div>
        <WapfiLogo/>
        <div className="mx-auto flex flex-col items-center gap-[40px] w-[389px] h-[621px] md:text-[18px] md:w-[75%] lg:w-[511px] lg:h-[621px] lg:gap-[40px] lg:self-center lg:mx-12 xl:mx-14 2xl:ml-32">
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
              <p className="text-red-500 mb-3">{t("sign_in.invalid_credentials")}</p>
            )}

            {showSuccessMessage && (
              <p className="text-green-500 mb-3">
                {t("sign_in.success")}
              </p>
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
              <input
                {...register("password")}
                type="password"
                placeholder={t("sign_in.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-3 border-1 rounded-lg p-[14px]"
              />
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
