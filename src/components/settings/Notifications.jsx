import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "./ToggleSwitch";
import { use_UserData } from "../../context/UserContext";
import { updatePreferences } from "../../api/apiData";

export default function Notifications() {
  const { t } = useTranslation();
  const { userData, refreshUserData } = use_UserData();

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (userData && userData.preferences && userData.preferences.notification) {
      setSmsEnabled(userData.preferences.notification.sms);
      setEmailEnabled(userData.preferences.notification.email);
    }
  }, [userData]);

  // Function to update backend preferences
  const sendPreferenceToBackend = async (type, enabled) => {
    // Clear previous messages immediately
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    try {
      const response = await updatePreferences(
        type,
        enabled,
        emailEnabled,
        smsEnabled,
        userData?.preferences?.language
      );
      if (response.status === 200) {
        setShowSuccessMessage(true);
        // await refreshUserData();
      }
    } catch (error) {
      setShowErrorMessage(true);
      // revert the UI state if the backend update fails
      if (type === "sms") setSmsEnabled(!enabled);
      if (type === "email") setEmailEnabled(!enabled);
      //   await refreshUserData();
    } finally {
      setTimeout(async () => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
        await refreshUserData();
      }, 3000);
    }
  };

  const handleSmsToggle = () => {
    const newState = !smsEnabled;
    setSmsEnabled(newState);
    sendPreferenceToBackend("sms", newState);
  };

  const handleEmailToggle = () => {
    const newState = !emailEnabled;
    setEmailEnabled(newState);
    sendPreferenceToBackend("email", newState);
  };

  return (
    <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <div className="flex flex-col gap-12 mb-40">
        <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
          {t("notificationsSettings.title")}
        </p>

        {showErrorMessage && (
          <p className="text-red-500 mb-3">
            {t("notificationsSettings.error")}
          </p>
        )}

        {showSuccessMessage && (
          <p className="text-green-500 mb-3">
            {t("notificationsSettings.success")}
          </p>
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
          <ToggleSwitch enabled={smsEnabled} onToggle={handleSmsToggle} />
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
          <ToggleSwitch enabled={emailEnabled} onToggle={handleEmailToggle} />
        </div>
      </div>
    </div>
  );
}
