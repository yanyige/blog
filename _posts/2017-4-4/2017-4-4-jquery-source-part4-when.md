---
layout: posts
title: jQuery源码分析 jQuery.Deferred(func)
tags: 前端 jQuery
category: jQuery
excerpt: 学习笔记， 继上次学习jQuery.Callback之后， 这次学习jQuery.Defedred(flags)， 该函数在jQuery.Callbacks的基础上，为回调函数增加了状态， 提供了多个函数列表。可以通过调用方法deferred.done/fail/progress/then/always()添加成功回调函数、失败回调函数、消息回调函数到对应成功、失败、消息回调函数列表中， 并且可以通过调用方法deferred.resolve/resolveWith/reject/rejectWith/notify/notifyWith()分别触发成功、失败、消息回调函数列表......
date: 2017-3-31 16:27
---

> 在上一篇博客中， 深刻讨论了jQuery.Callbacks(flag) 的源码实现， 了解到它返回一个链式工具对象， 用于管理一组回调函数。这次讨论下一个函数jQuery.Defferred().

异步队列有三种状态: 待定(pending)、成功(resolved)和失败(rejected)。初始时处于待定状态(pending);调用方法deferred.resolve(args)或resolveWith(context， args)将改变异步队列的状态为成功状态(resolved)， 并且立即执行添加的所有成功回调函数;调用方法deferred.reject(args)或rejectWith(context， args)则改变异步队列的状态为失败状态(rejected)并且立即执行设置的所有失败函数。一旦队列进入成功或失败状态，就会保持它的状态不变，例如：再次调用deferred.resolve()或deferred.reject()会被忽略。

异步队列进入成功或者失败状态之后， 仍然可以通过调用deferred.done()、 deferred.fail()、deferred.then()、 deferred.always()、 添加更多的回调函数， 这些回调函数会被立即执行， 并传入之前的调用方法deferred.resolve(args)、deferred.resolveWith(context， args)、deferred.reject(args)或deferred.rejectWith(context， args)时传入的参数。

异步队列基于规范CommonJSPromise/A实现， 解耦了异步任务和回调函数。当jQuery方法返回一个异步队列或者支持异步队列功能的对象时， 例如， jQuery.ajax()或jQuery.when()， 很多情况下我们只是想要使用方法deferred.then()、 deferred.done()和deferred.fail()添加回调函数到异步队列中， 而在创建异步队列的代码内部， 将会在某个时间点调用deferred.resolve()或deferred.reject()使合适的回调函数执行。

| 序号   |分类     | 方法          | 说明 |
|:-------------|:--------------|:------------------|:------|
| 1    |添加       | deferred.done() | 添加成功回调函数， 当异步队列处于成功的时候被调用  |
| 2|添加 | deferred.fail()   | 添加失败回调函数， 当异步队列处于失败的时候被调用  |
| 3|添加           | deferred.progress()      | 添加消息回调函数   |
| 4|添加           | deferred.then() | 同时添加成功回调函数、失败回调函数、消息回调函数  |
| 5|添加           | deferred.always() | 添加回调函数， 当异步队列处于成功或失败时被调用  |  
| 6|执行           | deferred.resolve(args) | 使用指定的参数调用所有的成功回调函数， 异步队列进入成功状态  |
| 7|执行           | deferred.resolveWith(context， args) | 使用指定的上下文和参数调用所有的成功回调函数， 异步队列进入成功状态  |
| 8|执行           | deferred.reject(args) | 使用指定的参数调用所有的失败回调函数， 异步队列进入失败状态  |
| 9|执行           | deferred.rejectWith(context， args) | 使用指定的上下文和参数调用所有的失败功回调函数， 异步队列进入失败状态  |
| 10|执行           | deferred.notify(args) | 使用指定的参数调用所有的消息回调函数  |
| 11|执行           | deferred.notifyWith(context， args) | 使用指定的上下文和参数调用所有的消息回调函数  |
| 12|状态           | deferred.state() | 判断当前异步队列的状态  |
| 13|状态           | deferred.isResolved() | 判断异步队列是否已经被设置为成功状态， 不建议使用  |
| 14|状态           | deferred.isRejected() | 判断异步队列是否已经被设置为失败状态， 不建议使用  |
| 15|工具          | deferred.pipe() | 返回一个新的异步队列的只读副本， 通过过滤函数过滤当前异步队列的状态和值  |
| 16|工具          | deferred.promise(target) | 返回一个新的异步队列的只读副本， 为普通对象增加异步队列的功能  |

### 4.2.1 实现原理和总体架构
异步队列内部维护了三个回调函数列表: 成功回调函数列表、失败回调函数列表和消息回调函数列表。其他方法则围绕这三个列表进行操作和检测。 总体源码结构如下：
```
jQuery.extend({
    Deferred: function(func) {
        var doneList = jQuery.Callbacks('once memory')，
        var failList = jQuery.Callbacks('once memory')，
        var progressList = jQuery.Callbacks('memory')，
        
        state = "pending"，
        
        promise = {
            //done， fail， progress，
            //state， isResolved， isRejected
            //then， always
            //pipe
            //promise
        }，
        deferred = promise.promise({})，
        key，
        lists = {
            resolve: doneList，
            reject: failList，
            notify: progressList
        };
        
        for(key in lists) {
            deferred[ key ] = lists[ key ].fire;
            deferred[ key = "With" ] = lists[ key ].fireWith;
        }
        
        deferred.done( function() {
            state = "resolved";
        }， failList.disable， progressList.lock ).fail( function() {
            state = "rejected";
        }， doneList.disable， progressList.lock );
        
        if(func) {
            func.call(deferred， deferred);
        }
        
        return deferred;
    }，
})
```

### 4.2.2 源码分析

方法jQuery.Deferred(func)创建异步队列的5个关键步骤如下：
1. 创建成功、失败、消息回调函数列表， 设置初始状态为待定(pending)。
2. 创建异步队列只读副本promise， 其中包含了方法done()， fail()， progress()， state()， isResolved()， isRejected()， then()， always()， pipe()， promise()。
3. 定义异步队列deferred。
    1. 把只读副本promise中的方法添加到异步队列deferred中
    2. 为异步队列deferred添加触发执行成功、失败、消息回调函数的方法， 包括resolve()、resolveWith()、reject()、rejectWith()、notify()、notifyWith()。
    3. 为异步队列deferred添加设置状态的回调函数。
4. 如果传入func， 则调用。
5. 返回异步队列deferred。


#### 1. 定义jQuery.Deferred(func)
```
jQuery.extend({
    Deferred: function(func) {}
})
```
deferred()接受一个参数， 在返回异步队列前会被调用。在func执行的过程中可以添加回调函数， 例如调用deferred.then()。

#### 2. 创建成功、失败、消息函数列表， 设置状态为pending

```
var doneList = jQuery.Callbacks('once memory')，
var failList = jQuery.Callbacks('once memory')，
var progressList = jQuery.Callbacks('memory')，

state = "pending"，

lists = {
    resolve: doneList，
    reject: failList，
    notify: progressList
}
```
> 后面的代码会通过遍历lists中的属性来给异步队列添加方法， 可以减少实现代码的行数， 是值得学习的技巧。

#### 3.创建异步队列的只读副本promise
##### (1)方法deferred.done()， deferred.fail()， deferred.progress()  
方法**deferred.done()**， **deferred.fail()**， **deferred.progress()**  ， 分别用于添加成功回调函数、失败回调函数、消息回调函数到对应的回调函数列表中， 这三个方法只是简单引用对应的回调函数列表的方法callbacks.add()， 相关代码如下：
```
promise = {
    done: doneList.add，
    fail: failList.add，
    progress: progressList.add，
}
```
##### (2)方法deferred.state()， deferred.isResolved， deferred.isRejected。
方法**deferred.state()**， **deferred.isResolved()**， **deferred.isRejected()** 用于返回异步队列的状态。
如果方法deferred.state()返回"resolved"， 意味着deferred.resolve()或者deferred.resolveWith()已经被调用， 成功回调函数正在执行或者已经被执行。
```
state: function() {
    return state;
}，
```

##### (3)便捷方法deferred.then(doneCallbacks， failCallbacks， progressCallbacks)、deferred.always(alwaysCallbacks[， alwaysCallbacks])  

便捷方法**deferred.then(doneCallbacks， failCallbacks**用于同时添加成功回调函数或者失败回调函数、消息回调函数到对应的回调函数列表中。

便捷方法**deferred.always(alwaysCallbacks[， alwaysCallbacks])** 用于将回调函数同时添加到回调函数列表doneList和失败回调函数列表failList， 即保存两份引用， 当异步队列处于成功或者失败状态时被调用。
```
then: function(doneCallbacks， failCallbacks， progressCallbacks) {
    deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
    return this;
}，
always: function() {
    deferred.done.apply(deferred， arguments).fail.apply(deferred， arguments);
    return this;
}
```

##### (4)工具方法deferred.pipe(fnDone， fnFail， fnProgress)
**deferred.pipe(fnDone， fnFail， fnProgress)** 接受三个可选的过滤函数作为参数， 用于过滤当前异步队列的状态和参数， 并且返回一个新的异步队列的只读副本。 当前异步队列被触发时， 过滤函数将被调用并把返回值传给只读副本。

```
pipe: function(fnDone， fnFail， fnProgress) {
    return jQuery.Deferred(function(newDefer) {
        jQuery.each({
            done: [fnDone, "resolve"],
            fail: [fnFail, "reject"],
            progress: [fnProgress， "notify"]
        }， function(handler, data) {
            var fn = data[0],
                action = data[1],
                returned;
            if(jQuery.isFunction(fn) {
                deferred[handler](function() {
                    returned = fn.apply(this， arguments);
                    if(returned && jQuery.isFunction 
                    (returned.promise)) {
                        returned.promise().then(newDefer.resolve，
                        newDefer.reject, newDefer.notify);
                    } else {
                        newDefer[action + "With"] (this === deferred?newDefer: this, [returned]);
                    }
                });
            }) else {
                deferred[handler](newDefer[action]);
            }
        });
    }).promise();
}
```

> 这里引用两个例子

过滤解决值
```
var defer = $.Deferred(),
    filtered = defer.pipe(function( value ) {
      return value * 2;
    });
 
defer.resolve( 5 );
filtered.done(function( value ) {
  alert( "Value is ( 2*5 = ) 10: " + value );
});
```

过滤拒绝值:
```
var defer = $.Deferred(),
    filtered = defer.pipe( null， function( value ) {
      return value * 3;
    });
 
defer.reject( 6 );
filtered.fail(function( value ) {
  alert( "Value is ( 3*6 = ) 18: " + value );
});
```

链任务:
```
var request = $.ajax( url, { dataType: "json" } )，
    chained = request.pipe(function( data ) {
      return $.ajax( url2, { data: { user: data.userId } } );
    });
 
chained.done(function( data ) {
  // data retrieved from url2 as provided by the first request
});
```

##### (5) 只读副本deferred.promise(obj)

方法**deferred.promise(obj)** 用于返回当前异步队列的只读副本， 或为一个普通js对象增加只读副本中的方法并返回。只读副本只暴露了添加回调函数和判断状态的方法：done()、fail()、progress()、then()、always()、state()、pipe()。

相关代码如下所示：
```
//Get a promise for this deferred
//if obj is provided, the promise aspect is added to the object

promise: function(obj) {
    if(obj == null) {
        obj = promise;
    } else {
        for(var key in promise) {
            obj[key] = promise[key];
        }
    }
    return obj;
}


```

### 4.2.3 小结
- jQuery.Deferred创建异步队列
- - 创建成功、失败、消息回调函数列表
- - 设置状态为待定(state="pending")
- - 创建异步队列只读副本promise
- - 1. done()
- - 2. fail()
- - 3. progress()
- - 4. state()
- - 5. then()
- - 6. always()
- - 7. pipe()
- - 8. promise(obj)
- - 创建异步队列deferred
- - 1. 把只读副本promise中的方法添加到异步队列promise中
- - 2. 为异步队列添加触发执行成功、失败、消息回调函数的方法
- - 3. 为返回值deferred添加设置状态的回调函数
- - 如果传入func, 则条用
- - 返回异步队列deferred