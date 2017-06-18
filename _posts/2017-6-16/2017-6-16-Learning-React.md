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
let MyTitle = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
    },
    render: function() {
        return <h1> {this.props.title} </h1>
    }
})
var data = '123';

ReactDOM.render(
    <MyTitle title={data} />,
    document.getElementById('example')
);
```
        

这里是[官方文档](https://facebook.github.io/react/docs/components-and-props.html).

## 5.获取真实的DOM节点

组件并不是真的DOM节点，是存在于内存中的数据结构，Virtual DOM。只有当他插入到文档之后才会变成真实的DOM。根据React的设计，所有的DOM变动，都先在虚拟DOM上发生，再将实际变动的部分，反映在真实DOM上，这种算法叫做DOM diff。它可以极大的提高网页的性能表现。

但是，有时需要从组件中获取真实的DOM节点，需要用到ref属性。

```
let Component = React.createClass({
    handleClick: function() {
        this.refs.myTextInput.focus();
    },
    render: function() {
        return (
            <div>
                <input type='text' ref='myTextInput'/>
                <input type='button' value='Focus ths text Input' onClick={this.handleClick}/>
            </div>
        )
    }
});
ReactDOM.render(
    <Component/>,
    document.getElementById('example')
)
```

**注意**

由于this.refs.[refName]获取的是真实的DOM，所以他必须等虚拟的DOM渲染到真实的DOM上之后才能进行访问，否则会报错。在上面的代码中，通过为组件指定Click的回调函数，确保等真实的事件发生之后，才会读取它的this.refs.[refName]属性。

## 6.State

React的一大特点，将组件看做成一个状态机，一开始有一个初始状态，然后与用户进行互动，导致状态变化后重新绘制UI。

```
let LikeButton = React.createClass({
    getInitialState: function() {
        return {liked: false};
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        let text = this.state.liked ? 'like' : 'havn\'t liked';
        return (
            <p onClick={this.handleClick}> 
                You {text} this. Click to toggle.
            </p> 
        )
    }
});
ReactDOM.render(
    <LikeButton/>,
    document.getElementById('example')
)
```

**注意**

由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。

## 7.表单

用户在表单中填写内容，属于用户和组件互动。所以不能用this.props查看。

```
let Input = React.createClass({
    getInitialState: function() {
        return {value: 'Hello!'};
    },
    handleChange: function(event) {
            this.setState({value: event.target.value});
    },
    render: function() {
        let value = this.state.value;
        console.log(value);
        return (
            <div>
                <input type='text' value={value} onChange={this.handleChange} />
                <p>{value}</p>
            </div>
        )
    }
});
ReactDOM.render(
    <Input/>,
    document.getElementById('example')
)
```

> 上面代码中，文本输入框的值，不能用 this.props.value 读取，而要定义一个 onChange 事件的回调函数，通过 event.target.value进行中转。


## 8.组件的生命周期

组件的生命周期分为三个状态：

1. Mounting：已插入真实DOM。
2. Updating：正在重新渲染。
3. Unmounting：已经移除真实DOM。

React为每种状态提供了两种处理函数，Will以及Did。Will在进入状态之前使用，Did在进入状态之后调用。

1. componentWillMount()
2. componentDidMount()
3. componentWillUpdate(object nextProps, object nextState)
4. componentDidUpdate(object prevProps, object prevState)
5. componentWillUnmount()

除此之外，还有两种特殊的函数。

1. componentWillReceiveProps(object nextProps) 已加载组件接受到新的参数时调用。
2. shouldComponentUpdate(object nextProps, object nextState): 组件判断是否重新渲染时调用。

```
let Hello = React.createClass({
    getInitialState: function() {
        return {
            opacity: 1.0
        }
    },
    componentDidMount: function() {
        this.timer = setInterval(function() {
            let opacity = this.state.opacity;
            opacity -= .05;
            if(opacity < .1) {
                opacity = 1.0;
            }
            this.setState({
                opacity: opacity
            });
        }.bind(this), 100)
    },
    render: function() {
        return (
            <div style={{opacity: this.state.opacity}}>
                Hello {this.props.name}
            </div>
        )
    }
});

ReactDOM.render(
    <Hello />,
    document.getElementById('example')
)
```
