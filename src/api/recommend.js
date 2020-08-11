import jsonp from "common/js/jsonp";
import { commonParams, options } from "./config";

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
