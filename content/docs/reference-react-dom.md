---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

React, `<script>` elemaniyla yuklenirse, bu ust seviye API'lar `ReactDOM` uzerinden kullanilabilirsiniz. Mesela ES6 ile npm kullaniliyorsaniz, `import ReactDOM from 'react-dom'` yazabilir. ES5 ile npm kullaniliyorsaniz `var ReactDOM = require('react-dom')` yazabilirsiniz.

## Genel Taslak {#overview}

`react-dom` uygulamanin en ust seviyesinde DOM'a ozel metodlar sunar ve bu da gerektiginde React model'inin disina cikabilmenizi saglar. Bu arada, cogu bilesenlerin bu modulu kullanmasina gerek olmaz

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Tarayici destegi {#browser-support}


React, Internet Explorer 9 ve uzeri de dahil, tum populer tarayicilari desteklemekte, ama  IE 9 ve IE 10 gibi eski tarayicilarda [bazi eklentiler gerekmektedir](/docs/javascript-environment-requirements.html)  

> Not
>
> ES5 metodlarini desteklemeyen tarayicilari desteklemiyoruz, ama [es5-shim ve es5-sham](https://github.com/es-shims/es5-shim) gibi bazi eklentiler kullanildiginda, uygulamanizin calistigini gorebilirsiniz. Bu yolu kullanmak sizin takdiriniz.

* * *

## Referans {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

Girilen `container` ile DOM'a React elemani render ederek; bilesene bir  [referans](/docs/more-about-refs.html) donuyoruz (ya da [state'siz bilesenler](/docs/components-and-props.html#functional-and-class-components) icin `null` donuyoruz).


Eger React elemani `container` a daha onceden render edildiyse, bu guncelleme olarak gerceklesir ve en guncel React elemanini yansitmask icin sadece DOM'u degistirir.

Eger istege bagli callback saglandiysa, bilesen render edildikten ya da guncellendikten sonra cagrilir.

> Not:
>
> `ReactDOM.render()` ilettiğiniz konteyner elemaninin içeriğini kontrol eder. İlk cagrildiginda, içindeki butun DOM elemanlari değiştirilir. Daha sonra yapılan çağrılar etkili güncellemeler için React'in DOM farklılaştırma algoritmasını kullanır.
>
> `ReactDOM.render()`, konteyner elemanini değiştirmez (yalnızca konteynerin alt elemanlarini değiştirir). Mevcut alt elemanlarin üzerine yazmadan varolan bir DOM elemanina, bileşen eklemek mümkün olabilir
>
> `ReactDOM.render()` halihazirda `ReactComponent` nesnesinin kokune bir referans donuyor. Ancak, bu dönüş değerini kullanmak eskidi
> ve bundan kaçınılmalıdır, çünkü React'in gelecekteki sürümleri, bazı durumlarda bileşenleri eşzamansız olarak sağlayabilir. Kök `ReactComponent` nesnesine referans gerekiyorsa, tercih edilen çözüm  
> kök elemana bir [callback referansi](/docs/more-about-refs.html#the-ref-callback-attribute) olmalidir.
>
> Sunucu tarafından render edilen  bir konteyneri hidratlamak için `ReactDOM.render()`in kullanılması artik desteklenmiyor ve React 17'de de  kaldirilacaktir. Bunun yerine [`hydrate()`](#hydrate) kullanilmalidir
* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

[`render()`](#render)ile aynıdır, ancak HTML içeriği [`ReactDOMServer`](/docs/react-dom-server.html) tarafından render edilen bir konteyniri hidratlamak için kullanılır. React, olaylarini mevcuda eklemeye çalışacaktır.

React, oluşturulan içeriğin sunucu ve istemci taraflarinda aynı olmasini bekler. Metin içeriğindeki farklılıkları duzeltebilir, ancak uyumsuzlukları hata olarak görmeli ve düzeltmelisiniz. Geliştirme modunda, React, hidrasyon sırasında uyumsuzluklar icin uyarır. Uyuşmazlık durumunda, öznitelik farklılıklarının düzeltileceğinin garantisi yoktur. Bu, performans nedenlerinden ötürü önemlidir, çünkü çoğu uygulamada uyumsuzluklar nadirdir ve bu nedenle tüm biçimlendirmeyi doğrulamak çok pahalı olacaktır.

Tek bir elemanin ozniteligi veya metin içeriği, sunucu ile istemci arasında kaçınılmaz şekilde farklıysa (örneğin, bir zaman damgası), elemana `suppressHydrationWarning = {true}` ekleyerek uyarıyı susturabilirsiniz. Sadece bir seviye derinlikte çalışır ve bir kaçınma secenegi olarak amaçlanmıştır. Fazla kullanilmamalidir. Metin içeriği olmadığı sürece React düzeltmeye çalışmaz, bu nedenle gelecekteki güncellemelere kadar tutarsız kalabilir.

Kasıtlı olarak sunucuda ve istemcide farklı bir şey render etmeniz gerekirse, iki geçişli bir render yapabilirsiniz. İstemcide farklı bir şey render eden bileşenler, `this.state.isClient` gibi bir değişkeni okuyabilir; bu değeri `componentDidMount()`da `true` olarak ayarlayabilirsiniz. Bu şekilde, ilk render, yanlış eşleşmeleri önleyerek sunucu ile aynı içeriği oluşturur, ancak hidrasyondan hemen sonra eş zamanlı olarak ek bir geçiş gerçekleşir. Bu yaklaşımın, bileşenlerinizi yavaşlatacağını unutmayın, çünkü iki kez render olmalari gerekir, bu nedenle dikkatli kullanmalisiniz.

Yavaş bağlantılarda kullanıcı deneyimine dikkat etmeyi unutmayıniz. JavaScript kodu, ilk HTML renderindan önemli ölçüde sonra yüklenebilir; bu nedenle, yalnızca istemci geçişinde farklı bir şey render ederseniz, geçiş yavas olabilir. Ancak, doğru şekilde calistirilirsa, sunucuda uygulamanın bir "kabuğunu" render etmek ve yalnızca istemcideki ekstra gorsel parcaciklari göstermek yararlı olabilir. Biçimlendirme uyumsuzluğu sorunları olmadan bunu nasıl yapacağınızı öğrenmek için önceki paragraftaki açıklamaya bakabilirsiniz.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

DOM'den yuklenmis bir React bileşenini kaldırıp,  olaylarini ve state'lerini temizleyiniz. Konteynere hiçbir bileşen yuklenmemisse, bu fonksiyonu çağırmak hiçbir şey yapmaz. Bir bileşenin bağlantısı kaldırıldıysa `true` , kaldırılacak bir bileşen yoksa `false` döndürür.
* * *

### `findDOMNode()` {#finddomnode}

> Not:
>
> `findDOMNode`, temeldeki DOM elemanina erişmek için kullanılan bir cikis kapisidir. Çoğu durumda, bu cikis kapisinin kullanımı, bileşen soyutlamasını deldiginden tavsiye edilmez. [`StrictMode` da desteklenmemektedir.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
Bu bileşen DOM'a yuklemisse, ilgili yerel tarayıcına, DOM elemanini doner. Bu yöntem, form alanı değerleri gibi DOM dışındaki değerleri okumak ve DOM ölçümleri yapmak için kullanışlıdır. **Çoğu durumda, DOM elemanina bir referans ekleyebilir ve `findDOMNode` komutunu kullanmaktan kaçınabilirsiniz.**

When a component renders to `null` or `false`, `findDOMNode` returns `null`. When a component renders to a string, `findDOMNode` returns a text DOM node containing that value. As of React 16, a component may return a fragment with multiple children, in which case `findDOMNode` will return the DOM node corresponding to the first non-empty child.

Bir bileşen `null` veya `false` olarak render edildiginde, `findDOMNode`, `null` döndürür. Bir bileşen string render ettiginde, `findDOMNode`, bu değeri içeren bir metin DOM elemani döndürür. React 16'dan itibaren, bir bileşen birden fazla alt elemana sahip bir fragment döndürebilir, bu durumda `findDOMNode`, boş olmayan ilk alt elemana karşılık gelen DOM elemani döndürür.

> Not:
>
> `findDOMNode` yalnızca yuklenmis bileşenlerde çalışır (yani, DOM'a yerleştirilmiş bileşenler). Henüz yuklenmemis bir bileşende bunu cagirmaya çalışırsanız (henüz olusturulmamis bir bileşende `findDOMNode()`da  `render()`ı çağırmak gibi) bir istisna atılır.
>
> `findDOMNode` fonksiyon bileşenlerinde kullanılamaz.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Bir portal oluşturur. Portallar [alt elamanlari DOM bileşeninin hiyerarşisi dışında bulunan bir DOM elemanini render için](/docs/portals.html) bir yol sağlar. 
