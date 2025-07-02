// import LoadingSpinner from "../LoadingSpinner";
// import { useState } from "react";
// import { useLoanForm } from "../../context/LoanFormContext";

// export default function CancelApplicationModal() {
//   const [loading, setLoading] = useState(false);
//   const [cancelError, setCancelError] = useState(false);

//   const onSubmit = async () => {
//     setLoading(true);

//     try {
//       // clear form data context
//     } catch (error) {
//       setCancelError(true);
//     } finally {
//     //   setLoading(false);
//     }
//   };
//   return (
//     <div className="text-center text-[#222] bg-white rounded-[12px] flex flex-col gap-10 py-7 px-5 border">
//       {cancelError && (
//         <p className="text-red-500 mb-3">
//           Something went wrong. Please try again.
//         </p>
//       )}
//       <p className="text-[18px] md:text-[20px]">Cancel Application?</p>
//       <p className="text-[rgba(68,68,68,0.80)]">
//         Are you sure you want to cancel? Any information you've entered so far
//         will be lost.
//       </p>
//       <div className="flex items-center justify-center gap-6">
//         <button
//         disabled={loading}
//         onClick={() => {
//             onSubmit();
//           }}
//           className={`border border-[rgba(0,0,0,0.08)] font-medium rounded-[40px] bg-white py-2.5 px-6 hover:opacity-60 transition-opacity duration-300 ${
//             loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
//           }`}
//           >
//             {loading ? <LoadingSpinner /> : "No, go back"}
//         </button>
//         <button
//         disabled={loading}
//           onClick={() => {
//             onSubmit();
//           }}
//           className={`text-white bg-[#439182] font-medium border border-[rgba(0,0,0,0.08)] rounded-[40px] py-2.5 px-6 hover:opacity-80 transition-opacity duration-300 ${
//             loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
//           }`}
//         >
//           {loading ? <LoadingSpinner /> : "Yes, cancel"}
//         </button>
//       </div>
//     </div>
//   );
// }


export default function CancelApplicationModal({
  onConfirm,
  onCancel,
  loading,
  error,
  targetLocation
}) {
  return (
    <div className="w-[90%] mx-auto lg:w-[50%] text-center text-[#222] bg-white rounded-[12px] flex flex-col gap-10 py-7 px-5">
      {error && (
        <p className="text-red-500 mb-3">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-[18px] md:text-[20px]">Cancel Application?</p>
      <p className="text-[rgba(68,68,68,0.80)]">
        Are you sure you want to cancel? Any information you've entered so far
        will be lost.
      </p>
      <div className="flex items-center justify-center gap-6">
        <button
          disabled={loading}
          onClick={onCancel}
          className={`border border-[rgba(0,0,0,0.08)] font-medium rounded-[40px] bg-white py-2.5 px-6 hover:opacity-60 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : "No, go back"}
        </button>
        <button
          disabled={loading}
          onClick={() => onConfirm(targetLocation)}
          className={`text-white bg-[#439182] font-medium border border-[rgba(0,0,0,0.08)] rounded-[40px] py-2.5 px-6 hover:opacity-80 transition-opacity duration-300 ${
            loading ? "duration-300 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : "Yes, cancel"}
        </button>
      </div>
    </div>
  );
}

