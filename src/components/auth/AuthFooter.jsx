import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AuthFooter() {
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-normal text-center mb-6 text-[#333]">
        {t("sign_in.dont_have_account")}{" "}
        <Link
          to="/sign-up"
          className="text-[#439182] font-medium cursor-pointer"
        >
          {t("sign_in.sign_up")}
        </Link>
      </p>
      <p className="text-[rgba(51,51,51,0.8)] text-center lg:mt-8">
        {t("sign_in.agree_terms")}{" "}
        <Link
          to="/terms"
          className="cursor-pointer font-medium text-[#333] hover:underline"
        >
          {t("sign_in.terms_conditions")}
        </Link>
        <span className="font-medium text-[#333]">, </span>
        <Link
          to="/privacy"
          className="font-medium text-[#333] cursor-pointer hover:underline"
        >
          {" "}
          {t("sign_in.privacy_policy")}
        </Link>
      </p>
    </div>
  );
}

export default AuthFooter;
