import { Config } from "../common/js/config";
import { loadSearch, loadPlay, loadFavorite } from "common/js/cache";

const state = {
  // 歌手信息
  singer: {},
  // 播放状态
  playing: false,
  // 播放器展开还是收起
  fullScreen: false,
  // 播放列表
  playList: [],
  // 歌曲循序列表，如果是随机播放，跟播放列表的顺序是不一样的
  sequenceList: [],
  // 播放类型
  mode: Config.playMode.sequence,
  // 当前播放索引
  currentIndex: -1,
  // 歌单信息
  disc: {},
  // 排行榜列表
  topList: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 最近播放
  playHistory: loadPlay(),
  // 收藏歌曲
  favoriteHistory: loadFavorite(),
};

export default state;
