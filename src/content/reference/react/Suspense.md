---
title: <Suspense>
---

<Intro>

`<Suspense>` alt elemanları yüklenene kadar bir alternatif (fallback) göstermenize olanak sağlar.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Prop'lar {/*props*/}
* `children`: Render etmek istediğiniz asıl kullanıcı arayüzüdür. Eğer `children` render edilirken askıya alınırsa, Suspense sınırı `fallback`'i render etmeye geçer.
* `fallback`: Eğer asıl kullanıcı arayüzünün yüklemesi tamamlanmamışsa, onun yerine render edilecek alternatif bir kullanıcı arayüzüdür. Herhangi geçerli React düğümü kabul edilir, ancak pratikte, bir fallback hafif bir yer tutucu görünümdür, örneğin bir yükleniyor göstergesi ya da iskelet. Suspense, `children` askıya alındığında otomatik olarak `fallback`'e geçer ve veri hazır olduğunda `children`'a geri döner. Eğer `fallback` render edilirken askıya alınırsa, en yakın üst Suspense sınırını etkinleştirir.

#### Uyarılar {/*caveats*/}

- React ilk kez yüklenemeden önce askıya alınan renderlar için herhangi bir state saklamaz. Bileşen yüklendikten sonra, React askıya alınmış ağacı sıfırdan yeniden render etmeye çalışacaktır.
- Eğer suspense ağaç için içerik gösteriyorduysa, ama sonrasında tekrar askıya alındıysa, askıya alınmayı tetikleyen güncelleme [`startTransition`](/reference/react/startTransition) veya [`useDeferredValue`](/reference/react/useDeferredValue) tarafından tetiklenmediyse, `fallback` tekrar gösterilecektir.
- Eğer React halihazırda gösterilen bir içeriği tekrar askıya alındığı için gizlemek zorunda kalırsa, içerik ağacındaki [layout Effect'lerini](/reference/react/useLayoutEffect) temizleyecektir. İçerik tekrar gösterilmeye hazır olduğunda, React layout Effect'leri tekrar tetikleyecektir. Bu, DOM layout'unu ölçen Effect'lerin içerik gizliyken bunu yapmaya çalışmamasını sağlar.
- React includes under-the-hood optimizations like *Streaming Server Rendering* and *Selective Hydration* that are integrated with Suspense. Read [an architectural overview](https://github.com/reactwg/react-18/discussions/37) and watch [a technical talk](https://www.youtube.com/watch?v=pj5N-Khihgc) to learn more.
- React *Server Render'ını Stream etme* ve *Selektif Hydrate Etme* gibi Suspense ile entegre olan altta yatan optimizasyonlar içerir. Daha fazla bilgi almak için [mimari bir bakışı](https://github.com/reactwg/react-18/discussions/37) okuyun ve [teknik bir konuşmayı](https://www.youtube.com/watch?v=pj5N-Khihgc) izleyin.

---

## Kullanım {/*usage*/}

### İçerik yüklenirken bir fallback gösterme {/*displaying-a-fallback-while-content-is-loading*/}

Uygulamanızın herhangi bir parçasını bir Suspense sınırıyla sarabilirsiniz:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React <CodeStep step={1}>yükleniyor fallback'inizi</CodeStep> <CodeStep step={2}>alt elemanların</CodeStep> ihtiyaç duyduğu tüm kod ve veriler yüklenene kadar gösterecektir.

Aşağıdaki örnekte, `Albums` bileşeni albümler listesini fetch ederken *askıya alınır*. Render etmeye hazır olana kadar, React fallback'i --sizin `Loading` bileşeniniz-- göstermek için en yakın Suspense sınırını etkinleştirir. Sonra, veri yüklendiğinde, React `Loading` fallback'ini gizler ve `Albums` bileşenini verilerle render eder.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        The Beatles sanatçı sayfasını aç
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Yükleniyor...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

<Note>

**Sadece Suspense özellikli veri kaynakları Suspense bileşenini aktive edecektir.** Bunlara örnek olarak:

<<<<<<< HEAD
- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ve [Next.js](https://nextjs.org/docs/getting-started/react-essentials) gibi Suspense özellikli framework'lerle veri fetch etme.
- [`lazy`](/reference/react/lazy) ile bileşen kodunu tembel yükleme (lazy-loading).
- [`use`](/reference/react/use) ile bir Promise'in değerini okuma.
=======
- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)
- Reading the value of a cached Promise with [`use`](/reference/react/use)
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

Suspense, veri bir effect ya da olay yöneticisi içinde fetch edildiğinde **tespit etmez**.

Yukarıdaki `Albums` bileşeninin içinde veri yüklemek için kullanacağınız tam yol framework'ünüze bağlıdır. Eğer Suspense özellikli bir framework kullanıyorsanız, detayları framwork'ün veri fetch etme dokümantasyonunda bulabilirsiniz.

Kanaat sahibi bir framework olmadan Suspense özellikli veri fetch etme henüz desteklenmiyor. Suspense özellikli bir veri kaynağı implement etmenin gereksinimleri henüz düzensiz ve belgelenmemiş durumda. Veri kaynaklarını Suspense ile entegre etmek için resmi bir API, React'in gelecek sürümlerinde yayınlanacaktır. 

</Note>

---

### İçeriği tek seferde birlikte gösterme {/*revealing-content-together-at-once*/}

Varsayılan olarak, Suspense içindeki tüm ağaç tek bir birim olarak ele alınır. Örneğin, eğer bu bileşenlerden *sadece biri* veri beklemek için askıya alınırsa, *tümü* birlikte yükleniyor göstergesiyle değiştirilecektir:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Sonrasında, hepsi görüntülenmeye hazır olduğunda, hepsi birlikte tek seferde açığa çıkacaktır.

Aşağıdaki örnekte, hem `Biography` hem `Albums` veri fetch etmekte. Ancak, tek bir Suspense sınırı altında gruplandıkları için, bu bileşenler her zaman aynı anda "açığa çıkıyor".

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        The Beatles sanatçı sayfasını aç
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Yükleniyor...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles, Liverpool'da 1960'da 
    kurulmuş, John Lennon, Paul McCartney, 
    George Harrison ve Ringo Starr'dan oluşan
    bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Veri yükleyen bileşenler Suspense sınırının doğrudan alt elemanı olmak zorunda değildir. Örneğin, `Biography` ve `Albums`'ü yeni bir `Details` bileşenine taşıyabilirsiniz. Bu davranışı değiştirmez. `Biography` ve `Albums` en yakın ebeveyn Suspense sınırını paylaştığı için, açığa çıkışları birlikte koordine edilir.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### İç içe içeriği yüklendikçe açığa çıkarma {/*revealing-nested-content-as-it-loads*/}

Bir bileşen askıya alındığında, en yakın üst Suspense sınırı fallback'i gösterir. Bu, bir yükleme sekansı oluşturmak için birden fazla Suspense sınırını iç içe geçirebilmenizi sağlar. Her Suspense sınırının fallback'i, bir sonraki içerik seviyesi kullanılabilir hale geldikçe doldurulur. Örneğin, albüm listesine kendi fallback'ini verebilirsiniz:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Bu değişiklikle birlikte, `Biography`'i göstermek `Albums`'ün yüklenmesini "beklemek" zorunda değildir.

Sekans şu şekilde olacaktır:

<<<<<<< HEAD
1. Eğer `Biography` henüz yüklenmediyse, `BigSpinner` tüm içerik alanının yerine gösterilir.
1. `Biography` yüklenmeyi tamamladığında, `BigSpinner` içerik ile değiştirilir.
1. Eğer `Albums` henüz yüklenmediyse, `AlbumsGlimmer` `Albums` ve üst elemanı `Panel`'in yerine gösterilir.
1. Son olarak, `Albums` yüklenmeyi tamamladığında, `AlbumsGlimmer`'ın yerine geçer.
=======
1. If `Biography` hasn't loaded yet, `BigSpinner` is shown in place of the entire content area.
2. Once `Biography` finishes loading, `BigSpinner` is replaced by the content.
3. If `Albums` hasn't loaded yet, `AlbumsGlimmer` is shown in place of `Albums` and its parent `Panel`.
4. Finally, once `Albums` finishes loading, it replaces `AlbumsGlimmer`.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        The Beatles sanatçı sayfasını aç
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Yükleniyor...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, Liverpool'da 1960'da 
    kurulmuş, John Lennon, Paul McCartney, 
    George Harrison ve Ringo Starr'dan oluşan
    bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Suspense sınırları kullanıcı arayüzünüzün hangi parçalarının her zaman birlikte "açığa çıkması" gerektiğini ve hangi parçaların yükleme durumları sekansı içerisinde progresif olarak daha fazla içerik açığa çıkarması gerektiğini koordine etmenizi sağlar. Suspense sınırlarını uygulamanızın geri kalanını etkilemeden ağaç içerisinde herhangi bir yere ekleyebilir, taşıyabilir ya da silebilirsiniz.

Her bileşenin etrafına bir Suspense sınırı koymayın. Suspense sınırları kullanıcıların deneyimlemesini istediğiniz yükleme sekansından daha tanecikli olmamalıdır. Eğer bir tasarımcı ile çalışıyorsanız, yükleme durumlarının nereye konulması gerektiğini sorun--muhtemelen zaten tasarım wireframe'lerine dahil etmişlerdir.

---

### Yeni içerik yüklenirken eski içeriği gösterme {/*showing-stale-content-while-fresh-content-is-loading*/}

Bu örnekte, `SearchResults` bileşeni arama sonuçlarını fetch ederken askıya alınır. `"a"` Yazın, sonuçları bekleyin ve daha sonra yazıyı `"ab"` olarak düzenleyin. `"a"` için gelen sonuçlar yükleme fallback'i ile değiştirilecektir.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Albümleri ara:
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
    return <p><i>"{query}"</i> için sonuç bulunamadı</p>;
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
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

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
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
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

Yaygın bir alternatif kullanıcı arayüzü modeli listeyi güncellemeyi *ertelemek* ve yeni sonuçlar hazır olana kadar önceki sonuçları göstermeye devam etmektir. [`useDeferredValue`](/reference/react/useDeferredValue) Hook'u sorgunun ertelenmiş bir sürümünü aşağıya geçirmenizi sağlar:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Albümleri ara:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Yükleniyor...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`sorgu` (query) hemen güncellenecektir, bu yüzden girdi yeni değeri gösterecektir. Ancak, `deferredQuery` veri yüklenene kadar önceki değerini koruyacaktır, bu yüzden `SearchResults` bir süreliğine eski sonuçları gösterecektir.

Kullanıcıya daha belli etmek için, eski sonuç listesinin gösterildiği zamanlarda görsel bir gösterge ekleyebilirsiniz:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Aşağıdaki örneğe `"a"` yazın, sonuçların yüklenmesini bekleyin, sonrasında girdiyi `"ab"` olarak değiştirin. Yeni sonuçlar yüklenene kadar Suspense fallback'i yerine soluklaşmış eski sonuç listesini gördüğünüze dikkat edin:


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
        Albümleri ara:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Yükleniyor...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p><i>"{query}" için bir sonuç bulunamadı</i></p>;
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
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

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
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
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

<Note>

Hem geciktirilmiş değerler hem de [transition'lar](#preventing-already-revealed-content-from-hiding) satır içi göstergeler lehine Suspense fallback'inden kaçınmanızı sağlar. Transition'lar tüm güncellemeyi acil olmayan olarak işaretlerler, bu yüzden genellikle framework'ler ve router kütüphaneleri tarafından navigasyon için kullanılırlar. Diğer yandan, geciktirilmiş değerler, genellikle bir kullanıcı arayüzü parçasını acil olmayan olarak işaretlemek ve onu kullanıcı arayüzünün geri kalanından "geride bırakmak" için uygulama kodunda kullanışlıdır.

</Note>

---

### Zaten açığa çıkmış içeriğin gizlenmesini önleme {/*preventing-already-revealed-content-from-hiding*/}

Bir bileşen askıya alındığında, en yakın Suspense sınırı fallback'i göstermeye geçer. Bu, zaten bir içerik gösteriliyorsa uyumsuz bir kullanıcı deneyimine yol açabilir. Bu düğmeye basmayı deneyin:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Yükleniyor...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Müzik Tarayıcısı
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles sanatçı sayfasını aç
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, Liverpool'da 1960'da 
    kurulmuş, John Lennon, Paul McCartney, 
    George Harrison ve Ringo Starr'dan oluşan
    bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Butona bastığınızda `Router` bileşeni `ArtistPage` sayfası yerine `IndexPage` sayfasını render etti. `ArtistPage` içerisindeki bir bileşen askıya alındı, bu yüzden en yakın Suspense sınırı fallback'i göstermeye başladı. En yakın Suspense sınırı köke yakındı, bu yüzden tüm site layout'u `BigSpinner` ile değiştirildi.

Bunu engellemek için, navigasyon state güncellemesini bir *geçiş* (transition) olarak [`startTransition`:](/reference/react/startTransition) ile işaretleyebilirsiniz:

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

Bu, React'e state transition'ının acil olmadığını, ve zaten açığa çıkmış içeriği gizlemek yerine önceki sayfayı göstermeye devam etmenin daha iyi olduğunu söyler. Şimdi butona basmak `Biography`'nin yüklenmesini "bekler":

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Yükleniyor...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Müzik Tarayıcısı
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles sanatçı sayfasını aç
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, Liverpool'da 1960'da 
    kurulmuş, John Lennon, Paul McCartney, 
    George Harrison ve Ringo Starr'dan oluşan
    bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Bir transition *tüm* içeriğin yüklenmesini beklemez. Zaten açığa çıkmış içeriği gizlemekten kaçınmak için ne kadar beklemesi gerekiyorsa o kadar bekler. Örneğin, web sitesinin `Layout`'u zaten açığa çıkmıştı, bu yüzden onu bir yükleniyor çarkının arkasına saklamak kötü olurdu. Bununla birlikte, `Albums`'ün etrafındaki iç içe geçmiş `Suspense` sınırı yeni olduğundan, transition onu beklemiyor.

<Note>

Suspense özellikli router'lar varsayılan olarak navigasyon durumu güncellemelerini transition'lara sararlar.

</Note>

---

### Transition'ın gerçekleştiğini gösterme {/*indicating-that-a-transition-is-happening*/}

Yukarıdaki örnekte, butona bastığınızda navigasyonun gerçekleştiğini gösteren bir görsel gösterge bulunmamakta. Bir gösterge eklemek için, [`startTransition`'ı](/reference/react/startTransition) [`useTransition`](/reference/react/useTransition) ile değiştirebilirsiniz, bu size bir boolean olan `isPending` değerini verecektir. Aşağıdaki örnekte, transition'ın gerçekleştiği sırada web sitesi başlığı stilini değiştirmek için `useTransition` kullanılmıştır:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Yükleniyor...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Müzik Tarayıcısı
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles sanatçı sayfasını aç
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, Liverpool'da 1960'da 
    kurulmuş, John Lennon, Paul McCartney, 
    George Harrison ve Ringo Starr'dan oluşan
    bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Navigasyon sırasında Suspense sınırlarını sıfırlama {/*resetting-suspense-boundaries-on-navigation*/}

Bir transition sırasında, React açığa çıkarılmış içeriği gizlemekten kaçınır. Ancak, bir sayfaya farklı parametrelerle giderseniz, React'e bunun *farklı* bir içerik olduğunu söylemek isteyebilirsiniz. Bunu bir `key` ile ifade edebilirsiniz:

```js
<ProfilePage key={queryParams.id} />
```

Bir kullanıcının profil sayfasına gitmeye çalıştığınızı hayal edin, ve bir şey askıya alınsın. Eğer bu güncelleme bir transition ile sarılırsa, zaten görünen içerik için fallback tetiklenmeyecektir. Bu beklenen davranıştır.

Ancak, şimdi iki farklı kullanıcı profili arasında geçiş yapmaya çalıştığınızı düşünün. Bu durumda, fallback'i göstermek mantıklı olacaktır. Örneğin, bir kullanıcının zaman çizelgesi başka bir kullanıcının zaman çizelgesinden *farklı içerik*'tir. Bir `key` belirterek, React'e farklı kullanıcıların profillerini farklı bileşenler olarak ele almasını ve navigasyon sırasında Suspense sınırlarını sıfırlamasını sağlarsınız. Suspense entegreli router'lar bunu otomatik olarak yapmalıdır. 

---

### Sunucu hataları ve sadece istemcide olan içerik için bir fallback sağlama {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Eğer [stream'leyen sunucu render etme API'leri](/reference/react-dom/server)nden birini (ya da onlara bağlı bir framework) kullanıyorsanız, React sunucuda hataları ele almak için `<Suspense>` sınırlarınızı kullanacaktır. Eğer bir bileşen sunucuda bir hata throw ederse, React sunucu render'ını iptal etmeyecektir. Bunun yerine, onun üzerindeki en yakın `<Suspense>` bileşenini bulacak ve oluşturulan sunucu HTML'ine bileşenin fallback'ini (örneğin bir yükleniyor çarkı) dahil edecektir. Kullanıcı ilk olarak bir yükleniyor çarkı görecektir.

İstemci tarafında, React aynı bileşeni tekrar render etmeyi deneyecektir. Eğer istemcide de hata verirse, React hatayı throw edip en yakın [hata sınırını](/reference/react/Component#static-getderivedstatefromerror) gösterecektir. Ancak, istemcide hata vermezse, React içeriği nihayetinde başarıyla görüntülediği için hatayı kullanıcıya göstermeyecektir.

Bunu bazı bileşenlerin sunucuda yüklenmemesini sağlamak için kullanabilirsiniz. Bunu yapmak için, sunucu ortamında bir hata throw edin ve ardından HTML'lerini fallback'lerle değiştirmek için `<Suspense>` sınırı içine alın:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat bileşeni sadece istemcide render edilmelidir.');
  }
  // ...
}
```

Sunucu HTML'i yükleniyor çarkını içerecektir. İstemci tarafında yükleniyor çarkı `Chat` bileşeni ile değiştirilecektir.

---

## Hata ayıklama {/*troubleshooting*/}

### Kullanıcı arayüzünün bir güncelleme sırasında bir fallback ile değiştirilmesini nasıl engellerim? {/*preventing-unwanted-fallbacks*/}

Görünür bir kullanıcı arayüzünü bir fallback ile değiştirmek, uyumsuz bir kullanıcı deneyimine sebep olur.  Bu, bir güncelleme bir bileşenin askıya alınmasına sebep olduğunda ve en yakın Suspense sınırı zaten kullanıcıya içerik gösteriyorsa olabilir.

Bunun olmasını engellemek için, [güncellemeyi `startTransition` ile acil olmayan olarak işaretleyin](#preventing-already-revealed-content-from-hiding). Bir transition sırasında, React istenmeyen bir fallback'in görünmesini engellemek için yeterli veri yüklenene kadar bekleyecektir:

```js {2-3,5}
function handleNextPageClick() {
  // Eğer bu güncelleme askıya alınırsa, zaten görünen içeriği gizleme
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Bu, varolan içeriği gizlemeyi önleyecektir. Ancak, yeni render edilen `Suspense` sınırları hala kullanıcı arayüzünü bloke etmemek ve kullanıcının içeriği hazır hale geldikçe görmesini sağlamak için hemen fallback gösterecektir.

**React sadece istenmeyen fallback'leri acil olmayan güncellemeler sırasında engeller**. Eğer acil bir güncelleme sonucunda gerçekleşiyorsa, bir render'ı geciktirmeyecektir. [`startTransition`](/reference/react/startTransition) veya [`useDeferredValue`](/reference/react/useDeferredValue) gibi bir API tercih etmeniz gerekecektir.

Eğer router'ınız Suspense ile entegre ise, güncellemelerini [`startTransition`'ın](/reference/react/startTransition) içerisine otomatik olarak sarması gerekmektedir.
