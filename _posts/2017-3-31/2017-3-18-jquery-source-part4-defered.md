---
layout: posts
title: jQuery源码分析 jQuery.Deferred(func)
tags: 前端 jQuery
category: jQuery
excerpt: 学习笔记, 继上次学习jQuery.Callback之后, 这次学习jQuery.Defedred(flags), 该函数在jQuery.Callbacks的基础上, 为回调函数增加了状态, 提供了多个函数列表。可以通过调用方法deferred.done/fail/progress/then/always()添加成功回调函数、失败回调函数、消息回调函数到对应成功、失败、消息回调函数列表中, 并且可以通过调用方法deferred.resolve/resolveWith/reject/rejectWith/notify/notifyWith()分别触发成功、失败、消息回调函数列表......
date: 2017-3-31 16:27
---

> 在上一篇博客中, 深刻讨论了jQuery.Callbacks(flag) 的源码实现, 了解到它返回一个链式工具对象, 用于管理一组回调函数。这次讨论下一个函数jQuery.Defferred().

异步队列有三种状态: 待定(pending)、成功(resolved)和失败(rejected)。初始时处于待定状态(pending);调用方法deferred.resolve(args)或resolveWith(context, args)将改变异步队列的状态为成功状态(resolved), 并且立即执行添加的所有成功回调函数;调用方法deferred.reject(args)或rejectWith(context, args)则改变异步队列的状态为失败状态(rejected)并且立即执行设置的所有失败函数。一旦队列进入成功或失败状态,就会保持它的状态不变,例如：再次调用deferred.resolve()或deferred.reject()会被忽略。

异步队列进入成功或者失败状态之后, 仍然可以通过调用deferred.done()、 deferred.fail()、deferred.then()、 deferred.always()、 添加更多的回调函数, 这些回调函数会被立即执行, 并传入之前的调用方法deferred.resolve(args)、deferred.resolveWith(context, args)、deferred.reject(args)或deferred.rejectWith(context, args)时传入的参数。

异步队列基于规范CommonJSPromise/A实现, 解耦了异步任务和回调函数。当jQuery方法返回一个异步队列或者支持异步队列功能的对象时, 例如, jQuery.ajax()或jQuery.when(), 很多情况下我们只是想要使用方法deferred.then()、 deferred.done()和deferred.fail()添加回调函数到异步队列中, 而在创建异步队列的代码内部, 将会在某个时间点调用deferred.resolve()或deferred.reject()使合适的回调函数执行。

| 序号   |分类     | 方法          | 说明 |
|:-------------|:--------------|:------------------|:------|
| 1    |添加       | deferred.done() | 添加成功回调函数, 当异步队列处于成功的时候被调用  |
| 2|添加 | deferred.fail()   | 添加失败回调函数, 当异步队列处于失败的时候被调用  |
| 3|添加           | deferred.progress()      | 添加消息回调函数   |
| 4|添加           | deferred.then() | 同时添加成功回调函数、失败回调函数、消息回调函数  |
| 5|添加           | deferred.always() | 添加回调函数, 当异步队列处于成功或失败时被调用  |  
| 6|执行           | deferred.resolve(args) | 使用指定的参数调用所有的成功回调函数, 异步队列进入成功状态  |
| 7|执行           | deferred.resolveWith(context, args) | 使用指定的上下文和参数调用所有的成功回调函数, 异步队列进入成功状态  |
| 8|执行           | deferred.reject(args) | 使用指定的参数调用所有的失败回调函数, 异步队列进入失败状态  |
| 9|执行           | deferred.rejectWith(context, args) | 使用指定的上下文和参数调用所有的失败功回调函数, 异步队列进入失败状态  |
| 10|执行           | deferred.notify(args) | 使用指定的参数调用所有的消息回调函数  |
| 11|执行           | deferred.notifyWith(context, args) | 使用指定的上下文和参数调用所有的消息回调函数  |
| 12|状态           | deferred.state() | 判断当前异步队列的状态  |
| 13|状态           | deferred.isResolved() | 判断异步队列是否已经被设置为成功状态, 不建议使用  |
| 14|状态           | deferred.isRejected() | 判断异步队列是否已经被设置为失败状态, 不建议使用  |
| 15|工具          | deferred.pipe() | 返回一个新的异步队列的只读副本, 通过过滤函数过滤当前异步队列的状态和值  |
| 16|工具          | deferred.promise(target) | 返回一个新的异步队列的只读副本, 为普通对象增加异步队列的功能  |