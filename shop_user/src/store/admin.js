/* eslint-disable no-unused-vars */
import api from "../api/rootApi/index";

const admin = {
  namespaced: true,
  state() {
    return {};
  },
  mutations: {},
  actions: {
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
      }else return -5
    },
  },
  getters: {},
};
export default admin;
