---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
React'i, `<script>` etiketinden yüklerseniz, bu üst seviye API'ları `ReactDOM` üzerinden kullanabilirsiniz. Eğer npm ile birlikte ES6 kullanıyorsanız, `import ReactDOM from 'react-dom'` yazabilirsiniz. Eğer npm ile birlikte ES5 kullanıyorsanız, `var ReactDOM = require('react-dom')` yazabilirsiniz.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## Genel Bakış {#overview}

<<<<<<< HEAD
`react-dom` uygulamanın en üst seviyesinde, DOM'a özel metotlar sunar ve bu da gerektiğinde React modelinin dışına çıkabilmenizi sağlar. Bu arada, çoğu bileşenlerin bu modülü kullanmasına gerek olmaz.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Tarayıcı Desteği {#browser-support}

<<<<<<< HEAD
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

React, Internet Explorer 9 ve üzeri de dahil olmak üzere, tüm popüler tarayıcıları desteklemektedir. Ancak, IE 9 ve IE 10 gibi eski tarayıcılar için bazı [polyfill'ler (eklentiler) gerekmektedir](/docs/javascript-environment-requirements.html).

> Not
>
<<<<<<< HEAD
> ES5 metotlarını desteklemeyen tarayıcıları desteklemiyoruz, ama [es5-shim ve es5-sham](https://github.com/es-shims/es5-shim) gibi bazı eklentiler kullanıldığında, uygulamanızın çalıştığını görebilirsiniz. Bu yolu kullanmak sizin takdirinizdir.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## Referans {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Girilen `container` ile DOM'a React elemanı render ederek; bileşene bir [referans](/docs/more-about-refs.html) dönüyoruz (ya da [state'siz bileşenler](/docs/components-and-props.html#function-and-class-components) icin `null` dönüyoruz).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b


Eğer React elemanı `container` a daha önceden render edildiyse, bu; güncelleme olarak gerçekleşir ve en güncel React elemanını yansıtmak için sadece DOM'u değiştirir.

<<<<<<< HEAD
Eğer isteğe bağlı callback sağlandıysa, bileşen render edildikten ya da güncellendikten sonra çağrılır.
=======
> Note:
>
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

> Not:
>
> `ReactDOM.render()` ilettiğiniz konteyner elemanının içeriğini kontrol eder. İlk çağrıldığında, içerisindeki bütün DOM elemanları değiştirilir. Daha sonra yapılan çağrılar, etkili güncellemeler için React'in DOM fark bulma algoritmasını kullanır.
>
> `ReactDOM.render()`, konteyner elemanını değiştirmez (yalnızca konteynerın alt elemanlarını değiştirir). Mevcut alt elemanların üzerine yazmadan varolan bir DOM elemanına, bileşen eklemek mümkün olabilir.
>
> `ReactDOM.render()` halihazırda `ReactComponent` nesnesinin köküne bir referans dönüyor. Ancak, bu dönüş değerini kullanmak eskidi
> ve bundan kaçınılmalıdır, çünkü React'in gelecekteki sürümleri, bazı durumlarda bileşenleri eşzamansız olarak sağlayabilir. Kök `ReactComponent` nesnesine referans gerekiyorsa, tercih edilen çözüm kök elemana bir [callback referansı](/docs/refs-and-the-dom.html#callback-refs) olmalıdır.
>
> Sunucu tarafından render edilen bir konteynerı hidratlamak için `ReactDOM.render()`ın kullanılması artık desteklenmiyor ve React 17'de de kaldırılacaktır. Bunun yerine [`hydrate()`](#hydrate) kullanılmalıdır.
* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
[`render()`](#render) ile aynıdır, ancak HTML içeriği [`ReactDOMServer`](/docs/react-dom-server.html) tarafından render edilen bir konteynırı hidratlamak için kullanılır. React, olaylarını mevcuda eklemeye çalışacaktır.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

React, oluşturulan içeriğin sunucu ve istemci taraflarında aynı olmasını bekler. Metin içeriğindeki farklılıkları düzeltebilir, ancak uyumsuzlukları hata olarak görmeli ve düzeltmelisiniz. Geliştirme modunda React, hidrasyon sırasında uyumsuzluklar için uyarır. Uyuşmazlık durumunda, öznitelik farklılıklarının düzeltileceğinin garantisi yoktur. Bu, performans nedenlerinden ötürü önemlidir; çünkü çoğu uygulamada uyumsuzluklar nadirdir ve bu nedenle tüm biçimlendirmeyi doğrulamak çok pahalı olacaktır.

Tek bir elemanın özniteliği veya metin içeriği, sunucu ile istemci arasında kaçınılmaz şekilde farklıysa (örneğin, bir zaman damgası), elemana `suppressHydrationWarning = {true}` ekleyerek uyarıyı susturabilirsiniz. Sadece bir seviye derinlikte çalışır ve bir kaçınma seçeneği olarak amaçlanmıştır. Fazla kullanılmamalıdır. Metin içeriği olmadığı sürece React düzeltmeye çalışmaz, bu nedenle gelecekteki güncellemelere kadar tutarsız kalabilir.

Kasıtlı olarak sunucuda ve istemcide farklı bir şey render etmeniz gerekirse, iki geçişli bir render yapabilirsiniz. İstemcide farklı bir şey render eden bileşenler, `this.state.isClient` gibi bir değişkeni okuyabilir; bu değeri `componentDidMount()`'da `true` olarak ayarlayabilirsiniz. Bu şekilde, ilk render, yanlış eşleşmeleri önleyerek sunucu ile aynı içeriği oluşturur, ancak hidrasyondan hemen sonra eş zamanlı olarak ek bir geçiş gerçekleşir. Bu yaklaşımın, bileşenlerinizi yavaşlatacağını unutmayın, çünkü iki kez render olmaları gerekir, bu nedenle dikkatli kullanmalısınız.

Yavaş bağlantılarda kullanıcı deneyimine dikkat etmeyi unutmayınız. JavaScript kodu, ilk HTML renderından önemli ölçüde sonra yüklenebilir; bu nedenle, yalnızca istemci geçişinde farklı bir şey render ederseniz, geçiş yavaş olabilir. Ancak, doğru şekilde çalıştırılırsa, sunucuda uygulamanın bir "kabuğunu" render etmek ve yalnızca istemcideki ekstra görsel parçacıkları göstermek yararlı olabilir. Biçimlendirme uyumsuzluğu sorunları olmadan bunu nasıl yapacağınızı öğrenmek için önceki paragraftaki açıklamaya bakabilirsiniz.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
DOM'dan yüklenmiş bir React bileşenini kaldırıp, olaylarını ve state'lerini temizleyiniz. Konteynere hiçbir bileşen yüklenmemişse, bu fonksiyonu çağırmak hiçbir şey yapmaz. Bir bileşenin bağlantısı kaldırıldıysa `true` , kaldırılacak bir bileşen yoksa `false` döndürür.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
* * *

### `findDOMNode()` {#finddomnode}

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
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Bir portal oluşturur. Portallar [alt elamanlari DOM bileşeninin hiyerarşisi dışında bulunan bir DOM elemanını render için](/docs/portals.html) bir yol sağlar.
=======
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
