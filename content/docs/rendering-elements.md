---
id: rendering-elements
title: Elementlerin Render Edilmesi
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Elementler, React uygulamalarının en küçük yapı birimidir. 

Bir element, ekranda neyi görmek istiyorsanız onu tasvir eder:

```js
const element = <h1>Hello, world</h1>;
```

Tarayıcının DOM elementlerinin aksine, React elementleri daha sade nesnelerdir ve oluşturulmaları daha kolaydır. Çünkü React DOM, elementler ile eşleşmek için DOM'ın güncellenmesi işini kendisi halleder.

>**Not:**
>
>"Bileşen" (component) konsepti daha yaygın olarak bilindiği için, anlam bakımından elementler ile karıştırılabilir. [Sonraki bölümde](/docs/components-and-props.html) React bileşenlerine de değineceğiz. Fakat elementler, React bileşenlerinin en küçük yapıtaşlarıdır. Bu nedenle sonraki bölüme atlamadan önce bu bölümü okumanızı tavsiye ederiz.

## Bir Elementin DOM'a Render Edilmesi {#rendering-an-element-into-the-dom}

HTML dosyanızın herhangi bir yerinde `<div>` olduğunu düşünelim:

```html
<div id="root"></div>
```

Buna "root" (kök) düğüm denir. Çünkü içerisindeki her şey React DOM tarafından yönetilir.

Genellikle React ile yazılan uygulamalar, sadece bir adet kök DOM düğümü içerirler. Eğer React'i mevcut uygulamanıza entegre ediyorsanız, birbirinden izole olacak şekilde dilediğiniz kadar kök DOM düğümüne sahip olabilirsiniz.

<<<<<<< HEAD
Kök DOM düğümü içerisinde bir React elementini render etmek istiyorsanız, bu iki parametreyi de `ReactDOM.render()` metoduna geçirmeniz gereklidir:
=======
To render a React element into a root DOM node, pass both to [`ReactDOM.render()`](/docs/react-dom.html#render):
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

Sayfada "Hello, world" mesajı görüntülenecektir. 

## Render Edilmiş Elementin Güncellenmesi {#updating-the-rendered-element}

React elementleri [immutable](https://en.wikipedia.org/wiki/Immutable_object)'dır. Yani bir kez React elementi oluşturduktan sonra, o elementin alt elemanlarını veya özelliklerini değiştiremezsiniz. Bu nedenle element, bütün bir videonun tek bir karesi gibidir: arayüzün belirli bir andaki görüntüsünü temsil eder.

<<<<<<< HEAD
Bu zamana kadar edindiğimiz bilgiler ışığında, kullanıcı arayüzünün güncellenmesi için tek yolun, yeni bir element oluşturup, `ReactDOM.render()` metoduna aktarmak olduğunu biliyoruz. 
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to [`ReactDOM.render()`](/docs/react-dom.html#render).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

Aşağıdaki saat örneğini ele alalım:

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

<<<<<<< HEAD
[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) metodu ile her saniye bitiminde `ReactDOM.render()` metodu çağrılıyor.
=======
It calls [`ReactDOM.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

>**Not:**
>
<<<<<<< HEAD
>Genelde birçok React uygulamasında `ReactDOM.render()` yalnızca bir kez çağrılır. Sonraki bölümlerde bu tarz kodların nasıl [state'li bileşenlere](/docs/state-and-lifecycle.html) dönüştürüleceğine değineceğiz.
=======
>In practice, most React apps only call [`ReactDOM.render()`](/docs/react-dom.html#render) once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
>
>Her bir konu diğeri için zemin hazırladığından dolayı, bu konuları atlamamanızı öneririz. 

## React Yalnızca Gerekli Kısımları Günceller {#react-only-updates-whats-necessary}

React DOM, ilgili elementi ve elementin alt elemanlarını, bir önceki versiyonlarıyla karşılaştırır. Farkları tespit ettikten sonra yalnızca gerekli olan kısımlarda DOM güncellemesi yapar. Bu sayede DOM, istenen duruma getirilmiş olur.

Tarayıcı araçlarını kullanarak [son örneği](codepen://rendering-elements/update-rendered-element) incelediğinizde de bu durumu görebilirsiniz:

![DOM inceleyicisi küçük güncellemeleri gösteriyor](../images/docs/granular-dom-updates.gif)

Bütün UI ağacını her saniye bir görüntüleyen bir element oluşturmamıza rağmen, React DOM tarafından **yalnızca içeriği değişen** metin düğümü güncellenir.

<<<<<<< HEAD
Deneyimlerimizden yola çıkarsak, kullanıcı arayüzünün zaman içerisinde nasıl değiştirileceğinden ziyade herhangi bir anda nasıl görünmesi gerektiğini düşünmek birçok hatanın oluşmasını engellemektedir.
=======
In our experience, thinking about how the UI should look at any given moment, rather than how to change it over time, eliminates a whole class of bugs.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
