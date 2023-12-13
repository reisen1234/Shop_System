/* eslint-disable no-unused-vars */
import orderApi from "@/api/orderApi";
const order = {
  namespaced: true,
  state() {
    return {
      orders: [],
      ordersStatus: "idle",
    };
  },
  mutations: {
    updateOrders(state, payload) {
      state.orders = payload;
    },
    uploadOrdersStatus(state, payload) {
      state.ordersStatus = payload;
    },
  },
  actions: {
    async getOrdersByUserId({ commit }, userId) {
      const token = localStorage.getItem("token");
      commit("uploadOrdersStatus", "idle");
      if (token) {
        try {
          const res = (await orderApi.getOrdersByUserId(userId, token)).data;
          if (res.statusCode === "200") {
            commit("updateOrders", res.data);
            commit("uploadOrdersStatus", "success");
            return {
              code: 1,
              data: res.data,
            };
          } else if (res.statusCode === "401")
            return {
              code: -2,
            };
          else if (res.statusCode === "409") return -5;
          else
            return {
              code: 0,
            };
        } catch (error) {
          console.log(error);
          return {
            code: -1,
          };
        }
      } else return -5;
    },
    async addOrder({ state }, { order, orderItem }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await orderApi.addOrder(order, token, orderItem)).data;
          if (res.statusCode === "200") {
            state.orders.push(res.data);
            return {
              code: 1,
              data: res.data,
            };
          } else if (res.statusCode === "401")
            return {
              code: -2,
            };
          else if (res.statusCode === "408")
            return {
              code: -3,
              data: res.data,
            };
          else if (res.statusCode === "409") return -5;
          else
            return {
              code: 0,
            };
        } catch (error) {
          console.log(error);
          return {
            code: -1,
          };
        }
      } else return -5;
    },
    async pay({ state }, { orderId, userId }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await orderApi.pay(orderId, userId, token)).data;
          console.log(res);
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            state.orders[index].status = 2;
            return 1;
          } else if (res.statusCode === "400") return -2;
          else if (res.statusCode === "407") return -4;
          else if (res.statusCode === "408") return -3;
          else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async cancelOrder({ state }, { orderId, userId, cancelReason }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (
            await orderApi.cancelOrder(orderId, userId, cancelReason, token)
          ).data;
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            state.orders[index].status = 7;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async refundOrder({ state }, { orderId, userId, refundReason }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (
            await orderApi.refundOrder(orderId, userId, refundReason, token)
          ).data;
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            state.orders[index].status = 8;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async receiveOrder({ state }, { orderId, userId }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await orderApi.receiveOrder(orderId, userId, token))
            .data;
          console.log(res);
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            state.orders[index].status = 4;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async evaluateOrder({ state }, evaluate) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await orderApi.evaluateOrder(evaluate, token)).data;
          if (res.statusCode === "200") {
            const index = state.orders.findIndex(
              (item) => item.id === evaluate.orderId
            );
            state.orders[index].status = 5;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async cancelNotPayOrder({ state }, { orderId, userId, type }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await orderApi.cancelNotPayOrder(orderId, userId, token))
            .data;
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            state.orders[index].status = 9;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    logOut({ commit }) {
      commit("updateOrders", []);
      commit("uploadOrdersStatus", "idle");
    },
    addOrdersByShopCart({ state }, data) {
      for (let i = 0; i < data.length; i++) {
        state.orders.push(data[i]);
      }
    },
  },
  getters: {
    getOrders(state) {
      return state.orders;
    },
    getOrdersStatus(state) {
      return state.ordersStatus;
    },
  },
};
export default order;
