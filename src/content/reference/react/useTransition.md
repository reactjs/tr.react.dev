---
title: useTransition
---

<Intro>

`useTransition`, kullanıcı arayüzü (UI) işlemlerini engellemeden state güncellemelerini gerçekleştirebilmenizi sağlayan bir React Hook'tur.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `useTransition()` {/*usetransition*/}

Bazı state güncellemelerini transition (ertelenen güncelleme) olarak işaretlemek için, bileşeninizin en üst seviyesinde `useTransition`'ı çağırın.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

`useTransition` parametre almaz.

#### Dönen değerler {/*returns*/}

`useTransition`, tam olarak iki elemanlı dizi döndürür:

1. Transition işleminin beklenip beklenmediğini söyleyen `isPending` belirteci.
2. State güncellemesini transition olarak işaretlemenizi sağlayan [`startTransition` fonksiyonu.](#starttransition)

---

### `startTransition` fonksiyonu {/*starttransition*/}

`useTransition` tarafından döndürülen `startTransition` fonksiyonu, bir state güncellemesini transition (ertelenen güncelleme) olarak işaretlemenize olanak tanır.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Parametreler {/*starttransition-parameters*/}

* `scope`: Bir veya birden fazla [set fonksiyonu](/reference/react/useState#setstate) kullanarak bazı state’leri güncelleyen bir fonksiyondur. React, scope fonksiyon çağrısı sırasında eş zamanlı olarak planlanan tüm state güncellemelerini transition olarak işaretler ve herhangi bir parametre olmaksızın scope‘u hemen çalıştırır. Bu güncellemeler engelleme yapmaz [(non-blocking)](#marking-a-state-update-as-a-non-blocking-transition) ve [gereksiz yükleme animasyonları göstermez](#preventing-unwanted-loading-indicators).

#### Dönen değerler {/*starttransition-returns*/}

`startTransition` herhangi bir şey geri döndürmez.

#### Uyarılar {/*starttransition-caveats*/}

* `useTransition` bir Hook olduğu için yalnızca bileşenlerin içinde veya özel Hook'ların içinde çağrılabilir. Eğer bir transition işlemini başka bir yerden başlatmanız gerekiyorsa (örneğin, bir veri kütüphanesinden), bunun yerine bağımsız [`startTransition`](/reference/react/startTransition)'ı çağırın.

* Bir güncellemeyi transition olarak kullanmak için, ilgili state’in `set` fonksiyonuna erişebilmeniz gerekiyor. Eğer bir prop veya özel bir Hook dönüş değerine yanıt olarak transition başlatmak isterseniz, bunun yerine [`useDeferredValue`](/reference/react/useDeferredValue) özelliğini kullanmayı deneyebilirsiniz.

* `startTransition`‘a ilettiğiniz fonksiyon, eşzamanlı olarak çalışabilecek bir fonksiyon olmalıdır. React, bu fonksiyonu hemen çalıştırır ve çalışırken gerçekleşen tüm state güncellemelerini transition olarak işaretler. Sonrasında daha fazla state güncellemesi yapmaya çalışırsanız (örneğin, bir zaman aşımında), bunlar transition olarak işaretlenmezler.

* Bir state güncelleme işlemi transition olarak işaretlendiğinde, diğer güncelleme işlemleri bu işlemi kesintiye uğratabilir. Örneğin, bir grafik bileşenini güncelleyen transition işlemi sırasında, grafik bileşeni tekrar render işlemi devam ederken bir giriş alanına yazmaya başlarsanız, React, giriş alanındaki güncellemeyi işledikten sonra tekrar render işlemini başlatır.

* Transition güncellemeleri, metin girişlerini kontrol etmek için kullanılamaz.

* Eğer birden fazla transition işlemi devam ediyorsa, React şu an için bu güncellemeleri birleştirir. Ancak bu durum, ileride kaldırılması beklenen bir kısıtlamadır.

---

## Kullanım {/*usage*/}

### Bir state güncellemesini, gecikmeye neden olmayan transition olarak işaretlemek. {/*marking-a-state-update-as-a-non-blocking-transition*/}

State güncellemelerini *transition* olarak işaretlemek için, bileşeninizin en üst seviyesinde `useTransition`‘ı çağırın.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition`, tam olarak iki elemanlı dizi döndürür:

1. Transition işleminin beklenip beklenmediğini söyleyen <CodeStep step={1}>`isPending` belirteci.</CodeStep> 
2. State güncellemesini transition olarak işaretlemenizi sağlayan <CodeStep step={2}>`startTransition` fonksiyonu.</CodeStep>

Sonra state güncellemesini bu şekilde transition olarak işaretleyebilirsiniz:


```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transition’lar, kullanıcı arayüzü güncellemelerini yavaş cihazlarda bile hızlı ve duyarlı tutmanıza olanak tanır.

Transition’lar ile, kullanıcı arayüzü yeniden render sırasında bile duyarlı kalır. Örneğin, kullanıcı bir sekmeye tıklar, ancak sonra fikrini değiştirir ve başka bir sekmeye tıklarsa, bunu birinci tekrar render işleminin tamamlanmasını beklemeden yapabilir.

<Recipes titleText="useTransition ve standart state güncellemeleri arasındaki fark" titleId="examples">

#### Transition ile aktif sekmeyi güncelleme {/*updating-the-current-tab-in-a-transition*/}

Bu örnekte, "Posts" sekmesi **bilinçli olarak yavaşlatılmıştır**, böylece render işleminin tamamlanması en az bir saniye sürecektir.


"Posts" sekmesine tıkladıktan sonra hemen "Contact" sekmesine tıklarsanız, yavaş olan "Posts" sekmesinin render işleminin durduğunu fark edeceksiniz. "Contact" sekmesi hemen gösterilir. State güncellemesi transition olarak işaretlendiği için, yavaş bir yeniden render işlemi kullanıcı arayüzünü dondurmadı.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Bir kez log kaydı yapın. Gerçek yavaşlama SlowPost içerisindedir.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Her bir öğe için 1 ms süresince hiçbir işlem yapmaz, bu da son derece yavaş bir kodu simüle eder.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### Transition kullanmadan aktif sekmeyi güncelleme {/*updating-the-current-tab-without-a-transition*/}

Bu örnekte de, "Posts" sekmesi **bilinçli olarak yavaşlatılmıştır**, böylece render işleminin tamamlanması en az bir saniye sürecektir. Önceki örnekten farklı olarak, state güncellemesi transition değil. 

"Posts" sekmesine tıkladıktan sonra hemen "Contact" sekmesine tıklarsanız, uygulamanın yavaşlatılmış sekmeyi render ederken donduğunu ve kullanıcı arayüzünün (UI) yanıt veremez hale geldiğini fark edersiniz. State güncellemesi transition olmadığı için, yavaş bir yeniden render işlemi kullanıcı arayüzünü dondurdu.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Bir kez log kaydı yapın. Gerçek yavaşlama SlowPost içerisindedir.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Her bir öğe için 1 ms süresince hiçbir işlem yapmaz, bu da son derece yavaş bir kodu simüle eder.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Transition kullanarak, üst bileşenin güncellenmesi. {/*updating-the-parent-component-in-a-transition*/}

`useTransition` çağrısı ile birlikte, bir üst bileşenin state'ini de güncelleyebilirsiniz. Örneğin, `TabButton` bileşeni, `onClick` işlemini transition içine alır:

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

Üst bileşen, `onClick` olay işleyicisi (event handler) içinde state'i güncellediği için, state güncellemesi transition olarak işaretlenir. Bu sayede, daha önceki örnekte olduğu gibi, "Posts" sekmesine tıklayabilir ve hemen ardından "Contact"a tıklayabilirsiniz. Seçili sekmenin güncellenmesi transition olarak işaretlendiğinden kullanıcı etkileşimleri engellenmez.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Bir kez log kaydı yapın. Gerçek yavaşlama SlowPost içerisindedir.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Her bir öğe için 1 ms süresince hiçbir işlem yapmaz, bu da son derece yavaş bir kodu simüle eder.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### Transition sırasında beklemeyi ifade eden bir durum gösterimi {/*displaying-a-pending-visual-state-during-the-transition*/}

`useTransition` tarafından döndürülen `isPending` boolean değerini kullanarak, bir transition işleminin hala devam ettiğini kullanıcıya gösterebilirsiniz. Örneğin, sekme düğmesi özel bir "pending" (beklemede) görsel state'ine sahip olabilir:

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

"Posts"a tıkladığınızda, sekme düğmesinin anında güncellenmesi sebebiyle daha hızlı bir yanıt verdiğini göreceksiniz:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Bir kez log kaydı yapın. Gerçek yavaşlama SlowPost içerisindedir.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Her bir öğe için 1 ms süresince hiçbir işlem yapmaz, bu da son derece yavaş bir kodu simüle eder.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### İstenmeyen yükleme göstergelerinin engellenmesi {/*preventing-unwanted-loading-indicators*/}

Bu örnekte, `PostsTab` bileşeni, [Suspense özelliği etkinleştirilmiş](/reference/react/Suspense) bir veri kaynağını kullanarak bazı verileri getirir. "Posts" sekmesine tıkladığınızda, `PostsTab` bileşeni *askıya alınır* (suspends) ve en yakın yükleme (loading) yedeklemesinin görünmesine neden olur.

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Tüm sekme içeriğini gizlemek ve bir yüklenme göstergesi göstermek, kullanıcı deneyiminde rahatsız edici bir etkiye neden olabilir. `TabButton`'a `useTransition` eklerseniz, bunun yerine bekleyen state'i sekme düğmesinde gösterebilirsiniz.

Artık "Posts"a tıklamanın tüm sekme konteynırını bir döndürücüyle (spinner) değiştirmediğini fark edeceksiniz:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Suspense ile Transition kullanımı hakkında daha fazla bilgi edinin.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transition'lar, sadece *zaten görünen* içeriği (örneğin sekme kutusu gibi) gizlememek için yeteri kadar "bekler". Eğer "Posts" sekmesinde [iç içe geçmiş `<Suspense>` sınırlaması](/reference/react/Suspense#revealing-nested-content-as-it-loads) bulunuyorsa, transition onun için "bekleme" yapmaz.

</Note>

---

### Suspense özelliği etkinleştirilmiş yönlendirici oluşturma {/*building-a-suspense-enabled-router*/}

Eğer bir React çatısı (framework) veya yönlendirici oluşturuyorsanız, sayfa gezinmelerini transition'lar olarak işaretlemenizi öneririz.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Bu, iki nedenden dolayı önerilir:

- [Transition'lar kesilebilir](#marking-a-state-update-as-a-non-blocking-transition) olduğundan, kullanıcı yeniden render işleminin tamamlanmasını beklemeden tıklamayı bırakabilir.

- [Transition'lar istenmeyen yükleme göstergelerini engeller,](#preventing-unwanted-loading-indicators) bu da kullanıcının gezinme sırasında rahatsız edici sıçramalardan kaçınmasını sağlar.

İşte, gezinmeler için Transition'lar kullanarak yapılmış küçük bir basitleştirilmiş yönlendirici örneği.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

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
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
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
      Open The Beatles artist page
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

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

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

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Panel.js hidden
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

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
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

<Note>

[Suspense özelliği etkinleştirilmiş](/reference/react/Suspense) yönlendiricilerin, varsayılan olarak gezinme güncellemelerini transitionlara dahil etmeleri beklenir.

</Note>

---

### Bir hata sınırı ile kullanıcılara bir hatayı gösterme {/*displaying-an-error-to-users-with-error-boundary*/}

<Canary>

Error Boundary for useTransition is currently only available in React's canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

If a function passed to `startTransition` throws an error, you can display an error to your user with an [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an error boundary, wrap the component where you are calling the `useTransition` in an error boundary. Once the function passed to `startTransition` errors, the fallback for the error boundary will be displayed.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
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
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Sorun Giderme {/*troubleshooting*/}

### Transition içinde bir inputu (girdiyi) güncelleme işlemi çalışmaz {/*updating-an-input-in-a-transition-doesnt-work*/}

Bir input alanını kontrol eden state değişkeni için transition kullanamazsınız:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Kontrollü input state'i için transitionlar kullanılamaz
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Bunun nedeni, transition işlemlerinin bloklamayan bir yapıda olmalarıdır, ancak bir değişiklik olayına yanıt olarak input alanını güncellemek eşzamanlı olarak gerçekleşmelidir. Yazma işlemine yanıt olarak transition çalıştırmak isterseniz, iki seçeneğiniz vardır:

1. İki ayrı state değişkeni tanımlayabilirsiniz: biri input state'i için (her zaman eşzamanlı olarak güncellenir), diğeri de bir transition güncelleyeceğiniz değişken. Bu şekilde, girişi eşzamanlı state kullanarak kontrol etmenizi ve transition state değişkenini (girişin "gerisinde kalacak" olan) render işleminize aktarmanızı sağlar.
2. Alternatif olarak, bir state değişkeniniz olabilir ve gerçek değerin "gerisinde kalacak" olan [`useDeferredValue`](/reference/react/useDeferredValue) ekleyebilirsiniz. Bu, yeni değeri otomatik olarak "yakalamak" için bloklamayan yeniden render işlemini tetikler.

---

### React, state güncellememi bir transition olarak işlemiyor {/*react-doesnt-treat-my-state-update-as-a-transition*/}

State güncellemesini bir transition içine aldığınızda, bunun `startTransition` çağrısı *esnasında* gerçekleştiğinden emin olun:

```js
startTransition(() => {
  // ✅ State'in startTransition çağrısı *esnasında* ayarlanması
  setPage('/about');
});
```

`startTransition`'a ilettiğiniz fonksiyon senkron olmalıdır.

Bir güncellemeyi bu şekilde transition olarak işaretleyemezsiniz:

```js
startTransition(() => {
  // ❌ startTransition çağrısından *sonra* state'in ayarlanması
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Onun yerine, bunu yapabilirsiniz:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ startTransition çağrısı *esnasında* state'in ayarlanması
    setPage('/about');
  });
}, 1000);
```

Benzer şekilde, bu şekilde bir güncellemeyi transition olarak işaretleyemezsiniz:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
```

Ancak, aşağıdaki şekilde işe yarar:

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ startTransition çağrısı *esnasında* state'in ayarlanması
  setPage('/about');
});
```

---

### Bileşenin dışından `useTransition`'u çağırmak istiyorum {/*i-want-to-call-usetransition-from-outside-a-component*/}

`useTransition`, bir Hook olduğu için bileşenin dışından çağrılamaz. Bu durumlarda, [`startTransition`](/reference/react/startTransition) adlı bağımsız bir metod kullanabilirsiniz. Bu yöntem aynı şekilde çalışır, ancak `isPending` belirteçini sağlamaz.


---

### `startTransition`'a ilettiğim fonksiyon hemen çalışıyor {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Bu kodu çalıştırırsanız, 1, 2, 3 yazdırır:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1, 2, 3 yazdırması beklenir.** `startTransition`'a ilettiğiniz fonksiyon gecikmez. Tarayıcının `setTimeout` metodu aksine, callback'i daha sonra çalıştırmaz. React, fonksiyonunuzu hemen çalıştırır, ancak *çalışırken* planlanan herhangi bir state güncellemesi transition olarak işaretlenir. Bunu nasıl çalıştığını aşağıdaki gibi düşünebilirsiniz:

```js
// React'in nasıl çalıştığına dair basitleştirilmiş bir versiyon

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... bir transition state güncellemesi planla ...
  } else {
    // ... acil bir state güncellemesi planla ...
  }
}
```
