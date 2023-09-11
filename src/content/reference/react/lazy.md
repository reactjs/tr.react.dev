---
title: lazy
---

<Intro>

`lazy`,  bileşen kodunun ilk kez render edilene kadar yüklenmesini ertelemek için kullanılır.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `lazy(load)` {/*lazy*/}

Lazy yüklenen React bileşeni tanımlamak için bileşenlerinizin dışında `lazy`'yi çağırın:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `load`: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya başka bir *thenable* (`then` metoduna sahip Promise benzeri bir nesne) döndürmeniz gerekir. React, dönen bileşeni ilk kez render etmeye yeltenene kadar `load`'ı çağırmaz. React `load`'ı ilk çağırdığında, çözümlenene (resolve) kadar bekler, ardından çözümlenmiş değeri React bileşeni olarak render eder. Hem Promise hem de Promise'in çözümlenmiş değeri ön belleğe (cache) alınacağından, React `load`'ı birden fazla kez çağırmaz. Promise reddedilirse (reject), React reddetme nedenini ele alması için `throw` ile en yakındaki Error Boundary'ye gönderir.

#### Dönüş değeri {/*returns*/}

`lazy`, ağacınıza render edebileceğiniz bir React bileşeni döndürür. Lazy bileşenin kodu yüklenirken, render etme işlemi *askıya alınır.* Yükleme esnasında yükleniyor göstergesi görüntülemek için [`<Suspense>`](/reference/react/Suspense) kullanın.


---

### `load` fonksiyonu {/*load*/}

#### Parametreler {/*load-parameters*/}

`load` parametre almaz.

#### Dönüş değerleri {/*load-returns*/}

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya başka bir *thenable* (`then` metoduna sahip Promise benzeri bir nesne) döndürmeniz gerekir. Bu nesne; fonksiyon, [`memo`](/reference/react/memo) ya da [`forwardRef`](/reference/react/forwardRef)'de olduğu gibi geçerli bir React bileşen tipine çözülmelidir.

---

## Kullanım {/*usage*/}

### Suspense ile lazy yüklenen bileşenler {/*suspense-for-code-splitting*/}

Bileşenlerinizi çoğunlukla statik [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) tanımıyla içe aktarırsınız:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Bileşen kodunun yüklenmesini ilk render'a  kadar ertelemek istiyorsanız, şu içe aktarmayla değiştirin:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Bu kod, [dinamik `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)'a dayanır. Kullanmak için paketleyicinizin (bundler) veya framework'ünüzün desteklemesi gerekir.

Artık bileşeninizin kodları talep edildiğinde (on demand) yüklendiğine göre, yüklenme aşamasında yerine neyin görüntüleneceğini belirtmeniz gerekir. Bunu, lazy bileşeni ya da üst bileşenlerinden birini [`<Suspense>`](/reference/react/Suspense) sınırına (boundary) sararak yapabilirsiniz:

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Ön İzleme</h2>
  <MarkdownPreview />
 </Suspense>
```

Bu örnekte, `MarkdownPreview`'ın kodu render edilene kadar yüklenmez. `MarkdownPreview` yüklenene kadar yerine `Loading` gösterilir. Onay kutusunu işaretlemeyi deneyin:

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Merhaba, **dünya**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Ön izlemeyi göster
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Ön İzleme</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Yükleniyor durumunu görebilmeniz için sabit bir gecikme ekleyin
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Yükleniyor...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Bu demo, yapay bir gecikmeyle yüklenir. Bileşen yüklendikten sonras işareti kaldırıp yeniden işaretlediğinizde `Preview` ön belleğe alındığı için yükleniyor durumu olmaz.  Yükleniyor durumunu yeniden görmek isterseniz, sandbox'daki "Sıfırla" butonuna tıklayın.

[Suspense ile yükleniyor durumlarını yönetmek hakkında daha fazla bilgi edinin.](/reference/react/Suspense)

---

## Sorun giderme {/*troubleshooting*/}

### `lazy` bileşenimdeki state'ler beklenmedik şekilde sıfırlanıyor {/*my-lazy-components-state-gets-reset-unexpectedly*/}

`lazy` bileşenleri diğer bileşenlerin *içerisinde* tanımlamayın:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Kötü: Bu yeniden render'larda tüm state'lerin sıfırlanmasına neden olur
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Bunun yerine daima modülünüzün en üst kapsamında tanımlayın:

```js {3-4}
import { lazy } from 'react';

// ✅ Güzel: Lazy bileşenleri bileşenlerinizin dışında tanımlayın
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
