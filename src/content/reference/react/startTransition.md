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

`startTransition`, bir state güncellemesini transition (ertelenen güncelleme) olarak işaretlemenize olanak tanır.

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
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 303ecae3dd4c7b570cf18e0115b94188f6aad5a1

#### Dönen değerler {/*returns*/}

`startTransition` herhangi bir şey geri döndürmez.

#### Uyarılar {/*caveats*/}

* `startTransition`, bir transition işleminin beklemede olup olmadığını takip etmenin bir yolunu sunmaz. Transition işlemi sırasında ilerleme durumunu göstermek için [`useTransition`](/reference/react/useTransition) kullanmanız gerekir.

* Bir güncellemeyi transition olarak kullanmak için, ilgili state'in `set` fonksiyonuna erişebilmeniz gerekiyor. Eğer bir prop veya özel bir Hook dönüş değerine yanıt olarak transition başlatmak isterseniz, bunun yerine [`useDeferredValue`](/reference/react/useDeferredValue) özelliğini kullanmayı deneyebilirsiniz.

* `startTransition`'a ilettiğiniz fonksiyon, eşzamanlı olarak çalışabilecek bir fonksiyon olmalıdır. React, bu fonksiyonu hemen çalıştırır ve çalışırken gerçekleşen tüm state güncellemelerini transition olarak işaretler. Sonrasında daha fazla state güncellemesi yapmaya çalışırsanız (örneğin, bir zaman aşımında), bunlar transition olarak işaretlenmezler.

* Bir state güncelleme işlemi transition olarak işaretlendiğinde, diğer güncelleme işlemleri bu işlemi kesintiye uğratabilir. Örneğin, bir grafik bileşenini güncelleyen transition işlemi sırasında, grafik bileşeni tekrar render işlemi devam ederken bir giriş alanına yazmaya başlarsanız, React, giriş alanındaki güncellemeyi işledikten sonra tekrar render işlemini başlatır.

* Transition güncellemeleri, metin girişlerini kontrol etmek için kullanılamaz.

* Eğer birden fazla transition işlemi devam ediyorsa, React şu an için bu güncellemeleri birleştirir. Ancak bu durum, ileride kaldırılması beklenen bir kısıtlamadır.

---

## Kullanım {/*usage*/}

### Bir state güncellemesini, gecikmeye neden olmayan transition olarak işaretlemek. {/*marking-a-state-update-as-a-non-blocking-transition*/}

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
