// import chevronDown from "../../assets/chevron-down.svg";
// import chevronUp from "../../assets/chevron-up.svg";
// import LoadingSpinner from "../LoadingSpinner";
// import { useState, useEffect } from "react";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useLoanForm } from "../../context/LoanFormContext";
// import { useTranslation } from "react-i18next";

// export default function Step3RepaymentUnderstanding() {
//   const { loanFormData, updateLoanFormData, setHasUnsavedChanges } =
//     useLoanForm();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [loading, setLoading] = useState(false);
//   const [fadeIn, setFadeIn] = useState(false);
//   const [displayRepaymentMethodForm, setDisplayRepaymentMethodForm] =
//     useState(false);
//   const [displayDropOffForm, setDisplayDropOffForm] = useState(false);
//   const [displayLocationForm, setDisplayLocationForm] = useState(false);
//   const [formError, setFormError] = useState(false);

//   useEffect(() => {
//     setFadeIn(true);
//   }, []);

//   const schema = yup.object({
//     repayment_method: yup
//       .string()
//       .required(t("loanStep3.errors.repaymentMethodRequired")),
//     know_drop_off: yup
//       .string()
//       .required(t("loanStep3.errors.knowDropOffRequired")),
//     repayment_location: yup.string().when("know_drop_off", {
//       is: "false",
//       then: (schema) =>
//         schema.required(t("loanStep3.errors.repaymentLocationRequired")),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//     repayment_schedule: yup
//       .string()
//       .required(t("loanStep3.errors.repaymentScheduleRequired")),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//     watch,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       repayment_method: loanFormData.repayment_method,
//       know_drop_off:
//         loanFormData.recyclable_drop_off_known === true ? "true" : "false",
//       repayment_location: loanFormData.repayment_location,
//       repayment_schedule: loanFormData.repayment_schedule,
//     },
//   });

//   useEffect(() => {
//     if (setHasUnsavedChanges) {
//       setHasUnsavedChanges(isDirty);
//     }
//   }, [isDirty, setHasUnsavedChanges]);

//   const repaymentMethod = watch("repayment_method");
//   const knowDropOff = watch("know_drop_off");

//   let dropOffLabel = t("loanStep3.dropOffLabelDefault");
//   if (repaymentMethod === "RECYCLABLES") {
//     dropOffLabel = t("loanStep3.dropOffLabelRecyclables");
//   } else if (repaymentMethod === "CASH") {
//     dropOffLabel = t("loanStep3.dropOffLabelCash");
//   }

//   const onSubmit = async (data) => {
//     setLoading(true);
//     setFormError(false);

//     try {
//       updateLoanFormData({
//         repayment_method: data.repayment_method,
//         recyclable_drop_off_known: data.know_drop_off === "true",
//         repayment_schedule: data.repayment_schedule,
//       });

//       if (setHasUnsavedChanges) {
//         setHasUnsavedChanges(false);
//       }

//       setTimeout(() => {
//         navigate("/take-a-loan/form/loan-form-summary");
//       }, 2000);
//     } catch (error) {
//       console.log("Something went wrong: ", error);
//       setFormError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`${
//         fadeIn ? "opacity-100" : "opacity-0"
//       } w-[95%] mx-auto md:w-[75%]`}
//     >
//       {formError && (
//         <p className="text-red-500 mb-3">
//           {t("loanStep3.errors.invalidEntries")}
//         </p>
//       )}
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
//       >
//         {/* Repayment Method */}
//         <div>
//           <label className="text-[#222]">{t("loanStep3.formTitle")}</label>
//           <div
//             className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
//               displayRepaymentMethodForm ? "rounded-t-lg" : "rounded-[8px]"
//             }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
//             onClick={() =>
//               setDisplayRepaymentMethodForm(!displayRepaymentMethodForm)
//             }
//           >
//             <p className="text-[rgba(34,34,34,0.50)]">
//               {t("loanStep3.selectOption")}
//             </p>
//             <img
//               src={displayRepaymentMethodForm ? chevronUp : chevronDown}
//               alt="toggle"
//               className="ml-2"
//             />
//           </div>
//           {displayRepaymentMethodForm && (
//             <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
//               {["RECYCLABLES", "CASH", "BOTH"].map((option) => (
//                 <label key={option} className="block text-[#222]">
//                   <input
//                     type="radio"
//                     value={option}
//                     {...register("repayment_method")}
//                     className="mr-2 accent-[#2D6157]"
//                   />
//                   {t(`loanStep3.repaymentOptions.${option}`)}
//                 </label>
//               ))}
//             </div>
//           )}
//           {errors.repayment_method && (
//             <p className="text-red-600 text-sm mt-1">
//               {errors.repayment_method.message}
//             </p>
//           )}
//         </div>

//         <br />

//         {/* Drop-Off Knowledge */}
//         <div>
//           <label className="text-[#222]">{dropOffLabel}</label>
//           <div
//             className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
//               displayDropOffForm ? "rounded-t-lg" : "rounded-[8px]"
//             }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
//             onClick={() => setDisplayDropOffForm(!displayDropOffForm)}
//           >
//             <p className="text-[rgba(34,34,34,0.50)] text-[16px]">
//               {t("loanStep3.selectOption")}
//             </p>
//             <img
//               src={displayDropOffForm ? chevronUp : chevronDown}
//               alt="toggle"
//               className="ml-2"
//             />
//           </div>
//           {displayDropOffForm && (
//             <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
//               <label className="block text-[#222]">
//                 <input
//                   type="radio"
//                   value="true"
//                   {...register("know_drop_off")}
//                   className="mr-2 accent-[#2D6157]"
//                 />
//                 {t("loanStep3.yes")}
//               </label>
//               <label className="block">
//                 <input
//                   type="radio"
//                   value="false"
//                   {...register("know_drop_off")}
//                   className="mr-2 accent-[#2D6157]"
//                 />
//                 {t("loanStep3.no")}
//               </label>
//             </div>
//           )}
//           {errors.know_drop_off && (
//             <p className="text-red-600 text-sm mt-1">
//               {errors.know_drop_off.message}
//             </p>
//           )}
//         </div>

//         <br />

//         {/* Location - only if user said No */}
//         {knowDropOff === "false" && (
//           <div className="mb-4">
//             <label className="text-[#222]">
//               {t("loanStep3.locationLabel")}
//             </label>
//             <div
//               className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
//                 displayLocationForm ? "rounded-t-lg" : "rounded-[8px]"
//               }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
//               onClick={() => setDisplayLocationForm(!displayLocationForm)}
//             >
//               <p className="text-[rgba(34,34,34,0.50)]">
//                 {t("loanStep3.selectOption")}
//               </p>
//               <img
//                 src={displayLocationForm ? chevronUp : chevronDown}
//                 alt="toggle"
//                 className="ml-2"
//               />
//             </div>
//             {displayLocationForm && (
//               <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
//                 {["Gwagwalada", "Kubwa", "Maitama"].map((option) => (
//                   <label key={option} className="block text-[#222]">
//                     <input
//                       type="radio"
//                       value={option}
//                       {...register("repayment_location")}
//                       className="mr-2 accent-[#2D6157]"
//                     />
//                     {t(`loanStep3.locations.${option}`)}
//                   </label>
//                 ))}
//               </div>
//             )}
//             {errors.repayment_location && (
//               <p className="text-red-600 text-sm mt-1">
//                 {errors.repayment_location.message}
//               </p>
//             )}
//           </div>
//         )}

//         <br />

//         {/* Repayment Schedule */}

//         <div className="mb-7">
//           <label className="text-[#222]">
//             {t("loanStep3.repaymentScheduleLabel")}
//           </label>
//           <div
//             className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
//               displayRepaymentMethodForm ? "rounded-t-lg" : "rounded-[8px]"
//             }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
//             onClick={() =>
//               setDisplayRepaymentMethodForm(!displayRepaymentMethodForm)
//             }
//           >
//             <p className="text-[rgba(34,34,34,0.50)]">
//               {t("loanStep3.selectOption")}
//             </p>
//             <img
//               src={displayRepaymentMethodForm ? chevronUp : chevronDown}
//               alt="toggle"
//               className="ml-2"
//             />
//           </div>
//           {displayRepaymentMethodForm && (
//             <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
//               {["WEEKLY", "BIWEEKLY", "MONTHLY"].map((option) => (
//                 <label key={option} className="block text-[#222]">
//                   <input
//                     type="radio"
//                     value={option}
//                     {...register("repayment_schedule")}
//                     className="mr-2 accent-[#2D6157]"
//                   />
//                   {t(`loanStep3.repaymentScheduleOptions.${option}`)}
//                 </label>
//               ))}
//             </div>
//           )}
//           {errors.repayment_schedule && (
//             <p className="text-red-600 text-sm mt-1">
//               {errors.repayment_schedule.message}
//             </p>
//           )}
//         </div>

//         <button
//           disabled={loading}
//           type="submit"
//           className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
//             loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
//           }`}
//         >
//           {loading ? <LoadingSpinner /> : "Continue"}
//         </button>
//       </form>
//     </div>
//   );
// }

import chevronDown from "../../assets/chevron-down.svg";
import chevronUp from "../../assets/chevron-up.svg";
import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import { useTranslation } from "react-i18next";

export default function Step3RepaymentUnderstanding() {
  const { loanFormData, updateLoanFormData, setHasUnsavedChanges } =
    useLoanForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [displayRepaymentMethodForm, setDisplayRepaymentMethodForm] =
    useState(false);
  const [displayDropOffForm, setDisplayDropOffForm] = useState(false);
  const [displayLocationForm, setDisplayLocationForm] = useState(false);
  const [displayScheduleForm, setDisplayScheduleForm] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const schema = yup.object({
    repayment_method: yup
      .string()
      .required(t("loanStep3.errors.repaymentMethodRequired")),
    know_drop_off: yup
      .string()
      .required(t("loanStep3.errors.knowDropOffRequired")),
    repayment_location: yup.string().when("know_drop_off", {
      is: "false",
      then: (schema) =>
        schema.required(t("loanStep3.errors.repaymentLocationRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    repayment_schedule: yup
      .string()
      .required(t("loanStep3.errors.repaymentScheduleRequired")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      repayment_method: loanFormData.repayment_method,
      know_drop_off:
        loanFormData.recyclable_drop_off_known === true ? "true" : "false",
      repayment_location: loanFormData.recyclable_drop_off_location,
      repayment_schedule: loanFormData.repayment_schedule,
    },
  });

  useEffect(() => {
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(isDirty);
    }
  }, [isDirty, setHasUnsavedChanges]);

  const repaymentMethod = watch("repayment_method");
  const knowDropOff = watch("know_drop_off");
  const repaymentLocation = watch("repayment_location");
  const repaymentSchedule = watch("repayment_schedule");

  let dropOffLabel = t("loanStep3.dropOffLabelDefault");
  if (repaymentMethod === "RECYCLABLES") {
    dropOffLabel = t("loanStep3.dropOffLabelRecyclables");
  } else if (repaymentMethod === "CASH") {
    dropOffLabel = t("loanStep3.dropOffLabelCash");
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(false);

    try {
      updateLoanFormData({
        repayment_method: data.repayment_method,
        recyclable_drop_off_known: data.know_drop_off === "true",
        recyclable_drop_off_location: data.repayment_location,
        repayment_schedule: data.repayment_schedule,
      });

      if (setHasUnsavedChanges) {
        setHasUnsavedChanges(false);
      }

      setTimeout(() => {
        navigate("/take-a-loan/form/loan-form-summary");
      }, 2000);
    } catch (error) {
      console.log("Something went wrong: ", error);
      setFormError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        fadeIn ? "opacity-100" : "opacity-0"
      } w-[95%] mx-auto md:w-[75%]`}
    >
      {formError && (
        <p className="text-red-500 mb-3">
          {t("loanStep3.errors.invalidEntries")}
        </p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
      >
        {/* Repayment Method */}
        <div>
          <label className="text-[#222]">{t("loanStep3.formTitle")}</label>
          <div
            className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
              displayRepaymentMethodForm ? "rounded-t-lg" : "rounded-[8px]"
            }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() =>
              setDisplayRepaymentMethodForm(!displayRepaymentMethodForm)
            }
          >
            <p className="text-[rgba(34,34,34,0.50)]">
              {repaymentMethod
                ? t(`loanStep3.repaymentOptions.${repaymentMethod}`)
                : t("loanStep3.selectOption")}
            </p>
            <img
              src={displayRepaymentMethodForm ? chevronUp : chevronDown}
              alt="toggle"
              className="ml-2"
            />
          </div>
          {displayRepaymentMethodForm && (
            <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
              {["RECYCLABLES", "CASH", "BOTH"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue("repayment_method", option, {
                      shouldValidate: true,
                    });
                    setDisplayRepaymentMethodForm(false);
                  }}
                  className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                >
                  {t(`loanStep3.repaymentOptions.${option}`)}
                </button>
              ))}
            </div>
          )}
          {errors.repayment_method && (
            <p className="text-red-600 text-sm mt-1">
              {errors.repayment_method.message}
            </p>
          )}
        </div>

        <br />

        {/* Drop-Off Knowledge */}
        <div>
          <label className="text-[#222]">{dropOffLabel}</label>
          <div
            className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
              displayDropOffForm ? "rounded-t-lg" : "rounded-[8px]"
            }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() => setDisplayDropOffForm(!displayDropOffForm)}
          >
            <p className="text-[rgba(34,34,34,0.50)] text-[16px]">
              {knowDropOff === "true"
                ? t("loanStep3.yes")
                : knowDropOff === "false"
                ? t("loanStep3.no")
                : t("loanStep3.selectOption")}
            </p>
            <img
              src={displayDropOffForm ? chevronUp : chevronDown}
              alt="toggle"
              className="ml-2"
            />
          </div>
          {displayDropOffForm && (
            <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
              {["true", "false"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setValue("know_drop_off", value, { shouldValidate: true });
                    setDisplayDropOffForm(false);
                  }}
                  className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                >
                  {value === "true" ? t("loanStep3.yes") : t("loanStep3.no")}
                </button>
              ))}
            </div>
          )}
          {errors.know_drop_off && (
            <p className="text-red-600 text-sm mt-1">
              {errors.know_drop_off.message}
            </p>
          )}
        </div>

        <br />

        {/* Location - only if user said No */}
        {knowDropOff === "false" && (
          <div className="mb-4">
            <label className="text-[#222]">
              {t("loanStep3.locationLabel")}
            </label>
            <div
              className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
                displayLocationForm ? "rounded-t-lg" : "rounded-[8px]"
              }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
              onClick={() => setDisplayLocationForm(!displayLocationForm)}
            >
              <p className="text-[rgba(34,34,34,0.50)]">
                {repaymentLocation
                  ? t(`loanStep3.locations.${repaymentLocation}`)
                  : t("loanStep3.selectOption")}
              </p>
              <img
                src={displayLocationForm ? chevronUp : chevronDown}
                alt="toggle"
                className="ml-2"
              />
            </div>
            {displayLocationForm && (
              <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
                {["Gwagwalada", "Kubwa", "Maitama"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setValue("repayment_location", option, {
                        shouldValidate: true,
                      });
                      setDisplayLocationForm(false);
                    }}
                    className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                  >
                    {t(`loanStep3.locations.${option}`)}
                  </button>
                ))}
              </div>
            )}
            {errors.repayment_location && (
              <p className="text-red-600 text-sm mt-1">
                {errors.repayment_location.message}
              </p>
            )}
          </div>
        )}

        <br />

        {/* Repayment Schedule */}
        <div className="mb-7">
          <label className="text-[#222]">
            {t("loanStep3.repaymentScheduleLabel")}
          </label>
          <div
            className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
              displayScheduleForm ? "rounded-t-lg" : "rounded-[8px]"
            }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() => setDisplayScheduleForm(!displayScheduleForm)}
          >
            <p className="text-[rgba(34,34,34,0.50)]">
              {repaymentSchedule
                ? t(`loanStep3.repaymentScheduleOptions.${repaymentSchedule}`)
                : t("loanStep3.selectOption")}
            </p>
            <img
              src={displayScheduleForm ? chevronUp : chevronDown}
              alt="toggle"
              className="ml-2"
            />
          </div>
          {displayScheduleForm && (
            <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
              {["Weekly", "Bi-Weekly", "Monthly", "Bi-Monthly"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue("repayment_schedule", option, {
                      shouldValidate: true,
                    });
                    setDisplayScheduleForm(false);
                  }}
                  className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                >
                  {t(`loanStep3.repaymentScheduleOptions.${option}`)}
                </button>
              ))}
            </div>
          )}
          {errors.repayment_schedule && (
            <p className="text-red-600 text-sm mt-1">
              {errors.repayment_schedule.message}
            </p>
          )}
        </div>

        <button
          disabled={loading}
          type="submit"
          className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : "Continue"}
        </button>
      </form>
    </div>
  );
}
