const path = require("path");

module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", path.join(__dirname, "src"))
      .set("common", path.join(__dirname, "src/common"))
      .set("components", path.join(__dirname, "src/components"))
      .set("base", path.join(__dirname, "src/base"))
      .set("api", path.join(__dirname, "src/api"));
  },
  devServer: {
    proxy: {
      "/api/getDiscList": {
        target: "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg",
        changeOrigin: true,
        pathRewrite: {
          "^/api/getDiscList": "",
        },
        onProxyReq(onProxyReq, req, res) {
          onProxyReq.setHeader("referer", "https://c.y.qq.com/");
        },
      },
      "/api/lyric": {
        target: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
        changeOrigin: true,
        pathRewrite: {
          "^/api/lyric": "",
        },
        onProxyReq(onProxyReq, req, res) {
          onProxyReq.setHeader("referer", "https://c.y.qq.com/");
        },
      },
      "/api/getPurlUrl": {
        target: "https://u.y.qq.com/cgi-bin/musicu.fcg",
        changeOrigin: true,
        pathRewrite: {
          "^/api/getPurlUrl": "",
        },
        onProxyReq(onProxyReq, req, res) {
          onProxyReq.setHeader("referer", "https://c.y.qq.com/");
        },
      },
    },
  },
};
