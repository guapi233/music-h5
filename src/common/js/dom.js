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
