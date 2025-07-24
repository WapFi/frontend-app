import UnverifiedIcon from "../../assets/unverified icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useState } from "react";
import { use_UserData } from "../../context/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import nigerianStates from "../../data/nigerianstates.json";
import chevronDown from "../../assets/chevron-down.svg";
import chevronUp from "../../assets/chevron-up.svg";
import { verifyIdentity } from "../../api/apiData";
import { useDashboard } from "../../context/DashboardContext";

export default function IdentityVerification() {
  const [loading, setLoading] = useState(false);
  const { userData, refreshUserData } = use_UserData();
  const { refreshDashboardData } = useDashboard();
  const { t } = useTranslation();

  const [displayStateDropdown, setDisplayStateDropdown] = useState(false);
  const [showFormError, setShowFormError] = useState(false);
  const [showFormSuccess, setShowFormSuccess] = useState(false);

  const [showNINError, setShowNINError] = useState("");
  const [showAddressError, setShowAddressError] = useState("");

  // Verification flags
  const bvn_verified = userData.bvn_verified;
  const nin_verified = userData.nin_verified;
  const phone_verified = userData.phone_verified;
  const address_verified = userData.address_verified;
  const ninAddressVerified = nin_verified && address_verified;

  // Conditional Yup schema (with translations!)
  const schema = yup.object().shape({
    nin: !nin_verified
      ? yup
          .string()
          .required(t("identityVerification.errors.ninRequired"))
          .matches(/^\d{11}$/, t("identityVerification.errors.ninLength"))
      : yup.string(),
    country: !address_verified
      ? yup.string().required(t("identityVerification.errors.countryRequired"))
      : yup.string(),
    state: !address_verified
      ? yup.string().required(t("identityVerification.errors.stateRequired"))
      : yup.string(),
    street: !address_verified
      ? yup
          .string()
          .required(t("identityVerification.errors.streetRequired"))
          .matches(
            /^[a-zA-Z0-9\s.,'-]+$/,
            t("identityVerification.errors.streetFormat")
          )
      : yup.string(),
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
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const stateName = watch("state");

  const onSubmit = async (data) => {
    setLoading(true);
    setShowFormError(false);
    setShowFormSuccess(false);
    setShowNINError("");
    setShowAddressError("");

    let ninOk = nin_verified;
    let addrOk = address_verified;

    let ninMessage = "";
    let addressMessage = "";

    // verify NIN (if not already verified)
    if (!nin_verified && data.nin) {
      try {
        const nin_response = await verifyIdentity("nin", data.nin);
        if (nin_response.status !== 200) {
          //   setShowNINError(t("identityVerification.errors.ninFailed"));
          // Show error message from backend or fallback translation
          setShowNINError(
            nin_response.message
              ? "NIN: " + nin_response.message
              : t("identityVerification.errors.ninFailed")
          );
        } else {
        //   console.log("success nin: ", nin_response);
        //   console.log("nin msg: ", nin_response?.data?.message);
          ninOk = true;
          ninMessage = nin_response?.data?.message || "";
          //   setShowFormSuccess(nin_response?.data?.message);
        }
      } catch (error) {
        // setShowFormError(t("identityVerification.errors.ninGenericError"));
        // setLoading(false);
        // return;
        // console.log("nin error: ", error);
        // console.log("nin msg: ", error?.response?.data.message);
        const errMsg =
          error?.response?.data?.message ||
          t("identityVerification.errors.ninGenericError");
        setShowFormError(errMsg);
        setLoading(false);
        return;
      }
    }

    // verify address (if not already verified)
    if (!address_verified && data.country && data.state && data.street) {
      try {
        const address =
          data.country +
          " " +
          data.state +
          " " +
          data.street +
          (data.house_number ? " " + data.house_number : "");
        const address_response = await verifyIdentity("address", address);
        if (address_response.status !== 200) {
          //   setShowAddressError(t("identityVerification.errors.addressFailed"));
          setShowAddressError(
            address_response.message
              ? "Address: " + address_response.message
              : t("identityVerification.errors.addressFailed")
          );
        } else {
        //   console.log("success: ", address_response);
        //   console.log("address msg: ", address_response?.data?.message);

          addrOk = true;
          addressMessage = address_response?.data?.message || "";
          //   setShowFormSuccess(address_response?.data?.message);
        }
      } catch (error) {
        // setShowFormError(t("identityVerification.errors.addressGenericError"));
        // setLoading(false);
        // return;
        // console.log("address error: ", error);
        // console.log("nin msg: ", error?.response?.data.message);

        const errMsg =
          error?.response?.data?.message ||
          t("identityVerification.errors.addressGenericError");
        setShowFormError(errMsg);
        setLoading(false);
        return;
      }
    }

    // if both nin and address successfully verify, only then show success message
    // show the success message of either, this is from backend response
    if (ninOk && addrOk) {
      setShowFormSuccess(ninMessage);
    } else if (ninOk && !addrOk) {
      // show success message
      setShowFormSuccess("NIN: ", ninMessage);
    } else if (addrOk && !ninOk) {
      setShowFormSuccess("Address: ", addressMessage);
    }

    // If either newly verified (or already verified), refresh user data
    if (ninOk !== nin_verified || addrOk !== address_verified) {
      setTimeout(async () => {
        try {
          const freshUserData = await refreshUserData();
          if (freshUserData) {
            reset();
            await refreshDashboardData();
          }
        } catch (err) {
          // not critical for user - just log
          console.warn("Could not refresh user after verification", err);
        }
      }, 3000);
    }

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
      {!ninAddressVerified && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
        >
          {showFormError && (
            <p className="text-red-500 mb-3">{showFormError}</p>
          )}

          {showFormSuccess && (
            <p className="text-green-500 mb-3">{showFormSuccess}</p>
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
              {showNINError && (
                <p className="text-red-500 text-sm mt-1">{showNINError}</p>
              )}
            </div>
          )}

          {/* ADDRESS FIELDS */}
          {!address_verified && (
            <>
              <div className="mb-3 lg:mb-6">
                <label className="text-[#222]">
                  {" "}
                  {t("identityVerification.form.country")}
                </label>
                <input
                  className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)] bg-gray-100"
                  value="Nigeria"
                  readOnly
                  {...register("country")}
                  disabled={loading}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country?.message}
                  </p>
                )}
              </div>
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
                    !loading && setDisplayStateDropdown((open) => !open)
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

                {displayStateDropdown && (
                  <div className="absolute left-0 right-0 z-40 mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3 max-h-[260px] overflow-y-auto">
                    {nigerianStates.map((state) => (
                      <button
                        key={state}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setValue("state", state, { shouldValidate: true });
                          setDisplayStateDropdown(false);
                        }}
                        className="text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                      >
                        {state}
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
              </div>
              {showAddressError && (
                <p className="text-red-500 text-sm mt-1">{showAddressError}</p>
              )}
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
