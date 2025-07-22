


import { useTranslation } from "react-i18next";
import emailIcon from "../../assets/email icon.svg";
import instagramIcon from "../../assets/instagram icon.svg";
import facebookIcon from "../../assets/facebook icon.svg";
import linkedinIcon from "../../assets/linkedin icon.svg";

// app support email and social links
const SUPPORT_EMAIL = "info@wapfilending.com";
const INSTAGRAM_URL = "https://instagram.com/";
const FACEBOOK_URL = "https://facebook.com/";
const LINKEDIN_URL = "https://www.linkedin.com/company/wapfi/";

export default function SupportSection() {
  const { t } = useTranslation();

  return (
    <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white md:w-[85%] md:mx-auto md:mt-8 lg:mt-0 lg:w-full lg:px-7 lg:pt-9 lg:pb-4">
      <div className="flex flex-col gap-12 mb-40">
        <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
          {t("supportSection.title")}
        </p>

        {/* Email Support */}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex gap-4 items-start lg:border lg:p-3 lg:border-[rgba(0,0,0,0.08)] lg:rounded-[8px]"
          aria-label={`Email support at ${SUPPORT_EMAIL}`}
        >
          <img
            src={emailIcon}
            alt="email icon"
            className="block pt-1 lg:pt-1.5"
          />
          <div className="text-left">
            <p className="text-[#222] font-medium">{t("supportSection.email.label")}</p>
            <p className="text-[#666] text-[14px] md:text-[16px] break-all">
              {t("supportSection.email.desc")}
            </p>
          </div>
        </a>

        {/* Instagram */}
        <a
          href={INSTAGRAM_URL}
          className="flex gap-4 items-start lg:border lg:p-3 lg:border-[rgba(0,0,0,0.08)] lg:rounded-[8px]"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit us on Instagram"
        >
          <img
            src={instagramIcon}
            alt="instagram icon"
            className="block pt-1 lg:pt-1.5"
          />
          <div className="text-left">
            <p className="text-[#222] font-medium">{t("supportSection.instagram.label")}</p>
            <p className="text-[#666] text-[14px] md:text-[16px]">
              {t("supportSection.instagram.desc")}
            </p>
          </div>
        </a>

        {/* Facebook */}
        <a
          href={FACEBOOK_URL}
          className="flex gap-4 items-start lg:border lg:p-3 lg:border-[rgba(0,0,0,0.08)] lg:rounded-[8px]"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit us on Facebook"
        >
          <img
            src={facebookIcon}
            alt="facebook icon"
            className="block pt-1 lg:pt-1.5"
          />
          <div className="text-left">
            <p className="text-[#222] font-medium">{t("supportSection.facebook.label")}</p>
            <p className="text-[#666] text-[14px] md:text-[16px]">
              {t("supportSection.facebook.desc")}
            </p>
          </div>
        </a>

        {/* LinkedIn */}
        <a
          href={LINKEDIN_URL}
          className="flex gap-4 items-start lg:border lg:p-3 lg:border-[rgba(0,0,0,0.08)] lg:rounded-[8px]"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit us on LinkedIn"
        >
          <img
            src={linkedinIcon}
            alt="linkedin icon"
            className="block pt-1 lg:pt-1.5"
          />
          <div className="text-left">
            <p className="text-[#222] font-medium">{t("supportSection.linkedin.label")}</p>
            <p className="text-[#666] text-[14px] md:text-[16px]">
              {t("supportSection.linkedin.desc")}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}

