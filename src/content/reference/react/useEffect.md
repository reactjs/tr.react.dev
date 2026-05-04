---
title: useEffect
---

<Intro>

`useEffect`, [bir bileşeni harici bir sistem ile senkronize](/learn/synchronizing-with-effects) etmenizi sağlayan React Hook'udur.

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
  }, [serverUrl, roomId]);
  // ...
}
```

[Daha fazla örnek görmek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

<<<<<<< HEAD
* `setup`: Effect’inizin mantığını içeren fonksiyondur. `setup` fonksiyonunuz isteğe bağlı olarak bir *cleanup* (temizleme) fonksiyonu da döndürebilir. Bileşeniniz [commit edildiğinde](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom), React `setup` fonksiyonunu çalıştırır. Bağımlılıkları değişen her commit’ten sonra React, önce (varsa) eski değerlerle *cleanup* fonksiyonunu çalıştırır, ardından yeni değerlerle `setup` fonksiyonunu tekrar çalıştırır. Bileşeniniz DOM’dan kaldırıldıktan sonra ise React *cleanup* fonksiyonunu çalıştırır.
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your [component commits](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom), React will run your setup function. After every commit with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function.

* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every commit of the component. [See the difference between passing an array of dependencies, an empty array, and no dependencies at all.](#examples-dependencies)
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

* **opsiyonel** `dependencies`: `setup` kodu içinde referans verilen tüm **reactive values**’ların listesidir. Reactive values; props, state ve bileşen gövdesi içinde doğrudan tanımlanan tüm değişkenler ve fonksiyonları kapsar. Eğer linter’ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), her reactive value’nun dependency olarak doğru şekilde belirtildiğini doğrular. Dependency listesi sabit sayıda öğe içermeli ve `[dep1, dep2, dep3]` şeklinde inline olarak yazılmalıdır. React, her bir dependency’yi önceki değeriyle [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması kullanarak kıyaslar. Bu argümanı atladığınızda, Effect’iniz bileşenin her commit’inden sonra yeniden çalışır. [Dependency array verilmesi, boş array verilmesi ve hiç dependency verilmemesi arasındaki farkı inceleyin.](#examples-dependencies)

#### Dönüş Değeri {/*returns*/}

`useEffect`, `undefined` döndürür.

#### Uyarılar {/*caveats*/}

* `useEffect` bir Hook'tur, dolayısıyla bu Hook'u yalnızca **bileşeninizin en üst seviyesinde** veya kendi Hook'larınızda çağırabilirsiniz. Döngüler veya koşullu ifadeler içinde çağıramazsınız. Eğer çağırmak istiyorsanız, yeni bir bileşen oluşturun ve state'i onun içine taşıyın.

* Eğer **harici sistemle senkronize etmeye çalışmıyorsanız,** [büyük ihtimalle Effect'e ihtiyacınız yoktur.](/learn/you-might-not-need-an-effect)

* Strict Modu kullanırken, React ilk gerçek kurulumdan önce **sadece geliştirme sırasında olmak üzere ekstra bir kurulum+temizleme döngüsü** çalıştırır. Bu, temizleme mantığınızın kurulum mantığınızı "yansıtmasını" ve kurulumun yaptığı her şeyi durdurmasını ya da geri almasını sağlayan bir stres testidir. Eğer bu bir sorun yaratıyorsa, [temizleme fonksiyonunu uygulayın.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Eğer bağımlılıklarınızdan bazıları nesneler veya bileşeniniz içinde tanımlanmış fonksiyonlar ise, bu bağımlılıkların **Effect'in gerekenden daha sık yeniden çalışmasına neden olma riski vardır.** Bu durumu düzeltmek için, gereksiz [nesne](#removing-unnecessary-object-dependencies) ve [fonksiyon](#removing-unnecessary-function-dependencies) bağımlılıklarını silin. Ayrıca [state güncellemelerinizi](#updating-state-based-on-previous-state-from-an-effect) ve [reaktif olmayan mantığı](#reading-the-latest-props-and-state-from-an-effect) Effect dışına taşıyabilirsiniz.

* Eğer Effect'inizin çalışmasına bir etkileşim (tıklama gibi) neden oluyorsa, React genellikle, Effect'inizi çalıştırmadan önce **tarayıcının güncellenen ekranı çizmesine izin verecektir.** Eğer Effect'iniz görsel (örneğin ipucu gösterme) bir şey yapıyorsa ve gecikme gözle görülebilir gibiyse (örneğin titriyorsa), `useEffect`'i [`useLayoutEffect`](/reference/react/useLayoutEffect) ile değiştirin.

* Effect'inizin çalışmasına bir etkileşim (tıklama gibi) neden oluyor olsa bile, **tarayıcı Effect'iniz içindeki state güncellemelerini işlemeden önce ekranı yeniden çizebilir.** Genellikle, istediğiniz şey budur. Ancak, tarayıcının ekranı yeniden çizmesini engellemek zorundaysanız, `useEffect`'i [`useLayoutEffect`](/reference/react/useLayoutEffect) ile değiştirmelisiniz.

* Effect'ler **sadece kullanıcı (client) tarafında çalışır.** Sunucu render etme sırasında çalışmazlar.

---

## Kullanım {/*usage*/}

### Harici bir sisteme bağlanma {/*connecting-to-an-external-system*/}

Bazı bileşenlerin sayfada görüntülenebilmesi için ağa, bazı tarayıcı API'larına ya da üçüncü parti kütüphanelere bağlı kalması gerekir. Bu sistemler React tarafından kontrol edilmezler, bu yüzden *harici* olarak adlandırılırlar.

[Bileşeninizi harici bir sisteme bağlamak için](/learn/synchronizing-with-effects), bileşeninizin en üst düzeyinde `useEffect`'i çağırın:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
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
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect`'e iki argüman iletmeniz gerekmektedir:

1. Bu sisteme bağlanan <CodeStep step={1}>kurulum (setup) kodu</CodeStep> içeren bir *kurulum fonksiyonu*.
   - Bu sistemle olan bağlantıyı kesen <CodeStep step={2}>temizleme (cleanup) kodu</CodeStep> içeren bir *temizleme fonksiyonu* döndürmeli.
2. Bileşeninizden bu fonksiyonların içinde kullanılan her bir değeri içeren <CodeStep step={3}>bağımlılıklar listesi</CodeStep>.

**React, kurulum ve temizleme fonksiyonlarınızı gerektiğinde birden çok kez olabilecek şekilde çağırır:**

1. Bileşeniniz sayfaya eklendiğinde *(mount olurken)* <CodeStep step={1}>setup code</CodeStep> çalışır.
2. <CodeStep step={3}>dependencies</CodeStep>’lerin değiştiği her bileşen commit’inden sonra:
   - Önce, <CodeStep step={2}>cleanup code</CodeStep> eski props ve state değerleriyle çalışır.
   - Ardından, <CodeStep step={1}>setup code</CodeStep> yeni props ve state değerleriyle çalışır.
3. Bileşeniniz sayfadan kaldırıldıktan *(unmount olduktan)* sonra <CodeStep step={2}>cleanup code</CodeStep> son bir kez daha çalışır.

<<<<<<< HEAD
**Yukarıdaki örneği biraz açıklayalım.**  
=======
**Let's illustrate this sequence for the example above.**
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

Yukarıdaki `ChatRoom` bileşeni sayfaya eklendiğinde, başlangıçtaki `serverUrl` ve `roomId` ile chat odasına bağlanır. Eğer bir commit sonucunda `serverUrl` veya `roomId` değişirse (örneğin kullanıcı bir dropdown üzerinden farklı bir chat odası seçerse), Effect’iniz *önce önceki odadan bağlantıyı keser, ardından yeni odaya bağlanır.* `ChatRoom` bileşeni sayfadan kaldırıldığında ise Effect’iniz son bir kez daha bağlantıyı keser.

**Geliştirme sırasında [hataları bulmanıza yardımcı olmak](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) için React, <CodeStep step={1}>kurulum</CodeStep> ve <CodeStep step={2}>temizleme</CodeStep> kodunu <CodeStep step={1}>kurulum</CodeStep>'dan önce son kez çalıştırır.** Bu, Effect mantığınızın doğru uygulandığını doğrulayan bir stres testidir. Bu, gözle görünür sorunlara neden oluyorsa, temizleme fonksiyonunuzda bazı mantık hataları vardır. Temizleme fonksiyonu, kurulum fonksiyonunun yaptığı her şeyi durdurmalı ya da geri almalıdır. Temel kural, kullanıcı bir kez çağrılan kurulum (son üründe olduğu gibi) ile *kurulum* → *temizleme* → *kurulum* sekansı (geliştirme sırasında olduğu gibi) arasındaki farkı ayırt etmemelidir. [Sık kullanılan çözümlere göz gezdirin.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**[Her Effect'i bağımsız bir süreç olarak yazmayı](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) ve [her seferinde tek kurulum/temizleme döngüsü düşünmeyi](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective) deneyin.** Bileşeninizin DOM'a ekleniyor/çıkarılıyor ya da güncelleniyor olması fark etmemelidir. Temizleme mantığınız kurulum mantığını doğru bir şekilde "yansıttığında", Effect'iniz kurulum ve temizlemeyi gerektiği sıklıkta çalıştıracaktır.

<Note>

Effect, [bileşeninizi harici bir sistemle senkronize tutmanızı](/learn/synchronizing-with-effects) (sohbet servisi gibi) sağlar. Burada *harici sistem*, React tarafından kontrol edilmeyen herhangi bir kod parçası demektir. Örneğin:

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> ve <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep> ile yönetilen bir kronometre.
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> ve <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep> kullanan bir olay aboneliği (subscription).
* <CodeStep step={1}>`animation.start()`</CodeStep> ve <CodeStep step={2}>`animation.reset()`</CodeStep> gibi bir API içeren üçüncü parti animasyon kütüphanesi.

**Eğer herhangi bir harici sisteme bağlanmıyorsanız, [büyük ihtimalle Effect'e ihtiyacınız yoktur.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Harici bir sisteme bağlanma örnekleri" titleId="examples-connecting">

#### Sohbet sunucusuna bağlanma {/*connecting-to-a-chat-server*/}

Bu örnekte, `ChatRoom` bileşeni `chat.js`'de bildirilen harici sisteme bağlı kalmak için Effect'i kullanmaktadır. "Sohbeti aç" butonuna tıklayarak `ChatRoom` bileşenini render edin. Bu sandbox geliştirme modunda çalışmaktadır, bu yüzden fazladan bir bağlan ve bağlantıyı kes döngüsü [burada açıklandığı gibi](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) vardır. `roomId` ve `serverUrl`'yi aşağı doğru açılan menüyü (dropdown) ve input'u kullanarak değiştirin ve Effect'in nasıl tekrardan sohbete bağlandığını görün. "Sohbeti kapat" butonuna tıklayarak Effect'in son kez bağlantıyı kesmesini görün.

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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
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

#### Bir animasyonu tetikleme {/*triggering-an-animation*/}

Bu örnekteki harici sistem, `animation.js` dosyasındaki animasyon kütüphanesidir. Bu, DOM node'unu argüman olarak alan ve animasyonu kontrol etmek için `start()` ve `stop()` metodlarını kullanıma sunan `FadeInAnimation` adlı JavaScript sınıfını sağlar. Bu bileşen alttaki DOM node'una ulaşmak için [ref'i kullanır.](/learn/manipulating-the-dom-with-refs) Effect, DOM node'unu ref'ten okur ve bileşen render edildiğinde o node için animasyonu otomatik olarak başlatır.

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

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // hemen sona atla
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
      // Hala çizilmesi gereken kareler (frames) var
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

Bu örnekteki harici sistem, tarayıcı DOM'udur. `ModalDialog` bileşeni bir [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elemanı render eder. `isOpen` prop'unu [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) ve [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) metod çağrıları ile senkronize etmek için Effect'i kullanır.

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

```js src/ModalDialog.js active
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

Bu örnekte harici sistem yine tarayıcı DOM'udur. `App` bileşeni, uzun bir liste, sonra `Box` bileşeni ve ardından başka bir uzun liste göstermektedir. Listeyi aşağı doğru kaydırın. Ekranda `Box` bileşeni göründüğünde, arka plan renginin siyaha dönüştüğüne dikkat edin. Bu davranışı uygulamak için `Box` bileşeni, [`IntersectionObserver`'ı](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) yönetmek için Effect'i kullanır. Bu tarayıcı API'ı, DOM elemanı ekranda göründüğünde sizi bilgilendirecektir.

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

```js src/Box.js active
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
    }, {
       threshold: 1.0
    });
    observer.observe(div);
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

Effect'ler ["kaçış kapaklarıdır":](/learn/escape-hatches) Effect'leri "React'in dışına çıkmanız" gerektiğinde ve kullanım durumunuz için daha iyi yerleşik bir çözüm olmadığunda kullanırsınız. Kendinizi Effect'leri sık sık manuel olarak yazma durumunda buluyorsanız, bu genellikle bileşenlerinizin dayandığı yaygın davranışlar için [özel Hook'lar](/learn/reusing-logic-with-custom-hooks) yazmanız gerektiği anlamına gelir.

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

Bu örnek [daha önceki örneklerden](#examples-connecting) biriyle benzerdir ancak mantık özel bir Hook'a yazılmıştır.

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

```js src/useChatRoom.js
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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
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

Bu örnek [daha önceki örneklerden](#examples-connecting) biriyle benzerdir ancak mantık özel bir Hook'a yazılmıştır.

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

```js src/useWindowListener.js
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

Bu örnek [daha önceki örneklerden](#examples-connecting) biriyle benzerdir ancak mantık özel bir Hook'a yazılmıştır.

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

```js src/Box.js active
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

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
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

```js src/App.js
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

```js src/Map.js active
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

```js src/map-widget.js
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

Bu örnekte, `MapWidget` sınıfı yalnızca kendisine iletilen DOM node'unu yönettiği için bir temizleme fonksiyonu gerekli değildir. `Map` React bileşeni ağaçtan kaldırıldıktan sonra, hem DOM node'u hem de `MapWidget` sınıf örneği, tarayıcı JavaScript motoru tarafından otomatik olarak temizlenecektir.

---

### Effect'ler ile veri getirme (fetching) {/*fetching-data-with-effects*/}

Component’iniz için data fetch etmek üzere bir Effect kullanabilirsiniz. Ancak unutmayın ki [bir framework kullanıyorsanız,](/learn/creating-a-react-app#full-stack-frameworks) framework’ünüzün data fetching mekanizmasını kullanmak, Effect’leri manuel yazmaktan çok daha verimli olacaktır.

Eğer manuel olarak Effect ile veri getirmek istiyorsanız, kodunuz şöyle görünebilir:

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

Başlangıçta `false` olan ve temizleme sırasında `true` olan `ignore` değişkenine dikkat edin. Bu, [kodunuzun "yarış koşullarından" zarar görmemesini sağlar:](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) ağdan gelen yanıtlar sizin onları gönderdiğiniz sıradan farklı olabilir.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
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

```js src/api.js hidden
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

[`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) sözdizimini kullanarak da yeniden yazabilirsiniz, ancak yine de bir temizleme fonksiyonu sağlamanız gerekmektedir:

<Sandpack>

```js src/App.js
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

```js src/api.js hidden
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

Direkt olarak Effect ile veri getirmek tekrarlı hale gelir ve önbelleğe alma ve sunucudan render etme gibi optimizasyonların eklenmesini zorlaştırır. [Kendiniz veya topluluk tarafından sağlanan özel bir Hook kullanmak daha kolaydır.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Effect'ler ile veri getirmeye iyi alternatifler nelerdir? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effect'ler içinde `fetch` çağrıları yapmak, özellikle tamamen kullanıcı taraflı uygulamalarda [veri getirmenin popüler bir yoludur](https://www.robinwieruch.de/react-hooks-fetch-data/). Ancak bu, çok manuel bir yaklaşımdır ve önemli dezavantajları vardır:

- **Effect'ler sunucuda çalışmazlar.** Bu, sunucu tarafından render edilen ilk HTML'in veri içermeyen bir yükleme state'ini içereceği anlamına gelir. Kullanıcı bilgisayarının tüm bu JavaScript'i indirmesi ve uygulamanızın şimdi verileri yüklemesi gerektiğini keşfetmesi için render etmesi gerekecektir. Bu çok verimli bir yol değildir.
- **Doğrudan Effect ile veri getirmek, "ağ şelaleleri (waterfalls) oluşturmayı kolaylaştırır."** Üst bileşeni render edersiniz, o bileşen veri getirir, alt bileşenleri render eder, daha sonra o bileşenler kendi verilerini getirmeye başlarlar. Eğer internet bağlantınız hızlı değilse, verileri paralel olarak getirmeye göre önemli derecede yavaştır.
- **Doğrudan Effect ile veri getirme, genellikle verileri önceden yüklememeniz veya önbelleğe almamanız anlamına gelir.** Örneğin, bileşen DOM'dan kaldırılır ve sonra tekrar DOM'a eklenirse, bileşen aynı veriyi tekrar getirmek zorundadır.
- **Ergonomik değildir.** [Yarış koşulları](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) gibi hatalardan zarar görmeyecek şekilde `fetch` çağrıları yaparken oldukça fazla genel hatlarıyla kod yazmanız gerekmektedir.

Bu dezavantajlar listesi React'e özel değildir. Bu, herhangi bir kütüphane ile DOM'a eklenme sırasında yapılan veri getirme için geçerlidir. Yönlendirme (routing) de olduğu gibi, veri getirmenin iyi yapılması önemsiz değildir. Bu nedenle aşağıdaki yaklaşımları önermekteyiz:

- **Bir [framework](/learn/creating-a-react-app#full-stack-frameworks) kullanıyorsanız, onun built-in data fetching mekanizmasını kullanın.** Modern React framework’leri, verimli çalışan ve yukarıdaki sorunlardan etkilenmeyen entegre data fetching mekanizmalarına sahiptir.
- **Aksi durumda, client-side cache kullanmayı veya kendi cache çözümünüzü geliştirmeyi düşünün.** Yaygın open source çözümler arasında [TanStack Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), ve [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) bulunur. Kendi çözümünüzü de geliştirebilirsiniz; bu durumda kaputun altında Effects kullanırsınız ancak istekleri dedupe etmek, response’ları cache’lemek ve network waterfall’larını önlemek (veriyi preload ederek veya data requirement’ları route’lara hoist ederek) için ek logic yazarsınız.

- **Aksi halde, istemci tarafında (client-side) bir cache kullanmayı veya geliştirmeyi düşün.**  
  Popüler açık kaynak çözümleri arasında [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/) ve [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) bulunur.  
  Kendi çözümünü de geliştirebilirsin; bu durumda alt seviyede *Effect*’leri kullanırsın, ancak ayrıca istekleri yinelenmeden önleme (deduplication), yanıtları önbelleğe alma (caching) ve ağ darboğazlarını (network waterfalls) önleme gibi mantıkları da eklersin (örneğin verileri önceden yükleyerek veya veri gereksinimlerini route seviyesine taşıyarak).

Eğer bu yaklaşımlardan hiçbiri size uymuyorsa, Effect'ler içinde veri getirmeye devam edebilirsiniz.

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

**Bağımlılığı kaldırmak için, [linter'a bunun bir bağımlıklık olmasına gerek olmadığını "kanıtlamanız"](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** gerekmektedir. Örneğin, reaktif olmadığını ve yeniden render'lar ile değişmeyeceğini kanıtlamak için `serverUrl`'i bileşeninizin dışına taşıyabilirsiniz:

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

Artık `serverUrl` reaktif bir değer olmadığına göre (ve yeniden render'lar ile değişmeyeceğine göre), bağımlılık olmasına gerek yoktur. **Eğer Effect kodunuz herhangi bir reaktif değer kullanmıyorsa, bağımlılık listesi boş  (`[]`) olmalıdır:**

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

**Bağımlılıklar kod ile eşleşmediğinde, hata meydana gelme riski yüksektir.** Linter'ı bu şekilde yok sayarak React'e, Effect'inizin bağımlı olduğu değerler konusunda "yalan" söylemiş olursunuz. [Bunun yerine gereksiz olduklarını kanıtlayın.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Reaktif bağımlılıkları iletme örnekleri" titleId="examples-dependencies">

#### Bağımlılık dizisi iletme {/*passing-a-dependency-array*/}

Eğer dependency’leri belirtirseniz, Effect’iniz **ilk commit’ten sonra _ve_ dependency’lerin değiştiği commit’lerden sonra** çalışır.

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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
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

Eğer Effect’iniz gerçekten hiçbir **reactive value** kullanmıyorsa, **yalnızca ilk commit’ten sonra** çalışır.

```js {3}
useEffect(() => {
  // ...
}, []); // Yeniden çalışmaz (geliştirmedeyken hariç)
```

**Boş bağımlılıklar ile bile, kurulum ve temizleme hataları bulmanıza yardımcı olmak için [geliştirmedeyken bir kere fazladan çalışacaktır.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)**


Bu örnekte, hem `serverUrl` hem de `roomId` doğrudan koda yazılmıştır. Bu değerler bileşenin dışında bildirildiği için reaktif değerler değillerdir ve bu nedenle bağımlılık değillerdir. Bağımlılık listesi boştur ve bu yüzden Effect yeniden render'larda yeniden çalışmaz.

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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
    }
  };
}
```

</Sandpack>

<Solution />


#### Hiçbir bağımlılık dizisi iletmemek {/*passing-no-dependency-array-at-all*/}

Eğer hiç dependency array geçmezseniz, Effect’iniz bileşeninizin **her bir commit’inden sonra** çalışır.

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

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
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

### Effect'ten önceki state'e göre state'i güncelleme {/*updating-state-based-on-previous-state-from-an-effect*/}

Effect'ten önceki state'e göre state'i güncellemek istediğinizde, bir sorunla karşılaşabilirsiniz:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Sayacı saniyede bir artırmak istiyorsunuz...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... ancak `count`'u bağımlılık olarak belirtmek interval'i sıfırlayacaktır.
  // ...
}
```

<<<<<<< HEAD
`count` reaktif bir değer olduğundan, bağımlılık listesinde belirtilmek zorundadır. Ancak bu durum, Effect'in her `count` değiştiğinde temizleme kurulum yapmasına neden olur. Bu ideal bir durum değildir.
=======
Since `count` is a reactive value, it must be specified in the list of dependencies. However, that causes the Effect to cleanup and setup again every time the `count` changes. This is not ideal.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

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

Artık `count + 1` yerine `c => c + 1` ilettiğimiz için, [Effect'inizin `count`'a bağımlı olmasına gerek yoktur.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Bu çözümün sonucu olarak, Effect'iniz `count` her değiştiğinde temizleme ve kurulum yapmasına gerek yoktur.

---


### Gereksiz nesne bağımlılıklarını kaldırma {/*removing-unnecessary-object-dependencies*/}

Eğer Effect’iniz render sırasında oluşturulan bir **object** veya **function**’a bağlıysa, gereğinden fazla çalışabilir. Örneğin, aşağıdaki Effect her commit’ten sonra yeniden bağlanır çünkü `options` objesi [her render’da farklıdır:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

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
  }, [options]); // 🚩 Sonuç olarak, bu dependency’ler her commit’te her zaman farklıdır
  // ...
```

Render esnasında oluşturulan bir nesneyi bağımlılık olarak kullanmaktan kaçının. Bunun yerine nesneyi Effect içinde oluşturun:

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

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
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

Bu çözümle birlikte, input'a yazmak sohbete tekrar bağlanmayacaktır. Her render'da yeniden oluşturulan nesne aksine, `roomId` gibi bir string siz onu başka bir değere eşitlemediğiniz sürece değişmez. [Bağımlılıkları kaldırmak hakkında daha fazlasını okuyun.](/learn/removing-effect-dependencies)

---

### Gereksiz fonksiyon bağımlılıklarını kaldırma {/*removing-unnecessary-function-dependencies*/}

Eğer Effect’iniz render sırasında oluşturulan bir **object** veya **function**’a bağlıysa, gereğinden fazla çalışabilir. Örneğin, aşağıdaki Effect her commit’ten sonra yeniden bağlanır çünkü `createOptions` fonksiyonu [her render’da farklıdır:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

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
  }, [createOptions]); // 🚩 Sonuç olarak, bu dependency’ler her commit’te her zaman farklıdır
  // ...
```

Tek başına, her yeniden render’da sıfırdan bir **function** oluşturmak bir problem değildir. Bunu optimize etmeniz gerekmez. Ancak bu function’ı Effect’inizin bir **dependency**’si olarak kullanırsanız, Effect’inizin **her commit’ten sonra yeniden çalışmasına** neden olur.

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

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ ' + serverUrl +  + roomId +  ' odasına bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl  + roomId + ' odasından bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Şimdi `createOptions`fonksiyonunu Effect içinde bildirdiğimizden, Effect sadece `roomId` string'ine bağlıdır. Böylelikle input'u değiştirmek sohbete tekrar bağlanmayacaktır. Her render'da yeniden oluşturulan fonksiyon yerine, `roomId` gibi bir string siz onu başka değere eşitlemediğiniz sürece değişmez. [Bağımlılıkları kaldırmak hakkında daha fazlasını okuyun.](/learn/removing-effect-dependencies)

---

### Effect'te nihai prop'ları ve state'i okuma {/*reading-the-latest-props-and-state-from-an-effect*/}

Varsayılan olarak, bir Effect'ten reaktif bir değer okuduğunda, onu bir bağımlılık olarak eklemen gerekir. Bu, Effect'in o değerdeki her değişikliğe "tepki vermesini" sağlar. Çoğu bağımlılık için bu, istediğin davranıştır.

**Ancak bazen, *nihai* prop'ları ve state'i Effect bunlara "tepki" vermeden okumak isteyeceksiniz.** Örneğin, her sayfa ziyareti için alışveriş sepetindeki ürünlerin sayısını kaydetmek istediğinizi hayal edin:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Tüm bağımlılıklar bildirilmiş
  // ...
}
```

**Ya her `url` değişiminde yeni bir sayfa ziyaretini kaydetmek, ancak sadece `shoppingCart` değişirse bunu yapmamak istiyorsan?** `shoppingCart`'ı bağımlılıklardan çıkarmak, [reaktivite kurallarını](#specifying-reactive-dependencies) bozacaktır. Ancak, bir Effect içinde çağrılsa bile, bir kod parçasının değişikliklere "tepki vermesini istemediğini" ifade edebilirsin. [`useEffectEvent`](/reference/react/useEffectEvent) Hook'u ile bir *Effect Event* tanımla ve `shoppingCart` okuyan kodu onun içine taşı:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Tüm bağımlılıklar bildirilmiş
  // ...
}
```

**Effect Olayları reaktif değillerdir ve Effect'inizin bağımlılıklarından kaldırılmalıdırlar.** Bu, reaktif olmayan kodunuzu (prop'ların ve state'in nihai değerini okuyabildiğiniz) Effect'in içine koymanızı sağlar. `shoppingCart`'ı `onVisit` içinde okuyarak, `shoppingCart`'ın Effect'inizi yeniden çalıştırmamasını sağlarsınız.

[Effect Olaylarının reaktif ve reaktif olmayan kodu ayırmanızı nasıl sağladığı hakkında daha fazla bilgi edinin.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Sunucu ve kullanıcıda farklı içerikler gösterme {/*displaying-different-content-on-the-server-and-the-client*/}

Uygulamanız server rendering kullanıyorsa (ya [doğrudan](/reference/react-dom/server) ya da bir [framework](/learn/creating-a-react-app#full-stack-frameworks) aracılığıyla), component’iniz iki farklı ortamda render edilir. Server tarafında, initial HTML’i üretmek için render edilir. Client tarafında ise React, event handler’larınızı bu HTML’e bağlayabilmek için render kodunu tekrar çalıştırır. Bu nedenle, [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) düzgün çalışabilmesi için initial render çıktınızın client ve server’da **aynı** olması gerekir.

Bazı nadir durumlarda, kullanıcıda farklı içerik göstermek isteyebilirsiniz. Örneğin, uygulamanız [`localStorage`'dan](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) bazı veriler okuyorsa, bu işlemi sunucudan yapamaz. Bunu şu şekilde uygulayabilirsiniz:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... yalnızca kullanıcı JSX'i döndür ...
  }  else {
    // ... ilk JSX'i döndür ...
  }
}
```

Uygulama yüklenirken, kullanıcı ilk render çıktısını görecektir. Daha sonra, uygulama yüklendiğinde ve hidrasyon olduğunda, Effect'iniz çalışarak `didMount` state'ini `true` yapacak ve yeniden render tetikleyecektir. Bu kullanıcı-taraflı (client-side) render çıktısıyla değişecektir. Effect'ler sunucuda çalışmazlar, bu yüzden ilk server render'ı sırasında `didMount` state'i `false`'a eşittir.

Bu modeli idareli kullanın. Yavaş bir bağlantıya sahip kullanıcılar ilk içeriği oldukça uzun bir süre (potansiyel olarak saniyelerce) göreceğinden, bileşeninizin görünüşünde büyük değişiklikler yapmak istemezsiniz. Çoğu durumda, CSS ile koşullu olarak farklı şeyler göstererek buna ihtiyaç duymazsınız.

---

## Sorun giderme {/*troubleshooting*/}

### Bileşen DOM'a eklendiğinde Effect'im iki kere çalışıyor {/*my-effect-runs-twice-when-the-component-mounts*/}

Geliştirmede Strict modu açıkken, React kurulum ve temizleme işlemini asıl kurulumdan önce bir kere fazladan çalıştırır.

Bu, Effect mantığınızın doğru uygunlanıdığını doğrulayan bir stres testidir. Eğer bu, gözle görülebilir sorunlara neden oluyorsa, temizleme fonksiyonunuzda mantık hatası vardır. Temizleme fonksiyonu, kurulum fonksiyonunun yaptığı her şeyi durdurmalı veya geri almalıdır. Temel kural, kullanıcı bir kez çağrılan kurulum (son üründe olduğu gibi) ile *kurulum* → *temizleme* → *kurulum* sekansı (geliştirme sırasında olduğu gibi) arasındaki farkı ayırt etmemelidir.

[Bunun nasıl hataları bulmanıza yardımcı olacağı](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) ve [mantığınızı nasıl düzelteceğiniz](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) hakkında daha fazla bilgi edinin. 

---

### Effect'im her yeniden render'dan sonra çalışıyor {/*my-effect-runs-after-every-re-render*/}

İlk olarak bağımlılık dizisini belirtmeyi unutup unutmadığınızı kontrol edin:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Dependency array yok: her commit’ten sonra yeniden çalışır.
```

Bağımlılık dizisini belirttiyseniz ancak Effect'iniz hala döngüde yeniden çalışyorsa, bunun nedeni bağımlılıklarınızdan birinin her yeniden render'da farklı olmasıdır.

Bağımlılıkları konsola manuel olarak yazdırarak bu hatayı ayıklayabilirsiniz:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Daha sonra konsoldaki farklı yeniden render'ların dizilerine sağ tıklayıp her ikisi için de "Global değişken olarak sakla"'yı seçebilirsiniz. İlkinin `temp1` olarak ve ikincinin `temp2` olarak kaydedildiğini varsayarsak, her iki dizideki her bir bağımlılığın aynı olup olmadığını kontrol etmek için tarayıcı konsolunu kullanabilirsiniz:

```js
Object.is(temp1[0], temp2[0]); // İlk bağımlılık diziler arasında aynı mı?
Object.is(temp1[1], temp2[1]); // İkinci bağımlılık diziler arasında aynı mı?
Object.is(temp1[2], temp2[2]); // ... ve diğer bağımlılıklar için ...
```

Her yeniden render'da farklı olan bağımlılığı bulduğunzda, genellikle şu yollardan biriyle düzeltebilirsiniz:

- [Effect'ten önceki state'e göre state'i güncelleme](#updating-state-based-on-previous-state-from-an-effect)
- [Gereksiz nesne bağımlılıklarını kaldırma](#removing-unnecessary-object-dependencies)
- [Gereksiz fonksiyon bağımlılıklarını kaldırma](#removing-unnecessary-function-dependencies)
- [Effect'te nihai prop'ları ve state'i okuma](#reading-the-latest-props-and-state-from-an-effect)

Son çare olarak (bu yöntemler yardımcı olmadıysa), [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) veya [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (fonksiyonlar için) kullanın.

---

### Effect'im sonsuz bir döngüde sürekli çalışıyor {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Effect'iniz sonsuz bir döngüde çalışıyorsa, şu iki şey doğru olmak zorundadır:

- Effect'iniz bir state'i güncelliyor.
- O state, Effect'in bağımlılıklarının değişmesine neden olan bir yeniden render tetikliyor.

Sorunu çözmeye başlamadan önce, Effect'inizin harici bir sisteme (DOM, ağ veya üçüncü parti widget gibi) bağlanıp bağlanmadığını kendinize sorun. Effect'iniz neden state'i değiştiriyor? Harici sistem ile senkronizasyon mu yapıyor? Yoksa uygulamanızın veri akışını Effect ile mi yönetmeye çalışıyorsunuz?

Harici bir sistem yoksa, [Effect'i tamamen kaldırmanın](/learn/you-might-not-need-an-effect) mantığınızı basitleştirip basitleştirmeyeceğine bakın.

Eğer gerçekten harici bir sistem ile senkronizasyon yapıyorsanız, Effect'inizin neden ve hangi koşullarda state'i güncellemesi gerektiğini düşünün. Bileşeninizin görsel çıktısını etkileyen bir değişiklik mi oldu? Render sırasında kullanılmayan bazı verileri takip etmeniz gerekiyorsa, [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (yeniden render tetiklemez) daha uygun olabilir. Effect'inizin state'i gereğinden fazla güncellemediğini (ve yeniden render'lar tetiklemediğini) doğrulayın. 

Son olarak, Effect'iniz state'i doğru zamanda güncelliyorsa ancak yine de bir döngü söz konusuysa, bunun nedeni, state güncellemesinin Effect'in bağımlılıklarından birinin değişmesine neden olmasıdır. [Bağımlılık değişikliklerinden kaynaklı hataların nasıl ayıklanacağını okuyun.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Temizleme mantığım bileşenim DOM'dan kaldırılmasa bile çalışıyor {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

Temizleme fonksiyonu sadece DOM'dan kaldırılma sırasında değil, değişen bağımlılıklarla her yeniden render'dan önce de çalışır. Ek olarak, geliştirme aşamasında, React [kurulum+temizleme fonksiyonlarını bileşen DOM'a eklendikten hemen sonra bir kez daha çalıştırır.](#my-effect-runs-twice-when-the-component-mounts)

Bir temizleme kodunuz var ancak kurulum kodunuz yoksa, bu genellike kötü kokan bir koddur (code smell):

```js {2-5}
useEffect(() => {
  // 🔴 Kaçının: Kurulum mantığı olmadan temizleme mantığı var
  return () => {
    doSomething();
  };
}, []);
```

Temizleme mantığınız kurulum mantığıyla "simetrik" olmalı ve kurulumun yaptığı her şeyi durdurmalı veya geri almalıdır:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Effect yaşam döngüsünün bileşenin yaşam döngüsünden ne kadar farklı olduğunu öğrenin.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Effect'im görsel bir şey yapıyor ve çalışmadan önce bir titreme görüyorum {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Effect'iniz tarayıcının [ekranı çizmesini](/learn/render-and-commit#epilogue-browser-paint) engelliyorsa, `useEffect`'i [`useLayoutEffect`](/reference/react/useLayoutEffect) ile değiştirin. Bunu yapmaya **Effect'lerin büyük çoğunluğu için ihtiyaç duyulmaması gerektiğini unutmayın.** Buna yalnızca Effect'inizi tarayıcı ekranı çizmeden önce çalıştırmanız çok önemliyse ihtiyacanız olacak: örneğin, bir tooltip'ini kullanıcı görmeden önce ölçmek ve konumlandırmak için.
