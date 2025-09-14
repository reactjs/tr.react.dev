---
title: Ref'ler ile DOM Manipülasyonu
---

<Intro>

React, [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)'u render edilen çıktıya uyacak şekilde otomatik olarak günceller. Böylece bileşenlerinizin genellikle onu değiştirmesi gerekmez. Ancak bazen React tarafından yönetilen DOM elemanlarına erişmeye ihtiyaç duyabilirsiniz örneğin bir elemana odaklamak, onu kaydırmak veya boyutunu ve konumunu ölçmek isteyebilirsiniz. React'te bunları yapmanın yerleşik bir yolu yoktur bu yüzden DOM elemanı için *ref*'e ihtiyacınız olacak.

</Intro>

<YouWillLearn>

- React tarafından yönetilen bir DOM elemanına `ref` özelliğiyle nasıl erişilir?
- JSX özelliği olan `ref`, `useRef` Hook'uyla nasıl ilişkilidir?
- Başka bir bileşenin DOM elemanına nasıl erişilir?
- Hangi durumlarda React tarafından yönetilen DOM'u değiştirmek güvenlidir?

</YouWillLearn>

## Elemana ref alma {/*getting-a-ref-to-the-node*/}

React tarafından yönetilen bir DOM elemanına erişmek için önce `useRef` Hook'unu içe aktarın:

```js
import { useRef } from 'react';
```

Ardından bileşeninizin içinde bir ref bildirmek için kullanın:

```js
const myRef = useRef(null);
```

Son olarak DOM elemanını almak istediğiniz JSX etiketine ref özelliği olarak ref'inizi iletin:

```js
<div ref={myRef}>
```

`useRef` Hook'u `current` adlı tek bir özelliğe sahip bir nesne döndürür. Başlangıçta `myRef.current`, `null` olacaktır. React bu `<div>` için bir DOM elemanı oluşturduğunda React bu elemanın içine `myRef.current` referansı koyacaktır. Daha sonra bu DOM elemanına [olay yöneticinizden](/learn/responding-to-events) erişebilir ve yerleşik [tarayıcı API'lerini](https://developer.mozilla.org/docs/Web/API/Element) kullanabilirsiniz.

```js
// Herhangi bir tarayıcı API'sini kullanabilirsiniz, örneğin:
myRef.current.scrollIntoView();
```

### Örnek: Bir metin girişine odaklanma {/*example-focusing-a-text-input*/}

Bu örnekte butona tıklamak input alanına odaklayacaktır:

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Bunu uygulamak için:

1. `useRef` Hook'u ile `inputRef`'i bildirin.
2. `<input ref={inputRef}>` olarak geçin. React'e **bu `<input>`'ta DOM elemanının içine `inputRef.current`'i** koymasını söyler.
3. `handleClick` fonksiyonunda `inputRef.current`'tan input DOM elemanını okuyun ve [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) ile `inputRef.current.focus()` ögesini çağırın.
4. `handleClick` olay yöneticisini `onClick` ile `<button>` elemanına geçin.

DOM manipülasyonu ref için en yaygın kullanım olsa da `useRef` Hook'u, zamanlayıcı ID'ler gibi, React dışında başka şeyleri saklamak için de kullanılabilir. State'e benzer şekilde refler de renderlar arasında kalır. Ref, ayarladığınızda yeniden render etmeyi tetiklemeyen state değişkenleri gibidir. Ref hakkında bilgi edinin: [Referencing Values with Refs.](/learn/referencing-values-with-refs)

### Örnek: Bir öğeye scroll etmek {/*example-scrolling-to-an-element*/}

Bir bileşende birden fazla ref olabilir. Bu örnekte üç resimden oluşan bir carousel vardır. Her buton karşılık gelen ilgili DOM elemanında tarayıcıya [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) metodunu çağırarak resmi ortalar.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
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

<DeepDive>

#### Ref callback kullanarak bir ref listesi nasıl yönetilir? {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Yukarıdaki örneklerde önceden tanımlanmış sayıda ref vardır. Ancak bazen listedeki her bir öge için ref'e ihtiyacınız olabilir ve kaç tane olacağını bilemeyebilirsiniz. Böyle bir şey **işe yaramaz**:

```js
<ul>
  {items.map((item) => {
    // Çalışmaz!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Bunun nedeni **Hook'ların bileşeninizin sadece en üst seviyesinde çağrılması gerekmesinden kaynaklıdır.** Bir döngüde, koşulda veya `map()`'in içinde `useRef`'i çağıramazsınız.

Bunun olası bir yolu ana elemana tek bir ref almak ve ardından tek tek alt elemanı bulmak için [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) gibi DOM manipülasyon yöntemlerini kullanmaktır. Ancak bu yöntem tutarsızdır ve DOM yapınız değişirse işlevsiz hale gelebilir.

Another solution is to **pass a function to the `ref` attribute.** This is called a [`ref` callback.](/reference/react-dom/components/common#ref-callback) React will call your ref callback with the DOM node when it's time to set the ref, and call the cleanup function returned from the callback when it's time to clear it. This lets you maintain your own array or a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and access any ref by its index or some kind of ID.

Bu örnek uzun bir listede rastgele bir elemana kaydırmak için bu yaklaşımı nasıl kullanabileceğimizi gösterir:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Map'i ilk kullanımda başlatın.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
  }
  return catList;
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

Bu örnekte `itemsRef` tek bir DOM elemanını tutmaz. Bunun yerine öge kimliğinden DOM elemanına bir [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) tutar. ([Ref'ler herhangi bir değeri tutabilir!](/learn/referencing-values-with-refs)) Her liste ögesindeki [`ref` callback'i](/reference/react-dom/components/common#ref-callback) Map'i güncellemeye özen gösterir:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Haritaya ekle
    map.set(cat, node);

    return () => {
      // Haritadan çıkar
      map.delete(cat);
    };
  }}
>
```

Bu, daha sonra Map'ten bireysel DOM düğümlerini okumanızı sağlar.

<Note>

Strict Mode etkinleştirildiğinde, ref geri çağırma fonksiyonları geliştirme aşamasında iki kez çalıştırılacaktır.

[Bu, geri çağırma ref'lerinde bulunan hataları nasıl bulmaya yardımcı olur](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) hakkında daha fazla bilgi edinin.

</Note>

</DeepDive>

## Başka bir bileşenin DOM elemanlarına erişme {/*accessing-another-components-dom-nodes*/}

<Pitfall>
Ref'ler bir kaçış mekanizmasıdır. Başka bir bileşenin DOM düğümlerini manuel olarak manipüle etmek, kodunuzu kırılgan hale getirebilir.
</Pitfall>

Ref'leri ebeveyn bileşenden çocuk bileşenlere [diğer herhangi bir prop gibi](/learn/passing-props-to-a-component) geçirebilirsiniz.

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

Yukarıdaki örnekte, bir ref ebeveyn bileşen olan `MyForm` içinde oluşturulur ve çocuk bileşen olan `MyInput`'a geçirilir. `MyInput` daha sonra ref'i `<input>` öğesine iletir. Çünkü `<input>`, React'in `.current` özelliğini `<input>` DOM elemanına ayarladığı [yerleşik bir bileşendir](/reference/react-dom/components/common).

`MyForm` içinde oluşturulan `inputRef` artık `MyInput` tarafından döndürülen `<input>` DOM elemanına işaret eder. `MyForm` içinde oluşturulan bir tıklama işleyicisi, `inputRef`'e erişebilir ve `focus()` çağrısı yaparak odaklanmayı `<input>`'a ayarlayabilir.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        İnput'a odaklan
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### İmperatif bir işlem tanımı ile API'nin bir alt kümesini açığa çıkarma {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Yukarıdaki örnekte, `MyInput`'a geçirilen ref, orijinal DOM input öğesine iletilir. Bu, ebeveyn bileşenin `focus()` çağrısı yapmasına olanak tanır. Ancak, bu aynı zamanda ebeveyn bileşenin başka bir şey yapmasına da izin verir--örneğin, CSS stillerini değiştirmek. Nadir durumlarda, maruz kalan işlevselliği kısıtlamak isteyebilirsiniz. Bunu [`useImperativeHandle`](/reference/react/useImperativeHandle) ile yapabilirsiniz:

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Sadece focus'u ortaya çıkarın
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>İnput'a odaklan</button>
    </>
  );
}
```

</Sandpack>

Burada, `MyInput` içindeki `realInputRef`, gerçek input DOM düğümünü tutar. Ancak, [`useImperativeHandle`](/reference/react/useImperativeHandle) React'e, ebeveyn bileşene ref'in değeri olarak özel bir nesne sağlamasını söyler. Böylece `Form` bileşeni içindeki `inputRef.current` yalnızca `focus` metoduna sahip olacaktır. Bu durumda, ref "handle"'ı DOM düğümü değil, [`useImperativeHandle`](/reference/react/useImperativeHandle) çağrısı içinde oluşturduğunuz özel nesnedir.

</DeepDive>

## React refleri ne zaman ekler? {/*when-react-attaches-the-refs*/}

React'te her güncelleme [iki aşamaya](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) ayrılır:

* React **render etme** esnasında ekranda ne olması gerektiğini anlamak için bileşenlerinizi çağırır.
* React **commit** esnasında değişiklikleri DOM'a uygular.

Genel olarak render etme esnasında ref'lere erişmek [istemezsiniz](/learn/referencing-values-with-refs#best-practices-for-refs). Bu, DOM elemanlarını tutan ref'ler için de geçerlidir. İlk render esnasında DOM elemanları henüz oluşturulmadığında `ref.current`, `null` olacaktır. Güncellemelerin render edilmesi esnasında DOM elemanları henüz güncellenmedi. Bu yüzden onları okumak için çok erken.

React commit esnasında `ref.current` ayarını yapar. React DOM'u güncellemeden önce etkilenen `ref.current` değerlerini `null` olarak ayarlar. DOM'u güncelledikten sonra React hemen ilgili DOM elemanını ayarlar.

**Ref'lere genellikle olay yöneticisinden erişirsiniz.** Ref ile bir şey yapmak istiyorsunuz ancak bunu yapmak için belirli bir olay yoksa bir Effect'e ihtiyacınız olabilir. Sonraki sayfalarda Effect'lerden bahsedeceğiz.

<DeepDive>

#### State güncellemelerini flushSync ile senkronize bir şekilde temizleme {/*flushing-state-updates-synchronously-with-flush-sync*/}

Yeni bir yapılacak iş ekleyen ve ekranı listenin son alt ögesine kadar kaydıran bir kod düşünün. Her zaman son eklenenden *hemen önceki* yapılacak işe nasıl kaydırıldığına dikkat edin:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Sorun şu iki satırda:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React'te [state güncellemeleri sıraya alınır.](/learn/queueing-a-series-of-state-updates) Genellikle istediğiniz budur. Ancak burada bir soruna neden olur çünkü `setTodos` DOM'u hemen güncellemez. Bu yüzden listeyi son elemanına doğru kaydırdığınızda yapılacaklar henüz eklenmemiştir. Bu nedenle kaydırma her zaman bir eleman kadar geride kalır.

Bu sorunu gidermek için React'i DOM'u eşzamanlı olarak güncellemeye ("flush") zorlayabilirsiniz. Bunu yapmak için `flushSync`'i `react-dom`'dan içeri aktarın ve **state güncellemesini** `flushSync`'un içinde çağırın:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Bu yöntem React'e `flushSync`'e yazılmış kod çalıştırıldıktan hemen sonra DOM'u eşzamanlı olarak güncellemesini söyler. Sonuç olarak son elediğiniz yapılacaklar kaydırma yapmaya çalıştığınız zaman zaten DOM'da olacaktır:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Ref'ler ile DOM manipülasyonu için en iyi uygulamalar {/*best-practices-for-dom-manipulation-with-refs*/}

Ref'ler kaçış kapısıdır. Bunu sadece "React'in dışına çıkmanız" gerektiğinde kullanmalısınız. Bunun yaygın örnekleri arasında focus yönetimi, kaydırma konumu veya React'in göstermediği tarayıcı API'lerini çağırmak yer alır.

Focus ve kaydırma gibi işlemlere bağlı kalırsanız herhangi bir sorunla karşılaşmazsınız. Ancak DOM'u manuel olarak **değiştirmeye** çalışırsanız React'in yaptığı değişikliklerle çakışma riskiyle karşı karşıya kalabilirsiniz.

Bu sorunu göstermek için aşağıdaki örnekte karşılama mesajı ve iki buton yer almaktadır. İlk buton genellikle React'te yaptığınız [koşullu render etme](/learn/conditional-rendering) ve [state](/learn/state-a-components-memory) kullanarak değerini değiştirmedir. İkinci buton React'in kontrolü dışındaki DOM'dan zorla kaldırmak için [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)'sini kullanır.

Birkaç kez "Toggle with setState"e tıklamayı deneyin. Mesaj kaybolmalı ve tekrar görünmelidir. Ardından "Remove from the DOM"a tıklayın. Bu onu zorla kaldıracaktır. Son olarak "Toggle with setState"e tıklayın:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM elemanını manuel olarak kaldırdıktan sonra tekrar göstermek için `setState`'i kullanmaya çalışmak tutarsızlığa neden olur. Bunun nedeni DOM'u değiştirmiş olmanız ve React'in bunu doğru bir şekilde yönetmeye nasıl devam edeceğini bilmemesidir.

**React tarafından yönetilen DOM elemanlarını değiştirmekten kaçının.** React tarafından yönetilen elemanlarda değişiklik yapmak, alt elemanlar eklemek veya elemanları kaldırmak tutarsız görsel sonuçlara veya yukarıdaki gibi tutarsızlıklara neden olabilir.

Ancak bu hiç yapamayacağınız anlamına gelmez. Dikkat gerektirir. **React'in güncellemek için bir _nedeni olmayan_ DOM bölümlerini güvenle değiştirebilirsiniz.** Örneğin JSX'te bazı `<div>` elemanları her zaman boşsa React'in alt listesine dokunmak için bir nedeni olmayacaktır. Bu nedenle elemanları buraya manuel olarak eklemek veya kaldırmak güvenlidir.

<Recap>

- Ref'ler genel bir kavramdır ancak çoğu zaman bunları DOM elemanlarını tutmak için kullanırsınız.
- React'e `<div ref={myRef}>` elemanını geçerek `myRef.current`'a bir DOM elemanı koymasını söylersiniz.
- Genellikle DOM elemanlarına odaklama, kaydırma veya ölçme gibi zararsız işlevler için ref'leri kullanırsınız.
- Bir bileşen varsayılan olarak DOM elemanlarını göstermez. `forwardRef` kullanarak ve ikinci `ref` parametresini belirli bir elemana geçirerek bir DOM elemanını göstermeyi seçebilirsiniz.
- React tarafından yönetilen DOM elemanlarını değiştirmekten kaçının.
- React tarafından yönetilen DOM elemanlarını değiştirmek isterseniz React'in güncellemek için bir nedeni olmayan kısımlarını değiştirin.

</Recap>



<Challenges>

#### Videoyu oynat ve duraklat {/*play-and-pause-the-video*/}

Bu örnekte buton, yürütme ve duraklatma işlemi arasında geçiş yapmak için state değişkenini değiştirir. Ancak videoyu gerçekten oynatmak ve duraklatmak için state geçişi yeterli değildir. Ayrıca `<video>` için DOM elemanında [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ve [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) elemanlarını çağırmanız gerekir. Buna bir ref ekleyin ve butonun çalışmasını sağlayın.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Ekstra bir zorluk için kullanıcı videoyu sağ tıklatıp yerleşik tarayıcı medya kontrollerini kullanarak oynatsa bile "Play" düğmesini videonun oynatılıp oynatılmadığıyla ilgili senkronize halde tutun. Bunu yapmak için videoda `onPlay` ve `onPause` olayını dinlemek isteyebilirsiniz.

<Solution>

Bir ref bildirin ve onu `<video>` elemanına koyun. Ardından bir sonraki state'e bağlı olarak olay yöneticisinde `ref.current.play()` ve `ref.current.pause()` elemanlarını çağırın.

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
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Yerleşik tarayıcı kontrollerini yönetmek için `<video>` elemenanına `onPlay` ve `onPause` işleyicileri ekleyebilir ve bunlardan `setIsPlaying`'i çağırabilirsiniz.  Bu şekilde kullanıcı videoyu tarayıcı kontrollerini kullanarak oynatırsa state buna göre ayarlanır.

</Solution>

#### Arama alanına odaklanma {/*focus-the-search-field*/}

"Search" butonuna tıklamayı odağı alana getirecek şekilde yapın.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Input'a bir ref ekleyin ve odaklamak için DOM elemanına `focus()`'u çağırın:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Bir resim galerisini kaydırma {/*scrolling-an-image-carousel*/}

Bu carousel de aktif görüntüyü değiştiren bir "Next" butonu bulunur. Galeriyi kaydırdığınızda aktif görüntüyü yatay olarak kaydırır. Aktif görüntünün DOM elemanında [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) elemanını çağırmak isteyeceksiniz:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Bu alıştırma için her resme ref vermenize gerek yoktur. Şu anda aktif olan görüntüye veya listenin kendisine ref vermek yeterli olacaktır. Kaydırmadan *önce* DOM'un güncellendiğinden emin olmak için `flushSync` kullanın.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Bir `selectedRef` bildirebilir ve ardından bunu yalnızca geçerli görüntüye koşullu olarak iletebilirsiniz:

```js
<li ref={index === i ? selectedRef : null}>
```

Görüntünün seçili olduğu anlamına gelen `index === i` olduğunda `<li>`, `selectedRef`'i alacaktır. React `selectedRef.current` elemanının her zaman doğru DOM elemanını gösterdiğinden emin olacaktır.

Kaydırma işleminden önce DOM'u güncellemeye zorlamak için `flushSync`'in gerekli olduğunu unutmayın. Aksi takdirde `selectedRef.current` her zaman önceden seçilen elemanı gösterir.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Arama alanını ayrı bileşenlerle odaklama {/*focus-the-search-field-with-separate-components*/}

"Search" butonuna tıklamayı odağı alana getirecek şekilde yapın. Her bileşenin ayrı bir dosyada tanımlandığını ve dosyanın dışına taşınmaması gerektiğini unutmayın. Bunları nasıl birbirine bağlarsınız?

<Hint>

Kendi bileşeniniz olan `SearchInput` gibi bir bileşenden bir DOM düğümünü dışa açmak için `ref`'i bir prop olarak iletmeniz gerekecek.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton`'a bir `onClick` prop'u eklemeniz ve `SearchButton` bunu tarayıcıya `<button>`'a iletmesini sağlamanız gerekir. Ayrıca `<SearchInput>`'a bir ref ileteceksiniz bu da onu asıl `<input>`'a iletecek ve onu dolduracaktır. Son olarak tıklama yöneticisinde bu ref içinde depolanan DOM elemanına `focus`'u çağırmalısınız. 

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
