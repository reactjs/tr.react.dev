---
title: useRef
---

<Intro>

`useRef` render işlemi için gerekli olmayan bir değeri referans almanıza izin veren bir React Hook'tur.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Bir [ref](/learn/referencing-values-with-refs) tanımlamak için `useRef`'i bileşeninizin en üst seviyesinde çağırın.

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}


* `initialValue`: Ref nesnesinin `current` özelliğinin başlangıçta olmasını istediğiniz değer. Herhangi türde bir değer olabilir. Bu argüman, ilk render işleminden sonra göz ardı edilir.

#### Geri Dönüş Değeri {/*returns*/}

`useRef`, tek bir özelliğe sahip bir nesne döndürür:

* `current`: Başlangıçta, verdiğiniz `initialValue` değerine ayarlanır. Daha sonra başka bir şeye ayarlayabilirsiniz. Eğer ref nesnesini bir JSX elemanına `ref` özelliği olarak verirseniz, React `current` özelliğini tanımlayacaktır.

Sonraki render işlemlerinde, `useRef` aynı nesneyi döndürecektir.

#### Dikkat edilmesi gerekenler {/*caveats*/}

* `ref.current` özelliğini değiştirebilirsiniz. State'in aksine, bu değiştirilebilirdir. Ancak, render için kullanılan bir nesne tutuyorsa (örneğin, State'inizin bir parçası), o nesneyi değiştirmemelisiniz.
* `ref.current` özelliğini değiştirdiğinizde, React bileşeninizi yeniden render etmez. Ref, düz JavaScript bir nesne olduğundan, ne zaman değiştirdiğinizi React fark etmez.
* Bileşeninizin davranışını öngörülemez hale getireceğinden render işlemi sırasında, `ref.current`'e yazmayın veya okumayın. Ancak [başlangıçta](#avoiding-recreating-the-ref-contents) yapabilirsiniz.
* Strict Mode'da, React [istenmeyen yan etkileri bulmanıza yardımcı olmak için](/reference/react/useState#my-initializer-or-updater-function-runs-twice) **bileşeninizi iki kez çağıracaktır.** Bu sadece geliştirme ortamı için geçerli bir davranıştır ve canlı ortamı etkilemez. Her bir ref nesnesi iki kez oluşturulacak, ancak bunlardan biri atılacaktır. Eğer bileşen fonksiyonunuz saf ise (olması gerektiği gibi), bu, davranışı etkilememelidir

---

## Kullanım {/*usage*/}
### Ref ile bir değeri referans gösterme {/*referencing-a-value-with-a-ref*/}

Bir veya daha fazla [ref](/learn/referencing-values-with-refs) tanımlamak için bileşeninizin en üstünde `useRef`'i çağırın.

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` başlangıçta verdiğiniz <CodeStep step={3}>başlangıç değeri</CodeStep> tanımlanmış bir şekilde sadece <CodeStep step={2}>`current`</CodeStep> özelliğine sahip bir <CodeStep step={1}>ref nesnesi</CodeStep> döndürür.

Sonraki render işlemlerinde, `useRef` aynı nesneyi döndürecektir. `current` özelliğini değiştirerek bilgi saklayabilir ve daha sonra okuyabilirsiniz. Bu size [state](/reference/react/useState) özelliğini hatırlatabilir, ancak önemli bir fark var.

**Bir ref'i değiştirmek yeniden render işlemine neden olmaz.** Bu, ref'lerin bileşeninizin görsel çıktısını etkilemeyen bilgileri saklamak için mükemmel olduğu anlamına gelir. Örneğin, bir [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) saklamak ve daha sonra geri almak istiyorsanız, bunu bir ref içine koyabilirsiniz. Ref içindeki değeri güncellemek için, <CodeStep step={2}>`current` özelliğini</CodeStep> manuel olarak değiştirmeniz gerekir:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Daha sonra, ref'ten o interval ID'yi okuyarak [intervali durdurabilirsiniz](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Bir ref kullanarak şunları sağlarsınız:

- Yeniden render işlemleri arasında **bilgi saklayabilirsiniz** (her render işleminde sıfırlanan değişkenlerin aksine).
- Değiştirmek **yeniden render işlemine neden olmaz** (yeniden render işlemine neden olan state değişkenlerinin aksine).
- **Bilgi, bileşeninizin her kopyasına özgüdür** (paylaşılan dış değişkenlerin aksine).

Bir ref'i değiştirmek yeniden render işlemine neden olmaz, bu nedenle ekranda görüntülemek istediğiniz bilgileri saklamak için ref'ler uygun değildir. Bunun yerine state kullanın. [`useRef` ve `useState` arasında nasıl seçim yapacağınıza dair](/learn/referencing-values-with-refs#differences-between-refs-and-state) daha fazla bilgi edinin.

<Recipes titleText="useRef ile ref alma örnekleri" titleId="examples-value">

#### Tıklama sayacı {/*click-counter*/}

Bu bileşen, düğmenin kaç kez tıklandığını takip etmek için bir ref kullanır. Burada state yerine ref kullanmanın sorun olmadığına dikkat edin, çünkü tıklama sayısı yalnızca bir olay işleyicide okunur ve yazılır.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert(ref.current + ' kere tıkladınız!');
  }

  return (
    <button onClick={handleClick}>
      Bana tıkla!
    </button>
  );
}
```

</Sandpack>

Eğer JSX'te `{ref.current}`'ü göstermek isterseniz, butona tıkladığınızda sayı güncellenmez. Bu, `ref.current`e yazmanın render'ı tetiklememesi nedeniyledir. Render için kullanılan bilgilerin state olması gerekir.

<Solution />

#### Bir kronometre {/*a-stopwatch*/}

Bu örnek, state ve ref'in bir kombinasyonunu kullanır. Hem `startTime` hem de `now`, render için kullanıldıklarından state değişkenleridir. Ama aynı zamanda, düğmeye basıldığında interval'i durdurabilmesi için bir [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) tutmamız gerekiyor. Interval ID render için kullanılmadığından, bir ref'te saklamak ve manuel olarak güncellemek uygundur.

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

<Solution />

</Recipes>

<Pitfall>

**Render sırasında `ref.current`'i yazmayın veya okumayın.**

React, bileşenin gövdesinin [saf bir fonksiyon gibi davranmasını](/learn/keeping-components-pure) bekler:

- Eğer inputlar ([prop'lar](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory) ve [context](/learn/passing-data-deeply-with-context)) aynıysa, tamamen aynı JSX'i döndürmelidir.
- Farklı bir sırayla veya farklı argümanlarla çağrılması, diğer çağrıların sonuçlarını etkilememelidir.

**Render sırasında** bir ref'i okumak veya yazmak bu beklentileri bozar.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Render sırasında bir ref'i yazmayın
  myRef.current = 123;
  // ...
  // 🚩 Render sırasında bir ref'i okumayın
  return <h1>{myOtherRef.current}</h1>;
}
```

Render sırasında değil, **olay yöneticilerinden veya efektlerden** ref'leri okuyabilir veya yazabilirsiniz.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Ref'leri efektlerde okuyabilir veya yazabilirsiniz
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Ref'leri olay yöneticilerinde okuyabilir veya yazabilirsiniz
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Eğer render sırasında bir şey okumak [veya yazmak](/reference/react/useState#storing-information-from-previous-renders) *zorunda* kalırsanız, bunun yerine [state kullanın](/reference/react/useState).

Bu kuralları ihlal ettiğinizde, bileşeniniz hala çalışabilir, ancak React'e eklediğimiz yeni özelliklerin çoğu bu beklentilere bağlı olacaktır. [Bileşenlerinizi saf tutma](/learn/keeping-components-pure#where-you-_can_-cause-side-effects) hakkında daha fazla bilgi edinin.

</Pitfall>

---

### Bir ref ile DOM'u manipüle etmek {/*manipulating-the-dom-with-a-ref*/}

Bir ref'i [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) üzerinde değişiklik yapmak için kullanmak oldukça yaygındır. React'ın bunun için yerleşik desteği vardır.

İlk olarak, `null` <CodeStep step={3}>başlangıç değeri</CodeStep> olan bir <CodeStep step={1}>ref nesnesi</CodeStep> tanımlayın:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Ref nesnenizi, manipüle etmek istediğiniz DOM elemanının JSX'ine `ref` özelliği olarak verin:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

React, DOM elemanını oluşturduktan ve ekrana koyduktan sonra, ref nesnenizin <CodeStep step={2}>`current` özelliğini</CodeStep> o DOM elemanına tanımlar. Şimdi `<input>`'un DOM elamanına erişebilir ve [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) gibi yöntemleri çağırabilirsiniz:

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

Eleman ekrandan kaldırıldığında, React `current` özelliğini `null` olarak geri tanımlar.

[Ref'lerle DOM'u manipüle etme](/learn/manipulating-the-dom-with-refs) hakkında daha fazla bilgi edinin.

<Recipes titleText="useRef ile DOM'u manipüle etme örnekleri" titleId="examples-dom">

#### Input'a odaklanma {/*focusing-a-text-input*/}

Bu örnekte, düğmeye tıklamak input'a odaklanacaktır:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Input'a odaklan
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Bir resmi görünüme kaydırma {/*scrolling-an-image-into-view*/}

Bu örnekte, düğmeye tıklamak bir resmi görünüme kaydıracaktır. Liste DOM elemanına bir ref kullanır ve ardından istediğimiz resmi bulmak için DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API'sini çağırır.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Bir videoyu oynatma ve duraklatma {/*playing-and-pausing-a-video*/}


Bu örnek, `<video>` DOM elemanında [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ve [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) çağırması için bir ref kullanır.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Kendi bileşeninize bir ref'i açığa çıkarma {/*exposing-a-ref-to-your-own-component*/}

Bazen, ebeveyn bileşenin, bileşeninizin içindeki DOM'u manipüle etmesine izin vermek isteyebilirsiniz. Örneğin, belki bir `MyInput` bileşeni yazıyorsunuz, ancak ebeveynin input'a odaklanabilmesini (ebeveynin buna erişimi yoktur) istiyorsunuz. Ebeveyn içinde bir `ref` oluşturabilir ve `ref`'i prop olarak çocuk bileşene iletebilirsiniz. [Detaylı bir rehber için buraya bakın.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Input'a odaklan
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

 ### Ref içeriğini yeniden oluşturmayı önleme {/*avoiding-recreating-the-ref-contents*/}

React, başlangıçtaki ref değerini bir kez kaydeder ve sonraki render işlemlerinde bunu dikkate almaz.


```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()` sonucu sadece başlangıç render işleminde kullanılmasına rağmen, bu işlemi her render işleminde çağırıyorsunuz. Bu, eğer pahalı nesneler oluşturuyorsa israf olabilir.

Bunu çözmek için ref'i şu şekilde başlatabilirsiniz:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normalde, render sırasında `ref.current` yazmaya veya okumaya izin verilmez. Ancak bu senaryoda sorun yoktur çünkü sonuç her zaman aynıdır ve koşul sadece başlatma sırasında çalışır, bu nedenle tamamen öngörülebilirdir.

<DeepDive>

#### useRef'i daha sonra başlatırken null kontrollerinden nasıl kaçınılır {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Bir tip denetleyici kullanıyorsanız ve her zaman `null` kontrol etmek istemiyorsanız, bunun yerine şu şekilde bir model deneyebilirsiniz:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Burada `playerRef` kendisi boş olabilir. Ancak, `getPlayer()`'in `null` döndüren bir durum olmadığını tip denetleyicinize ikna etmelisiniz. Ardından, olay yöneticisinde `getPlayer()` kullanın.

</DeepDive>

---

## Sorun Giderme {/*troubleshooting*/}

### Özel bir bileşeni ref alamıyorum {/*i-cant-get-a-ref-to-a-custom-component*/}

Bileşeninize şu şekilde bir `ref` vermeyi denerseniz:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Konsolda bir hata alabilirsiniz:

<ConsoleBlock level="error">

TypeError: Null'un özellikleri okunamıyor

</ConsoleBlock>

Varsayılan olarak, kendi bileşenleriniz içlerindeki DOM elemanlarında ref'leri açığa çıkarmaz.

Bunu düzeltmek için, bir ref almak istediğiniz bileşeni bulun:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

Daha sonra, bileşeninizin kabul ettiği prop’lar listesine `ref` ekleyin ve `ref`’i ilgili çocuk [yerleşik bileşene (built-in component)](/reference/react-dom/components/common) prop olarak iletin, şöyle:

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Böylece ana bileşen ona bir ref alabilir.

[Başka bir bileşenin DOM elemanına erişme](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) hakkında daha fazla bilgi edinin.
