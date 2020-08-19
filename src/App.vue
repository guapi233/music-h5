<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <!-- 确保tab切换不会导致重新加载请求 -->
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import tab from "components/tab/tab";
import Player from "components/player/player";

export default {
  components: { MHeader, tab, Player }
};
</script>

<style lang="stylus"></style>
