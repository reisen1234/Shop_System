import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/user", // 设置您的 API 基础URL
  timeout: 3000, // 设置请求超时时
});
const rootApi = {
  getAllUser(token) {
    return axiosInstance.get("/data", {
      params: {
        token: token,
      },
    });
  },
  register(data) {
    return axiosInstance.post("/register", data);
  },
  updateUserData(data, token) {
    return axiosInstance.put("/update", data, {
      params: {
        token: token,
      },
    });
  },

  deleteUserById(id, token) {
    return axiosInstance.delete("/delete", {
      params: {
        token: token,
        id: id,
      },
    });
  },
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
