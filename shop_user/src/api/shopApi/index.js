import axios from "axios";
// eslint-disable-next-line no-unused-vars
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/shop", // 设置您的 API 基础URL
  timeout: 4000, // 设置请求超时时
});
const shopApi = {
  getShopLike(like) {
    return axiosInstance.get("/getShopLike", {
      params: {
        shopLike: like,
      },
    });
  },
  getShopById(id) {
    return axiosInstance.get("getShopById", {
      params: {
        shopId: id,
      },
    });
  },
};

export default shopApi;
