import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

import en from "./locales/en.json";
import ha from "./locales/ha.json";

const userLang = localStorage.getItem("language") === "hausa" ? "ha" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ha: { translation: ha },
  },
  lng: userLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
