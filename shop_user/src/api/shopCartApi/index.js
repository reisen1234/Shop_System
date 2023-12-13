import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/shopCart", // 设置您的 API 基础URL
  timeout: 3000, // 设置请求超时时
});
const shopCartApi = {
  addToCart(data, token) {
    return axiosInstance.post("/addToCart", data, {
      params: {
        token: token,
      },
    });
  },
  removeCart(id) {
    return axiosInstance.delete("/removeCart", {
      params: {
        id: id,
      },
    });
  },
  updateGoodsNumber(id, number) {
    return axiosInstance.put("/updateGoodsNumber", null, {
      params: {
        id: id,
        number: number,
      },
    });
  },
  getShopCartByUserId(userId) {
    return axiosInstance.get("/getShopCartByUserId", {
      params: {
        userId: userId,
      },
    });
  },
  deleteByIds(ids) {
    const queryString = ids.map((id) => `ids=${id}`).join("&");
    return axiosInstance.delete(`/deleteByIds?${queryString}`);
  },
};
export default shopCartApi;
