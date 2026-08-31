---
title: use
---

<Intro>

<<<<<<< HEAD
`use`, bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya [context](/learn/passing-data-deeply-with-context) değerini okumanızı sağlayan bir React API’sidir.
=======
`use` is a React API that lets you read a resource during rendering, such as a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `use(context)` {/*use-context*/}

Değerini okumak için `use`’u bir [context](/learn/passing-data-deeply-with-context) ile çağırın. [`useContext`](/reference/react/useContext)’in aksine, `use` loop’lar ve `if` gibi conditional statement’lar içinde çağrılabilir.

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```
Diğer React Hook'ların aksine, Döngülerin ve `if` gibi koşullu ifadeler içerisinde `use` kullanılabilir. Diğer React Hook'lar gibi, `use` kullanan fonksiyon bir Bileşen veya Hook olmalıdır.

[See more examples below.](#usage-context)

#### Parameters {/*context-parameters*/}

* `context`: A [context](/learn/passing-data-deeply-with-context) created with [`createContext`](/reference/react/createContext).

#### Returns {/*context-returns*/}

Geçirilen context için context value’yu döndürür; bu değer, çağrıyı yapan component’in üstündeki en yakın context provider tarafından belirlenir. Eğer provider yoksa, döndürülen değer [`createContext`](/reference/react/createContext)’e geçirilen `defaultValue` olur.

#### Uyarılar {/*context-caveats*/}

* `use`, bir Component veya Hook içinde çağrılmalıdır.
* `use` ile context okumak [Server Components](/reference/rsc/server-components) içinde desteklenmez.

---

### `use(promise)` {/*use-promise*/}

Resolved value’sunu okumak için `use`’u bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ile çağırın. `use` çağıran component, Promise pending durumdayken *suspend* olur. İsminin aksine, `use` bir Hook değildir. Hook’ların aksine, loop’lar ve `if` gibi conditional statement’lar içinde çağrılabilir.

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

`use` çağıran component bir [Suspense](/reference/react/Suspense) boundary’si ile sarılmışsa, Promise pending durumdayken fallback gösterilir. Promise resolve edildiğinde, Suspense fallback’i `use` tarafından döndürülen data’yı kullanan rendered component’lerle değiştirilir. Promise rejected olursa, en yakın [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)’nin fallback’i gösterilir.

[Daha fazla örneği aşağıda görün.](#usage-promises)

#### Parametreler {/*promise-parameters*/}

* `promise`: Resolved value’sunu okumak istediğiniz bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Promise, re-render’lar arasında aynı instance’ın yeniden kullanılabilmesi için [cache’lenmiş](#caching-promises-for-client-components) olmalıdır.

#### Returns {/*promise-returns*/}

Promise’in resolved value’su.

#### Uyarılar {/*promise-caveats*/}

* `use`, bir Component veya Hook içinde çağrılmalıdır.
* `use`, try-catch block’u içinde çağrılamaz. Bunun yerine, error’ı yakalamak ve fallback göstermek için component’inizi bir [Error Boundary](#displaying-an-error-with-an-error-boundary) ile sarın.
* `use`’a geçirilen Promise’ler, aynı Promise instance’ının re-render’lar arasında yeniden kullanılabilmesi için cache’lenmelidir. [Aşağıdaki Promise cache’leme bölümüne bakın.](#caching-promises-for-client-components)
* Bir Server Component’ten bir Client Component’e Promise geçirirken, resolved value’su [serializable](/reference/rsc/use-client#serializable-types) olmalıdır.

---

<<<<<<< HEAD
## Kullanım (Context) {/*usage-context*/}
=======
### <CanaryBadge /> `use(browser())` {/*use-browser*/}

Call `use` with the value returned by [`browser`](/reference/react-dom/browser) in a component that should only render in the browser:

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

During server rendering, the component calling `use(browser())` suspends and React includes the closest [`<Suspense>`](/reference/react/Suspense) boundary's fallback in the HTML. In the browser, `use(browser())` returns `undefined`, so the component renders normally.

[See an example below.](#rendering-a-component-only-in-the-browser)

#### Parameters {/*browser-parameters*/}

* `browserValue`: The value returned by [`browser`](/reference/react-dom/browser).

#### Returns {/*browser-returns*/}

`use(browser())` returns `undefined` in the browser.

#### Caveats {/*browser-caveats*/}

* The component calling `use(browser())` must be inside a `<Suspense>` boundary during server rendering. Without one, server rendering fails.
* In a React Server Components app, `use(browser())` must be called from a [Client Component](/reference/rsc/use-client), not a [Server Component](/reference/rsc/server-components).

---

## Usage (Context) {/*usage-context*/}
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

### `use` ile context okumak {/*reading-context-with-use*/}

`use`'a [context](/learn/passing-data-deeply-with-context) aktarıldığında, [`useContext`](/reference/react/useContext) gibi çalışacaktır. `useContext` bileşende üst seviye olarak çağırılmak zorundayken; `use` ifadesi, `if` gibi koşullu ifadelerin ve `for` gibi döngü ifadelerinin içerisinde kullanılabilir. Çok daha esnek kullanılabildiğinden dolayı `use` ifadesi, `useContext` yerine tercih edilebilir.

Bir [context](/learn/passing-data-deeply-with-context), `use`’a geçirildiğinde [`useContext`](/reference/react/useContext) ile benzer şekilde çalışır. `useContext` component’inizin top-level’ında çağrılmak zorundayken, `use` `if` gibi conditional’lar ve `for` gibi loop’lar içinde çağrılabilir.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```
`use`, içerisine aktarmış olduğunuz <CodeStep step={1}>context</CodeStep>'in <CodeStep step={2}>context değerini</CodeStep> döndürür. Context değerini belirlemek için React, bileşen ağacını arar ve ilgili context için **en yakın context sağlayıcısını** bulur.

Bir `Button`'a context aktarmak için, onu veya üst bileşenlerinden herhangi birini Context sağlayıcısının içerisine ekleyin.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... içerideki button'ları yeniden oluşturur ...
}
```
Sağlayıcı ile `Button` arasında kaç katman olduğu önemli değildir. `Form` içerisinde herhangi bir yerdeki `Button`, `use(ThemeContext)`'i çağırdığında değer olarak `"dark"` alacaktır.

[`useContext`](/reference/react/useContext) aksine; <CodeStep step={2}>`use`</CodeStep>, döngüler ve <CodeStep step={1}>`if`</CodeStep> gibi koşullu ifadeler içerisinde kullanılabilir.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep>, bir <CodeStep step={1}>`if`</CodeStep> ifadesinin içerisinde çağırılır. Bu size Context verilerini koşullu olarak okuma imkanı verir.

<Pitfall>

`use(context)`, `useContext` gibi her zaman çağırıldığı bileşenin *üstündeki* en yakın context sağlayıcısını arar. Yukarı doğru arama yapar ve `use(context)`'i çağırdığınız bileşendeki context sağlayıcılarını dikkate almaz.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Hoşgeldin">
      <Button show={true}>Kayıt ol</Button>
      <Button show={false}>Giriş Yap</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Context’ten Promise okuma {/*reading-a-promise-from-context*/}

Prop drilling olmadan asynchronous data paylaşmak için, bir Promise’i context value olarak ayarlayın, ardından `use(context)` ile okuyun ve `use(promise)` ile resolve edin:

```js
import { use } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const userPromise = use(UserContext);
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

Değeri okumak iki `use` çağrısı gerektirir çünkü context value’nun kendisi await edilmez. Context’e başvurmadan önce değerlendirilebilecek alternatifler için [Context’i kullanmadan önce](/learn/passing-data-deeply-with-context#before-you-use-context) bölümüne bakın.

Promise’i okuyan component’leri bir [Suspense](/reference/react/Suspense) boundary’si ile sarın; böylece Promise pending durumdayken yalnızca o subtree suspend olur. `use` ile Promise okuma hakkında daha fazlası için aşağıdaki [Kullanım (Promises)](#usage-promises) bölümüne bakın.

<Pitfall>

Bu pattern [Server Components](/reference/rsc/server-components) ile kullanıldığında, Promise’i refetch etmek context’te Promise’i ayarlayan Server Component’i refetch etmeyi gerektirir. Promise’i tree’nin yüksek seviyelerinde context’e koymaktan kaçının; çünkü bu, app’in büyük bölümlerini gereksiz yere refetch eder.

</Pitfall>

---

## Usage (Promises) {/*usage-promises*/}

### Reading a Promise with `use` {/*reading-a-promise-with-use*/}

Call `use` with a Promise to read its resolved value. The component will [suspend](/reference/react/Suspense) while the Promise is pending.

```js [[1, 4, "use(albumsPromise)"]]
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

Wrap the component that calls <CodeStep step={1}>`use`</CodeStep> in a [Suspense](/reference/react/Suspense) boundary so React can show a fallback while the Promise is pending. The closest Suspense boundary above the suspending component shows its fallback. Once the Promise resolves, React reads the value with `use` and replaces the fallback with the rendered component.

<Recipes titleText="Reading a Promise with use vs fetching in an Effect" titleId="examples-promise">

#### Fetching data with `use` {/*fetching-data-with-use*/}

In this example, `Albums` calls `use` with a cached Promise. The component suspends while the Promise is pending, and React displays the nearest Suspense fallback. Rejected Promises propagate to the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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

function Loading() {
  return <h2>Loading...</h2>;
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
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<Solution />

#### Fetching data with `useEffect` {/*fetching-data-with-useeffect*/}

Before `use`, a common approach was to fetch data in an Effect and update state when the data arrives. Compared to `use`, this approach requires managing loading and error states manually. For more details on why fetching in an Effect is discouraged, see [You Might Not Need an Effect](/learn/you-might-not-need-an-effect#fetching-data).

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { fetchAlbums } from './data.js';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then(data => {
        setAlbums(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
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
export async function fetchAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

##### Promises passed to `use` must be cached {/*promises-must-cached*/}

Promises created during render are recreated on every render, which causes React to show the Suspense fallback repeatedly and prevents content from appearing.

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));
  // ...
}
```

Instead, pass a Promise from a cache, a [Suspense-enabled framework](/reference/react/Suspense#suspense-enabled-frameworks), or a Server Component:

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</Pitfall>

<DeepDive>

#### Why are Promises recreated on every render? {/*why-promises-recreated*/}

[React doesn't preserve state for renders that suspended before mounting](/reference/react/Suspense#caveats). After each suspension, React retries rendering from scratch, so any Promise created during render is recreated.

Common ways a Promise can be unintentionally recreated during render:

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));

  // 🔴 Uncached `async` function calls create a new Promise on every render.
  const albums = use((async () => {
    const res = await fetch('/albums');
    return res.json();
  })());

  // 🔴 Adding `.then` returns a new Promise on every render,
  // even if `fetchData` is cached.
  const albums = use(fetchData('/albums').then(res => res.json()));
  // ...
}
```

Ideally, Promises are created before rendering, such as in an event handler, a route loader, or a Server Component, and passed to the component that calls `use`. Fetching lazily in render delays network requests and can create waterfalls.

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</DeepDive>

---

### Caching Promises for Client Components {/*caching-promises-for-client-components*/}

Promises passed to `use` in Client Components must be cached so the same Promise instance is reused across re-renders. If a new Promise is created directly in render, React will display the Suspense fallback on every re-render.

```js
// ✅ Cache the Promise so the same one is reused across renders
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

The `fetchData` function returns the same Promise each time it's called with the same URL. When `use` receives the same Promise on a re-render, it reads the already-resolved value synchronously without suspending.

<Note>

The way you cache Promises depends on the framework you use with Suspense. Frameworks typically provide built-in caching mechanisms. If you don't use a framework, you can use a simple module-level cache like the one above, or a [Suspense-enabled data source](/reference/react/Suspense#what-activates-a-suspense-boundary).

</Note>

In the example below, clicking "Re-render" updates state in `App` and triggers a re-render. Because `fetchData` returns the same cached Promise, `Albums` reads the value synchronously instead of showing the Suspense fallback again.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render
      </button>
      <p>Render count: {count}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

</Sandpack>

<DeepDive>

#### How to implement a promise cache {/*how-to-implement-a-promise-cache*/}

A basic cache stores the Promise keyed by URL so the same instance is reused across renders. To also avoid unnecessary Suspense fallbacks when data is already available, you can set `status` and `value` (or `reason`) fields on the Promise. React checks these fields when `use` is called: if `status` is `'fulfilled'`, it reads `value` synchronously without suspending. If `status` is `'rejected'`, it throws `reason`. If the field is missing or `'pending'`, it suspends.

```js
let cache = new Map();

function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}
```

This is primarily useful for library authors building Suspense-compatible data layers. React will set the `status` field itself on Promises that don't have it, but setting it yourself avoids an extra render when the data is already available.

This cache pattern is the foundation for [re-fetching data](#re-fetching-data-in-client-components) (where changing the cache key triggers a new fetch) and [preloading data on hover](#preloading-data-on-hover) (where calling `fetchData` early means the Promise may already be resolved by the time `use` reads it).

</DeepDive>

<Pitfall>

##### Don't skip calling `use` based on whether a Promise is already settled. {/*conditional-use*/}

Unlike other hooks, `use` can be called inside conditions and loops — but it must always be called for the Promise itself. Never read `promise.status` or `promise.value` directly to bypass `use`; always pass the Promise to `use` and let React handle it.


```js
// 🔴 Don't bypass `use` by reading promise status directly
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Pass the promise to `use` and let React track the promise
const value = use(promise);
```

Bypassing `use` this way can break React Suspense optimizations and Suspense features for React DevTools. You can `use(promise)` conditionally, but don't conditionally `use(promise)` based on the promise itself.

</Pitfall>

---

### Re-fetching data in Client Components {/*re-fetching-data-in-client-components*/}

To refresh data at the same URL (for example, with a "Refresh" button), invalidate the cache entry and start a new fetch inside a [`startTransition`](/reference/react/startTransition). Store the resulting Promise in state to trigger a re-render. While the new Promise is pending, React keeps showing the existing content because the update is inside a Transition.

```js
function App() {
  const [albumsPromise, setAlbumsPromise] = useState(fetchData('/albums'));
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/albums'));
    });
  }
  // ...
}
```

`refetchData` clears the old cache entry and starts a new fetch at the same URL. Storing the resulting Promise in state triggers a re-render inside the Transition. On re-render, `Albums` receives the new Promise and `use` suspends on it while React keeps showing the old content.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import { use } from 'react';
import { fetchData, refetchData } from './data.js';

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <>
      <button
        onClick={handleRefresh}
        disabled={isPending}
      >
        {isPending ? 'Refreshing...' : 'Refresh'}
      </button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<Loading />}>
          <Albums albumsPromise={albumsPromise} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

function Loading() {
  return <h2>Loading...</h2>;
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

export function refetchData(url) {
  cache.delete(url);
  return fetchData(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

<Note>

Frameworks that support Suspense typically provide their own caching and invalidation mechanisms. The custom cache above is useful for understanding the pattern, but in practice prefer your framework's data fetching solution.

</Note>

---

### Preloading data on hover {/*preloading-data-on-hover*/}

You can start loading data before it's needed by calling `fetchData` during a hover event. Since `fetchData` caches the Promise, the data may already be available by the time the user clicks. If the Promise has resolved by the time `use` reads it, React renders the component immediately without showing a Suspense fallback.

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

In this example, hovering over an artist button starts fetching their albums in the background. Without hovering first, clicking shows a loading fallback. Try hovering over a button for a moment before clicking to see the difference.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Albums from './Albums.js';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (
          <button
            key={id}
            onMouseEnter={() => {
              fetchData(`/${id}/albums`);
            }}
            onClick={() => {
              startTransition(() => {
                setArtistId(id);
              });
            }}
          >
            {id === 'the-beatles' ? 'The Beatles' :
             id === 'led-zeppelin' ? 'Led Zeppelin' :
             'Pink Floyd'}
          </button>
        ))}
      </div>
      <Suspense key={artistId} fallback={<Loading />}>
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/Albums.js
import { use } from 'react';
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
    const promise = getData(url);
    // Set status fields so React can read the value
    // synchronously if the Promise resolves before
    // `use` is called (e.g. when preloading on hover).
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums('the-beatles');
  } else if (url.startsWith('/led-zeppelin/albums')) {
    return await getAlbums('led-zeppelin');
  } else if (url.startsWith('/pink-floyd/albums')) {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });

  if (artistId === 'the-beatles') {
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
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 10,
      title: 'Coda',
      year: 1982
    }, {
      id: 9,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 8,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 6,
      title: 'Animals',
      year: 1977
    }, {
      id: 5,
      title: 'Wish You Were Here',
      year: 1975
    }];
  }
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

---

### Streaming data from server to client {/*streaming-data-from-server-to-client*/}

Data can be streamed from the server to the client by passing a Promise as a prop from a Server Component to a Client Component.

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>Mesaj bekleniyor...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Client Component daha sonra prop olarak aldığı Promise’i alır ve `use` API’sine geçirir. Bu, Client Component’in başlangıçta Server Component tarafından oluşturulan Promise’ten gelen değeri okumasını sağlar.

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Aktarılan Mesaj: {messageContent}</p>;
}
```
`Message`, bir [Suspense](/reference/react/Suspense) boundary’si ile sarıldığı için, Promise resolve edilene kadar fallback gösterilir. Promise resolve edildiğinde, değer `use` API’si tarafından okunur ve `Message` component’i Suspense fallback’inin yerini alır.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Aktarılan Mesaj: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Mesaj Yükleniyor...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Mesajı indir</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: Bu örneği,
// Codesandbox Sunucu Bileşeni
// demo ortamı oluşturulduğunda güncelleyin
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<DeepDive>

#### Promise'i Sunucu Bileşeninde mi yoksa İstemci Bileşeninde mi çözümlemeliyim? {/*resolve-promise-in-server-or-client-component*/}

<<<<<<< HEAD
Bir Promise, bir Server Component içinde `await` ile resolve edilebilir veya bir Client Component’e prop olarak geçirilip orada `use` ile resolve edilebilir.

Bir Server Component içinde `await` kullanmak Server Component’in kendisini suspend eder ve Client Component resolved value’yu prop olarak alır:
=======
If you have a Promise, at some point you need to unwrap it to read its value. You unwrap it with `await` in a Server Component, and with `use` in a Client Component.

Usually, the simplest option is to `await` the Promise where you create it. The Server Component suspends until the data is ready, and everything below it waits too:
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

```js
// Server Component
export default async function App() {
<<<<<<< HEAD
  // Server Component’i suspend eder.
=======
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />;
}
```

<<<<<<< HEAD
Bir Server Component ayrıca bir Promise’i await etmeden başlatabilir ve Promise’i bir Client Component’e geçirebilir. Server Component hemen return eder ve Client Component `use` çağırdığında suspend olur:
=======
However, you don't have to unwrap it right away. You can pass the Promise down as a prop, and unwrap it deeper in the tree. The component that reads the Promise still suspends, but only that part of the tree waits for the data. Wrap that component in a [`<Suspense>`](/reference/react/Suspense) boundary to show a fallback while the rest of the page renders immediately.

For example, a deeper Server Component can `await` the Promise it receives:
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

```js
import { Suspense } from 'react';

// Server Component
export default function App() {
<<<<<<< HEAD
  // Await edilmedi: burada başlar, client’ta resolve olur.
=======
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// Server Component
async function Message({ messagePromise }) {
  const messageContent = await messagePromise;
  return <p>{messageContent}</p>;
}
```

Or, in a separate file, a Client Component can unwrap the same Promise with `use`:

```js
// Client Component
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
<<<<<<< HEAD
  // Data available olana kadar suspend eder.
=======
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab
  const messageContent = use(messagePromise);
  return <p>{messageContent}</p>;
}
```

<<<<<<< HEAD
Mümkün olduğunda Server Component içinde `await` kullanmayı tercih edin; çünkü bu, data fetching’i server tarafında tutar. Eğer üstteki bir Server Component data’yı zaten await ediyorsa, `use` çağırmak için yeni bir Promise oluşturmak yerine resolved value’yu prop olarak aşağı geçirin.

Ayrıca promise’i await etmeden bir Client Component’e prop olarak geçirebilir ve ardından tree’nin daha derininde suspend etmek için `use(promise)` ile okuyabilirsiniz. Bu, Promise pending durumdayken çevredeki UI’ın daha büyük bir kısmının tamamlanmasına olanak tanır. Yaygın bir durum, popover ve tooltip gibi interactive content’lerdir; burada data yalnızca hover veya click sonrasında gerekir. Client Component’ler `await` kullanamaz, bu yüzden bir Promise üzerinde suspend olmak için `use`’a güvenirler.

Her iki durumda da, Promise’i okuyan component’i bir Suspense boundary ile sarın; böylece React, Promise pending durumdayken bir fallback gösterebilir. Boundary placement konusunda rehberlik için [Revealing content together at once](/reference/react/Suspense#revealing-content-together-at-once) bölümüne bakın.
=======
Passing the Promise down works the same way in both cases. Both suspend where the Promise is read, and both unblock the UI above. The only difference is that Client Components can't `await` during render, so they unwrap the Promise with `use` instead. A common case is interactive content like popovers and tooltips, where the data is only needed after a hover or click.

See [Revealing content together at once](/reference/react/Suspense#revealing-content-together-at-once) for guidance on where to place Suspense boundaries.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

</DeepDive>

---

### Displaying an error with an Error Boundary {/*displaying-an-error-with-an-error-boundary*/}

If the Promise passed to `use` is rejected, the error propagates to the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Wrap the component that calls `use` in an Error Boundary to display a fallback when the Promise is rejected.

In the example below, `fetchData` rejects on the first attempt and succeeds on retry. The Error Boundary catches the rejection and shows a fallback with a "Try again" button.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState, startTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchData, refetchData } from "./data.js";

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );

  function handleRetry() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <ErrorBoundary
      resetKeys={[albumsPromise]}
      fallbackRender={() => (
        <>
          <p>⚠️ Albümler yüklenirken bir sorun oluştu.</p>
          <button onClick={handleRetry}>Tekrar dene</button>
        </>
      )}
    >
      <Suspense fallback={<p>Yükleniyor...</p>}>
        <Albums albumsPromise={albumsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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
let retried = false;

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  retried = true;
  return fetchData(url);
}

async function getData(url) {
  // Add a fake delay to make the loading state visible.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (url === '/the-beatles/albums') {
    // Fail the first attempt to demonstrate the Error Boundary,
    // then succeed on retry.
    if (!retried) {
      throw new Error('Example Error: Failed to fetch albums');
    }
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
    }];
  }
  throw new Error('Not implemented');
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

<<<<<<< HEAD
## Sorun Giderme {/*troubleshooting*/}
=======
## Usage (Browser) {/*usage-browser*/}

### <CanaryBadge /> Rendering a component only in the browser {/*rendering-a-component-only-in-the-browser*/}

Pass the value returned by [`browser`](/reference/react-dom/browser) to `use` inside a component that should only render in the browser.

Click **Reload** to see the loading fallback in the initial HTML. After hydration, React displays the draft loaded from `localStorage`.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

During server rendering, `use(browser())` suspends the component and React includes the closest Suspense boundary's fallback in the HTML. In the browser, `use(browser())` returns `undefined` and the saved draft renders normally.

---

## Troubleshooting {/*troubleshooting*/}
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

### Şu hatayı alıyorum: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

`use`’u bir try-catch block’u içinde çağırıyorsunuz. `use`, Suspense ile entegre olmak için internal olarak throw eder, bu yüzden try-catch ile sarılamaz. Bunun yerine, error’ları handle etmek için `use` çağıran component’i bir [Error Boundary](#displaying-an-error-with-an-error-boundary) ile sarın.

```jsx
function Albums({ albumsPromise }) {
  try {
    // ❌ `use`’u try-catch içinde sarmayın
    const albums = use(albumsPromise);
  } catch (e) {
    return <p>Error</p>;
  }
  // ...
```

Bunun yerine, component’i bir Error Boundary ile sarın:

```jsx
function Albums({ albumsPromise }) {
  // ✅ `use`’u try-catch olmadan çağırın
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Error’ları handle etmek için bir Error Boundary kullanın
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

---

### Şu uyarıyı alıyorum: "A component was suspended by an uncached promise" {/*uncached-promise-error*/}

`use`’a geçirilen Promise cache’lenmemiştir, bu yüzden React onu re-render’lar arasında yeniden kullanamaz.

Bu durum genellikle render sırasında doğrudan `fetch` veya bir `async` function çağrıldığında olur:

```js
function Albums() {
  // 🔴 Bu, her render’da yeni bir Promise oluşturur
  const albums = use(fetch('/albums'));

  // ...
}
```

Bunu düzeltmek için, aynı instance’ın yeniden kullanılmasını sağlayacak şekilde Promise’i cache’leyin:

```js
// ✅ fetchData aynı URL için aynı Promise’i döndürür
const albums = use(fetchData('/albums'));
```

Daha fazla detay için [Client Components için Promise cache’leme](#caching-promises-for-client-components) bölümüne bakın.