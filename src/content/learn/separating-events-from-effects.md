---
title: 'Olayları Efektlerinden Ayırma'
---

<Intro>

Olay yöneticileri yalnızca aynı etkileşimi tekrar gerçekleştirdiğinizde yeniden çalışır. Olay yöneticileri aksine, Efektler bir prop veya state değişkeni gibi okudukları bir değerin son render sırasında olduğundan farklı olması durumunda yeniden senkronize olur. Bazen, her iki davranışın bir karışımını da istersiniz: bazı değerlere yanıt olarak yeniden çalışan ancak diğerlerine yanıt vermeyen bir Efekt. Bu sayfa size bunu nasıl yapacağınızı öğretecek.

</Intro>

<YouWillLearn>

- Bir olay yöneticisi ile bir Efekt arasında nasıl seçim yapılır?
- Efektler neden reaktiftir ve olay yöneticileri değildir?
- Efektinizin kodunun bir bölümünün reaktif olmamasını istediğinizde ne yapmalısınız?
- Efekt olaylarının ne olduğu ve Efektlerinizden nasıl çıkarılacağı
- Efekt olaylarını kullanarak Efektlerden en son sahne ve durum nasıl okunur?

</YouWillLearn>

## Olay yöneticileri ve Efektler arasında seçim yapma {/*choosing-between-event-handlers-and-effects*/}

İlk olarak, olay yöneticileri ve Efektler arasındaki farkı özetleyelim.

Bir sohbet odası bileşeni oluşturduğunuzu düşünün. Gereksinimleriniz şuna benziyor:

1. Bileşeniniz seçilen sohbet odasına otomatik olarak bağlanmalıdır.
1. "Gönder" düğmesine tıkladığınızda, sohbete bir mesaj göndermelidir.

Diyelim ki bunlar için kodu zaten uyguladınız, ancak nereye koyacağınızdan emin değilsiniz. Olay yöneticileri mi yoksa Efektler mi kullanmalısınız? Bu soruyu her yanıtlamanız gerektiğinde, [*neden* kodun çalışması gerektiğini](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) düşünün.

### Olay yöneticileri belirli etkileşimlere yanıt olarak çalışır {/*event-handlers-run-in-response-to-specific-interactions*/}

Kullanıcının bakış açısına göre, bir mesajın gönderilmesi belirli bir "Gönder" düğmesine tıklandığı için *olmalıdır*. Mesajlarını başka bir zamanda veya başka bir nedenle gönderirseniz kullanıcı oldukça üzülecektir. İşte bu yüzden mesaj gönderme bir olay yöneticileri olmalıdır. Olay yöneticileri belirli etkileşimleri ele almanızı sağlar:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Gönder</button>
    </>
  );
}
```

Bir olay yöneticileri ile `sendMessage(message)`ın *sadece* kullanıcı düğmeye bastığında çalışacağından emin olabilirsiniz.

### Senkronizasyon gerektiğinde Efektler çalışır {/*effects-run-whenever-synchronization-is-needed*/}

Bileşeni sohbet odasına bağlı tutmanız gerektiğini de hatırlayın. Bu kod nereye gidecek?

Bu kodu çalıştırmak için *neden* belirli bir etkileşim değildir. Kullanıcının sohbet odası ekranına neden veya nasıl gittiği önemli değildir. Artık ona baktıklarına ve onunla etkileşime girebildiklerine göre, bileşenin seçilen sohbet sunucusuna bağlı kalması gerekir. Sohbet odası bileşeni uygulamanızın ilk ekranı olsa ve kullanıcı hiçbir etkileşim gerçekleştirmemiş olsa bile, yine de *bağlanmanız* gerekir. İşte bu yüzden bir Efekttir:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Bu kod sayesinde, kullanıcı tarafından gerçekleştirilen belirli etkileşimlerden *bağımsız olarak*, seçili sohbet sunucusuyla her zaman aktif bir bağlantı olduğundan emin olabilirsiniz. Kullanıcı ister sadece uygulamanızı açmış, ister farklı bir oda seçmiş ya da başka bir ekrana gidip geri dönmüş olsun, Efektiniz bileşenin o anda seçili olan odayla *senkronize kalmasını* ve [gerektiğinde yeniden bağlanmasını](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once) sağlar.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Gönder</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  const [show, setShow] = useState(false);
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
          <option value="müzik">müzik</option>
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
export function sendMessage(message) {
  console.log('🔵 Siz gönderdiniz: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  return {
    connect() {
      console.log('✅ ' + serverUrl + 'adresinde "' + roomId + '" odasina baglaniliyor' + '...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl + 'adresinde "' + roomId + '" odasının bağlantısı kesildi ' );
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Reaktif değerler ve reaktif mantık {/*reactive-values-and-reactive-logic*/}

Sezgisel olarak, olay yöneticilerinin her zaman "manuel" olarak tetiklendiğini söyleyebilirsiniz, örneğin bir düğmeye tıklayarak. Öte yandan, Efektler "otomatiktir": senkronize kalmak için gerektiği sıklıkta çalışır ve yeniden çalışırlar.

Bunu düşünmenin daha kesin bir yolu vardır.

Bileşeninizin gövdesi içinde bildirilen prop'lar, durum ve değişkenler <CodeStep step={2}>reaktif değerler</CodeStep> olarak adlandırılır. Bu örnekte, `serverUrl` reaktif bir değer değildir, ancak `roomId` ve `message` reaktif değerlerdir. Oluşturma veri akışına katılırlar:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Bunlar gibi reaktif değerler yeniden oluşturma nedeniyle değişebilir. Örneğin, kullanıcı `message`ı düzenleyebilir veya bir açılır menüde farklı bir `roomId` seçebilir. Olay yöneticileri ve Efektler değişikliklere farklı şekilde yanıt verir:

- **Olay yöneticilerinin içindeki mantık * reaktif değildir.*** Kullanıcı aynı etkileşimi (örneğin bir tıklama) tekrar gerçekleştirmedikçe tekrar çalışmayacaktır. Olay yöneticileri, değişikliklerine "tepki vermeden" reaktif değerleri okuyabilir.
- **Efektlerin içindeki mantık *reaktiftir.*** Efektiniz reaktif bir değeri okuyorsa, [bunu bir bağımlılık olarak belirtmeniz gerekir](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Ardından, bir yeniden oluşturma bu değerin değişmesine neden olursa, React, Efektinizin mantığını yeni değerle yeniden çalıştıracaktır.

Bu farkı göstermek için bir önceki örneğe geri dönelim.

### Olay yöneticileri içindeki mantık reaktif değildir {/*logic-inside-event-handlers-is-not-reactive*/}

Şu kod satırına bir göz atın. Bu mantık reaktif olmalı mı olmamalı mı?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Kullanıcının bakış açısından, **`message`'da yapılan bir değişiklik, mesaj göndermek istedikleri anlamına gelmez.** Bu sadece kullanıcının yazmakta olduğu anlamına gelir. Başka bir deyişle, mesaj gönderen mantık reaktif olmamalıdır. Sadece <CodeStep step={2}>reactive value</CodeStep> değiştiği için tekrar çalışmamalıdır. Bu yüzden olay yöneticisine aittir:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Olay yöneticileri reaktif değildir, bu nedenle `sendMessage(message)` yalnızca kullanıcı Gönder düğmesine tıkladığında çalışacaktır.

### Efektlerin içindeki mantık reaktiftir {/*logic-inside-effects-is-reactive*/}

Şimdi bu satırlara geri dönelim:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Kullanıcının bakış açısından, **`roomId`'deki bir değişiklik farklı bir odaya bağlanmak istedikleri anlamına gelir.** Başka bir deyişle, odaya bağlanma mantığı reaktif olmalıdır. Bu kod satırlarının <CodeStep step={2}>reaktif değere</CodeStep> "ayak uydurmasını" ve bu değer farklıysa yeniden çalışmasını *istiyorsunuz*. Bu yüzden bir Efekte aittir:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Efektler reaktiftir, bu nedenle `createConnection(serverUrl, roomId)` ve `connection.connect()`, `roomId`nin her farklı değeri için çalışacaktır. Efektiniz sohbet bağlantısını o anda seçili olan odayla senkronize tutar.

## Reaktif olmayan mantığı Efektlerden çıkarma {/*extracting-non-reactive-logic-out-of-effects*/}

Reaktif mantığı reaktif olmayan mantıkla karıştırmak istediğinizde işler daha da zorlaşır.

Örneğin, kullanıcı sohbete bağlandığında bir bildirim göstermek istediğinizi düşünün. Bildirimi doğru renkte gösterebilmek için mevcut temayı (koyu veya açık) prop'lardan okursunuz:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

Ancak, `theme` reaktif bir değerdir (yeniden oluşturma sonucunda değişebilir) ve [bir Efekt tarafından okunan her reaktif değerin bağımlılığı olarak bildirilmesi gerekir](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Şimdi `theme` Efektinizin bir bağımlılığı olarak belirtmeniz gerekir:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Bağlandı!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Bu örnekle oynayın ve bu kullanıcı deneyimindeki sorunu tespit edip edemeyeceğinizi görün:

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
      showNotification('Baglandi!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>{roomId} odasına hoş geldiniz!</h1>
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
          <option value="müzik">müzik</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Koyu tema kullanın
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
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
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
        throw Error('İşleyici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenir.');
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

`RoomId` değiştiğinde, sohbet beklediğiniz gibi yeniden bağlanır. Ancak `theme` de bir bağımlılık olduğundan, koyu ve açık tema arasında her geçiş yaptığınızda sohbet *ayrıca* yeniden bağlanır. Bu hiç de iyi değil!

Başka bir deyişle, bir Efektin (reaktif olan) içinde olmasına rağmen bu satırın reaktif olmasını *istemezsiniz*:

```js
      // ...
      showNotification('Bağlandı!', theme);
      // ...
```

Bu reaktif olmayan mantığı, etrafındaki reaktif Efektten ayırmak için bir yola ihtiyacınız var.

### Bir Efekt Olayı Bildirme {/*declaring-an-effect-event*/}

<Canary>

<<<<<<< HEAD
Bu bölümde, React'in kararlı bir sürümünde henüz yayınlanmamış **deneysel bir API** açıklanmaktadır.
=======
**The `useEffectEvent` API is currently only available in React’s Canary and Experimental channels.** 
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

<<<<<<< HEAD
Bu reaktif olmayan mantığı Efektinizden çıkarmak için [`useEffectEvent`](/reference/react/experimental_useEffectEvent) adlı özel bir Hook kullanın:
=======
</Canary>

Use a special Hook called [`useEffectEvent`](/reference/react/useEffectEvent) to extract this non-reactive logic out of your Effect:
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Baglandi!', theme);
  });
  // ...
```

Burada, `onConnected` bir *Efekt olayı olarak adlandırılır.* Efekt mantığınızın bir parçasıdır, ancak daha çok bir olay yöneticisi gibi davranır. İçindeki mantık reaktif değildir ve her zaman sahne ve durumunuzun en son değerlerini "görür".

Artık `onConnected` Efekt olayını Efektinizin içinden çağırabilirsiniz:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Baglandi!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bagimliliklar bildirildi
  // ...
```

Bu, problemi çözer. Dikkat etmen gereken nokta, Efekt içinde artık kullanılmadığı için `theme` öğesini bağımlılıklar listesinden *çıkarman* gerektiğidir. Ayrıca `onConnected` öğesini listeye *eklemene* de gerek yoktur çünkü **Efekt Olayları reaktif değildir ve bağımlılıklardan çıkarılmalıdır.**

Yeni davranışın beklediğiniz gibi çalıştığını doğrulayın:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Baglandi!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} odasına hoş geldiniz!</h1>
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
          <option value="müzik">müzik</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Koyu tema kullanın
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
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
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
        throw Error('İşleyici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenir.');
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

Efekt olaylarını olay yöneticilerine çok benzer olarak düşünebilirsiniz. Temel fark, olay işleyicilerinin kullanıcı etkileşimlerine yanıt olarak çalışması, Efekt olaylarının ise sizin tarafınızdan Efektlerden tetiklenmesidir. Efekt olayları, Efektlerin tepkiselliği ile tepkisel olmaması gereken kod arasındaki "zinciri kırmanızı" sağlar.

### Efekt olayları ile en son propları ve state okuma {/*reading-latest-props-and-state-with-effect-events*/}

<Canary>

<<<<<<< HEAD
Bu bölümde, React'in kararlı bir sürümünde henüz yayınlanmamış **deneysel bir API** açıklanmaktadır.
=======
**The `useEffectEvent` API is currently only available in React’s Canary and Experimental channels.** 
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

</Canary>

Efekt olayları, bağımlılık bağlayıcısını bastırmak isteyebileceğiniz birçok modeli düzeltmenize olanak tanır.

Örneğin, sayfa ziyaretlerini günlüğe kaydetmek için bir Efektiniz olduğunu varsayalım:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Daha sonra sitenize birden fazla rota eklersiniz. Şimdi `Page` bileşeniniz geçerli yolu içeren bir `url` prop alır. `url`i `logVisit` çağrınızın bir parçası olarak iletmek istiyorsunuz, ancak bağımlılık linter`ı şikayet ediyor:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect'in eksik bir bağımlılığı var: 'url'
  // ...
}
```

Kodun ne yapmasını istediğinizi düşünün. Her URL farklı bir sayfayı temsil ettiğinden, farklı URL'ler için ayrı bir ziyareti günlüğe kaydetmek *istiyorsunuz*. Başka bir deyişle, bu `logVisit` çağrısı *`url`ye göre reaktif olmalıdır*. Bu nedenle, bu durumda, bağımlılık linter'ını takip etmek ve `url` öğesini bir bağımlılık olarak eklemek mantıklıdır:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Tüm bagimliliklar bildirildi
  // ...
}
```

Şimdi diyelim ki her sayfa ziyaretiyle birlikte alışveriş sepetindeki ürün sayısını da dahil etmek istiyorsunuz:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect'in eksik bir bağımlılığı var: 'numberOfItems'
  // ...
}
```

Effect içinde `numberOfItems` kullandınız, bu nedenle linter sizden bunu bir bağımlılık olarak eklemenizi istiyor. Ancak, `logVisit` çağrısının `numberOfItems` ile ilgili olarak reaktif olmasını *istemezsiniz*. Eğer kullanıcı alışveriş sepetine bir şey koyarsa ve `sayıOfItems` değişirse, bu *kullanıcının sayfayı tekrar ziyaret ettiği anlamına gelmez*. Başka bir deyişle, *sayfayı ziyaret etmek* bir anlamda bir "olaydır". Zaman içinde kesin bir anda gerçekleşir.

Kodu iki parçaya bölün:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Tüm bagimliliklar bildirildi
  // ...
}
```

Burada, `onVisit` bir Efekt olayıdır. İçindeki kod reaktif değildir. Bu nedenle `numberOfItems` (veya başka herhangi bir reaktif değer!) kullanabilir ve bunun çevredeki kodun değişikliklerde yeniden yürütülmesine neden olacağından endişe duymazsınız.

Öte yandan, Efektin kendisi reaktif kalır. Efekt içindeki kod `url` özelliğini kullanır, bu nedenle Efekt her yeniden oluşturmadan sonra farklı bir `url` ile yeniden çalışacaktır. Bu da `onVisit` Efekt olayını çağıracaktır.

Sonuç olarak, `url` öğesindeki her değişiklik için `logVisit` öğesini çağıracak ve her zaman en son `numberOfItems` öğesini okuyacaksınız. Ancak, `numberOfItems` kendi başına değişirse, bu kodun yeniden çalışmasına neden olmaz.

<Note>

Hiçbir argüman olmadan `onVisit()` fonksiyonunu çağırıp içindeki `url`yi okuyup okuyamayacağınızı merak ediyor olabilirsiniz:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Bu işe yarayabilir, ancak bu `url`yi Efekt olayına açıkça aktarmak daha iyidir. **Efekt olayınıza bir argüman olarak `url` geçerek, farklı bir `url` ile bir sayfayı ziyaret etmenin kullanıcının bakış açısından ayrı bir "olay" oluşturduğunu söylemiş olursunuz.** `visitedUrl`, gerçekleşen "olayın" bir *parçasıdı*:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Efekt olayınızın `visitedUrl` öğesini açıkça "sorduğu" için, artık `url` öğesini Efektin bağımlılıklarından yanlışlıkla kaldıramazsınız. Eğer `url` bağımlılığını kaldırırsanız (farklı sayfa ziyaretlerinin tek bir ziyaret olarak sayılmasına neden olursanız), linter sizi bu konuda uyaracaktır. `onVisit`in `url` ile ilgili olarak reaktif olmasını istersiniz, bu nedenle `url`yi içeriden okumak yerine (reaktif olmayacağı yerde), Efektinizden *geçirirsiniz.

Bu, özellikle Efekt içinde bazı asenkron mantık varsa önemli hale gelir:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Ziyaretleri kaydetmeyi geciktirin
  }, [url]);
```

Burada, `onVisit` içindeki `url` *en son* `url`ye karşılık gelir (bu zaten değişmiş olabilir), ancak `visitedUrl` başlangıçta bu Efektin (ve bu `onVisit` çağrısının) çalışmasına neden olan `url`ye karşılık gelir.

</Note>

<DeepDive>

#### Bunun yerine bağımlılık linterini bastırmak doğru olur mu? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Mevcut kod tabanlarında bazen lint kuralının bu şekilde bastırıldığını görebilirsiniz:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Linteri bu şekilde bastırmaktan kaçının:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

`UseEffectEvent` React'in kararlı bir parçası haline geldikten sonra, **kuralın asla bastırılmamasını** öneriyoruz.

Kuralı bastırmanın ilk dezavantajı, Efektinizin kodunuza eklediğiniz yeni bir reaktif bağımlılığa "tepki vermesi" gerektiğinde React'in artık sizi uyarmayacak olmasıdır. Önceki örnekte, React size bunu yapmanızı hatırlattığı için bağımlılıklara `url` eklediniz. Linter'ı devre dışı bırakırsanız, bu Efekt üzerinde gelecekte yapacağınız düzenlemeler için artık böyle hatırlatıcılar almayacaksınız. Bu da hatalara yol açar.

Burada, bağlayıcıyı bastırmanın neden olduğu kafa karıştırıcı bir hata örneği verilmiştir. Bu örnekte, `handleMove` fonksiyonunun, noktanın imleci takip edip etmeyeceğine karar vermek için mevcut `canMove` durum değişkeni değerini okuması gerekmektedir. Ancak, `handleMove` içinde `canMove` her zaman `true` değerindedir.

Nedenini anlayabiliyor musunuz?

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Noktanın hareket etmesine izin verilir
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Bu kodla ilgili sorun, bağımlılık linterinin bastırılmasıdır. Bastırmayı kaldırırsanız, bu Efektin `handleMove` fonksiyonuna bağlı olması gerektiğini görürsünüz. Bu mantıklıdır: `handleMove` bileşen gövdesi içinde bildirilir, bu da onu reaktif bir değer yapar. Her reaktif değer bir bağımlılık olarak belirtilmelidir, aksi takdirde zaman içinde eskimesi olasıdır!

Orijinal kodun yazarı, Effect'in herhangi bir reaktif değere bağlı olmadığını (`[]`) söyleyerek React'e "yalan söylemiştir". Bu nedenle React, `canMove` değiştikten sonra (ve onunla birlikte `handleMove`) Efekti yeniden senkronize etmedi. React, Efekti yeniden senkronize etmediği için, dinleyici olarak eklenen `handleMove`, ilk render sırasında oluşturulan `handleMove` fonksiyonudur. İlk render sırasında `canMove` `true` idi, bu yüzden ilk renderdan `handleMove` sonsuza kadar bu değeri görecektir.

**Linter'ı asla bastırmazsanız, eski değerlerle ilgili sorunları asla görmezsiniz.**

`UseEffectEvent` ile linter`a "yalan söylemeye" gerek yoktur ve kod beklediğiniz gibi çalışır:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Noktanın hareket etmesine izin verilir
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Bu, `useEffectEvent`in *her zaman* doğru çözüm olduğu anlamına gelmez. Bunu yalnızca reaktif olmasını istemediğiniz kod satırlarına uygulamalısınız. Yukarıdaki sanal alanda, Efekt kodunun `canMove` ile ilgili olarak reaktif olmasını istemediniz. Bu yüzden bir Efekt olayı çıkarmak mantıklı oldu.

Linteri bastırmanın diğer doğru alternatifleri için [Efekt Bağımlılıklarını Kaldırma](/learn/removing-effect-dependencies) bölümünü okuyun.

</DeepDive>

### Efekt Olaylarının Sınırlamaları {/*limitations-of-effect-events*/}

<Canary>

<<<<<<< HEAD
Bu bölümde, React'in kararlı bir sürümünde henüz yayınlanmamış **deneysel bir API** açıklanmaktadır.
=======
**The `useEffectEvent` API is currently only available in React’s Canary and Experimental channels.** 
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

</Canary>

Efekt Olayları, kullanma şekliniz açısından oldukça sınırlıdır:

- **Sadece Efektlerin içinden çağırın.**
- **Asla diğer bileşenlere veya Hook'lara aktarmayın.**

Örneğin, bir Efekt olayını şu şekilde bildirmeyin ve geçirmeyin:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Kaçının: Efekt olaylarini geçmek

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Bağımlılıklarda "callback" fonksiyonunu belirtmeniz gerekiyor
}
```

Bunun yerine, her zaman Efekt olaylarını doğrudan onları kullanan Efektlerin yanında bildirin:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ İyi: Yalnızca bir Efektin içinde yerel olarak çağrılır
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Bağımlılık olarak "onTick" (bir Efekt olayı) belirtmeye gerek yok
}
```

Efekt olayları, Efekt kodunuzun reaktif olmayan "parçalarıdır". Kendilerini kullanan Efektin yanında olmalıdırlar.

<Recap>

- Olay yöneticileri belirli etkileşimlere yanıt olarak çalışır.
- Efektler, senkronizasyon gerektiğinde çalışır.
- Olay yöneticilerinin içindeki mantık reaktif değildir.
- Efektlerin içindeki mantık reaktiftir.
- Reaktif olmayan mantığı Efektlerden Efekt olaylarına taşıyabilirsiniz.
- Efekt olaylarını yalnızca Efektlerin içinden çağırın.
- Efekt olaylarını diğer bileşenlere veya Hook'lara aktarmayın.

</Recap>

<Challenges>

#### Güncellenmeyen bir değişkeni düzeltme {/*fix-a-variable-that-doesnt-update*/}

Bu `Timer` bileşeni her saniye artan bir `count` durum değişkenini tutar. Artan değer `increment` durum değişkeninde saklanır. Artı ve eksi düğmeleriyle `increment` değişkenini kontrol edebilirsiniz.

Ancak, artı düğmesine kaç kez tıklarsanız tıklayın, sayaç yine de her saniye bir artar. Bu kodda yanlış olan nedir? Efektin kodu içinde `increment` neden her zaman `1`e eşittir? Hatayı bulun ve düzeltin.

<Hint>

Bu kodu düzeltmek için kurallara uymak yeterlidir.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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


```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Saniyedeki artış miktari:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Her zamanki gibi, Efektlerde hata ararken, linter bastırmalarını arayarak başlayın.

Suppression yorumunu kaldırırsanız, React size bu Efektin kodunun `increment` değerine bağlı olduğunu söyleyecektir, ancak siz bu Efektin herhangi bir reaktif değere (`[]`) bağlı olmadığını iddia ederek React'e "yalan söylediniz". Bağımlılık dizisine `increment` ekleyin:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Saniyedeki artış miktari:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Şimdi, `increment` değiştiğinde, React Efektinizi yeniden senkronize edecek ve bu da aralığı yeniden başlatacakır.

</Solution>

#### Donan bir sayacı düzeltin {/*fix-a-freezing-counter*/}

Bu `Timer` bileşeni her saniye artan bir `count` durum değişkenini tutar. Artan değer `increment` durum değişkeninde saklanır ve bunu artı ve eksi düğmeleriyle kontrol edebilirsiniz. Örneğin, artı düğmesine dokuz kez basmayı deneyin ve `sayı`nın artık her saniye bir yerine on arttığına dikkat edin.

Bu kullanıcı arayüzü ile ilgili küçük bir sorun var. Artı veya eksi düğmelerine saniyede bir kereden daha hızlı basmaya devam ederseniz, zamanlayıcının kendisinin durakladığını fark edebilirsiniz. Ancak düğmelerden birine son basışınızın üzerinden bir saniye geçtikten sonra devam eder. Bunun neden olduğunu bulun ve sorunu çözerek zamanlayıcının kesintisiz olarak *her* saniye çalışmasını sağlayın.

<Hint>

Görünüşe göre zamanlayıcıyı kuran Efekt `increment` değerine "tepki" veriyor. `setCount`u çağırmak için mevcut `increment` değerini kullanan satırın gerçekten reaktif olması gerekiyor mu?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Saniyedeki artış miktari:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Sorun, Efekt içindeki kodun `increment` state değişkenini kullanmasıdır. Bu, Efektinizin bir bağımlılığı olduğundan, `increment` durumundaki her değişiklik Efektin yeniden senkronize olmasına neden olur ve bu da aralığın temizlenmesine neden olur. Ateşleme şansı bulmadan önce her seferinde aralığı temizlemeye devam ederseniz, zamanlayıcı durmuş gibi görünecektir.

Sorunu çözmek için, Efektten bir `onTick` Efekt olayı çıkarın:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Saniyedeki artış miktari:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

`onTick` bir Efekt olayı olduğundan, içindeki kod reaktif değildir. Increment` değişikliği herhangi bir Efekti tetiklemez.

</Solution>

#### Ayarlanamayan bir gecikmeyi düzeltin {/*fix-a-non-adjustable-delay*/}

Bu örnekte, aralık gecikmesini özelleştirebilirsiniz. Bu, iki düğme tarafından güncellenen bir `delay` state değişkeninde saklanır. Ancak, `delay` 1000 milisaniye (yani bir saniye) olana kadar "artı 100 ms" düğmesine bassanız bile, zamanlayıcının hala çok hızlı (her 100 ms'de bir) arttığını fark edeceksiniz. Sanki `delay`'de yaptığınız değişiklikler göz ardı edilmiş gibi. Hatayı bulun ve düzeltin.

<Hint>

Effect olayları içindeki kod reaktif değildir. `setInterval` çağrısının yeniden çalışmasını *istediğiniz* durumlar var mı?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Artış:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Artış gecikmesi:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Yukarıdaki örnekle ilgili sorun, kodun gerçekte ne yapması gerektiğini düşünmeden `onMount` adlı bir Effect Event çıkarmasıdır. Efekt olaylarını yalnızca belirli bir nedenle çıkarmalısınız: kodunuzun bir bölümünü reaktif olmayan hale getirmek istediğinizde. Bununla birlikte, `setInterval` çağrısı `delay` durum değişkenine göre reaktif olmalıdır. Eğer `delay` değişirse, aralığı sıfırdan ayarlamak istersiniz! Bu kodu düzeltmek için, tüm reaktif kodu Efektin içine geri çekin:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Artış:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Artış gecikmesi:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Genel olarak, bir kod parçasının *amacından* ziyade *zamanlamasına* odaklanan `onMount` gibi fonksiyonlara şüpheyle yaklaşmalısınız. İlk başta "daha açıklayıcı" gelebilir ancak amacınızı gizler. Genel bir kural olarak, Efekt olayları *kullanıcının* bakış açısından gerçekleşen bir şeye karşılık gelmelidir. Örneğin, `onMessage`, `onTick`, `onVisit` veya `onConnected` iyi Effect olay adlarıdır. İçlerindeki kodun muhtemelen reaktif olması gerekmeyecektir. Öte yandan, `onMount`, `onUpdate`, `onUnmount` veya `onAfterRender` o kadar geneldir ki, yanlışlıkla *reaktif olması gereken* kodları bunlara koymak kolaydır. Bu nedenle, Efekt olaylarınızı bazı kodların ne zaman çalıştığına göre değil, *kullanıcının ne olduğunu düşündüğüne göre* adlandırmalısınız.

</Solution>

#### Geciken bir bildirimi düzeltme {/*fix-a-delayed-notification*/}

Bir sohbet odasına katıldığınızda, bu bileşen bir bildirim gösterir. Ancak, bildirimi hemen göstermez. Bunun yerine, bildirim yapay olarak iki saniye geciktirilir, böylece kullanıcının kullanıcı arayüzüne bakma şansı olur.

Bu neredeyse işe yarıyor, ancak bir hata var. Açılır menüyü "genel "den "seyahat "e ve ardından çok hızlı bir şekilde "müzik "e değiştirmeyi deneyin. Bunu yeterince hızlı yaparsanız, iki bildirim göreceksiniz (beklendiği gibi!) ancak her ikisinde de * "Müziğe hoş geldiniz" yazacaktır.

"Genel"den "seyahat"e ve ardından çok hızlı bir şekilde "müzik"e geçtiğinizde, ilki "Seyahate hoş geldiniz" ve ikincisi "Müziğe hoş geldiniz" olmak üzere iki bildirim görecek şekilde düzeltin. (Ek bir zorluk için, *zaten* bildirimlerin doğru odaları göstermesini sağladığınızı varsayarak, kodu yalnızca ikinci bildirim görüntülenecek şekilde değiştirin).

<Hint>

Efektiniz hangi odaya bağlı olduğunu bilir. Efekt Olayınıza aktarmak isteyebileceğiniz herhangi bir bilgi var mı?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
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
          <option value="müzik">müzik</option>
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
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
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
        throw Error('İşleyici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenir.');
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

<Solution>

Efekt olayınızın içinde, `roomId` değeri *Efekt olayının çağrıldığı andaki değerdir.*

Efekt olayınıza iki saniyelik bir gecikmeyle çağrılır. Seyahat odasından müzik odasına hızlı bir şekilde geçiş yapıyorsanız, seyahat odasının bildirimi gösterildiğinde, `roomId` zaten `"müzik"`tir. Bu yüzden her iki bildirimde de "Müziğe hoş geldiniz" yazıyor.

Sorunu çözmek için, Efekt olayı içinde *en son* `roomId`yi okumak yerine, aşağıdaki `connectedRoomId` gibi Efekt olayınızın bir parametresi haline getirin. Ardından `onConnected(roomId)` çağrısı yaparak `roomId`yi Efektinizden geçirin:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} odasına hoş geldiniz!</h1>
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
          <option value="müzik">müzik</option>
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
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
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
        throw Error('İşleyici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenir.');
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

`roomId`nin `"seyahat"` olarak ayarlandığı (yani `"seyahat"` odasına bağlandığı) Efekt, `"seyahat"` için bildirim gösterecektir. `roomId` değeri `"müzik"` olarak ayarlanmış olan (yani `"müzik"` odasına bağlanmış olan) Efekt, `"müzik"` için bildirim gösterecektir. Başka bir deyişle, `connectedRoomId` Efektinizden (reaktif olan) gelirken, `theme` her zaman en son değeri kullanır.

Ek zorluğu çözmek için, bildirim zaman aşımı kimliğini kaydedin ve Efektinizin temizleme işlevinde temizleyin:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
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
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>{roomId} odasına hoş geldiniz!</h1>
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
          <option value="müzik">müzik</option>
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
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
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
        throw Error('İşleyici iki kez eklenemiyor.');
      }
      if (event !== 'connected') {
        throw Error('Yalnızca "connected" olayı desteklenir.');
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

Bu, oda değiştirdiğinizde önceden planlanmış (ancak henüz görüntülenmemiş) bildirimlerin iptal edilmesini sağlar.

</Solution>

</Challenges>
