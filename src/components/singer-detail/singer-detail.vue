<template>
  <transition name="slide" appear>
    <!-- 传入三个prop -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong, processSongsUrl } from "common/js/song";
import { mapGetters } from "vuex";

export default {
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    // mapGetters放在computed里面
    ...mapGetters(["singer"])
  },
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      // 限制不能直接点击歌手详情页
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    // 封装歌曲数据
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        // 解构赋值
        let { musicData } = item;
        // 歌曲id和专辑id必须有，工厂模式,list是由一大推Song对象组成的，所以Song对象下的函数，currentSong可以调用
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });

      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
