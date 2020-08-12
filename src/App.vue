<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <router-view />
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
