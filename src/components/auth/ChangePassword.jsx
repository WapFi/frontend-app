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
      <div>
        <WapfiLogo />

        <div className="mx-auto flex flex-col items-center gap-[40px] w-[389px] h-[621px] md:text-[18px] md:w-[75%] lg:w-[511px] lg:h-[621px] lg:gap-[40px] lg:self-center lg:mx-12 xl:mx-14 2xl:ml-32">
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
              <input
                {...register("newPassword")}
                type="password"
                placeholder={t("change_password.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword?.message}
                </p>
              )}
            </label>
            <br />
            <label className="text-[#222] gap-2">
              {t("change_password.confirm")} <br />
              <input
                {...register("confirmedPassword")}
                type="password"
                placeholder={t("change_password.placeholders.password")}
                className="text-[rgba(34,34,34,0.50)] border-[#00000026] w-full gap-2.5 border-1 rounded-lg p-[14px]"
              />
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
