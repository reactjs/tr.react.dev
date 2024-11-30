---
title: Kaçış Yolları
---

<Intro>

Bazı bileşenleriniz, React'in dışarısında bulunan bileşenleri kontrol etmek ya da onlarla senkronize olmaya ihtiyaç duyabilir. Örneğin, tarayıcı API'sini kullanarak bir girdi alanına odaklanmanız, React olmadan yazılmış bir video oynatıcıyı durdurup başlatmanız ya da uzak bir sunucuya bağlanıp mesajları dinlemeniz gerekebilir. Bu bölümde, dış sistemlere bağlanmak için React'in "dışına çıkmanızı" sağlayacak kaçış yollarını öğreneceksiniz. Uygulama mantığınızın ve veri akışınızın çoğu bu özelliklere bağlı olmamalıdır.

</Intro>

<YouWillLearn isChapter={true}>

* [Yeniden render etmeden bilgiyi nasıl "hatırlayacağınızı"](/learn/referencing-values-with-refs)
* [React tarafından yönetilen DOM elemanlarına nasıl ulaşacağınızı](/learn/manipulating-the-dom-with-refs)
* [Bileşenleri nasıl dış sistemlerle senkronize edeceğinizi](/learn/synchronizing-with-effects)
* [Bileşenlerinizden gereksiz Effect'leri nasıl kaldıracağınızı](/learn/you-might-not-need-an-effect)
* [Bir Effect'in yaşam döngüsünün bir bileşenin yaşam döngüsünden nasıl farklı olduğunu](/learn/lifecycle-of-reactive-effects)
* [Bazı değerlerin Effect'leri yeniden tetiklemesini nasıl engelleyeceğinizi](/learn/separating-events-from-effects)
* [Effect'inizin daha az sıklıkla yeniden çalışmasını nasıl sağlayabileceğinizi](/learn/removing-effect-dependencies)
* [Bileşenler arasında mantık paylaşımı nasıl yapacağınızı](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Ref'ler ile değerleri referans etmek {/*referencing-values-with-refs*/}

Bileşeninizin bir bilgiyi "hatırlamasını" istediğinizde, ancak bu bilginin [yeni render'lar tetiklemesini](/learn/render-and-commit) istemediğinizde, bir *ref* kullanabilirsiniz:

```js
const ref = useRef(0);
```

State gibi, ref'ler de React tarafından yeniden render'lar arasında saklanır. Ancak, bir state'i değiştirmek bileşeni yeniden render eder. Bir ref'i değiştirmek etmez! Ref'in o anki değerine `ref.current` özelliği üzerinden erişebilirsiniz.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert(ref.current + ' kez tıkladınız!');
  }

  return (
    <button onClick={handleClick}>
      Bana tıkla!
    </button>
  );
}
```

</Sandpack>

Bir ref, bileşeninize ait, React'in takip etmediği gizli bir cep gibidir. Örneğin, ref'leri [zaman aşımı ID'lerini](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM elemanlarını](https://developer.mozilla.org/en-US/docs/Web/API/Element) ve bileşenin render çıktısını etkilemeyen diğer nesneleri saklamak için kullanabilirsiniz.

<LearnMore path="/learn/referencing-values-with-refs">

**[Ref ile Değerlere Referans Verme](/learn/referencing-values-with-refs)** sayfasını okuyarak ref'lerin bilgileri hatırlamada nasıl kullanılacağını öğrenebilirsiniz.

Ref'leri kullanarak nasıl bilgi saklayacağınızı öğrenmek için **[Ref'ler ile değerleri referans etme](/learn/referencing-values-with-refs)** bölümünü okuyun.

</LearnMore>

## DOM'u ref'ler ile manipüle etmek {/*manipulating-the-dom-with-refs*/}

React, render çıktınızla eşleşmesi için DOM'u otomatik olarak günceller, bunun sayesinde bileşenleriniz genellikle DOM'u manipüle etme ihtiyacı duymaz. Ancak, bazen React tarafından yönetilen DOM elemanlarına erişmeniz gerekebilir - örneğin, bir düğüme odaklanmak, ona scroll'lamak veya boyutunu ve konumunu ölçmek için. React'te bunları yapmak için gömülü bir yöntem yoktur, bu yüzden DOM düğümüne bir ref'e ihtiyacınız olacaktır. Örneğin, aşağıdaki örnekteki gibi, bir düğmeye tıklandığında bir ref kullanarak input'a odaklanabilirsiniz:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Girdiye odaklan
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

React tarafından yönetilen DOM elemanlarına nasıl erişeceğinizi öğrenmek için **[DOM'u ref'ler ile manipüle etme](/learn/manipulating-the-dom-with-refs)** bölümünü okuyun.

</LearnMore>

## Efektler ile senkronize etme {/*synchronizing-with-effects*/}


Bazı bileşenlerin dış sistemler ile senkronize olmazı gerekmektedir. Örneğin, bir sunucu bağlantısı kurmak için veya bir bileşen ekranda gözüktüğünde analitik logu göndermek için bir React-dışı bileşeni React state'ine göre kontrol etmek isteyebilirsiniz. *Efektler*, belirli olayları ele almanızı sağlayan olay yöneticilerinin aksine, sizin render'dan sonra bazı kodları çalıştırmanızı sağlar. Bileşeninizi React dışı bir sistem ile senkronize etmek için efektleri kullanın.

Başlat/Durdur butonuna birkaç kez basın ve video oynatıcının `isPlaying` prop değerine senkronize kaldığını görün:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Durdur' : 'Başlat'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Birçok Efekt kendisini "temizler". Örneğin, bir sohbet sunucusuna bağlantı kuran Efektin React'e bileşeninizin bu sunucuyla olan bağlantısını nasıl koparabileceğini söyleyen bir *temizleme fonksiyonu* döndürmesi gereklidir:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Sohbete Hoşgeldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Gerçek bir uygulama gerçektende bir sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ Bağlanıyor...');
    },
    disconnect() {
      console.log('❌ Bağlantı kesildi.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Geliştirme aşamasında, React Efektinizi fazladan bir defa hemen çalıştıracak ve temizleyecektir. Bu yüzden `"✅ Bağlanıyor..."` mesajını iki defa görürsünüz. Bunun amacı bir temizleme fonksiyonunu yazmanızı size hatırlatmaktır.

<LearnMore path="/learn/synchronizing-with-effects">

**[Efektler ile Senkronize Etme](/learn/synchronizing-with-effects)** sayfasını okuyarak bileşenlerinizi dış sistemler ile nasıl senkronize edebileceğinizi öğrenebilirsiniz.

</LearnMore>

## Bir Efekte İhtiyacınız Olmayabilir {/*you-might-not-need-an-effect*/}

Efektler, React paradigmasından bir kaçış yoludur. Bu kaçış yolları size React'ten "dışarı çıkmanıza" ve bileşenlerini bazı harici sistemler ile senkronize etmenizi sağlar. Eğer harici sistemler yoksa (örneğin, eğer bir bileşenin state'ini bir prop ya da state değiştiğinde güncellemek istiyorsanız), Efekte ihtiyacınız yoktur. Gereksiz Efektleri ortadan kaldırmak kodunuzun takip edilmesini kolaylaştıracak, çalışmasını hızlandıracak ve hataya daha az açık hale getirecektir.

Efekte ihtiyacınızın olmadığı iki sık karşılaşılan durum vardır:
- **Render etmek için verileri dönüştürmek üzere Efektlere ihtiyacınız yoktur.**
- **Kullanıcı olaylarını yönetmek için Efektlere ihtiyacınız yoktur.**

Örneğin, bir state'i başka bir state'e göre ayarlamak için Efekte ihtiyacınız yoktur:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Kaçının: gereksiz state ve Efekt
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Bunun yerine, render etme sırasında hesaplayabildiğiniz kadar hesaplayın:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Güzel: render esnasında hesaplanmış
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Ancak, harici sistemler ile senkronize etmek için Efektlere ihtiyacınız vardır.

<LearnMore path="/learn/you-might-not-need-an-effect">

**[Bir Efekte İhtiyacınız Olmayabilir](/learn/you-might-not-need-an-effect)** sayfasını okuyarak gereksiz Efektleri nasıl kaldırabileceğinizi öğrenebilirsiniz.

</LearnMore>

## Reaktif Efektlerin Yaşam Döngüsü {/*lifecycle-of-reactive-effects*/}

Efektlerin bileşenlerden farklı bir yaşam döngüsü vardır. Bileşenler DOM'a eklenebilir, güncellenebilir veya DOM'dan çıkarılabilir. Bir Efekt yalnızca şu iki şeyi yapabilir: bir şeyi senkronize etmeye başlama ve daha sonrasında senkronize etmeyi durdurma. Bu döngü eğer Efektiniz zamanla değişen bir prop'a ve state'e bağlıysa, birden fazla gerçekleşebilir.

Bu Efekt `roomId` prop'unun değerine bağlıdır. Prop'lar *reaktif değerlerdir* yani yeniden render ile değişebilirler. Eğer `roomId` değişirse Efektin *yeniden senkronize olduğuna* (ve sunucuya yeniden bağlandığına) dikkat edin:

<Sandpack>

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
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="muzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama gerçektende bir sunucuya bağlanır
  return {
    connect() {
      console.log('✅ ' + serverUrl + ' adresindeki ' + roomId +  ' odasına bağlanılıyor');
    },
    disconnect() {
      console.log('❌ ' + serverUrl + ' adresindeki' + roomId + ' odasıyla bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React, Efektinizin bağımlılıklarını doğru belirtip belirtmediğinizi kontrol etmek için bir linter kuralı sağlar. Yukarıdaki örnekte bağımlılıklar listesinde `roomId`'yi belirtmeyi unutursanız, linter bu hatayı otomatik olarak bulacaktır.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

**[Reaktif Efektlerin Yaşam Döngüsü](/learn/lifecycle-of-reactive-effects)** sayfasını okuyarak Efektlerin bileşenlerden farklı bir yaşam döngüsü olduğunu öğrenebilirsiniz.

</LearnMore>

## Olayları Efektlerden Ayırmak {/*separating-events-from-effects*/}

<Wip>

Bu bölümde, React'in stabil sürümünde henüz yayınlanmamış **deneysel bir API** açıklanmaktadır.

</Wip>

Olay yöneticileri yalnızca aynı etkileşimi tekrar gerçekleştirdiğinizde yeniden çalışır. Olay yöneticileri aksine, Efektler bir prop veya state değişkeni gibi okudukları bir değerin son render sırasında olduğundan farklı olması durumunda yeniden senkronize olur. Bazen, her iki davranışın bir karışımını da istersiniz: bazı değerlere yanıt olarak yeniden çalışan ancak diğerlerine yanıt vermeyen bir Efekt.

Efetkler içindeki tüm kodlar *reaktiftir.* Okuduğu bazı reaktif değerler yeniden render edilme nedeniyle değişmişse tekrar çalışacaktır. Örneğin, eğer `roomId` ya da `theme` değişirse bu Efekt sohbete tekrar bağlanacaktır:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>{roomId} odasına hoşgeldiniz!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="muzik">müzik</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Koyu temayı kullan
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama gerçektende bir sunucuya bağlanır
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Yönetici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenmektedir.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Bu ideal değildir. Sohbete yalnızca `roomId` değiştiğinde tekrar bağlanmak istersiniz. `theme` değerini değiştirmek sohbete tekrardan bağlanmamalıdır! `theme` değerini okuyan kodu Efektinizin dışına bir *Efekt Olayı* içine taşıyın:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Bağlandı!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} odasına hoşgeldiniz!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="muzik">müzik</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Koyu temayı kullan
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama gerçekten bir sunucuya bağlanır
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Yönetici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenmektedir.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Efekt Olayları içerisindeki kod reaktif değildir. Yani `theme` değerini değiştirmek Efektinizin yeniden bağlanmasına neden olmaz.

<LearnMore path="/learn/separating-events-from-effects">

**[Olayı Efektlerden Ayırma](/learn/separating-events-from-effects)** sayfasını okuyarak bazı değerlerin Efektleri yeniden tetiklemesini nasıl önleyeciğinizi öğrenebilirsiniz.

</LearnMore>

## Efekt Bağımlılıklarını Kaldırma {/*removing-effect-dependencies*/}

Bir Efekt yazdığınızda, linter, Efektin okuduğu her reaktif değeri (props ve state gibi) Efektinizin bağımlılıkları listesine dahil ettiğinizi doğrular. Bu, Efektinizin bileşeninizin en son prop'ları ve state'i ile senkronize kalmasını sağlar. Gereksiz bağımlılıklar, Efektinizin çok sık çalışmasına ve hatta sonsuz bir döngü oluşturmasına neden olabilir. Efektleri kaldırma yolunuz duruma bağlı olarak değişir.

Örneğin, bu Efekt input alanını düzenlediğiniz her seferde yeniden yaratılan `options` nesnesine dayalıdır:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>{roomId} odasına hoşgeldiniz!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="muzik">müzik</option>
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
  // Gerçek bir uygulama gerçektende bir sunucuya bağlanır
  return {
    connect() {
      console.log('✅ ' + serverUrl + ' adresindeki ' + roomId +  ' odasına bağlanılıyor');
    },
    disconnect() {
      console.log('❌ ' + serverUrl + ' adresindeki' + roomId + ' odasıyla bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Sohbette her mesaj yazmaya başladığınızda sohbete yeniden bağlanmak istemezsiniz. Bu problemi çözmek için, `options` nesnesinin oluşturulmasını Efektin içine taşıyın, böylece Efekt yalnızca `roomId` string'ine bağlı olacaktır:

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
      <h1>{roomId} odasına hoşgeldiniz!</h1>
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
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="muzik">müzik</option>
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
  // Gerçek uygulama gerçektende bir sunucuya bağlanır
  return {
    connect() {
      console.log('✅ ' + serverUrl + ' adresindeki ' + roomId +  ' odasına bağlanılıyor');
    },
    disconnect() {
      console.log('❌ ' + serverUrl + ' adresindeki' + roomId + ' odasıyla bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Dikkat ederseniz işe `options` bağımlılığını kaldırmak için bağımlılık listesini düzenleyerek başlamadınız. Bu yanlış olurdu. Onun yerine, çevresindeki kodu değiştirdiniz, böylece bağımlılık *gereksiz* hale geldi. Bağımlılık listesini, Efektinizin kodu tarafından kullanılan tüm reaktif değerlerin bir listesi olarak düşünün. Bu listeye ne koyacağınızı kasıtlı olarak seçmezsiniz. Liste kodunuzu tanımlar. Bağımlılık listesini değiştirmek için kodu değiştirin.

<LearnMore path="/learn/removing-effect-dependencies">

**[Efekt Bağımlılıklarını Kaldırma](/learn/removing-effect-dependencies)** sayfasını okuyarak Efektinizin nasıl daha az yeniden çalışacağını öğrenin.

</LearnMore>

## Özel Hook'lar Kullanarak Mantığı Yeniden Kullanma {/*reusing-logic-with-custom-hooks*/}

React `useState`, `useContext`, ve `useEffect` gibi yerleşik Hook'lara sahiptir. Bazen, daha spesifik amaca hizmet eden bir Hook olmasını isteyeceksiniz: örneğin, veri getirmek, kullanıcının çevrimiçi olup olmadığını takip etmek ya da bir sohbet odasına bağlanmak için. Bunu yapmak için, uygulamanızın ihtiyacına göre kendi Hook'larınızı oluşturabilirsiniz.

Bu örnekte, `usePointerPosition` özel Hook'u fare imleci konumunu takip eder, `useDelayedValue` özel Hook'u ise ilettiğiniz değerin belirli bir milisaniye kadar "gerisinde kalan" bir değer döndürür. İmleci takip eden hareketli bir nokta izi görmek için fare imlecinizi sandbox önizleme alanının içine götürün:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Özel Hook'lar oluşturabilir, biraraya getirebilir, aralarında veri aktarabilir ve bileşenler arasında yeniden kullanabilirsiniz. Uygulamanız büyüdükçe, daha önce yazdığınız özel Hook'ları yeniden kullanabileceğiniz için elle daha az Efekt yazacaksınız. Ayrıca React topluluğu tarafından geliştirilip güncellenen pek çok mükemmel özel Hook'da vardır.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

**[Özel Hook'lar Kullanarak Mantığı Yeniden Kullanma](/learn/reusing-logic-with-custom-hooks)** sayfasını okuyarak bileşenler arasında mantığı nasıl paylaşabileceğinizi öğrenebilirsiniz.

</LearnMore>

## Sırada ne var? {/*whats-next*/}

[Ref ile Değerlere Referans Verme](/learn/referencing-values-with-refs) sayfasına giderek öğrenmeye başlayabilirsiniz!
