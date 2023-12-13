import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import mainVueVue from "@/components/Main/mainVue.vue";
import login from "../views/Login/loginPage.vue";
import myspace from "../views/MySpace/mySpace.vue";
import NotFound from "../views/NotFound/notFound.vue";
import userCharge from "../views/ChargeUser/chargeUser.vue";
import { ElNotification } from "element-plus";
import chargeShopVue from "@/views/ChargeShop/chargeShop.vue";
import chargeGoodsVue from "@/views/ChargeGoods/chargeGoods.vue";
import shopMessageVue from "@/views/ShopMessage/shopMessage.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: mainVueVue,
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/myspace",
      name: "myspace",
      component: myspace,
    },
    {
      path: "/UserCharge",
      name: "UserCharge",
      component: userCharge,
    },
    {
      path: "/shopMessage/:userId",
      name: "shopMessage",
      component: shopMessageVue,
    },
    {
      path: "/ChargeShop/:userId",
      name: "ChargeShop",
      component: chargeShopVue,
    },
    {
      path: "/ChargeGoods/:shopId",
      name: "ChargeGoods",
      component: chargeGoodsVue,
    },
    {
      path: "/:catchAll(.*)", // 匹配所有路径
      name: "NotFound",
      component: NotFound, // 使用自定义的404组件
    },
  ],
});
const NetwordError = () => {
  ElNotification({
    title: "Network Error",
    type: "error",
  });
};
router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const res = await store.dispatch("user/checkLogin");
  //未进行登入检查
  if (!store.state.user.checkedLogin) {
    //未登入
    store.commit("user/updateCheckedLogin", true);
    if (res === -1) {
      NetwordError();
      next();
    } else if (res !== "success") {
      if (to.name === "login" || to.name === "register") {
        next();
      } else next({ name: "login" });
    } else {
      if (to.name === "login" || to.name === "register") {
        next({ name: "home" });
      } else {
        next();
      }
    }
  } else {
    next();
    store.commit("user/updateCheckedLogin", false);
  }
});
export default router;
