import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const storedLang = localStorage.getItem("language");
  const [language, setLanguage] = useState(storedLang || "en");

  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
