<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <!-- 确保tab切换不会导致重新加载请求 -->
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import tab from "components/tab/tab";

export default {
  components: { MHeader, tab }
};
</script>

<style lang="stylus"></style>
