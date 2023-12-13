/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import api from "../api/shopApi/index";

const shop = {
  namespaced: true,
  state() {
    return {
      shop: [],
      shopStatus: "idle",
    };
  },
  mutations: {
    updateStatus(state, payload) {
      state.userStatus = payload;
    },
    updateShop(state, payload) {
      state.shop = payload;
    },
  },
  actions: {
    async deleteShopById({ state }, { shopId, userId }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.deleteShopById(userId, shopId, token)).data;
          if (res.statusCode === "200") {
            const index = state.shop.findIndex((item) => item.id === shopId.id);
            state.shop.splice(index, 1);
            return 1;
          } else return 0;
        } catch (error) {
          console.log("error");
          return -1;
        }
      }
    },
    async updateShop({ state, getters }, { data }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.updateShop(data, token)).data;
          if (res.statusCode === "200") {
            const index = state.shop.findIndex((item) => item.id === data.id);
            state.shop[index] = res.data;
            return {
              code: 1,
              data: getters.getAllShopByUserId(data.userId),
            };
          } else if (res === "407")
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
    async addShop({ commit, state }, data) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.addShop(data, token);
          if (response.data.statusCode === "200") {
            state.shop.push(response.data.data);
            return {
              data: response.data.data,
              code: 1,
            };
          } else if (response.data.statusCode === "407")
            return {
              code: 0,
            };
          else
            return {
              code: -2,
            };
        } catch (error) {
          console.log(error);
          return {
            code: -1,
          };
        }
      }
    },
    async getAllShopByUserId({ commit }, userId) {
      try {
        const res = (await api.getShopByUserId(userId)).data;
        commit("updateShop", res.data);
        commit("updateStatus", "success");
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    logOut({ commit }) {
      commit("updateStatus", "idle");
      commit("updateShop", []);
    },
  },
  getters: {
    // eslint-disable-next-line no-unused-vars
    getShopStatus(state) {
      return state.shopStatus;
    },
    getShop(state) {
      return state.shop;
    },
    getAllShopByUserId: (state) => (userId) => {
      return state.shop.filter((item) => item.userId == userId);
    },
  },
};
export default shop;
