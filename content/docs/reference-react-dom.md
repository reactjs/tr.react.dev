---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

`react-dom` uygulamanın en üst seviyesinde, DOM'a özel metotlar sunar ve bu da gerektiğinde React modelinin dışına çıkabilmenizi sağlar.

```js
import * as ReactDOM from 'react-dom';
```

ES5'i npm ile kullanıyorsanız şöyle yazabilirsiniz:

```js
var ReactDOM = require('react-dom');
```

`react-dom` paketi ayrıca istemci ve sunucu uygulamalarına özel modüller sağlar:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)

## Genel Bakış {#overview}

`react-dom` paketi şu metodları dışa aktarır:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

Bu `react-dom` metodları de dışa aktarılır, ancak eski olarak kabul edilir:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Not: 
> 
> React 18'de, hem `render` hem de `hydrate` yeni [istemci metodları](/docs/react-dom-client.html) ile değiştirildi. Bu metodlar, uygulamanızın React versiyon 17 kullanıyormuş gibi davranacağı konusunda uyarır. ([buradan](https://reactjs.org/link/switch-to-createroot) daha fazla bilgi edinin).

### Tarayıcı Desteği {#browser-support}

React, tüm modern tarayıcıları destekler, yinede eski versiyonlar için [bazı polyfill'ler gereklidir](/docs/javascript-environment-requirements.html).

> Not
>
> ES5 metotlarını desteklemeyen tarayıcıları desteklemiyoruz, ama [es5-shim ve es5-sham](https://github.com/es-shims/es5-shim) gibi bazı eklentiler kullanıldığında, uygulamanızın çalıştığını görebilirsiniz. Bu yolu kullanmak sizin takdirinizdir.

## Referans {#reference}

### `createPortal()` {#createportal}

> Try the new React documentation for [`createPortal`](https://beta.reactjs.org/reference/react-dom/createPortal).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
createPortal(child, container)
```

Bir portal oluşturur. Portallar, [alt elemanları DOM bileşeninin hiyerarşisi dışında var olan bir DOM düğümüne render etmek](/docs/portals.html) için bir yol sağlar.

### `flushSync()` {#flushsync}

> Try the new React documentation for [`flushSync`](https://beta.reactjs.org/reference/react-dom/flushSync).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
flushSync(callback)
```

React'i, parametre olarak verilen callback içindeki tüm güncellemeleri senkron olarak çalıştırmaya zorlar. Bu, DOM'un hemen güncellenmesini sağlar.

```javascript
// Bu state güncellemesini senkronize olmaya zorlayın.
flushSync(() => {
  setCount(count + 1);
});
// Bu noktada, DOM güncellenmiştir.
```

> Not:
>
> `flushSync` performansa ciddi ölçüde zarar verebilir. Dikkatli kullanın.
>
> `flushSync`, bekleyen Suspense sınırlarını `geçici` durumlarını göstermeye zorlayabilir.
>
> `flushSync` ayrıca bekleyen efektleri çalıştırabilir ve geri dönmeden önce içerdikleri güncellemeleri eşzamanlı olarak uygulayabilir.
>
> `flushSync`, callback içindeki güncellemeleri uygulamak için gerektiğinde callback dışındaki güncellemeleri de uygulayabilir. Örneğin, bir tıklamadan dolayı bekleyen güncellemeler varsa; React, callback içindeki güncellemeleri uygulamak için önce bunları uygulayabilir.

## Eski Referans {#legacy-reference}
### `render()` {#render}

> Try the new React documentation for [`render`](https://beta.reactjs.org/reference/react-dom/render).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
render(element, container[, callback])
```

> Not:
>
> React versiyon 18 ile birlikte `render`'in yerini `createRoot` aldı. Daha fazla bilgi için [createRoot](/docs/react-dom-client.html#createroot) kısmını inceleyebilirsiniz.

Eğer React elemanı `container` a daha önceden render edildiyse, bu; güncelleme olarak gerçekleşir ve en güncel React elemanını yansıtmak için sadece DOM'u değiştirir.

Eğer isteğe bağlı callback sağlandıysa, bileşen render edildikten ya da güncellendikten sonra çağrılır.

> Not:
>
> `render()` ilettiğiniz konteyner elemanının içeriğini kontrol eder. İlk çağrıldığında, içerisindeki bütün DOM elemanları değiştirilir. Daha sonra yapılan çağrılar, etkili güncellemeler için React'in DOM fark bulma algoritmasını kullanır.
>
> `render()`, konteyner elemanını değiştirmez (yalnızca konteynerın alt elemanlarını değiştirir). Mevcut alt elemanların üzerine yazmadan varolan bir DOM elemanına, bileşen eklemek mümkün olabilir.
>
> `render()` halihazırda `ReactComponent` nesnesinin köküne bir referans dönüyor. Ancak, bu dönüş değerini kullanmak eskidi
> ve bundan kaçınılmalıdır, çünkü React'in gelecekteki sürümleri, bazı durumlarda bileşenleri eşzamansız olarak sağlayabilir. Kök `ReactComponent` nesnesine referans gerekiyorsa, tercih edilen çözüm kök elemana bir [callback referansı](/docs/refs-and-the-dom.html#callback-refs) olmalıdır.
>
> Sunucu tarafından render edilen bir konteynerı hidratlamak için `render()`ın kullanılması artık desteklenmiyor. Bunun yerine [`hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) kullanılmalıdır.

### `hydrate()` {#hydrate}

> Try the new React documentation for [`hydrate`](https://beta.reactjs.org/reference/react-dom/hydrate).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
hydrate(element, container[, callback])
```

> Not:
>
> React versiyon 18 ile birlikte `hydrate`'in yerini `hydrateRoot` aldı. Daha fazla bilgi için [hydrateRoot](/docs/react-dom-client.html#hydrateroot) kısmını inceleyebilirsiniz.

[`render()`](#render) ile aynıdır, ancak HTML içeriği [`ReactDOMServer`](/docs/react-dom-server.html) tarafından render edilen bir konteynırı hidratlamak için kullanılır. React, olaylarını mevcuda eklemeye çalışacaktır.

React, oluşturulan içeriğin sunucu ve istemci taraflarında aynı olmasını bekler. Metin içeriğindeki farklılıkları düzeltebilir, ancak uyumsuzlukları hata olarak görmeli ve düzeltmelisiniz. Geliştirme modunda React, hidrasyon sırasında uyumsuzluklar için uyarır. Uyuşmazlık durumunda, öznitelik farklılıklarının düzeltileceğinin garantisi yoktur. Bu, performans nedenlerinden ötürü önemlidir; çünkü çoğu uygulamada uyumsuzluklar nadirdir ve bu nedenle tüm biçimlendirmeyi doğrulamak çok pahalı olacaktır.

Tek bir elemanın özniteliği veya metin içeriği, sunucu ile istemci arasında kaçınılmaz şekilde farklıysa (örneğin, bir zaman damgası), elemana `suppressHydrationWarning = {true}` ekleyerek uyarıyı susturabilirsiniz. Sadece bir seviye derinlikte çalışır ve bir kaçınma seçeneği olarak amaçlanmıştır. Fazla kullanılmamalıdır. Metin içeriği olmadığı sürece React düzeltmeye çalışmaz, bu nedenle gelecekteki güncellemelere kadar tutarsız kalabilir.

Kasıtlı olarak sunucuda ve istemcide farklı bir şey render etmeniz gerekirse, iki geçişli bir render yapabilirsiniz. İstemcide farklı bir şey render eden bileşenler, `this.state.isClient` gibi bir değişkeni okuyabilir; bu değeri `componentDidMount()`'da `true` olarak ayarlayabilirsiniz. Bu şekilde, ilk render, yanlış eşleşmeleri önleyerek sunucu ile aynı içeriği oluşturur, ancak hidrasyondan hemen sonra eş zamanlı olarak ek bir geçiş gerçekleşir. Bu yaklaşımın, bileşenlerinizi yavaşlatacağını unutmayın, çünkü iki kez render olmaları gerekir, bu nedenle dikkatli kullanmalısınız.

Yavaş bağlantılarda kullanıcı deneyimine dikkat etmeyi unutmayınız. JavaScript kodu, ilk HTML renderından önemli ölçüde sonra yüklenebilir; bu nedenle, yalnızca istemci geçişinde farklı bir şey render ederseniz, geçiş yavaş olabilir. Ancak, doğru şekilde çalıştırılırsa, sunucuda uygulamanın bir "kabuğunu" render etmek ve yalnızca istemcideki ekstra görsel parçacıkları göstermek yararlı olabilir. Biçimlendirme uyumsuzluğu sorunları olmadan bunu nasıl yapacağınızı öğrenmek için önceki paragraftaki açıklamaya bakabilirsiniz.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

> Try the new React documentation for [`unmountComponentAtNode`](https://beta.reactjs.org/reference/react-dom/unmountComponentAtNode).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
unmountComponentAtNode(container)
```

> Not:
>
> React versiyon 18 ile birlikte `unmountComponentAtNode`'in yerini `root.unmount()` aldı. Daha fazla bilgi için [createRoot](/docs/react-dom-client.html#createroot) kısmını inceleyebilirsiniz.

DOM'dan yüklenmiş bir React bileşenini kaldırıp, olaylarını ve state'lerini temizleyiniz. Konteynere hiçbir bileşen yüklenmemişse, bu fonksiyonu çağırmak hiçbir şey yapmaz. Bir bileşenin bağlantısı kaldırıldıysa `true` , kaldırılacak bir bileşen yoksa `false` döndürür.

* * *

### `findDOMNode()` {#finddomnode}

> Try the new React documentation for [`findDOMNode`](https://beta.reactjs.org/reference/react-dom/findDOMNode).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

> Not:
>
> `findDOMNode`, temeldeki DOM elemanına erişmek için kullanılan bir çıkış kapısıdır. Çoğu durumda, bu çıkış kapısının kullanımı, bileşen soyutlamasını deldiğinden tavsiye edilmez. [`StrictMode` da desteklenmemektedir.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
Bu bileşen DOM'a yüklenmişse, ilgili yerel tarayıcınıza, DOM elemanını döner. Bu yöntem, form alanı değerleri gibi DOM dışındaki değerleri okumak ve DOM ölçümleri yapmak için kullanışlıdır. **Çoğu durumda, DOM elemanına bir referans ekleyebilir ve `findDOMNode` komutunu kullanmaktan kaçınabilirsiniz.**

Bir bileşen `null` veya `false` olarak render edildiğinde, `findDOMNode`, `null` döndürür. Bir bileşen `string` render ettiğinde, `findDOMNode`, bu değeri içeren bir metin DOM elemanı döndürür. React 16'dan itibaren, bir bileşen birden fazla alt elemana sahip bir `fragment` döndürebilir, bu durumda `findDOMNode`, boş olmayan ilk alt elemana karşılık gelen DOM elemanı döndürür.

> Not:
>
> `findDOMNode` yalnızca yüklenmiş bileşenlerde çalışır (yani, DOM'a yerleştirilmiş bileşenler). Henüz yuklenmemiş bir bileşende bunu çağırmaya çalışırsanız (henüz oluşturulmamış bir bileşende `findDOMNode()`da `render()`ı çağırmak gibi) bir istisna atılır.
>
> `findDOMNode` fonksiyon bileşenlerinde kullanılamaz.

* * *
