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
    async getOrdersByShopUser({ commit }, userId) {
      const token = localStorage.getItem("token");
      commit("uploadOrdersStatus", "idle");
      if (token) {
        try {
          const res = (await orderApi.getOrdersByShopUser(userId, token)).data;
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
      }
    },
    async chargeShipOrder({ state }, { orderId, userId }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await orderApi.chargeShipOrder(orderId, userId, token))
            .data;
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            state.orders[index].status = 3;
            return {
              code: 1,
            };
          } else if (res.statusCode === "401")
            return {
              code: -2,
            };
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
      }
    },
    async chargeRefund({ state }, { orderId, userId, type }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (
            await orderApi.chargeRefund(orderId, userId, type, token)
          ).data;
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            if (type === 1) state.orders[index].status = 6;
            else if (type === 0) state.orders[index].status = 3;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      }
    },
    async chargeCancel({ state }, { orderId, userId, type }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (
            await orderApi.chargeCancel(orderId, userId, type, token)
          ).data;
          console.log(res);
          if (res.statusCode === "200") {
            const index = state.orders.findIndex((item) => item.id === orderId);
            if (type === 1) state.orders[index].status = 1;
            else if (type === 0) state.orders[index].status = 2;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      }
    },
    logOut({ commit }) {
      commit("updateOrders", []);
      commit("uploadOrdersStatus", "idle");
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
