import UnverifiedIcon from "../../assets/unverified icon.svg";

function BVNUnverified() {
  return (
    <div className="flex flex-col py-4 px-[18px] gap-2 md:gap-4 justify-center items-start self-strech rounded-xl bg-[#fafafa]">
      <p className="font-medium text-[#222]">
        Tier 0 – Verify Your BVN to Unlock Loan Access
      </p>
      <div className="flex justify-between self-stretch items-center">
        <p className="text-[14px] text-[#888] md:text-[18px]">
          BVN Verification
        </p>
        <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]">
          <img src={UnverifiedIcon} alt="unverified icon" />
          <p className="text-[14px] text-[#EF4444]">Unverified</p>
        </div>
      </div>
    </div>
  );
}

export default BVNUnverified;
