/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import api from "../api/goodsApi/index";

const goods = {
  namespaced: true,
  state() {
    return {
      Goods: [],
      GoodsStatus: "idle",
    };
  },
  mutations: {
    updateStatus(state, payload) {
      state.GoodsStatus = payload;
    },
    updateGoods(state, payload) {
      state.Goods = payload;
    },
  },
  actions: {
    async getAllData({ commit }) {
      commit("updateStatus", "idle");
      try {
        const response = (await api.getAllGoods()).data;
        if (response.statusCode === "200") {
          commit("updateStatus", "success");
          commit("updateGoods", response.data);
          return response.data;
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async getGoodsByShopId({ state }, shopId) {
      try {
        const response = (await api.getGoodsByShopId(shopId)).data;
        return response.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async getGoodsById({ state }, id) {
      try {
        const res = (await api.getGoodsById(id)).data;
        return res.data;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    async getGoodsLike({ state }, like) {
      if (like === null || like === undefined) return [];
      try {
        const res = (await api.getGoodsLike(like)).data;
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  },
  getters: {
    // eslint-disable-next-line no-unused-vars
    getGoodsStatus(state) {
      return state.GoodsStatus;
    },
    getGoods(state) {
      return state.Goods;
    },
    getGoodsIndex: (state) => (id) => {
      return state.Goods.filter((item) => item.id == id)[0];
    },
  },
};
export default goods;
