import axios from "axios";
import axiosInstance from "./axiosInstance";

const cloudinaryUrl = process.env.EXPO_PUBLIC_CLOUDINARY_URL;
const cloudinaryPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const login = async ({ email, password }) => {
  try {
    const data = {
      email: email,
      password: password,
    };
    const response = await axiosInstance.post(`/users/login`, data);
    return response;
  } catch (error) {
    console.log("login in service/auth error : ", error);
    return error;
  }
};

export const signup = async ({ email, password, passwordConfirm, username }) => {
  try {
    const data = { email, password, passwordConfirm, username };
    const response = await axiosInstance.post("/users/signup", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const resendOTP = async () => {
  try {
    const response = await axiosInstance.post("/users/resend-otp");
    return response;
  } catch (error) {
    console.log("resendOTP error: ", error);
    return error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/users/logout");
    return response;
  } catch (error) {
    console.log("logout error: ", error);
    return error;
  }
};

export const forgetPassword = async ({ email }) => {
  try {
    const data = { email };
    const response = await axiosInstance.post("/users/forget-password", data);
    return response;
  } catch (error) {
    console.log("forgetPassword error: ", error);
    return error;
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const data = { email, otp };
    const response = await axiosInstance.post("/users/verify", data);
    return response;
  } catch (error) {
    console.log("resetPassword error: ", error);
    return error;
  }
};

export const changePassword = async ({ email, password, passwordConfirm }) => {
  try {
    const data = { email, password, passwordConfirm };

    const response = await axiosInstance.post("/users/reset-password", data);
    return response;
  } catch (error) {
    console.log("changePassword error: ", error);
    return error;
  }
};

export const updateUser = async (user) => {
  try {
    const response = await axiosInstance.put(`/users/${user?._id}`, user);
    return response;
  } catch (error) {
    console.log("updateUser error: ", error);
    return error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response;
  } catch (error) {
    console.log("deleteUser error: ", error);
    return error;
  }
};

export const uploadImages = async (imageFiles) => {
  try {
    // Tạo mảng các promise cho việc upload nhiều ảnh
    const uploadPromises = imageFiles.map(async (file) => {
      // Tạo form data cho từng ảnh
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'upload.jpg',
      });
      formData.append('upload_preset', cloudinaryPreset);
      console.log(cloudinaryPreset);
      

      // Upload ảnh lên Cloudinary
      const response = await axios.post(
        cloudinaryUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Trả về thông tin ảnh đã upload
      return {
        url: response?.data?.secure_url,
        public_id: response?.data?.public_id,
        width: response?.data?.width,
        height: response?.data?.height
      };
    });

    // Chờ tất cả các ảnh được upload xong
    const uploadedImages = await Promise.all(uploadPromises);
    
    // Trả về mảng các thông tin ảnh đã upload
    return uploadedImages;
    
  } catch (error) {
    console.error('Upload images error:', error?.response);
    throw error; // Ném lỗi để xử lý ở hàm gọi
  }
};

// Hàm hỗ trợ upload một ảnh duy nhất (giữ lại phiên bản cũ để tương thích)
export const uploadToCloudinary = async (uri) => {
  try {
    const images = await uploadImages([{
      uri: uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    }]);
    
    return images[0]?.url;
  } catch (error) {
    console.error('Upload error:', error);
    return error;
  }
};