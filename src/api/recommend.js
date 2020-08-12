import jsonp from "common/js/jsonp";
import { commonParams, options } from "./config";
import axios from "axios";

export function getRecommend() {
  // QQ音乐轮播图api地址
  const url =
    "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";

  // 合并配置项
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1,
  });

  // 这里返回一个promise对象
  return jsonp(url, data, options);
}

/**
 * 获取歌单数据
 */
export function getDiscList() {
  const url = "/api/getDiscList";

  const data = Object.assign({}, commonParams, {
    platform: "yqq",
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: "json",
  });

  return axios
    .get(url, {
      params: data,
    })
    .then((res) => {
      // 这里返回一个Promise的resolve方法，把需要的参数传递出去
      return Promise.resolve(res.data);
    });
}
