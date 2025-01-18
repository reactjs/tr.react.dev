---
title: startTransition
---

<Intro>

`startTransition` lets you render a part of the UI in the background.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

`startTransition` fonksiyonu, bir state güncellemesini transition (geçiş) olarak işaretlemenize olanak tanır.

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

* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls awaited in the `action` will be included in the transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Dönen değerler {/*returns*/}

`startTransition` herhangi bir şey geri döndürmez.

#### Uyarılar {/*caveats*/}

* `startTransition`, bir transition işleminin beklemede olup olmadığını takip etmenin bir yolunu sunmaz. Transition işlemi sırasında ilerleme durumunu göstermek için [`useTransition`](/reference/react/useTransition) kullanmanız gerekir.

* Bir güncellemeyi transition olarak kullanmak için, ilgili state'in `set` fonksiyonuna erişebilmeniz gerekiyor. Eğer bir prop veya özel bir Hook dönüş değerine yanıt olarak transition başlatmak isterseniz, bunun yerine [`useDeferredValue`](/reference/react/useDeferredValue) özelliğini kullanmayı deneyebilirsiniz.

* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Bir state güncelleme işlemi transition olarak işaretlendiğinde, diğer güncelleme işlemleri bu işlemi kesintiye uğratabilir. Örneğin, bir grafik bileşenini güncelleyen transition işlemi sırasında, grafik bileşeni tekrar render işlemi devam ederken bir giriş alanına yazmaya başlarsanız, React, giriş alanındaki güncellemeyi işledikten sonra tekrar render işlemini başlatır.

* Transition güncellemeleri, metin girişlerini kontrol etmek için kullanılamaz.

* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.

---

## Kullanım {/*usage*/}

### Bir state güncellemesini, engellemeyen transition olarak işaretlemek. {/*marking-a-state-update-as-a-non-blocking-transition*/}

Bir state güncellemesini `startTransition` çağrısı içine alarak *transition* olarak işaretleyebilirsiniz:


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

Transition'lar ile, kullanıcı arayüzü yeniden render sırasında bile duyarlı kalır. Örneğin, kullanıcı bir sekmeye tıklar, ancak sonra fikrini değiştirir ve başka bir sekmeye tıklarsa, bunu birinci tekrar render işleminin tamamlanmasını beklemeden yapabilir.

<Note>

`startTransition`, `useTransition` ile oldukça benzerdir, ancak transition işleminin devam edip etmediğini takip etmek için `isPending` işaretleyicisini sunmaz. `useTransition` kullanılamıyorsa `startTransition` kullanılabilir. Örneğin, `startTransition` bileşenlerin dışında da kullanılabilir ve veri kütüphaneleri gibi durumlarda faydalı olabilir.

[`useTransition` sayfasında transition hakkında bilgi edinebilir ve örnekleri inceleyebilirsiniz.](/reference/react/useTransition)

</Note>
