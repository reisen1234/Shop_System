import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/user", // 设置您的 API 基础URL
  timeout: 3000, // 设置请求超时时
});
const userApi = {
  login(data, loginType, code) {
    return axiosInstance.post("/login", data, {
      params: {
        type: 0,
        loginType: loginType,
        code: code,
      },
    });
  },
  checkLogin(data) {
    const headers = { "Content-Type": "application/json" };
    return axiosInstance.post("/checkLogin", data, { headers });
  },
  updateUserName(data, token) {
    return axiosInstance.put("/updateName", data, {
      params: {
        token: token,
      },
    });
  },
  updateAvatar(file) {
    return axiosInstance.post(
      "/avatar",
      null,
      {
        params: {
          file: file,
        },
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  getUserById(id) {
    return axiosInstance.get("/getUserById", {
      params: {
        userId: id,
      },
    });
  },
  sendLoginCode(telephone) {
    return axiosInstance.post("/loginCode", null, {
      params: {
        telephone: telephone,
      },
    });
  },
};

export default userApi;
