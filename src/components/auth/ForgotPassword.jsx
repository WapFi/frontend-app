// import WapfiLogo from "../WapfiLogo";
// import BackgroundImage from "../BackgroundImage";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import axios from "../../api/axios";

// function ForgotPassword() {
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
//       .required(t("forgot_password.errors.email_or_phone_required"))
//       .test("is-email-phone", t("forgot_password.errors.invalid_email_or_phone"), (value) => {
//         return (
//           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
//         );
//       }),
//   });

//   const [showFormError, setShowFormError] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ mode: "onTouched", resolver: yupResolver(schema) });

//   // const onSubmit = (data) => {
//   //   console.log(data);

//   //   if (data.emailPhone !== "test@gmail.com") {
//   //     setShowFormError(true);
//   //   } else {
//   //     setShowFormError(false);
//   //     navigate("/change-password");
//   //   }
//   // };

//   const onSubmit = async (phoneEmailData) => {
//     try {
//       const response = await axios.post("/auth/request_reset", {
//         identifier: phoneEmailData.emailPhone,
//       });

//       console.log("Forgot password success:", response.data);
//       setShowFormError(false);
//       navigate("/verify-code");
//     } catch (error) {
//       console.error("Forgot password error:", error);
//       setShowFormError(true);
//     }
//   };

//   return (
//     <div>
//       <WapfiLogo />
//       <div className="w-[85%] h-[956px] mx-auto min-md:w-[90%] md:flex md:justify-between md:mt-6 lg:gap-12 lg:mb-9 lg:flex-row">
//         <div className="md:w-[70%] md:mx-auto md:m-14 lg:w-[511px] lg:h-[621px]">
//           <div className="mt-10 mb-7">
//             <p className="font-raleway font-bold text-[24px] text-[#10172E] mt-24 md:text-[32px]">
//               {t("forgot_password.title")}
//             </p>
//             <p className="text-[18px] text-[#656565] mt-3 mb-8 md:text-[24px]">
//               {t("forgot_password.subtext")}
//             </p>
//           </div>
//           <form onSubmit={handleSubmit(onSubmit)} className="md:text-[18px]">
//             {showFormError && (
//               <p className="text-red-500 mb-3">{t("forgot_password.error")}</p>
//             )}

//             <label>
//               {t("forgot_password.email_or_phone")} <br />
//               <input
//                 {...register("emailPhone")}
//                 type="text"
//                 placeholder={t("forgot_password.placeholders.email_phone")}
//                 className="text-[rgba(34,34,34,0.50)] text-[15px] w-full mb-5.5 border-1 rounded-lg p-[14px] md:text-[18px]"
//               />
//             </label>
//             <br />
//             {errors.emailPhone && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.emailPhone?.message}
//               </p>
//             )}

//             <button
//               type="submit"
//               className="text-center w-full my-6 rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer"
//             >
//               {t("forgot_password.continue")}
//             </button>
//           </form>
//         </div>
//         <BackgroundImage />
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;


import WapfiLogo from "../WapfiLogo";
import BackgroundImage from "../BackgroundImage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import LoadingSpinner from "../LoadingSpinner";

function ForgotPassword() {
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
      .required(t("forgot_password.errors.email_or_phone_required"))
      .test("is-email-phone", t("forgot_password.errors.invalid_email_or_phone"), (value) => {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{11}$/.test(value)
        );
      }),
  });

  const [showFormError, setShowFormError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    setLoading(true);
    try {
      const response = await axios.post("/auth/request_reset", {
        identifier: phoneEmailData.emailPhone,
      });

      console.log("Forgot password success:", response.data);
      setShowFormError(false);
      setShowSuccessMessage(true);

      localStorage.setItem("userIdentifier", phoneEmailData.emailPhone);

      setTimeout(() => {
        navigate("/verify-code");
      }, 2000);
    } catch (error) {
      console.error("Forgot password error:", error);
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
      <div>
        <WapfiLogo />
        <div className="mx-auto flex flex-col items-center gap-[40px] w-full max-w-[95%] md:text-[18px] md:max-w-[75%] lg:max-w-[511px] lg:gap-[40px] lg:self-center lg:mx-12 xl:mx-14 2xl:ml-32">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-1 self-stretch md:text-[18px]"
          >
            <div className="mt-10 mb-7 flex flex-col gap-[9px]">
              <p className="font-bold font-raleway text-2xl text-[#10172E] lg:text-[32px] lg:mt-14 2xl:gap-3">
                {t("forgot_password.title")}
              </p>
              <p className="font-normal text-[18px] text-[#656565] lg:text-[24px]">
                {t("forgot_password.subtext")}
              </p>
            </div>

            {showFormError && (
              <p className="text-red-500 mb-3">{t("forgot_password.error")}</p>
            )}

            {showSuccessMessage && (
              <p className="text-green-500 mb-3">
                {t("forgot_password.success")}
              </p>
            )}

            <label className="text-[#222] gap-2">
              {t("forgot_password.email_or_phone")} <br />
              <input
                type="text"
                {...register("emailPhone")}
                placeholder={t("forgot_password.placeholders.email_phone")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              />
            </label>

            {errors.emailPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailPhone?.message}
              </p>
            )}

            <br />
            <button
              disabled={loading}
              type="submit"
              className={`text-center w-full py-3 px-2.5 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] hover:opacity-80 transition-opacity duration-300 ${
                loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? <LoadingSpinner /> : t("forgot_password.continue")}
            </button>
          </form>
          {/* <AuthFooter /> */}
        </div>
      </div>
      <BackgroundImage />
    </div>
  );
}

export default ForgotPassword;
