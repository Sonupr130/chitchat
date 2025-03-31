// PROFILE PICTURE UPLOAD FUNCTION ⭐

// function ProfilePictureUpload() {
//     const { user } = useUserStore();
//     const [photoUrl, setPhotoUrl] = useState(user?.photo);
//     const fileInputRef = useRef();
  
//     const handleFileChange = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;
  
//       try {
//         // Show preview while uploading
//         const previewUrl = URL.createObjectURL(file);
//         setPhotoUrl(previewUrl);
  
//         // Upload to backend
//         const formData = new FormData();
//         formData.append('profilePicture', file);
  
//         const response = await axios.patch(
//           `/api/users/${user._id}/profile-picture`,
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
  
//         // Update with Cloudinary URL
//         setPhotoUrl(response.data.photoUrl);
//       } catch (error) {
//         console.error('Upload failed:', error);
//         // Revert to previous photo
//         setPhotoUrl(user.photo);
//       }
//     };
  
//     return (
//       <div className="flex items-center gap-4">
//         <img
//           src={photoUrl}
//           alt="Profile"
//           className="w-16 h-16 rounded-full object-cover"
//         />
//         <div>
//           <button 
//             onClick={() => fileInputRef.current.click()}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             Change Photo
//           </button>
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept="image/*"
//             className="hidden"
//           />
//           <p className="text-xs text-gray-500">
//             {user.photoCloudinary ? "Stored in Cloudinary" : "Using Google photo"}
//           </p>
//         </div>
//       </div>
//     );
//   }