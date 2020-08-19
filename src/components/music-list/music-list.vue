<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 往上滑的遮罩层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 派发的scroll事件 -->
    <scroll
      :data="songs"
      @scroll="scroll"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <!-- 派发的select事件 -->
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <!-- loading组件 -->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import SongList from "base/song-list/song-list";
import { prefixStyle } from "common/js/dom";
import { playlistMixin } from "common/js/mixin";
import { mapActions } from "vuex";

const RESERVED_HEIGHT = 40;
// 自动加前缀
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0, // songlist偏移量
      minTransalteY: 0 // bglayer滚动的最大高度
    };
  },
  computed: {
    // 背景图片的应用方式
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  created() {
    // 可以监听快速滑动的位置
    this.probeType = 3;
    // 需要监听滚动
    this.listenScroll = true;
  },
  mounted() {
    // 记录一下歌手图片的高度，263
    this.imageHeight = this.$refs.bgImage.clientHeight;
    // 图片高度减去头部高度，就是bglayer滚动的最大高度
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    // 派发的scroll事件可以监听到滚动位置
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 返回上级
    back() {
      this.$router.back();
    },
    // songlist点击，派发出来的数据
    selectItem(item, index) {
      // 在一个动作中，多次更改mutation，那么给它封装一个action，更改播放的state数据
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    // 随机播放
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  watch: {
    // 监听滑动
    scrollY(newVal) {
      // 返回一组数的最大值，-223，newVal从0到负数走，最大到-223
      let translateY = Math.max(this.minTransalteY, newVal);
      // 图片的缩放，默认为1
      let scale = 1;
      // 歌手图片的z-lindex
      let zIndex = 0;
      // 高斯模糊
      let blur = 0;
      // 放大的比例，8px/263px
      const percent = Math.abs(newVal / this.imageHeight);
      // 如果songlist往下拉，要放大
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        // 模糊值最大20
        blur = Math.min(20, percent * 20);
      }

      // bglayer层跟着歌曲向上滑动
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      // 只有ios能看到
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      // 当向上滑动超出屏幕时，把背景图片的z-index设大，盖住歌词，图片个高度固定死
      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        // 上拉到顶部，把随机播放隐藏
        this.$refs.playBtn.style.display = "none";
      } else {
        // 下拉还原原来的样式
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        // 正常情况下，按钮显示
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    Loading,
    SongList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
