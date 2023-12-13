/* eslint-disable no-unused-vars */
import api from "../api/userApi/index";

const user = {
  namespaced: true,
  state() {
    return {
      userStatus: "idle",
      checkedLogin: false,
      User: {},
    };
  },

  mutations: {
    updateStatus(state, payload) {
      state.userStatus = payload;
    },
    updateUser(state, payload) {
      state.User = payload;
    },
    updateCheckedLogin(state, payload) {
      state.checkedLogin = payload;
    },
    updateUserAvatar(state, payload) {
      state.User.avatar = payload;
    },
  },
  actions: {
    async login({ commit }, { data, loginType, code }) {
      if (loginType) loginType = 1;
      else loginType = 0;
      try {
        commit("updateStatus", "idle");
        const response = (await api.login(data, loginType, code)).data;
        if (response.statusCode === "200") {
          commit("updateStatus", "success");
          commit("updateUser", response.data.user);
          localStorage.setItem("token", response.data.token);
          return 1;
        } else if (response.statusCode === "406") {
          return 2;
        } else if (response.statusCode === "416") return 4;
        else if (response.statusCode === "408") return 3;
        else {
          return 0;
        }
      } catch (error) {
        console.log(error);
        return -1;
      }
    },
    async checkLogin({ commit, state }) {
      const token = localStorage.getItem("token");
      commit("updateStatus", "idle");
      if (token) {
        try {
          await api.checkLogin({ token: token }).then((res) => {
            if (res.data.statusCode === "200") {
              commit("updateStatus", "success");
              commit("updateUser", res.data.data);
            } else {
              localStorage.removeItem("token");
            }
          });
        } catch (error) {
          console.log(error);
          return -1;
        }
      }
      return state.userStatus;
    },
    // eslint-disable-next-line no-unused-vars
    async register({ commit }, { data, code }) {
      try {
        const response = await api.register(data, code);
        if (response.data.statusCode === "200") return 1;
        else if (response.data.statusCode === "416") return -2;
        else return 0;
      } catch (error) {
        console.log(error);
        return -1;
      }
    },
    async getUserById({ state }, { id }) {
      try {
        const res = (await api.getUserById(id)).data;
        return res.data;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    logOut({ commit }) {
      localStorage.removeItem("token");
      commit("updateStatus", "idle");
      commit("updateCheckedLogin", false);
      commit("updateUser", {});
    },
    async recharge({ state }, { money, userId }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.recharge(userId, money, token)).data;
          if (res.statusCode === "200") {
            state.User.balance += money;
            return 1;
          } else if (res.statusCode === "401") return -2;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async updateUserName({ state }, { data }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = (await api.updateUserName(data, token)).data;
          if (res.statusCode === "200") {
            state.User.name = res.data.name;
            return 1;
          } else if (res.statusCode === "409") return -5;
          else return 0;
        } catch (error) {
          console.log(error);
          return -1;
        }
      } else return -5;
    },
    async sendRegisterCode({ state }, telephone) {
      try {
        const res = (await api.sendRegisterCode(telephone)).data;
        if (res.statusCode === "417") {
          //有效期
          return {
            code: -1,
            alive: res.data,
          };
        } else if (res.statusCode === "407") {
          //存在
          return {
            code: -2,
          };
        } else if (res.statusCode === "200") {
          return {
            code: 1,
          };
        } else return { code: 0 };
      } catch (error) {
        console.log(error);
        return { code: 0 };
      }
    },
    async sendLoginCode({ state }, telephone) {
      try {
        const res = (await api.sendLoginCode(telephone)).data;
        if (res.statusCode === "417") {
          //有效期
          return {
            code: -1,
            alive: res.data,
          };
        } else if (res.statusCode === "418") {
          //不存在
          return {
            code: -2,
          };
        } else if (res.statusCode === "200") {
          return {
            code: 1,
          };
        } else return { code: 0 };
      } catch (error) {
        console.log(error);
        return { code: 0 };
      }
    },
  },
  getters: {
    getUser(state) {
      return state.User;
    },
    getStatus(state) {
      return state.userStatus;
    },
  },
};
export default user;
