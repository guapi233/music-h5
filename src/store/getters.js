export const singer = (state) => state.singer;

export const playing = (state) => state.playing;

export const fullScreen = (state) => state.fullScreen;

export const playList = (state) => state.playList;

export const sequenceList = (state) => state.sequenceList;

export const mode = (state) => state.mode;

export const currentIndex = (state) => state.currentIndex;

export const currentSong = (state) => {
  // 取不到就设一个空对象
  return state.playList[state.currentIndex] || {};
};

export const disc = (state) => state.disc;

export const topList = (state) => state.topList;

export const searchHistory = (state) => state.searchHistory;

export const playHistory = (state) => state.playHistory;

export const favoriteHistory = (state) => state.favoriteHistory;
