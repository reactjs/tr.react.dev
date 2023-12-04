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

- Bileşenleriniz, saf olmayan renderdan kaynaklanan hataları bulmak için [ekstra bir sürede yeniden render edilecektir.](#fixing-bugs-found-by-double-rendering-in-development)
- Bileşenleriniz eksik Efekt temizlemesinin neden olduğu hataları bulmak için [ekstra bir sürede Efektleri yeniden çalıştıracaktır.](#fixing-bugs-found-by-re-running-effects-in-development)
- Bileşenleriniz [kullanımdan kaldırılan API kullanımı için kontrol edilecektir.](#fixing-deprecation-warnings-enabled-by-strict-mode)

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

- Bileşenleriniz, saf olmayan renderdan kaynaklanan hataları bulmak için [ekstra bir sürede yeniden render edilecektir.](#fixing-bugs-found-by-double-rendering-in-development)
- Bileşenleriniz eksik Efekt temizlemesinin neden olduğu hataları bulmak için [ekstra bir sürede Efektleri yeniden çalıştıracaktır.](#fixing-bugs-found-by-re-running-effects-in-development)
- Bileşenleriniz [kullanımdan kaldırılan API kullanımı içiin kontrol edilecektir.](#fixing-deprecation-warnings-enabled-by-strict-mode)

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

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js App.js
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

```js StoryTray.js active
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
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Yukardaki kodda ilk çıktı doğru olduğu için gözden kaçırmanın çok kolay olduğu bir hata bulunmaktadır.

Bu hata `StoryTray` bileşeni birden fazla kez render edilirse daha çok göze çarpar. Örneğin, `StoryTray`'i imleç ile üzerine geldiğinizde arka plan rengi değişecek şekilde yeniden render edelim: 
<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
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

```js StoryTray.js active
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
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
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

```js index.js
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

```js App.js
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

```js StoryTray.js active
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
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Modu *her zaman* render fonksiyonlarınızı iki kez çağırır, bu sayede hatayı direkt olarak görebilirsiniz** ("Create Story" iki kez eklendi). Bu, hatayı daha erken farketmenizi sağladı. Bileşeninizdeki hataları düzeltirken, Strict Modunda render ederseniz, imleç ile bileşen üzerine gelme işlevselliğinde olduğu gibi oluşabilecek *diğer* hataları düzeltirsiniz:

<Sandpack>

```js index.js
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

```js App.js
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

```js StoryTray.js active
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
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
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

```js index.js
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

```js chat.js
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

```js index.js
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

```js chat.js
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

```js index.js
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

```js chat.js
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

```js index.js
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

```js chat.js
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

### Strict Modunda kullanımdan kaldırılan özelliklerle ilgili hataların düzeltilmesi {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React, `<StrictMode>` içindeki herhangi bir bileşende aşağıdaki kullanımdan kaldırılan API'lardan biri kullanılıyorsa sizi uyarır:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [Alternatiflerini inceleyin](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount) gibi `UNSAFE_` sınıf yaşam döngüsü metodları. [Alternatiflerini inceleyin](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* Eski context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), ve [`getChildContext`](/reference/react/Component#getchildcontext)). [Alternatiflerini inceleyin](/reference/react/createContext)
* Eski dizi referansları ([`this.refs`](/reference/react/Component#refs)). [Alternatiflerini inceleyin](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

Bu API'lar özellikle eski [sınıf bileşenlerinde](/reference/react/Component) kullanılırdı o yüzden güncel uygulamalarda nadiren karşınıza çıkar.
