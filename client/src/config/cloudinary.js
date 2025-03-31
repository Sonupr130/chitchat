// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (imageUrl) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: 'user-profiles',
    transformation: [
      { width: 200, height: 200, crop: "fill" },
      { quality: "auto" }
    ]
  });
  return result.secure_url;
};