/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import api from "../api/shopApi/index";

const shop = {
  namespaced: true,
  state() {
    return {};
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
    async getShopById({ state }, id) {
      try {
        const res = (await api.getShopById(id)).data;
        return res.data;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    async getShopLike({ state }, like) {
      try {
        const res = (await api.getShopLike(like)).data;
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  },
  getters: {},
};
export default shop;
