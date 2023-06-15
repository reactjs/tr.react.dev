---
title: Anlık Görüntü Olarak State
---

<Intro>

State değişkenleri okuma ve yazma yapabildiğiniz sıradan Javascript değişkenlerine benzeyebilir. Ancak, State daha çok anlık görüntü gibi çalışır. Onu ayarlamak zaten sahip olduğunuz State değişkenini değiştirmez, bunun yerine yeniden render işlemini tetikler.


</Intro>

<YouWillLearn>

* State'i ayarlamak nasıl yeniden render alınmasını tetikler
* State güncellemeleri ne zaman ve nasıl yapılır 
* State'i ayarladıktan sonra neden hemen güncellenmiyor
* Olay yöneticileri state'in "Anlık Görüntüsüne" nasıl erişiyor

</YouWillLearn>

## State'i ayarlamak render'ı tetikler {/*setting-state-triggers-renders*/}

Kullanıcı arayüzünün, bir tıklama gibi kullanıcı olayına doğrudan yanıt olarak değiştiğini düşünebilirsiniz. React içinde bu bu mental modelden biraz farklı çalışır. Bir önceki sayfada React’te bunu gördünüz. [State'i değiştirmek bir yeniden render isteği oluşturur](/learn/render-and-commit#step-1-trigger-a-render) Bu bir arayüzün olaya tepki vermesi için *state’i güncellemeniz* gerektiği anlamına gelir.

Bu örnekte “Gönder”e bastığınızda  `setIsSent(true)` React'e kullanıcı arayüzünü yeniden render etmesini söyler:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Mesajınız yolda!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gönder</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Butona tıkladığınızda şu işlemler gerçekleşir:

1. `onSubmit` olay yöneticisi çalıştırılır.
2. `setIsSent(true)`, `isSent` değerini `true` olarak ayarlar ve yeni bir render işlemi için kuyruğa alır.
3. React, yeni `isSent` değerine göre bileşeni yeniden render eder.

Hadi state ve render işlemi arasındaki ilişkiye yakından bakalım.

## Render işlemi, bir anlık görüntü alır. {/*rendering-takes-a-snapshot-in-time*/}

["Render Etmek"](/learn/render-and-commit#step-2-react-renders-your-components) bir fonksiyon olan bileşeninizi çağırdığı anlamına gelir. Bu fonksiyondan döndürdüğünüz JSX, kullanıcı arayüzünün  bir anlık görüntüsü olarak düşünülebilir. Bu JSX’in içinde prop’lar olay yöneticileri ve yerel değişkenleri hepsi **render anında state kullanılarak**  hesaplanmış durumdadır. 

Bir fotoğraf veya film karesinin aksine, döndürdüğünüz kullanıcı arayüzü "anlık görüntü" etkileşimlidir. Bu, girdilere yanıt olarak neyin gerçekleşeceğini belirten olay yöneticileri gibi mantık içerir. React, ekranı bu anlık görüntüyle eşleştirmek ve olay yöneticilerini bağlamak için güncelleme yapar. Sonuç olarak, bir butona basmak JSX'inizdeki tıklama yöneticisini tetikleyecektir.

React bir bileşeni yeniden render ettiğinde: 

1. React fonksiyonunuzu yeniden çağırır.
2. Fonksiyonunuz yeni bir JSX anlık görüntüsü döner.
3. React ardından, döndürdüğünüz anlık görüntüye göre ekranı günceller

<IllustrationBlock sequential>
    <Illustration caption="React fonksiyonu çalıştırıyor" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Anlık görüntüyü hesaplıyor" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM ağacını güncelliyor" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Bir bileşenin hafızası olarak, state fonksiyonunuz döndüğünde ortadan kaybolan sıradan bir değişken değildir. State aslında fonksiyonunuzun dışında React’in içinde yaşar sanki bir rafta duruyormuş gibi. React bileşeninizi çağırdığında o belirli render için durumun bir anlık görüntüsünü size verir. Bileşeniniz JSX içinde hesaplanmış taze bir takım prop ve olay yöneticileriyle birlikte **o render için state değerlerini kullanarak** kullanıcı arayüzünün bir anlık görüntüsünü döndürür.

<IllustrationBlock sequential>
  <Illustration caption="React'a state'i güncellemesini söylersiniz." src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React, state değerini günceller." src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React, bileşene state değerinin bir anlık görüntüsünü aktarır." src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

İşleyişin nasıl çalıştığını göstermek için küçük bir deney yapalım. Bu örnekte, "+3" butonuna tıkladığınızda `setNumber(number + 1)` üç kez çağrıldığı için sayaçın üç kez artmasını bekleyebilirsiniz. 

“+3” butonuna tıkladığınızda ne olduğunu görelim

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

`number` değerinin her tıklamada bir kez arttığına dikkat edin!

**State’i ayarlamak sadece *sonraki* render işlemi için değiştirir.** İlk render sırasında, `number` değeri `0` idi. Bu yüzden, o render'ın `onClick` işleyicisinde `setNumber(number + 1)` çağrıldıktan sonra bile, `number` değeri hala `0` olarak kalır.

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

İşte bu butonun tıklama yöneticisine React'e ne yapması gerektiğini söylediği:

1. `setNumber(number + 1)`: `number` değeri `0` olduğu için `setNumber(0 + 1)` olarak çağrılır.
    - React, bir sonraki render işleminde number değerini 1 olarak değiştirmek için hazırlık yapar.
2. `setNumber(number + 1)`: `number` değeri `0` olduğu için `setNumber(0 + 1)` olarak çağrılır.
    - React, bir sonraki render işleminde `number` değerini `1` olarak değiştirmek için hazırlık yapar.
3. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React, bir sonraki render işleminde `number` değerini `1` olarak değiştirmek için hazırlık yapar.

Üç kez `setNumber(number + 1)` çağırsanız da, *bu renderın* olay yöneticisinde `number` her zaman `0` olduğu için durumu üç kez `1` olarak ayarlarsınız. Bu yüzden, olay yöneticisi tamamlandıktan sonra React bileşeni `number`'ı `3` yerine `1` olarak yeniden render eder.

Bu durumu görselleştirmek için zihinsel olarak kodunuzdaki state değişkenlerini değerleriyle değiştirebilirsiniz. *Bu render* için `number` state değişkeni `0` olduğunda, olay yöneticisi aşağıdaki gibi görünür:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Bir sonraki render için `number` değeri `1` olduğunda, *o render'ın* tıklama yöneticisi aşağıdaki gibi görünecektir:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Bu nedenle, düğmeye tekrar tıkladığınızda sayaç önce `2` olarak ayarlanır, ardından bir sonraki tıklamada `3` olarak ayarlanır ve böyle devam eder.

## Zaman içerisinde state {/*state-over-time*/}

Bu eğlenceliydi. Bu düğmeye tıklamanın ne uyarı vereceğini tahmin etmeye çalışın:

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Önceden belirttiğimiz yerine koyma yöntemini kullanarak, butona tıklandığında ekranda "0" şeklinde bir uyarı mesajı görüntülenmesini tahmin edebilirsiniz.

```js
setNumber(0 + 5);
alert(0);
```

Eğer uyarıya bir zamanlayıcı ekler ve bu zamanlayıcı yalnızca bileşen yeniden render edildikten _sonra_ tetiklenirse ne olur ? “0” mı yoksa “5” mi der? Bir tahminde bulunun!

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Şaşırdınız mı? Yerine koyma yöntemini kullanırsanız, uyarıya geçirilen state'in "anlık görüntüsünü" görebilirsiniz.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

React'te depolanan state, uyarı çalıştığında değişmiş olabilir, ancak kullanıcının etkileşimde bulunduğu zamandaki durumun bir anlık görüntüsü kullanılarak zamanlanmıştır.

*Bir state değişkeninin değeri bir render işlemi içinde asla değişmez,** hatta yöneticisinin kodu asenkron olsa bile. İçindeki *o render’ın*  onClick yöneticisinde, `setNumber(number + 5)` çağrılmış olsa bile, `number`'ın değeri hala `0` olarak kalır. `Number`'ın değeri React bileşeninizi çağırarak kullanıcı arayüzü'nün "anlık görüntüsü'nü" alırken "sabitlenmiştir".

İşte bu durumun olay yöneticilerinizi zamanlama hatalarına karşı daha yatkın hale getiren bir örneği. Aşağıda, beş saniyelik bir gecikmeyle mesaj gönderen bir form bulunmaktadır. Bu senaryoyu hayal edin:

1. “Send” butonuna basarak “Hello” mesajını Alice’e gönderiyorsunuz
2. Beş saniyelik gecikme bitmeden önce, “To” alanının değerini “Bob” olarak değiştiriyorsunuz.

`alert`'in ne görüntüleyeceğini bekliyorsunuz? "You said Hello to Alice" mı yoksa "You said Hello to Bob" mı? Bildiklerinizden yola çıkarak bir tahminde bulunun ve deneyin:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React, bir render içindeki olay yöneticilerindeki state değerlerini “sabit” tutar.** Kod çalışırken durumun değişip değişmediği konusunda endişelenmenize gerek yoktur.

Ancak bir yeniden render alma öncesi en son state’i okumak isterseniz ne yapabilirsiniz? Bir sonraki sayfada ele alınan [state güncelleme fonksiyonu](/learn/queueing-a-series-of-state-updates)'nu kullanmak isteyeceksiniz!

<Recap>

* State’i ayarlanması yeni bir render ister.
* React State’i bileşeninizin dışında, sanki bir raf üzerinde depolar.
* `useState` hook'unu çağırdığınızda, React *o render* için state'in bir anlık görüntüsünü verir.
* Değişkenler ve olay yöneticileri yeniden render alınmasıyla “kurtulamazlar”. Her render’ın kendi olayı yöneticileri vardır.
* Her render (ve içindeki fonksiyonlar), her zaman React’in *o* render’a verdiği state’in anlık görüntüsünü görecektir.
* Renderlanmış JSX hakkında ne düşündüğünüze benzer bir şekilde, zihinsel olarak olay yöneticileri içinde state’i yerine koyabilirsiniz, 
* Geçmişte oluşturulmuş olay yöneticileri, oluşturuldukları render’ın state değerine sahiptirler.

</Recap>



<Challenges>

#### Bir trafik ışığı uygulayın {/*implement-a-traffic-light*/}

İşte butona basıldığında yaya geçidi ışığını açıp kapatan bir bileşen:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

İlgili tıklama yöneticisine bir `Alarm` ekleyelim. Yeşil ışık yanıyorsa ve `Walk` yazıyorsa, butona tıklanıldığında `Walk is Next` demesi gerekiyor. Kırmızı ışık yanıyorsa ve “Dur” yazıyorsa, butona tıklandığında `Walk is Next` demesi gerekiyor.

`Alarm`'ı `setWalk` çağrısının öncesine veya sonrasına koymak arasında bir fark oluşturur mu?

<Solution>

`Alarmınız` şu şekilde görünmeli:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

`setWalk` çağrısının öncesinde veya sonrasında olması fark etmez. walk'un render işlemi sırasındaki değeri sabittir. setWalk çağrısı, sadece *sonraki* render işlemi için değeri değiştirir, ancak önceki render işlemi için olay yöneticisini etkilemez.

Bu satır ilk başta mantıksız görünebilir:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

Ancak, "Eğer trafik lambası 'Walk now' gösteriyorsa, mesaj 'Stop is next' demelidir." şeklinde okursanız, mantıklı olur. Olay yöneticinizdeki walk değişkeni, ilgili render'in walk değeriyle eşleşir ve değişmez.

Bu doğru olduğunu doğrulamak için yerine koyma yöntemini uygulayarak kontrol edebilirsiniz. walk değeri true olduğunda şunu elde edersiniz:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

"Change to Stop" butonuna tıklamak, walk değeri false olarak ayarlanmış bir render'ı sıraya alır ve "Stop is next" uyarısını verir.

</Solution>

</Challenges>
