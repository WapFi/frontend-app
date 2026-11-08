


import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import { useTranslation } from "react-i18next";
import { use_UserData } from "../../context/UserContext";
import { getLoanBanks } from "../../api/loansApi";
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
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [banksError, setBanksError] = useState(false);
  const [bankRequest, setBankRequest] = useState(0);
  const [bankSearch, setBankSearch] = useState("");

  const { userData } = use_UserData();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setBanksLoading(true);
    setBanksError(false);
    getLoanBanks(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setBanks(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setBanksError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setBanksLoading(false);
      });
    return () => controller.abort();
  }, [bankRequest]);

  const schema = yup.object({
    account_number: yup
      .string()
      .required(t("loanStep2.errors.accountNumberRequired"))
      .matches(/^\d{10}$/, t("loanStep2.errors.accountNumberInvalid")),
    bank_name: yup.string().required(t("loanStep2.errors.bankNameRequired")),
    bank_code: yup.string().required(t("loanStep2.errors.bankSelectionRequired"))
      .test("listed-bank", t("loanStep2.errors.bankSelectionRequired"), function (code) {
        return banks.some((bank) => bank.code === code && bank.name === this.parent.bank_name);
      }),
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
      bank_code: loanFormData.bank_code,
    },
  });

  useEffect(() => {
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(isDirty);
    }
  }, [isDirty, setHasUnsavedChanges]);

  const bankName = watch("bank_name");
  const bankCode = watch("bank_code");
  const selectedBank = banks.find((b) => b.code === bankCode && b.name === bankName);
  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.trim().toLowerCase()) ||
    bank.code.includes(bankSearch.trim()),
  );

  const onSubmit = async (data) => {
    if (banksLoading || banksError || !banks.length) return;
    setLoading(true);
    setFormError(false);

    const submittedBank = banks.find((bank) =>
      bank.code === data.bank_code && bank.name === data.bank_name,
    );

    try {
      updateLoanFormData({
        account_name: userData.full_name,
        account_number: data.account_number,
        bank_name: submittedBank.name,
        bank_code: submittedBank.code,
      });

      if (setHasUnsavedChanges) {
        setHasUnsavedChanges(false);
      }

      if (fromSummary) {
        navigate("/take-a-loan/form/loan-form-summary");
      } else {
        navigate("/take-a-loan/form/loan-repayment-method");
      }
    } catch {
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
          <label htmlFor="bank-selector" className="text-[#222]">{t("loanStep2.bankNameLabel")}</label>
          <input type="hidden" {...register("bank_name")} />
          <input type="hidden" {...register("bank_code")} />

          <button
            id="bank-selector"
            type="button"
            aria-expanded={displayBankDropdown}
            aria-controls="bank-options"
            disabled={banksLoading || banksError || !banks.length}
            className={`w-full text-left flex items-center justify-between cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 mt-2 bg-white ${
              displayBankDropdown ? "rounded-t-lg" : "rounded-[8px]"
            } p-[14px] border border-[rgba(0,0,0,0.08)]`}
            onClick={() => setDisplayBankDropdown(!displayBankDropdown)}
          >
            <span className="min-w-0 break-words">
              {selectedBank ? (
                <>
                  <span className="text-[rgba(34,34,34,0.50)]">{selectedBank.name} ({selectedBank.code})</span>
                </>
              ) : (
                <span className="text-[rgba(34,34,34,0.50)]">
                  {t(banksLoading ? "loanStep2.banksLoading" : "loanStep2.selectBankPlaceholder")}
                </span>
              )}
            </span>
            <img
              src={displayBankDropdown ? chevronUp : chevronDown}
              alt=""
              className="ml-2 shrink-0"
            />
          </button>

          {!banksLoading && (banksError || banks.length === 0) && (
            <div className="mt-2" role="status">
              <p className="text-red-600 text-sm">{t(banksError ? "loanStep2.banksError" : "loanStep2.banksEmpty")}</p>
              <button type="button" className="text-[#439182] underline cursor-pointer py-2"
                onClick={() => setBankRequest((request) => request + 1)}>
                {t("loanStep2.retryBanks")}
              </button>
            </div>
          )}

          {displayBankDropdown && (
            <div id="bank-options" className="mt-[0.2px] bg-white py-[7px] px-[14px] border border-[rgba(0,0,0,0.08)] rounded-b-lg"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setDisplayBankDropdown(false);
                  document.getElementById("bank-selector")?.focus();
                }
              }}>
              <input type="search" autoFocus value={bankSearch}
                onChange={(event) => setBankSearch(event.target.value)}
                aria-label={t("loanStep2.searchBanks")}
                placeholder={t("loanStep2.searchBanks")}
                className="w-full border border-gray-300 rounded-lg p-3 mb-2" />
              <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto">
              {filteredBanks.map((bank) => (
                <button
                  type="button"
                  key={`${bank.id}-${bank.code}`}
                  onClick={() => {
                    setValue("bank_name", bank.name, { shouldValidate: true, shouldDirty: true });
                    setValue("bank_code", bank.code, { shouldValidate: true, shouldDirty: true });
                    setDisplayBankDropdown(false);
                    setBankSearch("");
                    document.getElementById("bank-selector")?.focus();
                  }}
                  className="cursor-pointer flex items-center justify-between gap-2 text-left text-[#222] hover:bg-[rgba(0,0,0,0.05)] focus-visible:outline-2 focus-visible:outline-[#439182] p-2 rounded"
                >
                  <span className="min-w-0 break-words">{bank.name}</span>
                  <span className="text-sm shrink-0">{bank.code}</span>
                </button>
              ))}
              {filteredBanks.length === 0 && <p role="status" className="p-2 text-sm">{t("loanStep2.noMatchingBanks")}</p>}
              </div>
            </div>
          )}
          {errors.bank_name && (
            <p className="text-red-600 text-sm mt-1">{errors.bank_name.message}</p>
          )}
          {errors.bank_code && (
            <p className="text-red-600 text-sm mt-1">{errors.bank_code.message}</p>
          )}
        </div>

        <br />

        <button
          disabled={loading || banksLoading || banksError || !banks.length}
          type="submit"
          className={`text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : t("loanStep2.button")}
        </button>
      </form>
    </div>
  );
}
