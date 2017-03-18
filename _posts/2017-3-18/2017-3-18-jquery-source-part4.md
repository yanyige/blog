---
layout: default
title: jQuery源码分析 (第四部分)
tags: 前端 jQuery
category: jQuery
excerpt: 学习笔记, Sizzle选择器介绍，一款纯JavaScript 实现的CSS选择器引擎。
date: 2017-3-18 20:12
---

# 第一章 异步队列 Deferred Object

异步模块是在jquery1.5中引用的，目的是为了实现异步任务和回调函数的解耦，为ajax模块、队列模块、ready事件提供基础功能。

eg. 在1.5版本之前的版本中，ajax函数可接受多个回调函数，当ajax请求成功、失败、完成时，对应的回调函数就会被调用。  
代码如下：

```
$.ajax({
    url: 'ajax/text.html',
    success: function(data, status, xhr) {...},
    error: function(xhr, status, errmsg) {...},
    complete: function(xhr, status) {...}
})
```
而在 jquery 1.5中，则基于异步队列重新实现了jQuery.ajax()，解耦了异步任务jQuery.ajax()和回调函数。其中jQuery.ajax()负责创建异步队列、发送ajax请求、解析响应内容，回调函数则交给异步队列进行管理，可以为每种响应状态(成功、失败、完成)设置多个回调函数，并且可以异步的设置回调函数；当ajax请求成功、失败、完成时，jQuery.ajax()将根据响应状态和响应内容解析结果，调用异步队列上相应的方法触发回调函数，实例代码如下：

```
$.ajax('ajax/text.html')
 .done(function(data, textStatus, jqxhr) {...}) // success
 .fail(function(data, textStatus, jqxhr) {...}) // error
```
 异步队列包含3个部分： jQuery.Callbacks( flags )、jQuery.Deferred( func ) 和 jQuery.when(), 总体源码介绍如下。
 
 源码如下：
 
 ```
 jQuery.Callbacks = function(flags) {
    
 } ;
 jQuery.extend({
    Deffered: function(func) {
    },
    when: function(firstParam) {
    }
 });
 ```
 ## 4.1 jQuery.Callbacks(flags)
 
 方法jQuery.Callbacks(flags)返回一个链式工具对象，用于管理一组回调函数，我们把返回的链式工具称为“回调函数列表”。
 
### 4.1.1 实现原理和总体结构

在回调函数列表内部，通过一个数组来保存回调函数，其他方法则围绕这个数组进行操作和检测。该方法的源码如下：

```
function createFlags (flags) {...}

jQuery.Callbacks = function(flags) {
    //解析字符串标记flags为对象
    flags = flags ? (flagsCache[ flags ] || createFlags( flags ) : {});
    //声明局部变量，通过闭包引用
    
    var list = [],
    stack = [],
    memory, 
    firing,
    firingStart,
    firingIndex,
    add = function(args) {...} //实际添加回调函数的工具函数
    fire = function(context, args) {...}, //实际触发回调函数的工具函数
    //回调函数列表， 方法jQuery.Callbacks的返回值
    self = {
        add: function() {}, //添加回调函数
        remove: function() {}, //移除回调函数
        has: function() {}, //回调函数是否在列表中
        empty: function() {},
        disable: function() {},
        disabled: function() {},
        lock: function() {},
        locked: function() {},
        fireWith: function() {},
        fire: function() {},
        fired: function() {},
    }
} 
```
### 4.1.2 源码分析
**1.工具函数 createFlags(flags)**
工具函数createFlags(flags)用于将字符串格式的标记转化为对象格式的标记。例如，执行createFlags('once memory'); 会返回对象 {once: true, memory: true}

源码如下：

```
var flagCache = {};
function createFlags (flags) {
    var object = flagCache[flags] = {},
    i, length;
    
    flags = flags.split(/s+/);
    for(i = 0, length = flags.length; i < length; i ++) {
        object[flags[i]] = true;
    }
    return object;
    
}

jQuery.Callback = function (flags) {
    flags = flags? (flagCache[flags] || createFlags(flags)): {};
} 
```

> 巧妙之处在于 变量object和flagCache[flags] 指向了同一个空对象，后面给object赋值的同时给flagCache[flags]也添加了属性。