---
title: <StrictMode>
---


<Intro>

`<StrictMode>` geliştirmeleriniz sırasında bileşenlerinizdeki genel hataları erkenden bulmanızı sağlar.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

`StrictMode`'unu bileşen ağaçları içinde ek geliştirme davranışları ve uyarılar için kullanınız:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

Strict Modu aşağıdaki geliştirici davranışlarını etkinleştirir:

<<<<<<< HEAD
- Bileşenleriniz, saf olmayan renderdan kaynaklanan hataları bulmak için [ekstra bir sürede yeniden render edilecektir.](#fixing-bugs-found-by-double-rendering-in-development)
- Bileşenleriniz eksik Efekt temizlemesinin neden olduğu hataları bulmak için [ekstra bir sürede Efektleri yeniden çalıştıracaktır.](#fixing-bugs-found-by-re-running-effects-in-development)
- Bileşenleriniz [kullanımdan kaldırılan API kullanımı için kontrol edilecektir.](#fixing-deprecation-warnings-enabled-by-strict-mode)
=======
- Your components will [re-render an extra time](#fixing-bugs-found-by-double-rendering-in-development) to find bugs caused by impure rendering.
- Your components will [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) to find bugs caused by missing Effect cleanup.
- Your components will [re-run refs callbacks an extra time](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) to find bugs caused by missing ref cleanup.
- Your components will [be checked for usage of deprecated APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

#### Prop'lar {/*props*/}

`StrictMode` herhangi bir prop kabul etmez.

#### Uyarılar {/*caveats*/}

* `<StrictMode>` ile sarılmış ağaçta Strict Modundan çıkmanın bir yolu yoktur. Bu size `<StrictMode>`'un altındaki tüm bileşenlerinizin kontrol edildiğinin güvencesini verir. Bir ürün üzerinde çalışan iki takım kontrolleri değerli bulup bulmadığı konusunda anlaşamazsa, uzlaşmak zorundalar ya da `<StrictMode>` etiketini ağaçta aşağı doğru taşımaları gerekir.

---

## Kullanım {/*usage*/}

### Strict Modunu tüm uygulamada etkinleştirme {/*enabling-strict-mode-for-entire-app*/}

Strict Modu, `<StrictMode>` bileşeni altındaki tüm bileşenler için yalnızca geliştirme amaçlı ekstra kontroller sağlar. Bu kontroller, bileşenlerinizdeki hataları erkenden bulmanıza yardımcı olur.


Tüm projenizde Strict Modu etkilenştirmek için, render sırasında kök bileşeninizi `<StrictMode>` bileşeni ile sarın. 

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Özellikle yeni yaratılmış uygulamalarınızda, tüm uygulamayı Strict Modu ile sarmanızı öneririz. Sizin yerinize [`createRoot`](/reference/react-dom/client/createRoot)'u çağıran bir çatı ile çalışıyorsanız, Strict Modun nasıl etkileştirileceğine çatının dokümantasyonundan bakabilirsiniz.

Strict Mod kontrolleri **yalnızca geliştirme aşamasında çalıştırılsa da** size kodunuzda zaten var olan ancak üretim ortamında güvenilir bir şekilde tekrarlanması zor olabilen hataları bulmada yardımcı olurlar. Strict Modu, kullanıcılar farketmeden önce hataları bulmanızı sağlar.

<Note>

Strict Modu geliştirme sırasında aşağıdaki kontrolleri etkinleştirir:

<<<<<<< HEAD
- Bileşenleriniz, saf olmayan renderdan kaynaklanan hataları bulmak için [ekstra bir sürede yeniden render edilecektir.](#fixing-bugs-found-by-double-rendering-in-development)
- Bileşenleriniz eksik Efekt temizlemesinin neden olduğu hataları bulmak için [ekstra bir sürede Efektleri yeniden çalıştıracaktır.](#fixing-bugs-found-by-re-running-effects-in-development)
- Bileşenleriniz [kullanımdan kaldırılan API kullanımı içiin kontrol edilecektir.](#fixing-deprecation-warnings-enabled-by-strict-mode)
=======
- Your components will [re-render an extra time](#fixing-bugs-found-by-double-rendering-in-development) to find bugs caused by impure rendering.
- Your components will [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) to find bugs caused by missing Effect cleanup.
- Your components will [re-run ref callbacks an extra time](#fixing-bugs-found-by-cleaning-up-and-re-attaching-dom-refs-in-development) to find bugs caused by missing ref cleanup.
- Your components will [be checked for usage of deprecated APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

**Tüm bu kontroller yalnızca geliştirme sırasında çalıştırılar ve canlıda herhangi bir etkisi yoktur.**

</Note>

---

### Strict Modu uygulamanın bir parçası için etkinleştirme {/*enabling-strict-mode-for-a-part-of-the-app*/}

Strict Modu uygulamanızın herhangi bir parçası için de etkinleştirebilirsiniz: 

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Örnekte gösterildiği üzere, Strict Modu `Header` ve `Footer` bileşenlerinde çalışmayacaktır. Ancak `Sidebar` ve `Content` bileşenleri ve bu bileşenler içindeki alt bileşenlerde, ne kadar derin olduğu farketmeksizin, çalışacaktır.
---

### Geliştirme sırasında çift renderda bulunan hataları düzeltme {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React yazdığınız her bileşeni saf fonksiyon olarak kabul eder.](/learn/keeping-components-pure) Bu, yazdığınız bileşenlerin aynı girdiler (proplar, durum ve bağlam) verildiğinde her zaman aynı JSX'i döndürmesi gerektiği anlamına gelir.

Bu kuralı çiğneyen bileşenler öngörülemeyecek şekilde davranırlar ve hatalara sebep olur. Saf olmayan kodları bulmanıza yardımcı olmak için, Strict Modu bazı fonksiyonlarınınızı (sadece saf olması gerekenleri) **geliştirme sırasında iki kez çağırır.** Bu durum aşağıdakileri içerir:
- Fonksiyon bileşen gövdeleri (sadece üst düzey mantıktakiler, o yüzden olay yöneticieri içindeki kodları içermez)
- [`useState`](/reference/react/useState), [`set` fonksiyonları](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), ya da [`useReducer`](/reference/react/useReducer)'a iletilen fonksiyonlar.
- [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([tüm listeye göz atınt](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)) gibi bazı sınıf bileşeni metodları

Eğer saf bir fonksiyonsa, iki kez çalıştırmak hiçbir şeyi değiştirmez çünkü saf fonksiyonlar her zaman aynı sonucu üretir. Ancak, saf olmayan bir fonksiyonsa (örneğin, aldığı veriyi değiştiriyorsa), iki kez çalıştırmak farkedilir olma eğilimindedir (zaten bu sebepten saf değil) Bu durum hatayı erkenden farketmenize ve çözmenize yardımcı olur. 

**Strict Modunda iki kez render etmenin hataları erkenden nasıl bulduğuna dair bir örnek:**

Aşağıdaki `StoryTray` bileşeni bir `stories` dizisini alır ve sonuna "Create Story" elemanını ekler:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ali'in Hikayesi" },
  {id: 1, label: "Can'ın Hikayesi" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Hikaye Oluştur' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Yukardaki kodda ilk çıktı doğru olduğu için gözden kaçırmanın çok kolay olduğu bir hata bulunmaktadır.

Bu hata `StoryTray` bileşeni birden fazla kez render edilirse daha çok göze çarpar. Örneğin, `StoryTray`'i imleç ile üzerine geldiğinizde arka plan rengi değişecek şekilde yeniden render edelim: 
<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ali'in Hikayesi" },
  {id: 1, label: "Can'ın Hikayesi" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Hikaye Oluştur' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

`StoryTray` bileşeninin üzerine her gelişinizde listeye "Create Story" eklediğini göreceksiniz. Kodun asıl amacı listenin sonuna bir kez eklemesiydi. Ancak `StoryTray`, `stories` dizisini proplar aracılığıyla değiştiriyor. `StoryTray` her render edildiğinde, aynı diziye "Create Story"'i ekliyor. Yani başka bir deyişle, `StoryTray` birden fazla kez çalıştırıldığında farklı sonuçlar ürettiği için saf bir fonksiyon değil.

Bu sorunu çözmek için, dizinin bir kopyasını oluşturabilirsiniz ve asıl dizi yerine bu kopyayı güncelleyebilirsiniz:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // diziyi kopyalayın
  // ✅ İyi: yeni dizinin içine atın
  items.push({ id: 'create', label: 'Hikaye Oluştur' });
```

Bu değişiklik [`StoryTray` fonksiyonunu saflaştıracaktır.](/learn/keeping-components-pure) Fonksiyon her çağırıldığında, sadece kopyalanmış diziyi değiştirecek ve diğer nesne ve değişkenleri etkilemeyecektir. Bu, sorunu çözer, ancak bileşenin davranışında bir sorun olduğunu farketmeden önce bileşeni daha çok yeniden render etmeniz gerekti.

**Asıl örnekte, hata göze batmıyordu. Şimdi orijinal (hatalı) kodu `<StrictMode>` ile saralım:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ali'in Hikayesi" },
  {id: 1, label: "Can'ın Hikayesi" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Hikaye Oluştur' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Modu *her zaman* render fonksiyonlarınızı iki kez çağırır, bu sayede hatayı direkt olarak görebilirsiniz** ("Create Story" iki kez eklendi). Bu, hatayı daha erken farketmenizi sağladı. Bileşeninizdeki hataları düzeltirken, Strict Modunda render ederseniz, imleç ile bileşen üzerine gelme işlevselliğinde olduğu gibi oluşabilecek *diğer* hataları düzeltirsiniz:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ali'in Hikayesi" },
  {id: 1, label: "Can'ın Hikayesi" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Diziyi kopyala
  items.push({ id: 'create', label: 'Hikaye Oluştur' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

StrictModu olmadan, yeniden render sayısını arttırana kadar hataları gözden kaçırmanız çok kolaydır. Strict Modu aynı hatayı hemen gösterir. Strict Modu kodlarınızı takımınıza ya da kullanıcılarınza göndermenden önce hataları bulmanıza yardımcı olur.

[Bileşenleri saflaştırmak için daha fazlasına göz atın.](/learn/keeping-components-pure)

<Note>

[React DevTools](/learn/react-developer-tools) yüklüyse, herhangi bir `console.log` çağrısı ikinci renderdan sonra yavaşça soluklaşmaya başlayacaktır. Ayrıca React Devtools tamamını göz ardı edecek ayara (varsayılan olarak kapalı) sahiptir.

</Note>

---

### Efektlerin yeniden çalıştırılması sırasında tespit edilen hataları giderme {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Modu, [Efektler](/learn/synchronizing-with-effects)'de oluşan hataları da bulmanıza yardımcı olur.

Her Efekt, kurulum kodları ve bazı temizleme kodlarına sahiptir. Normalde, React bileşen *DOM'a eklenirken* kurulum kodlarını çağırır ve bileşen *DOM'dan silinirken* (ekrandan kaldırılır) temizleme kodlarını çağırır. Daha sonra React, bağımlılıklar son renderdan itibaren değiştiyse temizleme ve kurulum kodlarını yeniden çağırır.

Ayrıca React, Strict Modun aktifken **her Efekt için geliştirme sırasında ekstra bir kurulum+temizleme döngüsüne girecektir.** Şaşırtıcı olabilir ancak bu durum göze çarpmayan yakalaması zor hataları ortaya çıkarır.

**Strict Modunda Efektlerin yeniden çalışmasıyla hataların erkenden tespit edilmesiyle ilgili bir örnek**

Bir bileşeni sohbete bağlayan bu örneği ele alalım:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Gerçek bir implementasyon sunucuya gerçekten bağlanacaktır
  return {
    connect() {
      console.log('✅' + serverUrl + "'deki" + roomId + "'li odaya bağlanılıyor...");
      connections++;
      console.log('Aktif bağlantılar: ' + connections);
    },
    disconnect() {
      console.log('❌' + serverUrl + "'deki" + roomId + "'li odanın bağlantısı kesildi");
      connections--;
      console.log('Aktif bağlantılar: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Hemen göze çarpmasa da yukarıdaki kodda bir hata var.

Hatayı daha bariz yapmak için bazı özellikler ekleyelim. Aşağıdaki örnekte, `roomId` sabit olarak ayarlanmış. Bunun yerine, kullanıcı açılır listeler ile bağlanmak istedikleri `roomId`'yi kendileri seçebilmeleri gerekiyor. "Sohbeti aç"'a tıklayın ve farklı sohbet odalarını tek tek seçin. Konsoldaki aktif bağlantı sayısını takip edin:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>{roomId} odasına hoşgeldiniz!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">genel</option>
          <option value="travel">seyahat</option>
          <option value="music">müzik</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Gerçek bir implementasyon sunucuya gerçekten bağlanacaktır
  return {
    connect() {
      console.log('✅' + serverUrl + "'deki" + roomId + "'li odaya bağlanılıyor...");
      connections++;
      console.log('Aktif bağlantılar: ' + connections);
    },
    disconnect() {
      console.log('❌' + serverUrl + "'deki" + roomId + "'li odanın bağlantısı kesildi");
      connections--;
      console.log('Aktif bağlantılar: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Açık olan bağlantı sayısının sürekli arttığını göreceksiniz. Bu durum gerçek bir uygulamada, performans ve internet sorunlarına yol açacaktır. Buradaki sorun [Efektinizde temizleme fonksiyonu eksik:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```
Efektiniz artık kendi kendini "temizlediği" ve süresi dolan bağlantıları kestiği için, sızıntı çözüldü. Ancak bu sorun birden fazla özellik (seçim kutusu) ekleyene kadar göze çarpmamıştı

**Asıl örnekte, hata göze batmıyordu. Şimdi orijinal (hatalı) kodu `<StrictMode>` ile saralım:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>{roomId} odasına hoşgeldiniz!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Gerçek bir implementasyon sunucuya gerçekten bağlanacaktır
  return {
    connect() {
      console.log('✅' + serverUrl + "'deki" + roomId + "'li odaya bağlanılıyor...");
      connections++;
      console.log('Aktif bağlantılar: ' + connections);
    },
    disconnect() {
      console.log('❌' + serverUrl + "'deki" + roomId + "'li odanın bağlantısı kesildi");
      connections--;
      console.log('Aktif bağlantılar: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Strict Modu ile sorun olduğunu hemen farkedersiniz** (aktif bağlantı sayısı 2ye çıktı). Strict Modu, her Efekt için fazladan kurulum+temizleme döngüsü başlatır. Bu Efektin temizlik mantığı yok o yüzden de fazladan bağlantı oluşturabiliyor ancak bağlantıyı kesmiyor. Bu, temizleme fonksiyonunu unuttuğunuza dair bir ipucu.

Strict Modu bunun gibi hataları daha erken farketmenizi sağlar. Efektinizi, Strict Modunda temizleme fonksiyonu ekleyerek düzelttiğinizde, seçim kutusunda olduğu gibi oluşabilecek *diğer* hataları düzeltirsiniz:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} odasına hoşgeldiniz!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Sohbet odası seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">genel</option>
          <option value="travel">seyahat</option>
          <option value="music">müzik</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Gerçek bir implementasyon sunucuya gerçekten bağlanacaktır
  return {
    connect() {
      console.log('✅' + serverUrl + "'deki" + roomId + "'li odaya bağlanılıyor...");
      connections++;
      console.log('Aktif bağlantılar: ' + connections);
    },
    disconnect() {
      console.log('❌' + serverUrl + "'deki" + roomId + "'li odanın bağlantısı kesildi");
      connections--;
      console.log('Aktif bağlantılar: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Konsoldaki aktif bağlantı sayısının artık artmadığını farkettiniz mi?

Strict Modu olmadan, Efektinizde temizleme işlevinin eksik olduğunu gözden kaçırmanız çok kolay. Strict Modu, geliştirme aşamasındaki Efektiniz için *kurulum* yerine *kurulum → temizleme → kurulum* adımlarını çalıştırarak, eksik olan temizleme adımının eksik olduğunu gösterdi.

[Efekt temizleme işlevini uygulama hakkında daha fazla bilgi edinin.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### Fixing bugs found by re-running ref callbacks in development {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

<<<<<<< HEAD
### Strict Modunda kullanımdan kaldırılan özelliklerle ilgili hataların düzeltilmesi {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
=======
Strict Mode can also help find bugs in [callbacks refs.](/learn/manipulating-the-dom-with-refs)

Every callback `ref` has some setup code and may have some cleanup code. Normally, React calls setup when the element is *created* (is added to the DOM) and calls cleanup when the element is *removed* (is removed from the DOM).

When Strict Mode is on, React will also run **one extra setup+cleanup cycle in development for every callback `ref`.** This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.

Consider this example, which allows you to select an animal and then scroll to one of them. Notice when you switch from "Cats" to "Dogs", the console logs show that the number of animals in the list keeps growing, and the "Scroll to" buttons stop working:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node}; 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**This is a production bug!** Since the ref callback doesn't remove animals from the list in the cleanup, the list of animals keeps growing. This is a memory leak that can cause performance problems in a real app, and breaks the behavior of the app.

The issue is the ref callback doesn't cleanup after itself:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

Now let's wrap the original (buggy) code in `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node} 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**With Strict Mode, you immediately see that there is a problem**. Strict Mode runs an extra setup+cleanup cycle for every callback ref. This callback ref has no cleanup logic, so it adds refs but doesn't remove them. This is a hint that you're missing a cleanup function.

Strict Mode lets you eagerly find mistakes in callback refs. When you fix your callback by adding a cleanup function in Strict Mode, you *also* fix many possible future production bugs like the "Scroll to" bug from before:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal, node};
                  list.push({animal: animal, node});
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    list.splice(list.indexOf(item));
                    console.log(`❌ Removing animal from the map. Total animals: ${itemsRef.current.length}`);
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Now on inital mount in StrictMode, the ref callbacks are all setup, cleaned up, and setup again:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**This is expected.** Strict Mode confirms that the ref callbacks are cleaned up correctly, so the size never grows above the expected amount. After the fix, there are no memory leaks, and all the features work as expected.

Without Strict Mode, it was easy to miss the bug until you clicked around to app to notice broken features. Strict Mode made the bugs appear right away, before you push them to production.

--- 
### Fixing deprecation warnings enabled by Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

React, `<StrictMode>` içindeki herhangi bir bileşende aşağıdaki kullanımdan kaldırılan API'lardan biri kullanılıyorsa sizi uyarır:

<<<<<<< HEAD
* [`findDOMNode`](/reference/react-dom/findDOMNode). [Alternatiflerini inceleyin](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount) gibi `UNSAFE_` sınıf yaşam döngüsü metodları. [Alternatiflerini inceleyin](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* Eski context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), ve [`getChildContext`](/reference/react/Component#getchildcontext)). [Alternatiflerini inceleyin](/reference/react/createContext)
* Eski dizi referansları ([`this.refs`](/reference/react/Component#refs)). [Alternatiflerini inceleyin](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)
=======
* `UNSAFE_` class lifecycle methods like [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [See alternatives.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

Bu API'lar özellikle eski [sınıf bileşenlerinde](/reference/react/Component) kullanılırdı o yüzden güncel uygulamalarda nadiren karşınıza çıkar.
