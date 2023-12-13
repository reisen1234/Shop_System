import axios from "axios";
// eslint-disable-next-line no-unused-vars
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/goods", // 设置您的 API 基础URL
  timeout: 4000, // 设置请求超时时
});
const goodsApi = {
  getAllGoods() {
    return axiosInstance.get("/getAllGoods");
  },
  getGoodsLike(like) {
    return axiosInstance.get("/getGoodsLike", {
      params: {
        goodsLike: like,
      },
    });
  },
  getGoodsByShopId(shopId) {
    return axiosInstance.get("/getGoodsByShopId", {
      params: {
        shopId: shopId,
      },
    });
  },
  getGoodsById(id) {
    return axiosInstance.get("/getGoodsById", {
      params: {
        goodsId: id,
      },
    });
  },
};

export default goodsApi;
