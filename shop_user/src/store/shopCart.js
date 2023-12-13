import shopCartApi from "@/api/shopCartApi";
import orderApi from "@/api/orderApi";
import store from ".";
const shopCart = {
  namespaced: true,
  state() {
    return {
      shopCart: [],
      shopCartStatus: "idle",
    };
  },
  mutations: {
    updateShopCart(state, payload) {
      state.shopCart = payload;
    },
    updateShopCartStatus(state, payload) {
      state.shopCartStatus = payload;
    },
  },
  actions: {
    async getShopCart({ commit }, userId) {
      try {
        commit("updateShopCartStatus", "idle");
        const res = (await shopCartApi.getShopCartByUserId(userId)).data;
        if (res.statusCode === "200") {
          commit("updateShopCart", res.data);
          commit("updateShopCartStatus", "success");
          return res.data;
        } else return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async removeShopCart({ state }, id) {
      try {
        const res = (await shopCartApi.removeCart(id)).data;
        if (res.statusCode === "200") {
          const index = state.shopCart.findIndex((item) => item.id === id);
          state.shopCart.splice(index, 1);
          return 1;
        } else return 0;
      } catch (error) {
        console.log(error);
        return -1;
      }
    },
    async updateGoodsNumber({ state }, { id, number }) {
      try {
        const res = (await shopCartApi.updateGoodsNumber(id, number)).data;
        if (res.statusCode === "200") {
          const index = state.shopCart.findIndex((item) => item.id === id);
          state.shopCart[index].number = number;
          return {
            code: 1,
          };
        } else
          return {
            code: 0,
            data: res.data,
          };
      } catch (error) {
        console.log(error);
        return { code: -1 };
      }
    },
    async addToCart({ state }, data) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await shopCartApi.addToCart(data, token)).data;
          if (res.statusCode === "200") {
            if (data.number === res.data.number) state.shopCart.push(res.data);
            else {
              const index = state.shopCart.findIndex(
                (item) => item.id === res.data.id
              );
              state.shopCart[index].number = res.data.number;
            }
            return 1;
          } else if (res.statusCode === "409") return -5;
          else if (res.statusCode === "501") return 2;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async deleteByIds({ state }, ids) {
      try {
        const res = (await shopCartApi.deleteByIds(ids)).data;
        if (res.statusCode === "200") {
          const afterDelete = state.shopCart.filter(
            (item) => !ids.includes(item.id)
          );
          state.shopCart = afterDelete;
          return {
            code: 1,
            data: afterDelete,
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
    },
    async addOrderByShopCart({ state }, { ids, userId, address }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (
            await orderApi.addOrderByShopCart(ids, userId, address, token)
          ).data;
          if (res.statusCode === "200") {
            const afterDelete = state.shopCart.filter(
              (item) => !ids.includes(item.id)
            );
            state.shopCart = afterDelete;
            store.dispatch("order/addOrdersByShopCart", res.data);
            return {
              code: 1,
              data: afterDelete,
            };
          } else if (res.statusCode === "408") {
            const afterDelete = state.shopCart.filter(
              (item) => !ids.includes(item.id)
            );
            state.shopCart = afterDelete;
            store.dispatch("order/addOrdersByShopCart", res.data);
            return {
              code: 0,
              data: afterDelete,
            };
          } 
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
    logOut({ commit }) {
      commit("updateShopCartStatus", "idle");
      commit("updateShopCart", []);
    },
  },
  getters: {
    getStatus(state) {
      return state.shopCartStatus;
    },
    getShopCart(state) {
      return state.shopCart;
    },
  },
};
export default shopCart;
