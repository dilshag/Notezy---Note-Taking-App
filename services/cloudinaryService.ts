import axios from "axios";

const CLOUD_NAME = "notezycloud"; // Your Cloudinary cloud name
const UPLOAD_PRESET = "notezy_preset"; // Unsigned preset

// export const uploadToCloudinary = async (
//   fileUri: string,
//   fileType: "image" | "video" | "file"
// ): Promise<string> => {
//   try {
//     let uri = fileUri;
//     if (Platform.OS === "ios") uri = uri.replace("file://", ""); // iOS fix

//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       type:
//         fileType === "image"
//           ? "image/jpeg"
//           : fileType === "video"
//           ? "video/mp4"
//           : "application/octet-stream",
//       name: uri.split("/").pop() || "file",
//     } as any);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${fileType}/upload`;
//     const response = await axios.post(url, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     console.log("Cloudinary URL:", response.data.secure_url); // ✅ log URL
//     return response.data.secure_url;
//   } catch (err: any) {
//     console.error("Cloudinary upload failed:", err.response?.data || err.message);
//     throw err;
//   }
// };

export const uploadToCloudinary = async (fileUri: string, fileType: "image" | "video" | "file") => {
  try {
    const formData = new FormData();

    let uri = fileUri;
    // On Android, strip 'file://'
    if (uri.startsWith("file://")) uri = uri.substring(7);

    formData.append("file", {
      uri: fileUri, // keep original URI
      type:
        fileType === "image"
          ? "image/jpeg"
          : fileType === "video"
          ? "video/mp4"
          : "application/octet-stream",
      name: fileUri.split("/").pop() || "file",
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${fileType}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Cloudinary URL:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};


  
//npm install axios
// use Axios to send files to Cloudinary.