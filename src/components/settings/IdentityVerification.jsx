

import UnverifiedIcon from "../../assets/unverified icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import { use_UserData } from "../../context/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import countriesData from "../../data/countries.json";
import chevronDown from "../../assets/chevron-down.svg";
import chevronUp from "../../assets/chevron-up.svg";
import { verifyIdentity } from "../../api/apiData";
import { useDashboard } from "../../context/DashboardContext";
import { useNotifications } from "../../context/NotificationContext";

// Datepicker imports
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export default function IdentityVerification() {
  const [loading, setLoading] = useState(false);
  const { userData, refreshUserData } = use_UserData();
  const { refreshDashboardData } = useDashboard();
  const { t } = useTranslation();
  const { refreshNotificationsCount } = useNotifications();

  const [displayCountryDropdown, setDisplayCountryDropdown] = useState(false);
  const [displayStateDropdown, setDisplayStateDropdown] = useState(false);
  const [formMessage, setFormMessage] = useState({
    type: "",
    text: "",
  });

  // Verification flags
  const bvn_verified = userData.bvn_verified;
  const nin_verified = userData.nin_verified;
  const dob_verified = userData.dob_verified;
  const phone_verified = userData.phone_verified;
  const address_verified = userData.address_verified;
  const ninAddressDOBVerified =
    nin_verified && address_verified && dob_verified;

  // Conditional Yup schema (with translations!)
  const schema = yup.object().shape({
    nin: !nin_verified
      ? yup
          .string()
          .required(t("identityVerification.errors.ninRequired"))
          .matches(/^\d{11}$/, t("identityVerification.errors.ninLength"))
      : yup.string().optional(),
    dob: !dob_verified
      ? yup
          .date()
          .nullable()
          .required(t("identityVerification.errors.dobRequired"))
          .typeError(t("identityVerification.errors.dobFormat"))
      : yup.date().nullable(),
    country: !address_verified
      ? yup.string().required(t("identityVerification.errors.countryRequired"))
      : yup.string().optional(),
    state: !address_verified
      ? yup.string().required(t("identityVerification.errors.stateRequired"))
      : yup.string().optional(),
    street: !address_verified
      ? yup
          .string()
          .required(t("identityVerification.errors.streetRequired"))
          .matches(
            /^[a-zA-Z0-9\s.,'-]+$/,
            t("identityVerification.errors.streetFormat")
          )
      : yup.string().optional(),
    house_number: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s.,'-]*$/,
        t("identityVerification.errors.houseFormat")
      ),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const countryName = watch("country");
  const stateName = watch("state");

  const selectedCountry = countriesData.find((c) => c.name === countryName);
  const statesOfSelectedCountry = selectedCountry ? selectedCountry.states : [];

  // Reset state when country changes
  useEffect(() => {
    if (countryName) {
      setValue("state", "");
    }
  }, [countryName, setValue]);


  const onSubmit = async (data) => {
    setLoading(true);
    setFormMessage({ type: "", text: "" });
    clearErrors();

    const verifications = [
      {
        key: "nin",
        verified: nin_verified,
        data: data.nin,
        type: "NIN",
        errorMessage: t("identityVerification.errors.ninFailed"),
      },
      {
        key: "dob",
        verified: dob_verified,
        data: data.dob ? format(data.dob, "yyyy-MM-dd") : null,
        type: "DOB",
        errorMessage: t("identityVerification.errors.dobFailed"),
      },
      {
        key: "address",
        verified: address_verified,
        data:
          data.country && data.state && data.street
            ? `${data.country} ${data.state} ${data.street} ${
                data.house_number ? data.house_number : ""
              }`
            : null,
        type: "Address",
        errorMessage: t("identityVerification.errors.addressFailed"),
      },
    ];

    let allSuccessful = true;
    let successMessages = [];

    for (const verification of verifications) {
      if (!verification.verified && verification.data) {
        try {
          const response = await verifyIdentity(
            verification.key,
            verification.data
          );
          if (response.status !== 200) {
            setError(verification.key, {
              type: "manual",
              message:
                response.message ||
                `${verification.type}: ${verification.errorMessage}`,
            });
            allSuccessful = false;
          } else {
            successMessages.push(
              `${verification.type}: ${response?.data?.message || "Verified"}`
            );
          }
        } catch (error) {
          setError(verification.key, {
            type: "manual",
            message:
              error?.response?.data?.message ||
              `${verification.type}: ${t(
                "identityVerification.errors.genericError"
              )}`,
          });
          allSuccessful = false;
        }
      }
    }

    if (allSuccessful && successMessages.length > 0) {
      setFormMessage({ type: "success", text: successMessages.join(" ") });
    } else if (!allSuccessful && Object.keys(errors).length === 0) {
      // Fallback for form-level errors not tied to a specific field.
      setFormMessage({
        type: "error",
        text: t("identityVerification.errors.genericError"),
      });
    }

    setTimeout(async () => {
      try {
        console.log("before refresh: ", userData);
        const freshUserData = await refreshUserData();
        console.log("after refresh: ", freshUserData);
        if (freshUserData) {
          reset();
          await refreshDashboardData();
        }
      } catch (err) {
        console.warn("Could not refresh user after verification", err);
      }
    }, 3000);

    await refreshNotificationsCount();
    setLoading(false);
  };
  return (
    <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
        {t("identityVerification.title")}
      </p>
      <div className="flex flex-col gap-6">
        {/* BVN */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            {" "}
            {t("identityVerification.bvn")}
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              bvn_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {bvn_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {" "}
                  {t("identityVerification.completed")}
                </p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {" "}
                  {t("identityVerification.unverified")}
                </p>
              </>
            )}
          </div>
        </div>
        {/* Phone Number */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            {t("identityVerification.phoneNumber")}
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              phone_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {phone_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {" "}
                  {t("identityVerification.phoneNumber")}
                </p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {" "}
                  {t("identityVerification.unverified")}
                </p>
              </>
            )}
          </div>
        </div>
        {/* NIN */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            {t("identityVerification.ninVerified")}
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              nin_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {nin_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {" "}
                  {t("identityVerification.completed")}
                </p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {" "}
                  {t("identityVerification.unverified")}
                </p>
              </>
            )}
          </div>
        </div>
        {/* Date of Birth */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            {t("identityVerification.dobVerified")}
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              dob_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {dob_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {" "}
                  {t("identityVerification.completed")}
                </p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {" "}
                  {t("identityVerification.unverified")}
                </p>
              </>
            )}
          </div>
        </div>
        {/* Residential Address */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            {t("identityVerification.residentialAddress")}
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              address_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {address_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {t("identityVerification.completed")}
                </p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {t("identityVerification.unverified")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conditional form rendering if all not verified */}
      {!ninAddressDOBVerified && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
        >
          {formMessage.type === "error" && (
            <p className="text-red-500 mb-3">{formMessage.text}</p>
          )}

          {formMessage.type === "success" && (
            <p className="text-green-500 mb-3">{formMessage.text}</p>
          )}

          {/* NIN */}
          {!nin_verified && (
            <div className="mb-3 lg:mb-6">
              <label className="text-[#222]">
                {" "}
                {t("identityVerification.form.nin")}
              </label>
              <input
                className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
                placeholder={t("identityVerification.form.enterNin")}
                {...register("nin")}
                disabled={loading}
              />
              {errors.nin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nin?.message}
                </p>
              )}
            </div>
          )}
          {!dob_verified && (
            <div className="mb-3 lg:mb-6">
              <label className="text-[#222] block">
                {t("identityVerification.form.dob")}
              </label>
              <p className="text-[13px]">
                {t("identityVerification.form.dobWarning")}
              </p>
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <div className="relative w-full">
                    <DatePicker
                      wrapperClassName="w-full"
                      customInput={
                        <button
                          type="button"
                          className="w-full flex items-center justify-between text-left text-[rgba(34,34,34,0.50)] mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg p-3 pl-4 cursor-pointer"
                          onClick={field.onClick}
                          disabled={loading}
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="18"
                              viewBox="0 0 17 18"
                              fill="none"
                            >
                              <path
                                d="M6.54543 4.09375C6.40077 4.09375 6.26203 4.15122 6.15974 4.25351C6.05744 4.3558 5.99998 4.49454 5.99998 4.6392C5.99998 4.78387 6.05744 4.92261 6.15974 5.0249C6.26203 5.12719 6.40077 5.18466 6.54543 5.18466H9.81816C9.96282 5.18466 10.1016 5.12719 10.2039 5.0249C10.3061 4.92261 10.3636 4.78387 10.3636 4.6392C10.3636 4.49454 10.3061 4.3558 10.2039 4.25351C10.1016 4.15122 9.96282 4.09375 9.81816 4.09375ZM5.45452 10.0938C5.45452 10.3831 5.33959 10.6606 5.135 10.8651C4.93042 11.0697 4.65294 11.1847 4.36361 11.1847C4.07429 11.1847 3.79681 11.0697 3.59223 10.8651C3.38764 10.6606 3.27271 10.3831 3.27271 10.0938C3.27271 9.80442 3.38764 9.52695 3.59223 9.32236C3.79681 9.11778 4.07429 9.00284 4.36361 9.00284C4.65294 9.00284 4.93042 9.11778 5.135 9.32236C5.33959 9.52695 5.45452 9.80442 5.45452 10.0938ZM5.45452 13.9119C5.45452 14.2013 5.33959 14.4787 5.135 14.6833C4.93042 14.8879 4.65294 15.0028 4.36361 15.0028C4.07429 15.0028 3.79681 14.8879 3.59223 14.6833C3.38764 14.4787 3.27271 14.2013 3.27271 13.9119C3.27271 13.6226 3.38764 13.3451 3.59223 13.1405C3.79681 12.936 4.07429 12.821 4.36361 12.821C4.65294 12.821 4.93042 12.936 5.135 13.1405C5.33959 13.3451 5.45452 13.6226 5.45452 13.9119ZM8.1818 11.1847C8.47112 11.1847 8.7486 11.0697 8.95319 10.8651C9.15777 10.6606 9.27271 10.3831 9.27271 10.0938C9.27271 9.80442 9.15777 9.52695 8.95319 9.32236C8.7486 9.11778 8.47112 9.00284 8.1818 9.00284C7.89247 9.00284 7.61499 9.11778 7.41041 9.32236C7.20582 9.52695 7.09089 9.80442 7.09089 10.0938C7.09089 10.3831 7.20582 10.6606 7.41041 10.8651C7.61499 11.0697 7.89247 11.1847 8.1818 11.1847ZM9.27271 13.9119C9.27271 14.2013 9.15777 14.4787 8.95319 14.6833C8.7486 14.8879 8.47112 15.0028 8.1818 15.0028C7.89247 15.0028 7.61499 14.8879 7.41041 14.6833C7.20582 14.4787 7.09089 14.2013 7.09089 13.9119C7.09089 13.6226 7.20582 13.3451 7.41041 13.1405C7.61499 12.936 7.89247 12.821 8.1818 12.821C8.47112 12.821 8.7486 12.936 8.95319 13.1405C9.15777 13.3451 9.27271 13.6226 9.27271 13.9119ZM12 11.1847C12.2893 11.1847 12.5668 11.0697 12.7714 10.8651C12.976 10.6606 13.0909 10.3831 13.0909 10.0938C13.0909 9.80442 12.976 9.52695 12.7714 9.32236C12.5668 9.11778 12.2893 9.00284 12 9.00284C11.7107 9.00284 11.4332 9.11778 11.2286 9.32236C11.024 9.52695 10.9091 9.80442 10.9091 10.0938C10.9091 10.3831 11.024 10.6606 11.2286 10.8651C11.4332 11.0697 11.7107 11.1847 12 11.1847Z"
                                fill="#A3A3A3"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.81818 0C3.96285 0 4.10158 0.0574675 4.20388 0.15976C4.30617 0.262053 4.36364 0.400791 4.36364 0.545455V1.63636H12V0.545455C12 0.400791 12.0575 0.262053 12.1598 0.15976C12.2621 0.0574675 12.4008 0 12.5455 0C12.6901 0 12.8289 0.0574675 12.9311 0.15976C13.0334 0.262053 13.0909 0.400791 13.0909 0.545455V1.63964C13.3578 1.64182 13.5956 1.65127 13.8044 1.668C14.2025 1.70073 14.5516 1.76945 14.8745 1.93309C15.3876 2.19479 15.8046 2.61219 16.0658 3.12545C16.2305 3.44836 16.2993 3.79745 16.332 4.19455C16.3636 4.58182 16.3636 5.05855 16.3636 5.64982V13.9865C16.3636 14.5778 16.3636 15.0556 16.332 15.4407C16.2993 15.8389 16.2305 16.188 16.0658 16.5109C15.8044 17.0238 15.3874 17.4408 14.8745 17.7022C14.5516 17.8669 14.2025 17.9356 13.8055 17.9684C13.4182 18 12.9415 18 12.3513 18H4.01345C3.42218 18 2.94436 18 2.55927 17.9684C2.16109 17.9356 1.812 17.8669 1.48909 17.7022C0.975825 17.4409 0.558431 17.0239 0.296727 16.5109C0.133091 16.188 0.0643634 15.8389 0.0316362 15.4418C-2.11326e-07 15.0545 0 14.5767 0 13.9855V5.65091C0 5.13273 -2.03198e-08 4.704 0.0218182 4.34509L0.0316362 4.19673C0.0643634 3.79855 0.133091 3.44945 0.296727 3.12655C0.558245 2.61311 0.975658 2.1957 1.48909 1.93418C1.812 1.77055 2.16109 1.70182 2.55818 1.66909C2.76836 1.65236 3.00655 1.64291 3.27273 1.64073V0.545455C3.27273 0.400791 3.33019 0.262053 3.43249 0.15976C3.53478 0.0574675 3.67352 0 3.81818 0ZM3.27273 3.27273V2.73055C3.06415 2.73227 2.85568 2.74063 2.64764 2.75564C2.31818 2.78182 2.12836 2.832 1.98436 2.90509C1.67619 3.06202 1.42566 3.31255 1.26873 3.62073C1.19564 3.76473 1.14545 3.95455 1.11927 4.284C1.09091 4.62109 1.09091 5.05309 1.09091 5.67273V6.27273H15.2727V5.67273C15.2727 5.05309 15.2727 4.62109 15.2444 4.284C15.2182 3.95455 15.168 3.76473 15.0949 3.62073C14.938 3.31255 14.6874 3.06202 14.3793 2.90509C14.2353 2.832 14.0455 2.78182 13.716 2.75564C13.508 2.74063 13.2995 2.73227 13.0909 2.73055V3.27273C13.0909 3.41739 13.0334 3.55613 12.9311 3.65842C12.8289 3.76071 12.6901 3.81818 12.5455 3.81818C12.4008 3.81818 12.2621 3.76071 12.1598 3.65842C12.0575 3.55613 12 3.41739 12 3.27273V2.72727H4.36364V3.27273C4.36364 3.41739 4.30617 3.55613 4.20388 3.65842C4.10158 3.76071 3.96285 3.81818 3.81818 3.81818C3.67352 3.81818 3.53478 3.76071 3.43249 3.65842C3.33019 3.55613 3.27273 3.41739 3.27273 3.27273ZM15.2727 7.36364H1.09091V13.9636C1.09091 14.5833 1.09091 15.0164 1.11927 15.3524C1.14545 15.6818 1.19564 15.8716 1.26873 16.0156C1.42566 16.3238 1.67619 16.5743 1.98436 16.7313C2.12836 16.8044 2.31818 16.8545 2.64764 16.8807C2.98473 16.9091 3.41673 16.9091 4.03636 16.9091H12.3273C12.9469 16.9091 13.38 16.9091 13.716 16.8807C14.0455 16.8545 14.2353 16.8044 14.3793 16.7313C14.6874 16.5743 14.938 16.3238 15.0949 16.0156C15.168 15.8716 15.2182 15.6818 15.2444 15.3524C15.2727 15.0164 15.2727 14.5833 15.2727 13.9636V7.36364Z"
                                fill="#A3A3A3"
                              />
                            </svg>
                            <span>
                              {field.value
                                ? format(field.value, "yyyy-MM-dd")
                                : t("identityVerification.form.selectDob")}
                            </span>
                          </div>
                          {field.value && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(null);
                              }}
                              className="ml-2 cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#A3A3A3"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </span>
                          )}
                        </button>
                      }
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="yyyy-MM-dd"
                      disabled={loading}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      maxDate={new Date()}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dob?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {/* ADDRESS FIELDS */}
          {!address_verified && (
            <>
              {/* Country */}
              <div className="mb-3 lg:mb-6 relative">
                <label className="text-[#222]">
                  {" "}
                  {t("identityVerification.form.country")}
                </label>
                <div
                  className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
                    displayCountryDropdown ? "rounded-t-lg" : "rounded-[8px]"
                  } p-[14px] border border-[rgba(0,0,0,0.08)]`}
                  onClick={() =>
                    !loading && setDisplayCountryDropdown((open) => !open)
                  }
                  tabIndex={0}
                >
                  <span className="text-[rgba(34,34,34,0.50)]">
                    {countryName ||
                      t("identityVerification.form.selectCountry")}
                  </span>
                  <img
                    src={displayCountryDropdown ? chevronUp : chevronDown}
                    alt="toggle"
                    className="ml-2"
                  />
                </div>
                <input
                  type="hidden"
                  {...register("country")}
                  disabled={loading}
                />
                {displayCountryDropdown && (
                  <div className="absolute left-0 right-0 z-40 mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3 max-h-[260px] overflow-y-auto">
                    {countriesData.map((countryObj) => (
                      <button
                        key={countryObj.name}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setValue("country", countryObj.name, {
                            shouldValidate: true,
                          });
                          setDisplayCountryDropdown(false);
                        }}
                        className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                      >
                        {countryObj.name}
                      </button>
                    ))}
                  </div>
                )}
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country?.message}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="mb-3 lg:mb-6 relative">
                <label className="text-[#222]">
                  {" "}
                  {t("identityVerification.form.state")}
                </label>
                <div
                  className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
                    displayStateDropdown ? "rounded-t-lg" : "rounded-[8px]"
                  } p-[14px] border border-[rgba(0,0,0,0.08)]`}
                  onClick={() =>
                    !loading &&
                    countryName &&
                    setDisplayStateDropdown((open) => !open)
                  }
                  tabIndex={0}
                >
                  <span className="text-[rgba(34,34,34,0.50)]">
                    {stateName || t("identityVerification.form.selectState")}
                  </span>
                  <img
                    src={displayStateDropdown ? chevronUp : chevronDown}
                    alt="toggle"
                    className="ml-2"
                  />
                </div>
                <input
                  type="hidden"
                  {...register("state")}
                  disabled={loading}
                />

                {displayStateDropdown && statesOfSelectedCountry.length > 0 && (
                  <div className="absolute left-0 right-0 z-40 mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3 max-h-[260px] overflow-y-auto">
                    {statesOfSelectedCountry.map((state) => (
                      <button
                        key={state.name}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setValue("state", state.name, {
                            shouldValidate: true,
                          });
                          setDisplayStateDropdown(false);
                        }}
                        className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                      >
                        {state.name}
                      </button>
                    ))}
                  </div>
                )}
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state?.message}
                  </p>
                )}
              </div>

              {/* Street */}
              <div className="mb-3 lg:mb-6">
                <label className="text-[#222]">
                  {" "}
                  {t("identityVerification.form.street")}
                </label>
                <input
                  className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
                  placeholder={t("identityVerification.form.enterStreet")}
                  {...register("street")}
                  disabled={loading}
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.street?.message}
                  </p>
                )}
              </div>

              {/* House Number */}
              <div className="mb-3 lg:mb-6">
                <label className="text-[#222]">
                  {" "}
                  {t("identityVerification.form.houseNumber")}
                </label>
                <input
                  className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
                  placeholder={t("identityVerification.form.enterHouseNumber")}
                  {...register("house_number")}
                  disabled={loading}
                />
                {errors.house_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.house_number?.message}
                  </p>
                )}
              </div>
              <br />
            </>
          )}

          <button
            disabled={loading}
            type="submit"
            className={`mt-7 text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
              loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? <LoadingSpinner /> : t("identityVerification.form.save")}
          </button>
        </form>
      )}
    </div>
  );
}
