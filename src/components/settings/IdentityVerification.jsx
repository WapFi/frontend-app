// import UnverifiedIcon from "../../assets/unverified icon.svg";
// import VerifiedIcon from "../../assets/verified icon.svg";
// import { useTranslation } from "react-i18next";
// import LoadingSpinner from "../LoadingSpinner";
// import { useState } from "react";
// import { use_UserData } from "../../context/UserContext";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useForm } from "react-hook-form";

// export default function IdentityVerification() {
//   const [loading, setLoading] = useState(false);
//   const { userData } = use_UserData();
//   //   const [] = useState(null);

//   const { t } = useTranslation();

//   const schema = yup.object({
//     nin: yup
//       .string()
//       .required("Please enter your NIN")
//       .matches(/^\d{11}$/, "NIN must be exactly 11 digits"),

//     address: yup
//       .string()
//       .required("Please enter your address")
//       .matches(/^[\w\s.,'’\-/#()]+$/, "Please enter a valid address"),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

//   const onSubmit = async () => {
//     setLoading(true);
//   };

//   return (
//     <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
//       <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
//         Identity & Verification
//       </p>
//       <div className="flex flex-col gap-6">
//         <div>
//           <span className="text-[18px] text-[rgba(34,34,34,0.50)]">BVN</span>
//           <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit mt-2">
//             {userData.bvn_verified === true ? (
//               <>
//                 <img src={VerifiedIcon} alt="verified icon" />
//                 <p className="text-[14px] text-[#16A34A] bg-[#F2FDF5">
//                   {/* {t("creditScore.completed")} */}
//                   Completed
//                 </p>
//               </>
//             ) : (
//               <>
//                 <img src={UnverifiedIcon} alt="unverified icon" />

//                 <p className="text-[14px] text-[#EF4444]">
//                   {/* {t("creditScore.unverified")} */}
//                   Unverified
//                 </p>
//               </>
//             )}
//             {/* <p className="text-[14px] text-[#16A34A] bg-[#F2FDF5">
//               {t("creditScore.completed")}
//             </p> */}
//           </div>
//         </div>
//         <div>
//           <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
//             Phone Number
//           </span>
//           <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)] w-fit mt-2">
//             {/* <p className="text-[14px] text-[#EF4444]">
//               {t("creditScore.unverified")}
//               </p> */}
//             {userData.phone_verified === true ? (
//               <>
//                 <img src={VerifiedIcon} alt="verified icon" />
//                 <p className="text-[14px] text-[#16A34A] bg-[#F2FDF5">
//                   {/* {t("creditScore.completed")} */}
//                   Completed
//                 </p>
//               </>
//             ) : (
//               <>
//                 <img src={UnverifiedIcon} alt="unverified icon" />

//                 <p className="text-[14px] text-[#EF4444]">
//                   {/* {t("creditScore.unverified")} */}
//                   Unverified
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//         <div>
//           <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
//             NIN Verified
//           </span>
//           <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)] w-fit mt-2">
//             {/* <p className="text-[14px] text-[#EF4444]">
//               {t("creditScore.unverified")}
//               </p> */}
//             {userData.nin_verified === true ? (
//               <>
//                 <img src={VerifiedIcon} alt="verified icon" />
//                 <p className="text-[14px] text-[#16A34A] bg-[#F2FDF5">
//                   {/* {t("creditScore.completed")} */}
//                   Completed
//                 </p>
//               </>
//             ) : (
//               <>
//                 <img src={UnverifiedIcon} alt="unverified icon" />

//                 <p className="text-[14px] text-[#EF4444]">
//                   {/* {t("creditScore.unverified")} */}
//                   Unverified
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       {userData.nin_verified === false && (
//         <form
//           // onSubmit={handleSubmit(onSubmit)}
//           className="mt-7 w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
//         >
//           {/* Form error message goes here */}
//           <div>
//             <label className="text-[#222]">NIN</label>
//             <input
//               className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
//               placeholder="Enter your NIN"
//               {...register("nin")}
//             />
//           </div>

//           <br />
//           {errors.nin && (
//             <p className="text-red-500 text-sm mt-1">{errors.nin?.message}</p>
//           )}

//           <div>
//             <label className="text-[#222]">Residential Address</label>
//             <input
//               className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
//               placeholder="Enter your residential address"
//               {...register("address")}
//             />
//           </div>

//           <br />
//           {errors.address && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.address?.message}
//             </p>
//           )}

//           <button
//             disabled={loading}
//             type="submit"
//             onClick={handleSubmit(onSubmit)}
//             className={`mt-7 text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
//               loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
//             }`}
//           >
//             {loading ? <LoadingSpinner /> : "Save"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }


import UnverifiedIcon from "../../assets/unverified icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import { use_UserData } from "../../context/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

export default function IdentityVerification() {
  const [loading, setLoading] = useState(false);
  const { userData } = use_UserData();
  const { t } = useTranslation();

  const schema = yup.object({
    nin: yup
      .string()
      .required("Please enter your NIN")
      .matches(/^\d{11}$/, "NIN must be exactly 11 digits"),
    address: yup
      .string()
      .required("Please enter your address")
      .matches(/^[\w\s.,'’\-/#()]+$/, "Please enter a valid address"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async () => {
    setLoading(true);
  };

  return (
    <div className="rounded-[24px] flex flex-col gap-8 lg:gap-5 mb-10 lg:mb-16 lg:bg-white lg:w-full lg:px-7 lg:pt-9 lg:pb-20">
      <p className="text-[#222] font-semibold text-[24px] font-raleway lg:text-[28px] lg:font-bold lg:text-[#10172E]">
        Identity & Verification
      </p>
      <div className="flex flex-col gap-6">
        {/* BVN */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">BVN</span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              userData.bvn_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {userData.bvn_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">Completed</p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">Unverified</p>
              </>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            Phone Number
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              userData.phone_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {userData.phone_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">Completed</p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">Unverified</p>
              </>
            )}
          </div>
        </div>

        {/* NIN */}
        <div>
          <span className="text-[18px] text-[rgba(34,34,34,0.50)]">
            NIN Verified
          </span>
          <div
            className={`flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] w-fit mt-2 border ${
              userData.nin_verified
                ? "border-[#D3F3DF] bg-[#F2FDF5]"
                : "border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)]"
            }`}
          >
            {userData.nin_verified ? (
              <>
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">Completed</p>
              </>
            ) : (
              <>
                <img src={UnverifiedIcon} alt="unverified icon" />
                <p className="text-[14px] text-[#EF4444]">Unverified</p>
              </>
            )}
          </div>
        </div>
      </div>

      {userData.nin_verified === false && (
        <form
          className="mt-7 w-full flex flex-col gap-1.5 self-stretch md:text-[18px]"
        >
          <div>
            <label className="text-[#222]">NIN</label>
            <input
              className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
              placeholder="Enter your NIN"
              {...register("nin")}
            />
          </div>

          <br />
          {errors.nin && (
            <p className="text-red-500 text-sm mt-1">{errors.nin?.message}</p>
          )}

          <div>
            <label className="text-[#222]">Residential Address</label>
            <input
              className="mt-2 border border-[rgba(0,0,0,0.15)] rounded-lg w-full p-3 text-[rgba(34,34,34,0.50)]"
              placeholder="Enter your residential address"
              {...register("address")}
            />
          </div>

          <br />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address?.message}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className={`mt-7 text-center w-full rounded-[50px] text-[#FFF] font-medium bg-[#439182] py-3 px-3 cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
              loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? <LoadingSpinner /> : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}

