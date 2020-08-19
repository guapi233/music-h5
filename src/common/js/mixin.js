import { mapGetters, mapMutations, mapActions } from "vuex";
import { Config } from "common/js/config";
import Util from "common/js/util";

// mini播放器显示时，调整列表底部高度
export const playlistMixin = {
  computed: {
    ...mapGetters(["playList"]),
  },
  mounted() {
    this.handlePlaylist(this.playList);
  },
  // keep-alive 组件激活时调用。
  activated() {
    this.handlePlaylist(this.playList);
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    },
  },
  methods: {
    handlePlaylist() {
      throw new Error("component must implement handlePlaylist method");
    },
  },
};

// 播放器组件和播放列表组件公用的播放模式切换等功能
export const playerMixin = {
  computed: {
    // 播放模式
    iconMode() {
      return this.mode === Config.playMode.sequence
        ? "icon-sequence"
        : this.mode === Config.playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    ...mapGetters([
      "sequenceList",
      "currentSong",
      "playList",
      "mode",
      "favoriteHistory",
    ]),
  },
  methods: {
    // 变更播放状态,更改state数据，就要提交mutation
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);

      // 改变播放模式后，要变更播放列表顺序
      let list = null;
      if (mode === Config.playMode.random) {
        list = Util.shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      // 确定更改播放模式后的当前歌曲的index
      this.resetCurrentIndex(list);
      // 提交mutation
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return "icon-favorite";
      }
      return "icon-not-favorite";
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteSong(song);
      } else {
        this.saveFavoriteHistory(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteHistory.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations({
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setCurrentIndex: "SET_CURRENT_INDEX",
    }),
    ...mapActions(["deleteFavoriteSong", "saveFavoriteHistory"]),
  },
};

// 播放列表和搜索公用相关逻辑
export const searchMixin = {
  data() {
    return {
      query: "",
      refreshDelay: 100,
    };
  },
  computed: {
    ...mapGetters(["searchHistory"]),
  },
  methods: {
    // searchBox有query改变，派发出来的
    onQueryChange(query) {
      // 处理带空格的情况
      this.query = query.trim();
    },
    // 搜索结果过多，需要上拉加载时，让手机输入框隐藏
    blurInput() {
      this.$refs.searchBox.blur();
    },
    // 点热门搜索，把结果映射到searchBox组件中
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    // 在action中的saveSearchHistory方法，调用cache.js中的saveSearch方法，保存本地缓存，同时返回新数组，通过提交mutation改变state，
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    deleteOne(item) {
      this.deleteSearchHistory(item);
    },
    ...mapActions(["saveSearchHistory", "deleteSearchHistory"]),
  },
};
