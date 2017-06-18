---
layout: posts
title: TypeScript学习记录
tags: 前端 TypeScript
category: TypeScript
excerpt: 摘自于typescript官方网站
date: 2017-6-18 23:06
---

# TypeScript

## 1.类型注解
TypeScript里的类型注解是一种轻量级的为函数或变量添加约束的方式。 在这个例子里，我们希望 greeter函数接收一个字符串参数。 然后尝试把 greeter的调用改成传入一个数组

```
function greeter(person: string) {
    return "Hello, " + person;
}

var user = "Jane User";

var user1 = [1,2,3];

document.body.innerHTML = greeter(user1);
```

**注意**

此时，虽然有错误，greeter.js文件还是被创建了。 就算你的代码里有错误，你仍然可以使用TypeScript。但在这种情况下，TypeScript会警告你代码可能不会按预期执行。

## 2.接口

现在我们用接口来描述一个拥有firstName和lastName字段的对象。在TypeScript里，只要两个类型内部的结构兼容则这两个类型就是兼容的。这就允许我们在实现接口的时候只要保证包含了接口要求的结构就可以，而不必明确的使用implements语句。

```
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```

TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```
function printLabel(labelledObj: {label: string}) {
	console.log(labelledObj.label);
}
let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

类型检查器会检查printLabel的调用。printLabel有一个参数，并要求这个对象参数有一个名为label类型为string的属性。我们传入的对象可能会有很多属性，但是编译器只会检查那些必要的属性是否存在，并且类型是否匹配。然而，有些时候TypeScript则不会那么轻松：

```
interface LabelledValue {
	label: string;
}
function printLabel(labelObj: LabelledValue) {
	console.log(labelObj.LabelledValue);
}
let myObj = {size: 10, label: 'Size 10 Object'};

printLabel(myObj);
```

LabelledValue接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 label属性且类型为string的对象。 需要注意的是，我们在这里并不能像在其它语言里一样，说传给 printLabel的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。

还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

**readonly vs const**

最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

额外的属性检查
我们在第一个例子里使用了接口，TypeScript让我们传入{ size: number; label: string; }到仅期望得到{ label: string; }的函数里。 我们已经学过了可选属性，并且知道他们在“option bags”模式里很有用。

然而，天真地将这两者结合的话就会像在JavaScript里那样搬起石头砸自己的脚。 比如，拿 createSquare例子来说：

```
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
注意传入createSquare的参数拼写为colour而不是color。 在JavaScript里，这会默默地失败。

你可能会争辩这个程序已经正确地类型化了，因为width属性是兼容的，不存在color属性，而且额外的colour属性是无意义的。

然而，TypeScript会认为这段代码可能存在bug。 对象字面量会被特殊对待而且会经过 额外属性检查，当将它们赋值给变量或作为参数传递的时候。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
绕开这些检查非常简单。 最简便的方法是使用类型断言：

let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
然而，最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性。 如果 SquareConfig带有上面定义的类型的color和width属性，并且还会带有任意数量的其它属性，那么我们可以这样定义它：

interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

```

## 3.类

让我们创建一个Student类，它带有一个构造函数和一些公共字段。 注意类和接口可以一起工作，程序员可以自行决定抽象的级别。

还要注意的是，在构造函数的参数上使用public等同于创建了同名的成员变量。

```
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```
**继承**

```
lass Animal {
    name:string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

我们使用 extends关键字来创建子类。你可以看到Horse和Snake类是基类Animal的子类，并且可以访问其属性和方法。

包含构造函数的派生类必须调用super()，它会执行基类的构造方法。

这个例子演示了如何在子类里可以重写父类的方法。 Snake类和Horse类都创建了move方法，它们重写了从Animal继承来的move方法，使得move方法根据不同的类而具有不同的功能。 注意，即使 tom被声明为Animal类型，但因为它的值是Horse，tom.move(34)会调用Horse里的重写方法

### 公共，私有与受保护的修饰符

#### 理解private

当成员被标记成private时，它就不能在声明它的类的外部访问。比如：

```
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // Error: 'name' is private;
```

当我们比较带有private或protected成员的类型的时候，情况就不同了。 如果其中一个类型里包含一个 private成员，那么只有当另外一个类型中也存在这样一个private成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于protected成员也使用这个规则。

```
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // Error: Animal and Employee are not compatible
```
这个例子中有Animal和Rhino两个类，Rhino是Animal类的子类。 还有一个 Employee类，其类型看上去与Animal是相同的。 我们创建了几个这些类的实例，并相互赋值来看看会发生什么。 因为 Animal和Rhino共享了来自Animal里的私有成员定义private name: string，因此它们是兼容的。 然而 Employee却不是这样。当把Employee赋值给Animal的时候，得到一个错误，说它们的类型不兼容。 尽管 Employee里也有一个私有成员name，但它明显不是Animal里面定义的那个。

#### 理解protected

protected修饰符与private修饰符的行为很相似，但有一点不同，protected成员在派生类中仍然可以访问。例如：

```
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // error
```

> 注意，我们不能在Person类外使用name，但是我们仍然可以通过Employee类的实例方法访问，因为Employee是由Person派生而来的。

构造函数也可以被标记成protected。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。

#### readonly修饰符

你可以使用readonly关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

```
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // error! name is readonly.
```


## 4.数据类型

**布尔**

```
boolean: let isDone: boolean = false
```

**数字**

```
let dec: number = 16;
let oct: number = 0o17;
let hex: number = 0xEEFFFF;
let bin: number = 0b1010;
```

**字符串**

```
let name: string = 'yanyige';
```

> 可以使用模板字符串，它可以定义多行文本和内嵌表达式。这种字符是被反引号包围(`),并且以${ expr }这种形式嵌入表达式。

```
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

它等效于

```
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

**数组**

第一种方法：
在元素类型后面加上[]符号，表示由此类型的数据结构组成的数组。
```
let list: number[] = [1,2,3]
```  
第二种方法：
使用数据泛型，Array<元素类型>:
```
let list: Array<number> = [1,2,3]
```

**元组Tuple**

元组类型允许表示一组已知数量和类型的数组，各元素的类型不必相同。比如，你可以定义一对值分别为string和number类型的元组。

```
//Declare a tuple type
let x: [string, number];
x = ['yyg', 23];//ok
```

当访问一个已知索引的元素，会得到正确的类型:

```
console.log(x[0].substr(1));
```
> substring(a,b)是截取a到b的元素，而substr(a,b)是从a开始截取，截取长度为b的元素。

若是访问一个越界的元素，会使用联合类型替代。

联合类型后面会介绍。

**枚举**

枚举类型和c语言一样，使用枚举类型会给一个数组赋予一个友好的名字。

```
enum Color {Red, Green, Blue}
let c: Color = Color.green;
```

默认情况下，从0开始编号，可以手动给予成员的值，我们将上面的例子改到1开始编号:

```
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Red;
```
枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：

```
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

alert(colorName);
```

**Any**

Any类型是为了我们有时候在编程阶段还不清楚类型的变量指定一个类型，这些值可能来源于动态的内容，比如来自用户或者第三方库。在这种情况下，我们不希望检查器对这些值进行检查而是直接让他们通过编译阶段的检查，那么我们可以使用Any来标记这些变量。

```
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

在对现有代码进行改写的时候，any类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为 Object有相似的作用，就像它在其它语言中那样。 但是Object类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：

```
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

**类型断言**

有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：

```
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

另一个为as语法：

```
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的。