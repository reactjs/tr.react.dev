---
title: hydrateRoot
---

<Intro>

`hydrateRoot`, daha önce [`react-dom/server`](/reference/react-dom/server) tarafından oluşturulmuş olan HTML içeriğini bir tarayıcı DOM düğümünün içinde React bileşenlerini görüntülemenize olanak tanır.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

`hydrateRoot` çağrısını, bir sunucu ortamında React tarafından zaten render edilmiş olan mevcut HTML'ye React'i “bağlamak” için kullanın.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React, `domNode` içinde bulunan HTML'ye bağlanacak ve içindeki DOM'un yönetimini devralacaktır. Tamamen React ile oluşturulmuş bir uygulama genellikle yalnızca bir `hydrateRoot` çağrısına ve onun kök bileşenine sahip olacaktır.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `domNode`: Sunucuda kök eleman olarak render edilmiş bir [DOM elemanı](https://developer.mozilla.org/en-US/docs/Web/API/Element).

* `reactNode`: Mevcut HTML'i render etmek için kullanılan "React düğümü". Bu genellikle `ReactDOM Server` yöntemiyle render edilmiş `<App />` gibi bir JSX parçası olacaktır, örneğin `renderToPipeableStream(<App />)` ile.

* **isteğe bağlı** `options`: Bu React kökü için seçenekler içeren bir nesne.

  * <CanaryBadge title="Bu özellik yalnızca Canary kanalında mevcuttur" /> **isteğe bağlı** `onCaughtError`: React bir Error Boundary içinde hata yakaladığında çağrılan geri çağırma fonksiyonu. Error Boundary tarafından yakalanan `error` ile ve `componentStack` içeren bir `errorInfo` nesnesi ile çağrılır.
  * <CanaryBadge title="Bu özellik yalnızca Canary kanalında mevcuttur" /> **isteğe bağlı** `onUncaughtError`: Bir hata fırlatıldığında ve Error Boundary tarafından yakalanmadığında çağrılan geri çağırma fonksiyonu. Fırlatılan `error` ve `componentStack` içeren bir `errorInfo` nesnesi ile çağrılır.
  * **isteğe bağlı** `onRecoverableError`: React hatalardan otomatik olarak kurtarıldığında çağrılan geri çağırma fonksiyonu. React'in fırlattığı `error` ve `componentStack` içeren bir `errorInfo` nesnesi ile çağrılır. Bazı kurtarılabilir hatalar, orijinal hata nedenini `error.cause` olarak içerebilir.
  * **isteğe bağlı** `identifierPrefix`: React'in [`useId` ](/reference/react/useId) ile oluşturulan ID'ler için kullandığı bir string öneki. Aynı sayfada birden fazla kök kullanırken çakışmaları önlemek için faydalıdır. Sunucuda kullanılanla aynı önek olmalıdır.


#### Döndürülenler {/*returns*/}

`hydrateRoot`, iki metoda sahip bir nesne döndürür: [`render`](#root-render) ve [`unmount`](#root-unmount).

#### Uyarılar {/*caveats*/}

* `hydrateRoot()` render edilen içeriğin sunucu tarafından render edilen içerik ile aynı olmasını bekler. Uyumsuzlukları hata olarak görmeli ve düzeltmelisiniz.
* Geliştirme modunda, React hidrasyon sırasında uyumsuzluklar hakkında uyarılar verir. Uyumsuzluklar durumunda, özellik farklılıklarının düzeltilmesi garanti edilmez. Bu, performans nedenleriyle önemlidir çünkü çoğu uygulamada uyumsuzluklar nadirdir ve tüm işaretlemeleri doğrulamak oldukça maliyetli olabilir.
* Uygulamanızda muhtemelen yalnızca bir `hydrateRoot` çağrısı olacaktır. Eğer bir framework kullanıyorsanız, bu çağrıyı sizin için yapabilir.
* Uygulamanızda zaten render edilmiş bir HTML yoksa, `hydrateRoot()` kullanmak desteklenmez. Bunun yerine [`createRoot()`](/reference/react-dom/client/createRoot) kullanın.

---

### `root.render(reactNode)` {/*root-render*/}

Bir tarayıcı DOM elemanı için hidrasyona uğramış bir React kökünde bir React bileşenini güncellemek için `root.render` çağrısı yapın.

```js
root.render(<App />);
```

React, hidrasyona uğramış `root` içinde `<App />`'i güncelleyecektir.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*root-render-parameters*/}

* `reactNode`: Güncellemek istediğiniz bir "React düğümü". Bu genellikle `<App />` gibi bir JSX parçası olacaktır, ancak aynı zamanda [`createElement()`](/reference/react/createElement) ile oluşturulmuş bir React elemanı, bir string, bir sayı, `null` veya `undefined` de iletebilirsiniz.


#### Döndürülenler {/*root-render-returns*/}

`root.render` `undefined` döndürür.

#### Uyarılar {/*root-render-caveats*/}

* Eğer kök hidrasyonu tamamlamadan önce `root.render` çağrısı yaparsanız, React mevcut sunucu tarafından render edilmiş HTML içeriğini temizler ve tüm kökü istemci tarafı render'lamaya geçirir.

---

### `root.unmount()` {/*root-unmount*/}

Bir React kökü içindeki render edilmiş bir ağacı yok etmek için `root.unmount` çağrısı yapın.

```js
root.unmount();
```

Tamamen React ile oluşturulmuş bir uygulama genellikle `root.unmount` çağrısı yapmaz.

Bu, özellikle React kök DOM düğümünüzün (veya onun herhangi bir atasının) başka bir kod tarafından DOM'dan kaldırılması durumunda kullanışlıdır. Örneğin, geçersiz sekmeleri DOM'dan kaldıran bir jQuery sekme paneli hayal edin. Bir sekme kaldırıldığında, içindeki her şey (React kökleri dahil) DOM'dan da kaldırılacaktır. React'e, `root.unmount` çağrısı yaparak kaldırılan kökün içeriğini yönetmeyi "durdurması" gerektiğini belirtmelisiniz. Aksi takdirde, kaldırılan kökün içindeki bileşenler, abonelikler gibi kaynakları temizleyip serbest bırakmazlar.

`root.unmount` çağrısı, kök bileşenindeki tüm bileşenleri unmount eder ve React'i kök DOM düğümünden "ayırır", bu da ağaçtaki tüm olay yöneticilerini veya durumu kaldırmayı içerir.


#### Parametreler {/*root-unmount-parameters*/}

`root.unmount` herhangi bir parametre kabul etmez.


#### Döndürülenler {/*root-unmount-returns*/}

`root.unmount` `undefined` döndürür.

#### Uyarılar {/*root-unmount-caveats*/}

* `root.unmount` çağrısı, ağaçtaki tüm bileşenleri unmount eder ve React'i kök DOM düğümünden "ayırır".

* Bir kez `root.unmount` çağrıldıktan sonra, kök üzerinde tekrar `root.render` çağrısı yapamazsınız. Unmount edilmiş bir kök üzerinde `root.render` çağırmaya çalışmak, "Unmount edilmiş bir kök güncellenemez" hatasını fırlatır.

---

## Kullanım {/*usage*/}

### Sunucu tarafından render edilen HTML'i hidrasyona uğratma {/*hydrating-server-rendered-html*/}

Eğer uygulamanızın HTML'i [`react-dom/server`](/reference/react-dom/client/createRoot) ile oluşturulduysa, bunu istemcide *hidrasyona uğratmanız* gerekir.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Bu, <CodeStep step={1}>tarayıcı DOM düğümü</CodeStep> içindeki sunucu HTML'ini, uygulamanız için <CodeStep step={2}>React bileşeni</CodeStep> ile hidrasyona uğratacaktır. Genellikle, bunu başlangıçta bir kez yaparsınız. Eğer bir framework kullanıyorsanız, bu işlemi arka planda sizin için yapabilir.

Uygulamanızı hidrasyona uğratmak için, React bileşenlerinizin mantığını sunucudan gelen ilk oluşturulmuş HTML'e "bağlar". Hidrasyon, sunucudan gelen ilk HTML anlık görüntüsünü, tarayıcıda çalışan tamamen etkileşimli bir uygulamaya dönüştürür.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki HTML içeriği
  App tarafından react-dom/server ile oluşturulmuştur.
-->
<div id="root"><h1>Merhaba, dünya!</h1><button>Bana <!-- -->0<!-- --> kez tıkladın</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Merhaba, dünya!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Bana {count} kez tıkladın
    </button>
  );
}
```

</Sandpack>

`hydrateRoot` fonksiyonunu tekrar çağırmanıza veya başka yerlerde çağırmanıza gerek yoktur. Bundan sonra, React uygulamanızın DOM'unu yönetecektir. Kullanıcı arayüzünü güncellemek için, bileşenleriniz bunun yerine [use state](/reference/react/useState) kullanacaktır.

<Pitfall>

`hydrateRoot` fonksiyonuna geçirdiğiniz React ağacının, sunucuda ürettiği **aynı çıktıyı** üretmesi gerekir.

Bu, kullanıcı deneyimi için önemlidir. Kullanıcı, JavaScript kodunuz yüklenmeden önce bir süre sunucu tarafından üretilen HTML'e bakarak bekleyecektir. Sunucu render'ı, çıktısının HTML anlık görüntüsünü göstererek uygulamanın daha hızlı yüklendiği yanılsamasını yaratır. Farklı içeriklerin aniden gösterilmesi, bu yanılsamayı bozar. Bu nedenle, sunucu render çıktısının, istemcideki ilk render çıktısı ile eşleşmesi gerekir.

Hidrasyon hatalarına yol açan en yaygın nedenler şunlardır:

* Kök düğüm içindeki React tarafından üretilen HTML etrafındaki ekstra boşluklar (yeni satırlar gibi).
* Render mantığınızda `typeof window !== 'undefined'` gibi kontroller kullanmak.
* Render mantığınızda yalnızca tarayıcıya özgü API'ler, örneğin [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) kullanmak.
* Sunucuda ve istemcide farklı veriler render etmek.

React bazı hidrasyon hatalarından kurtulabilir, ancak **bunları diğer hatalar gibi düzeltmelisiniz.** En iyi durumda, performans düşüşüne yol açarlar; en kötü durumda ise olay yöneticileri yanlış elemanlara eklenebilir.

</Pitfall>

---

### Tüm bir belgeyi hidrasyon yapmak {/*hydrating-an-entire-document*/}

Tamamen React ile oluşturulmuş uygulamalar, tüm belgeyi JSX olarak render edebilir, buna [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) etiketi de dahildir:

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Tüm belgeyi hidrasyon yapmak için, [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) globalini `hydrateRoot` fonksiyonuna ilk argüman olarak geçirin:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Kaçınılmaz hidrasyon uyumsuzluğu hatalarını bastırma {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Eğer tek bir elemanın özelliği veya metin içeriği sunucu ve istemci arasında kaçınılmaz şekilde farklıysa (örneğin bir zaman damgası), hidrasyon uyumsuzluğu uyarısını sessize alabilirsiniz.

Bir elemandaki hidrasyon uyarılarını sessize almak için `suppressHydrationWarning={true}` ekleyin:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki HTML içeriği
  App tarafından react-dom/server ile oluşturulmuştur.
-->
<div id="root"><h1>Güncel Tarih: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Güncel Tarih: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Bu yalnızca bir seviye derinliğe kadar çalışır ve bir kaçış mekanizması olarak tasarlanmıştır. Aşırı kullanmayın. Eğer metin içeriği değilse, React yine de bunu düzeltmeye çalışmaz, bu nedenle gelecekteki güncellemelerle tutarsız kalabilir.

---

### Farklı istemci ve sunucu içeriklerini yönetme {/*handling-different-client-and-server-content*/}

Eğer kasıtlı olarak sunucuda ve istemcide farklı bir şey render etmeniz gerekiyorsa, iki geçişli bir render yapabilirsiniz. İstemcide farklı bir şey render eden bileşenler, `isClient` gibi bir [state variable](/reference/react/useState) okuyabilir, bu değişkeni bir [Effect](/reference/react/useEffect) içinde `true` olarak ayarlayabilirsiniz:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki HTML içeriği 
  App tarafından react-dom/server ile oluşturulmuştur.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

Bu şekilde, ilk render geçişi sunucuyla aynı içeriği render eder, uyumsuzlukları önler, ancak hidrasyon hemen sonrasında senkronize bir şekilde ek bir geçiş yapılır.

<Pitfall>

Bu yaklaşım, bileşenlerinizin iki kez render edilmesi gerektiği için hidrasyonu yavaşlatır. Yavaş bağlantılarda kullanıcı deneyimine dikkat edin. JavaScript kodu, başlangıçtaki HTML render işleminden önemli ölçüde daha geç yüklenebilir, bu nedenle hidrasyondan hemen sonra farklı bir kullanıcı arayüzü render edilmesi, kullanıcıya garip gelebilir.

</Pitfall>

---

### Hidrasyon yapılmış bir kök bileşenini güncelleme {/*updating-a-hydrated-root-component*/}

Kök hidrasyon işlemini tamamladıktan sonra, kök React bileşenini güncellemek için [`root.render`](#root-render) çağrısı yapabilirsiniz. **[`createRoot`](/reference/react-dom/client/createRoot) ile farklı olarak, genellikle bunu yapmanız gerekmez çünkü başlangıçtaki içerik zaten HTML olarak render edilmiştir.**

Eğer hidrasyondan sonra bir noktada `root.render` çağrısı yapar ve bileşen ağacı yapısı daha önce render edilmiş olan ile eşleşirse, React [durumu koruyacaktır.](/learn/preserving-and-resetting-state) Bu örnekte, her saniye yapılan tekrar eden `render` çağrılarının yıkıcı olmadığını gösteren şekilde, girdi kutusuna yazmaya devam edebileceğinizi fark edeceksiniz:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> içindeki tüm HTML içeriği, <App /> bileşeninin react-dom/server ile render edilmesiyle oluşturulmuştur.
-->
<div id="root"><h1>Merhaba, dünya! <!-- -->0</h1><input placeholder="Buraya bir şeyler yazın"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Merhaba, dünya! {counter}</h1>
      <input placeholder="Buraya bir şeyler yazın" />
    </>
  );
}
```

</Sandpack>

Hidrasyon yapılmış bir kökte [`root.render`](#root-render) çağrısı yapmak yaygın değildir. Bunun yerine, genellikle bileşenlerden birinde [update state](/reference/react/useState).

### Yakalanmamış hatalar için bir diyalog göster {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError` yalnızca en son React Canary sürümünde kullanılabilir.

</Canary>

Varsayılan olarak, React tüm yakalanmamış hataları konsola kaydeder. Kendi hata raporlama sisteminizi uygulamak için isteğe bağlı `onUncaughtError` kök seçeneğini sağlayabilirsiniz:

```js [[1, 7, "onUncaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Yakalanmamış hata',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onUncaughtError</CodeStep> seçeneği, iki argüman ile çağrılan bir fonksiyondur:

1. Fırlatılan <CodeStep step={2}>error</CodeStep>.
2. Hatanın <CodeStep step={4}>componentStack</CodeStep>'ini içeren bir <CodeStep step={3}>errorInfo</CodeStep> nesnesi.

`onUncaughtError` kök seçeneğini, hata diyalogları göstermek için kullanabilirsiniz:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  React uygulamasındaki bir hata çökme yaşatabileceği için hata diyaloğu ham HTML olarak gösterilir.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Bu hata şu konumda meydana geldi:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Çağrı yığını:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Neden olduğu durum:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">Bu hata kapatılabilir değildir.</h3>
</div>
<!--
  <div id="root">...</div> içindeki HTML içeriği 
  App tarafından react-dom/server ile oluşturulmuştur.
-->
<div id="root">
  <div>
    <span>Bu hata, hata diyalogunu gösterir:</span>
    <button>Hata fırlat</button>
  </div>
</div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Başlığı ayarla
  errorTitle.innerText = title;
  
  // Hata mesajını ve içeriğini göster
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Bileşen yığınını göster
  errorComponentStack.innerText = componentStack;

  // Çağrı yığınını göster
  // Mesajı zaten görüntülediğimiz için, onu ve ilk Hata: satırını çıkarın.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Eğer mevcutsa nedeni göster
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Eğer kapatılabilir ise kapatma düğmesini göster
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Diyaloğu göster
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Yakalanan Hata", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Yakalanmamış Hata", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Kurtarılabilir Hata", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";
import {renderToString} from 'react-dom/server';

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>Bu hata, hata diyalogunu gösterir:</span>
      <button onClick={() => setThrowError(true)}>
        Hata fırlat
      </button>
    </div>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>


### Error Boundary hatalarını görüntüleme {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError` yalnızca en son React Canary sürümünde kullanılabilir.

</Canary>

Varsayılan olarak, React bir Error Boundary tarafından yakalanan tüm hataları `console.error` içine kaydeder. Bu davranışı değiştirmek için, bir [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) tarafından yakalanan hatalar için isteğe bağlı `onCaughtError` kök seçeneğini sağlayabilirsiniz:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Yakalanan hata',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onCaughtError</CodeStep> seçeneği, iki argüman ile çağrılan bir fonksiyondur:

1. Boundary tarafından yakalanan <CodeStep step={2}>error</CodeStep>.
2. Hatanın <CodeStep step={4}>componentStack</CodeStep>'ini içeren bir <CodeStep step={3}>errorInfo</CodeStep> nesnesi.

`onCaughtError` kök seçeneğini, hata diyalogları göstermek veya bilinen hataların loglanmasını engellemek için kullanabilirsiniz:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  React uygulamasındaki bir hata çökme yaşatabileceği için hata diyaloğu ham HTML olarak görüntülenir.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Bu hata şu konumda meydana geldi:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Çağrı yığını:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Neden olduğu durum:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Kapat
  </button>
  <h3 id="error-not-dismissible">Bu hata kapatılabilir değildir.</h3>
</div>
<!--
  <div id="root">...</div> içindeki HTML içeriği 
  App tarafından react-dom/server ile oluşturulmuştur.
-->
<div id="root">
  <span>Bu hata, hata diyalogunu göstermeyecek:</span>
  <button>Bilinen hatayı fırlat</button>
  <span>Bu hata, hata diyalogunu gösterecek:</span>
  <button>Bilinmeyen hatayı fırlat</button>
</div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Başlığı ayarla
  errorTitle.innerText = title;
  
  // Hata mesajını ve içeriğini göster
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Bileşen yığınını göster
  errorComponentStack.innerText = componentStack;

  // Çağrı yığınını göster
  // Mesajı zaten görüntülediğimiz için, onu ve ilk Hata: satırını çıkarın.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Eğer mevcutsa nedeni göster
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Eğer kapatılabilir ise kapatma düğmesini göster
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Diyaloğu göster
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Yakalanan Hata", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Yakalanmamış Hata", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Kurtarılabilir Hata", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>Bu hata, hata diyalogunu göstermeyecektir:</span>
        <button onClick={handleKnown}>
          Bilinen bir hata fırlat
        </button>
        <span>Bu hata, hata diyalogunu gösterecektir:</span>
        <button onClick={handleUnknown}>
          Bilinmeyen bir hata fırlat
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Bir şeyler yanlış gitti.</p>
      <button onClick={resetErrorBoundary}>Sıfırla</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Kurtarılabilir hidrasyon uyumsuzluğu hataları için bir diyalog göster {/*show-a-dialog-for-recoverable-hydration-mismatch-errors*/}

React, bir hidrasyon uyumsuzluğu ile karşılaştığında, otomatik olarak istemci tarafında render ederek durumu kurtarmaya çalışır. Varsayılan olarak, React hidrasyon uyumsuzluğu hatalarını `console.error` içine kaydeder. Bu davranışı değiştirmek için, isteğe bağlı `onRecoverableError` kök seçeneğini sağlayabilirsiniz:

```js [[1, 7, "onRecoverableError"], [2, 7, "error", 1], [3, 11, "error.cause", 1], [4, 7, "errorInfo"], [5, 12, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Yakalanan hata',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
```

<CodeStep step={1}>onRecoverableError</CodeStep> seçeneği, iki argüman ile çağrılan bir fonksiyondur:

1. React'in attığı <CodeStep step={2}>error</CodeStep>. Bazı hatalar, orijinal nedeni <CodeStep step={3}>error.cause</CodeStep> olarak içerebilir.
2. Hatanın <CodeStep step={5}>componentStack</CodeStep>'ini içeren bir <CodeStep step={4}>errorInfo</CodeStep> nesnesi.

`onRecoverableError` kök seçeneğini, hidrasyon uyumsuzlukları için hata diyalogları göstermek amacıyla kullanabilirsiniz:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  React uygulamasındaki bir hata çökme yaşatabileceği için hata diyaloğu ham HTML olarak gösterilir.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Bu hata şu konumda oluştu:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Çağrı yığını:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Neden oldu:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">Bu hata kapatılabilir değil.</h3>
</div>
<!--
  <div id="root">...</div> içindeki HTML içeriği 
  react-dom/server tarafından App üzerinden oluşturulmuştur.
-->
<div id="root"><span>Server</span></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Başlığı ayarla
  errorTitle.innerText = title;
  
  // Hata mesajını ve içeriğini göster
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Bileşen yığınını göster
  errorComponentStack.innerText = componentStack;

  // Çağrı yığınını göster
  // Mesajı zaten görüntülediğimiz için, onu ve ilk Hata: satırını çıkarın.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Eğer mevcutsa, nedenini göster
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Eğer kapatılabilir ise, kapatma düğmesini göster
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Diyaloğu göster
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Yakalanan Hata", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Yakalanmamış Hata", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Kurtarılabilir Hata", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack
    });
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <span>{typeof window !== 'undefined' ? 'Client' : 'Server'}</span>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Bir şeyler yanlış gitti.</p>
      <button onClick={resetErrorBoundary}>Sıfırla</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

## Sorun giderme {/*troubleshooting*/}


### Bir hata alıyorum: "root.render fonksiyonuna ikinci bir argüman ilettiniz" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Yaygın bir hata, `hydrateRoot` için olan seçenekleri `root.render(...)` fonksiyonuna iletmektir:

<ConsoleBlock level="error">

Uyarı: root.render(...) fonksiyonuna ikinci bir argüman ilettiniz, ancak bu fonksiyon yalnızca bir argüman kabul eder.

</ConsoleBlock>

Düzeltmek için, kök seçeneklerini `root.render(...)` yerine `hydrateRoot(...)` fonksiyonuna iletin:
```js {2,5}
// 🚩 Yanlış: root.render yalnızca bir argüman alır.
root.render(App, {onUncaughtError});

// ✅ Doğru: createRoot'a seçenekleri iletin.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
