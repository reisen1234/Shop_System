import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router/router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import store from "./store";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
