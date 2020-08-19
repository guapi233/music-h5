<template>
  <div class="progress-circle">
    <!-- svg的宽高，就是这个圈的实际大小 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <!-- r：半径 cx，cy圆心坐标 -->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <!-- stroke-dasharray：描边 stroke-dashoffset：描边偏移 -->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
    </svg>
    <!-- 插槽，上面两个圆可以圈住插槽中的元素 -->
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        dashArray: Math.PI * 100 // 一圈圆
      }
    },
    computed: {
      // 圆的偏移量
      dashOffset() {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
