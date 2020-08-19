<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- 进度条拖动回调 -->
      <div class="progress-bar-wrapper"
        @touchstart="progressTouchStart"
        @touchmove="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        touch: {} // 进度条拖动的当前状态
      }
    },
    watch: {
      // 歌曲播放百分比
      percent(newPercent) {
        this.setProgressOffset(newPercent)
      }
    },
    methods: {
      setProgressOffset(percent) {
        // 在拖动过程中不要监听percent的变化
        if (percent >= 0 && !this.touch.inited) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * percent
          this._doOffset(offsetWidth)
        }
      },
      // 开始拖动
      progressTouchStart(event) {
        this.touch.inited = true
        // 拖动开始的x轴
        this.touch.startX = event.touches[0].pageX
        // 进度条的长度
        this.touch.left = this.$refs.progress.clientWidth
      },
      // 拖动中
      progressTouchMove(event) {
        if (!this.touch.inited) {
          return
        }
        // 拖动的距离
        const differX = event.touches[0].pageX - this.touch.startX
        // 总的偏移量
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, differX + this.touch.left))
        this._doOffset(offsetWidth)
      },
      // 拖动完成
      progressTouchEnd() {
        this.touch.inited = false
        // 这个时候，歌曲的实际进度还没有改变，那么派发一个改变当前进度百分比的事件给外面调用
        this._triggerPercent()
      },
      // 点击进度条到对应位置
      progressClick(event) {
        // 获取一个el的矩形属性，rect 是一个具有四个属性left、top、right、bottom的DOMRect对象
        const rect = this.$refs.progressBar.getBoundingClientRect()
        // 偏移量是点击的点到左窗口的距离减去，进度条这个矩形离左窗口的距离
        const offsetWidth = event.pageX - rect.left
        this._doOffset(offsetWidth)
        this._triggerPercent()
      },
      _triggerPercent() {
        this.$emit('percentChange', this._getPercent())
      },
      _getPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        return this.$refs.progress.clientWidth / barWidth
      },
      _doOffset(offsetWidth) {
          // 进度条的偏移
        this.$refs.progress.style.width = `${offsetWidth}px`
          // 按钮的偏移
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-bar-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>

