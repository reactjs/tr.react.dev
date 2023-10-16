---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore`, harici veri depolarına (store) abone olmanızı sağlayan React Hook'udur.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

- Store nasıl çevrilecek?

## Referans {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Harici veri deposundan değer okumak için bileşeninizin en üst kapsamında `useSyncExternalStore`'u çağırın.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Depodaki verinin anlık görüntüsünü döndürür. Argüman olarak iki fonksiyon geçmeniz gerekir:

1. `subscribe` fonksiyonu, depoya (data store) abone olmalı (subscribe) ve abonelikten çıkmak için fonksiyon döndürmelidir.
2. `getSnapshot` fonksiyonu, depodaki verinin anlık görüntüsünü okumalıdır.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `subscribe`: Bir `callback` argümanı alan ve depoya abone olan fonksiyondur. Depo değiştiğinde, iletilen `callback` çalıştırılır. Bu, bileşenin yeniden render edilmesine neden olur. `subscribe` fonksiyonu, aboneliği temizleyen bir fonksiyon döndürmelidir.

* `getSnapshot`: Bileşenin ihtiyaç duyduğu depodaki verilerin anlık görüntüsünü döndüren fonksiyondur. Veri deposu değişmemişse, `getSnapshot`'a yapılan çağrılar aynı değeri döndürmelidir. Depo değişirse ve döndürülen değer farklıysa ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırıldığında), bileşen yeniden render edilir.

* **isteğe bağlı** `getServerSnapshot`: Depodaki verilerin başlangıçtaki anlık görüntüsünü döndüren fonksiyondur. Yalnızca sunucu taraflı render ya da istemcide render edilmiş çıktının hidratlanması sırasında çalıştırılır. Serileştirilerek sunucudan istemciye iletilen sunucu anlık görüntüsü, istemci ile aynı olmalıdır. Bu argümanı iletirseniz, bileşen sunucu tarafında render edilirken hata fırlatır.

#### Dönüş değeri {/*returns*/}

Render mantığınızda kullanabileceğiniz deponun o anki anlık görüntüsüdür.

#### Dikkat edilmesi gerekenler {/*caveats*/}

* `getSnapshot` tarafından döndürülen depo anlık görüntüsü değiştirilemez (immutable) olmalıdır. Depoda değiştirilebilir veri varsa veriler değiştiğinde yeni bir anlık görüntü döndürün. Aksi takdirde, önbelleğe alınmış en son anlık görüntüyü döndürün.

* Yeniden render esnasında farklı bir `subscribe` fonksiyonu geçildiğinde React, yeni geçilen `subscribe` fonksiyonu ile depoya yeniden abone olur. `subscribe`'ı bileşenin dışında tanımlayarak bunu önleyebilirsiniz.

* If the store is mutated during a [non-blocking transition update](/reference/react/useTransition), React will fall back to performing that update as blocking. Specifically, React will call `getSnapshot` a second time just before applying changes to the DOM. If it returns a different value than when it was called originally, React will restart the transition update from scratch, this time applying it as a blocking update, to ensure that every component on screen is reflecting the same version of the store.

* It's not recommended to _suspend_ a render based on a store value returned by `useSyncExternalStore`. The reason is that mutations to the external store cannot be [marked as non-blocking transition updates](/reference/react/useTransition), so they will trigger the nearest [`Suspense` fallback](/reference/react/Suspense), replacing already-rendered content on screen with a loading spinner, which typically makes a poor UX.

  For example, the following are discouraged:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Kullanım {/*usage*/}

### Harici depoya abone olma {/*subscribing-to-an-external-store*/}

React bileşenlerinizin çoğu veriyi yalnızca [prop](/learn/passing-props-to-a-component), [state](/reference/react/useState) ve [context](/reference/react/useContext)'den okur. Ancak bileşenler, bazı verileri React dışındaki bir depodan (store) okuma ihtiyacı duyabilir. Aşağıdaki durumlar buna örnektir:

* React dışında state tutan üçüncü parti state yönetim kütüphaneleri.
* Değiştirebilir değer ve değişikliklere abone olmak için olaylar (event) sunan tarayıcı API'leri.

Harici veri deposundan bir değer okumak için bileşeninizin en üst kapsamında `useSyncExternalStore`'u çağırın.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Veri deposundaki verilerin <CodeStep step={3}>anlık görüntüsünü</CodeStep> döndürür. Argüman olarak iki fonksiyon geçmeniz gerekir:

1. <CodeStep step={1}>`subscribe` fonksiyonu</CodeStep>, depoya abone olmalı ve aboneliği sonlandıran fonksiyon döndürmelidir.
2. <CodeStep step={2}>`getSnapshot` fonksiyonu</CodeStep>, depodan veriyi anlık görüntüsünü okumalıdır.

React, bu fonksiyonları kullanarak bileşeninizi depoya abone tutar ve değişikliklerde yeniden render eder.

Aşağıdaki örnekte `todosStore`, React'ın dışında veri tutan harici bir depo olacak şekilde implemente edilmiştir. `TodosApp` bileşeni `useSyncExternalStore` Hook'u ile harici depo ile bağlantı kurar. 

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Yapılacak iş ekle</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js todoStore.js
// Bu dosya, React ile entegre etmeniz gerekebilecek
// üçüncü taraf bir depo örneğidir.

// Uygulamanızın tamamı React ile oluşturulduysa,
// React state'i kullanmanızı öneririz.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Yapılacak iş #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Yapılacak iş #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Mümkün mertebe [`useState`](/reference/react/useState) ve [`useReducer`](/reference/react/useReducer) aracılığıyla yerleşik React state'ini kullanmanızı öneririz. `useSyncExternalStore` API'si, bileşenlerinizi React olmayan kodlarınızla entegre etmeniz gerektiğinde kullanışlıdır.

</Note>

---

### Tarayıcı API'sine abone olma {/*subscribing-to-a-browser-api*/}

`useSyncExternalStore` kullanmak için başka bir neden, tarayıcı tarafından sunulan ve zamanla değişen değerlere abone olmaktır. Örneğin, bileşeninizde ağ bağlantısının etkin olup olmadığını göstermek istiyorsunuzdur. Tarayıcı, bu bilgiyi [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) özelliği aracılığıyla sunar.

Bu değer React'ın bilgisi dışında değişebilir ve bu sebeple `useSyncExternalStore` ile okumanız gerekir.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`getSnapshot` fonksiyonunu implemente etmek için tarayıcı API'sinden geçerli değeri okuyun:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Ardından, `subscribe` fonksiyonunu implemente etmeniz gerekir. Örneğin, `navigator.onLine` değiştiğinde `window` nesnesi üzerinden [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) ve [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) olayları tetiklenir. `callback` argümanıyla bu olaylara abone olmanız ve abonelikleri temizleyen bir fonksiyon döndürmeniz gerekir.

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Artık React, harici `navigator.onLine` API'sinin değerini nasıl okuyacağını ve değişikliklere nasıl abone olacağını bilir. Cihazınızın ağ bağlantısı kesin ve bileşenin buna karşılık yeniden render'ı tetiklediğine dikkat edin:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı kesildi'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
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

---

### Mantığı özel bir hook'a çıkarma {/*extracting-the-logic-to-a-custom-hook*/}

Usually you won't write `useSyncExternalStore` directly in your components. Instead, you'll typically call it from your own custom Hook. This lets you use the same external store from different components.

For example, this custom `useOnlineStatus` Hook tracks whether the network is online:

Genellikle `useSyncExternalStore`'u bileşenlerinizde doğrudan kullanmazsınız. Bunun yerine kendi özel Hook'unuzda çağırırsınız. 
Böylece aynı harici depoyu farklı bileşenlerden de kullanabilirsiniz.

Örneğin, örnekteki özel `useOnlineStatus` Hook'u ağın çevrimiçi olup olmadığını takip eder:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Artık farklı bileşenler, implementasyonu sürekli tekrarlamadan `useOnlineStatus` çağırabilir:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Çevrimiçi' : '❌ Bağlantı kesildi'}</h1>;
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

```js useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
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

---

### Sunucu taraflı render desteği ekleme {/*adding-support-for-server-rendering*/}

React uygulamanız [sunucu taraflı render'lama](/reference/react-dom/server) kullanıyorsa, React bileşenleriniz başlangıç HTML'ini üretmek için tarayıcı ortamının dışında da çalışacaktır. Bu durum, harici depoya bağlanırken bazı zorlukları beraberinde getirir:

- Yalnızca tarayıcıda bulunan bir API'ye bağlanıyorsanız, çalışmayacaktır çünkü sunucuda mevcut değildir.
- Üçüncü taraf bir veri deposuna bağlanıyorsanız, sunucu ve istemci arasında verilerin eşleşmesi gerekmektedir.


Bu sorunları çözmek için, `useSyncExternalStore`'a üçüncü argüman olarak `getServerSnapshot` fonksiyonunu iletin:


```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Sunucu tarafında oluşturulan HTML için her zaman "Online" gösterir
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot` fonksiyonu `getSnapshot`'a benzer ancak yalnızca iki durumda çalışır:

- HTML oluşturulurken sunucuda çalışır.
- React'ın sunucu HTML'ini alıp etkileşimli haline getirirken yani [hidratlama](/reference/react-dom/client/hydrateRoot) yaparken istemcide çalışır.

Bu durum, uygulama etkileşimli hale gelmeden önce kullanılacak olan başlangıç anlık görüntü değeri vermenizi sağlar. Sunucu taraflı render için anlamlı bir başlangıç değeriniz yoksa, [istemcide render işlemini zorlamak](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content) için bu argümanı atlayın.

<Note>

`getServerSnapshot`'ın istemci tarafındaki ilk render'da sahip olduğu verilerin, sunucudan döndürdüğü verilerle birebir aynı olduğundan emin olun. Örneğin `getServerSnapshot` sunucuda doldurulmuş olarak gelen depo içeriği döndürdüyse, bu içeriği istemciye aktarmanız gerekir. Bunun yapmanın bir yolu, sunucu taraflı render esnasında `window.MY_STORE_DATA` gibi bir global tanımlayan `<script>` etiketi kullanmak ve ardından istemcide `getServerSnapshot` içinden bu global değişkeni okumaktır. Harici deponuz bunu nasıl yapacağınıza ilişkin talimatlar sağlamalıdır.

</Note>

---

## Sorun giderme {/*troubleshooting*/}

### "The result of `getSnapshot` should be cached" hatası alıyorum {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Bu hata, `getSnapshot` fonksiyonunuzun her çağırıldığında yeni bir nesne döndürdüğü anlamına gelir, örneğin:

```js {2-5}
function getSnapshot() {
  // 🔴 getSnapshot'dan her seferinde farklı nesne döndürmeyin
  return {
    todos: myStore.todos
  };
}
```

`getSnapshot` son seferkinden farklı bir değer döndürdüğünde, React bileşeni yeniden render eder. Dolayısıyla her seferinde farklı sonuç döndürdüğünüzde sonsuz döngüye girer ve hata alırsınız.

`getSnapshot` nesneniz yalnızca gerçekten değiştiğinde farklı bir nesne döndürür. Deponuz değişmez (immutable) veri içeriyorsa, bu verileri doğrudan döndürebilirsiniz:

```js {2-3}
function getSnapshot() {
  // ✅ Değişmez verileri döndürebilirsiniz
  return myStore.todos;
}
```

Deponuzdaki veri değişken (mutable) ise `getSnapshot` fonksiyonunuz değişmez anlık görüntüsünü döndürmelidir. Yani her çağrıldığında farklı nesne oluşturması gerektiği anlamına gelir. Bunun yerine, son hesaplanan anlık görüntüyü depolamalı ve depodaki veri değişmediyse bir önceki anlık görüntüyü döndürmelidir. Değişken verilerin değişip değişmediğini nasıl belirleyeceğiniz deponuza bağlıdır.

---

### `subscribe` fonksiyonum her render'dan sonra çağırılıyor {/*my-subscribe-function-gets-called-after-every-re-render*/}

Örnekteki `subscribe` fonksiyonu bileşenin *içinde* tanımlanmıştır ve bu nedenle her render'da farklıdır:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Her zaman farklı fonksiyondur, React her render'da yeniden abone olur
  function subscribe() {
    // ...
  }

  // ...
}
```
Yeniden render'lar arasında farklı bir `subscribe` fonksiyonu iletirseniz, React deponuza yeniden abone olur. Bu durum performans sorunlarına neden oluyorsa ve sürekli abone olmaktan kaçınmak istiyorsanız, `subscribe` fonksiyonunu bileşen dışına taşıyın:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Her zaman aynı fonksiyondur, React yeniden abone olmaz
function subscribe() {
  // ...
}
```

Alternatif olarak, yalnızca bir takım argümanlar değiştiğinde yeniden abone olmak için `subscribe` fonksiyonunu [`useCallback`](/reference/react/useCallback) Hook'una sarın:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ userId değişmediği sürece aynı fonksiyondur
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```
