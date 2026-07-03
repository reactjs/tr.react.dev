---
title: 'Özel Hook''lar ile Mantığı Tekrar Kullanma'
---

<Intro>

React, `useState`, `useContext`, ve `useEffect` gibi birkaç yerleşik Hook ile birlikte gelir. Bazen, bazı daha spesifik amaçlar için bir Hook olmasını isteyeceksiniz: örneğin, veri çekmek için, kullanıcının çevrimiçi olup olmadığını takip etmek için veya bir sohbet odasına bağlanmak için. Bu Hook'ları React'te bulamayabilirsiniz, ancak uygulamanızın ihtiyaçları için kendi Hook'larınızı oluşturabilirsiniz.

</Intro>

<YouWillLearn>

- Özel Hook'ların ne olduğunu ve kendi özel Hook'larınızı nasıl yazacağınızı
- Bileşenler arasında mantığı nasıl yeniden kullanacağınızı
- Özel Hook'larınızı nasıl adlandıracağınızı ve yapılandıracağınızı
- Özel Hook'ları ne zaman ve neden çıkaracağınızı

</YouWillLearn>

## Özel Hook'lar: Bileşenler arasında mantığı paylaşma {/*custom-hooks-sharing-logic-between-components*/}

Ağa büyük ölçüde bağımlı bir uygulama geliştirdiğinizi düşünün (çoğu uygulamanın yaptığı gibi). Kullanıcıyı, uygulamanızı kullanırken ağ bağlantısının yanlışlıkla kapandığı durumlarda uyarmak istersiniz. Bunu nasıl yapardınız? Bileşeninizde iki şeye ihtiyacınız olduğu gibi görünüyor:

1. Ağınızın çevrimiçi olup olmadığını izleyen bir state parçası.
2. Global [`çevrimiçi`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) ve [`çevrimdışı`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) olaylarına abone olan ve bu state'i güncelleyen bir Efekt.

Bu sizin bileşeninizi ağ durumu ile [senkronize](/learn/synchronizing-with-effects) tutacaktır. Şöyle bir şeyle başlayabilirsiniz:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı kopmuş'}</h1>;
}
```

</Sandpack>

Ağınızı kapatıp açmayı deneyin ve bu `StatusBar`'ın tepki olarak nasıl güncellendiğini fark edin.

Şimdi *ek olarak* aynı mantığı farklı bir bileşende kullanmak istediğinizi hayal edin. Ağ kapalıyken "Kaydet" yerine "Yeniden bağlanıyor..." yazan ve devre dışı bırakılan bir Kaydet düğmesi uygulamak istiyorsunuz.

Başlangıç olarak, `isOnline` state'ini ve Efekti `SaveButton`'a kopyalayabilirsiniz:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Yeniden bağlanılıyor...'}
    </button>
  );
}
```

</Sandpack>

Ağı kapatırsanız, düğmenin görünümünün değiştiğini doğrulayın.

Bu iki bileşen iyi çalışıyor, ancak aralarındaki mantık tekrarı talihsiz. Görünen o ki farklı *görsel görünüme* sahip olsalar da, aralarındaki mantığı yeniden kullanmak istiyorsunuz.

### Kendi özel Hook'unuzu bir bileşenden çıkarma {/*extracting-your-own-custom-hook-from-a-component*/}

Bir an için hayal edin, [`useState`](/reference/react/useState) ve [`useEffect`](/reference/react/useEffect) gibi, yerleşik bir `useOnlineStatus` Hook'u olsaydı. O zaman bu iki bileşen de basitleştirilebilir ve aralarındaki tekrarı kaldırabilirsiniz:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimici' : '❌ Bağlantı kopmuş'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Yeniden bağlanılıyor...'}
    </button>
  );
}
```

Yerleşik bir Hook bulunmasa da, kendiniz yazabilirsiniz. `useOnlineStatus` adında bir fonksiyon oluşturun ve daha önce yazdığınız bileşenlerdeki tekrarlanan kodu içine taşıyın:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Fonksiyonun sonunda `isOnline`'ı döndürün. Bu, bileşenlerinizin bu değeri okumasına olanak sağlar:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı kopmuş'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Yeniden bağlanılıyor...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Ağı kapatıp açmanın iki bileşeni de güncellediğini doğrulayın.

Şimdi bileşenleriniz çok tekrarlı mantığa sahip değil. **Daha da önemlisi, içlerindeki kod, *nasıl yapacakları*ndan (tarayıcı olaylarına abone olarak) ziyade *ne yapmak istedikleri*ni (çevrimiçi durumu kullanın!) açıklıyor.**

Mantığı özel Hook'lara çıkarttığınızda, bir harici sistem ya da tarayıcı API'si ile nasıl başa çıktığınızın zorlu ayrıntılarını gizleyebilirsiniz. Bileşenlerinizin kodu, uygulamanızın nasıl yerine getirdiğinden ziyade ne yapmak istediğinizi açıklar.

### Hook isimleri her zaman `use` ile başlar {/*hook-names-always-start-with-use*/}

React uygulamaları bileşenlerden oluşur. Bileşenler yerleşik veya özel olsun, Hook'lardan oluşur. Muhtemelen sıklıkla başkaları tarafından oluşturulan özel Hook'ları kullanacaksınız, ancak arada bir kendiniz de yazabilirsiniz!

Bu isimlendirme kurallarına uymalısınız:

1. **React bileşenleri büyük harfle başlamalıdır,** `StatusBar` ve `SaveButton` gibi. React bileşenleri ayrıca, JSX gibi, React'in nasıl görüntüleyeceğini bildiği bir şey döndürmelidir.
2. **Hook isimleri `use` ile başlayıp büyük harfle devam etmelidir,** [`useState`](/reference/react/useState) (yerleşik) veya `useOnlineStatus` (özel, yukarıdaki örnekte olduğu gibi). Hook'lar keyfi değerler döndürebilir.

Bu kural, sizin bir bileşene her baktığınızda onun state, Efekt'leri ve diğer React özelliklerinin nerede "saklanabileceğini" bilmenizi garanti eder. Örneğin, bileşeninizde `getColor()` fonksiyonu çağrısı görürseniz, adının `use` ile başlamadığı için içinde React state'i içeremeyeceğinden emin olabilirsiniz. Ancak, `useOnlineStatus()` gibi bir fonksiyon çağrısı büyük olasılıkla içinde başka Hook'lara çağrı içerecektir!

<Note>

Eğer linter'ınız [React için yapılandırılmışsa,](/learn/editor-setup#linting) her zaman bu isimlendirme kuralını zorunlu kılacaktır. Yukarıdaki sandbox'ta `useOnlineStatus`'u `getOnlineStatus` olarak yeniden adlandırın. Linter'ınızın artık onun içinde `useState` veya `useEffect` çağırmaya izin vermediğini fark edin. Sadece Hook'lar ve bileşenler diğer Hook'ları çağırabilir!

</Note>

<DeepDive>

#### Render sırasında çağrılan tüm fonksiyonlar `use` ön eki ile mi başlamalıdır? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Hayır. Hook'ları *çağırmayan* fonksiyonlar Hook *olmak* zorunda değildir.

Eğer fonksiyonunuz herhangi bir Hook çağırmıyorsa, `use` ön eki kullanmayın. Bunun yerine onu `use` ön eki *bulunmayan* bir sıradan fonksiyon olarak yazın. Örneğin, aşağıdaki `useSorted`  Hook çağırmadığından, onu `getSorted` olarak çağırın:

```js
// 🔴 Kaçının: Hook kullanmayan bir Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ İyi: Hook kullanmayan normal bir fonksiyon
function getSorted(items) {
  return items.slice().sort();
}
```

Bu, kodunuzun bu sıradan fonksiyonu, koşullar dahil olmak üzere herhangi bir yerde çağırabileceğinden emin olur:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Koşullu olarak getSorted() çağırmak sorun değil çünkü o bir Hook değil
    displayedItems = getSorted(items);
  }
  // ...
}
```

Bir fonksiyon eğer bir ya da daha fazla Hook'u içeriyorsa, ona `use` ön eki vermelisiniz:

```js
// ✅ İyi: Diğer Hook'ları kullanan bir Hook
function useAuth() {
  return useContext(Auth);
}
```

Teknik olarak, bu React tarafından zorunlu kılınmıyor. Prensipte, başka Hook'ları çağırmayan bir Hook yapabilirsiniz. Bu genellikle kafa karıştırıcı ve limitleyicidir, bu yüzden bu örüntüden uzak durmak en iyisidir. Ancak, işe yarayacağı nadir durumlar bulunabilir. Örneğin: belki şu anda fonksiyonunuz hiçbir Hook kullanmıyordur, ancak gelecekte ona bazı Hook çağrıları eklemeyi planlıyorsunuzdur. O zaman, fonksiyonu `use` önekiyle adlandırmak mantıklıdır:

```js {3-4}
// ✅ İyi: Gelecekte muhtemelen başka Hook'ları kullanacak bir Hook
function useAuth() {
  // TODO: Authentication tamamlanınca bu satırı değiştir:
  // return useContext(Auth);
  return TEST_USER;
}
```

Bu şekilde bileşenler onu koşullu olarak çağıramayacaktır. Bu, içine Hook çağrıları eklediğinizde önemli olacaktır. Eğer onun içinde Hook kullanmayı (şimdi ya da gelecekte) planlamıyorsanız, onu bir Hook yapmayın.

</DeepDive>

### Özel Hook'lar state'li mantığı paylaşmanızı sağlar, state'in kendisini değil {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Daha önceki bir örnekte, ağı açıp kapattığınızda, her iki bileşen de birlikte güncellendi. Ancak, onların arasında tek bir `isOnline` state değişkeninin paylaşıldığını düşünmek yanlış olur. Bu kodu inceleyin:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Bu, tekrarı çıkartmanızdan önceki hali gibi çalışır:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Bunlar tamamen bağımsız iki state değişkenleri ve Efekt'lerdir! Onlar rastlantısal olarak aynı anda aynı değere sahip oldular çünkü onları aynı harici değerle (ağın açık olup olmaması) senkronize ettiniz.

Bunu daha iyi canlandırabilmek adına, farklı bir örnek kullanacağız. Bu `Form` bileşenini ele alın:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        İsim:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Soyisim:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Günaydınlar, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Her form alanı için tekrarlayan bir mantık var:

1. Bir parça state bulunuyor (`firstName` ve `lastName`).
2. Bir değişim yöneticisi bulunuyor (`handleFirstNameChange` ve `handleLastNameChange`).
3. O girdi için `value` ve `onChange` özniteliklerini belirleyen bir parça JSX bulunuyor.

Bu tekrarlayan mantığı `useFormInput` özel Hook'una çıkartabilirsiniz:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        İsim:
        <input {...firstNameProps} />
      </label>
      <label>
        Soyisim:
        <input {...lastNameProps} />
      </label>
      <p><b>Günaydınlar, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

`value` adında sadece *bir* state değişkeni oluşturduğuna dikkat edin.

Yine de, `Form` bileşeni `useFormInput`'u *iki kez* çağırıyor:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Bu yüzden iki ayrı state değişkeni oluşturmuş gibi çalışıyor!

**Özel Hook'lar sizin *state'li mantık* paylaşmanıza olanak sağlar, *state'in kendinisi*ni değil. Bir Hook'a yapılan her çağrı aynı Hook'a yapılan tüm çağrılardan bağımsızdır.** Bu nedenle yukarıdaki iki kod alanı tamamen eşdeğerdir. İsterseniz, yukarı kayarak onları karşılaştırın. Özel bir Hook çıkartmadan önceki ve sonraki davranış tamamen aynıdır.

State'i birden fazla bileşen arasında paylaşmak istediğinizde, bunun yerine onu [yukarı taşıyın ve aşağı iletin](/learn/sharing-state-between-components).

## Hook'lar arasında reaktif değerler iletme {/*passing-reactive-values-between-hooks*/}

Özel Hook'larınızın içindeki kod, bileşeniniz her yeniden render edildiğinde yeniden yürütülecektir. Bu nedenle, bileşenler gibi, özel Hook'lar da [saf olmalıdır.](/learn/keeping-components-pure) Özel Hook'larınızın kodunu bileşeninizin bir parçası olarak düşünün!

Özel Hook'lar bileşeninizle birlikte yeniden render edildiğinden, her zaman en son prop'ları ve state'i alırlar. Bunun ne anlama geldiğini görmek için, bu sohbet odası örneğini ele alın. Sunucu URL'sini veya sohbet odasını değiştirin:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçiniz:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('Yeni mesaj: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Sunucu URL'i:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} odasına hoşgeldiniz!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanacaktır
  if (typeof serverUrl !== 'string') {
    throw Error(`serverUrl'in bir string olması bekleniyordu. Alınan: ` + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error(`roomId'nin bir string olması bekleniyordu. Alınan: ` + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ ' + serverUrl + `'deki ` + roomId + ' odasına bağlanılıyor...')
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('acayip komik');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ ' + serverUrl + `'deki ` + roomId + ' odasından ayrılındı')
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('İki kez yönetici eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Sadece "message" olayı destekleniyor.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`serverUrl` ya da `roomId`'yi değiştirdiğinizde, Efekt [değişikliklerinize "tepki verir"](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) ve yeniden senkronize olur. Konsol mesajlarından, Efekt'in bağlı olduğu değerleri her değiştirdiğinizde sohbetin yeniden bağlandığını görebilirsiniz.

Şimdi Efekt'in kodunu özel bir Hook'a taşıyın:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Yeni mesaj: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Bu `ChatRoom` bileşeninizin özel Hook'unuzun içinde nasıl çalıştığıyla ilgilenmeden onu çağırmasına olanak sağlar:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Sunucu URL'i:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} odasına hoşgeldiniz!</h1>
    </>
  );
}
```

Bu çok daha basit görünüyor! (Ama aynı şeyi yapıyor.)

Mantığın prop ve state değişikliklerine *hala tepki verdiğine* dikkat edin. Sunucu URL'sini veya seçilen odayı düzenlemeyi deneyin:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçiniz:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Sunucu URL'i:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} odasına hoşgeldiniz!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Yeni mesaj: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanacaktır
  if (typeof serverUrl !== 'string') {
    throw Error(`serverUrl'in bir string olması bekleniyordu. Alınan: ` + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error(`roomId'nin bir string olması bekleniyordu. Alınan: ` + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ ' + serverUrl + `'deki ` + roomId + ' odasına bağlanılıyor...')
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('acayip komik');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ ' + serverUrl + `'deki ` + roomId + ' odasından ayrılındı')
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('İki kez yönetici eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Sadece "message" olayı destekleniyor.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bir Hook'un dönüş değerini alıp:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

ve onu başka bir Hook'a girdi olarak vermek:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

`ChatRoom` bileşeniniz her yeniden render edildiğinde, `roomId` ve `serverUrl`'in son hallerini Hook'unuza verir. Bu, bir yeniden render'dan sonra değerleri her değiştikten sonra Efekt'inizin sohbete yeniden bağlanmasının nedenidir. (Eğer önceden ses ya da video işleme yazılımı ile uğraştıysanız, Hook'ları bu şekilde zincirlemek size görsel ya da ses Efektlerini zincirlemeyi hatırlatabilir. Adeta `useState`'in çıktısı `useChatRoom`'un girdisine "besleniyor" gibi.)

### Olay yöneticilerini özel Hook'lara geçirme {/*passing-event-handlers-to-custom-hooks*/}

`useChatRoom`'u daha fazla component içinde kullanmaya başladığında, component'ların bu hook'un davranışını özelleştirmesine izin vermek isteyebilirsin. Örneğin, şu anda bir mesaj geldiğinde ne yapılacağına dair mantık Hook içinde sabit (hardcoded) durumda:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Yeni mesaj: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Diyelim ki bu mantığı bileşeninize geri taşımak istiyorsunuz:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Yeni mesaj: ' + msg);
    }
  });
  // ...
```

Bunun çalışmasını sağlamak için, özel Hook'unuzu adlandırılmış seçeneklerinden biri olarak `onReceiveMessage`'ı alacak şekilde değiştirin:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Tüm bağımlılıklar bildirildi
}
```

Bu çalışacaktır, ancak özel Hook'unuz olay yöneticilerini kabul ediyorsa yapabileceğiniz bir geliştirme daha var.

`onReceiveMessage`'a bir bağımlılık eklemek ideal değildir çünkü bileşen her yeniden render edildiğinde sohbetin yeniden bağlanmasına neden olacaktır. [Bu olay yöneticisini bağımlılıklardan çıkartmak için bir Efekt Olayı'na sarın:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Tüm bağımlılıklar bildirildi
}
```

Şimdi sohbet, `ChatRoom` bileşeni her yeniden render edildiğinde yeniden bağlanmayacaktır. Burada özel bir Hook'a bir olay yöneticisi iletmekle ilgili oynayabileceğiniz tamamen çalışan bir demo var:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçiniz:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Yeni mesaj: ' + msg);
    }
  });

  return (
    <>
      <label>
        Sunucu URL'i:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} odasına hoşgeldiniz!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error(`serverUrl'in bir string olması bekleniyordu. Alınan: ` + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error(`roomId'nin bir string olması bekleniyordu. Alınan: ` + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅' + serverUrl + `'deki ` + roomId + ' odasına bağlanılıyor...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('acayip komik');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ ' + serverUrl + `'deki ` + roomId + ' odasından ayrılındı')
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('İki kez yönetici eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Sadece "message" olayı destekleniyor.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`useChatRoom`'un nasıl çalıştığını artık bilmenize gerek olmadığını farkedin. Onu herhangi bir başka bileşene ekleyebilir, herhangi başka seçenekler iletebilirsiniz, aynı şekilde çalışacaktır. Bu özel Hook'ların gücüdür.

## Özel Hook'lar ne zaman kullanılmalıdır {/*when-to-use-custom-hooks*/}

Her ufak tekrarlanan kod parçası için bir özel Hook çıkarmanıza gerek yok. Bazı tekrarlanmalar sorun değildir. Örneğin, yukarıdaki gibi tek bir `useState` çağrısını saran bir `useFormInput` Hook'u çıkartmak muhtemelen gereksizdir.

Ancak, her Efekt yazdığınızda, onu özel bir Hook'a sarmanın daha net olup olmayacağını düşünün. [Efekt'lere çok sık ihtiyacınız olmamalı](/learn/you-might-not-need-an-effect) yani eğer bir Efekt yazıyorsanız, bu "React'ten dışarı çıkmak" ve bazı harici sistemlerle senkronize olmanız ya da React'in dahili bir API'sinin sağlamadığı bir şeyi yapmanız gerektiği anlamına gelir. Onu özel bir Hook'a sararak, niyetinizi ve verinin onun içinden nasıl aktığına dair bilgiyi net bir şekilde iletebilirsiniz.

Örneğin, iki açılır menü bileşenini gösteren bir `ShippingForm` bileşenini ele alın: birisi şehirlerin listesini, diğeri seçilen şehirdeki alanların listesini göstersin. Şöyle bir kodla başlayabilirsiniz:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Bu Efekt bir ülke için şehirleri çeker
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Bu Efekt seçilen şehir için alanları çeker
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Bu kod biraz tekrarlayıcı olsa da, [bu Efekt'leri birbirinden ayrı tutmak doğrudur.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) İki farklı şeyi senkronize ediyorlar, bu yüzden onları tek bir Efekt'e birleştirmemelisiniz. Bunun yerine, yukarıdaki `ShippingForm` bileşenini aralarındaki ortak mantığı kendi `useData` Hook'unuza çıkartarak basitleştirebilirsiniz:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Şimdi `ShippingForm` içindeki her iki Efekt'i de `useData`'nın çağrılarıyla değiştirebilirsiniz:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Bir özel Hook çıkarmak veri akışını aşikâr hale getirir. `url`'i içeri beslersiniz ve `data`'yı dışarı alırsınız. Efekt'inizi `useData`'nın içine "gizleyerek", `ShippingForm` bileşeninde çalışan birinin ona [gereksiz bağımlılıklar](/learn/removing-effect-dependencies) eklemesini de engellersiniz. Zamanla, uygulamanızın çoğu Efekti özel Hook'larda olacaktır.

<DeepDive>

#### Özel Hook'larınızı somut yüksek seviyeli kullanım durumlarına odaklı tutun {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Özel Hook'unuzun adını seçerek başlayın. Eğer net bir isim seçmekte zorlanıyorsanız, bu Efek'inizin bileşeninizin geri kalan mantığına çok bağlı olduğu ve henüz çıkartılmaya hazır olmadığı anlamına gelebilir.

İdeal olarak, özel Hook'unuzun adı kod yazmayan bir kişinin bile ne yaptığını, ne aldığını ve ne döndürdüğünü tahmin edebileceği kadar açık olmalıdır:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Dış bir sistemle senkronize olduğunuzda, özel Hook adınız daha teknik olabilir ve o sisteme özel jargon kullanabilir. Bu, o sisteme aşina bir kişi için açık olduğu sürece sorun değildir:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Özel Hook'ların somut üst düzey kullanım durumlarına odaklanmasını sağlayın.** UseEffect` API'sinin kendisi için alternatif ve kolaylık sağlayan sarmalayıcılar olarak hareket eden özel “yaşam döngüsü” Hook'ları oluşturmaktan ve kullanmaktan kaçının:

**Özel Hook'larınızı somut yüksek seviyeli kullanım durumlarına odaklı tutun.** `useEffect` API'sinin kendisi için alternatifler ve kolaylık sarıcıları olan özel "lifecycle" Hook'ları oluşturmayın ve kullanmayın:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Örneğin, bu `useMount` Hook'u bazı kodun sadece "mount" sırasında çalışmasını sağlamaya çalışır:

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Kaçının: özel "lifecycle" Hook'ları kullanmak
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Kaçının: özel "lifecycle" Hook'ları oluşturmak
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook'u useEffect'in bir bağımlılığı eksik: 'fn'
}
```

**`useMount` gibi özel "lifecycle" Hook'ları React paradigmasına pek iyi uymaz.** Örneğin, bu kod örneğinde bir hata var (`roomId` ya da `serverUrl`'deki değişikliklere "tepki" vermiyor), ama linter sizi bunun hakkında uyarmayacaktır, çünkü linter sadece doğrudan `useEffect` çağrılarını kontrol eder. Hook'unuz hakkında bilgisi olmayacaktır.

Eğer bir Efekt yazıyorsanız, React API'sini doğrudan kullanarak başlayın:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ İyi: amaçlarına göre ayrılmış iki saf Efekt

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Sonra, farklı yüksek seviyeli kullanım durumları için özel Hook'lar çıkartabilirsiniz (ama çıkartmak zorunda değilsiniz):

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ İyi: amaçlarına göre adlandırılmış özel Hook'lar
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**İyi bir özel Hook çağıran kodun ne yaptığını sınırlandırarak daha bildirimsel bir hale getirir.** Örneğin, `useChatRoom(options)` sadece sohbet odasına bağlanabilirken, `useImpressionLog(eventName, extraData)` analitiklere bir izlenim kaydı gönderebilir. Eğer özel Hook API'nız kullanım durumlarını sınırlandırmıyorsa ve çok soyutsa, uzun vadede çözdüğünden daha fazla sorun yaratabilir.

</DeepDive>

### Özel Hook'lar daha iyi kalıplara geçiş yapmanıza yardımcı olur {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Efekt'ler bir ["kaçış yolu"](/learn/escape-hatches)'dur: Efekt'leri "React'ten dışarı çıkmak" zorunda kaldığınızda ve daha iyi bir yerleşik çözüm olmadığında kullanırsınız. Zamanla, React ekibinin amacı daha spesifik problemlere daha spesifik çözümler sağlayarak uygulamanızdaki Efekt'lerin sayısını minimuma indirmektir. Efekt'lerinizi özel Hook'larla sarmak, bu çözümler mevcut olduğunda kodunuzu güncellemeyi kolaylaştırır.

Şu örneğe geri dönelim:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı kopuk'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Tekrar bağlanılıyor...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Yukarıdaki örnekte, `useOnlineStatus`, [`useState`](/reference/react/useState) ve [`useEffect`.](/reference/react/useEffect) ikilisi kullanılarak oluşturulmuştur. Ancak, bu en iyi muhtemel çözüm değildir. Dikkate alınmayan birçok uç senaryo vardır. Örneğin, bileşen DOM'a eklendiğinde, `isOnline`'ın halihazırda `true` olacağını varsayar, ancak ağ halihazırda çevrimdışı olduğunda bu yanlış olabilir. Bu durumu kontrol etmek için tarayıcının [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API'sini kullanabilirsiniz, ancak bunu doğrudan kullanmak ilk HTML'i sunucuda oluşturmak için çalışmayacaktır. Kısacası, bu kod geliştirilebilir.

React, tüm bu sorunları sizin için çözen özel bir API olan [`useSyncExternalStore`](/reference/react/useSyncExternalStore) adlı bir yapı sunar. İşte bu yeni API'den faydalanacak şekilde yeniden yazılmış `useOnlineStatus` Hook'u:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı Kopuk'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ İlerleme kaydedildi');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'İlerlemeyi kaydet' : 'Tekrar bağlanılıyor...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // İstemci tarafında değerin ne olacağı
    () => true // Sunucu tarafında değerin ne olacağı
  );
}

```

</Sandpack>

Bu değişikliği yapmak için **herhangi bir bileşeni değiştirmeye ihtiyacınız olmadığını** farkedin:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Efektleri özel hook'lara sarmanın genellikle faydalı olmasının başka bir nedeni budur:

1. Efektlerinizin içine ve Efekt'lerinizden dışarı akan veriyi oldukça belirgin hale getirirsiniz.
2. Bileşenlerinizin, Efektlerinizin nasıl çalıştığından ziyade ne yapmak istediğine odaklanmasını sağlarsınız.
3. React yeni özellikler eklediğinde, bu Efekt'leri bileşenlerinizde herhangi bir değişiklik yapmadan kaldırabilirsiniz.

Bir [tasarım sistemine](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) benzer olarak, uygulamanızdaki bileşenlerde bulunan ortak kalıpları özel hook'lara çıkartmaya başlamayı faydalı bulabilirsiniz. Bu, bileşenlerinizin kodunu niyete odaklı tutar ve sık sık ham Efektler yazmaktan kaçınmanızı sağlar. Pek çok muazzam özel hook'lar React topluluğu tarafından sürdürülmektedir.

<DeepDive>

#### React veri getirme için herhangi bir yerleşik çözüm sağlayacak mı? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Bugün, [`use`](/reference/react/use#streaming-data-from-server-to-client) API’si ile, bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `use`’a geçirilerek render sırasında veri okunabilir:

```js {1,4,11}
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

We're still working out the details, but we expect that in the future, you'll write data fetching like this:

```js {1,4,6}
import { use } from 'react';

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Eğer `useData` gibi özel hookları uygulamanızda kullanıyorsanız, neticede önerilen yaklaşıma geçiş yapmak için her bileşende manuel olarak ham Efektler yazılan bir yaklaşıma göre daha az değişiklik gerekecektir. Ancak, eski yaklaşım hala sorunsuz çalışacaktır, yani ham Efektler yazmaktan mutluysanız, bunu yapmaya devam edebilirsiniz.

</DeepDive>

### Yapmanın birden fazla yolu vardır {/*there-is-more-than-one-way-to-do-it*/}

Diyelim ki tarayıcı [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API'sini kullanarak *sıfırdan* bir fade-in animasyonu yapmak istiyorsunuz. Bir animasyon döngüsü kuracak bir Efekt ile başlayabilirsiniz. Animasyonun her bir karesinde, bir [ref'te](/learn/manipulating-the-dom-with-refs) tuttuğunuz DOM node'unun opaklığını `1` olana kadar değiştirebilirsiniz. Kodunuz şöyle başlayabilir:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Hala boyama yapılacak kare var
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Hoşgeldiniz
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Bileşeni daha okunabilir yapmak adına, mantığı `useFadeIn` adında özel bir Hook'a çıkarabilirsiniz:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Hoşgeldiniz
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

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Hala boyama yapılacak kare var
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

`useFadeIn` kodunu olduğu gibi bırakabilirsiniz, ancak daha fazla refaktör yapabilirsiniz. Örneğin, animasyon döngüsünü kurma mantığını `useFadeIn`'den çıkarıp özel bir `useAnimationLoop` Hook'a çıkarabilirsiniz:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Hoşgeldiniz
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Ancak, bunu yapmak *zorunda* değilsiniz. Normal fonksiyonlarda olduğu gibi, kodunuzun farklı bölümleri arasındaki sınırların nerede çizileceğine nihayetinde siz karar verirsiniz.. Çok farklı bir yaklaşım da benimseyebilirsiniz. Mantığı Efekt içinde tutmak yerine, zorunlu mantığın çoğunu bir JavaScript [sınıf:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) içine taşıyabilirsiniz.

Ancak, bunu yapmak *zorunda* değildiniz. Normal fonksiyonlarda olduğu gibi, sonuçta kodunuzun farklı parçaları arasındaki sınırları nerede çizeceğinize siz karar verirsiniz. Çok farklı bir yaklaşım da seçebilirsiniz. Mantığı Efekt'te tutmak yerine, mantığın büyük bir kısmını bir JavaScript [sınıfına](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) taşıyabilirsiniz:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Hoşgeldiniz
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // Hala boyama yapılacak kare var
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Efekt'ler, React'i dış sistemlere bağlamanıza olanak tanır. Daha fazla Efekt koordinasyonu gerektiğinde (örneğin, birden fazla animasyonu zincirlemek için), yukarıdaki örnekte olduğu gibi mantığı Efekt'lerden ve Hook'lardan *tamamen* çıkarmanız daha mantıklı hale gelir. Ardından, çıkarttığınız kod "dış sistem" *haline gelir*. Bu, Efekt'lerinizin sade kalmasını sağlar çünkü sadece React dışına taşıdığınız sisteme mesaj göndermeleri gerekir.

Yukarıdaki örnekler fade-in mantığının JavaScript'te yapılması gerektiğini varsayar. Ancak, bu özel fade-in animasyonunu düz [CSS Animasyonu](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) ile uygulamak hem daha basit hem de çok daha verimlidir:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Hoşgeldiniz
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

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Bazen, bir Hook'a bile ihtiyacınız olmayabilir!

<Recap>

- Özel Hook'lar, bileşenler arasında mantığı paylaşmanıza olanak tanır.
- Özel Hook'ların isimleri `use` ile başlamalı ve bir büyük harfle devam etmelidir.
- Özel Hook'lar sadece state'li mantığı paylaşır, state'in kendisini değil.
- Reaktif değerleri bir Hook'tan diğerine paslayabilirsiniz ve bunlar güncel kalırlar.
- Tüm Hook'lar, bileşeniniz yeniden renderlandığında her zaman yeniden çalışır.
- Özel Hook'larınızın kodu, bileşeninizin kodu gibi saf olmalıdır.
- Özel Hook'lar tarafından alınan olay yöneticilerini Efekt olaylarına sarın.
- `useMount` gibi özel Hook'lar oluşturmayın. Amaçlarınızı belirli tutun.
- Kodunuzun sınırlarını nasıl ve nerede çizeceğinize siz karar verirsiniz.

</Recap>

<Challenges>

#### Bir `useCounter` Hook'u çıkarın {/*extract-a-usecounter-hook*/}

Bu bileşen bir state değişkeni ve bir Efekt kullanarak her saniye artan bir sayıyı görüntüler. Bu mantığı `useCounter` adında özel bir Hook'a çıkarın. Amacınız `Counter` bileşeninin uygulamasını tam olarak aşağıdaki gibi yapmak olmalıdır:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Geçen saniyeler: {count}</h1>;
}
```

Özel Hook'unuzu `useCounter.js`'e yazmanız ve onu `App.js` dosyasına aktarmanız gerekecek.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Geçen saniyeler: {count}</h1>;
}
```

```js src/useCounter.js
// Özel Hook'unuzu bu dosyaya yazın!
```

</Sandpack>

<Solution>

Kodunuz şu şekilde gözükmelidir:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Geçen saniyeler: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Farkındaysanız, `App.js` artık `useState` veya `useEffect`'i içe aktarmaya ihtiyaç duymuyor.

</Solution>

#### Geri sayım gecikmesini yapılandırılabilir hale getirin {/*make-the-counter-delay-configurable*/}

Bu örnekte, bir slider tarafından kontrol edilen bir `delay` state değişkeni var, ancak değeri kullanılmıyor. Özel `useCounter` Hook'unuza `delay` değerini iletin ve `useCounter` Hook'unuzu sabit `1000` ms yerine iletilen `delay`'i kullanacak şekilde değiştirin.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tiktak süresi: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Tiktaklar: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Hook'unuza `useCounter(delay)` ile `delay` değerini aktarın. Ardından, Hook'un içinde, sabit kodlanmış `1000` değeri yerine `delay` kullanın. Efektinizin bağımlılıklarına `delay` eklemeniz gerekir. Bu, `delay` değerindeki bir değişikliğin aralığı sıfırlamasını sağlar.

`delay`'i `useCounter(delay)` ile Hook'unuza iletin. Ardından, Hook'un içinde, `1000` sabit değeri yerine `delay`'i kullanın. Efektinizin bağımlılıklarına `delay`'i eklemeniz gerekecek. Bu, `delay`'de meydana gelen bir değişikliğin interval'i sıfırlamasını sağlar.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tiktak süresi: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Tiktaklar: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### `useInterval`'i `useCounter`'dan çıkarın {/*extract-useinterval-out-of-usecounter*/}

Şu an, `useCounter` Hook'unuz iki şey yapıyor, bir interval kuruyor ve aynı zamanda her interval tikinde bir state değişkenini artırıyor. Interval'i kuran mantığı `useInterval` adında ayrı bir Hook'a ayırın. Bu Hook, iki argüman almalıdır: `onTick` callback'i ve `delay`. Bu değişiklikten sonra, `useCounter` uygulamanız şu şekilde olmalıdır:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval`'i `useInterval.js` dosyasının içine yazın ve onu `useCounter.js` dosyasında içe aktarın.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Geçen saniyeler: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Hook'unuzu bu dosyaya yazın!
```

</Sandpack>

<Solution>

`useInterval` içindeki mantık, interval'i kurmalı ve temizlemelidir. Başka bir şey yapmasına gerek yoktur.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Geçen saniyeler: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Bu çözümde biraz bir sorun olduğuna dikkat edin, bunu bir sonraki bölümde çözeceksiniz.

</Solution>

#### Interval'i sıfırlamayı çözün {/*fix-a-resetting-interval*/}

Bu örnekte, *iki* ayrı interval var.

`App` bileşeni `useCounter`'ı çağırıyor, o da sayacı her saniye arttırmak için `useInterval`'i çağırıyor. Ama `App` bileşeni *aynı zamanda* her iki saniyede bir sayfa arka plan rengini rastgele güncellemek için de `useInterval`'i çağırıyor.

For some reason, the callback that updates the page background never runs. Add some logs inside `useInterval`:

Bir sebepten ötürü, sayfa arka planını güncelleyen callback hiç çalışmıyor. `useInterval` içerisine bazı loglar ekleyin:

```js {2,5}
  useEffect(() => {
    console.log('✅ Delayli bir interval kuruluyor ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Delayli bir interval temizleniyor ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Log'lar olacağını düşündüğünüz şeyle uyuşuyor mu? Eğer bazı Efekt'leriniz gereksiz yere yeniden senkronize oluyorsa, bunun hangi bağımlılıktan dolayı olduğunu tahmin edebilir misiniz? Efekt'inizden [bu bağımlılığı kaldırabileceğiniz](/learn/removing-effect-dependencies) bir yol var mı?

Bu sorunu çözdükten sonra, sayfa arka planının her iki saniyede bir güncellendiğini görmelisiniz.

<Hint>

Görünen o ki `useInterval` Hook'unuz argüman olarak bir olay dinleyicisi alıyor. Bu olay dinleyicisini Efekt'iniz için bir bağımlılık olmaya ihtiyaç duymadan nasıl sarabileceğinizi düşünebilir misiniz?

</Hint>

<Sandpack>

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Geçen saniyeler: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

`useInterval`'in içerisinde, tik callback'ini bir Efekt olayına [bu sayfada daha önce yaptığınız gibi](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks) sarın

Bu sizin `onTick`'i Efekt'iniz için bir bağımlılık olmaktan çıkarmanıza olanak tanır. Efekt, bileşeniniz her yeniden render edildiğinde tekrar senkronize olmayacak, böylece sayfa arka plan rengi değişim interval'i her saniye çalışmaya şans bulamadan sıfırlanmamış olacak.

Bu değişiklikle birlikte, her iki interval de beklediğiniz gibi çalışır ve birbirleriyle etkileşime girmezler:

<Sandpack>


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Gecikmelendirilmiş bir hareketi uygulayın {/*implement-a-staggered-movement*/}

Bu örnekte, `usePointerPosition()` Hook'u mevcut imleç konumunu takip eder. İmlecinizi veya parmağınızı önizleme alanı üzerinde hareket ettirmeyi deneyin ve kırmızı noktanın hareketinizi takip ettiğini görün. Noktanın konumu `pos1` değişkeninde saklanır.

Aslında, render edilen beş (!) farklı kırmızı nokta var. Onları görmüyorsunuz çünkü şu anda hepsi aynı konumda görünüyor. Bu sorunu çözmeniz gerekiyor. Bunun yerine uygulamak istediğiniz şey "gecikmeli" bir hareket: her nokta bir önceki noktanın yolunu "takip" etmeli. Örneğin hızlıca imlecinizi hareket ettirirseniz, ilk nokta onu hemen takip etmeli, ikinci nokta ilk noktayı küçük bir gecikme ile takip etmeli, üçüncü nokta ikinci noktayı takip etmeli ve böyle devam etmeli.

`useDelayedValue` özel Hook'unu yazmanız gerekiyor. Mevcut uygulama, ona sağlanan `value`'yu döndürmekte. Bunun yerine, `delay` kadar milisaniye önceki değeri döndürmek istemektesiniz. Bu işlemi yapmak için biraz state ve bir Efekt'e ihtiyacınız olabilir.

`useDelayedValue`'u yazdıktan sonra, noktaların birbirlerini takip ettiğini görmelisiniz.

<Hint>

`delayedValue`'yu bir özel Hook'unuzun içinde bir state değişkeni olarak saklamanız gerekmekte. `value` değiştiğinde, bir Efekt çalıştırmak isteyeceksiniz. Bu Efekt, `delay`'den sonra `delayedValue`'yu güncellemelidir. `setTimeout`'u çağırmak size yardımcı olabilir.

Bu Efekt'in temizleme fonksiyonuna ihtiyacı var mı? Varsa neden, yoksa neden?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Bu Hook'u yazın
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Burada çalışan bir versiyonu var. `delayedValue`'yu bir state değişkeni olarak saklıyorsunuz. `value` güncellendiğinde, Efekt'iniz `delayedValue`'yu güncellemek için bir timeout planlar. Bu yüzden `delayedValue` her zaman gerçek `value`'dan "geride kalır".

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Bu Efekt'in temizleme fonksiyonuna ihtiyacı *olmadığını* unutmayın. Eğer cleanup fonksiyonunda `clearTimeout`'u çağırdıysanız, o zaman her `value` değiştiğinde, zaten planlanmış olan timeout'u sıfırlar.  Hareketi sürekli tutmak için, tüm timeout'ların çalışmasını istersiniz.

</Solution>

</Challenges>