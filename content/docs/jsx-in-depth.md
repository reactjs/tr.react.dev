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

## React Elemanı Tipini Belirtme {#specifying-the-react-element-type}

JSX etiketinin ilk kısmı, React elemanının tipini belirtir.

Büyük harfle başlayan tipler, JSX etiketinin bir React bileşenine başvurduğunu belirtir. Bu etiketler, isimlendirilmiş değişkene doğrudan bir referans olarak derlenir, yani JSX `<Foo />` ifadesini kullanırsanız, `Foo` kapsam dahilinde olmalıdır.

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

### JSX Tipi için Nokta Gösterimini Kullanma {#using-dot-notation-for-jsx-type}

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

Bir elemanın tipi küçük harfle başladığında, `<div>` veya `<span>` gibi dahili bir bileşene atıfta bulunur ve bunun sonucu `React.createElement` fonksiyonuna `'div'` veya `'span'` stringlerinin aktarılmasıdır. `<Foo />` gibi büyük harfle başlayan tipler `React.createElement(Foo)` şeklinde derlenir ve JavaScript dosyanızda tanımlanan veya içe aktarılan bir bileşene karşılık gelir.

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

### Tipi Çalışma Zamanında Seçme {#choosing-the-type-at-runtime}

Genel bir ifadeyi (expression) React elemanı tipi olarak kullanamazsınız. Elemanın tipini belirtmek için genel bir ifade kullanmak istiyorsanız, sadece öncesinde büyük harfle başlayan bir değişkene atayın. Bu genellikle, bir prop'a göre farklı bir bileşen render etmek istediğinizde ortaya çıkar:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Yanlış! JSX tipi bir ifade olamaz.
  return <components[props.storyType] story={props.story} />;
}
```

Bunu düzeltmek için, önce tipi büyük harfle başlayan bir değişkene atayacağız:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Doğru! JSX tipi büyük harfli bir değişken olabilir.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX'de Prop'lar {#props-in-jsx}

JSX'te prop'ları belirtmenin birkaç farklı yolu vardır.

### Prop Olarak JavaScript İfadeleri {#javascript-expressions-as-props}

Herhangi bir JavaScript ifadesini `{}` ile çevreleyerek bir prop olarak iletebilirsiniz. Örneğin, bu JSX'te:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

`MyComponent` için, `props.foo` değeri `10` olacaktır çünkü `1 + 2 + 3 + 4` ifadesi çalıştırılır.

`if` deyimleri ve` for` döngüleri JavaScript'te ifade değildir, bu nedenle doğrudan JSX'te kullanılamazlar. Onun yerine, bunları çevreleyen bir koda koyabilirsiniz. Örneğin:

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

İlgili bölümlerde [koşullu render etme](/docs/conditional-rendering.html) ve [döngüler](/docs/lists-and-keys.html) hakkında daha fazla bilgi edinebilirsiniz.

### String Değişmezleri {#string-literals}

Bir string değişmezini prop olarak geçirebilirsiniz. Bu iki JSX ifadesi eşdeğerdir:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Bir string değişmezini ilettiğinizde, değeri HTML'den kaçmaz. Yani bu iki JSX ifadesi eşdeğerdir:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Bu davranış genellikle alakasızdır. Burada sadece bütünlük için bahsedilmiştir.

### Prop'ların Varsayılan Değeri "True" {#props-default-to-true}

Eğer bir prop için herhangi bir değer iletmezseniz, değeri varsayılan olarak `true` olur. Bu iki JSX ifadesi eşdeğerdir:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

Genel olarak, bir prop için değer *iletmemenizi* önermiyoruz, çünkü `{foo: true}` yerine `{foo: foo}` için [ES6 obje kısayolu](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) olan `{foo}` ile karıştırılabilir. Bu davranış sadece, HTML davranışıyla eşleşmesi için oradadır.

### Özelliklerin Yayılması {#spread-attributes}

Zaten nesne olarak bir `prop'lar` objeniz varsa ve bunu JSX'e aktarmak istiyorsanız, tüm prop'ları geçrmek için "yayma" (spread) operatörü olan `...` 'yı kullanabilirsiniz. Bu iki bileşen eşdeğerdir:

```js{7}
function App1() {
  return <Greeting firstName="Yunus Emre" lastName="Dilber" />;
}

function App2() {
  const props = {firstName: 'Yunus Emre', lastName: 'Dilber'};
  return <Greeting {...props} />;
}
```

Ayrıca, yayılma operatörünü kullanarak diğer tüm prop'ları geçerken, bileşeninizin kullanacağı özel prop'ları de seçebilirsiniz.

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

Yukarıdaki örnekte, `kind` prop'u güvenli bir şekilde kullanılır ve DOM'daki `<button>` elemanına *geçirilmez*.
Diğer tüm prop'lar bu bileşeni esnek yapan `...other` nesnesi üzerinden geçirilir. `onClick` ve `children` prop'larının geçirildiğini görebilirsiniz.

Özelliklerin yayılması yararlı olabilir ancak bunlar, onları umursamayan bileşenlere gereksiz prop'ların aktarılmasını veya geçersiz HTML özelliklerinin DOM'a aktarılmasını kolaylaştırır. Bu sözdizimini tedbirli kullanmanızı öneririz.

## JSX'de Alt Elemanlar {#children-in-jsx}

Hem açılış hem de kapanış etiketi içeren JSX ifadelerinde, bu etiketler arasındaki içerik özel bir prop olarak geçirilir: `props.children`. Alt elemanları geçmenin birkaç farklı yolu vardır:

### String Değişmezleri {#string-literals-1}

Açılış ve kapanış etiketleri arasına bir string koyabilirsiniz ve `props.children` sadece bu string olacaktır. Bu, çoğu dahili HTML elemanı için kullanışlıdır. Örneğin:

```js
<MyComponent>Hello world!</MyComponent>
```

Bu geçerli bir JSX ve `MyComponent` içindeki `props.children` sadece `"Hello world!"` stringi olacaktır. HTML'den kaçılmadığı için, genellikle tıpkı HTML yazdığınız gibi JSX'i bu şekilde yazabilirsiniz:

```html
<div>Bu geçerli bir HTML &amp; Aynı zamanda JSX.</div>
```

JSX, bir satırın başındaki ve sonundaki boşlukları kaldırır. Ayrıca boş satırları da kaldırır. Etiketlere bitişik yeni satırlar kaldırılır; string değişmezlerinin ortasında oluşan yeni satırlar tek bir boşluğa dönüştürülür. Yani bunların hepsi aynı şeye render ediliyor:

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

### JSX Alt Elemanları {#jsx-children}

Alt eleman olarak daha fazla JSX elemanı sağlayabilirsiniz. Bu, iç içe geçmiş bileşenleri görüntülemek için kullanışlıdır:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Farklı tiplerdeki alt elemanları birlikte kullanabilirsiniz, böylece string değişmezlerini JSX alt elemanlarıyla birlikte kullanabilirsiniz. Bu, JSX'in HTML'e benzemesinin başka bir yoludur; böylece bu, hem geçerli bir JSX hem de geçerli bir HTML'dir:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

React bileşeni ayrıca bir dizi eleman döndürebilir:

```js
render() {
  // Liste öğelerini ekstra bir elemanla sarmanıza gerek yok!
  return [
    // Key'leri unutmayın :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### Alt Eleman Olarak JavaScript İfadeleri {#javascript-expressions-as-children}

Herhangi bir JavaScript ifadesini `{}` içine koyarak alt eleman olarak iletebilirsiniz. Örneğin, bu ifadeler eşdeğerdir:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Bu genellikle, keyfi uzunluktaki JSX ifadelerinin bir listesini render etmek için kullanışlıdır. Örneğin, bu bir HTML listesi render eder:

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

JavaScript ifadeleri diğer alt eleman tipleri ile birlikte kullanılabilir. Bu genellikle string şablonları yerine kullanışlıdır:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Alt Eleman Olarak Fonksiyonlar {#functions-as-children}

Normalde, JSX'e eklenen JavaScript ifadeleri bir string, bir React elemanı veya bu şeylerin bir listesi olarak değerlendirilir. Bununla birlikte, `props.children`, sadece React'ın nasıl render edeceğini bildiği türler değil, her türde veriyi aktarabilmesi için herhangi bir prop gibi çalışır. Örneğin, özel bir bileşeniniz varsa, bunun `props.children` olarak bir callback almasını sağlayabilirsiniz:

```js{4,13}
// Tekrarlanan bir bileşen üretmek için alt eleman callback'ini numTimes kez çağırır
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

Özel bir bileşene geçirilen alt elemanlar, bu bileşen onları React'ın render etmeden önce anlayabileceği bir şeye dönüştürdüğü sürece herhangi bir şey olabilir. Bu kullanım yaygın değildir, ancak JSX'in neler yapabileceğini açmak istiyorsanız çalışacaktır.

### Boolean'lar, Null ve Undefined Görmezden Gelinir {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined` ve `true` geçerli alt elemanlardır. Sadece, render edilmezler. Bu JSX ifadelerinin tümü aynı şeye render edilir:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Bu, React elemanlarının koşullu olarak render etmek için yararlı olabilir. Bu JSX, `<Header />` bileşenini yalnızca `showHeader` `true` olduğunda render eder:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Bir uyarı, `0` sayısı gibi bazı [“falsy” değerlerin](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) hala React tarafından görüntülenmesidir. Örneğin, bu kod beklediğiniz gibi davranmayacaktır çünkü `props.messages` boş bir dizi olduğunda `0` yazdırılacaktır:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Bunu düzeltmek için, `&&` öncesindeki ifadenin her zaman boolean olduğundan emin olun:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Aksine, çıktıda `false`, `true`, `null` veya `undefined` gibi bir değerin görünmesini istiyorsanız, önce [bir stringe dönüştürmeniz](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) gerekir:

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
