// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "./index.css";
// import App from "./App.jsx";
// import { LanguageProvider } from "./context/LanguageContext";
// import './i18n';

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <LanguageProvider>
//         <App />
//       </LanguageProvider>
//     </BrowserRouter>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext";
import { UserContextProvider } from "./context/UserContext.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </UserContextProvider>
  </StrictMode>
);
