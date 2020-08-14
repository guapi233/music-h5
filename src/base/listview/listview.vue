<template>
  <scroll class="listview" :data="data" ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" @click="selectItem(item)" class="list-group-item" :key="item.name">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 绝对定位在右边的一个列表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutlist" class="item"
        :data-index="index" :key="index"
        :class="{'current':currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  // 类通讯录组件
  export default {
    created() {
      this.touch = {}  // 不在data里初始化这个对象，是因为不需要监听touch的变化，点击的y轴
      this.listenScroll = true // 是否监听scroll滚动，给scroll组件传值用的
      this.listHeight = [] // listGroup的高度
      this.probeType = 3 // scroll组件，probeType默认是1，不截流，想要监听到快速滑动，要设置为3
      // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
    },
    props: {
      data: { // scroll组件的data，data变化，自动refresh
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1, // 实时滚动的位置
        currentIndex: 0, // 当前那个高亮，默认第一个
        diff: -1 // 一个listGroup和最上面固定的标题的滚动差，边界条件
      }
    },
    computed: {
      shortcutlist() {
        // 热、A、B...列表
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      // 顶部固定标题
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      // 点击跳转详情，把事件派发到调用方去
      selectItem(item) {
        this.$emit('select', item)
      },
      // scroll组件派发的事件，能够获取到当前滚动的位置
      scroll(pos) {
        this.scrollY = pos.y
      },
      // 把scroll组件的refresh方法派发出去
      refresh() {
        this.$refs.listview.refresh()
      },
      // 点击右侧导航列表
      onShortcutTouchStart(event) {
        // 获取dom元素属性data-，类似小程序的获取
        // 这里取到的是个字符串，所以下面滑动的时候加上偏移量要转成整形
        let anchorIndex = getData(event.target, 'index')
        // 记录滑动或者点击时间,是个对象，里面有这个点的各种位置
        let firstTouch = event.touches[0]
        // 距离页面顶部的y轴数值
        this.touch.y1 = firstTouch.pageY
        // 一开始点这个索引是多少
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      // 滑动右侧列表
      onShortcutTouchMove(event) {
        // 记录滑动或者点击时间,是个对象，里面有这个点的各种位置
        let firstTouch = event.touches[0]
        // 滑动结束后，最终距离页面顶部的y轴数值
        this.touch.y2 = firstTouch.pageY
        // y轴的偏移，移动结束位置-移动开始位置
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // |0 是向下取整
        console.log(delta)
        // 点击开始的索引+偏移的索引
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      // 根据当前列表索引，滚动到联动组件相应位置
      _scrollTo(index) {
        // 点击边界的小黑快
        if (!index && index !== 0) {
          return
        }
        // 滑动到边界，边界条件处理
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 手动点击右侧字母导航，反应给scrollY，这样监听到scrollY的变化，高亮也自认跟随
        this.scrollY = -this.listHeight[index]
        // 滚动到listGroup对应的索引位置，0是指不需要滚动动画，瞬间滚动到指定位置
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      /**
       * @augments
       * 计算listGroup高度(左侧歌手列表的总高度)
       * */
      _calculateHeight() {
        // 每次计算先初始化为空
        this.listHeight = []
        const list = this.$refs.listGroup
        // 第一个listGroup的高度
        let height = 0
        // [0, 760, 1030, ...]这样
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      // data发生变化，就去计算一下listGroup的高度
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 观察实时滚动的位置
      scrollY(newY) {
        // [0, 760, 1030, ...]这样
        const listHeight = this.listHeight
        // 1.当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 2.在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          // 第一个区间高度
          let height1 = listHeight[i]
          // 下一个区间高度
          let height2 = listHeight[i + 1]
          // 如果y轴的值，刚好落在上下两个区间内，那么右侧的导航列表，也要刚好高亮
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // 一个listGroup往上滑到固定标题快时，高度加上scroll的Y轴（负值），这样就是边界的高度差
            this.diff = height2 + newY
            return
          }
        }
        // 3.当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      // 观测diff的变化
      diff(newVal) {
        // 如果高度差大于0，并且小于一个标题快的line-height时
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop // 负值
        // 顶部标题往上偏移
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
