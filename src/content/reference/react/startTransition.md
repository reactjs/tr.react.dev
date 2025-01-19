---
title: startTransition
---

<Intro>

`startTransition`, UI'nin bir kısmını arka planda render etmenizi sağlar.

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

* `action`: Bir veya birden fazla [`set` fonksiyonu](/reference/react/useState#setstate) çağırarak bazı Stateleri güncelleyen bir fonksiyon. React, `action` fonksiyonunu hemen parametresiz olarak çağırır ve `action` fonksiyonu çağrıldığında senkronize olarak planlanan tüm State güncellemelerini Transition olarak işaretler. `action` içinde beklenen herhangi bir async çağrı, geçişe dahil edilecektir, ancak şu anda `await` sonrası herhangi bir `set` fonksiyonunun ek bir `startTransition` içinde sarılması gerekmektedir (bkz. [Sorun Giderme](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Transition olarak işaretlenen durum güncellemeleri [bloklanmayan](#marking-a-state-update-as-a-non-blocking-transition) olacak ve [istenmeyen yükleme göstergelerini göstermeyecektir.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Dönen değerler {/*returns*/}

`startTransition` herhangi bir şey geri döndürmez.

#### Uyarılar {/*caveats*/}

* `startTransition`, bir transition işleminin beklemede olup olmadığını takip etmenin bir yolunu sunmaz. Transition işlemi sırasında ilerleme durumunu göstermek için [`useTransition`](/reference/react/useTransition) kullanmanız gerekir.

* Bir güncellemeyi transition olarak kullanmak için, ilgili state'in `set` fonksiyonuna erişebilmeniz gerekiyor. Eğer bir prop veya özel bir Hook dönüş değerine yanıt olarak transition başlatmak isterseniz, bunun yerine [`useDeferredValue`](/reference/react/useDeferredValue) özelliğini kullanmayı deneyebilirsiniz.

* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Bir state güncelleme işlemi transition olarak işaretlendiğinde, diğer güncelleme işlemleri bu işlemi kesintiye uğratabilir. Örneğin, bir grafik bileşenini güncelleyen transition işlemi sırasında, grafik bileşeni tekrar render işlemi devam ederken bir giriş alanına yazmaya başlarsanız, React, giriş alanındaki güncellemeyi işledikten sonra tekrar render işlemini başlatır.

* Transition güncellemeleri, metin girişlerini kontrol etmek için kullanılamaz.

* Birden fazla devam eden Transition varsa, React şu anda bunları birleştirir. Bu, gelecekteki bir sürümde kaldırılabilecek bir sınırlamadır.

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
