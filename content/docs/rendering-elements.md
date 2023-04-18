---
id: rendering-elements
title: Elementlerin Render Edilmesi
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

<div class="scary">

>
> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
>
> These new documentation pages teach how to write JSX and show it on an HTML page:
>
> - [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
> - [Add React to an Existing Project](https://react.dev/learn/add-react-to-an-existing-project#step-2-render-react-components-anywhere-on-the-page)

</div>

Elementler, React uygulamalarının en küçük yapı birimidir.

Bir element, ekranda neyi görmek istiyorsanız onu tasvir eder:

```js
const element = <h1>Hello, world</h1>;
```

Tarayıcının DOM elementlerinin aksine, React elementleri daha sade nesnelerdir ve oluşturulmaları daha kolaydır; çünkü React DOM, elementler ile eşleşmek için DOM'ın güncellenmesi işini kendisi halleder.

>**Not:**
>
>"Bileşen" (component) konsepti daha yaygın olarak bilindiği için, anlam bakımından elementler ile karıştırılabilir. [Sonraki bölümde](/docs/components-and-props.html) React bileşenlerine de değineceğiz. Fakat elementler, React bileşenlerinin en küçük yapı taşlarıdır. Bu nedenle sonraki bölüme atlamadan önce bu bölümü okumanızı tavsiye ederiz.

## Bir Elementin DOM'a Render Edilmesi {#rendering-an-element-into-the-dom}

HTML dosyanızın herhangi bir yerinde `<div>` olduğunu düşünelim:

```html
<div id="root"></div>
```

Buna "root" (kök) düğüm denir; çünkü içerisindeki her şey React DOM tarafından yönetilir.

Genellikle React ile yazılan uygulamalar, sadece bir adet kök DOM düğümü içerirler. Eğer React'i mevcut uygulamanıza entegre ediyorsanız, birbirinden izole olacak şekilde dilediğiniz kadar kök DOM düğümüne sahip olabilirsiniz.

Bir React elementini render etmek istiyorsanız, öncelikle dom elemanı ile [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot) metodunu çağırın, ardından React elemanını, `root.render()` metoduna parametre olarak geçirmeniz gereklidir:

`embed:rendering-elements/render-an-element.js`

**[Codepen'de Deneyin](https://codepen.io/gaearon/pen/ZpvBNJ?editors=1010)**

Sayfada "Hello, world" mesajı görüntülenecektir.

## Render Edilmiş Elementin Güncellenmesi {#updating-the-rendered-element}

React elementleri [immutable(değişmez)](https://en.wikipedia.org/wiki/Immutable_object)'dır. Yani bir kez React elementi oluşturduktan sonra, o elementin alt elemanlarını veya özelliklerini değiştiremezsiniz. Bu nedenle element, bütün bir videonun tek bir karesi gibidir: arayüzün belirli bir andaki görüntüsünü temsil eder.

Bu zamana kadar edindiğimiz bilgiler ışığında, kullanıcı arayüzünün güncellenmesi için tek yolun, yeni bir element oluşturup, onu `root.render()` metoduna aktarmak olduğunu biliyoruz.

Aşağıdaki saat örneğini ele alalım:

`embed:rendering-elements/update-rendered-element.js`

**[Codepen'de Deneyin](https://codepen.io/gaearon/pen/gwoJZk?editors=1010)**

[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) metodu ile her saniye bitiminde [`root.render()`](/docs/react-dom.html#render) metodu çağrılıyor.

>**Not:**
>
>Genelde birçok React uygulamasında `root.render()` yalnızca bir kez çağrılır. Sonraki bölümlerde bu tarz kodların nasıl [state'li bileşenlere](/docs/state-and-lifecycle.html) dönüştürüleceğine değineceğiz.
>
>Her bir konu diğeri için zemin hazırladığından, bu konuları atlamamanızı öneririz. 

## React Yalnızca Gerekli Kısımları Günceller {#react-only-updates-whats-necessary}

React DOM, ilgili elementi ve elementin alt elemanlarını, bir önceki versiyonlarıyla karşılaştırır. Farkları tespit ettikten sonra yalnızca gerekli olan kısımlarda DOM güncellemesi yapar. Bu sayede DOM, istenen duruma getirilmiş olur.

Tarayıcı araçlarını kullanarak [son örneği](https://codepen.io/gaearon/pen/gwoJZk?editors=1010) incelediğinizde de bu durumu görebilirsiniz:

![DOM inceleyicisi küçük güncellemeleri gösteriyor](../images/docs/granular-dom-updates.gif)

Bütün UI ağacını her saniye bir görüntüleyen bir element oluşturmamıza rağmen, React DOM tarafından **yalnızca içeriği değişen** metin düğümü güncellenir.

Deneyimlerimizden yola çıkarsak, kullanıcı arayüzünün zaman içerisinde nasıl değiştirileceğinden ziyade herhangi bir anda nasıl görünmesi gerektiğini düşünmek birçok hatanın oluşmasını engellemektedir.
