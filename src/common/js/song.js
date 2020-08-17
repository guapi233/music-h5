import { getSongsUrl } from "api/song";
import { ERR_OK } from "api/config";

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
    this.singer = singer;
  }
}

export function isValidMusic(musicData) {
  return (
    musicData.songid &&
    musicData.albummid &&
    (!musicData.pay || musicData.pay.payalbumprice === 0)
  );
}

/**
 * 获取歌手的歌曲
 * @param {obj} musicData qq音乐的歌手歌曲详情
 */
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    album: musicData.albumname,
    singer: filterSinger(musicData.singer),
    duration: musicData.interval, // 歌曲时长
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url,
  });
}

/**
 * 把歌曲详情的对象转成"周杰伦/xxx专辑"这样的格式
 * @param {array} singer 歌手的情况{id：xx,name: xx }
 */
function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return "";
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join("/");
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo;
      midUrlInfo.forEach((info, index) => {
        let song = songs[index];
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`;
      });
    }
    return songs;
  });
}
