import axiosInstance from "./axiosInstance"; //  import axiosInstance đã tạo trên axiosInstance.js

export const login = async ({ email, password }) => {
  // declare function login và các param cần thiết
  try {
    // tạo data cơ sở cho request
    const data = {
      email: email,
      password: password,
    };
    const response = await axiosInstance.post(`api/v1/users/login`, data); // sử dụng axiosInstance.post để gửi request đến server
    // Để tạo call 1 api cần chú ý
    //  phương thức : ở đây đang gọi là post (axiosInstance.post)
    //  url: api/v1/users/login
    //  data cơ sở: data (email, password)
    //  tất cả đều phải tương ứng vs api đã đc declare trên server
    return response;
  } catch (error) {
    // nếu có lỗi sẽ chạy vào đây, khi server trả ra status từ 400 đến 500
    console.log("login in service/auth error : ", error); // log lỗi
    return error;
  }
};

// Signup API call
export const signup = async ({
  email,
  password,
  passwordConfirm,
  username,
}) => {
  try {
    const data = { email, password, passwordConfirm, username };
    const response = await axiosInstance.post("api/v1/users/signup", data);
    return response;
  } catch (error) {
    // console.log("signup error: ", error);
    return error;
  }
};

// Resend OTP API call
export const resendOTP = async () => {
  try {
    const response = await axiosInstance.post("api/v1/users/resend-otp");
    return response;
  } catch (error) {
    console.log("resendOTP error: ", error);
    return error;
  }
};

// Logout API call
export const logout = async () => {
  try {
    const response = await axiosInstance.post("api/v1/users/logout");
    return response;
  } catch (error) {
    console.log("logout error: ", error);
    return error;
  }
};

// Forget Password API call
export const forgetPassword = async ({ email }) => {
  try {
    const data = { email };
    const response = await axiosInstance.post(
      "api/v1/users/forget-password",
      data
    );
    return response;
  } catch (error) {
    console.log("forgetPassword error: ", error);
    return error;
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const data = { email, otp };
    const response = await axiosInstance.post("api/v1/users/verify", data);
    return response;
  } catch (error) {
    console.log("resetPassword error: ", error);
    return error;
  }
};

export const changePassword = async ({ email, password, passwordConfirm }) => {
  try {
    const data = { email, password, passwordConfirm };

    const response = await axiosInstance.post(
      "api/v1/users/reset-password",
      data
    );
    return response;
  } catch (error) {
    console.log("changePassword error: ", error);
    return error;
  }
};
