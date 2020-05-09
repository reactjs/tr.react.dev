---
id: jsx-in-depth
title: Derinlemesine JSX
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Temel olarak, JSX `React.createElement(component, props, ...children)` fonksiyonu için sözdizimsel bir kısayol sağlar. JSX, aşağıdaki kodu:

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

şuna derler:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

Eğer alt eleman yoksa, etiketin (tag) kendiliğinden kapanan formunu da kullanabilirsiniz. Yani:

```js
<div className="sidebar" />
```

şuna derlenir:

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

Belirli bir JSX'in JavaScript'e nasıl dönüştürüldüğünü test etmek istiyorsanız, [çevrimiçi Babil derleyicisi](babel://jsx-simple-example)'ni deneyebilirsiniz.

## React Elemanı Türünü Belirtme {#specifying-the-react-element-type}

JSX etiketinin ilk kısmı, React elemanının türünü belirtir.

Büyük harfle başlayan türler, JSX etiketinin bir React bileşenine başvurduğunu belirtir. Bu etiketler, isimlendirilmiş değişkene doğrudan bir referans olarak derlenir, yani JSX `<Foo />` ifadesini kullanırsanız, `Foo` kapsam dahilinde olmalıdır.

### React Kapsam Dahilinde Olmalı {#react-must-be-in-scope}

JSX, `React.createElement` çağrısına derlediğinden, `React` kütüphanesi her zaman JSX kodunuzun kapsamında olmalıdır.

Örneğin, `React` ve `CustomButton` öğeleri doğrudan JavaScript'te kullanılmasa da, her ikisi için de içe aktarma bu kodda gereklidir:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Bir JavaScript paketleyici kullanmıyor ve React'ı bir `<script>` etiketinden yüklüyorsanız, `React` global olarak zaten kapsam dahilindedir.

### JSX Türü için Nokta Gösterimini Kullanma {#using-dot-notation-for-jsx-type}

JSX içinden nokta gösterimini kullanarak da bir React bileşenine başvurabilirsiniz. Bu, birçok React bileşenini dışa aktaran tek bir modülünüz varsa kullanışlıdır. Örneğin, `MyComponents.DatePicker` bir bileşense, bunu doğrudan JSX'te aşağıdaki şekilde kullanabilirsiniz:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Kullanıcı Tanımlı Bileşenler Büyük Harfle Başlamalıdır {#user-defined-components-must-be-capitalized}

Bir elemanın türü küçük harfle başladığında, `<div>` veya `<span>` gibi dahili bir bileşene atıfta bulunur ve bunun sonucu `React.createElement` fonksiyonuna `'div'` veya `'span'` stringlerinin aktarılmasıdır. `<Foo />` gibi büyük harfle başlayan türler `React.createElement(Foo)` şeklinde derlenir ve JavaScript dosyanızda tanımlanan veya içe aktarılan bir bileşene karşılık gelir.

Bileşenleri, büyük harfle başlayan bir şekilde adlandırmanızı öneririz. Küçük harfle başlayan bir bileşeniniz varsa, bunu JSX'te kullanmadan önce büyük harfle başlayan bir değişkene atayın.

Örneğin, bu kod beklendiği gibi çalışmaz:

```js{3,4,10,11}
import React from 'react';

// Yanlış! Bu bir bileşendir ve ismi büyük bir harfle başlamalıdır:
function hello(props) {
  // Doğru! div geçerli bir HTML etiketi olduğundan <div> 'in bu kullanımı uygundur:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Yanlış! React, büyük bir harfle başlamadığından <hello /> 'nun bir HTML etiketi olduğunu düşünüyor:
  return <hello toWhat="World" />;
}
```

Bunu düzeltmek için, `hello` fonksiyonunu `Hello` olarak yeniden adlandırıp `<Hello />` olarak kullanacağız:

```js{3,4,10,11}
import React from 'react';

// Doğru! Bu bir bileşendir ve adı büyük harfle başlamalıdır:
function Hello(props) {
  // Doğru! div geçerli bir HTML etiketi olduğundan <div> 'in bu kullanımı uygundur:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Doğru! React, <Hello /> büyük bir harfle başladığı için bir bileşen olduğunu biliyor.
  return <Hello toWhat="World" />;
}
```

### Türü Çalışma Zamanında Seçme {#choosing-the-type-at-runtime}

Genel bir ifadeyi (expression) React elemanı türü olarak kullanamazsınız. Elemanın türünü belirtmek için genel bir ifade kullanmak istiyorsanız, sadece öncesinde büyük harfle başlayan bir değişkene atayın. Bu genellikle, bir prop'a göre farklı bir bileşen render etmek istediğinizde ortaya çıkar:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Yanlış! JSX türü bir ifade olamaz.
  return <components[props.storyType] story={props.story} />;
}
```

Bunu düzeltmek için, önce türü büyük harfle başlayan bir değişkene atayacağız:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Doğru! JSX türü büyük harfli bir değişken olabilir.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Props in JSX {#props-in-jsx}

There are several different ways to specify props in JSX.

### JavaScript Expressions as Props {#javascript-expressions-as-props}

You can pass any JavaScript expression as a prop, by surrounding it with `{}`. For example, in this JSX:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

For `MyComponent`, the value of `props.foo` will be `10` because the expression `1 + 2 + 3 + 4` gets evaluated.

`if` statements and `for` loops are not expressions in JavaScript, so they can't be used in JSX directly. Instead, you can put these in the surrounding code. For example:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

You can learn more about [conditional rendering](/docs/conditional-rendering.html) and [loops](/docs/lists-and-keys.html) in the corresponding sections.

### String Literals {#string-literals}

You can pass a string literal as a prop. These two JSX expressions are equivalent:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

When you pass a string literal, its value is HTML-unescaped. So these two JSX expressions are equivalent:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

This behavior is usually not relevant. It's only mentioned here for completeness.

### Props Default to "True" {#props-default-to-true}

If you pass no value for a prop, it defaults to `true`. These two JSX expressions are equivalent:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

In general, we don't recommend *not* passing a value for a prop, because it can be confused with the [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` which is short for `{foo: foo}` rather than `{foo: true}`. This behavior is just there so that it matches the behavior of HTML.

### Spread Attributes {#spread-attributes}

If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" operator to pass the whole props object. These two components are equivalent:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

You can also pick specific props that your component will consume while passing all other props using the spread operator.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

In the example above, the `kind` prop is safely consumed and *is not* passed on to the `<button>` element in the DOM.
All other props are passed via the `...other` object making this component really flexible. You can see that it passes an `onClick` and `children` props.

Spread attributes can be useful but they also make it easy to pass unnecessary props to components that don't care about them or to pass invalid HTML attributes to the DOM. We recommend using this syntax sparingly.  

## Children in JSX {#children-in-jsx}

In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`. There are several different ways to pass children:

### String Literals {#string-literals-1}

You can put a string between the opening and closing tags and `props.children` will just be that string. This is useful for many of the built-in HTML elements. For example:

```js
<MyComponent>Hello world!</MyComponent>
```

This is valid JSX, and `props.children` in `MyComponent` will simply be the string `"Hello world!"`. HTML is unescaped, so you can generally write JSX just like you would write HTML in this way:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space. So these all render to the same thing:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children {#jsx-children}

You can provide more JSX elements as the children. This is useful for displaying nested components:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

You can mix together different types of children, so you can use string literals together with JSX children. This is another way in which JSX is like HTML, so that this is both valid JSX and valid HTML:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

A React component can also return an array of elements:

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript Expressions as Children {#javascript-expressions-as-children}

You can pass any JavaScript expression as children, by enclosing it within `{}`. For example, these expressions are equivalent:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

This is often useful for rendering a list of JSX expressions of arbitrary length. For example, this renders an HTML list:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript expressions can be mixed with other types of children. This is often useful in lieu of string templates:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Functions as Children {#functions-as-children}

Normally, JavaScript expressions inserted in JSX will evaluate to a string, a React element, or a list of those things. However, `props.children` works just like any other prop in that it can pass any sort of data, not just the sorts that React knows how to render. For example, if you have a custom component, you could have it take a callback as `props.children`:

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Children passed to a custom component can be anything, as long as that component transforms them into something React can understand before rendering. This usage is not common, but it works if you want to stretch what JSX is capable of.

### Booleans, Null, and Undefined Are Ignored {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, and `true` are valid children. They simply don't render. These JSX expressions will all render to the same thing:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

This can be useful to conditionally render React elements. This JSX renders the `<Header />` component only if `showHeader` is `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

One caveat is that some ["falsy" values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), such as the `0` number, are still rendered by React. For example, this code will not behave as you might expect because `0` will be printed when `props.messages` is an empty array:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

To fix this, make sure that the expression before `&&` is always boolean:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Conversely, if you want a value like `false`, `true`, `null`, or `undefined` to appear in the output, you have to [convert it to a string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) first:

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
