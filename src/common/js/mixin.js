import { mapGetters } from "vuex";

// mini播放器显示时，调整列表底部高度
export const playlistMixin = {
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
