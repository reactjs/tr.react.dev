---
title: startTransition
---

<Intro>

`startTransition`, kullanıcı arayüzünü (UI) bloklamadan state'i güncellemenizi sağlar.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

<<<<<<< HEAD
`startTransition`, bir state güncellemesini transition (ertelenen güncelleme) olarak işaretlemenize olanak tanır.
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

<<<<<<< HEAD
* `scope`: Bir veya birden fazla [`set` fonksiyonu](/reference/react/useState#setstate) kullanarak bazı state'leri güncelleyen bir fonksiyondur. React, `scope` fonksiyon çağrısı sırasında eş zamanlı olarak planlanan tüm state güncellemelerini transition olarak işaretler ve herhangi bir parametre olmaksızın `scope`'u hemen çalıştırır. Bu güncellemeler [engelleme yapmaz](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) (non-blocking) ve [gereksiz yükleme animasyonları göstermez](/reference/react/useTransition#preventing-unwanted-loading-indicators).
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e

#### Dönen değerler {/*returns*/}

`startTransition` herhangi bir şey geri döndürmez.

#### Uyarılar {/*caveats*/}

<<<<<<< HEAD
* `startTransition`, bir transition işleminin beklemede olup olmadığını takip etmenin bir yolunu sunmaz. Transition işlemi sırasında ilerleme durumunu göstermek için [`useTransition`](/reference/react/useTransition) kullanmanız gerekir.

* Bir güncellemeyi transition olarak kullanmak için, ilgili state'in `set` fonksiyonuna erişebilmeniz gerekiyor. Eğer bir prop veya özel bir Hook dönüş değerine yanıt olarak transition başlatmak isterseniz, bunun yerine [`useDeferredValue`](/reference/react/useDeferredValue) özelliğini kullanmayı deneyebilirsiniz.

* `startTransition`'a ilettiğiniz fonksiyon, eşzamanlı olarak çalışabilecek bir fonksiyon olmalıdır. React, bu fonksiyonu hemen çalıştırır ve çalışırken gerçekleşen tüm state güncellemelerini transition olarak işaretler. Sonrasında daha fazla state güncellemesi yapmaya çalışırsanız (örneğin, bir zaman aşımında), bunlar transition olarak işaretlenmezler.

* Bir state güncelleme işlemi transition olarak işaretlendiğinde, diğer güncelleme işlemleri bu işlemi kesintiye uğratabilir. Örneğin, bir grafik bileşenini güncelleyen transition işlemi sırasında, grafik bileşeni tekrar render işlemi devam ederken bir giriş alanına yazmaya başlarsanız, React, giriş alanındaki güncellemeyi işledikten sonra tekrar render işlemini başlatır.
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e

* Transition güncellemeleri, metin girişlerini kontrol etmek için kullanılamaz.

<<<<<<< HEAD
* Eğer birden fazla transition işlemi devam ediyorsa, React şu an için bu güncellemeleri birleştirir. Ancak bu durum, ileride kaldırılması beklenen bir kısıtlamadır.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e

---

## Kullanım {/*usage*/}

<<<<<<< HEAD
### Bir state güncellemesini, gecikmeye neden olmayan transition olarak işaretlemek. {/*marking-a-state-update-as-a-non-blocking-transition*/}

Bir state güncellemesini `startTransition` çağrısı içine alarak *transition* olarak işaretleyebilirsiniz:

=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transition'lar, kullanıcı arayüzü güncellemelerini yavaş cihazlarda bile hızlı ve duyarlı tutmanıza olanak tanır.

<<<<<<< HEAD
Transition'lar ile, kullanıcı arayüzü yeniden render sırasında bile duyarlı kalır. Örneğin, kullanıcı bir sekmeye tıklar, ancak sonra fikrini değiştirir ve başka bir sekmeye tıklarsa, bunu birinci tekrar render işleminin tamamlanmasını beklemeden yapabilir.

<Note>

`startTransition`, `useTransition` ile oldukça benzerdir, ancak transition işleminin devam edip etmediğini takip etmek için `isPending` işaretleyicisini sunmaz. `useTransition` kullanılamıyorsa `startTransition` kullanılabilir. Örneğin, `startTransition` bileşenlerin dışında da kullanılabilir ve veri kütüphaneleri gibi durumlarda faydalı olabilir.

[`useTransition` sayfasında transition hakkında bilgi edinebilir ve örnekleri inceleyebilirsiniz.](/reference/react/useTransition)
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e

</Note>
