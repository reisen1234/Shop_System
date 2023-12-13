import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/user", // 设置您的 API 基础URL
  timeout: 3000, // 设置请求超时时
});
const rootApi = {
  editPassword(userId, password, token) {
    return axiosInstance.put("/forgetPassword", null, {
      params: {
        token: token,
        id: userId,
        password: password,
      },
    });
  },
};

export default rootApi;
