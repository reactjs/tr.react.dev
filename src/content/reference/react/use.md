---
title: use
---

<Intro>

`use`, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya [context](/learn/passing-data-deeply-with-context) gibi bir kaynağın değerini okumanıza olanak sağlayan bir React API'ıdır.

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `use(resource)` {/*use*/}

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya [context](/learn/passing-data-deeply-with-context) gibi kaynakların değerini okumak için bileşeninizde `use` API'ını çağırabilirsiniz.

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```
Diğer React Hook'ların aksine, Döngülerin ve `if` gibi koşullu ifadeler içerisinde `use` kullanılabilir. Diğer React Hook'lar gibi, `use` kullanan fonksiyon bir Bileşen veya Hook olmalıdır.

Bir Pomise ile çağırıldığında; `use` API, [`Suspense`](/reference/react/Suspense) ve [hata sınırları](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) ile entegre olur. `use`'a iletilen Promise beklenirken, `use` çağrısı yapan bileşen askıya alınır. Eğer `use` çağrısı yapan bileşen Suspense içerisine alınırsa yedek görünüm görüntülenecektir. Promise çözümlendiğinde ise; Suspense yedek görünümü, `use` API'ı tarafından döndürülen değerleri kullanarak oluşturulan bileşenler ile yer değiştirir. Eğer `use`'a iletilen Promise reddedilir ise, en yakındaki Hata Sınırının yedek görünümü görüntülenecektir.

<<<<<<< HEAD
[Aşağıda daha fazla örnek görebilirsiniz.](#usage)
=======
When called with a Promise, the `use` API integrates with [`Suspense`](/reference/react/Suspense) and [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). The component calling `use` *suspends* while the Promise passed to `use` is pending. If the component that calls `use` is wrapped in a Suspense boundary, the fallback will be displayed.  Once the Promise is resolved, the Suspense fallback is replaced by the rendered components using the data returned by the `use` API. If the Promise passed to `use` is rejected, the fallback of the nearest Error Boundary will be displayed.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

#### Parametreler {/*parameters*/}

* `resource`: Bu, bir değeri okumak istediğiniz verinin kaynağıdır. Kaynak, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ya da [context](/learn/passing-data-deeply-with-context) olabilir.

#### Dönüş Değerleri {/*returns*/}

`use` API, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ya da [context](/learn/passing-data-deeply-with-context) gibi bir kaynaktan çözümlenen veriyi döndürür.

The `use` API returns the value that was read from the resource like the resolved value of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

#### Caveats {/*caveats*/}

* `use` API'si bir Bileşen veya Hook içinde çağrılmalıdır.
* [Sunucu Bileşenleri](/reference/rsc/server-components) içinde veri çekerken, `use` yerine `async` ve `await` kullanmayı tercih edin. `async` ve `await`, `await` çağrıldığında render'a başlar, oysa `use` veri çözümlandıktan sonra bileşeni yeniden render eder.
* [Sunucu Bileşenleri](/reference/rsc/server-components) içinde Promise'ler oluşturmayı ve bunları [İstemci Bileşenleri](/reference/rsc/use-client) içine iletmeyi, İstemci Bileşenleri içinde Promise'ler oluşturmaya tercih edin. Client Bileşenleri içinde oluşturulan Promise'ler her render işleminde yeniden oluşturulur. Sunucu Bileşenlerin'den İstemci Bileşenleri'e geçirilen Promise'ler yeniden render'lar arasında sabittir. [Bu örneğe bakın](#streaming-data-from-server-to-client).
---

## Kullanım {/*usage*/}

### `use` ile context okumak {/*reading-context-with-use*/}

`use`'a [context](/learn/passing-data-deeply-with-context) aktarıldığında, [`useContext`](/reference/react/useContext) gibi çalışacaktır. `useContext` bileşende üst seviye olarak çağırılmak zorundayken; `use` ifadesi, `if` gibi koşullu ifadelerin ve `for` gibi döngü ifadelerinin içerisinde kullanılabilir. Çok daha esnek kullanılabildiğinden dolayı `use` ifadesi, `useContext` yerine tercih edilebilir.


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

### Sunucudan istemciye veri aktarımı {/*streaming-data-from-server-to-client*/}

Sunucudan gelen veri; <CodeStep step={1}>Sunucu Bileşeni</CodeStep>'nden <CodeStep step={2}>İstemci Bileşeni</CodeStep>'ne Promise biçiminde prop olarak aktarılır.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
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

<CodeStep step={2}>İstemci Bileşeni</CodeStep> prop olarak iletilen Promise'i alır ve <CodeStep step={5}>`use`</CodeStep> API'ına ileterek kullanır. Bu yöntem Sunucu Bileşeni içerisinde oluşturulan <CodeStep step={4}>Promise</CodeStep>'ten alınan verinin <CodeStep step={2}>İstemci Bileşeni</CodeStep> tarafından okunmasına olanak tanır.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Aktarılan Mesaj: {messageContent}</p>;
}
```

<CodeStep step={2}>`Message`</CodeStep> bir <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep> içerisinde olduğu için Promise çözümleninceye kadar yedek görünüm görüntülenecektir. Promise çözümlendiğinde değer <CodeStep step={5}>`use`</CodeStep> API tarafından okunacak ve <CodeStep step={2}>`Message`</CodeStep> bileşeni Suspense'in yedek görünüm ile yer değiştirecektir.

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

<Note>

Sunucu Bileşeni'nden İstemci Bileşeni'ne Promise aktarıldığında çözümlenen değer sunucu ile istemci arasından geçmesi için serileştirilebilir olması gerekir. Fonksiyonlar gibi veri türleri serileştirilemezler ve Promise'in çözümlenen değeri olamazlar.

</Note>


<DeepDive>

#### Promise'i Sunucu Bileşeninde mi yoksa İstemci Bileşeninde mi çözümlemeliyim? {/*resolve-promise-in-server-or-client-component*/}

Promise, Sunucu Bileşeni'nden İstemci Bileşeni'ne aktarılabilir ve İstemci Bileşeni içerisinde `use` API kullanarak çözümlenebilir. Yanı sıra istersen Promise'i Sunucu Bileşeni içerisinde `await` kullanarak çözümleyebilir ve gerekli veriyi İstemci Bileşeni içerisine prop olarak iletebilirsin.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Ancak bir [Sunucu Bileşeninde](/reference/rsc/server-components) `await` kullanmak, `await` deyimi bitene kadar bileşenin oluşturulmasını engelleyecektir. Bir Sunucu Bileşeninden bir İstemci Bileşenine bir Promise geçirmek, Promise'in Sunucu Bileşeninin oluşturulmasını engellemesini önler.

</DeepDive>

### Reddedilen Promise'ler ile başa çıkmak {/*dealing-with-rejected-promises*/}

Bazen `use`'a aktarılan Promise reddedilebilir. Reddedilen Promise'leri şu şekilde yönetebilirsiniz:

<<<<<<< HEAD
1. [Kullanıcıya hata sınırlayıcısı kullanarak hata göstermek.](#displaying-an-error-to-users-with-error-boundary)
2. [`Promise.catch` methodunu kullanarak alternatif bir veri sunmak](#providing-an-alternative-value-with-promise-catch)
=======
1. [Displaying an error to users with an Error Boundary.](#displaying-an-error-to-users-with-error-boundary)
2. [Providing an alternative value with `Promise.catch`](#providing-an-alternative-value-with-promise-catch)
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

<Pitfall>
`use`, try-catch bloğu içerisinde çağırılamaz. Try-catch bloğu yerine [bileşeni Error Boundary içerisine ekleyin](#displaying-an-error-to-users-with-error-boundary), ya da [Promise'in `.catch` methodundan yararlanarak alternatif bir değer sağlayın](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

<<<<<<< HEAD
#### Kullanıcıya hata sınırlayıcısı kullanarak hata göstermek {/*displaying-an-error-to-users-with-error-boundary*/}

Eğer bir Promise reddedildiğinde kullanıcılarına hata göstermek istersen [hata sınırlayıcısını](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) kullanabilirsin. Bir hata sınırlayıcı kullanmak için `use` API'ını çağırdığınız bir bileşeni Error Boundary içerisine koyun. Eğer `use`'a iletilen Promise reddedilirse hata sınırlayıcı aracılığı ile yedek görünüm görüntülenecektir.
=======
#### Displaying an error to users with an Error Boundary {/*displaying-an-error-to-users-with-error-boundary*/}

If you'd like to display an error to your users when a Promise is rejected, you can use an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an Error Boundary, wrap the component where you are calling the `use` API in an Error Boundary. If the Promise passed to `use` is rejected the fallback for the Error Boundary will be displayed.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Bir şeyler yanlış gitti</p>}>
      <Suspense fallback={<p>⌛Mesaj indiriliyor...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Aktarılan mesaj: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
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
    return <button onClick={download}>Mesajı İndir</button>;
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

#### `Promise.catch` methodunu kullanarak alternatif bir veri sunmak {/*providing-an-alternative-value-with-promise-catch*/}

Eğer `use`'a aktarılan Promise reddedildiğinde yerine alternatif bir değer sağlamak istiyorsan Promise'in <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> methodunu kullanabilirsin.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "yeni mesaj bulunamadı.";
  });

  return (
    <Suspense fallback={<p>Mesaj bekleniyor...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Promise'in <CodeStep step={1}>`catch`</CodeStep> methodunu kullanmak için Promise objesinden <CodeStep step={1}>`catch`</CodeStep>'i çağır. <CodeStep step={1}>`catch`</CodeStep> tek bir argüman alır: Bir hata mesajını argüman olarak alan bir fonksiyon. <CodeStep step={1}>`catch`</CodeStep>'e geçirilen fonskiyon tarafından döndürülen her şey, Promise'in çözümlenen değeri olarak kullanılacaktır.

---

## Sorun Giderme {/*troubleshooting*/}

### "Suspense İstisnası: Bu gerçek bir hata değil!" {/*suspense-exception-error*/}

<<<<<<< HEAD
`use` ya bir React Bileşeni ya da Hook fonksiyonu dışında veya try-catch bloğu içerisinde çağırılıyor. Eğer try-catch bloğu içerisinde `use` çağırıyorsanız bileşeni hata sınırlandırıcı içerisine koyun veya hata yakalamak ve alternatif değer ile çözümlemek için Promise'in `catch` methodunu çağırın. [Bu örneği inceleyin](#dealing-with-rejected-promises)
=======
You are either calling `use` outside of a React Component or Hook function, or calling `use` in a try–catch block. If you are calling `use` inside a try–catch block, wrap your component in an Error Boundary, or call the Promise's `catch` to catch the error and resolve the Promise with another value. [See these examples](#dealing-with-rejected-promises).
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

Eğer `use`'u bir React Bileşeni veya Hook fonksiyonu dışında çağırıyorsanız `use` çağrısını bir React Bileşeni veya Hook fonksiyonu içerisine taşıyın.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ `use`, bir Bileşen veya Hook olmayan fonksiyon tarafından çağırılıyor
    const message = use(messagePromise);
    // ...
```

Bunun yerine, `use` fonksiyonunu herhangi bir bileşen kapanışının dışında çağırın. `use` fonksiyonunu çağıran fonksiyon bir bileşen veya Hook olmalıdır.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` bir bileşen içerisine çağırılıyor. 
  const message = use(messagePromise);
  // ...
```