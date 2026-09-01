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

#### Props {/*props*/}
* `children`: Render etmek istediğiniz gerçek UI. Eğer `children` rendering sırasında suspend olursa, Suspense boundary `fallback` render etmeye geçer.

* `fallback`: Gerçek UI henüz yüklenmeyi bitirmediyse, onun yerine render edilecek alternatif UI. Herhangi bir geçerli React node kabul edilir; ancak pratikte fallback genellikle loading spinner veya skeleton gibi hafif bir placeholder view’dur. `children` suspend olduğunda Suspense otomatik olarak `fallback`’e geçer, data hazır olduğunda tekrar `children`’a döner. Eğer `fallback` rendering sırasında suspend olursa, en yakın parent Suspense boundary’yi aktive eder.

* <ExperimentalBadge /> **optional** `defer`: Bir boolean. `true` olduğunda, içlerinde hiçbir şey suspend olmasa bile React önce `fallback`’i gösterebilir ve `children`’ı daha sonra render veya stream edebilir. Render edilmesi pahalı olan content için kullanın. Default değeri `false`’tur.

#### Uyarılar {/*caveats*/}

- Suspense, data’nın bir Effect veya event handler içinde fetch edildiğini detect etmez. Yalnızca [aşağıda listelenen durumlarda](#what-activates-a-suspense-boundary) aktive olur.

- React, ilk kez mount olamadan önce suspend olan render’lar için hiçbir state’i preserve etmez. Component yüklendiğinde, React suspended tree’yi sıfırdan yeniden render etmeyi dener.

- Suspense tree için content gösteriyorken tree tekrar suspend olursa, buna neden olan update [`startTransition`](/reference/react/startTransition) veya [`useDeferredValue`](/reference/react/useDeferredValue) tarafından oluşturulmadığı sürece `fallback` tekrar gösterilir.

- React, suspended content’i son reveal’dan itibaren ölçülen en fazla 300ms’de bir reveal eder. Bu pencere içinde ready olan boundary’ler tek tek değil, [birlikte reveal edilir](/blog/2025/10/01/react-19-2#batching-suspense-boundaries-for-ssr).

- React, tekrar suspend olduğu için zaten visible olan content’i hide etmek zorunda kalırsa, content tree içindeki [layout Effects](/reference/react/useLayoutEffect)’leri cleanup eder. Content tekrar gösterilmeye hazır olduğunda, React layout Effects’i tekrar çalıştırır. Bu, DOM layout’unu ölçen Effects’in content hidden durumdayken bunu yapmaya çalışmamasını sağlar.

- React, Suspense ile entegre olan **Streaming Server Rendering** ve **Selective Hydration** gibi under-the-hood optimizasyonlar içerir. Daha fazla bilgi edinmek için [mimari overview](https://github.com/reactwg/react-18/discussions/37) okuyun ve [teknik konuşmayı](https://www.youtube.com/watch?v=pj5N-Khihgc) izleyin.

- React, Suspense ile entegre olan **Streaming Server Rendering** ve **Selective Hydration** gibi under-the-hood optimizasyonlar içerir. Daha fazla bilgi edinmek için [mimari overview](https://github.com/reactwg/react-18/discussions/37) okuyun ve [teknik konuşmayı](https://www.youtube.com/watch?v=pj5N-Khihgc) izleyin.

---

### Suspense boundary’yi ne aktive eder? {/*what-activates-a-suspense-boundary*/}

Bir Suspense boundary, content’ini reveal etmeden önce onun hazır olmasını bekler. Aşağıdakilerden herhangi biri, bir boundary’nin content’ini reveal etmesini engeller:

- [`lazy`](/reference/react/lazy) ile component code’unu lazy-load etmek.

- [Server Components](/reference/rsc/server-components)’tan stream edilen veya [Suspense-enabled framework](#suspense-enabled-frameworks) üzerinden yüklenen data dahil olmak üzere, [`use`](/reference/react/use) ile bir Promise okumak.

- [`<link rel="stylesheet">` ve bir `precedence` prop’u](/reference/react-dom/components/link#special-rendering-behavior) ile render edilen bir stylesheet’i yüklemek. React, stylesheet yüklenene kadar, bir timeout’a kadar boundary’yi block eder. [Aşağıdaki örneğe bakın.](#waiting-for-a-stylesheet-to-load)

- Streaming server rendering sırasında büyük bir boundary’nin HTML’inin gelmesini beklemek. HTML göndermek zaman alır; bu yüzden yeterince content içeren bir boundary, içinde hiçbir şey suspend olmasa bile aktive olur. React, HTML geldikçe content’i reveal eder.

- <CanaryBadge /> Font yüklemek. Suspense default olarak font’ları beklemez, ancak bir [`<ViewTransition>`](/reference/react/ViewTransition) update’i, text’in fallback font ile flash etmemesi için yeni font’ların yüklenmesini bir timeout’a kadar bekler. [Aşağıdaki örneğe bakın.](#waiting-for-a-font-to-load)

- <CanaryBadge /> Image yüklemek. Suspense default olarak image’ları beklemez, ancak bir [`<ViewTransition>`](/reference/react/ViewTransition) update’i sırasında React, image yüklenene kadar, bir timeout’a kadar boundary’yi block eder. `onLoad` handler eklemek belirli bir image’ı bu davranışın dışına çıkarır. [Aşağıdaki örneğe bakın.](#waiting-for-an-image-to-load)

- <ExperimentalBadge /> Bir [`<Suspense defer>`](#props) boundary’si içinde CPU-bound render work gerçekleştirmek.

<Note>

#### Suspense-enabled framework’ler {/*suspense-enabled-frameworks*/}

Bir **Suspense-enabled framework**, component’inizde data’yı en yakın Suspense boundary’yi aktive edecek şekilde okumanız için bir yol sağlar. Data’nızı tam olarak nasıl load edeceğiniz framework’ünüze bağlıdır ve detayları onun documentation’ında bulursunuz. Under the hood, Suspense-enabled bir framework Promise’lerden oluşan bir cache tutar ve bir Promise üzerinde suspend olmak için [`use`](/reference/react/use) çağırır.

Framework olmadan, Promise [render’lar arasında aynı instance yeniden kullanılacak şekilde cache’lendiği](/reference/react/use#caching-promises-for-client-components) sürece doğrudan `use` ile bir Promise okuyabilirsiniz.

</Note>

---

## Usage {/*usage*/}

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
// Not: Veri çekme işlemini yapma şekliniz, birlikte kullandığınız framework'e bağlıdır
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
 // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
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

Buna karşılık, bir Effect içinde olduğu gibi `use` dışında data fetch eden code, boundary’yi aktive etmez:

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
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import EffectAlbums from './EffectAlbums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <EffectAlbums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/EffectAlbums.js
import { useState, useEffect } from 'react';
import { fetchData } from './data.js';

export default function EffectAlbums({ artistId }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let active = true;
    fetchData(`/${artistId}/albums`).then(result => {
      if (active) {
        setAlbums(result);
      }
    });
    return () => {
      active = false;
    };
  }, [artistId]);

  // Suspense can't see this fetch, so its fallback never
  // shows. The list stays empty until the data arrives.
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

During streaming server rendering, a boundary also activates while its HTML is still streaming in. With any streaming server rendering API, React sends [the shell](/reference/react-dom/server/renderToPipeableStream#specifying-what-goes-into-the-shell) with the `fallback` first, then streams in each boundary's HTML and swaps out its `fallback` as that content arrives. Press "Render the page" to watch the page stream in:

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Streaming SSR</title>
</head>
<body>
  <button id="render">Render the page</button>
  <br /><br />
  <iframe id="container" style="width: 100%; height: 180px; border: 1px solid #aaa;"></iframe>
</body>
</html>
```

```js src/index.js
import { flushReadableStreamToFrame } from './demo-helpers.js';
import { Suspense, use } from 'react';
import { renderToReadableStream } from 'react-dom/server';

let posts = null;

function Posts() {
  const text = use(posts.promise);
  return <p>{text}</p>;
}

function ProfilePage() {
  return (
    <html>
      <body>
        <h1>Alice</h1>
        <p>Photographer and traveler.</p>
        <Suspense fallback={<p>⌛ Loading posts...</p>}>
          <Posts />
        </Suspense>
      </body>
    </html>
  );
}

async function main(frame) {
  posts = Promise.withResolvers();
  const stream = await renderToReadableStream(<ProfilePage />);

  // The posts resolve after the shell has streamed, so React
  // streams their HTML in and swaps out the fallback.
  setTimeout(() => {
    posts.resolve(
      'Just got back from two weeks along the coast. The drive ' +
      'was longer than expected, but every stop was worth it. ' +
      'A full write-up and more photos are coming soon.'
    );
  }, 1500);

  await flushReadableStreamToFrame(stream, frame);
}

document.getElementById('render').addEventListener('click', () => {
  main(document.getElementById('container'));
});
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    doc.write(decoder.decode(chunk, { stream: true }));
  }
  doc.close();
}
```

</Sandpack>

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
// Not: Veri çekme işlemini yapma şekliniz, birlikte kullandığınız framework'e bağlıdır
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles, 1960 yılında Liverpool’da kurulan,
    John Lennon, Paul McCartney, George Harrison
    ve Ringo Starr’dan oluşan bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
 // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
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

1. Eğer `Biography` henüz yüklenmediyse, `BigSpinner` tüm içerik alanının yerine gösterilir.
2. `Biography` yüklemeyi bitirdiğinde, `BigSpinner` içerikle yer değiştirilir.
3. Eğer `Albums` henüz yüklenmediyse, `AlbumsGlimmer` `Albums` ve onun üst bileşeni `Panel` yerine gösterilir.
4. Son olarak, `Albums` yüklemeyi bitirdiğinde, `AlbumsGlimmer` yerine geçer.

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
// Not: Veri çekme işlemini yapma şekliniz, birlikte kullandığınız framework'e bağlıdır
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, 1960 yılında Liverpool’da kurulan,
    John Lennon, Paul McCartney, George Harrison
    ve Ringo Starr’dan oluşan bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
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

Yaygın bir alternatif UI pattern’i, list’i update etmeyi *defer* etmek ve yeni sonuçlar hazır olana kadar önceki sonuçları göstermeye devam etmektir. [`useDeferredValue`](/reference/react/useDeferredValue) Hook’u, query’nin deferred bir version’ını aşağıya pass etmenizi sağlar:

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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, 1960 yılında Liverpool’da kurulan,
    John Lennon, Paul McCartney, George Harrison
    ve Ringo Starr’dan oluşan bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
// Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
// Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, 1960 yılında Liverpool’da kurulan,
    John Lennon, Paul McCartney, George Harrison
    ve Ringo Starr’dan oluşan bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles, 1960 yılında Liverpool’da kurulan,
    John Lennon, Paul McCartney, George Harrison
    ve Ringo Starr’dan oluşan bir İngiliz rock grubuydu.`;
}

async function getAlbums() {
  // Beklemeyi fark edilebilir hale getirmek için sahte bir gecikme ekleyin.
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

Bir Transition sırasında React, zaten reveal edilmiş content’i hide etmekten kaçınır. Ancak başka bir kullanıcının profili gibi **farklı** content’e navigate ettiğinizde, boundary’nin önceki content yerine fallback göstermesini istersiniz. Bunu bir `key` ile ifade edebilirsiniz:

```js
<ProfilePage key={queryParams.id} />
```

Farklı bir `key` ile React, profile’ları farklı content olarak ele alır ve navigation sırasında Suspense boundary’yi resetler. `key`, boundary’nin kendisine veya onun üstündeki bir component’e verilebilir. Suspense-integrated router’lar bunu otomatik olarak yapmalıdır.

Aşağıdaki örnekte, profile sayfasını açmak ilk profile’ı yükler. "Bob"a basmak farklı bir profile’a navigate eder ve `key` boundary’yi resetlediği için önceki kullanıcının bio’su yerine fallback gösterilir. `key`’i kaldırmayı deneyin: bir sonraki yüklenirken önceki bio görünür kalır:

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ProfilePage from './ProfilePage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return <ProfilePage />;
  }
  return (
    <button onClick={() => setShow(true)}>
      Open profile page
    </button>
  );
}
```

```js src/ProfilePage.js active
import { Suspense, useState, startTransition } from 'react';
import Bio from './Bio.js';
import { fetchBio } from './data.js';

export default function ProfilePage() {
  const [user, setUser] = useState(() => ({
    id: 'alice',
    bioPromise: fetchBio('alice'),
  }));
  function navigate(id) {
    startTransition(() => {
      setUser({ id, bioPromise: fetchBio(id) });
    });
  }
  return (
    <>
      <button onClick={() => navigate('alice')}>
        Alice
      </button>
      <button onClick={() => navigate('bob')}>
        Bob
      </button>
      <Suspense key={user.id} fallback={<p>⌛ Loading profile...</p>}>
        <Bio bioPromise={user.bioPromise} />
      </Suspense>
    </>
  );
}
```

```js src/Bio.js
import { use } from 'react';

export default function Bio({ bioPromise }) {
  const bio = use(bioPromise);
  return <p>{bio}</p>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchBio(userId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return userId === 'alice'
    ? 'Alice is a photographer and traveler.'
    : 'Bob collects vintage synthesizers.';
}
```

```css
button {
  margin-right: 8px;
}
```

</Sandpack>

---

### Sunucu hataları ve sadece istemcide olan içerik için bir fallback sağlama {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Eğer [stream'leyen sunucu render etme API'leri](/reference/react-dom/server)nden birini (ya da onlara bağlı bir framework) kullanıyorsanız, React sunucuda hataları ele almak için `<Suspense>` sınırlarınızı kullanacaktır. Eğer bir bileşen sunucuda bir hata throw ederse, React sunucu render'ını iptal etmeyecektir. Bunun yerine, onun üzerindeki en yakın `<Suspense>` bileşenini bulacak ve oluşturulan sunucu HTML'ine bileşenin fallback'ini (örneğin bir yükleniyor çarkı) dahil edecektir. Kullanıcı ilk olarak bir yükleniyor çarkı görecektir.

İstemci tarafında (client), React aynı bileşeni yeniden render etmeye çalışır.
Eğer istemci tarafında da hata oluşursa, React bu hatayı fırlatır (**throw**) ve en yakın [Error Boundary](/reference/react/Component#static-getderivedstatefromerror) bileşenini gösterir. Ancak, istemci tarafında hata oluşmazsa, React kullanıcıya hatayı göstermez;
çünkü içerik sonuçta başarılı bir şekilde görüntülenmiştir.

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

### Waiting for a stylesheet to load {/*waiting-for-a-stylesheet-to-load*/}

[`<link rel="stylesheet">` ve bir `precedence` prop’u](/reference/react-dom/components/link#special-rendering-behavior) ile render edilen bir stylesheet, content’in unstyled görünmemesi için stylesheet yüklenene kadar, bir timeout’a kadar Suspense boundary’yi block eder.

Aşağıdaki örnekte, `Card` component’i `precedence` ile bir stylesheet render eder. "Show card"a basın: React, stylesheet yüklenene kadar fallback’i gösterir ve ardından card’ı style’ları uygulanmış şekilde reveal eder.

Karşılaştırma için, ikinci button aynı update’i React olmadan, ayrı bir document içinde gerçekleştirir. Hiçbir şey stylesheet’i beklemez, bu yüzden card’ın text’i önce fallback font ile görünür ve ardından değişir:

<Sandpack>

```js
import { Suspense, useState, startTransition } from 'react';
import { freshStylesheetUrl } from './styles.js';
import VanillaCard from './VanillaCard.js';

function Card({ href }) {
  return (
    <>
      <link rel="stylesheet" href={href} precedence="default" />
      <div className="fancy-card">This card uses a font from the stylesheet.</div>
    </>
  );
}

export default function App() {
  const [href, setHref] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setHref(freshStylesheetUrl());
          });
        }}>
        Show card
      </button>
      {href && (
        <Suspense fallback={<p>⌛ Loading styles...</p>}>
          <Card href={href} />
        </Suspense>
      )}
      <hr />
      <VanillaCard />
    </>
  );
}
```

```js src/VanillaCard.js
import { useRef } from 'react';
import { freshStylesheetUrl } from './styles.js';

export default function VanillaCard() {
  const ref = useRef(null);
  function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; }
        .fancy-card {
          padding: 20px;
          border-radius: 8px;
          color: white;
          font-family: 'Caveat', sans-serif;
          font-size: 24px;
          background: linear-gradient(135deg, #087ea4, #2b3491);
        }
      </style>
      <div class="fancy-card">This card uses a font from the stylesheet.</div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show card (without React)</button>
      <iframe ref={ref} title="Vanilla card" className="vanilla-frame" />
    </>
  );
}
```

```js src/styles.js hidden
// Add a unique parameter so the stylesheet isn't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}
```

```css
#root {
  min-height: 300px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.fancy-card {
  margin-top: 1em;
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: 'Caveat', sans-serif;
  font-size: 24px;
  background: linear-gradient(135deg, #087ea4, #2b3491);
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 90px;
}
```

</Sandpack>

---

### <CanaryBadge /> Animating from Suspense content {/*animating-from-suspense-content*/}

Suspense composes with [`<ViewTransition>`](/reference/react/ViewTransition) to animate the swap from the fallback to the content. Wrap the boundary in a `<ViewTransition>`, and React treats the swap as an update, cross-fading between the fallback and the content by default:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Where you place the `<ViewTransition>` relative to the boundary determines whether the fallback and content cross-fade as one update or animate as separate exit and enter animations. You can also [customize the animation](/reference/react/ViewTransition#customizing-animations) with View Transition classes.

[Learn more about animating from Suspense content.](/reference/react/ViewTransition#animating-from-suspense-content)

</Note>

---

### <CanaryBadge /> Waiting for a font to load {/*waiting-for-a-font-to-load*/}

When a [`<ViewTransition>`](/reference/react/ViewTransition) animates a Suspense boundary's reveal, React waits for new fonts the content introduces, up to a timeout, so the text doesn't flash with a fallback font. This only happens during a `<ViewTransition>` update.

In the example below, the Suspense boundary is wrapped in a `<ViewTransition>`, and the `Quote` component suspends while its data loads. Rendering the quote starts its font download. React keeps the fallback visible until the font has loaded, so the quote appears already in its font.

For comparison, the second button performs the same update without React. Nothing waits for the font, so the text appears in a fallback font first and then switches:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshFontUrl } from './font.js';
import VanillaQuote from './VanillaQuote.js';

function Quote({ fontSrc }) {
  const quote = use(fetchQuote());
  return (
    <>
      <style href={fontSrc} precedence="default">
        {`@font-face {
          font-family: 'Fancy';
          src: url(${fontSrc}) format('truetype');
          font-display: swap;
        }`}
      </style>
      <p className="quote fancy">{quote}</p>
    </>
  );
}

export default function App() {
  const [fontSrc, setFontSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setFontSrc(freshFontUrl());
          });
        }}>
        Show quote
      </button>
      {fontSrc && (
        <ViewTransition>
          <Suspense fallback={<p className="quote">⌛ Loading quote...</p>}>
            <Quote fontSrc={fontSrc} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaQuote />
    </>
  );
}
```

```js src/VanillaQuote.js
import { useRef } from 'react';
import { freshFontUrl } from './font.js';

export default function VanillaQuote() {
  const ref = useRef(null);
  function show() {
    const style = document.createElement('style');
    style.textContent = `@font-face {
      font-family: 'VanillaFancy';
      src: url(${freshFontUrl()}) format('truetype');
      font-display: swap;
    }`;
    document.head.appendChild(style);
    ref.current.innerHTML = `<p class="quote vanilla-fancy">The best way to predict the future is to invent it.</p>`;
  }
  return (
    <>
      <button onClick={show}>Show quote (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/font.js hidden
// Add a unique parameter so the font isn't cached,
// and every run shows the loading state.
export function freshFontUrl() {
  return (
    'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat%5Bwght%5D.ttf' +
    '?t=' +
    Date.now()
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = null;

export function fetchQuote() {
  if (!cache) {
    cache = new Promise((resolve) => {
      // Add a fake delay to make waiting noticeable.
      setTimeout(() => {
        resolve(
          'The best way to predict the future is to invent it.'
        );
      }, 500);
    });
  }
  return cache;
}
```

```css
#root {
  min-height: 260px;
}
.quote {
  font-size: 20px;
  margin-top: 1em;
}
.fancy {
  font-family: 'Fancy', sans-serif;
}
.vanilla-fancy {
  font-family: 'VanillaFancy', sans-serif;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Waiting for an image to load {/*waiting-for-an-image-to-load*/}

When a [`<ViewTransition>`](/reference/react/ViewTransition) animates a Suspense boundary's reveal, React waits for visible images to load, up to a timeout, so the animation doesn't start with a half-loaded image. This only happens during a `<ViewTransition>` update. Adding an `onLoad` handler opts a specific image out, even inside a `<ViewTransition>`.

In the example below, the Suspense boundary is wrapped in a `<ViewTransition>` and shows a profile skeleton until the portrait has loaded.

For comparison, the second button performs the same update without React. Nothing waits for the image, so the card appears immediately and the image pops in when it loads:

<Sandpack>

```js
import { ViewTransition, Suspense, useState, startTransition } from 'react';
import { freshImageUrl } from './image.js';
import VanillaProfile from './VanillaProfile.js';

function Profile({ src }) {
  return (
    <div className="card">
      <img src={src} alt="Jack Pope" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [src, setSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setSrc(freshImageUrl());
          });
        }}>
        Show profile
      </button>
      {src && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile src={src} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfile />
    </>
  );
}
```

```js src/VanillaProfile.js
import { useRef } from 'react';
import { freshImageUrl } from './image.js';

export default function VanillaProfile() {
  const ref = useRef(null);
  function show() {
    ref.current.innerHTML = `<div class="card">
      <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
      <p>Jack Pope</p>
    </div>`;
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/image.js hidden
// Add a unique parameter so the image isn't cached,
// and every run shows the loading state.
export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Coordinating fonts, images, and stylesheets {/*coordinating-fonts-images-and-stylesheets*/}

A Suspense boundary can wait for data, stylesheets, fonts, and images at once. Waiting for fonts and images only happens during a [`<ViewTransition>`](/reference/react/ViewTransition) update. In the example below, the `ProfileCard` component suspends while its data loads, and renders a stylesheet with `precedence`, text in a new font, and a portrait. React keeps the skeleton visible while the data and the stylesheet load. The `<ViewTransition>` reveal then waits for the font and the image, so the card appears complete.

For comparison, the version without React loads the same data and shows every resource arriving on its own schedule:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import VanillaProfileCard from './VanillaProfileCard.js';

function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

function ProfileCardPlaceholder() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>
      {resources && (
        <ViewTransition>
          <Suspense fallback={<ProfileCardPlaceholder />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfileCard />
    </>
  );
}
```

```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export default function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Add a unique parameter so the resources aren't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchQuote() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

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
