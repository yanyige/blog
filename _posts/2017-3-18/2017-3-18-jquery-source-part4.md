---
layout: default
title: jQuery源码分析 jQuery.Callbacks(flags) (第四部分)
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

> 巧妙之处在于 变量object和flagCache[flags]指向了同一个空对象，后面给object赋值的同时给flagCache[flags]也添加了属性。

**2.工具函数 add(args)**  
工具函数用于添加一个或者多个回调函数到数组中，如果是unique模式，并且待添加的回调函数已经添加过，则不会添加。该函数通过闭包机制引用数组list。

工具函数add源代码如下：
```
jQuery.Callbacks = function(flags) {
    var list = [],
    
    add = function(args) {
        var i,
            length,
            elem,
            type,
            actual;
        for(i = 0, length = args.length; i < length; i ++) {
            elem = args[i];
            type = jQuery.type(elem);
            if(type == "array") {
                add(elem);
            } else if (type == "function") {
                if(!flags.unique || !self.has(elem)) {
                    list.push(elem);
                }
            }
        }
    },
    
    self = {
        add: function() {
            if(list) {
                var length = list.length;
                add(arguments);
            }
        }
    }
}
```

**3.工具函数 fire(context, args)**   


工具函数fire使用指定的上下文context和参数args调用list中的回调函数。该函数通过闭包机制一用数组list。

在memory模式下，回调函数列表的方法callbacks.add()在添加回调函数后，如果回调函数列表未禁用并且已经被触发过，也会调用工具函数fire来立即执行刚刚添加的回调函数。

工具函数fire源代码如下：

```
jQuery.Callbacks = function(flags) {
    var list = [],
        stack = [],
        memory,
        firing,
        firingStart,
        firingLength,
        firingIndex,
        
        fire = function(context, args) {
            args = args||[];
            memory = !flags.memory || [context, args];
            firing = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            
            for(; list && firingIndex < firingLength; firingIndex ++) {
                if(list[firingIndex].apply(context, args) === false && flags.stopOnFalse) {
                    memory = true;
                    break;
                }
            }
            
            firing = false;
        
 1052        if(list) {
                if(!flag.once) {
                    if(stack && stack.length) {
                        memory = stack.shift();
                        self.fireWith (memory[0], memory[1]);
                    }
                } else if(memory === true) {
                    self.disable();
                } else {
                    list = [];
                }
            }
        },
        
        self = {
            disable: function() {
                list = stack = memory = undefiend;
                return this
            },
        };
        
        
}
```
变量memory的可能值以及含义如下表：
| 可能值 | 回调函数列表状态 | 含义和场景 |
|:-------|:--------|:--------|
| undefined | 未被触发或已被禁用 | |
| [context, args] | 已被触发 | 1) memory + 非stopOnFalse模式 <br> 2) memory + stopOnFalse模式 + 回调函数返回值不是false |
| true | 已被触发 | 1) 非memory模式 <br> 2) stopOnFalse模式 + 某个回调函数返回值是false |

四种参数分别的作用如下：
- once: 确保这个回调列表只执行（ .fire() ）一次(像一个递延 Deferred).
- memory: 保持以前的值，将添加到这个列表的后面的最新的值立即执行调用任何回调(像一个递延 Deferred).
- unique: 确保一次只能添加一个回调(所以在列表中没有重复的回调).
- stopOnFalse: 当一个回调返回false 时中断调用

代码如下:
```
function fn1( value ) {
    console.log( value );
}
 
function fn2( value ) {
    fn1("fn2 says: " + value);
    return false;
}
```
> once

```
var callbacks = $.Callbacks( "once" );
callbacks.add( fn1 );
callbacks.fire( "foo" ); // "foo"
callbacks.fire( "foo" ); // no return
callbacks.disabled(); // true
```

> memory

```
var callbacks = $.Callbacks( "memory" );
callbacks.add( fn1 );
callbacks.fire( "foo" ); // "foo"
callbacks.add( fn2 ); // "foo"
callbacks.fire( "foo" ); // "foo fn2 says: foo"
```

> unique

```
var callbacks = $.Callbacks( "unique" );
callbacks.add( fn1 );
callbacks.fire( "foo" ); // "foo"
callbacks.add( fn1 ); // add again
callbacks.fire( "foo" ); // "foo" only print once
```
 
> stopOnFalse 

```
var callbacks = $.Callbacks( "stopOnFalse" );
callbacks.add( fn1 );
callbacks.fire( "foo" ); // "foo"
callbacks.add( fn2 );
callbacks.fire( "bar" ); // "foo fn2 says: foo"
callbacks.add( fn1 );
callbacks.fire( "foobar" ); // "foo fn2 says: foo"
```

**4. 添加 callbacks.add()**   

方法callbacks.add()用于添加一个或者多个回调函数到回调函数列表中,通过调用工具函数add(args)实现；在memory模式下，如果回调函数列表未在执行中，并且已经被触发过，则立即执行新添加的回调函数。

**5. 移除 callbacks.remove()**   

**6. 触发 callsbacks.fireWith(context, args)、callbacks.fire( args)、callbacks.fired()**  

callsbacks.fireWith(context, args)使用指定的上下文和参数来触发回调函数列表的所有回调函数，方法callbacks.fire(args)使用指定参数触发回调函数列表中的所有参数，callbacks.fired()用于判断回调函数列表是否被触发过。

```
var stack = [];

fireWith : function(context , args) {
    if(stack) {
        if(firing) {
            if(!flag.once) {
                stack.push([context, args]);
            }
        } else if(!(flags.once && memory)) {
            fire(context, args)
        }
    }
    return this;
} ,
fire: function(args) {
    self.fireWith(this, arguments);
},
fired: function() {
    return !!memory; //transform to boolean
}
```

**7. 禁用 callsbacks.disable()、callbacks.disabled()**  

方法callbacks.disable()用于禁止函数回调列表，使它不再能做任何事情。方法callbacks.disabled()用于判断回调函数列表是否被禁用。

**8. 锁定 callsbacks.lock()、callbacks.locked()**  

方法callbacks.lock()用于锁定函数回调列表。方法callbacks.disabled()用于判断回调函数列表是否被锁定。