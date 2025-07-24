import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "./ToggleSwitch";
import { use_UserData } from "../../context/UserContext";
import { updatePreferences } from "../../api/apiData";
import PageLoader from "../PageLoader";

export default function Notifications() {
  const { t } = useTranslation();
  const { userData, refreshUserData } = use_UserData();

  const [smsEnabled, setSmsEnabled] = useState(undefined);
  const [emailEnabled, setEmailEnabled] = useState(undefined);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  // show current state of user preferences on mount
  useEffect(() => {
    if (userData && userData.preferences && userData.preferences.notification) {
      setSmsEnabled(userData.preferences.notification.sms);
      setEmailEnabled(userData.preferences.notification.email);
    }
  }, [userData]);

  if (smsEnabled === undefined || emailEnabled === undefined) {
    return <PageLoader />;
  }

  const sendPreferenceToBackend = async (type, enabled) => {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setLoading(true);
    // Update the local states that will be sent
    const newEmailEnabled = type === "email" ? enabled : emailEnabled;
    const newSmsEnabled = type === "sms" ? enabled : smsEnabled;

    try {
      const freshUserData = await refreshUserData();

      // get the latest language preference, otherwise fall back to English
      const newLang = freshUserData?.preferences?.language ?? "ENG";

      const response = await updatePreferences(
        newEmailEnabled,
        newSmsEnabled,
        newLang
      );
      if (response.status === 200) {
        // console.log("res: ", response);
        setSuccessMessage(
          response.data?.message || t("notificationsSettings.success")
        );
        setShowSuccessMessage(true);
        setErrorMessage("");

        // update the preference state after success
        setSmsEnabled(newSmsEnabled);
        setEmailEnabled(newEmailEnabled);
      } else {
        const err = response.data?.message || t("notificationsSettings.error");
        setErrorMessage(err);
        setShowErrorMessage(true);
        setSuccessMessage("");
      }
    } catch (error) {
      const err =
        error.response.data?.message || t("notificationsSettings.error");
      console.log("err: ", err);
      setErrorMessage(err);
      setShowErrorMessage(true);
      setSuccessMessage("");
      if (type === "sms") setSmsEnabled((prev) => !prev);
      if (type === "email") setEmailEnabled((prev) => !prev);
    } finally {
      setLoading(false);
      setTimeout(async () => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
        await refreshUserData();
      }, 1500);
    }
  };

  // Make handlers async and await API call to better handle errors
  const handleSmsToggle = async () => {
    try {
      await sendPreferenceToBackend("sms", !smsEnabled);
    } catch {
      // error handled inside sendPreferenceToBackend
    }
  };

  const handleEmailToggle = async () => {
    try {
      await sendPreferenceToBackend("email", !emailEnabled);
    } catch {}
  };

  return (
    <div className="rounded-[24px] w-full flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <div className="flex flex-col gap-12 mb-40">
        <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
          {t("notificationsSettings.title")}
        </p>

        {showErrorMessage && (
          <p className="text-red-500 mb-3">{errorMessage}</p>
        )}

        {showSuccessMessage && (
          <p className="text-green-500 mb-3">{successMessage}</p>
        )}

        {/* SMS alerts */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#222] font-medium text-[18px]">
              {t("notificationsSettings.sms.label")}
            </p>
            <p className="text-[#666] md:text-[16px]">
              {t("notificationsSettings.sms.desc")}
            </p>
          </div>
          <ToggleSwitch
            enabled={smsEnabled}
            onToggle={handleSmsToggle}
            disabled={loading}
          />
        </div>

        {/* Email alerts */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#222] font-medium text-[18px]">
              {t("notificationsSettings.email.label")}
            </p>
            <p className="text-[#666] md:text-[16px]">
              {t("notificationsSettings.email.desc")}
            </p>
          </div>
          <ToggleSwitch
            enabled={emailEnabled}
            onToggle={handleEmailToggle}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
