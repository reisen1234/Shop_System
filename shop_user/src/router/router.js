/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import mainVueVue from "@/components/Main/mainVue.vue";
import login from "../views/Login/loginPage.vue";
import register from "../views/Register/registerPage.vue";
import myspace from "../views/MySpace/mySpace.vue";
import NotFound from "../views/NotFound/notFound.vue";
import myshop from "../views/MyShop/myShop.vue";
import goods from "../views/GoodsPage/goodsPage";
import searchShopVue from "@/views/SearchShop/searchShop.vue";
import searchGoosVue from "@/views/SearchGoods/searchGoods.vue";
import shopCartVue from "@/views/ShopCart/shopCart.vue";
import baseUtils from "@/utils";
const router = createRouter({
  model: "history",
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
      path: "/register",
      name: "register",
      component: register,
    },
    {
      path: "/myspace",
      name: "myspace",
      component: myspace,
    },
    {
      path: "/MyShop",
      name: "MyShop",
      component: myshop,
    },
    {
      path: "/Goods/:goodsId/:shopId",
      name: "Goods",
      component: goods,
    },
    {
      path: "/Shop/:shopId",
      name: "Shop",
      component: myshop,
    },
    {
      path: "/goodsSearchPage/:like/:type",
      name: "goodsSearchPage",
      component: searchGoosVue,
    },
    {
      path: "/shopSearchPage/:like/:type",
      name: "shopSearchPage",
      component: searchShopVue,
    },
    {
      path: "/ShopCart/:userId",
      name: "ShopCart",
      component: shopCartVue,
    },
    {
      path: "/:catchAll(.*)", // 匹配所有路径
      name: "NotFound",
      component: NotFound, // 使用自定义的404组件
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const state = await store.dispatch("user/checkLogin");
  console.log(state);
  if (state === "idle") {
    if (to.name === "myspace" || to.name === "ShopCart") {
      baseUtils.failMessage("请先登入");
      next({ name: "login" });
    } else next();
  } else if (state === -1) {
    baseUtils.UnkownErrorMessage("NetWork Error");
    next({ name: "home" });
  } else {
    if (to.name === "login" || to.name === "register") {
      baseUtils.failMessage("已登入");
      next({ name: "home" });
    } else next();
  }
});
export default router;
