---
title: 'Ref ile Değerlere Referans Verme'
---

<Intro>

Bir bileşenin "hatırlamasını" istediğiniz bilgi varsa, ancak bu bilginin [yeni render'lar](/learn/render-and-commit) tetiklemesini istemiyorsanız, bir *ref* kullanabilirsiniz.

</Intro>

<YouWillLearn>

- Bir bileşene ref nasıl eklenir
- Bir ref'in değerini nasıl güncelleyebilirsiniz
- Ref'lerin state'ten farkı nedir 
- Ref'leri güvenli bir şekilde nasıl kullanabilirsiniz

</YouWillLearn>

## Bir bileşene ref eklemek {/*adding-a-ref-to-your-component*/}

Bileşeninize bir ref eklemek için, `useRef` Hook'unu React'ten içe aktarın:

```js
import { useRef } from 'react';
```

Bileşeninizin içinde `useRef` Hook'unu çağırın ve yalnızca bir argüman olarak referans vermek istediğiniz başlangıç değerini geçirin. Örneğin, değeri `0` olan bir ref:

```js
const ref = useRef(0);
```

`useRef` size aşağıdaki gibi bir nesne döndürür:

```js
{ 
  current: 0 // useRef'a geçirdiğiniz değer
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Üzerinde 'current' yazan bir ok, üzerinde 'ref' yazan bir torbanın içine sokulmuş durumda." />

Bu ref'in geçerli değerine `ref.current` özelliği üzerinden erişebilirsiniz. Bu değer kasıtlı olarak değiştirilebilir, yani hem okunabilir hem de yazılabilir. Bu bileşeninizin React tarafından takip edilmediği anlamına gelir. (Bu, onu React'in tek yönlü veri akışından kaçmanızı sağlayan bir "kaçış noktası" yapar, buna aşağıda daha fazla değineceğiz!)

Her tıklamada `ref.current`'i artıracak bir düğme:

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
      Tıkla!
    </button>
  );
}
```

</Sandpack>

Ref bir sayıyı işaret ediyor fakat [state](/learn/state-a-components-memory) gibi herhangi bir şeye işaret edebilirsiniz: bir string, bir nesne veya hatta bir fonksiyon. State'in aksine, ref, `current` özelliği olan basit bir JavaScript nesnesidir. Bu özelliği okuyabilir ve değiştirebilirsiniz.

Dikkat edin **ref her arttığında bileşen yeniden render edilmez.** State gibi, ref'ler de React tarafından yeniden render'lar arasında saklanır. Ancak, state'i değiştirmek bileşeni yeniden render eder. Bir ref'i değiştirmek etmez!

## Örnek: bir kronometre oluşturma {/*example-building-a-stopwatch*/}

Ref'ler ve state'i tek bir bileşenin içinde birlikte kullanabilirsiniz. Örnegin, kullanıcının bir düğmeye basarak başlatabileceği veya durdurabileceği bir kronometre yapalım. Kullanıcının "Başlat" düğmesine bastığı zamandan beri geçen süreyi göstermek için, "Başlat" düğmesinin ne zaman basıldığını ve şu anki zamanı takip etmeniz gerekir. **Bu bilgi render etmek için kullanıldığından, onu state'te tutacaksınız:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Kullanıcı "Başlat" düğmesine bastığında, zamanı her 10 milisaniyede bir güncellemek için [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) kullanacaksınız:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Saymaya başla
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Şuanki zamanı her 10ms'de bir güncelle.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Geçen zaman: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Başlat
      </button>
    </>
  );
}
```

</Sandpack>

"Durdur" düğmesine basıldığında `now` state değişkeninin güncellenmesini durdurmak için varolan intervali iptal etmemiz gerekiyor. Bunu yapmak için [`clearInterval`](https://developer.mozilla.org/docs/Web/API/clearInterval) çağırmamız gerekiyor, ancak kullanıcı Başlat'a bastığında `setInterval` çağrısından dönen interval ID'sini vermeniz gerekir. Bu interval ID'yi bir yerde saklamanız gerekir. **Interval ID herhangi bir render işleminde kullanılmadığından, onu bir ref'te saklayabilirsiniz:**


<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Geçen zaman: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Başlat
      </button>
      <button onClick={handleStop}>
        Durdur
      </button>
    </>
  );
}
```

</Sandpack>

Ne zaman bir bilgi render etmek için kullanılırsa, onu state'te tutun. Bir bilgi parçası yalnızca olay işleyicileri için gerekiyorsa ve değiştirmek bir yeniden render gerektirmiyorsa, bir ref kullanmak daha verimli olabilir.

## Ref ve state arasındaki farklar {/*differences-between-refs-and-state*/}

Muhtemelen ref'lerin state'ten daha "esnek" olduğunu düşünüyorsunuz. Örneğin, ref'leri state ayarlama fonksiyonu olmadan değiştirebilirsiniz. Ama çoğu zaman state kullanmak isteyeceksiniz. Ref'ler çoğunlukla ihtiyacınız olmayan bir "kaçış noktası"dır. State ve ref'ler arasındaki farkları görelim:



| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)`  `{ current: initialValue }` döndürür.                         | `useState(initialValue)` state değişkeninin şuanki değerini ve bir state ayarlama fonksiyonu (`[value, setValue]`) döndürür.  |
| Değiştirildiğinde yeniden render tetiklenmez.                                         | Değiştirildiğinde yeniden render tetiklenir.                                                                                  |
| Değiştirilebilir; `current` değerini render işlemi dışında da değiştirilebilir ve güncelleyebilirsiniz.  | Değiştirilemez; yeniden render tetiklemek için state değiştirme fonksiyonunu kullanmalısınız.              |
| Render işlemi sırasında `current` değerini okumamalısınız (veya yazmamalısınız). | State'i her zaman okuyabilirsiniz. Ancak, her render'ın değişmeyen kendi [anlık görüntüsü](/learn/state-as-a-snapshot) vardır.     |

State kullanılarak oluşturulmuş bir sayaç buton'u:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} kez tıkladınız.
    </button>
  );
}
```

</Sandpack>

`count` değeri ekranda görüntülendiği için onu state'te tutmak mantıklıdır. Sayacın değeri `setCount()` ile ayarlandığında, React bileşeni yeniden render eder ve ekran yeni sayıyı yansıtır.

Eğer bunu ref kullanarak yapmaya çalışırsanız, React bileşeni yeniden render etmez ve sayıyı ekranda göremezsiniz! Bu düğmeye tıkladığınızda **sayı değişmez**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Bu bileşeni yeniden render etmez!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
     {countRef.current} kez tıkladınız.
    </button>
  );
}
```

</Sandpack>

Bu yüzden render işlemi sırasında `ref.current` değerini okumak güvenilmez kod yazmanıza neden olur. Eğer bunu yapmanız gerekiyorsa, bunun yerine state kullanın.

<DeepDive>

#### useRef nasıl çalışır? {/*how-does-use-ref-work-inside*/}

`useState` ve `useRef` React tarafından sağlansa da, `useRef` prensipte `useState` üzerinde oluşturulabilir. React içinde `useRef`'in aşağıdaki gibi oluşturulduğunu hayal edebilirsiniz:


```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

İlk render sırasında, `useRef` `{ current: initialValue }` döndürür. Bu nesne React tarafından saklanır, bu yüzden bir sonraki render sırasında aynı nesne döndürülür. Bu örnekte state ayarlama fonksiyonunun kullanılmadığına dikkat edin. Her zaman aynı nesneyi döndürmesi gerektiği için gereksizdir!

Pratikte yeterince yaygın olduğu için, React `useRef`'i içinde sağlar. Fakat onu bir ayarlayıcı olmadan normal bir state değişkeni olarak düşünebilirsiniz. Nesne yönelimli programlamaya aşinaysanız, ref'ler size nesne değişkenlerini hatırlatabilir - fakat `this.something` yerine `somethingRef.current` yazarsınız.

</DeepDive>

## Ref'ler ne zaman kullanılmalıdır? {/*when-to-use-refs*/}

Genellikle, bileşeninizin React "dışına çıkması" ve harici API'lar (genellikle bileşenin görünümünü etkilemeyen bir tarayıcı API'si olabilir) ile iletişim kurması gerektiğinde bir ref kullanırsınız. İşte bu nadir durumlara birkaç örnek:

- [timeout ID'lerini](https://developer.mozilla.org/docs/Web/API/setTimeout) saklamak
- [DOM elemanlarını](https://developer.mozilla.org/docs/Web/API/Element) saklamak ve manipüle etmek. Bunu [bir sonraki sayfada](/learn/manipulating-the-dom-with-refs) ele alacağız.
- JSX'i hesaplamak için gerekli olmayan diğer nesneleri saklamak.

Eğer bileşeninizin bir değeri saklaması gerekiyorsa, ancak render mantığını etkilemiyorsa, ref'leri seçin.

## Ref'ler için en iyi pratikler {/*best-practices-for-refs*/}

Bu prensipleri takip etmek bileşenlerinizi daha öngörülebilir hale getirecektir:

- **Ref'lere bir kaçış noktası gibi davranın** Ref'ler harici sistemler veya tarayıcı API'ları ile çalışırken yararlıdır. Uygulamanızın mantığının ve veri akışının büyük bir kısmı ref'lere bağlıysa, yaklaşımınızı yeniden düşünmelisiniz.
- **Render işlemi sırasında `ref.current`'i okumayın veya yazmayın.** Render işlemi sırasında bazı bilgilere ihtiyaç duyuluyorsa, bunun yerine [state](/learn/state-a-components-memory) kullanın. React `ref.current`'in ne zaman değiştiğini bilmediği için, render işlemi sırasında okumak bileşeninizin davranışının tahmin edilmesini zorlaştırır. (Tek istisna `if (!ref.current) ref.current = new Thing()` gibi bir koddur, bu sadece ref'i ilk render sırasında bir kez ayarlar.)


React state'in kısıtlamaları ref'ler için geçerli değildir. Örneğin, state [her render için anlık görüntü](/learn/state-as-a-snapshot) gibi davranır ve [eşzamanlı olarak güncellenmez.](/learn/queueing-a-series-of-state-updates) Fakat bir ref'in geçerli değerini değiştirdiğinizde, hemen değişir:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Bunun nedeni **ref'in kendisinin normal bir JavaScript nesnesi olması** ve öyle davranılmasıdır.

 
Ayrıca bir ref ile çalışırken [mutasyondan kaçınmaya](/learn/updating-objects-in-state) gerek yoktur. Mutasyona uğrayan nesne render işlemi için kullanılmıyorsa, React ref veya içeriğiyle ne yaptığınızı umursamaz.

## Ref'ler ve DOM {/*refs-and-the-dom*/}

Bir ref'i herhangi bir değere işaret edecek şekilde ayarlayabilirsiniz. Fakat ref'lerin en yaygın kullanımı DOM elemanlarına erişmektir. Örneğin, bir input'a programatik olarak odaklanmak istiyorsanız bu kullanışlıdır. JSX'te `ref` özelliğine bir ref geçtiğinizde, `<div ref={myRef}>` gibi, React karşılık gelen DOM elemanını `myRef.current`'e koyar. Bir eleman DOM'dan kaldırıldığı zaman, React `myRef.current` değerini `null` olarak günceller. Bunu [Ref'ler ile DOM'u Manipüle etme](/learn/manipulating-the-dom-with-refs) bölümünde daha fazla okuyabilirsiniz.

<Recap>

- Ref'ler render işlemi için kullanılmayan değerleri tutmak için kullanılan bir kaçış noktasıdır. Bunlara çok fazla ihtiyacınız olmayacak.
- Bir ref, `current` adında tek bir özelliği olan basit bir JavaScript nesnesidir. Bu özelliği okuyabilir veya ayarlayabilirsiniz.
- React'ten size bir ref vermesi için `useRef` Hook'unu çağırabilirsiniz.
- State gibi, ref'ler de bileşenler arasında yeniden render'lar arasında bilgi tutmanızı sağlar.
- State'in aksine, ref'in `current` değerini ayarlamak yeniden render tetiklemez.
- Render işlemi sırasında `ref.current`'i okumayın veya yazmayın. Bu bileşeninizi tahmin edilmesi zor hale getirir.

</Recap>



<Challenges>

#### Bozuk bir sohbet inputunu düzelt {/*fix-a-broken-chat-input*/}

Bir mesaj yazın ve "Gönder" butonuna basın. "Gönderildi!" uyarısını görmek için üç saniye beklemeniz gerektiğini fark edeceksiniz. Bu gecikme sırasında "Geri Al" butonunu görebilirsiniz. Ona tıklayın. Bu "Geri Al" butonunun "Gönderildi!" mesajının görünmesini durdurması gerekiyor. "Geri Al" butonuna tıklandığında `handleSend` sırasında kaydedilen timeout ID ile [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) çağrısı yapıyor. Ancak, "Geri Al" tıklandıktan sonra bile "Gönderildi!" mesajı hala görünüyor. Neden çalışmadığını bulun ve düzeltin.

<Hint>

`let timeoutID` gibi değişkenler her render'da bileşeninizin yeniden çalıştırılmasıyla (ve değişkenlerinin sıfırlanmasıyla) birlikte "hayatta kalamaz". Timeout ID'yi başka bir yerde mi saklamalısınız?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Gönderildi!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Gönderiliyor...' : 'Gönder'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Geri Al
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Bileşeniniz tekrar render edildiğinde (örneğin state değiştirildiğinde) tüm yerel değişkenler sıfırlanır. Bu yüzden `timeoutID` gibi bir yerel değişkende timeout ID'sini kaydedemez ve sonra başka bir olay işleyicisinin gelecekte onu "görmesini" bekleyemezsiniz. Bunun yerine, React'in render'lar arasında koruyacağı bir ref'te saklayın.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Gönderildi!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Gönderiliyor...' : 'Gönder'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Geri Al
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Yeniden render edilemeyen bileşeni düzelt {/*fix-a-component-failing-to-re-render*/}

Bu buton "Açık" ve "Kapalı" arasında geçiş yapmalıdır. Ancak her zaman "Kapalı" olarak gözüküyor. Bu kodda ne yanlış? Düzeltin.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'Açık' : 'Kapalı'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Bu örnekte bir ref'in geçerli değeri render çıktısını hesaplamak için kullanılıyor: `{isOnRef.current ? 'Açık' : 'Kapalı'}`. Bu, ilgili bilginin bir ref'te olmaması gerektiğinin ve bunun yerine state'e konması gerektiğinin bir işaretidir. Düzeltmek için ref'i kaldırın ve yerine state kullanın:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'Açık' : 'Kapalı'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Debouncing'i düzeltin {/*fix-debouncing*/}

<<<<<<< HEAD
Bu örnekte tüm buton tıklama işleyicileri ["debounce edilmiştir"](https://redd.one/blog/debounce-vs-throttle). Bunun ne anlama geldiğini görmek için bir butona basın. Mesajın bir saniye sonra göründüğünü fark edeceksiniz. Mesajı beklerken düğmeye basarsanız, zamanlayıcı sıfırlanır. Yani aynı düğmeye hızlıca birkaç kez tıklamaya devam ederseniz, mesaj tıklamayı bıraktıktan bir saniye sonra görünecektir. Debouncing, kullanıcının "bir şeyler yapmayı durdurana kadar" bazı eylemleri geciktirmenizi sağlar.
=======
In this example, all button click handlers are ["debounced".](https://kettanaito.com/blog/debounce-vs-throttle) To see what this means, press one of the buttons. Notice how the message appears a second later. If you press the button while waiting for the message, the timer will reset. So if you keep clicking the same button fast many times, the message won't appear until a second *after* you stop clicking. Debouncing lets you delay some action until the user "stops doing things".
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

Örnek çalışıyor, fakat tam olarak istenildiği gibi değil. Butonlar birbirinden bağımsız değil. Problemi görmek için bir butona basın ve ardından hemen başka bir butona basın. Biraz bekledikten sonra her iki butonun de mesajını görmeyi beklersiniz. Fakat sadece son butonun mesajı görünüyor. İlk basılan butonun mesajı kayboluyor.

Neden butonlar birbirini etkiliyor? Sorunu bulun ve düzeltin.

<Hint>

Son timout ID değişkeni tüm `DebouncedButton` bileşenleri arasında paylaşılıyor. Bu yüzden bir butona basmak başka bir butonun zamanlayıcısını sıfırlıyor. Her butonda ayrı bir timeout ID değişkeni saklayabilir misiniz?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Uzay gemisi fırlatıldı!')}
      >
        Uzay gemisini fırlat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Çorba kaynadı!')}
      >
        Çorbayı kaynat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Ninni söylendi!')}
      >
        Ninni söyle
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutId` değişkeni tüm bileşenler arasında paylaşılıyor. Bu yüzden ikinci butona basmak ilk butonun bekleyen zamanlayıcısını sıfırlıyor. Bu sorunu çözmek için zamanlayıcıyı ref'te tutmalıyız. Her butonun kendi ref'i olacak, böylece birbirleriyle çakışmayacaklar. Dikkat ederseniz, iki butona hızlıca basmak her ikisinin de mesajını gösterecektir.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
     <DebouncedButton
        onClick={() => alert('Uzay gemisi fırlatıldı!')}
      >
        Uzay gemisini fırlat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Çorba kaynadı!')}
      >
        Çorbayı kaynat
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Ninni söylendi!')}
      >
        Ninni söyle
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### En son state'i oku {/*read-the-latest-state*/}

Bu örnekte, "Gönder" düğmesine bastıktan sonra mesajın görüntülenmeden önce küçük bir gecikme bulunmaktadır. "Merhaba" yazın ve "Gönder" düğmesine basın, arından hızlıca girdiyi tekrar düzenleyin. Düzenlemenize rağmen uyarıda hala "Merhaba" yazıyor (bu, düğmeye basıldığında state'in [o anki](/learn/state-as-a-snapshot#state-over-time)) değeri idi.

Genellikle bu davranış uygulamada istediğinizdir. Ancak, bazen bazı asenkron kodun bazı state'in *en son* halini okumasını isteyebilirsiniz. Düğmeye basıldığı zaman input'taki değer neyse o değeri göstermek yerine, alert'in *şu anki* input değerini göstermesini sağlayacak bir yol düşünebilir misiniz?
<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Gönderiliyor: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Gönder
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State bir [anlık görüntü](/learn/state-as-a-snapshot) gibi çalıştığından, bir timeout gibi asenkron bir işlemden en son state'i okuyamazsınız. Ancak, en son input değerini bir ref'te tutabilirsiniz. Bir ref değiştirilebilir olduğundan, herhangi bir zamanda `current` özelliğini okuyabilirsiniz. Çünkü şu anki metin render etmek için de kullanılır, bu örnekte, *hem* bir state değişkenine (render etmek için) *hem de* bir ref'e ihtiyacınız olacak (timeout'ta okumak için). Şu anki ref değerini manuel olarak güncellemeniz gerekecek.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Gönderiliyor: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Gönder
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
