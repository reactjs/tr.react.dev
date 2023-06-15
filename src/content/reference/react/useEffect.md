---
title: useEffect
---

<Intro>

`useEffect`, [bir bileşeni harici sistem ile senkronize](/learn/synchronizing-with-effects) etmenizi sağlar.

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Bir Effect bildirmek için bileşeninizin en üst düzeyinde `useEffect`'i çağırın:

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Daha fazla örnek görmek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `setup`: Effect'inizin mantığını içeren fonksiyon. Setup (kurulum) fonksiyonunuz isteğe bağlı olarak *temizleme (cleanup)* fonksiyonu da döndürebilir. Bileşeniniz DOM'a eklendiğinde, React setup (kurulum) fonksiyonunuzu çalıştıracaktır. Değişen bağımlılıklar ile her yeniden render işleminden sonra, React önce temizleme fonksiyonunu (eğer sağladıysanız) eski değerlerle çalıştıracak ve ardından setup (kurulum) fonksiyonunuzu yeni değerlerle çalıştıracaktır. Bileşeniniz DOM'dan kaldırıldıktan sonra, React temizleme fonksiyonunuzu çalıştıracaktır.
 
* **Opsiyonel** `bağımlılıklar`: `setup` (`kurulum`) kodunun içinde referansı olan tüm reaktif değerlerin listesi. Reaktif değerler prop'ları, state'i ve bileşeninizin gövdesi içinde bildirilen tüm değişkenleri ve fonksiyonları içerir. Linter'ınız [React için yapılandırılmış](/learn/editor-setup#linting) ise, her reaktif değerin bağımlılık olarak doğru bir şekilde belirtildiğini doğrulayacaktır. Bağımlılık listesi sabit sayıda öğeye sahip olmalı ve `[dep1, dep2, dep3]` şeklinde satır içinde yazılmalıdır. React, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırmasını kullanarak her bağımlılığı öncek değeri ile karşılaştırır. Eğer bağımlılık listesini boş bırakırsanız, Effect'iniz her yeniden render'dan sonra tekrar çalışacaktır. [Bağımlılık dizisi iletmenin, boş dizi iletmenin ve hiç bağımlılık olmaması arasındaki farkı görün.](#examples-dependencies)

#### Döndürülenler {/*returns*/}

`useEffect`, `undefined` döndürür.

#### Uyarılar {/*caveats*/}

* `useEffect` bir Hook'tur, dolayısıyla bu Hook'u yalnızca **bileşeninizin en üst seviyesinde** veya kendi Hook'larınızda çağırabilirsiniz. Döngüler veya koşullu ifadeler içinde çağıramazsınız. Eğer çağırmak istiyorsanız, yeni bir bileşen çıkarın ve state'i içine taşıyın.

* Eğer **harici sistemle senkronize etmeye çalışmıyorsanız,** [büyük ihtimalle Effect'e ihtiyacınız yoktur.](/learn/you-might-not-need-an-effect)

* Strict Modu kullanırken, React ilk gerçek kurulumdan önce **sadece geliştirme sırasında olmak üzere ekstra bir kurulum+temizleme döngüsü** çalıştırır. Bu, temizleme mantığınızın kurulum mantığınızı "yansıtmasını" ve kurulumun yaptığı her şeyi durdurmasını ya da geri almasını sağlayan bir stres testidir. Eğer bu bir sorun yaratıyorsa, [temizleme fonksiyonunu uygulayın.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Eğer bağımlılıklarınızdan bazıları nesneler veya bileşeniniz içinde tanımlanmış fonksiyonlar ise, bu bağımlılıkların **Effect'in gerekenden daha sık yeniden çalışmasına neden olma riski vardır.** Bu durumu düzeltmek için, gereksiz [nesne](#removing-unnecessary-object-dependencies) ve [fonksiyon](#removing-unnecessary-function-dependencies) bağımlılıklarını silin. Ayrıca [state güncellemelerinizi](#updating-state-based-on-previous-state-from-an-effect) ve [reaktif olmayan mantıüı](#reading-the-latest-props-and-state-from-an-effect) Effect dışına alabilirsiniz.

* Eğer Effect'inize bir etkileşim (tıklama gibi) neden olmuyorsa, React tarayıcının **Effect'inizi çalıştırmadan önce güncellenen ekranı boyamasına izin verecektir.** Eğer Effect'iniz görsel (örneğin ipucu gösterme) bir şey yapıyorsa ve gecikme gözle görülebilir gibiyse (örneğin titriyorsa), `useEffect`'i [`useLayoutEffect`](/reference/react/useLayoutEffect) ile değiştirin.

* Effect'inize bir etkileşim (tıklama gibi) neden oluyor olsa bile, **tarayıcı, Effect'iniz içindeki state güncellemelerini işlemeden önce ekranı yeniden boyayabilir.** Genellikle, istediğiniz şey budur. Ancak, tarayıcının ekranı yeniden boyamasını engellemek zorundaysanız, `useEffect`'i [`useLayoutEffect`](/reference/react/useLayoutEffect) ile değiştirmelisiniz.

* Effect'ler **sadece client (kullanıcı) tarafında çalışır.** Server render etme sırasında çalışmazlar.

---

## Kullanım {/*usage*/}

### Harici sisteme bağlanma {/*connecting-to-an-external-system*/}

Bazı bileşenlerin sayfada görüntülenebilmesi için ağa, bazı tarayıcı API'larına ya da üçüncü parti kütüphanelere bağlı kalması gerekir. Bu sistemler React tarafından kontrol edilmezler, bu yüzden *harici* olarak adlandırılırlar.

[Bileşeninizi harici bir sisteme bağlamak için](/learn/synchronizing-with-effects), bileşeninizin en üst düzeyinde `useEffect`'i çağırın:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect`'e iki argüman iletmeniz gerekmektedir:

1. Bu sisteme bağlanan <CodeStep step={1}>setup (kurulum) kodu</CodeStep> içeren bir *setup fonksiyonu*.
   - Bu sistemle bağlantıyı kesen <CodeStep step={2}>clenaup (temizleme) kodu</CodeStep> içeren bir *temizleme fonksiyonu* döndürmeli.
2. Bileşeninizden bu fonksiyonların içinde kullanılan her değeri içeren bir <CodeStep step={3}>bağımlılıklar listesi</CodeStep>.

**React, setup (kurulum) ve cleanup (temizleme) fonksiyonlarınızı gerektiğinde birden çok defa çağırılabilecek şekilde çağırır:**

1. <CodeStep step={1}>setup kodunuz</CodeStep> bileşeniniz sayfaya eklendiğinde çalışır *(DOM'a eklendiğinde)*.
2. Bileşeninizin <CodeStep step={3}>bağımlılıklarının</CodeStep> değiştiği her yeniden render etmeden sonra:
   - İlk olarak, <CodeStep step={2}>cleanup (temizleme) kodunuz</CodeStep> eski prop'lar ve state ile çalışır.
   - Daha sonra, <CodeStep step={1}>setup (kurulum) kodunuz</CodeStep> yeni prop'lar ve state ile çalışır.
3. <CodeStep step={2}>cleanup (temizleme) kodunuz</CodeStep> son kez bileşeniniz sayfadan kaldırıldığında çalışır *(DOM'dan çıkarıldığında).*

**Yukarıdaki örneği biraz açıklayalım.**  

Yukarıdaki `ChatRoom` bileşeni sayfaya eklendiğinde, başlangıç `serverUrl` ve `roomId` ile sohbet odasına bağlanacaktır. Eğer `serverUrl` veya `roomId`'den biri yeniden render yüzünden değişirse (diyelim ki kullanıcı başka bir sohbet odasını seçerse), Effect'iniz önceki odayla *bağlantısını kesecek ve bir sonraki odaya bağlanacaktır.* `ChatRoom` bileşeniniz sayfadan kaldırıldığında, Effect'iniz son bir defa bağlantıyı kesecektir.

**Geliştirme sırasında [hataları bulmanıza yardımcı olmak](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) için React, <CodeStep step={1}>setup(kurulum)</CodeStep> ve <CodeStep step={2}>cleanup(temizleme)</CodeStep>'yi <CodeStep step={1}>setup(kurulum)</CodeStep>'dan önce son kez çalıştırır.** Bu, Effect mantığınızın doğru uygulandığını doğrulayan bir stres testidir. Bu, gözle görünür sorunlara neden oluyorsa, cleanup (temizleme) fonksiyonunuzda bazı mantık hataları vardır. Temizleme fonksiyonu, kurulum fonksiyonunun yaptığı her şeyi durdurmalı ya da geri almalıdır. Temel kural, kullanıcı bir kez çağrılan setup (kurulum) (son üründe olduğu gibi) ile *setup* → *cleanup* → *setup* sekansı (geliştirme sırasında olduğu gibi) arasındaki farkı ayırt etmemelidir. [Sık kullanılan çözümlere göz gezdirin.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**[Her Effect'i bağımsız bir süreç olarak yazmayı](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) ve [her seferinde tek setup(kurulum)/cleanup(temizleme) döngüsü düşünmeyi](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective) deneyin.** Bileşeninizin DOM'a ekleniyor/çıkarılıyor ya da güncelleniyor olması fark etmemelidir. Temizleme mantığınız kurulum mantığını doğru bir şekilde "yansıttığında", Effect'iniz kurulum ve temizlemeyi gerektiği sıklıkta çalıştıracaktır.

<Note>

Effect, [bileşeninizi harici bir sistemle senkronize tutmanızı](/learn/synchronizing-with-effects) (sohbet servisi gibi) sağlar. Burada *harici sistem*, React tarafından kontrol edilmeyen herhangi bir kod parçası demektir. Örneğin:

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> ve <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep> ile yönetilen bir zamanlayıcı.
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> ve <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep> kullanan bir olay aboneliği.
* <CodeStep step={1}>`animation.start()`</CodeStep> ve <CodeStep step={2}>`animation.reset()`</CodeStep> gibi bir API içeren üçüncü parti animasyon kütüphanesi.

**Eğer herhangi bir harici sisteme bağlanmıyorsanız, [büyük ihtimalle Effect'e ihtiyacınız yoktur.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Harici bir sisteme bağlanma örnekleri" titleId="examples-connecting">

#### Sohbet sunucusuna bağlanma {/*connecting-to-a-chat-server*/}

Bu örnekte, `ChatRoom` bileşeni `chat.js`'de bildirilen harici sisteme bağlı kalmak için Effect'i kullanmaktadır. "Sohbeti aç" butonuna tıklayarak `ChatRoom` bileşenini render edin. Bu sandbox geliştirme modunda çalışmaktadır, bu yüzden fazladan bir bağlan ve bağlantıyı kes döngüsü [burada açıklandığı gibi](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) vardır. `roomId` ve `serverUrl`'yi aşağı doğru açılan menüyü (dropdown) kullanarak değiştirin ve Effect'in nasıl tekrardan sohbete bağlandığını görün. "Sohbeti kapat" butonuna tıklayarak Effect'in son kez bağlantıyı kesmesini görün.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} odasına hoş geldiniz!</h1>
    </>
  );
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
          <option value="general">Genel</option>
          <option value="seyahat">Seyahat</option>
          <option value="muzik">Müzik</option>
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
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Global tarayıcı olayını dinleme {/*listening-to-a-global-browser-event*/}

Bu örnekte, harici sistem tarayıcı DOM'unun kendisidir. Normalde, olay dinleyicilerini JSX ile belirtirsiniz ancak global [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) nesnesini bu şekilde dinleyemezsiniz. Effect, `window` nesnesine bağlanmanızı ve olaylarını dinlemenizi sağlar. `pointermove` olayını dinlemek, imlecin (ya da parmağın) konumunu izlemenize ve kırmızı noktayı o konumda hareket edecek şekilde güncellemenizi sağlar.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Animasyon tetikleme {/*triggering-an-animation*/}

Bu örnekteki harici sistem, `animation.js` dosyasındaki animasyon kütüphanesidir. Bu, DOM node'unu argüman olarak alan ve animasyonu kontrol etmek için `start()` ve `stop()` metodlarını kullanıma sunan `FadeInAnimation` adlı JavaScript sınıfı sağlar. Bu bileşen alttaki DOM node'una ulaşmak için [ref'i kullanır.](/learn/manipulating-the-dom-with-refs) Effect, DOM node'unu ref'ten okur ve bileşen render edildiğinde o node için animasyonu otomatik olarak başlatır.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Hoş geldin
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Kaldır' : 'Göster'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // hgmen sona atla
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Animasyonu başlat
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Hala boyanması gereken kareler (frames) var
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Modal dialog'unu kontrol etme {/*controlling-a-modal-dialog*/}

Bu örnekte harici sistem, tarayıcı DOM'udur. `ModalDialog` bileşeni bir [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elemanı render eder. `isOpen` prop'unu [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) ve [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) metod çağrıları ile senkronize etmek için Effect'i kullanır.

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Dialog'u aç
      </button>
      <ModalDialog isOpen={show}>
        Selamlar!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Kapat</button>
      </ModalDialog>
    </>
  );
}
```

```js ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Elemanın görünebilirliğini takip etme {/*tracking-element-visibility*/}

Bu örnekte harici sistem yine tarayıcı DOM'udur. `App` bileşeni, uzun bir liste sonra `Box` bileşeni ve ardından başka bir uzun liste göstermektedir. Listeyi aşağı kaydırın. Ekranda `Box` bileşeni göründüğünde, arka plan renginin siyaha dönüştüğüne dikkat edin. Bu davranışı uygulamak için `Box` bileşeni, [`IntersectionObserver`'ı](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) yönetmek için Effect'i kullanır. Bu tarayıcı API'ı, DOM elemanı ekran göründüğünde sizi bilgilendirecektir.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Öğe #{i} (kaydırmaya devam et)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    });
    observer.observe(div, {
      threshold: 1.0
    });
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Effect'leri özel Hook'larla sarma {/*wrapping-effects-in-custom-hooks*/}

Effect'ler ["kaçış kapaklarıdır":](/learn/escape-hatches) Effect'leri "React'in dışına çıkmanız" gerektiğinde ve kullanım durumunuz için daha iyi yerleşik bir çözüm olmadığunda kullanırsınız. Kendinizi sık sık Effect'leri mauel olarak yazma durumunda buluyorsanız, bu genellikle bileşenlerinizin dayandığı yaygın davranışlar için [özel Hook'lar](/learn/reusing-logic-with-custom-hooks) yazmanız gerektiği anlamına gelir.

Örneğin, bu `useChatRoom` özel Hook'u, Effect'inizin mantığını daha bildirimsel (declarative) bir API'ın arkasına "gizler":

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Yazdığınız bu Hook'u herhangi başka bir bileşenden de şöyle kullanabilirsiniz:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Ayrıca React ekosisteminde her amaca uygun çok sayıda mükemmel özel Hook'lar mevcuttur.

[Effect'leri özel Hook'larla sarma konusunda daha fazla bilgi edinin.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Effect'leri özel Hook'larla sarmaya örnekler" titleId="examples-custom-hooks">

#### Özel `useChatRoom` Hook'u {/*custom-usechatroom-hook*/}

Bu örnek [daha önceki örneklerden](#examples-connecting) biriyle benzerdir ancak mantık özel bir Hook'a çıkartılmıştır.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} odasına hoş geldiniz!</h1>
    </>
  );
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
          <option value="genel">Genel</option>
          <option value="seyahat">Seyahat</option>
          <option value="muzik">Müzik</option>
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

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Özel `useWindowListener` Hook'u {/*custom-usewindowlistener-hook*/}

Bu örnek [daha önceki örneklerden](#examples-connecting) biriyle benzerdir ancak mantık özel bir Hook'a çıkartılmıştır.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Özel `useIntersectionObserver` Hook'u {/*custom-useintersectionobserver-hook*/}

Bu örnek [daha önceki örneklerden](#examples-connecting) biriyle benzerdir ancak mantık özel bir Hook'a çıkartılmıştır.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Öğe #{i} (kaydırmaya devam et)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    });
    observer.observe(div, {
      threshold: 1.0
    });
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### React olmayan widget'ı kontrol etme {/*controlling-a-non-react-widget*/}

Bazen, harici bir sistemi bileşeninizin bazı prop'larına ya da state'ine göre senkronize etmek istersiniz.

Örneğin, React olmadan yazılmış bir üçünü parti harita widget'ınız veya bir video oynatıcı bileşeniniz varsa, o bileşenin state'ini React bileşeninizin şu anki state'iyle eşleştiren metodları çağırmak için Effect'i kullanabilirsiniz. Bu Effect, `map-widget.js` içinde tanımlanan bir `MapWidget` sınıfı örneği oluşturur. `Map` bileşeninin `zoomLevel` prop'unu değiştirdiğizde, Effect sınıf örneğini senkronize tutmak için `setZoom()` fonksiyonunu çağırır:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Yakınlaştırma seviyesi: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Bu örnekte, `MapWidget` sınıfı yalnızca kendisine iletilen DOM node'unu yönettiği için bir temizleme fonksiyonu gerekli değildir. `Map` React bileşen ağaçtan kaldırıldıktan sonra, hem DOM node'u hem de `MapWidget` sınıf örneği, tarayıcı JavaScript motoru tarafından otomatik olarak temizlenecektir.

---

### Effect'ler ile veri fetch etme {/*fetching-data-with-effects*/}

Bileşeninize veri fetch etmek için Effect'i kullanabilirsiniz. [Eper bir çatı kullanıyorsanız,](/learn/start-a-new-react-project#production-grade-react-frameworks) çatının veri fetch etme mekanizmasını kullanmanın Effect'i manuel olarak yazmaktan çok daha verimli olacağını unutmayın.

Eğer manuel olarak Effect ile veri fetch etmek istiyorsanız, kodunuz şöyle görünebilir:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Başlangıçta `false` olan ve cleanup (temizleme) sırasında `true` olan `ignore` değişkenine dikkat edin. Bu, [kodunuzun "yarış koşullarından" zarar görmemesini sağlar:](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) ağdan gelen yanıtlar sizin onları gönderdiğiniz sıradan farklı olabilir.

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Yükleniyor...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Bu ' + person + '’un biyosu.');
    }, delay);
  })
}
```

</Sandpack>

[`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) sözdizimini kullanarak da yeniden yazabilirsiniz, ancak yine de bir cleanup (temizleme) fonksiyonu sağlamanız gerekmektedir:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Yükleniyor...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Bu ' + person + '’un biyosu.');
    }, delay);
  })
}
```

</Sandpack>

Direkt olarak Effect ile veri fetch etmeyi yazmak tekrarlı hale gelir ve önbelleğe alma ve sunucudan render etme gibi optimizasyonların eklenmesini zorlaştırır. [Kendiniz veya topluluk tarafından sağlanan özel bir Hook kullanmak daha kolaydır.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Effect'ler ile veri fetch etmeye iyi alternatifler nelerdir? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effect'ler içinide `fetch` çağrıları yapmak, özellikle tamamen client-side uygulamalarda [veri fetch etmenin popüler bir yoludur](https://www.robinwieruch.de/react-hooks-fetch-data/). Ancak bu, çok manuel bir yaklaşımdır ve önemli dezavantajları vardır:

- **Effect'ler sunucuda çalışmazlar.** Bu, sunucu tarafından render edilen ilk HTML'in yalnızca veri içermeyen bir yükleme state'ini içereceği anlamına gelir. Kullanıcı bilgisayarının tüm bu JavaScript'i indirmesi ve uygulamanızı yalnızca şimdi verileri yüklemesi gerektiğini keşfetmesi için render etmesi gerekecektir. Bu çok verimli bir yol değildir.
- **Dpğrudan Effect ile fetch etmek, "ağ şelaleleri (waterfalls) oluşturmayı kolaylaştırır."** Üst bileşeni render edersiniz, o bileşen veri fetch eder, alt bileşenleri render eder, daha sonra o bileşenler kendi verilerini fetch etmeye başlarlar. Eğer internet bağlantınız hızlı değilse, verileri paralel olarak fetch etmeye göre önemli derecede yavaştır.
- **Doğrudan Effect ile veri fetch etme, genellikle verileri önceden yüklememeniz veya önbelleğe almamanız anlamına gelir.** Örneğin, bileşen DOM'dan kaldırılır ve sonra tekrar DOM'a eklenirse, bileşen aynı veriyi tekrar fetch etmek zorundadır.
- **Ergonomik değildir.** [Yarış koşulları](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) gibi hatalardan zarar görmeyecek şekilde `fetch` çağrıları yaparken oldukça fazla genel hatlarıyla kod yazmanız gerekmektedir.

Bu dezavantajlar listesi React'e özel değildir. Bu, herhangi bir kütüphane ile DOM'a eklenme sırasında yapılan veri fetch etme için geçerlidir. Routing de olduğu gibi, veri fetch etmenin iyi yapılması önemsiz değildir, bu nedenle aşağıdaki yaklaşımları önermekteyiz:

- **Eğer bir [çatı](/learn/start-a-new-react-project#production-grade-react-frameworks) kullanırsanız, çatının yerleşi veri fetch etme mekanizmasını kullanın.** Modern React çatıları verimli veri fetch etme mekanizmalarını entegre etmişlerdir ve yukarıdaki tehlikelerden uzak dururlar.
- **Aksi halde, client-side cache kullanmayı ya da kendiniz kurmayı düşünün.** Popüler açık kaynak çözümleri arasında [React Query](https://react-query.tanstack.com/), [useSWR](https://swr.vercel.app/) ve [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) vardır. Kendi çözümlerinizi de oluşturabilirsiniz, Effect'leri arka planda kullanır ancak aynı zamanda istekleri tekilleştirmek, yanıtları önbelleğe almak ve ağ şelalelerinden kaçınmak için (verileri önceden yükleyerek veya veri gereksinimlerini rotalara kaldırarak) gibi mantıkları da  ekleyebilirsiniz.

Eğer bu yaklaşımlardan hiçbiri size uymuyorsa, Effect'ler içinde veri fetch etmeye devam edebilirsiniz.

</DeepDive>

---

### Reaktif bağımlılıkları belirleme {/*specifying-reactive-dependencies*/}

**Effect'inizin bağımlılıklarını "seçemeyeceğinize" dikkat edin.** Effect'iniz tarafından kullanılan her <CodeStep step={2}>reaktif değer</CodeStep> bağımlılık olarak bildirilmelidir. Effect'inizin bağımlılık listesi çevreleyen kod tarafından belirlenir:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Bu reaktif bir değerdir
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Bu da reaktif bir değerdir

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect bu reaktif değerleri okur
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Bu yüzden Effect'inizin bağımlılık listesinde belirtmeniz gerekmektedir
  // ...
}
```

`serverUrl` veya `roomId`'den herhangi biri değişirse, Effect'iniz yeni değerleri kullanarak sohbete yeniden bağlanacaktır.

**[Reaktif değerler,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) prop'ları ve doğrudan bileşeniniz içinde bildirilen tüm değişkenleri ve fonksiyonları içerir.** `roomId` ve `serverUrl` reaktif değerler olduğundan dolayı, bu değerleri bağımlılıktan kaldıramazsınız. Eğer kaldırmaya kalkarsanız ve [linter'ınız React için ayarlanmışsa,](/learn/editor-setup#linting) linter bunu düzeltmeniz gereken bir hata olarak işaretleyecektir:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook'u useEffect'te eksik bağımlılıklar var: 'roomId' and 'serverUrl'
  // ...
}
```

**Bağımlılığı kaldırmak için, [linter'a bunun bir bağımlıklık olmasına gerek olmadığını "kanıtlamanız"](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** gerekmektedir. Örneğin, reaktif omadığını ve yeniden render'lar ile değişmeyeceğini kanıtlamak için `serverUrl`'i bileşeninizin dışına taşıyabilirsiniz:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Artık reaktif bir değişken değil

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirilmiş
  // ...
}
```

Artık `serverUrl` reaktif bir değer olmadığına göre (ve yeniden render'lar ile değişmeyeceğine göre), bağımlılık olmasına gerek yoktur. **IEğer Effect kodunuz herhangi bir reaktif değer kullanmıyorsa, bağımlılık listesi boş  (`[]`) olmalıdır:**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Artık reaktif bir değer değil
const roomId = 'muzik'; // Artık reaktif bir değer değil

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Bütün bağımlılıklar bildirilmiş
  // ...
}
```

[Boş bağımlılık listesi olan bir Effect](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) herhangi bir bileşeninizin prop'ları ya da state'i değiştiğinde yeniden çalıştırılmaz.

<Pitfall>

Eğer var olan bir kod tabanınız varsa, linter'ı şu şekilde yok sayan bazı Effect'leriniz olabilir:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Linter'ı bu şekilde yok saymaktan kaçının
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Bağımlılıklar kod ile eşleşmediğinde, hata getirme riski yüksektir.** Linter'ı bu şekilde yok sayarak React'e, Effect'inizin bağımlı olduğu değerler konusunda "yalan" söylemiş olursunuz. [Bunun yerine gereksiz olduklarını kanıtlayın.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Reaktif bağımlılıklar iletme örnekleri" titleId="examples-dependencies">

#### Bağımlılık dizisi iletme {/*passing-a-dependency-array*/}

Eğer bağımlılıkları belirtirseniz, Effect'iniz **ilk render'dan _ve_ değişen bağlımlılıklarla yeniden render'lardan sonra çalışacaktır.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // a veya b farklıysa yeniden çalışır
```

Aşağıdaki örnekte, `serverUrl` ve `roomId` [reaktif değerlerdir.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Bu yüzden her ikisi de bağımlılık olarak belirtilmelidir. Sonuç olarak, aşağı doğru açılan menüden farklı bir oda seçmek ya da sunucu URL'ini değiştirmek sohbete yeniden bağlanılmasına neden olur. Ancak, `message` Effect'te kullanılmadığından (ve bu yüzden bağımlılık da değil), mesajı düzenlemek sohbete yeniden bağlanmaya neden olmaz.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <label>
        Mesajınız:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyahat">Seyahat</option>
          <option value="muzik">Müzik</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Boş bağımlılık dizisi iletmek {/*passing-an-empty-dependency-array*/}

Effect'iniz gerçekten reaktif değerler kullanmıyorsa, Effect'iniz sadece **ilk render'dan sonra** çalışacaktır.

```js {3}
useEffect(() => {
  // ...
}, []); // Yeniden çalışmaz (geliştirmedeyken hariç)
```

**Boş bağımlılıklar ile bile, setup (kurulum) ve cleanup (temizleme) hataları bulmanıza yardımcı olmak için [geliştirmedeyken bir kere fazladan çalışacaktır.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)**


Bu örnekte, hem `serverUrl` hem de `roomId` kodlanmıştır. Bu değerler bileşenin dışında bildirildiği için reaktif değerler değillerdir ve bu nedenle bağımlılık değillerdir. Bağımlılık listesi boştur ve bu yüzden Effect yeniden render'larda yeniden çalışmaz.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'muzik';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <label>
        Mesajınız:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Hiçbir bağımlılık dizisi iletmemek {/*passing-no-dependency-array-at-all*/}

Hiçbir bağımlılık dizisi iletmezseniz, Effect'iniz bileşeninizin **herbir render'ından (ve yeniden render'ından)** sonra çalışacaktır.

```js {3}
useEffect(() => {
  // ...
}); // Her zaman tekrardan çalışır
```

Bu örnekte, mantıklı olan Effect'in `serverUrl` ve `roomId` değiştiğinde yeniden çalışmasıdır. Ancak, `message`'ı değiştirdiğinizde, muhtemelen istenmeyen bir durum olarak Effect *yine* çalışacaktır. Bu nedenle genellikle bağımlılık dizisini belirtiriz.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Hiçbir bağımlılık dizisi yok

  return (
    <>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <label>
        Mesajınız:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin::{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">Seyahat</option>
          <option value="muzik">Müzik</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek uygulama aslında sunucuya bağlanırdı
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Effect'teki önceki state'e göre state'i güncelleme {/*updating-state-based-on-previous-state-from-an-effect*/}

Effect'teki önceki state'e göre state'i güncellemek istediğinizde, bir sorunla karşılaşabilirsiniz:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Sayacaı saniyede bir artırmak istiyorsunuz...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... ancak `count`'u bağımlılık olarak belirtmek interval'i sıfırlayacaktır.
  // ...
}
```

`count` reaktif bir değer olduğundan, bağımlılık listesinde belirtilmek zorundadır. Ancak bu durum, Effect'in her `count` değiştiğinde cleanup (temizleme) ve setup (kurulum) yapmasına neden olur. Bu ideal bir durum değildir.

Bunu düzeltmek için, [`c => c + 1` state güncelleyecisini](/reference/react/useState#updating-state-based-on-the-previous-state) `setCount`'a iletin:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ State güncelleyicisi iletin
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Artık count bir bağımlılık değildir

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Artık `count + 1` yerine `c => c + 1` ilettiğimiz için, [Effect'inizin `count`'a bağımlı olması gerekmemektedir.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Bu çözümün sonucu olarak, Effect'iniz `count` her değiştiğinde cleanup (temizleme) ve setup (kurulum) yapmasına gerek yoktur.

---


### Gereksiz nesne bağımlılıklarını kaldırmak {/*removing-unnecessary-object-dependencies*/}

Eğer Effect'iniz render esnasında oluşturulan bir nesneye veya fonksiyona bağımlıysa, Effect çok sık çalışabilir. Örneğin bu Effect, `options` nesnesi [her render için farklı olduğundan](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) her render'dan sonra yeniden bağlanır:

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Bu nesne her yeniden render'dan sonra tekrar oluşturulur
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Effect içinde kullanılır
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 Bunun neticesinde, bu bağımlılıklar yeniden render'da her zaman farklıdır
  // ...
```

Render esnasında oluşturulan bir nesneyi bağımlılık olarak kullanmaktan kaçının. Bunun yerine nesneyi Effect içinded oluşturun:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyahat">Seyahat</option>
          <option value="muzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanırdı
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Şimdi `options` nesnesini Effect içinde oluşturduğumuzdan, Effect sadece `roomId` string'ine bağımlıdır.

Bu çözümle birlikte, input'a yazmak sohbete tekrar bağlanmayacaktır. Her render'da yeniden oluşturulan nesne aksine, `roomId` gibi bir string siz onu başka bir değere eşitlemediğiniz sürece değişmez. [Bağımlılıları kaldırmak hakkında daha fazlasını okuyun.](/learn/removing-effect-dependencies)

---

### Gereksiz fonksiyon bağımlılıklarını kaldırmak {/*removing-unnecessary-function-dependencies*/}

Eğer Effect'iniz render esnasında oluşturulan bir nesneye veya fonksiyona bağımlıysa, Effect çok sık çalışabilir. Örneğin bu Effect, `createOptions` fonksiyonu [her render'da farklı olduğundan](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) her render'dan sonra yeniden bağlanır:

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Bu fonksiyon her yeniden render'dan sonra sıfırdan tekrar oluşturulur
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Effect içinde kullanılır
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 Bunun neticesinde, bu bağımlılıklar yeniden render'da her zaman farklıdır
  // ...
```

Her yeniden render'da sıfırdan bir fonksiyon oluşturmak kendi başına bir sorun değildir. Bunu optimize etmenize gerek yoktur. Ancak fonksiyonu Effect'inizin bağımlılığı olarak kullanırsanız, Effect'inizin her yeniden render'dan sonra yeniden çalışmasına neden olacaktır.

Render esnasında oluşturulan bir fonksiyonu bağımlılık olarak kullanmaktan kaçının. Bunun yerine Effect içinde bildirin:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyahat">Seyahat</option>
          <option value="muzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanırdı
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Şimdi `createOptions`fonksiyonunu Effect içinde bildirdiğimizden, Effect sadece `roomId` string'ine bağlıdır. Böylelikle input'u değiştirmek sohbete tekrar bağlanmayacaktır. Unlike a function which gets re-created, a string like `roomId` doesn't change unless you set it to another value. [Read more about removing dependencies.](/learn/removing-effect-dependencies)

---

### Reading the latest props and state from an Effect {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.

</Wip>

By default, when you read a reactive value from an Effect, you have to add it as a dependency. This ensures that your Effect "reacts" to every change of that value. For most dependencies, that's the behavior you want.

**However, sometimes you'll want to read the *latest* props and state from an Effect without "reacting" to them.** For example, imagine you want to log the number of the items in the shopping cart for every page visit:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ All dependencies declared
  // ...
}
```

**What if you want to log a new page visit after every `url` change, but *not* if only the `shoppingCart` changes?** You can't exclude `shoppingCart` from dependencies without breaking the [reactivity rules.](#specifying-reactive-dependencies) However, you can express that you *don't want* a piece of code to "react" to changes even though it is called from inside an Effect. [Declare an *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) with the [`useEffectEvent`](/reference/react/experimental_useEffectEvent) Hook, and move the code reading `shoppingCart` inside of it:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

**Effect Events are not reactive and must always be omitted from dependencies of your Effect.** This is what lets you put non-reactive code (where you can read the latest value of some props and state) inside of them. By reading `shoppingCart` inside of `onVisit`, you ensure that `shoppingCart` won't re-run your Effect.

[Read more about how Effect Events let you separate reactive and non-reactive code.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Displaying different content on the server and the client {/*displaying-different-content-on-the-server-and-the-client*/}

If your app uses server rendering (either [directly](/reference/react-dom/server) or via a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), your component will render in two different environments. On the server, it will render to produce the initial HTML. On the client, React will run the rendering code again so that it can attach your event handlers to that HTML. This is why, for [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) to work, your initial render output must be identical on the client and the server.

In rare cases, you might need to display different content on the client. For example, if your app reads some data from [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), it can't possibly do that on the server. Here is how you could implement this:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

While the app is loading, the user will see the initial render output. Then, when it's loaded and hydrated, your Effect will run and set `didMount` to `true`, triggering a re-render. This will switch to the client-only render output. Effects don't run on the server, so this is why `didMount` was `false` during the initial server render.

Use this pattern sparingly. Keep in mind that users with a slow connection will see the initial content for quite a bit of time--potentially, many seconds--so you don't want to make jarring changes to your component's appearance. In many cases, you can avoid the need for this by conditionally showing different things with CSS.

---

## Troubleshooting {/*troubleshooting*/}

### My Effect runs twice when the component mounts {/*my-effect-runs-twice-when-the-component-mounts*/}

When Strict Mode is on, in development, React runs setup and cleanup one extra time before the actual setup.

This is a stress-test that verifies your Effect’s logic is implemented correctly. If this causes visible issues, your cleanup function is missing some logic. The cleanup function should stop or undo whatever the setup function was doing. The rule of thumb is that the user shouldn’t be able to distinguish between the setup being called once (as in production) and a setup → cleanup → setup sequence (as in development).

Read more about [how this helps find bugs](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) and [how to fix your logic.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### My Effect runs after every re-render {/*my-effect-runs-after-every-re-render*/}

First, check that you haven't forgotten to specify the dependency array:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

If you've specified the dependency array but your Effect still re-runs in a loop, it's because one of your dependencies is different on every re-render.

You can debug this problem by manually logging your dependencies to the console:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

You can then right-click on the arrays from different re-renders in the console and select "Store as a global variable" for both of them. Assuming the first one got saved as `temp1` and the second one got saved as `temp2`, you can then use the browser console to check whether each dependency in both arrays is the same:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

When you find the dependency that is different on every re-render, you can usually fix it in one of these ways:

- [Updating state based on previous state from an Effect](#updating-state-based-on-previous-state-from-an-effect)
- [Removing unnecessary object dependencies](#removing-unnecessary-object-dependencies)
- [Removing unnecessary function dependencies](#removing-unnecessary-function-dependencies)
- [Reading the latest props and state from an Effect](#reading-the-latest-props-and-state-from-an-effect)

As a last resort (if these methods didn't help), wrap its creation with [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) or [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (for functions).

---

### My Effect keeps re-running in an infinite cycle {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

If your Effect runs in an infinite cycle, these two things must be true:

- Your Effect is updating some state.
- That state leads to a re-render, which causes the Effect's dependencies to change.

Before you start fixing the problem, ask yourself whether your Effect is connecting to some external system (like DOM, network, a third-party widget, and so on). Why does your Effect need to set state? Does it synchronize with that external system? Or are you trying to manage your application's data flow with it?

If there is no external system, consider whether [removing the Effect altogether](/learn/you-might-not-need-an-effect) would simplify your logic.

If you're genuinely synchronizing with some external system, think about why and under what conditions your Effect should update the state. Has something changed that affects your component's visual output? If you need to keep track of some data that isn't used by rendering, a [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (which doesn't trigger re-renders) might be more appropriate. Verify your Effect doesn't update the state (and trigger re-renders) more than needed.

Finally, if your Effect is updating the state at the right time, but there is still a loop, it's because that state update leads to one of the Effect's dependencies changing. [Read how to debug dependency changes.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### My cleanup logic runs even though my component didn't unmount {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

The cleanup function runs not only during unmount, but before every re-render with changed dependencies. Additionally, in development, React [runs setup+cleanup one extra time immediately after component mounts.](#my-effect-runs-twice-when-the-component-mounts)

If you have cleanup code without corresponding setup code, it's usually a code smell:

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

Your cleanup logic should be "symmetrical" to the setup logic, and should stop or undo whatever setup did:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Learn how the Effect lifecycle is different from the component's lifecycle.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### My Effect does something visual, and I see a flicker before it runs {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

If your Effect must block the browser from [painting the screen,](/learn/render-and-commit#epilogue-browser-paint) replace `useEffect` with [`useLayoutEffect`](/reference/react/useLayoutEffect). Note that **this shouldn't be needed for the vast majority of Effects.** You'll only need this if it's crucial to run your Effect before the browser paint: for example, to measure and position a tooltip before the user sees it.
