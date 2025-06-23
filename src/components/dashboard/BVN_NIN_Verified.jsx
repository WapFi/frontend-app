import VerifiedIcon from "../../assets/verified icon.svg";

function BVN_NIN_Verified() {
  return (
    <div className="flex flex-col py-4 px-[18px] gap-2 md:gap-4 justify-center items-start self-strech rounded-xl bg-[#fafafa]">
      <p className="font-medium text-[#222]">
        Tier 1 – Complete BVN Verification to Unlock Tier 2
      </p>
      <div className="flex justify-between self-stretch items-center">
        <p className="text-[14px] text-[#888] md:text-[18px]">
          BVN Verification
        </p>
        <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5]">
          <img src={VerifiedIcon} alt="unverified icon" />
          <p className="text-[14px] text-[#16A34A] bg-[#F2FDF5]">Completed</p>
        </div>
      </div>
      <div className="flex justify-between self-stretch items-center">
        <p className="text-[14px] text-[#888] md:text-[18px]">
          NIN Verification
        </p>
        <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5]">
          <img src={VerifiedIcon} alt="unverified icon" />
          <p className="text-[14px] text-[#16A34A]">Completed</p>
        </div>
      </div>
    </div>
  );
}

export default BVN_NIN_Verified;
