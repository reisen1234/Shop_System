import admin from "./admin";
import goods from "./goods";
import order from "./order";
import shop from "./shop";
import user from "./user";
import { createStore } from "vuex";
const store = createStore();

// 注册 userModule 和 otherModule 模块
store.registerModule("user", user);
store.registerModule("shop", shop);
store.registerModule("admin", admin);
store.registerModule("goods", goods);
store.registerModule("order", order);
export default store;
