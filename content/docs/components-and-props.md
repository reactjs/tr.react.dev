---
id: components-and-props
title: Bileşenler ve Prop'lar
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Bileşenler, kullanıcı arayüzünü ayrıştırarak birbirinden bağımsız ve tekrar kullanılabilen parçalar oluşturmanızı sağlar. Bu sayede her bir parçayı, birbirinden izole bir şekilde düşünerek kodlayabilirsiniz.

Bu sayfa, bileşenlerin ne olduğuna dair bir fikir edinmenizi sağlayacaktır. [Bileşenler API dokümanını](/docs/react-component.html) inceleyerek daha detaylı bilgi edinebilirsiniz.

Kavramsal olarak bileşenler, JavaScript fonksiyonları gibidir. Bileşenler, "props" adındaki girdileri opsiyonel olarak alırlar ve ekranda görüntülenecek React elementlerini geri döndürürler.

## Fonksiyon ve Sınıf Bileşenleri {#function-and-class-components}

Bir bileşen oluşturmak için en basit yol, bir JavaScript fonksiyonu yazmaktır:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Bu fonksiyon, girdi olarak "props" (properties) adındaki tek bir nesneyi aldığı ve geriye bir React elementi döndürdüğü için geçerli bir React bileşenidir. Bu tarz bileşenler, gerçekten de birer JavaScript fonksiyonları oldukları için adına "fonksiyonel bileşenler" denir.

Fonksiyon yerine, bir [ES6 sınıfı](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) kullanarak da React bileşeni oluşturabilirsiniz:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Üstteki her iki bileşen de React'in bakış açısından birbirine eşittirler.

Sınıf ve fonksiyon bileşenlerinin her birisi bazı ek özelliklere sahiptirler. Buna [sonraki bölümlerde](/docs/state-and-lifecycle.html) değineceğiz.

## Bir Bileşenin Render Edilmesi {#rendering-a-component}

Önceki bölümlerde, React elementi olarak sadece DOM elementlerini ele almıştık.

```js
const element = <div />;
```

Ancak elementler, kullanıcı tanımlı bileşenler de olabilirler:

```js
const element = <Welcome name="Sara" />;
```

React, kullanıcı tanımlı bir bileşeni gördüğü zaman, JSX özelliklerini ve alt elemanlarını bu bileşene tek bir nesne olarak aktarır. Bu nesneye "props" adı verilir.

Örneğin aşağıdaki kod, sayfada "Hello, Sara" mesajını görüntüler:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

<<<<<<< HEAD
[Codepen'de Deneyin](codepen://components-and-props/rendering-a-component)
=======
**[Try it on CodePen](https://codepen.io/gaearon/pen/YGYmEG?editors=1010)**
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Bu örnekte, hangi olayların gerçekleştiğine bir bakalım:

1. `<Welcome name="Sara" />` elementi ile birlikte `ReactDOM.render()` fonksiyonunu çağırıyoruz.
2. Devamında React, `{name: 'Sara'}` prop'u ile `Welcome` bileşenini çağırıyor.
3. `Welcome` bileşenimiz, sonuç olarak geriye bir `<h1>Hello, Sara</h1>` elementi döndürüyor.
4. React DOM, `<h1>Hello, Sara</h1>` ile eşleşmek için, DOM'ı arka planda efektif bir şekilde güncelliyor.

>**Not:** Bileşen isimlendirmelerinde daima büyük harfle başlayınız.
>
>Çünkü React, küçük harfle başlayan bileşenlere DOM etiketleri gibi davranır. Örneğin `<div />`, bir HTML div etiketini temsil eder, fakat `<Welcome />` ise bir bileşeni temsil eder ve kodun etki alanında `Welcome`'ın tanımlı olmasını gerektirir.
>
>Bu isimlendirmenin nedeni hakkında detaylı bilgi edinmek için lütfen [Derinlemesine JSX](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized) sayfasına bakınız.

## Bileşenlerden Kompozisyon Oluşturulması {#composing-components}

Bileşenler, çıktılarında diğer bileşenleri gösterebilir. Bu sayede soyutlanan bir bileşen, herhangi bir ayrıntı düzeyinde tekrar kullanılabilir. Butonlar, formlar, diyaloglar, ekranlar ve daha nicesi React uygulamalarında yaygın bir şekilde bileşen olarak ifade edilebilirler.

Örneğin, `Welcome`'ı istediğimiz kadar görüntüleyecek bir `App` bileşeni oluşturabiliriz:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

<<<<<<< HEAD
[Codepen'de Deneyin](codepen://components-and-props/composing-components)
=======
**[Try it on CodePen](https://codepen.io/gaearon/pen/KgQKPr?editors=1010)**
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Genellikle, yeni React uygulamaları, en üstte bir tane `App` bileşeni içerirler. Ancak React'i mevcut uygulamanıza entegre ediyorsanız, `Button` gibi en küçük bileşenlerden başlayacak şekilde, basitten karmaşığa doğru ilerleyerek bileşen hiyerarşisini oluşturabilirsiniz.

## Bileşenlerin Çıkarılması {#extracting-components}

Büyük bileşenleri, sade ve yönetilebilir olması adına daha küçük bileşenlere bölebilirsiniz.

Örneğin aşağıdaki `Comment` bileşenini ele alalım:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

<<<<<<< HEAD
[Codepen'de Deneyin](codepen://components-and-props/extracting-components)
=======
**[Try it on CodePen](https://codepen.io/gaearon/pen/VKQwEo?editors=1010)**
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Üstteki bileşen; `author` nesnesini, `text` metnini ve bir `date` tarihini prop olarak alır. Bu bileşen, bir sosyal medya sitesinde yorum kutucuğunun görüntülenmesini sağlar.

İç içe halde bulunan bu bileşenin üzerinde değişiklik yapmak zor olabilir. Ayrıca bünyesindeki DOM elementlerinin de tekrar kullanılabilirliği oldukça düşük seviyededir. Bu durumu çözmek için, kod içerisinden birkaç bileşen çıkarabiliriz.

Öncelikle `Avatar` bileşenini çıkaralım:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

`Avatar` bileşeninin, bir `Comment` bileşeni içerisinde render edildiğini bilmesi gerekli değildir. Bu nedenle `Avatar` bileşenini, gelecekte uygulamanın daha farklı yerlerinde de kullanma ihtimalimiz bulunduğundan dolayı, prop değişkenleri için `author` yerine `user` gibi daha genel bir isim verebiliriz.

Prop'lar isimlendirilirken, ilgili bileşenin hangi bileşen içerisinde kullanıldığını ele almak yerine, bileşeni bağımsız olarak ele almanız gerekmektedir.

Yaptığımız değişiklikle `Comment` bileşenini az bir miktar basitleştirmiş olduk:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Şimdi `Avatar` ile birlikte, kullanıcı adını da render edecek olan `UserInfo` bileşenini kod içerisinden çıkarabiliriz.

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Bu sayede `Comment` bileşeni daha da basitleşmiş hale geldi:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

<<<<<<< HEAD
[Codepen'de Deneyin](codepen://components-and-props/extracting-components-continued)
=======
**[Try it on CodePen](https://codepen.io/gaearon/pen/rrJNJY?editors=1010)**
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

Bileşenlerin çıkarılması en başta angarya bir işlem gibi görünebilir. Fakat büyük çaplı uygulamalarda, tekrar kullanılabilir bileşenler içeren bir **bileşen paletine** sahip olmak oldukça faydalı hale gelecektir. Bileşen çıkarmanın genel mantığı aşağıdaki gibidir:
* Eğer kullanıcı arayüzündeki bir eleman (`Button`, `Panel`, `Avatar`) uygulama içerisinde birçok defa kullanılıyorsa,
* Eğer bir bileşen (`App`, `FeedStory`, `Comment`) oldukça karmaşık hale geldiyse,

Bu bileşen, içerisinden bileşenler çıkarmak için iyi bir adaydır diyebiliriz.

## Prop'lar Salt Okunurdur {#props-are-read-only}

[Fonksiyon veya sınıf](#function-and-class-components) bileşeninden herhangi birini oluşturduğunuzda, bu bileşen kendi prop'larını asla değiştirmemelidir. Örneğin aşağıdaki `sum` fonksiyonunu ele alalım:

```js
function sum(a, b) {
  return a + b;
}
```

Bu tarz fonksiyonlar, kendi girdi parametrelerini değiştirmedikleri ve her zaman aynı parametreler için aynı sonucu ürettiklerinden dolayı ["pure"](https://en.wikipedia.org/wiki/Pure_function) (saf) fonksiyonlardır.

Tam ters örnek verecek olursak, aşağıdaki fonksiyon impure'dür (saf değildir). Çünkü kendi girdi değerini değiştirmektedir:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React, kod yazımında oldukça esnek olmasına rağmen, sadece bir tek kuralı şart koşmaktadır:

**Bütün React bileşenleri yalın (`pure`) fonksiyonlar gibi davranmalı ve prop'larını asla değiştirmemelidirler.**

Tabii ki kullanıcı arayüzleri dinamiktir ve zaman içerisinde değişiklik gösterir. [Sonraki bölümde](/docs/state-and-lifecycle.html), "state" (durum) adındaki yeni konsepte değineceğiz. State bu kurala sadık kalarak; kullanıcı etkileşimleri, ağ istekleri ve diğer şeylerden dolayı zaman içerisinde değişen arayüzün görüntülenmesi için, React bileşenlerinin kendi çıktılarını değiştirebilmesine izin verir.
