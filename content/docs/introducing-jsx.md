---
id: introducing-jsx
title: JSX'e Giriş
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Aşağıdaki değişken tanımını ele alalım:

```js
const element = <h1>Hello, world!</h1>;
```

Burada acayip bir şekilde yazılan söz dizimi ne bir string ne de HTML'e aittir.

Bu söz dizimi JSX olarak adlandırılır ve JavaScript'in bir uzantısıdır. Arayüzün nasıl görünmesi gerektiğini tanımlamak için, JSX'i React ile birlikte kullanmanızı tavsiye ederiz. JSX size bir şablon dili gibi görünebilir fakat JavaScript'i tüm gücüyle kullanmanızı sağlayacak yeteneklerle donatılmıştır.

JSX, React elementleri oluşturmanızı sağlar. [Sonraki bölümde](/docs/rendering-elements.html)) bu elementlerin nasıl DOM'a render edileceğine değineceğiz. Aşağıdaki bölümlerde, JSX'e başlangıç yapabilmeniz için gerekli bilgiler mevcuttur.

### Neden JSX? {#why-jsx}

React, render edilecek kısımların yer aldığı kodlar ile diğer arayüz kodlarının birbirinden ayrılmasını teşvik eder. Diğer arayüz kodlarına örnek verecek olursak: `onClick` gibi olayların nasıl işleneceği, state'in zaman içerisinde nasıl değiştirileceği ve gösterim için verilerin nasıl hazırlanacağıdır.

HTML ve JavaScript kodlarının ayrı dosyalarda tutularak *teknolojilerin* birbirinden yapay bir şekilde ayrılması yerine, React hem HTML hem de JavaScript kodu barındıran ve birbirine gevşek bir şekilde bağlı olan bileşenler (components) sayesinde ilgili [*işlerin* ayrılmasını](https://en.wikipedia.org/wiki/Separation_of_concerns) sağlar. [İlerleyen bölümlerde](/docs/components-and-props.html) bileşenlere tekrar değineceğiz. Fakat hala HTML kodlarının JavaScript içerisine konması sizi rahatsız ediyorsa [bu video](https://www.youtube.com/watch?v=x7cQ3mrcKaY) sizi ikna edecektir.

React, JSX kullanımını [zorunlu tutmaz](/docs/react-without-jsx.html). Fakat birçok geliştirici, JavaScript kodu içerisinde arayüz ile ilgili çalışırken JSX'in kullanılmasının, görsel anlamda yardımcı olduğunu düşünüyor. Ayrıca JSX, React için daha anlaşılır hata ve uyarı mesajlarının görüntülenmesini sağlıyor.

Bu kısımda anlaştıysak, artık JSX ile React kullanımına geçebiliriz.

### JSX İçerisinde JavaScript Kodlarının Kullanımı {#embedding-expressions-in-jsx}

Aşağıdaki örnekte ilk satırda `name` değişkenini tanımlıyoruz. Ardından süslü parantezler ile çevreleyerek JSX kodu içerisinde kullanıyoruz:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

JSX içerisinde süslü parantezler arasına herhangi bir [JavaScript ifadesini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) yazabilirsiniz. Örneğin, `2 + 2`, `user.firstName`, veya `formatName(user)` gibi JavaScript ifadelerini kullanabilirsiniz.

Aşağıdaki örnekte, bir JavaScript fonksiyonun çağrısının sonucu JSX içerisine gömülmektedir. Yani `formatName(user)`, `<h1>` elemanının içerisine konulmaktadır.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

Okunabilirliği arttırmak için JSX kodunu birkaç satır halinde yazdık. Buradaki gibi, JSX kodunu birçok satır halinde yazarken, kodu parantezler ile sarmalamanızı öneririz. Çünkü bu sayede [otomatik olarak noktalı virgül eklenmesi](https://stackoverflow.com/q/2846283) ile oluşan hatanın önüne geçebilirsiniz. 

### JSX is an Expression Too {#jsx-is-an-expression-too}

After compilation, JSX expressions become regular JavaScript function calls and evaluate to JavaScript objects.

This means that you can use JSX inside of `if` statements and `for` loops, assign it to variables, accept it as arguments, and return it from functions:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Specifying Attributes with JSX {#specifying-attributes-with-jsx}

You may use quotes to specify string literals as attributes:

```js
const element = <div tabIndex="0"></div>;
```

You may also use curly braces to embed a JavaScript expression in an attribute:

```js
const element = <img src={user.avatarUrl}></img>;
```

Don't put quotes around curly braces when embedding a JavaScript expression in an attribute. You should either use quotes (for string values) or curly braces (for expressions), but not both in the same attribute.

>**Warning:**
>
>Since JSX is closer to JavaScript than to HTML, React DOM uses `camelCase` property naming convention instead of HTML attribute names.
>
>For example, `class` becomes [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) in JSX, and `tabindex` becomes [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Specifying Children with JSX {#specifying-children-with-jsx}

If a tag is empty, you may close it immediately with `/>`, like XML:

```js
const element = <img src={user.avatarUrl} />;
```

JSX tags may contain children:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX Prevents Injection Attacks {#jsx-prevents-injection-attacks}

It is safe to embed user input in JSX:

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM [escapes](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

### JSX Represents Objects {#jsx-represents-objects}

Babel compiles JSX down to `React.createElement()` calls.

These two examples are identical:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` performs a few checks to help you write bug-free code but essentially it creates an object like this:

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

These objects are called "React elements". You can think of them as descriptions of what you want to see on the screen. React reads these objects and uses them to construct the DOM and keep it up to date.

We will explore rendering React elements to the DOM in the next section.

>**Tip:**
>
>We recommend using the ["Babel" language definition](https://babeljs.io/docs/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted. This website uses the [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) color scheme which is compatible with it.
