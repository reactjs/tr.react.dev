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

Kök DOM düğümü içerisinde bir React elementini render etmek istiyorsanız, bu iki parametreyi de [`ReactDOM.render()`](/docs/react-dom.html#render) metoduna geçirmeniz gereklidir:

`embed:rendering-elements/render-an-element.js`

[Codepen'de Deneyin](codepen://rendering-elements/render-an-element)

Sayfada "Hello, world" mesajı görüntülenecektir.

## Render Edilmiş Elementin Güncellenmesi {#updating-the-rendered-element}

React elementleri [immutable](https://en.wikipedia.org/wiki/Immutable_object)'dır. Yani bir kez React elementi oluşturduktan sonra, o elementin alt elemanlarını veya özelliklerini değiştiremezsiniz. Bu nedenle element, bütün bir videonun tek bir karesi gibidir: arayüzün belirli bir andaki görüntüsünü temsil eder.

Bu zamana kadar edindiğimiz bilgiler ışığında, kullanıcı arayüzünün güncellenmesi için tek yolun, yeni bir element oluşturup, [`ReactDOM.render()`](/docs/react-dom.html#render) metoduna aktarmak olduğunu biliyoruz.

Aşağıdaki saat örneğini ele alalım:

`embed:rendering-elements/update-rendered-element.js`

[Codepen'de Deneyin](codepen://rendering-elements/update-rendered-element)

[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) metodu ile her saniye bitiminde [`ReactDOM.render()`](/docs/react-dom.html#render) metodu çağrılıyor.

>**Not:**
>
>Genelde birçok React uygulamasında [`ReactDOM.render()`](/docs/react-dom.html#render) yalnızca bir kez çağrılır. Sonraki bölümlerde bu tarz kodların nasıl [state'li bileşenlere](/docs/state-and-lifecycle.html) dönüştürüleceğine değineceğiz.
>
>Her bir konu diğeri için zemin hazırladığından dolayı, bu konuları atlamamanızı öneririz.

## React Yalnızca Gerekli Kısımları Günceller {#react-only-updates-whats-necessary}

React DOM, ilgili elementi ve elementin alt elemanlarını, bir önceki versiyonlarıyla karşılaştırır. Farkları tespit ettikten sonra yalnızca gerekli olan kısımlarda DOM güncellemesi yapar. Bu sayede DOM, istenen duruma getirilmiş olur.

Tarayıcı araçlarını kullanarak [son örneği](codepen://rendering-elements/update-rendered-element) incelediğinizde de bu durumu görebilirsiniz:

![DOM inceleyicisi küçük güncellemeleri gösteriyor](../images/docs/granular-dom-updates.gif)

Bütün UI ağacını her saniye bir görüntüleyen bir element oluşturmamıza rağmen, React DOM tarafından **yalnızca içeriği değişen** metin düğümü güncellenir.

Deneyimlerimizden yola çıkarsak, kullanıcı arayüzünün zaman içerisinde nasıl değiştirileceğinden ziyade herhangi bir anda nasıl görünmesi gerektiğini düşünmek birçok hatanın oluşmasını engellemektedir.
