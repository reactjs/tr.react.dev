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

Başka bir çözüm **bir fonksiyonu `ref` özelliğine iletmektir.** Buna [`ref` callback](/reference/react-dom/components/common#ref-callback) denir. React ref'i ayarlama zamanı geldiğinde callback fonksiyonunu DOM elemanı ile çağıracak ve ref'i temizleme zamanı geldiğinde `null` değeri ile çağıracaktır. Bu, kendi dizinizi veya [Map'inizi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) korumanıza ve indeksine veya  kimliğine göre herhangi bir ref'e erişmenize olanak sağlar.

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
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat, node);
                } else {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
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

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  }
}
```

</Sandpack>

Bu örnekte `itemsRef` tek bir DOM elemanını tutmaz. Bunun yerine öge kimliğinden DOM elemanına bir [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) tutar. ([Ref'ler herhangi bir değeri tutabilir!](/learn/referencing-values-with-refs)) Her liste ögesindeki [`ref` callback'i](/reference/react-dom/components/common#ref-callback) Map'i güncellemeye özen gösterir:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Add to the Map
      map.set(cat, node);
    } else {
      // Remove from the Map
      map.delete(cat);
    }
  }}
>
```

Bu daha sonra Map'ten tek tek DOM elemanlarını okumamıza olanak tanır.

<Canary>

This example shows another approach for managing the Map with a `ref` callback cleanup function.

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

</Canary>

</DeepDive>

## Başka bir bileşenin DOM elemanlarına erişme {/*accessing-another-components-dom-nodes*/}

`<input />` gibi bir tarayıcı elemanı çıktısı veren yerleşik bir bileşene ref koyduğunuzda React bu ref'in `current` özelliğini karşılık gelen DOM elemanına ayarlar ( tarayıcıdaki asıl `<input />` gibi).

Ancak `<MyInput />` gibi **kendi** bileşeninize ref koymaya çalışırsanız varsayılan olarak `null` değeri alırsınız. İşte bunu gösteren bir örnek. Butona tıklamanın input'a nasıl **odaklamadığına** dikkat edin:

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Sorunu fark etmenize yardımcı olmak için React ayrıca konsola bir hata yazdırır:

<ConsoleBlock level="error">

Uyarı: Fonksiyon bileşenlerine ref verilemez. Bu ref'e erişme girişimleri başarısız olacaktır. React.forwardRef()'i mi kullanmak istediniz?

</ConsoleBlock>

Bunun nedeni React'in varsayılan olarak bir bileşenin diğer bileşenlerin DOM elemanlarına erişmesine izin vermemesidir. Kendi alt elemanı için bile değil! Bu kasıtlı. Ref, az miktarda kullanılması gereken bir kaçış kapısıdır. _another_ bileşeninin DOM elemanlarını manuel olarak manipüle etmek kodu işlevsiz hale getirebilir.

Bunun yerine DOM elemanlarını açığa çıkarmak isteyen bileşenlerin bu davranışı **seçmesi gerekir**. Bir bileşen ref'in alt elemanlarından birine "forwards" belirtebilir. `MyInput`, `forwardRef` API'sini şu şekilde kullanabilir:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Çalışma şekli şöyledir:

1. `<MyInput ref={inputRef} />` React'e, karşılık gelen DOM elemanını `inputRef.current`'a koymasını söyler. Ancak bunu seçmek `MyInput` bileşenine bağlıdır. Varsayılan olarak bunu yapmaz.
2. `MyInput` bileşeni `forwardRef` kullanılarak tanımlanır. `props`'tan sonra bildirilen **ikinci `ref`, parametre olarak yukarıdan `inputRef`'i almayı seçer.**
3. `MyInput` aldığı `ref`'i içindeki `<input>`'a iletir.

Şimdi input'a odaklamak için butona tıklamak işe yarar:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Tasarım sistemlerinde button, input gibi düşük seviyeli bileşenlerin ref'leri DOM elemanlarına iletmeleri yaygın bir modeldir. Öte yandan formlar, listeler veya sayfa bölümleri gibi üst düzey bileşenler DOM yapısına yanlışlıkla eklenen bağımlılıkları önlemek için genellikle DOM elemanlarını göstermez.

<DeepDive>

#### İmperatif bir işlem tanımı ile API'nin bir alt kümesini açığa çıkarma {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Yukarıdaki örnekte `MyInput` orijinal DOM input elemanını ortaya çıkarır. Bu, üst bileşenin üzerinde `focus()`'u aramasına izin verir. Ancak bu, üst bileşenin başka bir şey yapmasına da izin verir örneğin CSS stillerini değiştirmek. Nadir durumlarda açığa çıkan işlevselliği kısıtlamak isteyebilirsiniz. Bunu `useImperativeHandle` ile yapabilirsiniz:

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Sadece focus'u ortaya çıkarın
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Burada `MyInput` içindeki `realInputRef` asıl input DOM elemanını tutar. Bununla birlikte `useImperativeHandle`, React'e üst bileşene bir ref değeri olarak kendi özel nesnenizi sağlamasını söyler. Dolayısıyla `Form` bileşeni içindeki `inputRef.current` sadece `focus` metoduna sahip olacaktır. Bu durumda "handle" ref'i DOM elemanı değildir ancak `useImperativeHandle` çağrısı içinde oluşturduğunuz özel nesnedir.

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

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
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

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
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

`SearchInput` gibi kendi bileşeninizden bir DOM elemanı gösterebilmek için `forwardRef`'e ihtiyacınız olacak.

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
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
