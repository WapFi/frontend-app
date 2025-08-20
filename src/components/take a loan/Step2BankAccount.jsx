


import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import { useTranslation } from "react-i18next";
import { use_UserData } from "../../context/UserContext";
import banks from "../../data/banks.json";
import chevronDown from "../../assets/chevron-down.svg";
import chevronUp from "../../assets/chevron-up.svg";

export default function Step2BankAccount() {
  const { t } = useTranslation();
  const { loanFormData, updateLoanFormData, setHasUnsavedChanges } = useLoanForm();
  const location = useLocation();
  const fromSummary = location.state?.fromSummary;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [formError, setFormError] = useState(false);
  const [displayBankDropdown, setDisplayBankDropdown] = useState(false);

  const { userData } = use_UserData();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const schema = yup.object({
    account_number: yup
      .string()
      .required(t("loanStep2.errors.accountNumberRequired"))
      .matches(/^\d{10}$/, t("loanStep2.errors.accountNumberInvalid")),
    bank_name: yup.string().required(t("loanStep2.errors.bankNameRequired")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      account_number: loanFormData.account_number,
      bank_name: loanFormData.bank_name,
    },
  });

  useEffect(() => {
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(isDirty);
    }
  }, [isDirty, setHasUnsavedChanges]);

  const bankName = watch("bank_name");
  const selectedBank = banks.find((b) => b.name === bankName);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(false);

    try {
      updateLoanFormData({
        account_name: userData.full_name,
        account_number: data.account_number,
        bank_name: data.bank_name.trim(),
      });

      if (setHasUnsavedChanges) {
        setHasUnsavedChanges(false);
      }

      setTimeout(() => {
        if (fromSummary) {
          navigate("/take-a-loan/form/loan-form-summary");
        } else {
          navigate("/take-a-loan/form/loan-repayment-method");
        }
      }, 2000);
    } catch (error) {
      console.log("Something went wrong: ", error);
      setFormError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${fadeIn ? "opacity-100" : "opacity-0"} w-[95%] mx-auto md:w-[75%]`}
    >
      {formError && (
        <p className="text-red-500 mb-3">{t("loanStep2.errorForm")}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
      >
        <div>
          <label className="text-[#222]">{t("loanStep2.accountNameLabel")}</label>
          <p className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]">
            {userData.full_name}
          </p>
        </div>

        <br />

        <div>
          <label className="text-[#222]">{t("loanStep2.accountNumberLabel")}</label>
          <input
            type="text"
            {...register("account_number")}
            placeholder={t("loanStep2.accountNumberPlaceholder")}
            className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
          />
          {errors.account_number && (
            <p className="text-red-600 text-sm mt-1">
              {errors.account_number.message}
            </p>
          )}
        </div>

        <br />

        <div>
          <label className="text-[#222]">{t("loanStep2.bankNameLabel")}</label>

          <div
            className={`flex items-center justify-between cursor-pointer mt-2 bg-white ${
              displayBankDropdown ? "rounded-t-lg" : "rounded-[8px]"
            } p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() => setDisplayBankDropdown(!displayBankDropdown)}
          >
            <div className="flex items-center gap-2">
              {selectedBank ? (
                <>
                  <img
                    src={selectedBank.logo}
                    alt={selectedBank.name}
                    className="h-6 w-6 object-contain"
                  />
                  <span className="text-[rgba(34,34,34,0.50)]">{selectedBank.name}</span>
                </>
              ) : (
                <span className="text-[rgba(34,34,34,0.50)]">
                  {t("loanStep2.selectBankPlaceholder")}
                </span>
              )}
            </div>
            <img
              src={displayBankDropdown ? chevronUp : chevronDown}
              alt="toggle"
              className="ml-2"
            />
          </div>

          {displayBankDropdown && (
            <div className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {banks.map((bank) => (
                <button
                  type="button"
                  key={bank.code}
                  onClick={() => {
                    setValue("bank_name", bank.name, { shouldValidate: true });
                    setDisplayBankDropdown(false);
                  }}
                  className="flex items-center gap-2 text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] p-2 rounded"
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="h-5 w-5 object-contain"
                  />
                  <span>{bank.name}</span>
                </button>
              ))}
            </div>
          )}
          {errors.bank_name && (
            <p className="text-red-600 text-sm mt-1">{errors.bank_name.message}</p>
          )}
        </div>

        <br />

        <button
          disabled={loading}
          type="submit"
          className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : t("loanStep2.button")}
        </button>
      </form>
    </div>
  );
}
