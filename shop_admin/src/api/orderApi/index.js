import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8099/order", // 设置您的 API 基础URL
  timeout: 3000, // 设置请求超时时
});
const orderApi = {
  getOrdersByUserId(userId, token) {
    return axiosInstance.get("/getOrdersByUserId", {
      params: {
        token: token,
        userId: userId,
      },
    });
  },
  getOrdersByShopUser(userId, token) {
    return axiosInstance.get("/getOrdersByShopUser", {
      params: {
        token: token,
        userId: userId,
      },
    });
  },
  getOrderById(id, token) {
    return axiosInstance.get("/getOrderById", {
      params: {
        token: token,
        id: id,
      },
    });
  },
  getOrderBySerialNumber(serialNumber, token) {
    return axiosInstance.get("/getOrderBySerialNumber", {
      params: {
        token: token,
        serialNumber: serialNumber,
      },
    });
  },
  chargeShipOrder(orderId, userId, token) {
    return axiosInstance.put("/chargeShipOrder", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
      },
    });
  },
  chargeRefund(orderId, userId, type, token) {
    return axiosInstance.put("/chargeRefund", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
        type: type,
      },
    });
  },
  chargeCancel(orderId, userId, type, token) {
    return axiosInstance.put("/chargeCancel", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
        type: type,
      },
    });
  },
};
export default orderApi;
