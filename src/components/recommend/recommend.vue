<template>
  <div class="recommend" ref="recommend">
    <!-- 在这一层做引用，初始化BScroll，数据加载后在渲染，要记得加上data -->
    <!-- 暂时占位 -->
    <div class="recommend-content">
      <!-- <scroll ref="scroll" class="recommend-content" :data="discList"> -->
      <!-- BScroll的层级是父子级，子级只有第一个元素才会滚动，想要下面两个同级的div同时滚动，需要在外层包裹一层div，作为外层的一个子元素， -->
      <div>
        <!-- 从服务端加载数据，会有延迟，等抓到数据后，在加载slider组件，这样slider里的mounted周期就能拿到数据了 -->
        <div class="slider-wrapper" v-if="banners.length">
          <slider>
            <!-- slider组件里面的插槽 -->
            <div v-for="(item, index) in banners" :key="index">
              <a :href="item.linkUrl">
                <img @load="loadImg" class="needsclick" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <!-- <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              @click="selectItem(item)"
              v-for="(item,index) in discList"
              class="item"
              :key="index"
            >
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" alt />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>-->
      </div>
      <!-- loading -->
      <!-- <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>-->
    </div>
    <!-- </scroll> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from "base/slider/slider";
import { getRecommend } from "api/recommend";
import { ERR_OK } from "api/config";

export default {
  data() {
    return {
      banners: []
    };
  },
  created() {
    this._getRecommed();
  },
  methods: {
    /**
     * @augments
     * 获取qq音乐轮播数据
     */
    _getRecommed() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.banners = res.data.slider;
        }
      });
    },
    loadImg() {
      // 一张图片渲染就行了
      if (!this.checkLoaded) {
        // this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    }
  },
  components: {
    Slider
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
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
