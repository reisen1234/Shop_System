import axios from "axios";
// eslint-disable-next-line no-unused-vars
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/goods", // 设置您的 API 基础URL
  timeout: 4000, // 设置请求超时时
});
const goodsApi = {
  getGoodsByUserId(userId) {
    return axiosInstance.get("/getGoodsByUser", {
      params: {
        userId: userId,
      },
    });
  },
  deleteGoodsById(goodsId, shopId, token) {
    return axiosInstance.delete("/delete", {
      params: {
        token: token,
        shopId: shopId,
        goodsId: goodsId,
      },
    });
  },
  updateGoods(data, token) {
    return axiosInstance.put("/update", data, {
      params: {
        token: token,
      },
    });
  },
  addGoods(data, token) {
    return axiosInstance.post("/addGoods", data, {
      params: {
        token: token,
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
  deleteGoodsPhoto(fileName, goodsId, id) {
    return axiosInstance.delete("/deletePhoto", {
      params: {
        fileName: fileName,
        goodsId: goodsId,
        id: id,
      },
    });
  },
};

export default goodsApi;
