<template>
  <div class="component">
    <homePage v-if="$router.currentRoute.value.name !== 'login' && $router.currentRoute.value.name !== 'register'" />
    <RouterView v-if="$router.currentRoute.value.name === 'login' || $router.currentRoute.value.name === 'register'" />
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex';
import homePage from './views/Home/homePage.vue'

const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};
// 解决ERROR ResizeObserver loop completed with undelivered notifications.
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    homePage,
  },
  setup() {


  },
  computed: {
    ...mapState('userApi', {
      userStatus: state => state.userStatus
    }),
    ...mapState('userApi', {
      Telephone: state => state.Telephone
    }),
  }
}
</script>

<style>
.component {
  width: 100vw;
  height: 100vh;
}
</style>