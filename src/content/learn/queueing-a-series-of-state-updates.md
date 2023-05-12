---
title: Bir Seri State Güncellemesini Kuyruğa Almak
---

<Intro>

Bir state değişkenini değiştirmek, başka bir render'ı kuyruğa alacaktır. Ancak bazen bir sonraki render'ı kuyruğa almadan önce değer üzerinde birden çok işlem gerçekleştirmek isteyebilirsiniz. Bunu yapmakta, React'in batch state güncellemelerini nasıl yaptığını anlamak yardımcı olacaktır.

</Intro>

<YouWillLearn>

* "Batching (Toplu işleme)" ne demektir ve React bunu birden fazla state güncellemesini yapmak için nasıl kullanır
* Aynı state değişkenine art arda birden fazla güncelleme nasıl yapılır

</YouWillLearn>

## React state güncellemesini toplu halde (batching) yapar {/*react-batches-state-updates*/}

"+3" butonuna basmanın sayacı üç defa artıracağını çünkü `setNumber(number + 1)` fonksiyonunu üç kez çağıracağını düşünebilirsiz:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ancak önceki bölümden hatırlayabileceğiniz gibi [her render'ın state değeri sabittir](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), yani `setNumber(1)` fonksiyonunu kaç defa çağırırsanız çağırın ilk render'ın olay yöneticisindeki `number` değeri her zaman `0`'dır:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Ancak göze alınması gereken başka bir faktör daha vardır. **React, state güncellemelerini yapmadan önce olay yönetecilerindeki *tüm* kodun çalışmasını bekler.** Yeniden render etmenin yalnızca tüm `setNumber()` çağrılarından *sonra* gerçekleşmesinin nedeni budur.

Bu size restoranda sipariş alan bir garsonu hatırlatabilir. Garson siparişinizi alırken ilk yemeğinizi söylediğiniz zaman mutfağa koşmaz! Bunun yerine, siparişinizi tamamlamanıza, üzerinde değişiklik yapmanıza izin verirler. Hatta masadaki diğer insanların da siparişini alırlar.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

Bu, [yeniden render'lar](/learn/render-and-commit#re-renders-when-state-updates) tetiklemeden birden çok state değişkenini (birden çok bileşende bile) güncellemenizi sağlar. Ancak bu aynı zamanda, kullanıcı arayüzünün (UI) olay yöneteciniz ve içindeki herhangi bir kod _tamamlanana kadar_ güncellenmeyeceği anlamına gelmektedir. **Batching (toplu halde)** olarak da bilinen bu davranış, React uygulamanızın çok daha hızlı çalışmasını sağlar. Ayrıca React, yalnızca bazı değişkenlerin güncellendiği kafa karıştırıcı "yarı tamamlanmış" render'larla uğraşmaktan da kaçınır.

**React tıklama gibi kasıtlı yapılmış *birden fazla* olayı toplu olarak işlemez** her tıklama ayrı olarak işlenir. React'in bu gruplamayı genel olarak yalnızca güvenli olduğunu düşündüğü durumlarda yaptığından emin olabilirsiniz. Böylelikle örneğin, eğer bir butona tıklamak formu devre dışı bırakıyor ise, butona ikinci defa tıklamak formu tekrar göndermez.

## Bir sonraki render'dan önce aynı state'i birden çok defa güncellemek {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Şimdi vereceğimiz örnek pek alışılmadık bir durumdur ancak aynı state değişkenini bir sonraki render'dan önce birden çok defa güncellemek isterseniz, `setNumber(number + 1)` gibi *sonraki state değerini* iletmek yerine `setNumber(n => n + 1)` gibi bir sonraki state'i kuyruktaki önceki değere göre hesaplayan bir *fonksiyon* iletebilirsiniz. Böylelikle React'e state değerini değiştirmek yerine "state değeri ile bir şey yap" diyebilirsiniz.

Şimdi sayacı tekrar artırmayı deneyin:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Burada, `n => n + 1` ifadesi **güncelleyici fonksiyon** olarak adlandırılır. Bu fonksiyonu bir state setter'a ilettiğiniz zaman:

1. React, bu fonksiyonu olay yöneticisindeki tüm kodlar çalıştıktan sonra işlemek üzere kuyruğa alır.
2. Bir sonraki render esnasında React, kuyruktaki tüm işlemleri yapar ve size güncellenmiş son state'i verir.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

React'in olay yönetecisini yürütürken bu kod satırlarında nasıl çalıştığını aşağıdaki gibi anlatabiliriz:

1. `setNumber(n => n + 1)`: `n => n + 1` ifadesi bir fonksiyondur. React bu ifadeyi kuyruğa alır.
1. `setNumber(n => n + 1)`: `n => n + 1` ifadesi bir fonksiyondur. React bu ifadeyi kuyruğa alır.
1. `setNumber(n => n + 1)`: `n => n + 1` ifadesi bir fonksiyondur. React bu ifadeyi kuyruğa alır.

Sonraki render'da `useState`'i çağırdığınız zaman React, kuyruktaki işlemleri yapar. Önceki `number` state'i `0`'dı, dolayısıyla React bunu `n` argümanı olarak ilk güncelleyici fonksiyona iletir. Ardından, önceki güncelleyici fonksiyonunuzun döndürdüğü değeri alır ve bu değeri bir sonraki güncelleyici fonksiyona `n` olarak iletir ve bu böyle devam eder:

|  kuyruktaki güncelleme | `n` | döndürülen değer |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React `3` değerini son sonuç olarak saklar ve `useState`'den döndürür.

Bu yüzden yukarıdaki örnekte "+3" butonuna tıklamak, değeri doğru şekilde 3 artıracaktır.
### State'i değiştirdikten sonra güncellerseniz ne olur {/*what-happens-if-you-update-state-after-replacing-it*/}

Peki ya olay yöneticisi? `number`'ın değeri sonraki render'da ne olacaktır?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Aşağıda bu olay yönetecisinin React'e ne yapması gerektiğini söylediğini görebilirsiniz:

1. `setNumber(number + 5)`: `number`ın değeri `0`'dır, yani `setNumber(0 + 5)`. React kuyruğa *"`5` ile değiştir"* ifadesini alır.
2. `setNumber(n => n + 1)`: `n => n + 1` ifadesi bir güncelleyici fonksiyondur. React *o fonksiyonu* kuyruğa alır.

Sonraki render esnasında React, state kuyruğundan geçer:

|   kuyruktaki güncelleme       | `n` | döndürülen değer |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React `6` değerini son sonuç olarak saklar ve `useState`'den döndürür.

<Note>

`setState(5)`'in `setState(n => 5)` gibi çalıştığını ancak `n`'in kullanılmadığını fark etmiş olabilirsiniz!

</Note>

### State'i güncelledikten sonra değiştirirseniz ne olur {/*what-happens-if-you-replace-state-after-updating-it*/}

Bir örnek daha deneyelim. Sonraki render'da `number`'ın değeri ne olacaktır?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Bu olay yönetecisi çalışırken React'in kod satırlarında nasıl çalıştığını aşağıda görebilirsiniz:

1. `setNumber(number + 5)`: `number`'ın değeri `0`'dır, yani `setNumber(0 + 5)`. React kuyruğa *"`5` ile değiştir"* ifadesini alır.
2. `setNumber(n => n + 1)`: `n => n + 1` ifadesi bir güncelleyici fonksiyondur. React *o fonksiyonu* kuyruğa alır.
3. `setNumber(42)`: React kuyruğa *"`42` ile değiştir"* ifadesini alır.

Sonraki render esnasında React, state kuyruğundan geçer:

|   kuyruktaki güncelleme       | `n` | döndürülen değer |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "replace with `42`" | `6` (unused) | `42` |

React `42` değerini son sonuç olarak saklar ve `useState`'den döndürür.

Özetlemek gerekirse, state setter olan `setNumber`'a ne ilettiğinizi şu şekilde düşünebilirsiniz:

* **Bir güncelleyici fonksiyon** (örneğin `n => n + 1`) kuyruğa eklenir.
* **Herhangi başka bir değer** (örneğin number `5`) zaten kuyrukta olanları yok sayarak kuyruğa "`5` ile değiştir" ifadesini ekler.

Olay yöneticisi tamamlandıktan sonra, React yeniden bir render tetikleyecektir. Yeniden render esnasında, React kuyruktaki işlemleri yapacaktır. Güncelleyici fonksiyonlar render etme esnasında çalışırlar yani  **güncelleyici fonksiyonlar [saf](/learn/keeping-components-pure)** olmalıdır ve sadece sonucu *döndürmelidirler.* Güncelleyici fonksiyonlar içinde state'i değiştirmeyi ya da başka yan etkiler çalıştırmayın. Strict Mode'da React, hataları bulmanıza yardımcı olmak için her güncelleyici fonksiyonu iki defa çalıştırır (ancak ikinci sonucu göz ardı eder).

### Sık kullanılan adlandırmalar {/*naming-conventions*/}

Güncelleyici fonksiyon değişkenini, karşılık gelen state değişkeninin ilk harfleriyle adlandırmak yaygın olarak kullanılır:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Daha ayrıntılı bir kod yapısını tercih ediyorsanız, başka bir yaygın kural, `setEnabled(enabled => !enabled)` gibi state değişkeni adını ya da `setEnabled(prevEnabled => !prevEnabled)` gibi bir önad kullanmaktır.

<Recap>

* State'i değiştirmek mevcut render'daki değişkeni değiştirmez, yeni bir render talep eder.
* React, olay yönetecileri çalışmayı bitirdikten sonra state güncellemelerini yapar. Bu duruma batching (toplu halde) denir.
* Bir olayda bazı state'leri birden çok defa güncellemek için `setNumber(n => n + 1)` güncelleyici fonksiyonu kullanılır.

</Recap>



<Challenges>

#### Sayaçları düzeltin {/*fix-a-request-counter*/}

Kullanıcının aynı anda bir sanat eseri için birden çok sipariş göndermesine olanak sağlayan bir sanat marketi üzerinde çalışıyorsunuz. Kullanıcı her "Buy (Satın al)" butonuna bastığında, "Pending (Bekleniyor)" sayacı bir artmalıdır. Üç saniye sonra "Pending (Bekleniyor)" sayacı bir azalmalı ve "Completed (Tamamlandı)" sayacı bir artmalıdır.

Ancak "Pending" sayacı çalışması gerektiği gibi çalışmamaktadır. "Buy" butonuna basıldığında, sayaç `-1` olmaktadır (ki bu imkansızdır!). Aynı zamanda butona iki defa hızlıca tıklarsanız, iki sayaç da tahmin edilemeyecek bir şekilde çalışmaktadır.

Sizce bu niye olmakta? İki sayacı da düzeltin.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

`handleClick` olay yöneticisinin içinde, `pending` ve `completed`'in değerleri butona tıklama olayı gerçekleştiği sıradaki değerlere karşılık gelir. İlk render için `pending` değeri `0`'dır, dolayısıyla `setPending(pending - 1)` ifadesi `setPending(-1)` olur, ki hata burdan kaynaklanmaktadır. Sayaçları tıklama sırasında belirlenmiş bir değere eşitlemek yerine, *artırmak* ya da *azaltmak* istediğiniz için, bunun yerine güncelleyici fonksiyonu iletebilirsiniz.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Böylelikle bir sayacı artırdığınızda ya da azalttığınızda, bunu tıklama anındaki state'e göre değilde *en son* state'e göre yapmış olursunuz.

</Solution>

#### State kuyruğunu kendiniz yapın {/*implement-the-state-queue-yourself*/}

Bu örnekte React'in küçük bir bölümünü kendiniz yapacaksınız! Korkmayın sanıldığı kadar zor değil.

Önce sandbox'u bir inceleyin. **Dört test durumu** gösterdiğine dikkat edin. Bu sayfada daha önce gördüğünüz örneklere karşılık gelmektedirler. Sizin göreviniz, her test için doğru sonucu döndürecek şekilde `getFinalState` fonksiyonunu yazmaktır. Eğer bu işlemi doğru yaparsanız, testlerin tamamını geçeceksiniz.

Fonksiyonunuz iki değişken alacaktır: `baseState` başlangıç state'i (`0` gibi), `queue (kuyruk)` farklı sayılar (`5` gibi) ve güncelleyici fonksiyonları (`n => n + 1` gibi) eklenme sıralarına göre içeren bir dizidir.

Göreviniz, bu sayfadaki tablolarda gösterildiği gibi son state'i döndürmektir!

<Hint>

Eğer takılırsanız, aşağıdaki kod yapısıyla başlayabilirsiniz:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Boş satırları doldurun!

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Bu sayfada açıklanan algoritma, React'in son state'i hesaplamak için kullandığı algoritmadır:

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Artık React'in bu işlemi nasıl yaptığını biliyorsunuz!

</Solution>

</Challenges>