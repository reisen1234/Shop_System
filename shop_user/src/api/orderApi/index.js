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
  addOrder(order, token, orderItem) {
    const jsonString = JSON.stringify(orderItem);
    return axiosInstance.post("/addOrder", order, {
      params: {
        token: token,
        items: jsonString,
      },
    });
  },
  cancelOrder(orderId, userId, cancelReason, token) {
    return axiosInstance.put("/cancelOrder", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
        cancelReason: cancelReason,
      },
    });
  },
  refundOrder(orderId, userId, refundReason, token) {
    return axiosInstance.put("/refundOrder", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
        refundReason: refundReason,
      },
    });
  },
  receiveOrder(orderId, userId, token) {
    return axiosInstance.put("/receiveOrder", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
      },
    });
  },
  evaluateOrder(evaluate, token) {
    return axiosInstance.post("/evaluateOrder", evaluate, {
      params: {
        token: token,
      },
    });
  },
  cancelNotPayOrder(orderId, userId, token) {
    return axiosInstance.put("/cancelNotPayOrder", null, {
      params: {
        token: token,
        orderId: orderId,
        userId: userId,
      },
    });
  },
  addOrderByShopCart(ids, userId, address, token) {
    const queryString = ids.map((id) => `shopCartIds=${id}`).join("&");
    return axiosInstance.post(`/addOrderByShopCart?${queryString}`, null, {
      params: {
        userId: userId,
        address: address,
        token: token,
      },
    });
  },
  pay(orderId, userId, token) {
    return axiosInstance.put("/pay", null, {
      params: {
        orderId: orderId,
        userId: userId,
        token: token,
      },
    });
  },
};
export default orderApi;
