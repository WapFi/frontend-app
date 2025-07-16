// import chevronDown from "../../assets/chevron-down.svg";
// import chevronUp from "../../assets/chevron-up.svg";
// import LoadingSpinner from "../LoadingSpinner";
// import { useState, useEffect } from "react";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useLoanForm } from "../../context/LoanFormContext";
// import { useTranslation } from "react-i18next";
// import { use_UserData } from "../../context/UserContext";

// export default function Step1LoanAmount() {
//   const { t } = useTranslation();
//   const { userData } = use_UserData();
//   const { loanFormData, updateLoanFormData, setHasUnsavedChanges } =
//     useLoanForm();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const fromSummary = location.state?.fromSummary;

//   const [loading, setLoading] = useState(false);
//   const [fadeIn, setFadeIn] = useState(false);
//   const [displayLoanPurposeForm, setDisplayLoanPurposeForm] = useState(false);
//   const [displayMembershipForm, setDisplayMembershipForm] = useState(false);
//   const [formError, setFormError] = useState(false);

//   useEffect(() => {
//     setFadeIn(true);
//   }, []);

//   const schema = yup.object({
//     loanAmount: yup
//       .number()
//       .typeError(t("loanStep1.errors.loanAmountType"))
//       .required(t("loanStep1.errors.loanAmountRequired"))
//       .min(1000, t("loanStep1.errors.loanAmountMin"))
//       .max(1000000, t("loanStep1.errors.loanAmountMax")),
//     loanPurpose: yup
//       .string()
//       .required(t("loanStep1.errors.loanPurposeRequired")),
//     wapanMembership: yup
//       .string()
//       .required(t("loanStep1.errors.membershipRequired")),
//     otherPurpose: yup.string(),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isDirty },
//     watch,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       loanAmount: loanFormData.loan_amount,
//       loanPurpose: loanFormData.loan_purpose,
//       otherPurpose: loanFormData.other_purpose,
//       wapanMembership: loanFormData.wapan_member === true ? "Yes" : "No",
//     },
//   });

//   const loanPurpose = watch("loanPurpose");

//   useEffect(() => {
//     if (setHasUnsavedChanges) {
//       setHasUnsavedChanges(isDirty);
//     }
//   }, [isDirty, setHasUnsavedChanges]);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     setFormError(false);

//     try {
//       updateLoanFormData({
//         loan_amount: data.loanAmount,
//         loan_purpose: data.loanPurpose,
//         wapan_member: data.wapanMembership === "true",
//       });

//       if (setHasUnsavedChanges) {
//         setHasUnsavedChanges(false);
//       }

//       setTimeout(() => {
//         if (fromSummary) {
//           navigate("/take-a-loan/form/loan-form-summary");
//         } else {
//           navigate("/take-a-loan/form/bank-account-confirmation");
//         }
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
//           {t("loanStep1.errors.invalidEntries")}
//         </p>
//       )}

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
//       >
//         <div>
//           <label className="text-[#222]">{t("loanStep1.title")}</label>
//           <input
//             type="text"
//             {...register("loanAmount")}
//             placeholder={t("loanStep1.placeholder")}
//             className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
//           />
//           {errors.loanAmount && (
//             <p className="text-red-600 text-sm mt-1">
//               {errors.loanAmount.message}
//             </p>
//           )}
//           <p className="text-sm text-[#999] mt-1">
//             {t("loanStep1.limitNote", { limit: userData.borrowing_limit })}
//           </p>
//         </div>

//         <br />

//         <div>
//           <label className="text-[#222]">{t("loanStep1.purposeLabel")}</label>
//           <div
//             className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
//               displayLoanPurposeForm ? "rounded-t-lg" : "rounded-[8px]"
//             }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
//             onClick={() => setDisplayLoanPurposeForm(!displayLoanPurposeForm)}
//           >
//             <p className="text-[rgba(34,34,34,0.50)]">
//               {t("loanStep1.purposePlaceholder")}
//             </p>
//             <img
//               src={displayLoanPurposeForm ? chevronUp : chevronDown}
//               alt="toggle"
//               className="ml-2"
//             />
//           </div>
//           {displayLoanPurposeForm && (
//             <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
//               {[
//                 "BUSINESS_NEEDS",
//                 "COLLECTION_ADVANCE",
//                 "PURCHASE_EQUIPMENT",
//                 "RENT",
//                 "OTHER",
//               ].map((option) => (
//                 <label key={option} className="block text-[#222]">
//                   <input
//                     type="radio"
//                     value={option}
//                     {...register("loanPurpose")}
//                     className="mr-2 accent-[#2D6157]"
//                   />
//                   {t(`loanStep1.options.${option}`)}
//                 </label>
//               ))}
//             </div>
//           )}
//           {errors.loanPurpose && (
//             <p className="text-red-600 text-sm mt-1">
//               {errors.loanPurpose.message}
//             </p>
//           )}
//         </div>

//         {loanPurpose === "OTHER" && (
//           <div className="mt-4">
//             <label className="text-[#222]">
//               {t("loanStep1.otherPurposeLabel")}
//             </label>
//             <input
//               type="text"
//               {...register("otherPurpose")}
//               placeholder={t("loanStep1.otherPurposePlaceholder")}
//               className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
//             />
//             {errors.otherPurpose && (
//               <p className="text-red-600 text-sm mt-1">
//                 {errors.otherPurpose.message}
//               </p>
//             )}
//           </div>
//         )}

//         <br />

//         <div>
//           <label className="text-[#222]">
//             {t("loanStep1.membershipLabel")}
//           </label>
//           <div
//             className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
//               displayMembershipForm ? "rounded-t-lg" : "rounded-[8px]"
//             }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
//             onClick={() => setDisplayMembershipForm(!displayMembershipForm)}
//           >
//             <p className="text-[rgba(34,34,34,0.50)] text-[16px]">
//               {t("loanStep1.membershipPlaceholder")}
//             </p>
//             <img
//               src={displayMembershipForm ? chevronUp : chevronDown}
//               alt="toggle"
//               className="ml-2"
//             />
//           </div>
//           {displayMembershipForm && (
//             <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
//               <label className="block text-[#222]">
//                 <input
//                   type="radio"
//                   value="true"
//                   {...register("wapanMembership")}
//                   className="mr-2 accent-[#2D6157]"
//                 />
//                 {t("loanStep1.options.yes")}
//               </label>
//               <label className="block text-[#222]">
//                 <input
//                   type="radio"
//                   value="false"
//                   {...register("wapanMembership")}
//                   className="mr-2 accent-[#2D6157]"
//                 />
//                 {t("loanStep1.options.no")}
//               </label>
//             </div>
//           )}
//           {errors.wapanMembership && (
//             <p className="text-red-600 text-sm mt-1">
//               {errors.wapanMembership.message}
//             </p>
//           )}
//         </div>

//         <br />

//         <button
//           disabled={loading}
//           type="submit"
//           className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
//             loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
//           }`}
//         >
//           {loading ? <LoadingSpinner /> : t("loanStep1.button")}
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
import { useNavigate, useLocation } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import { useTranslation } from "react-i18next";
// import { use_UserData } from "../../context/UserContext";
import { getBorrowingLimit } from "../../api/apiData";

export default function Step1LoanAmount() {
  const { t } = useTranslation();
  // const { userData } = use_UserData();
  const { loanFormData, updateLoanFormData, setHasUnsavedChanges } =
    useLoanForm();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSummary = location.state?.fromSummary;

  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [displayLoanPurposeForm, setDisplayLoanPurposeForm] = useState(false);
  const [displayMembershipForm, setDisplayMembershipForm] = useState(false);
  const [formError, setFormError] = useState(false);
  const [borrowingLimit, setBorrowingLimit] = useState(0);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const fetchBorrowingLimit = async () => {
      const response = await getBorrowingLimit();
      setBorrowingLimit(response.data.borrowing_limit);
    };
    fetchBorrowingLimit();
  }, []);

  const schema = yup.object({
    loanAmount: yup
      .number()
      .typeError(t("loanStep1.errors.loanAmountType"))
      .required(t("loanStep1.errors.loanAmountRequired"))
      .min(1000, t("loanStep1.errors.loanAmountMin"))
      .max(
        borrowingLimit,
        t("loanStep1.errors.loanAmountMax", { limit: borrowingLimit })
      ),
    loanPurpose: yup
      .string()
      .required(t("loanStep1.errors.loanPurposeRequired")),
    wapanMembership: yup
      .string()
      .required(t("loanStep1.errors.membershipRequired")),
    otherPurpose: yup.string(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      loanAmount: loanFormData.loan_amount,
      loanPurpose: loanFormData.loan_purpose,
      otherPurpose: loanFormData.other_purpose,
      wapanMembership: loanFormData.wapan_member === true ? "Yes" : "No",
    },
  });

  const loanPurpose = watch("loanPurpose");
  const wapanMembership = watch("wapanMembership");

  useEffect(() => {
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(isDirty);
    }
  }, [isDirty, setHasUnsavedChanges]);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(false);

    try {
      updateLoanFormData({
        loan_amount: data.loanAmount,
        loan_purpose: data.loanPurpose,
        other_purpose: data.otherPurpose,
        wapan_member: data.wapanMembership === "true",
      });

      if (setHasUnsavedChanges) {
        setHasUnsavedChanges(false);
      }

      setTimeout(() => {
        if (fromSummary) {
          navigate("/take-a-loan/form/loan-form-summary");
        } else {
          navigate("/take-a-loan/form/bank-account-confirmation");
        }
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
          {t("loanStep1.errors.invalidEntries")}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
      >
        <div>
          <label className="text-[#222]">{t("loanStep1.title")}</label>
          <input
            type="text"
            {...register("loanAmount")}
            placeholder={t("loanStep1.placeholder")}
            className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
          />
          {errors.loanAmount && (
            <p className="text-red-600 text-sm mt-1">
              {errors.loanAmount.message}
            </p>
          )}
          <p className="text-sm text-[#999] mt-1">
            {t("loanStep1.limitNote", {
              limit: new Intl.NumberFormat("en-NG").format(borrowingLimit),
            })}
          </p>
        </div>

        <br />

        <div>
          <label className="text-[#222]">{t("loanStep1.purposeLabel")}</label>
          <div
            className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
              displayLoanPurposeForm ? "rounded-t-lg" : "rounded-[8px]"
            }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() => setDisplayLoanPurposeForm(!displayLoanPurposeForm)}
          >
            <p className="text-[rgba(34,34,34,0.50)]">
              {loanPurpose
                ? t(`loanStep1.options.${loanPurpose}`)
                : t("loanStep1.purposePlaceholder")}
            </p>
            <img
              src={displayLoanPurposeForm ? chevronUp : chevronDown}
              alt="toggle"
              className="ml-2"
            />
          </div>
          {displayLoanPurposeForm && (
            <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
              {[
                "BUSINESS_NEEDS",
                "COLLECTION_ADVANCE",
                "PURCHASE_EQUIPMENT",
                "RENT",
                "OTHER",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue("loanPurpose", option, { shouldValidate: true });
                    setDisplayLoanPurposeForm(false);
                  }}
                  className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                >
                  {t(`loanStep1.options.${option}`)}
                </button>
              ))}
            </div>
          )}
          {errors.loanPurpose && (
            <p className="text-red-600 text-sm mt-1">
              {errors.loanPurpose.message}
            </p>
          )}
        </div>

        {loanPurpose === "OTHER" && (
          <div className="mt-4">
            <label className="text-[#222]">
              {t("loanStep1.otherPurposeLabel")}
            </label>
            <input
              type="text"
              {...register("otherPurpose")}
              placeholder={t("loanStep1.otherPurposePlaceholder")}
              className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
            />
            {errors.otherPurpose && (
              <p className="text-red-600 text-sm mt-1">
                {errors.otherPurpose.message}
              </p>
            )}
          </div>
        )}

        <br />

        <div>
          <label className="text-[#222]">
            {t("loanStep1.membershipLabel")}
          </label>
          <div
            className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
              displayMembershipForm ? "rounded-t-lg" : "rounded-[8px]"
            }  p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() => setDisplayMembershipForm(!displayMembershipForm)}
          >
            <p className="text-[rgba(34,34,34,0.50)] text-[16px]">
              {wapanMembership === "Yes"
                ? t("loanStep1.options.yes")
                : wapanMembership === "No"
                ? t("loanStep1.options.no")
                : t("loanStep1.membershipPlaceholder")}
            </p>
            <img
              src={displayMembershipForm ? chevronUp : chevronDown}
              alt="toggle"
              className="ml-2"
            />
          </div>
          {displayMembershipForm && (
            <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3">
              {["true", "false"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setValue(
                      "wapanMembership",
                      value === "true" ? "Yes" : "No",
                      { shouldValidate: true }
                    );
                    setDisplayMembershipForm(false);
                  }}
                  className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                >
                  {value === "true"
                    ? t("loanStep1.options.yes")
                    : t("loanStep1.options.no")}
                </button>
              ))}
            </div>
          )}
          {errors.wapanMembership && (
            <p className="text-red-600 text-sm mt-1">
              {errors.wapanMembership.message}
            </p>
          )}
        </div>

        <br />

        <button
          disabled={loading}
          type="submit"
          className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : t("loanStep1.button")}
        </button>
      </form>
    </div>
  );
}
