/**
 * 给dom元素添加类名
 * @param {dom} el dom
 * @param {string} className 类名
 */
export function addClass(el, className) {
  el.classList.add(className);
}

/**
 * 判断dom是否有这个类名
 * @param {dom} el dom对象
 * @param {string} className 类名
 */
export function hasClass(el, className) {
  return el.classlist.contains(className);
}

/**
 * 设置或者获取dom元素的data-属性
 * @param {dom} el dom
 * @param {属性} name
 * @param {*} val
 */
export function getData(el, name, val) {
  const prefix = "data-";
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}

let elementStyle = document.createElement("div").style;

let vendor = (() => {
  // 各个浏览器厂商的前缀
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform",
  };

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  // 如果都不满足，那这个浏览器肯定有毛病
  return false;
})();

/**
 * css3属性添加前缀
 * @export
 * @param {any} style 样式
 * @returns 前缀+style
 */
export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === "standard") {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
