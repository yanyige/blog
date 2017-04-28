---
layout: posts
title: 你不需要jQuery
tags: 前端 jQuery javascript
category: javascript
excerpt: 使用原生js代替简单的jQuery
date: 2017-4-25 16:42
---

# 你不需要jQuery

## Query Selector

常用的 class、id、属性 选择器都可以使用 document.querySelector 或 document.querySelectorAll 替代。区别是：

- document.querySelector 返回第一个匹配的 Element
- document.querySelectorAll 返回所有匹配的 Element 组成的 NodeList。它可以通过[].slice.call() 把它转成 Array
- 如果匹配不到任何 Element，jQuery 返回空数组 []，但 document.querySelector 返回 null，注意空指针异常。当找不到时，也可以使用 || 设置默认的值，如document.querySelectorAll(selector) || []
- 注意：document.querySelector 和 document.querySelectorAll 性能很差。如果想提高性能，尽量使用 document.getElementById、document.getElementsByClassName 或 document.getElementsByTagName。

### 选择器查询

```
// jQuery
$('selector');

// Native
document.querySelectorAll('selector');
```

### class查询

```
// jQuery
$('.class');

// Native
document.querySelectorAll('.class');

// or
document.getElementsByClassName('class');
```

### id查询

```
// jQuery
$('#id');

// Native
document.querySelectorAll('#id');

// or
document.getElementById('id')
```

### 后代查询

```
// jQuery
$(el).find('li');

// Native
el.querySelectorAll('li');
```

### 兄弟和上下元素

- 兄弟元素

```
// jQuery
$el.siblings();

// Native - latest, Edge13+ 使用rest表达式
[...el.parentNode.children].filter((child) =>
  child !== el
);
// Native (alternative) - latest, Edge13+
Array.from(el.parentNode.children).filter((child) =>
  child !== el
);
// Native - IE10+
Array.prototype.filter.call(el.parentNode.children, (child) =>
  child !== el
);
```

- 上一个元素

```
// jQuery
$el.prev();

// Native
el.previousElementSibling;
```

- 下一个元素

```
// jQuery
$el.next();

// Native
el.nextElementSibling;
```

### closest

Closest 获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上

```
// jQuery
$el.closest(queryString);

// Native - Only latest, NO IE
el.closest(selector);

// Native - IE10+
function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return null;
}
```

### Form

- Input/Textarea

```
// jQuery
$('#my-input').val();

// Native
document.querySelector('#my-input').value;
```

- 获取 e.currentTarget 在 .radio 中的数组索引

```
// jQuery
$('.radio').index(e.currentTarget);

// Native
Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
```

## CSS & Style

### CSS

- Get style

```
// jQuery
$el.css("color");

// Native
// 注意：此处为了解决当 style 值为 auto 时，返回 auto 的问题
const win = el.ownerDocument.defaultView;

// null 的意思是不返回伪类元素
win.getComputedStyle(el, null).color;
```

- Set style
```
// jQuery
$el.css({ color: "#ff0011" });

// Native
el.style.color = '#ff0011';
```

- Add class

```
// jQuery
$el.addClass(className);

// Native
el.classList.add(className);
Remove class

// jQuery
$el.removeClass(className);

// Native
el.classList.remove(className);
has class

// jQuery
$el.hasClass(className);

// Native
el.classList.contains(className);
Toggle class

// jQuery
$el.toggleClass(className);

// Native
el.classList.toggle(className);
```

### Width & Height

Width 与 Height 获取方法相同，下面以 Height 为例：

Window height

```
// window height
$(window).height();

// 含 scrollbar
window.document.documentElement.clientHeight;

// 不含 scrollbar，与 jQuery 行为一致
window.innerHeight;
Document height

// jQuery
$(document).height();

// Native
const body = document.body;
const html = document.documentElement;
const height = Math.max(
  body.offsetHeight,
  body.scrollHeight,
  html.clientHeight,
  html.offsetHeight,
  html.scrollHeight
);
Element height

// jQuery
$el.height();

// Native
function getHeight(el) {
  const styles = this.getComputedStyle(el);
  const height = el.offsetHeight;
  const borderTopWidth = parseFloat(styles.borderTopWidth);
  const borderBottomWidth = parseFloat(styles.borderBottomWidth);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
}

// 精确到整数（border-box 时为 height - border 值，content-box 时为 height + padding 值）
el.clientHeight;

// 精确到小数（border-box 时为 height 值，content-box 时为 height + padding + border 值）
el.getBoundingClientRect().height;
```