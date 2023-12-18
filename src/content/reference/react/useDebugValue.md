---
title: useDebugValue
---

<Intro>

`useDebugValue`, [React Geliştirici Araçları](/learn/react-developer-tools) içindeki özel bir Hook'a etiket eklemenizi sağlayan bir React Hook'udur.

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Okunabilir bir hata ayıklama değeri göstermek için [özel hook](/learn/reusing-logic-with-custom-hooks)'unuzun üst düzeyinde `useDebugValue`'yi çağırın.

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `value`: React Geliştirici Araçları'nda görüntülemek istediğiniz değer. Herhangi bir tip olabilir.
* **isteğe bağlı** `format`: Biçimlendirme fonksiyonu. Bileşen denetlendiğinde, React Geliştirici Araçları, biçimlendirme fonksiyonunu `value` ile birlikte çağırır ve ardından döndürülen biçimlendirilmiş değeri (herhangi bir tipte olabilir) görüntüler. Biçimlendirme fonksiyonunu belirtmezseniz, orijinal `value` kendisi görüntülenir.

#### Dönüş değerleri {/*returns*/}

`useDebugValue` hiçbir değer döndürmez.

## Kullanım {/*usage*/}

### Özel bir Hook'a bir etiket eklemek. {/*adding-a-label-to-a-custom-hook*/}

Özel Hook'un üst düzeyinde `useDebugValue`'yi çağırarak, [React Geliştirici Araçları](/learn/react-developer-tools) için okunabilir bir hata ayıklama değeri gösterin.

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Bu, `useOnlineStatus`'u çağıran bileşenlere denetlendiğinde `OnlineStatus: "Online"` gibi bir etiket verir:

![Hata ayıklama değerini gösteren React DevTools ekran görüntüsü](/images/docs/react-devtools-usedebugvalue.png)

`useDebugValue` çağrısı olmadan, yalnızca temel veriler (bu örnekte `true`) görüntülenirdi.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

Her özel Hook'a hata ayıklama değeri eklemeyin. Paylaşılan kütüphanelerde bulunan ve incelenmesi zor olan karmaşık bir iç veri yapısına sahip olan özel Hook'lar için kullanıldığında daha faydalıdır. 

</Note>

---

### Hata ayıklama değerinin biçimlendirmesini erteleme {/*deferring-formatting-of-a-debug-value*/}

`useDebugValue`'ye ikinci argüman olarak bir biçimlendirme fonksiyonu da geçirebilirsiniz:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Biçimlendirme fonksiyonunuz, hata ayıklama değerini parametre olarak alacak ve biçimlendirilmiş görüntü değerini döndürmelidir. Bileşeniniz denetlendiğinde, React Geliştirici Araçları bu fonksiyonu çağırır ve sonucunu görüntüler.

Bu, bileşen gerçekten denetlenmediği sürece, potansiyel olarak pahalı bir biçimlendirme mantığını çalıştırmaktan kaçınmanızı sağlar. Örneğin, `date` bir Date değeri ise, her render işlemi için `toDateString()` fonksiyonunu çağırmaktan kaçınılabilir.
