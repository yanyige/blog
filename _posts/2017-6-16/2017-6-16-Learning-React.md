---
layout: posts
title: React学习记录
tags: 前端 React
category: javascript
excerpt: 在阿里实习的一些笔记
date: 2017-6-15 23:54
---

# React 学习

## 1.JSX语法
**JSX语法的定义**  
将Javascript代码直接写在HTML代码当中，不加任何引号，就是JSX语法。  
**JSX语法的基本规则**  
遇到 HTML 标签（以 < 开头），就用 HTML 规则解析；遇到代码块（以 { 开头），就用 JavaScript 规则解析。  
JSX 允许直接在模板插入 JavaScript 变量。如果这个变量是一个数组，则会展开这个数组的所有成员。   

```
var arr = [
<h1>Hello</h1>,
<h2>Head 2</h2>
];
ReactDOM.render(
  <div>{arr}</div>,
  document.getElementById('root')
)
```


## 2.组件
React代码允许将代码封装成组件。使用React.createClass方法生成一个组件类。

```
var HelloMessage = React.createClass({
  render: function() {
    return <h1>Hello {this.props.name}</h1>;
  }
});
ReactDOM.render(
  <HelloMessage name="john"/>,
  document.getElementById("root")
)
```

**注意**  

* 主键类的第一个字母必须大写，否则会报错。
* 主键类只能包含一个顶层标签，否则也会报错。
* 所有的组件类都要有自己的render方法，用于输出组件。
* 对于添加组件属性，有地方需要注意。class需要写成className，for要写成htmlFor。这是因为class和for都是Javascript中的保留字。(这个className是写在JSX中的)

## 3.this.props.children

**this.props**对象与属性一一对应，但是有一个例外，就是**this.props.children**属性。它表示组件的所有子节点。

```
let NodeList = React.createClass({
    render: function() {
        return (<ol>
            {
                React.Children.map(this.props.children, function(child) {
                    return <li>{child}</li>;
                })
            }
        </ol>);
    }
});
ReactDOM.render(
    <NodeList>
        <span>yyg</span>
        <span>zsn</span>
    </NodeList>,
    document.getElementById('example')
)
```
**注意**

1. this.props.children的值有三种，如果没有子节点则值是undefined，只有一个节点则是object，多个节点就是array。 
2. 我们可以用react提供的react.Children工具方法来处理this.props.children。而不用担心他的数据类型。


## 4.PropTypes

组件的属性可以接受任何值，字符串、对象、函数等等都可以。有时候，我们需要验证别人在使用组件的时候提供的参数是否符合要求。  
组件里的PropTypes属性就是来验证提供的参数是否符合要求。
```