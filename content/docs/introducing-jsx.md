---
id: introducing-jsx
title: JSX'e Giriş
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

<<<<<<< HEAD
Aşağıdaki değişken tanımını ele alalım:
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Writing Markup with JSX](https://beta.reactjs.org/learn/writing-markup-with-jsx)
> - [JavaScript in JSX with Curly Braces](https://beta.reactjs.org/learn/javascript-in-jsx-with-curly-braces)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Consider this variable declaration:
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

```js
const element = <h1>Hello, world!</h1>;
```

Burada acayip bir şekilde yazılan söz dizimi ne bir string ne de HTML'e aittir.

Bu söz dizimi JSX olarak adlandırılır ve JavaScript'in bir söz dizimi uzantısıdır. Arayüzün nasıl görünmesi gerektiğini tanımlamak için, React ile birlikte JSX'i kullanmanızı tavsiye ederiz. JSX, bu bağlamda size kullanıcı arayüzü oluşturmayı sağlayan bir şablon dili gibi görünebilir. Fakat JavaScript'i tüm gücüyle kullanmanızı sağlayacak yeteneklerle donatılmıştır.

JSX, React elementleri oluşturmanızı sağlar. [Sonraki bölümde](/docs/rendering-elements.html) bu elementlerin nasıl DOM'a render edileceğine değineceğiz. Aşağıdaki bölümlerde, JSX'e başlangıç yapabilmeniz için gerekli bilgiler mevcuttur.

### Neden JSX? {#why-jsx}

React, render edilecek kısımların yer aldığı kodlar ile diğer arayüz kodlarının birbirinden ayrılmasını teşvik eder. Diğer arayüz kodlarına örnek verecek olursak: `onClick` gibi olayların nasıl işleneceği, state'in zaman içerisinde nasıl değiştirileceği ve gösterim için verilerin nasıl hazırlanacağıdır.

HTML ve JavaScript kodlarının ayrı dosyalarda tutularak *teknolojilerin* birbirinden yapay bir şekilde ayrılması yerine React, hem HTML hem de JavaScript kodu barındıran ve birbirine gevşek bir şekilde bağlı olan bileşenler (components) sayesinde ilgili [*işlerin* ayrılmasını](https://en.wikipedia.org/wiki/Separation_of_concerns) sağlar. [İlerleyen bölümlerde](/docs/components-and-props.html) bileşenlere tekrar değineceğiz. Fakat hala HTML kodlarının JavaScript içerisine konulması sizi rahatsız ediyorsa [bu video](https://www.youtube.com/watch?v=x7cQ3mrcKaY) sizi ikna edecektir.

React, JSX kullanımını [zorunlu tutmaz](/docs/react-without-jsx.html). Fakat birçok geliştirici, JavaScript kodu içerisinde arayüz ile ilgili çalışırken JSX'in kullanılmasının, görsel anlamda yardımcı olduğunu düşünüyor. Ayrıca JSX, React için daha anlaşılır hata ve uyarı mesajlarının görüntülenmesini sağlıyor.

Bu kısımda anlaştıysak, artık JSX ile React kullanımına geçebiliriz.

### JSX İçerisinde JavaScript Kodlarının Kullanımı {#embedding-expressions-in-jsx}

Aşağıdaki örnekte ilk satırda `name` değişkenini tanımlıyoruz. Ardından bu değişkeni süslü parantezler ile sarmalayarak JSX kodu içerisinde kullanıyoruz:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;
```

JSX'te süslü parantezler arasına dilediğiniz herhangi bir [JavaScript ifadesini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) yazabilirsiniz. Örneğin, `2 + 2`, `user.firstName`, veya `formatName(user)` gibi JavaScript ifadelerini kullanabilirsiniz.

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
```

**[Codepen'de Deneyin](https://codepen.io/gaearon/pen/PGEjdG?editors=1010)**

Okunabilirliği arttırmak için JSX kodunu birkaç satır halinde yazdık. Buradaki gibi, JSX kodunu birçok satır halinde yazarken, kodu parantezler ile sarmalamanızı öneririz. Bu sayede [otomatik olarak noktalı virgül eklenmesi](https://stackoverflow.com/q/2846283) ile oluşan birçok hatanın önüne geçebilirsiniz. 

### JSX de bir JavaScript İfadesidir {#jsx-is-an-expression-too}

Oluşan derlemenin ardından JSX ifadeleri, sıradan JavaScript fonksiyon çağrılarına dönüşür ve bu fonksiyonlar JavaScript nesnelerini işleyecek şekilde çalışırlar.

Bu sayede `if` ifadelerini ve `for` döngülerini JSX içerisinde kullanabilir, değişkenlere atama yapabilir, fonksiyona parametre olarak geçebilir ve fonksiyondan geri döndürebilirsiniz:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX ile Özelliklerin Tanımlanması {#specifying-attributes-with-jsx}

Bir HTML elemanı için string ifadelerini çift tırnak içerisinde atayabilirsiniz:

```js
const element = <a href="https://www.reactjs.org"> link </a>;
```

Ayrıca bir JavaScript ifadesini, elemanın özelliği olarak tanımlamak için süslü parantezler ile sarmalayabilirsiniz:

```js
const element = <img src={user.avatarUrl}></img>;
```

Bir JavaScript ifadesini, herhangi bir özellik içerisine yazarken çift tırnak kullanmayınız. String için çift tırnak, JavaScript ifadeleri için süslü parantezler kullanmalısınız. Aynı özellik için hem çift tırnak hem de süslü parantez **kullanmayınız**.

>**Uyarı:**
>
>JSX ifadeleri, HTML'den ziyade JavaScript'e daha yakındırlar. Bu nedenle React DOM, özellik isimlendirme için HTML'deki gibi bir isimlendirme yerine `camelCase` isimlendirme standardını kullanmaktadır.
>
>Örneğin JSX içerisinde `class` özelliği [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className), ve `tabindex` özelliği de [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex) olarak yazılmalıdır.

### JSX ile Alt Elemanların Tanımlanması {#specifying-children-with-jsx}

Eğer bir HTML etiketinin içeriği boş ise, XML'deki gibi `/>` kullanarak etiketi kapatabilirsiniz:

```js
const element = <img src={user.avatarUrl} />;
```

JSX etiketleri alt elemanlar da içerebilir:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX, Injection Saldırılarını Engeller {#jsx-prevents-injection-attacks}

JSX'te kullanıcı girdisini koda direkt olarak gömmek güvenlidir:

```js
const title = response.potentiallyMaliciousInput;
// Bu kullanım güvenlidir:
const element = <h1>{title}</h1>;
```

Çünkü varsayılan olarak React DOM, render işlemi öncesinde gömülen değerlerdeki `<`, `&` gibi bazı özel karakterleri `&lt;` ve `&amp;` olacak şekilde [dönüştürür](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html). Böylece uygulama içerisinde, kullanıcının yazabileceği kötü amaçlı kodların enjekte edilmesi engellenmiş olur. Render işlemi öncesi her şey string ifadeye dönüştürüldüğünden dolayı, [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) saldırıları engellenmiş olur.

### JSX, JavaScript Nesnelerini Temsil Eder {#jsx-represents-objects}

Babel derleyicisi, JSX kodlarını `React.createElement()` çağrılarına dönüştürür.

Bu nedenle aşağıdaki iki kod örneği de aynı işlemi gerçekleştirir:

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

`React.createElement()` çağrısı, hatasız kod yazmanız için size yardımcı olacak birtakım kontrolleri gerçekleştirir. Aslında yaptığı şey, aşağıdaki gibi bir nesne oluşturmaktadır:

```js
// Not: bu yapı basitleştirilmiştir
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

Bu nesnelere "React elementleri" adı verilir. Bunu, ekranda görmek istediğiniz kullanıcı arayüzünün kodlar ile tasvir edilmesi gibi düşünebilirsiniz. React, bu nesneleri okuyarak DOM'ı oluşturur ve arayüzü günceller.

[Sonraki bölümde](/docs/rendering-elements.html), React elementlerinin DOM'a render edilmesi işlemini daha detaylı bir şekilde ele alacağız.

>**İpucu:**
>
>ES6 ve JSX kodlarının uygun şekilde renklendirilmesi için, kod editörünüzde ["Babel" dil tanımlamalarını](https://babeljs.io/docs/en/editors) kullanmanızı öneririz.
