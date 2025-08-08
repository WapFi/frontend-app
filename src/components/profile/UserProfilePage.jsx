// import { useState, useEffect, useRef } from "react";
// import { use_UserData } from "../../context/UserContext";
// import PageLoader from "../PageLoader";
// import { useTranslation } from "react-i18next";
// import closeIcon from "../../assets/closeIcon.svg";
// import { updateAttachment, deleteAttachment } from "../../api/apiData";

// export default function UserProfilePage({ onClose }) {
//   const { t } = useTranslation();
//   const { userData, refreshUserData } = use_UserData();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(null);
//   const [isPictureUpdating, setIsPictureUpdating] = useState(false);
//   const fileInputRef = useRef(null);
//   const [selectedImageBase64, setSelectedImageBase64] = useState(null);
//   const [showSupportMsg, setShowSupportMsg] = useState(false);

//   useEffect(() => {
//     async function getUserData() {
//       setLoading(true);
//       setError(null);
//       try {
//         await refreshUserData();
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch user data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     getUserData();
//   }, []); // Add refreshUserData to dependencies as it's from context

//   const name = userData?.full_name || "N/A";
//   const contact = userData?.identifier || "N/A";
//   const dob = userData?.date_of_birth || "N/A";

//   // profilePictureData will now be the Base64 string or null/undefined
//   const profilePictureData = userData?.profile_picture;

//   const handleChangePictureButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   // Handler for when a file is selected by the user
//   const handleFileSelected = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // Basic validation for image type
//       if (!file.type.startsWith("image/")) {
//         setError(
//           t("profile_page.file_type_error", "Please select an image file.")
//         );
//         setSelectedImageBase64(null);
//         return;
//       }
//       // Optional: Basic validation for file size (e.g., 5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         // 5 MB
//         setError(
//           t("profile_page.file_size_error", "File size exceeds 5MB limit.")
//         );
//         setSelectedImageBase64(null);
//         return;
//       }

//       setError(null); // Clear any previous errors

//       const reader = new FileReader();
//       reader.readAsDataURL(file); // Read file as Base64 Data URL
//       reader.onload = () => {
//         setSelectedImageBase64(reader.result); // Store the Base64 string
//       };
//       reader.onerror = (error) => {
//         console.error("Error reading file:", error);
//         setError(t("profile_page.file_read_error", "Failed to read file."));
//         setSelectedImageBase64(null);
//       };
//     } else {
//       setSelectedImageBase64(null); // No file selected
//     }
//     event.target.value = null; // Clear file input value
//   };

//   // Handler for the "Save Picture" button
//   const handleSavePicture = async () => {
//     // Only proceed if a file has been selected for upload
//     if (!selectedImageBase64 || isPictureUpdating) {
//       // You might want to provide a user-friendly message here if no file is selected
//       setError(
//         t("profile_page.no_file_selected", "Please select a file to upload.")
//       );
//       return;
//     }

//     setIsPictureUpdating(true);
//     setError(null);

//     try {
//       // Send the Base64 string to the backend
//       const response = await updateAttachment("PROFILE_PICTURE", {
//         fileData: selectedImageBase64,
//       });
//       setShowSuccess(response.data?.message);

//       await refreshUserData();
//       setSelectedImageBase64(null); // Clear pending selection after save
//       alert(t("profile_page.picture_updated_success", response.data?.message));
//     } catch (err) {
//       console.error("Error updating profile picture:", err);
//       setError(err.response?.data?.message);
//     } finally {
//       setIsPictureUpdating(false);
//       setTimeout(() => {
//         setShowSuccess(null);
//       }, 4000);
//     }
//   };

//   // Handler for deleting the profile picture
//   const handleDeletePicture = async () => {
//     if (!profilePictureData || isPictureUpdating) return; // Disable if no current picture or already updating

//     if (
//       !window.confirm(
//         t(
//           "profile_page.confirm_delete_picture",
//           "Are you sure you want to delete your profile picture?"
//         )
//       )
//     ) {
//       return;
//     }

//     setIsPictureUpdating(true);
//     setError(null);

//     try {
//       // For deletion, we don't send file data, just the type
//       const response = await deleteAttachment("PROFILE_PICTURE");
//       setShowSuccess(response.data?.message);
//       await refreshUserData();
//       alert(t("profile_page.picture_deleted_success", response.data?.message));
//     } catch (err) {
//       console.error("Error deleting profile picture:", err);
//       setError(err.response?.data?.message);
//     } finally {
//       setIsPictureUpdating(false);
//       setTimeout(() => {
//         setShowSuccess(null);
//       }, 4000);
//     }
//   };

//   function toggleSupportMsg() {
//     setShowSupportMsg((prev) => !prev);
//   }

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl p-6 relative flex justify-center items-center min-h-[200px]">
//           <PageLoader />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8f8f8] bg-opacity-50 px-4 py-6 overflow-y-auto lg:py-3">
//       <div
//         className={`
//           w-full max-w-[600px] bg-white rounded-lg shadow-xl p-6 my-auto lg:h-[95vh] overflow-y-auto
//         `}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold font-raleway mb-3">
//             {t("profile_page.title", "Profile Details")}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
//           >
//             <img src={closeIcon} alt="Close" className="w-6 h-6" />
//           </button>
//         </div>
//         <div className="md:border md:rounded-[16px] md:border-[rgba(0,0,0,0.08)] md:p-5">
//           {error && <p className="text-red-500 mb-3">{error}</p>}

//           {showSuccess && (
//             <div className=" text-green-500 mb-3">{showSuccess}</div>
//           )}

//           {showSupportMsg && (
//             <p className="text-red-500 mb-3">
//               Your profile information has already been verified and cannot be
//               changed at this time. If you need to update any details, please
//               contact us at support@wapfi.com.
//             </p>
//           )}

//           <div>
//             {/* Profile Picture Section */}
//             <div className="flex flex-col md:flex-row md:items-center md:gap-5">
//               <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//                 {/* Display either the newly selected file (preview) or the current profile data */}
//                 {selectedImageBase64 ? ( // Show preview of selected file if available
//                   <img
//                     src={selectedImageBase64}
//                     alt="Selected Profile Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : profilePictureData ? ( // Otherwise, show existing profile picture data
//                   <img
//                     src={profilePictureData} // This should be the Base64 string from backend
//                     alt="User Profile Picture"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   // Fallback to a generic icon if no picture data
//                   <span className="text-5xl text-gray-400">👤</span>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileSelected}
//                   accept="image/*"
//                   className="hidden"
//                   disabled={isPictureUpdating}
//                 />
//                 <button
//                   onClick={handleChangePictureButtonClick}
//                   disabled={isPictureUpdating}
//                   className="mt-2 rounded-[12px] border-[rgba(0,0,0,0.06)] text-[#2D6157] text-[14px] md:text-[14px] font-medium bg-[#F6F6F6] py-2 px-2.5 hover:opacity-80 transition-opacity duration-300"
//                 >
//                   {isPictureUpdating ? (
//                     <PageLoader />
//                   ) : (
//                     t("profile_page.change_picture", "Change Picture")
//                   )}
//                 </button>
//                 <button
//                   onClick={handleDeletePicture}
//                   disabled={!profilePictureData || isPictureUpdating}
//                   className={`mt-2 px-6 py-2 border rounded-[12px] border-[rgba(0,0,0,0.06)] font-medium
//               ${
//                 profilePictureData && !isPictureUpdating
//                   ? " text-[#EF4444] hover:bg-gray-100"
//                   : "text-[#EF4444] cursor-not-allowed opacity-20"
//               }`}
//                 >
//                   {isPictureUpdating ? (
//                     <PageLoader />
//                   ) : (
//                     t("profile_page.delete_picture", "Delete Picture")
//                   )}
//                 </button>
//               </div>
//             </div>
//             {/* The Save button is now specifically for the selectedImageBase64 */}
//             <button
//               disabled={!selectedImageBase64 || isPictureUpdating} // Only enabled if a new file is selected
//               onClick={handleSavePicture}
//               className={`text-center w-full py-3 px-2.5 my-10 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] ${
//                 !selectedImageBase64 || isPictureUpdating
//                   ? "cursor-not-allowed opacity-50"
//                   : "cursor-pointer"
//               } hover:opacity-80 transition-opacity duration-300`}
//             >
//               {isPictureUpdating ? (
//                 <PageLoader />
//               ) : (
//                 t("profile_page.save_picture", "Save")
//               )}
//             </button>
//           </div>

//           {/* Display-Only Profile Details */}
//           <div className="space-y-4 my-4">
//             <div className="text-[#222]">
//               <p className="text-[rgba(34,34,34,0.50)]">
//                 {t("profile_page.full_name", "Full Name")}
//               </p>
//               <p>{name}</p>
//             </div>
//             <div className="text-[#222]">
//               <p className="text-[rgba(34,34,34,0.50)]">
//                 {t("profile_page.contact", "Contact")}
//               </p>
//               <p>{contact}</p>
//             </div>
//             <div className="text-[#222]">
//               <p className="text-[rgba(34,34,34,0.50)]">
//                 {t("profile_page.date_of_birth", "Date of Birth")}
//               </p>
//               <p>{dob}</p>
//             </div>
//           </div>
//         </div>
//         <button
//           disabled={loading}
//           onClick={toggleSupportMsg}
//           className="text-center w-full py-3 px-2.5 my-10 gap-2.5 border border-[#439182] rounded-[50px] text-[#439182] font-medium bg-[#f1f1f1] cursor-pointer hover:opacity-80 transition-opacity duration-300"
//         >
//           {loading ? <PageLoader /> : t("profile_page.edit_profile", "Edit")}
//         </button>
//       </div>
//     </div>
//   );
// }

// UserProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import { use_UserData } from "../../context/UserContext";
import PageLoader from "../PageLoader";
import { useTranslation } from "react-i18next";
import closeIcon from "../../assets/closeIcon.svg";
import { updateAttachment, deleteAttachment } from "../../api/apiData";
import LoadingSpinner from "../LoadingSpinner";

export default function UserProfilePage({ onClose }) {
  const { t } = useTranslation();
  const { userData, refreshUserData } = use_UserData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [isPictureUpdating, setIsPictureUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState(null);
  const [showSupportMsg, setShowSupportMsg] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function getUserData() {
      setLoading(true);
      setError(null);
      try {
        await refreshUserData();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            t("profile_page.fetch_error", "Failed to fetch user data.")
        );
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  const name = userData?.full_name || "N/A";
  const contact = userData?.identifier || "N/A";
  const dob = userData?.date_of_birth || "N/A";
  const profilePictureData = userData?.profile_picture;
  const creditScore = userData?.credit_score.current_score;

  console.log("user d: ", userData);

  const handleShowDeleteConfirm = () => {
    if (!profilePictureData || isPictureUpdating) return;
    setShowConfirmModal(true);
  };

  const handleDeletePicture = async () => {
    setIsPictureUpdating(true);
    setError(null);
    setShowConfirmModal(false);

    try {
      const response = await deleteAttachment("PROFILE_PICTURE");
      setShowSuccess(
        response.data?.message || t("profile_page.picture_deleted_success")
      );

      await refreshUserData();
    } catch (err) {
      console.error("Error deleting profile picture:", err);
      setError(
        err.response?.data?.message || t("profile_page.picture_deleted_error")
      );
    } finally {
      setIsPictureUpdating(false);
      setTimeout(() => {
        setShowSuccess(null);
        setError(null);
      }, 4000);
    }
  };

  const handleChangePictureButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(t("profile_page.file_type_error"));
        setSelectedImageBase64(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(t("profile_page.file_size_error"));
        setSelectedImageBase64(null);
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImageBase64(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setError(t("profile_page.file_read_error"));
        setSelectedImageBase64(null);
      };
    } else {
      setSelectedImageBase64(null);
    }
    event.target.value = null;
  };

  const handleSavePicture = async () => {
    if (!selectedImageBase64 || isPictureUpdating) {
      setError(t("profile_page.no_file_selected"));
      return;
    }

    setIsPictureUpdating(true);
    setError(null);
    setShowSuccess(null);

    try {
      const response = await updateAttachment("PROFILE_PICTURE", {
        fileData: selectedImageBase64,
      });
      setShowSuccess(
        response.data?.message || t("profile_page.picture_updated_success")
      );
      await refreshUserData();
      setSelectedImageBase64(null);
    } catch (err) {
      console.error("Error updating profile picture:", err);
      setError(
        err.response?.data?.message || t("profile_page.picture_update_error")
      );
    } finally {
      setIsPictureUpdating(false);
      setTimeout(() => {
        setShowSuccess(null);
        setError(null);
      }, 4000);
    }
  };

  // function toggleSupportMsg() {
  //   setShowSupportMsg((prev) => !prev);
  // }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl p-6 relative flex justify-center items-center min-h-[200px]">
          <PageLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-4 bg-opacity-50 py-6 overflow-y-auto lg:py-3">
      {showConfirmModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4 text-center">
            <h3 className="text-xl font-semibold mb-4">
              {t("profile_page.confirm_delete_title")}
            </h3>
            <p className="mb-6">
              {t("profile_page.confirm_delete_attachment")}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 border rounded-[12px] font-medium text-gray-700 hover:bg-gray-100"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDeletePicture}
                className="px-6 py-2 rounded-[12px] font-medium text-white bg-red-500 hover:bg-red-600"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`
          w-full max-w-[600px] bg-white rounded-lg shadow-xl p-6 my-auto lg:h-[95vh] overflow-y-auto
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-raleway mb-3">
            {t("profile_page.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <img src={closeIcon} alt="Close" className="w-6 h-6" />
          </button>
        </div>
        <div className="md:border md:rounded-[16px] md:border-[rgba(0,0,0,0.08)] md:p-5">
          {error && <p className="text-red-500 mb-3">{error}</p>}
          {showSuccess && (
            <div className="text-green-500 mb-3">{showSuccess}</div>
          )}

          {showSupportMsg && (
            <p className="text-red-500 mb-3">
              {t("profile_page.support_message")}
            </p>
          )}

          <div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-5">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {selectedImageBase64 ? (
                  <img
                    src={selectedImageBase64}
                    alt="Selected Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profilePictureData ? (
                  <img
                    src={profilePictureData}
                    alt="User Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-gray-400">👤</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelected}
                  accept="image/*"
                  className="hidden"
                  disabled={isPictureUpdating}
                />
                <button
                  onClick={handleChangePictureButtonClick}
                  disabled={isPictureUpdating}
                  className="mt-2 rounded-[12px] border-[rgba(0,0,0,0.06)] text-[#2D6157] cursor-pointer text-[14px] md:text-[14px] font-medium bg-[#F6F6F6] py-2 px-2.5 hover:opacity-80 transition-opacity duration-300 min-h-[48px] flex items-center justify-center"
                >
                  <span className="flex items-center justify-center min-w-[130px]">
                    {isPictureUpdating ? (
                      <LoadingSpinner />
                    ) : (
                      t("profile_page.change_picture")
                    )}
                  </span>
                </button>
                <button
                  onClick={handleShowDeleteConfirm}
                  disabled={!profilePictureData || isPictureUpdating}
                  className={`mt-2 px-2.5 py-2 border rounded-[12px] border-[rgba(0,0,0,0.06)] font-medium cursor-pointer min-h-[48px] flex items-center justify-center
              ${
                profilePictureData && !isPictureUpdating
                  ? " text-[#EF4444] hover:bg-gray-100"
                  : "text-[#EF4444] cursor-not-allowed opacity-20"
              }`}
                >
                  <span className="flex items-center justify-center min-w-[130px]">
                    {isPictureUpdating ? (
                      <LoadingSpinner />
                    ) : (
                      t("profile_page.delete_picture")
                    )}
                  </span>
                </button>
              </div>
            </div>
            <button
              disabled={!selectedImageBase64 || isPictureUpdating}
              onClick={handleSavePicture}
              className={`text-center w-full py-3 px-2.5 my-10 gap-2.5 rounded-[50px] text-[#FFF] font-medium bg-[#439182] flex items-center justify-center
                ${
                  !selectedImageBase64 || isPictureUpdating
                    ? "cursor-not-allowed opacity-50"
                    : ""
                } hover:opacity-80 transition-opacity duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-center w-[80px] h-[24px]">
                {isPictureUpdating ? (
                  <LoadingSpinner />
                ) : (
                  t("profile_page.save_picture")
                )}
              </div>
            </button>
          </div>

          <div className="space-y-4 my-4">
            <div className="text-[#222]">
              <p className="text-[rgba(34,34,34,0.50)]">
                {t("profile_page.full_name")}
              </p>
              <p>{name}</p>
            </div>
            <div className="text-[#222]">
              <p className="text-[rgba(34,34,34,0.50)]">
                {t("profile_page.contact")}
              </p>
              <p>{contact}</p>
            </div>
            <div className="text-[#222]">
              <p className="text-[rgba(34,34,34,0.50)]">
                {t("profile_page.date_of_birth")}
              </p>
              <p>{dob}</p>
            </div>
            <div className="text-[#222]">
              <p className="text-[rgba(34,34,34,0.50)]">
                {t("profile_page.credit_score")}
              </p>
              <p>{creditScore}</p>
            </div>
          </div>
        </div>
        {/* <button
          disabled={loading}
          onClick={toggleSupportMsg}
          className="text-center w-full py-3 px-2.5 my-10 gap-2.5 border border-[#439182] rounded-[50px] text-[#439182] font-medium bg-[#f1f1f1] cursor-pointer hover:opacity-80 transition-opacity duration-300"
        >
          {loading ? <LoadingSpinner /> : t("profile_page.edit_profile")}
        </button> */}
      </div>
    </div>
  );
}
