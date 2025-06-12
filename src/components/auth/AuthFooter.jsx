import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AuthFooter() {
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-normal text-center my-4">
        {t("dont_have_account")}{" "}
        <Link
          to="/sign-up"
          className="text-[#439182] font-medium cursor-pointer"
        >
          {t("sign_up")}
        </Link>
      </p>
      <p className="text-[rgba(51,51,51,0.8)] text-center">
        {t("agree_terms")}{" "}
        <Link to="/terms" className="cursor-pointer font-medium text-[#333]">
          {t("terms_conditions")}
        </Link>
        ,
        <Link to="/privacy" className="font-normal cursor-pointer">
          {" "}
          {t("privacy_policy")}
        </Link>
      </p>
    </div>
  );
}

export default AuthFooter;
