/* eslint-disable no-unused-vars */
import api from "../api/rootApi/index";

const admin = {
  namespaced: true,
  state() {
    return {
      ChargeUser: [],
      ChargeUserStatus: "idle",
    };
  },
  mutations: {
    updateChargeUser(state, payload) {
      state.ChargeUser = payload;
    },
    updateStatus(state, payload) {
      state.ChargeUserStatus = payload;
    },
  },
  actions: {
    async getAllData({ commit }) {
      const token = localStorage.getItem("token");
      commit("updateStatus", "idle");
      if (token) {
        try {
          const response = (await api.getAllUser(token)).data;
          if (response.statusCode === "200") {
            commit("updateStatus", "success");
            commit("updateChargeUser", response.data);
            return response.data;
          }
        } catch (error) {
          console.log(error);
          return [];
        }
      }
    },
    async deleteUserById({ state }, { id, index }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.deleteUserById(id, token)).data;
          if (res.statusCode === "200") {
            const i = state.ChargeUser.findIndex((item) => item.id === id);
            state.ChargeUser.splice(i, 1);
            return 1;
          } else return 0;
        } catch (error) {
          console.log("error");
          return -1;
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    async updateUser({ state }, { data }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.updateUserData(data, token)).data;
          if (res.statusCode === "200") {
            const index = state.ChargeUser.findIndex(
              (item) => item.id === data.id
            );
            state.ChargeUser[index] = res.data;
            return 1;
          } else if (res.data.statusCode === "407") return 0;
          else return -2;
        } catch (error) {
          console.log(error);
          return -1;
        }
      }
    },
    async addUser({ state }, data) {
      try {
        const response = await api.register(data);
        if (response.data.statusCode === "200") {
          state.ChargeUser.push(response.data.data);
          return 1;
        } else if (response.data.statusCode === "407") return 0;
        else return -2;
      } catch (error) {
        console.log(error);
        return -1;
      }
    },
    async editPassword({ state }, { userId, password }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.editPassword(userId, password, token)).data;
          if (res.statusCode === "200") return 1;
          else return -2;
        } catch (error) {
          console.log(error);
          return -1;
        }
      }
    },
    logOut({ commit }) {
      commit("updateStatus", "idle");
      commit("updateChargeUser", []);
    },
  },
  getters: {
    getStatus(state) {
      return state.ChargeUserStatus;
    },
    getChargeUser(state) {
      return state.ChargeUser;
    },
    getChargeUserByShopId: (state) => (shopId, getters) => {
      const Id = getters["shop/getShopIndex"](shopId).userId;
      return state.ChargeUser.filter((item) => item.id == Id)[0];
    },
    getChargeUserById: (state) => (userId) => {
      return state.ChargeUser.filter((item) => item.id == userId)[0];
    },
  },
};
export default admin;
