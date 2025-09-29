---
title: useDeferredValue
---

<Intro>

`useDeferredValue`, kullanıcı arayüzünün belirli bir bölümünün güncellenmesini ertelemenizi sağlayan React Hook'udur.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Belirli bir değerin ertelenmiş (deferred) versiyonunu almak için bileşeninizin en üst kapsamında `useDeferredValue`'ı çağırın.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `value`: Ertelemek istediğiniz değer. Herhangi bir türde olabilir.
* **isteğe bağlı** `initialValue`: Bir bileşenin ilk render'ı sırasında kullanılacak bir değer. Bu seçenek atlanırsa, `useDeferredValue` ilk render sırasında erteleme yapmaz, çünkü yerine render edebileceği bir önceki `value` versiyonu yoktur.


#### Dönüş değeri {/*returns*/}

- `currentValue`: İlk render sırasında, döndürülen ertelenmiş değer `initialValue` olacaktır veya sağladığınız değerle aynı olur. Güncellemeler sırasında, React önce eski değerle yeniden render yapmayı dener (bu yüzden eski değeri döndürecektir), ardından arka planda yeni değerle bir başka yeniden render yapmayı dener (bu yüzden güncellenmiş değeri döndürecektir).

#### Dikkat edilmesi gerekenler {/*caveats*/}

- Bir güncelleme Transition içinde olduğunda, güncelleme zaten ertelendiği için, `useDeferredValue` daima yeni `value` değerini döner ve ertelenmiş bir render oluşturmaz. 

- `useDeferredValue`'ya geçtiğiniz değerler, ilkel değer (örn. string ya da number) veya render dışında oluşturulan nesneler olmalıdır. Render esnasında yeni bir nesne oluşturur ve bunu direkt `useDeferredValue`'ya iletirseniz, her render'da farklı olur. Bu da gereksiz arka plan render'larına neden olacaktır.

- `useDeferredValue` farklı bir değer aldığında ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırılarak karar verilir), mevcut render'a (hala önceki değeri kullandığı) ek olarak, arkaplanda yeni değerle render planlar. Arka planda gerçekleşen bu render kesintiye uğrayabilir: `value` için başka bir güncelleme olursa React render'a sıfırdan başlar. Örneğin, kullanıcı formdaki girdiye ertelenmiş değeri alan grafiğin yeniden render'lanmasına fırsat vermeyecek kadar hızlı yazıyorsa, grafik yalnızca kullanıcı yazmayı bıraktıktan sonra yeniden render edilir.

- `useDeferredValue`, [`<Suspense>`](/reference/react/Suspense) ile entegredir. Yeni bir değerin sebep olduğu arkaplan güncellemesi UI'yı askıya aldığında, kullanıcı fallback'i görmez. Veriler yüklenene kadar eski değeri görürler.

- `useDeferredValue`, tek başına ekstra ağ isteklerini engellemez.

- `useDeferredValue` Hook'unun sebep olduğu sabit bir gecikme yoktur. React orjinal render işlemini bitirir bitirmez, hemen yeni değerle arkaplanda render işlemine başlar. Olayların sebep olduğu güncellemeler (örn. yazma), arkaplanda yeniden render işlemini kesintiye uğratarak önceliklendirilirler.

- `useDeferredValue`'dan kaynaklanan arkaplan render işlemi, ekrana işlenene kadar Efektleri tetiklemez. Arka planda gerçekleşen render askıya alınırsa, Efektler veriler yüklendikten ve kullanıcı arayüzü güncellendikten sonra çalıştırılır.

---

## Kullanım {/*usage*/}

### Taze içerik yüklenirken eski içeriğin gösterilmesi {/*showing-stale-content-while-fresh-content-is-loading*/}

Kullanıcı arayüzünüzün bazı bölümlerinin güncellenmesini ertelemek için bileşeninizin en üst kapsamında  `useDeferredValue` çağırın.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

İlk render esnasında, <CodeStep step={2}>ertelenmiş değer</CodeStep> ile sağladığınız <CodeStep step={1}>değer</CodeStep> aynı olacaktır.

Güncellemeler esnasında, <CodeStep step={2}>ertelenmiş değer</CodeStep> en son <CodeStep step={1}>değerin</CodeStep> "gerisinde" kalır. React ilk seferde ertelenmiş değeri *güncellemeden* render eder, ardından yeni değerle arka planda yeniden render işlemi planlar.

**Bunun ne zaman faydalı olabileceğini görmek için bir örnek üzerinden ilerleyelim.**

<Note>

Bu örnekte Suspense etkinleştirilmiş veri kaynaklarından birini kullandığınız varsayılmaktadır:

- Suspense'in etkinleştirildiği çerçevelerle veri çekme [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ve [Next.js](https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense)
- [`lazy`](/reference/react/lazy) ile bileşen kodunun lazy yüklenmesi
- [`use`](/reference/react/use) ile bir Promise'in değerini okuma.

[Suspense ve sınırlamaları hakkında daha fazla bilgi edinin.](/reference/react/Suspense)

</Note>


Bu örnekte, `SearchResults` bileşeni arama sonuçları çekilirken [askıya alınır](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading). `"a"` yazmayı deneyin. Ardından sonuçları bekleyip `"ab"` olarak düzenleyin. `"a"`'nın sonuçları, yükleme fallback'iyle değiştirilir.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Albüm ara:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Yükleniyor...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Not: Veri çekme işlemi, birlikte kullandığınız framework'e bağlıdır
// ve Suspense ile birlikte çalışır.
// Normalde, önbellekleme mantığı bir framework içinde yer alır.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Uygulanmadı');
  }
}

async function getSearchResults(query) {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Yaygın bir alternatif UI pattern, sonuçlar listesini güncellemeyi *defer* etmek ve yeni sonuçlar hazır olana kadar önceki sonuçları göstermeye devam etmektir. `useDeferredValue` çağırarak sorgunun *deferred* bir versiyonunu aşağıya iletebilirsin:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Albüm ara:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Yükleniyor...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` hemen güncelleneceği için girdi yeni değeri gösterir. Ancak, veri yüklenene kadar `deferredQuery` önceki değerini korur ve `SearchResults` bir süre boyunca eski sonuçları göstermeye devam eder.

Aşağıdaki örnekte `"a"` yazın, sonuçların yüklenmesini bekleyin ve ardından girdiyi `"ab"` olarak düzenleyin. Yeni sonuçlar yüklenene kadar Suspense fallback'in yerine eski sonuç listesinin görüntülendiğine dikkat edin:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Albüm ara:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Yükleniyor...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Not: Veri çekme işlemi, birlikte kullandığınız framework'e bağlıdır
// ve Suspense ile birlikte çalışır.
// Normalde, önbellekleme mantığı bir framework içinde yer alır.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
// Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### Değer ertelemek arkaplanda nasıl çalışır? {/*how-does-deferring-a-value-work-under-the-hood*/}

Bunu iki adımda gerçekleşen bir süreç olarak düşünebilirsiniz:

<<<<<<< HEAD
1. **İlk olarak, React yeni `query` (`"ab"`) ancak eski `deferredQuery` (hala `"a")` ile yeniden render gerçekleştirir.** Sonuç listesine ilettiğiniz `deferredQuery` değeri *ertelenmiştir:* `query` değerinin "gerisindedir".
=======
1. **First, React re-renders with the new `query` (`"ab"`) but with the old `deferredQuery` (still `"a"`).** The `deferredQuery` value, which you pass to the result list, is *deferred:* it "lags behind" the `query` value.
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

2. **Arka planda, React `query` ve `deferredQuery`'nin *her ikisini de* `"ab"` olarak yeniden render etmeye çalışır.** Bu render tamamlandığında, React ekranda gösterir. Ancak askıya alınırsa (`"ab"`'nin sonuçları henüz yüklenmediyse), React render'dan vazgeçer ve veriler yüklendikten sonra tekrar render etmeyi dener. Kullanıcı, veriler hazır olana kadar eski ertelenmiş değeri görmeye devam eder.

Ertelenmiş "arkaplan" render işlemi kesintiye uğrayabilir. Örneğin, girdiyi tekrar yazdığınızda React render'dan vazgeçer ve yeni değerle yeniden render etmeyi dener. Daima en son sağlanan değer kullanılır.

Klavyeye her bastığınızda hala ağ isteği atılacağını unutmayın. Burada ertelenen şey; ağ isteklerinin ertelenmesi değil, sonuçların görüntülenmesidir (hazır olana kadar). Kullanıcı yazmaya devam etse bile tuşa her bastığınızda yanıt (response) önbelleğe alınır. Bu nedenle Backspace tuşuna basmak anlık olarak gerçekleşir ve veri tekrar çekilmez.

</DeepDive>

---

### İçeriğin eski olduğunu belirtme {/*indicating-that-the-content-is-stale*/}

Yukarıdaki örnekte, en son sorgu için sonuç listesinin hala yüklenmekte olduğuna dair herhangi bir gösterge yoktur. Yeni sonuçların yüklenmesi zaman alıyorsa, kullanıcı için kafa karıştırıcı durumlar oluşabilir. Sonuç listesinin en son sorgu ile güncellenmediğini kullanıcıya daha belirgin hale getirmek için, eski sonuç listesi görüntülenirken görsel bir gösterge ekleyebilirsiniz:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Bu değişiklikle birlikte, yazmaya başladığınız anda yeni sonuç listesi yüklenene kadar eski liste karartılır. Karartmayı daha yumuşak hissettirmek için aşağıdaki örnekte olduğu gibi CSS geçiş efekti ekleyebilirsiniz:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Albüm ara:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Yükleniyor...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Not: Veri çekme işlemi, birlikte kullandığınız framework'e bağlıdır
// ve Suspense ile birlikte çalışır.
// Normalde, önbellekleme mantığı bir framework içinde yer alır.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
 // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### Kullanıcı arayüzünün bir kısmı için yeniden render'ı erteleme {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue`'ı performans optimizasyonu olarak da uygulayabilirsiniz. Kullanıcı arayüzünüzün bir bölümünün yeniden işlenmesi yavaş olduğunda, optimize etmenin kolay bir yolu olmadığında ve kullanıcı arayüzünün geri kalanını engellemesini önlemek istediğinizde kullanışlıdır.

Bir metin girdinizin olduğunu ve her tuşa bastığınızda yeniden render edilen bileşeninizin (grafik ya da uzun bir liste gibi) olduğunu düşünün:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

İlk olarak, prop'ları aynı olduğunda `SlowList`'in yeniden render edilmesini atlayacak şekilde optimize edin. Bunu yapmak için, [`memo`'ya sarın:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Ancak, bu yalnızca `SlowList` prop'ları önceki render'dakiyle *aynı* ise yardımcı olur. Şu an karşılaştığınız sorun, prop'lar *farklı* olduklarında ve farklı çıktı göstermeniz gerektiğinde yavaş olmasıdır.

Temel performans sorunu, girdiye her yazdığınızda `SlowList`'in yeni prop alması ve tüm ağacın yeniden render olmasından dolayı yazmayı hantal hissettirmesidir. Bu durumda `useDeferredValue`, girdinin güncellenmesini (hızlı olması gerekir) sonuç listesinin güncellenmesine (daha yavaş olmasına izin verilir) göre önceliklendirmenizi sağlar:

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Bu değişiklik, `SlowList` bileşeninin yeniden render edilmesini hızlandırmaz. Fakat, React'e listenin yeniden render edilme önceliğinin düşürülebileceğini ve böylece tuşa basışları engellemeyeceğini belirtir. Liste girdinin "gerisinde kalır" ve sonra "yakalar". Daha önce olduğu gibi, React listeyi mümkün olan en kısa sürede güncellemeye çalışır ancak bunu yaparken kullanıcının yazmaya devam etmesini engellemez.

<Recipes titleText="useDeferredValue ve optimize edilmemiş render arasındaki fark" titleId="examples">

#### Listenin yeniden render'ının ertelenmesi {/*deferred-re-rendering-of-the-list*/}

Bu örnekte, `SlowList` bileşenindeki her bir öğe **yapay olarak yavaşlatılmıştır**. Böylece `useDeferredValue`'nun etkisini rahatça görebilirsiniz. Girdiye yazın ve liste "geride kalırken" yazış hissinin ne kadar akıcı hissettirdiğine dikkat edin.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Bir kez logla. Gerçek yavaşlama SlowItem içinde.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
   // Her öğe için 1 ms hiçbir şey yapma, aşırı yavaş kodu taklit etmek için.
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Listenin optimize edilmemiş şekilde yeniden render edilmesi {/*unoptimized-re-rendering-of-the-list*/}

Bu örnekte, `SlowList` bileşenindeki her bir öğe **yapay olarak yavaşlatılmıştır** ancak `useDeferredValue` yoktur.

Girdiye yazmanın ne kadar kötü hissettirdiğine dikkat edin. Bunun nedeni, `useDeferredValue` olmadığı için her tuşa basışın tüm listeyi kesintiye uğratmadan, anında yeniden oluşturmaya zorlamasıdır.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Yalnızca yazdırılır. Asıl yavaşlatma SlowItem içindedir.
  console.log('[YAPAY YAVAŞLATMA] 250 <SlowItem /> render ediliyor');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ekstrem biçimde yavaş kodu simüle etmek için öğe başına 1 ms bekletir
  }

  return (
    <li className="item">
      Metin: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Bu optimizasyon, `SlowList` bileşeninin [`memo`](/reference/react/memo)'ya sarmalanmasını gerektirir. Bunun nedeni, `text` her değiştiğinde React'in üst bileşeni hızlıca yeniden render etmesi gerektiğidir. Yeniden render işlemi sırasında, `deferredText`'in hala önceki değere sahiptir ve bu nedenle `SlowList` render işlemini atlayabilir (prop'ları aynıdır). [`memo`](/reference/react/memo) olmasaydı, yeniden render etmek zorunda kalır ve optimizasyonun amacından sapardı.

</Pitfall>

<DeepDive>

#### Bir değeri ertelemenin `debouncing` ve `throttling`'den farkı nedir? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Bu senaryoda daha önce kullanmış olabileceğiniz iki yaygın optimizasyon tekniği vardır:

- *Debouncing*, listeyi güncellemeden önce kullanıcının yazmayı bırakmasını (örneğin bir saniyeliğine) bekleyeceğiniz anlamına gelir.
- *Throttling*, listeyi arada bir (örneğin saniyede en fazla bir kere) güncelleyeceğiniz anlamına gelir.

Bu teknikler bazı durumlarda yardımcı olsa da, `useDeferredValue` React ile entegre olduğu ve kullanıcının cihazına uyum sağladığı için render'ı optimize etmeye daha uygundur.

Debouncing ve throttling'in aksine herhangi bir sabit gecikme belirlenmesi gerekmez. Kullanıcının cihazı hızlıysa (örneğin güçlü bir dizüstü bilgisayara sahipse), ertelenmiş yeniden render anında gerçekleşir ve fark edilmez. Kullanıcının cihazı yavaşsa, liste cihazın yavaşlığıyla orantılı olarak girdinin "gerisinde" kalır.

Ayrıca, debouncing ve throttling'in aksine, `useDeferredValue` tarafından yapılan ertelenmiş render işlemi kesintiye uğratılabilir. Büyük bir liste yeniden render edilirken kullanıcı başka tuşa basarsa, React mevcut render'ı iptal eder ve başka bir yeniden render tetikler. Buna karşın, debouncing ve throttling kötü bir deneyim sağlar çünkü yalnızca basılan tuşun render'ı blokladığı anı ertelerler.

Optimize ettiğiniz iş render esnasında gerçekleşmiyorsa, debouncing ve throttling hala yararlıdır. Örneğin, daha az ağ isteği göndermenizi sağlayabilirler. Bu teknikleri birlikte de kullanabilirsiniz.

</DeepDive>
