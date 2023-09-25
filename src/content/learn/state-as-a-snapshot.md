---
title: Anlık Görüntü Olarak State
---

<Intro>

State değişkenleri okuma ve yazma yapabildiğiniz sıradan Javascript değişkenlerine benzeyebilir. Ancak, State daha çok anlık görüntü gibi çalışır. Değerini ayarlamak halihazırda sahip olduğunuz State değişkenini değiştirmez, bunun yerine yeniden render işlemini tetikler.


</Intro>

<YouWillLearn>

* State'i ayarlamak yeniden render alınmasını nasıl tetikler
* State güncellemeleri ne zaman ve nasıl yapılır 
* State neden ayarlandıktan hemen sonra güncellenmez
* Olay yöneticileri state'in "anlık görüntüsü"ne nasıl erişir

</YouWillLearn>

## State'i ayarlamak render tetikler {/*setting-state-triggers-renders*/}

Tıklama gibi kullanıcı olaylarına yanıt olarak kullanıcı arayüzünüzün doğrudan değiştiğini düşünebilirsiniz. React bu zihinsel modelden biraz farklı çalışır. Bir önceki sayfada, [state'i değiştirmenin yeniden render isteği oluşturduğunu](/learn/render-and-commit#step-1-trigger-a-render) gördünüz. Bu durum, arayüzün olaya tepki vermesi için *state’i güncellemeniz* gerektiği anlamına gelir.

Bu örnekte, “Gönder”e bastığınızda, `setIsSent(true)` ifadesi React'e kullanıcı arayüzünü yeniden render etmesini söyler:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Selam!');
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
2. `setIsSent(true)`, `isSent` değerini `true` olarak ayarlar ve yeni bir render işlemini kuyruğa alır.
3. React, `isSent`'in yeni değerine göre bileşeni yeniden render eder.

Şimdi state ve render arasındaki ilişkiye daha yakından bakalım.

## Render işlemi anlık görüntü alır {/*rendering-takes-a-snapshot-in-time*/}

["Render Etmek"](/learn/render-and-commit#step-2-react-renders-your-components), React'ın bir fonksiyon olan bileşeninizi çağırdığı anlamına gelir. Bu fonksiyondan döndürdüğünüz JSX, kullanıcı arayüzünün zaman içindeki anlık görüntüsü olarak düşünülebilir. Bileşenin prop’ları, olay yöneticileri ve yerel değişkenleri **render anında state kullanılarak**  hesaplanmıştır. 

Bir fotoğraf veya film karesinin aksine, döndürdüğünüz kullanıcı arayüzünün "anlık görüntüsü" etkileşimlidir. Girdilere yanıt olarak neyin gerçekleşeceğini belirten olay yöneticileri gibi mantık içerir. React, ekranı bu anlık görüntüyle eşleşecek şekilde günceller ve olay işleyicilerini bağlar. Sonuç olarak, bir butona basmak JSX'inizdeki tıklama yöneticisini tetikleyecektir.

React bir bileşeni yeniden render ettiğinde: 

1. React fonksiyonunuzu yeniden çağırır.
2. Fonksiyonunuz yeni bir JSX anlık görüntüsü (snapshot) döner.
3. Ardından React, döndürdüğünüz anlık görüntüye göre ekranı günceller.

<IllustrationBlock sequential>
    <Illustration caption="React fonksiyonu çalıştırır" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Anlık görüntüyü hesaplar" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM ağacını günceller" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Bir bileşenin hafızası olarak state, fonksiyonunuzun yürütülmesi sona erdiğinde ortadan kaybolan sıradan bir değişken değildir. State sanki bir rafta duruyormuşçasına fonksiyonunuzun dışında  React’in kendi içinde yaşar. React bileşeninizi çağırdığında, söz konusu render için state'in anlık görüntüsünü verir. Bileşeniniz, **ilgili render'daki state değeri kullanılarak** hesaplanmış JSX'indeki yeni prop'lar ve olay yöneticileriyle birlikte kullanıcı arayüzünüzün anlık görüntüsünü döndürür.

<IllustrationBlock sequential>
  <Illustration caption="React'e state'i güncellemesini söylersiniz" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React state değerini günceller" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React bileşene state değerinin anlık görüntüsünü aktarır" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

İşte size bunun nasıl çalıştığını gösteren küçük bir deney. Bu örnekte, "+3" butonuna tıkladığınızda `setNumber(number + 1)` üç kez çağrıldığı için sayacın üç kez artmasını bekleyebilirsiniz. 

"+3" butonuna tıkladığınızda ne olduğunu görün:

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

**State’i ayarlamak yalnızca *sonraki* render işlemi için değerini değiştirir.** İlk render sırasında, `number` değeri `0` idi. Bu yüzden, *o render'ın* `onClick` işleyicisinde `setNumber(number + 1)` çağrıldıktan sonra bile `number` değeri değişmez ve `0` olarak kalır.

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Bu butonun tıklama işleyicisinin React'e yapmasını söylediği şey aşağıdaki gibidir:

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

Pekala, bu eğlenceliydi. Bu düğmeye tıklamanın ne uyarı vereceğini tahmin etmeye çalışın:

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

Peki ya uyarıya bir zamanlayıcı koyarsanız ve yalnızca bileşen yeniden render edildikten _sonra_ tetiklenirse ne olur? “0” mı yoksa “5” mi der? Bir tahminde bulunun!

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

**Bir state değişkeninin değeri render işlemi içinde asla değişmez,** hatta olay yöneticisinin kodu asenkron olsa bile. *O render’ın*  onClick yöneticisinde, `setNumber(number + 5)` çağrılmış olsa bile `number`'ın değeri `0` olarak kalır. State değeri React bileşeninizi çağırdığında kullanıcı arayüzünün "anlık görüntüsünü" alırken "sabitlenmiştir".

İşte bu durumun olay yöneticilerinizi zamanlama hatalarına karşı daha yatkın hale getiren bir örneği. Aşağıda, beş saniyelik bir gecikmeyle mesaj gönderen bir form bulunmaktadır. Bu senaryoyu hayal edin:

1. “Send” butonuna basarak “Merhaba” mesajını Alice’e gönderiyorsunuz
2. Beş saniyelik gecikme bitmeden “Kime” alanının değerini “Bob” olarak değiştiriyorsunuz.

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

**React, state değerlerini render'ın olay yöneticileri içinde “sabit” tutar.** Kod çalışırken durumun değişip değişmediği konusunda endişelenmeniz gerekmez.

Ancak bir yeniden render alma öncesi en son state’i okumak isterseniz ne yapabilirsiniz? Bir sonraki sayfada ele alınan [state güncelleme fonksiyonu](/learn/queueing-a-series-of-state-updates)'nu kullanmak isteyeceksiniz!

<Recap>

* State’in ayarlanması yeni bir render isteği yapar.
* React state’i bileşeninizin dışında, sanki bir raftaymış gibi, depolar.
* `useState`'i çağırdığınızda, React *o render* için state'in anlık görüntüsünü verir.
* Değişkenler ve olay yöneticileri yeniden render işlemi esnasında “hayatta kalmazlar”. Her render’ın kendi olayı yöneticileri vardır.
* Tüm render'lar (ve içindeki fonksiyonlar), daima React’in *o* render’a verdiği state anlık görüntüsünü görür.
* Renderlanmış JSX hakkında düşündüğünüze benzer şekilde, zihinsel olarak olay yöneticileri için de state’i yerine koyabilirsiniz.
* Geçmişte oluşturulmuş olay yöneticileri, oluşturuldukları render'ın state değerine sahiptir.

</Recap>



<Challenges>

#### Bir trafik ışığı uygulayın {/*implement-a-traffic-light*/}

İşte butona basıldığında geçiş yapan bir yaya geçidi ışık bileşeni:

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

Tıklama yöneticisine bir `alert` ekleyin. Yeşil ışık yanıyor ve `Yürü` yazıyorsa, butona tıklamak `Sıradaki: Dur` demelidir. Kırmızı ışık yanıyor ve “Dur” yazıyorsa, butona tıklamak `Sıradaki: Yürü` demelidir.

`alert`'i `setWalk` çağrısından önce veya sonra koymanız bir fark yaratır mı?

<Solution>

`alert`ünüz şu şekilde görünmelidir:

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

`setWalk` çağrısının öncesinde veya sonrasında olması fark etmez. `walk`'un render sırasındaki değeri sabittir. `setWalk` çağrısı, yalnızca *sonraki* render için değeri değiştirir ancak önceki render'daki olay yöneticisini etkilemez.

Bu satır ilk başta mantıksız görünebilir:

```js
alert(walk ? 'Sıradaki: Dur' : 'Sıradaki: Yürü');
```

Ancak şu şekilde okursanız mantıklı olur: "Trafik ışığı 'Yürü' gösteriyorsa, mesaj 'Sıradaki: Dur' demelidir." Olay işleyicinizdeki `walk` değişkeni, render'ın `walk` değeriyle eşleşir ve değişmez.

Bunun doğruluğunu yerini koyma yöntemini uygulayarak kontrol edebilirsiniz. 'walk''ın değeri 'true' olduğunda şunu elde edersiniz:

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

Yani "Dur Olarak Değiştir" butonuna tıklamak, `walk`'ın `false` olarak ayarlandığı render işlemini kuyruğa alır ve "Sıradaki: Dur" uyarısını verir.

</Solution>

</Challenges>
