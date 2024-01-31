---
title: createRoot
---

<Intro>

`createRoot` React bileşenlerini bir tarayıcı DOM düğümü içinde görüntülemek için bir kök oluşturmanızı sağlar.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

İçeriği bir tarayıcı DOM elemanı içinde görüntülemek üzere bir React kökü oluşturmak için `createRoot` çağrısı yapın.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React, `domNode` için bir kök oluşturacak ve içindeki DOM'un yönetimini üstlenecek. Bir kök oluşturduktan sonra, içinde bir React bileşeni görüntülemek için [`root.render`](#root-render) çağırmanız gerekir:

```js
root.render(<App />);
```

Tamamen React ile oluşturulmuş bir uygulama genellikle kök bileşeni için yalnızca bir `createRoot` çağrısına sahip olacaktır. Sayfanın bazı bölümleri için React "serpintileri" kullanan bir sayfa, ihtiyaç duyulan kadar çok sayıda ayrı köke sahip olabilir.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `domNode`: Bir [DOM elemanı.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React bu DOM elemanı için bir kök oluşturacak ve `render` gibi render edilmiş React içeriğini görüntülemek için kök üzerinde fonksiyonlar çağırmanıza izin verecektir.

* **opsiyonel** `options`: Bu React kökü için seçenekler içeren bir nesne.

  * **opsiyonel** `onRecoverableError`: React'in hatalardan otomatik olarak kurtulduğunda çağrılan callback fonksiyonu.
  * **opsiyonel** `identifierPrefix`: [`useId`](/reference/react/useId) tarafından oluşturulan kimlikler için React'in kullandığı bir dize öneki. Aynı sayfada birden fazla kök kullanırken çakışmaları önlemek için kullanışlıdır.

#### Döndürülenler {/*returns*/}

`createRoot` [`render`](#root-render) ve [`unmount`](#root-unmount) olmak üzere iki yöntem içeren bir nesne döndürür.

#### Uyarılar {/*caveats*/}
* Uygulamanız sunucu tarafından oluşturulmuşsa, `createRoot()` kullanımı desteklenmez. Bunun yerine [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) kullanın.
* Uygulamanızda muhtemelen yalnızca bir `createRoot` çağrısı olacaktır. Eğer bir çatı kullanıyorsanız, bu çağrıyı sizin için yapabilir.
* Bileşeninizin alt öğesi olmayan DOM ağacının farklı bir bölümünde bir JSX parçası render etmek istediğinizde (örneğin, bir modal veya bir araç ipucu), `createRoot` yerine [`createPortal`](/reference/react-dom/createPortal) kullanın.

---

### `root.render(reactNode)` {/*root-render*/}

React root'un tarayıcı DOM düğümünde bir [JSX](/learn/writing-markup-with-jsx) parçası görüntülemek için `root.render` çağrısı yapın.

```js
root.render(<App />);
```

React, `root` içinde `<App />` gösterecek ve içindeki DOM'un yönetimini üstlenecektir.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*root-render-parameters*/}

* `reactNode`: Görüntülemek istediğiniz bir *React düğümü*. Bu genellikle `<App />` gibi bir JSX parçası olacaktır, ancak [`createElement()`](/reference/react/createElement) ile oluşturulmuş bir React elemanı, bir string, bir sayı, `null` veya `undefined` da iletebilirsiniz.


#### Döndürülenler {/*root-render-returns*/}

`root.render` `undefined` değerini döndürür.

#### Uyarılar {/*root-render-caveats*/}

* İlk kez `root.render` fonksiyonunu çağırdığınız zaman React, React bileşenini render etmeden önce React kökü içindeki mevcut tüm HTML içeriğini temizleyecektir.

* Kök DOM düğümünüz sunucuda veya derleme sırasında React tarafından oluşturulan HTML içeriyorsa, bunun yerine olay işleyicilerini mevcut HTML'ye ekleyen [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) fonksiyonunu kullanın.

* Aynı kök üzerinde birden fazla kez `render` çağrısı yaparsanız, React ilettiğiniz en son JSX'i yansıtmak için DOM'u gerektiği gibi güncelleyecektir. React, DOM'un hangi bölümlerinin yeniden kullanılabileceğine ve hangilerinin yeniden oluşturulması gerektiğine daha önce oluşturulmuş ağaçla ["eşleştirerek"](/learn/preserving-and-resetting-state) daha önce oluşturulmuş ağaçla karar verecektir. Aynı kök üzerinde `render` fonksiyonunu tekrar çağırmak, kök bileşen üzerinde [`set` fonksiyonunu](/reference/react/useState#setstate) çağırmaya benzer: React gereksiz DOM güncellemelerinden kaçınır.

---

### `root.unmount()` {/*root-unmount*/}

React kökü içinde render edilmiş bir ağacı yok etmek için `root.unmount` çağırın.

```js
root.unmount();
```

Tamamen React ile oluşturulan bir uygulamada genellikle `root.unmount` çağrısı olmayacaktır.

Bu, çoğunlukla React kök DOM düğümünüzün (veya atalarından herhangi birinin) başka bir kod tarafından DOM'dan kaldırılabileceği durumlarda kullanışlıdır. Örneğin, etkin olmayan sekmeleri DOM'dan kaldıran bir jQuery sekme paneli düşünün. Bir sekme kaldırılırsa, içindeki her şey (içindeki React kökleri de dahil olmak üzere) DOM'dan da kaldırılacaktır. Bu durumda, React'e `root.unmount` çağrısı yaparak kaldırılan kökün içeriğini yönetmeyi "durdurmasını" söylemeniz gerekir. Aksi takdirde, kaldırılan kökün içindeki bileşenler, abonelikler gibi global kaynakları temizlemeyi ve boşaltmayı bilemez.

`root.unmount` çağrısı, ağaçtaki tüm olay yöneticilerini veya state'i kaldırmak da dahil olmak üzere, kökteki tüm bileşenleri DOM'dan kaldıracak ve React'i kök DOM düğümünden "ayıracaktır".


#### Parametreler {/*root-unmount-parameters*/}

`root.unmount` herhangi bir parametre kabul etmez.


#### Döndürülenler {/*root-unmount-returns*/}

`root.unmount` `undefined` döndürür.

#### Uyarılar {/*root-unmount-caveats*/}

* `root.unmount` çağrısı, ağaçtaki tüm bileşenleri DOM'dan kaldıracak ve React'i kök DOM düğümünden "ayıracaktır".

* Bir kez `root.unmount` çağrısı yaptığınızda, aynı kök üzerinde tekrar `root.render` çağrısı yapamazsınız. Bağlanmamış bir kök üzerinde `root.render` çağrılmaya çalışıldığında "Bağlanmamış bir kök güncellenemiyor" hatası verilir. Ancak, aynı DOM düğümü için önceki kökün bağlantısı kaldırıldıktan sonra yeni bir kök oluşturabilirsiniz.

---

## Kullanım {/*usage*/}

### Tamamen React ile oluşturulmuş bir uygulamayı render etmek {/*rendering-an-app-fully-built-with-react*/}

Eğer uygulamanız tamamen React ile oluşturulmuşsa, uygulamanızın tamamı için tek bir kök oluşturun.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Genellikle bu kodu başlangıçta yalnızca bir kez çalıştırmanız gerekir. Bu işlem şunları yapacaktır:

1. HTML'nizde tanımlanan  <CodeStep step={1}>tarayıcı DOM</CodeStep> düğümünü bulun.
2. Uygulamanızın  <CodeStep step={2}>React bileşenini</CodeStep> içinde görüntüleyin.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Benim uygulamam</title></head>
  <body>
    <!-- Bu DOM düğümüdür -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Merhaba Dünya!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Bana {count} kere tıkladın 
    </button>
  );
}
```

</Sandpack>

**Eğer uygulamanız tamamen React ile oluşturulmuşsa, daha fazla kök oluşturmanız veya [`root.render`](#root-render)'ı tekrar çağırmanız gerekmez.** 

Bu noktadan itibaren React tüm uygulamanızın DOM'unu yönetecektir. Daha fazla bileşen eklemek için, [bunları `App` bileşeninin içine yerleştirin.](/learn/importing-and-exporting-components) Kullanıcı arayüzünü güncellemeniz gerektiğinde, bileşenlerinizin her biri bunu [state kullanarak yapabilir.](/reference/react/useState) DOM düğümünün dışında bir modal veya araç ipucu gibi ekstra içerik görüntülemeniz gerektiğinde, [bunu bir portal ile oluşturun.](/reference/react-dom/createPortal)

<Note>

HTML'niz boş olduğunda, uygulamanın JavaScript kodu yüklenip çalışana kadar kullanıcı boş bir sayfa görür:

```html
<div id="root"></div>
```

Bu çok yavaş hissettirebilir! Bunu çözmek için, bileşenlerinizden [sunucuda veya derleme sırasında] ilk HTML'yi oluşturabilirsiniz. (/reference/react-dom/server) Ardından ziyaretçileriniz JavaScript kodunun herhangi biri yüklenmeden önce metin okuyabilir, resimleri görebilir ve bağlantılara tıklayabilir. Bu optimizasyonu otomatik olarak yapan [bir framework kullanmanızı](/learn/start-a-new-react-project#production-grade-react-frameworks) öneririz. Ne zaman çalıştığına bağlı olarak buna *sunucu taraflı render etme (SSR)* veya *statik site oluşturma (SSG)* denir.

</Note>

<Pitfall>

**Sunucu taraflı render veya statik oluşturma kullanan uygulamalar `createRoot` yerine [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) çağırmalıdır.** React daha sonra DOM düğümlerini HTML'nizden yok etmek ve yeniden oluşturmak yerine *hydrate* edecektir (yeniden kullanacaktır).

</Pitfall>

---

### Kısmen React ile oluşturulan bir sayfa render etmek {/*rendering-a-page-partially-built-with-react*/}

Sayfanız [tamamen React ile oluşturulmamışsa](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), React tarafından yönetilen her bir üst düzey kullanıcı arayüzü parçası için bir kök oluşturmak üzere `createRoot` öğesini birden çok kez çağırabilirsiniz. Her kökte [`root.render`](#root-render) çağrısı yaparak her kökte farklı içerikler görüntüleyebilirsiniz.

Burada, index.html dosyasında tanımlanan iki farklı DOM düğümüne iki farklı React bileşeni render edilmiştir:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Benim uygulamam</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Bu paragraf React tarafından render edilmez (doğrulamak için index.html dosyasını açın).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Ana Sayfa</NavLink>
      <NavLink href="/about">Hakkında</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Yorumlar</h2>
      <Comment text="Merhaba!" author="Alper" />
      <Comment text="Nasılsın?" author="Erdoğan" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Ayrıca [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) ile yeni bir DOM düğümü oluşturabilir ve bunu dokümana manuel olarak ekleyebilirsiniz.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // Dokümanın herhangi bir yerine ekleyebilirsiniz
```

React ağacını DOM düğümünden kaldırmak ve onun tarafından kullanılan tüm kaynakları temizlemek için [`root.unmount`.](#root-unmount) çağırın.

```js
root.unmount();
```

Bu, çoğunlukla React bileşenleriniz farklı bir çatıda yazılmış bir uygulamanın içindeyse kullanışlıdır.

---

### Bir kök bileşenin güncellenmesi {/*updating-a-root-component*/}

Aynı kök üzerinde `render` fonksiyonunu birden fazla kez çağırabilirsiniz. Önceki render edilen ile bileşen ağaç yapısı eşleştiği sürece, React [state'i koruyacaktır.](/learn/preserving-and-resetting-state). Bu örnekte her saniyede tekrarlanan `render` çağrılarından kaynaklanan güncellemelerin yıkıcı olmadığına dikkat edin. Örneğin girdi kutusuna yazı yazıyorsunuz:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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
      <h1>Merhaba Dünya! {counter}</h1>
      <input placeholder="Buraya bir şeyler yazın" />
    </>
  );
}
```

</Sandpack>

Birden fazla kez `render` çağrısı yapmak nadirdir. Genellikle bileşenleriniz bunun yerine [state güncellemesi](/reference/react/useState) yapacaktır.

---
## Sorun Giderme {/*troubleshooting*/}

### Bir kök oluşturdum, fakat hiçbir şey görüntülenmiyor. {/*ive-created-a-root-but-nothing-is-displayed*/}

Uygulamanızı kök içine gerçekten render etmeyi unutmadığınızdan emin olun:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Bunu yapana kadar hiçbir şey görüntülenmez.

---

### Bir hata alıyorum: "Hedef kapsayıcı bir DOM öğesi değil" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Bu hata, `createRoot` öğesine aktardığınız şeyin bir DOM düğümü olmadığı anlamına gelir.

Ne olduğundan emin değilseniz, yazdırmayı(log) deneyin:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Örneğin, `domNode` `null` ise, [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) `null` döndürmüş demektir. Bu, çağrınız sırasında dokümanda verilen kimliğe sahip bir düğüm yoksa gerçekleşir. Bunun birkaç nedeni olabilir:

1. Aradığınız ID, HTML dosyasında kullandığınız ID'den farklı olabilir. Yazım hatalarını kontrol edin!
2. Paketinizin `<script>` etiketi, HTML'de kendisinden *sonra* görünen herhangi bir DOM düğümünü "göremez".

Bu hatayı almanın bir başka yaygın yolu da `createRoot(domNode)` yerine `createRoot(<App />)` yazmaktır.

---

### Bir hata alıyorum: "Fonksiyonlar bir React alt elemanı olarak geçerli değildir." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Bu hata, `root.render`a aktardığınız şeyin bir React bileşeni olmadığı anlamına gelir.

Bu, `root.render` öğesini `<Component />` yerine `Component` ile çağırırsanız meydana gelebilir:

```js {2,5}
// 🚩 Yanlış: App bir fonksiyondur, Bileşen değildir.
root.render(App);

// ✅ Doğru: <App /> bir bileşendir.
root.render(<App />);
```

Veya `root.render`'a fonksiyonu çağırmanın sonucu yerine fonksiyonun kendisini iletirseniz:

```js {2,5}
// 🚩 Yanlış: createApp bir fonksiyondur, bileşen değildir.
root.render(createApp);

// ✅ Doğru: Bir bileşen döndürmek için createApp'i çağırın.
root.render(createApp());
```

---

### Sunucu tarafından render edilen HTML'im sıfırdan yeniden oluşturuluyor {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Uygulamanız sunucu tarafından render ediliyorsa ve React tarafından oluşturulan ilk HTML'yi içeriyorsa, bir kök oluşturmanın ve `root.render` çağrısının tüm bu HTML'yi sildiğini ve ardından tüm DOM düğümlerini sıfırdan yeniden oluşturduğunu fark edebilirsiniz. Bu daha yavaş olabilir, odak ve kaydırma konumlarını sıfırlayabilir ve diğer kullanıcı girdilerini kaybedebilir.

Sunucu tarafından render edilen uygulamalar `createRoot` yerine [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) kullanmalıdır:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

API'sinin farklı olduğunu unutmayın. Özellikle, başka bir `root.render` çağrısı genellikle gerçekleşmeyecektir.