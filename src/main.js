import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueLazyLoad from "vue-lazyload";
import fastclick from "fastclick";

// 入口文件引入公共样式
import "common/stylus/index.styl";

// 整个PC所有body下的dom点击都不会有300毫秒的延时
fastclick.attach(document.body);

// 安装图片懒加载插件
Vue.use(VueLazyLoad, {
  loading: require("common/image/default.png"),
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
