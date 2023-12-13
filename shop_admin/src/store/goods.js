/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import api from "../api/goodsApi/index";

const goods = {
  namespaced: true,
  state() {
    return {
      ChargeGoods: [],
      ChargeGoodsStatus: "idle",
    };
  },
  mutations: {
    updateChargeGoodsStatus(state, payload) {
      state.ChargeGoodsStatus = payload;
    },
    updateChargeGoods(state, payload) {
      state.ChargeGoods = payload;
    },
  },
  actions: {
    async getGoodsByUserId({ commit }, userId) {
      commit("updateChargeGoodsStatus", "idle");
      try {
        const response = (await api.getGoodsByUserId(userId)).data;
        if (response.statusCode === "200") {
          commit("updateChargeGoodsStatus", "success");
          commit("updateChargeGoods", response.data);
          return response.data;
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async deleteGoodsById({ state }, { shopId, goodsId }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.deleteGoodsById(goodsId, shopId, token)).data;
          if (res.statusCode === "200") {
            const index = state.ChargeGoods.findIndex((item) => item.id === goodsId);
            state.ChargeGoods.splice(index, 1);
            return 1;
          } else return 0;
        } catch (error) {
          console.log("error");
          return -1;
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    async updateGoods({ state, getters }, { data }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.updateGoods(data, token)).data;
          console.log(res);
          if (res.statusCode === "200") {
            const index = state.ChargeGoods.findIndex(
              (item) => item.id === data.id
            );
            state.ChargeGoods[index] = res.data;
            return {
              code: 1,
              data: getters.getGoodsByShopId(data.shopId),
            };
          } else
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
    async addGoods({ state }, data) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.addGoods(data, token);
          if (response.data.statusCode === "200") {
            state.ChargeGoods.push(response.data.data);
            return {
              data: response.data.data,
              code: 1,
            };
          } else
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
    async getGoodsByShopId({ state }, shopId) {
      try {
        const response = (await api.getGoodsByShopId(shopId)).data;
        return response.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async deleteGoodsPhoto({ state }, { name, goodsId, id }) {
      try {
        const res = (await api.deleteGoodsPhoto(name, goodsId, id)).data;
        if (res.statusCode === "200") return 1;
        else return 0;
      } catch (error) {
        console.log(error);
        return -1;
      }
    },
    logOut({ commit }) {
      commit("updateChargeGoodsStatus", "idle");
      commit("updateChargeGoods", []);
    },
  },
  getters: {
    getChargeGoodsStatus(state) {
      return state.ChargeGoodsStatus;
    },
    getGoodsByShopId: (state) => (shopId) => {
      return state.ChargeGoods.filter((item) => item.shopId == shopId);
    },
  },
};
export default goods;
