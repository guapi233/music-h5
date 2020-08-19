import storage from "good-storage";

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LEN = 15;

const PLAY_KEY = "__play__";
const PLAY_MAX_LEN = 200;

const FAVORITE_KEY = "__favorite__";
const FAVORITE_MAX_LEN = 200;

/**
 * 插入数组，如果数组中有了，把之前的删除掉，如果超过最大长度，把最后的剔除掉
 * @param {Array} arr 要插入的数组
 * @param {string} val 值
 * @param {func} compare 满足查找指定索引的回调函数
 * @param {int} maxLen 最大长度
 */
function insertArray(arr, val, compare, maxLen) {
  // 先找下这个数组中有没有这个值
  const index = arr.findIndex(compare);
  // 如果索引为0，也就是第一个就满足
  if (index === 0) {
    return;
  }
  // 数组中确实有这个值
  if (index > 0) {
    // 删除从 index 处开始的零个或多个元素
    arr.splice(index, 1);
  }
  // 插入到第一个
  arr.unshift(val);
  // 超出最大值，从最后剔除
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

// 保存查询历史
export function saveSearch(query) {
  // 之前存储的查询记录，如果没有，默认是空数组
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(
    searches,
    query,
    (item) => {
      return item === query;
    },
    SEARCH_MAX_LEN
  );
  storage.set(SEARCH_KEY, searches);
  return searches;
}

// 获取查询缓存数据
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

// 删除某个查询条件
export function deleteSearch(query) {
  // 之前存储的查询记录，如果没有，默认是空数组
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

// 清空search
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(
    songs,
    song,
    (item) => {
      return item.id === song.id;
    },
    PLAY_MAX_LEN
  );
  storage.set(PLAY_KEY, songs);
  return songs;
}

export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  insertArray(
    songs,
    song,
    (item) => {
      return item.id === song.id;
    },
    FAVORITE_MAX_LEN
  );
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  deleteFromArray(songs, (item) => {
    return item.id === song.id;
  });
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}
