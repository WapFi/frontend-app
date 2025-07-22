// import { createContext, useContext, useState, useEffect } from "react";
// import i18n from "../i18n";

// const LanguageContext = createContext();

// export function LanguageProvider({ children }) {
//   const storedLang = localStorage.getItem("language");
//   const [language, setLanguage] = useState(storedLang || "en");

//   useEffect(() => {
//     if (language) {
//       localStorage.setItem("language", language);
//       i18n.changeLanguage(language);
//     }
//   }, [language]);

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   return useContext(LanguageContext);
// }

import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";
import { updatePreferences } from "../api/apiData";
import { use_UserData } from "./UserContext";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { userData, refreshUserData } = use_UserData();
  // const storedLang = localStorage.getItem("language");

  // Initialize state: prefer storedLang, then user data, then default to 'en'
  // const [language, setLanguageState] = useState(
  //   storedLang ||
  //     (userData?.preferences?.language === "ENG"
  //       ? "en"
  //       : userData?.preferences?.language === "HAU"
  //       ? "ha"
  //       : "en") ||
  //     "en"
  // );

  const [language, setLanguageState] = useState(() => {
    // 1. Try to get language from backend user data (most authoritative)
    if (userData?.preferences?.language === "ENG") {
      return "en";
    }
    if (userData?.preferences?.language === "HAU") {
      return "ha";
    }

    // 2. If not in user data, try local storage (client-side preference/cache)
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      return storedLang;
    }

    // 3. Fallback to default (English)
    return "en";
  });

  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
      i18n.changeLanguage(language === "ha" ? "ha" : "en");
    }
  }, [language]);

  // Effect will listen for changes in userData.preferences.language
  // and update the local 'language' state if it differs.
  useEffect(() => {
    const backendLanguage = userData?.preferences?.language;
    const currentFrontendLanguage = language; // This 'language' is the component's state

    if (backendLanguage === "ENG" && currentFrontendLanguage !== "en") {
      setLanguageState("en");
    } else if (backendLanguage === "HAU" && currentFrontendLanguage !== "ha") {
      setLanguageState("ha");
    }
  }, [userData?.preferences?.language]);

  // Function to update language preference on the backend
  const updateLanguagePreferenceBackend = async (newLang) => {
    if (!userData) {
      // Ensure user data is available
      return;
    }

    // Map internal 'en'/'ha' to backend 'ENG'/'HAU'
    const backendLangCode = newLang === "en" ? "ENG" : "HAU";
    // console.log(backendLangCode);

    try {
      const response = await updatePreferences(
        null, // No specific type for notifications here
        null, // No specific state for notifications here
        userData.preferences?.notification?.email, // Current email preference
        userData.preferences?.notification?.sms, // Current SMS preference
        backendLangCode // The new language preference
      );

      if (response.status === 200) {
        // Refresh userData to ensure context is consistent with backend

        await refreshUserData();
      } else {
        // simply return
        return;
      }
    } catch (error) {
      // simply return
      return;
    }
  };

  // Override the default setLanguage to also call the backend update
  const setLanguageAndPersist = (newLang) => {
    setLanguageState(newLang); // Update local state first (optimistic)
    updateLanguagePreferenceBackend(newLang); // Then call backend
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: setLanguageAndPersist }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
