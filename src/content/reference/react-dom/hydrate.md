---
title: hydrate
---

<Deprecated>

Bu API, React'in gelecekteki bir ana sürümünde kaldırılacaktır.

React 18'de, `hydrate` yerine [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) kullanılmıştır. React 18'de `hydrate` kullanmak, uygulamanızın React 17 çalışıyormuş gibi davranacağı konusunda uyarı verir. Daha fazla bilgi için [buraya](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis) göz atın.

</Deprecated>

<Intro>

`hydrate`, React 17 ve altındaki sürümlerde, HTML içeriği daha önce [`react-dom/server`](/reference/react-dom/server) tarafından oluşturulmuş olan bir tarayıcı DOM düğümü içinde React bileşenlerini görüntülemenizi sağlar.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Başvuru {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

React 17 ve altındaki sürümlerde, `hydrate` çağrısı yaparak React'i sunucu ortamında zaten render edilmiş olan mevcut HTML'ye "bağlayabilirsiniz".

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React, `domNode` içinde var olan HTML'ye bağlanacak ve içindeki DOM'u yönetmeye başlayacaktır. Tamamen React ile oluşturulmuş bir uygulama genellikle kök bileşeniyle yalnızca bir `hydrate` çağrısına sahip olacaktır.

[Aşağıda daha fazla örnek görün.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: Mevcut HTML'yi render etmek için kullanılan "React düğümü". Bu genellikle React 17'de `renderToString(<App />)` gibi bir `ReactDOM Server` yöntemi ile render edilmiş `<App />` gibi bir JSX parçası olacaktır.

* `domNode`: Sunucuda kök eleman olarak render edilmiş bir [DOM elemanı](https://developer.mozilla.org/en-US/docs/Web/API/Element).

* **isteğe bağlı**: `callback`: Eğer geçilirse, bileşeniniz hydrate edildikten sonra React bu fonksiyonu çağıracaktır.

#### Dönen Değerler {/*returns*/}

`hydrate` null döner.

#### Uyarılar {/*caveats*/}
* `hydrate`, render edilmiş içeriğin sunucu tarafından render edilen içerikle aynı olmasını bekler. React, metin içeriğindeki farklılıkları düzeltebilir, ancak uyumsuzlukları hatalar olarak görmeli ve düzeltmelisiniz.
* Geliştirme modunda, React, hydrate işlemi sırasında uyumsuzluklar hakkında uyarır. Uyumsuzluk durumunda özellik farklılıklarının düzeltileceği garantisi yoktur. Bu, performans nedenleriyle önemlidir çünkü çoğu uygulamada, uyumsuzluklar nadirdir ve bu nedenle tüm işaretlemeyi doğrulamak aşırı derecede pahalı olurdu.
* Uygulamanızda muhtemelen yalnızca bir `hydrate` çağrısı olacaktır. Bir framework kullanıyorsanız, bu çağrıyı sizin için yapabilir.
* Uygulamanızda önceden render edilmiş HTML olmadan yalnızca istemci tarafından render edilmişse, `hydrate()` kullanımı desteklenmez. Bunun yerine [render()](/reference/react-dom/render) (React 17 ve altı için) veya [createRoot()](/reference/react-dom/client/createRoot) (React 18+ için) kullanın.

---

## Kullanım {/*usage*/}

Bir <CodeStep step={1}>React bileşenini</CodeStep> bir sunucu-render <CodeStep step={2}>tarayıcı DOM düğümüne</CodeStep> bağlamak için `hydrate` çağrısı yapın.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

Yalnızca istemci için bir uygulamayı (önceden sunucuda render edilmemiş bir uygulamayı) render etmek için `hydrate()` kullanımı desteklenmez. Bunun yerine [`render()`](/reference/react-dom/render) (React 17 ve altı için) veya [`createRoot()`](/reference/react-dom/client/createRoot) (React 18+ için) kullanın.

### Sunucuda render edilmiş HTML'yi hydrate etme {/*hydrating-server-rendered-html*/}

React'te, "hydration", React'in bir sunucu ortamında zaten render edilmiş olan mevcut HTML'ye "bağlanması" anlamına gelir. Hydration sırasında, React mevcut işaretlemeye olay dinleyicilerini bağlamaya çalışır ve uygulamayı istemcide render etmeyi devralır.

Tamamen React ile oluşturulmuş uygulamalarda, **genellikle tüm uygulamanız için başlangıçta yalnızca bir "kök" hydrate edersiniz.**

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki HTML içeriği
  react-dom/server tarafından App'den oluşturulmuştur.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js src/index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

Genellikle `hydrate` çağrısını başka bir yerde tekrar yapmanız veya çağırmanız gerekmez. Bu noktadan itibaren, React uygulamanızın DOM'unu yönetiyor olacaktır. UI'yi güncellemek için bileşenleriniz [state kullanacaktır.](/reference/react/useState)

Hydration hakkında daha fazla bilgi için, [`hydrateRoot` belgelerine](/reference/react-dom/client/hydrateRoot) bakın.

---

### Kaçınılmaz hydration uyumsuzluk hatalarını bastırma {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Sunucu ve istemci arasındaki bir elemanın özelliği veya metin içeriği kaçınılmaz olarak farklıysa (örneğin, bir zaman damgası), hydrate uyumsuzluk uyarısını bastırabilirsiniz.

Bir elemandaki hydrate uyarılarını bastırmak için `suppressHydrationWarning={true}` ekleyin:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki HTML içeriği
  react-dom/server tarafından App'den oluşturulmuştur.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Bu yalnızca bir seviye derinlikte çalışır ve bir kaçış yolu olarak tasarlanmıştır. Fazla kullanmayın. Metin içeriği olmadıkça, React yine de bunu düzeltmeye çalışmaz, bu nedenle gelecekteki güncellemelere kadar tutarsız kalabilir.

---

### Farklı istemci ve sunucu içeriğini yönetme {/*handling-different-client-and-server-content*/}

İstemcide ve sunucuda kasıtlı olarak farklı bir şey render etmeniz gerekiyorsa, iki geçişli render yapabilirsiniz. İstemcide farklı bir şey render eden bileşenler, `isClient` gibi bir [state değişkeni](/reference/react/useState) okuyabilir ve bu değişkeni bir [Effect](/reference/react/useEffect) içinde `true` olarak ayarlayabilirsiniz:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki HTML içeriği
  react-dom/server tarafından App'den oluşturulmuştur.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
const [isClient, setIsClient] = useState(() => typeof window !== "undefined");

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

Bu şekilde, ilk render geçişi sunucudaki içeriği aynı şekilde render eder, uyumsuzluklardan kaçınır, ancak hydrate işleminden hemen sonra ek bir geçiş daha gerçekleşir.

<Pitfall>

Bu yaklaşım, bileşenlerinizin iki kez render edilmesi gerektiğinden hydrate işlemini yavaşlatır. Yavaş bağlantılarda kullanıcı deneyimini göz önünde

 bulundurun. JavaScript kodu, başlangıç HTML render'ından önemli ölçüde sonra yüklenebilir, bu nedenle hydrate işleminden hemen sonra farklı bir UI render etmek kullanıcıya rahatsız edici gelebilir.

</Pitfall>
