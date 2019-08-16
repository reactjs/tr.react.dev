---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

React'i, `<script>` etiketinden yüklerseniz, bu üst seviye API'ları `ReactDOM` üzerinden kullanabilirsiniz. Eğer npm ile birlikte ES6 kullanıyorsanız, `import ReactDOM from 'react-dom'` yazabilirsiniz. Eğer npm ile birlikte ES5 kullanıyorsanız, `var ReactDOM = require('react-dom')` yazabilirsiniz.

## Genel Bakış {#overview}

`react-dom` uygulamanın en üst seviyesinde, DOM'a özel metotlar sunar ve bu da gerektiğinde React modelinin dışına çıkabilmenizi sağlar. Bu arada, çoğu bileşenlerin bu modülü kullanmasına gerek olmaz.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Tarayıcı Desteği {#browser-support}


React, Internet Explorer 9 ve üzeri de dahil olmak üzere, tüm popüler tarayıcıları desteklemektedir. Ancak, IE 9 ve IE 10 gibi eski tarayıcılar için bazı [polyfill'ler (eklentiler) gerekmektedir](/docs/javascript-environment-requirements.html).

> Not
>
> ES5 metotlarını desteklemeyen tarayıcıları desteklemiyoruz, ama [es5-shim ve es5-sham](https://github.com/es-shims/es5-shim) gibi bazı eklentiler kullanıldığında, uygulamanızın çalıştığını görebilirsiniz. Bu yolu kullanmak sizin takdirinizdir.

* * *

## Referans {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

Girilen `container` ile DOM'a React elemanı render ederek; bileşene bir [referans](/docs/more-about-refs.html) dönüyoruz (ya da [state'siz bileşenler](/docs/components-and-props.html#functional-and-class-components) icin `null` dönüyoruz).


Eğer React elemanı `container` a daha önceden render edildiyse, bu; güncelleme olarak gerçekleşir ve en güncel React elemanını yansıtmak için sadece DOM'u değiştirir.

Eğer isteğe bağlı callback sağlandıysa, bileşen render edildikten ya da güncellendikten sonra çağrılır.

> Not:
>
> `ReactDOM.render()` ilettiğiniz konteyner elemanının içeriğini kontrol eder. İlk çağrıldığında, içerisindeki bütün DOM elemanları değiştirilir. Daha sonra yapılan çağrılar, etkili güncellemeler için React'in DOM farklılaştırma algoritmasını kullanır.
>
> `ReactDOM.render()`, konteyner elemanını değiştirmez (yalnızca konteynerın alt elemanlarını değiştirir). Mevcut alt elemanların üzerine yazmadan varolan bir DOM elemanına, bileşen eklemek mümkün olabilir.
>
> `ReactDOM.render()` halihazırda `ReactComponent` nesnesinin köküne bir referans dönüyor. Ancak, bu dönüş değerini kullanmak eskidi
> ve bundan kaçınılmalıdır, çünkü React'in gelecekteki sürümleri, bazı durumlarda bileşenleri eşzamansız olarak sağlayabilir. Kök `ReactComponent` nesnesine referans gerekiyorsa, tercih edilen çözüm kök elemana bir [callback referansı](/docs/more-about-refs.html#the-ref-callback-attribute) olmalıdır.
>
> Sunucu tarafından render edilen bir konteynerı hidratlamak için `ReactDOM.render()`ın kullanılması artık desteklenmiyor ve React 17'de de kaldırılacaktır. Bunun yerine [`hydrate()`](#hydrate) kullanılmalıdır.
* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

[`render()`](#render) ile aynıdır, ancak HTML içeriği [`ReactDOMServer`](/docs/react-dom-server.html) tarafından render edilen bir konteynırı hidratlamak için kullanılır. React, olaylarını mevcuda eklemeye çalışacaktır.

React, oluşturulan içeriğin sunucu ve istemci taraflarında aynı olmasını bekler. Metin içeriğindeki farklılıkları düzeltebilir, ancak uyumsuzlukları hata olarak görmeli ve düzeltmelisiniz. Geliştirme modunda React, hidrasyon sırasında uyumsuzluklar için uyarır. Uyuşmazlık durumunda, öznitelik farklılıklarının düzeltileceğinin garantisi yoktur. Bu, performans nedenlerinden ötürü önemlidir; çünkü çoğu uygulamada uyumsuzluklar nadirdir ve bu nedenle tüm biçimlendirmeyi doğrulamak çok pahalı olacaktır.

Tek bir elemanın özniteliği veya metin içeriği, sunucu ile istemci arasında kaçınılmaz şekilde farklıysa (örneğin, bir zaman damgası), elemana `suppressHydrationWarning = {true}` ekleyerek uyarıyı susturabilirsiniz. Sadece bir seviye derinlikte çalışır ve bir kaçınma seçeneği olarak amaçlanmıştır. Fazla kullanılmamalıdır. Metin içeriği olmadığı sürece React düzeltmeye çalışmaz, bu nedenle gelecekteki güncellemelere kadar tutarsız kalabilir.

Kasıtlı olarak sunucuda ve istemcide farklı bir şey render etmeniz gerekirse, iki geçişli bir render yapabilirsiniz. İstemcide farklı bir şey render eden bileşenler, `this.state.isClient` gibi bir değişkeni okuyabilir; bu değeri `componentDidMount()`'da `true` olarak ayarlayabilirsiniz. Bu şekilde, ilk render, yanlış eşleşmeleri önleyerek sunucu ile aynı içeriği oluşturur, ancak hidrasyondan hemen sonra eş zamanlı olarak ek bir geçiş gerçekleşir. Bu yaklaşımın, bileşenlerinizi yavaşlatacağını unutmayın, çünkü iki kez render olmaları gerekir, bu nedenle dikkatli kullanmalısınız.

Yavaş bağlantılarda kullanıcı deneyimine dikkat etmeyi unutmayınız. JavaScript kodu, ilk HTML renderından önemli ölçüde sonra yüklenebilir; bu nedenle, yalnızca istemci geçişinde farklı bir şey render ederseniz, geçiş yavaş olabilir. Ancak, doğru şekilde çalıştırılırsa, sunucuda uygulamanın bir "kabuğunu" render etmek ve yalnızca istemcideki ekstra görsel parçacıkları göstermek yararlı olabilir. Biçimlendirme uyumsuzluğu sorunları olmadan bunu nasıl yapacağınızı öğrenmek için önceki paragraftaki açıklamaya bakabilirsiniz.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

DOM'dan yüklenmiş bir React bileşenini kaldırıp, olaylarını ve state'lerini temizleyiniz. Konteynere hiçbir bileşen yüklenmemişse, bu fonksiyonu çağırmak hiçbir şey yapmaz. Bir bileşenin bağlantısı kaldırıldıysa `true` , kaldırılacak bir bileşen yoksa `false` döndürür.
* * *

### `findDOMNode()` {#finddomnode}

> Not:
>
> `findDOMNode`, temeldeki DOM elemanına erişmek için kullanılan bir çıkış kapısıdır. Çoğu durumda, bu çıkış kapısının kullanımı, bileşen soyutlamasını deldiğinden tavsiye edilmez. [`StrictMode` da desteklenmemektedir.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
Bu bileşen DOM'a yüklenmişse, ilgili yerel tarayıcınıza, DOM elemanını döner. Bu yöntem, form alanı değerleri gibi DOM dışındaki değerleri okumak ve DOM ölçümleri yapmak için kullanışlıdır. **Çoğu durumda, DOM elemanına bir referans ekleyebilir ve `findDOMNode` komutunu kullanmaktan kaçınabilirsiniz.**

Bir bileşen `null` veya `false` olarak render edildiğinde, `findDOMNode`, `null` döndürür. Bir bileşen `string` render ettiğinde, `findDOMNode`, bu değeri içeren bir metin DOM elemanı döndürür. React 16'dan itibaren, bir bileşen birden fazla alt elemana sahip bir `fragment` döndürebilir, bu durumda `findDOMNode`, boş olmayan ilk alt elemana karşılık gelen DOM elemanı döndürür.

> Not:
>
> `findDOMNode` yalnızca yüklenmiş bileşenlerde çalışır (yani, DOM'a yerleştirilmiş bileşenler). Henüz yuklenmemiş bir bileşende bunu çağırmaya çalışırsanız (henüz oluşturulmamış bir bileşende `findDOMNode()`da `render()`ı çağırmak gibi) bir istisna atılır.
>
> `findDOMNode` fonksiyon bileşenlerinde kullanılamaz.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Bir portal oluşturur. Portallar [alt elamanlari DOM bileşeninin hiyerarşisi dışında bulunan bir DOM elemanını render için](/docs/portals.html) bir yol sağlar.
