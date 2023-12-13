import axios from "axios";
// eslint-disable-next-line no-unused-vars
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/shop", // 设置您的 API 基础URL
  timeout: 4000, // 设置请求超时时
});
const shopApi = {
  deleteShopById(userId, shopId, token) {
    return axiosInstance.delete("/delete", {
      params: {
        token: token,
        shopId: shopId,
        userId: userId,
      },
    });
  },
  updateShop(data, token) {
    return axiosInstance.put("/update", data, {
      params: {
        token: token,
      },
    });
  },
  addShop(data, token) {
    return axiosInstance.post("/addShop", data, {
      params: {
        token: token,
      },
    });
  },
  getShopByUserId(id){
    return axiosInstance.get("/getShopByUserId", {
      params: {
        userId: id,
      },
    });
  }
};

export default shopApi;
