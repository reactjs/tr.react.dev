---
title: useState
---

<Intro>

`useState`, bileşeninize [state değişkeni](/learn/state-a-components-memory) eklemenizi sağlayan bir React Hook'udur.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Bir [state değişkeni](/learn/state-a-components-memory) bildirmek için bileşeninizin en üstünde `useState` çağırın.

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

Ortak düşünce, [dizi yapı çözmeyi (array destructuring)](https://javascript.info/destructuring-assignment) kullanarak state değişkenlerini `[something, setSomething]` olarak adlandırmaktır.

[Aşağıda daha fazla örnek bulabilirsiniz.](#usage)

#### Parametreler {/*parameters*/}

* `initialState`: Başlangıçta state'in alacağı değerdir. Herhangi bir türden bir değer olabilir ancak fonksiyonlar için özel bir davranış vardır. Bu argüman ilk render'dan sonra görmezden gelinir.
  * `initialState` olarak bir fonksiyon iletirseniz, bu fonksiyona _başlatıcı fonksiyon_ olarak davranılacaktır. Saf olmalıdır, argüman olmamalıdır ve herhangi bir türden değer döndürebilmelidir. React, bileşeni başlatırken başlatıcı fonksiyonunuzu çağıracak ve döndürülen değeri başlangıç state'i olarak saklayacaktır. [Aşağıdaki örneği inceleyin.](#avoiding-recreating-the-initial-state)

#### Döndürülenler {/*returns*/}

`useState` her zaman iki değere sahip bir dizi döndürür.

1. Şu anki state. İlk render sırasında, ilettiğiniz `initialState` değeri ile aynıdır.
2. [`set` fonksiyonu](#setstate) state'i başka bir değer ile güncellemenizi ve yeniden render tetiklemenizi sağlar.

#### Uyarılar {/*caveats*/}

* `useState` bir Hook'tur, bu yüzden sadece **bileşeninizin üst seviyesinde** ya da kendi Hook'larınızda çağırabilirsiniz. Döngülerin ya da koşullu ifadelerin içinde çağıramazsınız. Eğer buna ihtiyacınız varsa, yeni bir bileşen çıkarın ve state'i o bileşene taşıyın.
* Strict Modda React, [kazara oluşan saf olmayan şeyleri bulmanıza yardımcı olmak için](#my-initializer-or-updater-function-runs-twice) **başlatıcı fonksiyonunuzu iki defa** çağıracaktır. Bu sadece geliştirme sırasında görülen bir davranıştır ve son ürünü etkilemez. Eğer başlatıcı fonksiyonunuz saf ise (ki öyle olmalıdır), bu olması gereken davranışı etkilememelidir. Yapılan çağrılardan birinin sonucu görmezden gelinecektir.

---

### `setSomething(nextState)` gibi `set` fonksiyonları {/*setstate*/}

`useState` tarafından döndürülen `set` fonksiyonu state'i başka bir değere güncellemenizi ve yeniden render tetiklemenizi sağlar. Bir sonraki state'i direkt olarak ya da önceki state'ten hesaplayan bir fonksiyon iletebilirsiniz:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parametreler {/*setstate-parameters*/}

* `nextState`: State'in olmasını istediğiniz değerdir. Herhangi bir türden değer olabilir ama fonksiyonlar için özel bir davranış vardır.
  * Eğer `nextState` olarak fonksiyon iletirseniz, o fonksiyon _güncelleyici fonksiyon_ olarak görev alacaktır. Saf olmak zorundadır, bekleme durumunu tek argümanı olarak almalı ve bir sonraki state'i döndürmelidir. React, güncelleyici fonksiyonunuzu sıraya koyacaktır ve bileşeninizi yeniden render edecektir. Bir sonraki render sırasında React, sıradaki güncelleyicilerin hepsini bir önceki state'e uygulayarak bir sonraki state'i hesaplayacaktır. [Aşağıdaki örneği inceleyin.](#updating-state-based-on-the-previous-state)

#### Döndürülenler {/*setstate-returns*/}

`set` fonksiyonlarının dönüş değeri yoktur.

#### Uyarılar {/*setstate-caveats*/}

* `set` fonksiyonu **state değişkenini sadece *sonraki* render için günceller.** Eğer state değişkenini `set` fonksiyonunu çağırdıktan sonra okursanız, [hala çağrınızdan önce ekranda gördüğünüz değeri](#ive-updated-the-state-but-logging-gives-me-the-old-value) alacaksınız.

* Eğer sağladığınız yeni değer şu anki `state` değeri ile aynıysa, ki bu [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması ile belirlenir, React **bileşeni ve alt elemanlarını yeniden render etmeyecektir.** Bu bir optimizasyon işlemidir. Her ne kadar bazı durumlarda React'in alt elemanları atlamadan önce bileşeninizi çağırması gerekse de bu durum kodunuzu etkilememelidir.

* React [state güncellemelerini toplu halde(batches) yapar.](/learn/queueing-a-series-of-state-updates) React, ekranı **tüm olay yöneticileri çalıştıktan** ve `set` fonksyionlarını çağırdıktan sonra günceller. Böylelikle tek bir olay sırasında olacak birden fazla yeniden render engellenmiş olur. Nadiren de olsa, örneğin DOM'a erişmek istediğinizde, React'ı ekranı erken güncellemeye zorlamak için [`flushSync`](/reference/react-dom/flushSync) kullanabilirsiniz.

* The `set` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* *Render sırasında* `set` fonksiyonu yalnızca mevcut render edilen bileşenin içinde çağırılabilir. React, bileşenin çıktısını görmezden gelecektir ve hemen yeni state ile birlikte render etmeyi deneyecektir. Bu modele nadiren ihtiyaç duyulur ama bunu *önceki render'lardan gelen bilgileri saklamak* için kullanabilirsiniz. [Aşağıdaki örneği inceleyin.](#storing-information-from-previous-renders)

* Strict Modda React, [kazara oluşan saf olmayan şeyleri bulmanıza yardımcı olmak için](#my-initializer-or-updater-function-runs-twice) **güncelleyici fonksiyonunuzu iki defa** çağıracaktır. Bu sadece geliştirme sırasında görülen bir davranıştır ve son ürünü etkilemez. Eğer güncelleyici fonksiyonunuz saf ise (ki öyle olmalı), bu olması gereken davranışı etkilememelidir. Yapılan çağrılardan birinin sonucu görmezden gelinecektir.

---

## Kullanım {/*usage*/}

### Bileşene state ekleme {/*adding-state-to-a-component*/}

Bir ya da birden fazla [state değişkeni](/learn/state-a-components-memory) bildirmek için bileşeninizin üst seviyesinde `useState`'i çağırın.

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

Ortak düşünce, [dizi yapı çözmeyi (destructuring)](https://javascript.info/destructuring-assignment) kullanarak state değişkenlerini `[something, setSomething]` olarak adlandırmaktır.

`useState` her zaman iki değere sahip bir dizi döndürür:

1. Bu state değişkeninin <CodeStep step={1}>şu anki state'i</CodeStep>, başlangıçta belirttiğiniz <CodeStep step={3}>başlangıç state'ine</CodeStep> eşitttir.
2. <CodeStep step={2}>`set` fonksiyonu</CodeStep> herhangi bir etkileşim sonucu state'i başka bir değerle değiştirmenizi sağlar.

Ekranda olanı güncellemek için, `set` fonksiyonunu sonraki herhangi bir state ile çağırın:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React sonraki state'i saklayacaktır, bileşeninizi yeni değerler ile render edecektir ve kullanıcı arayüzünü güncelleyecektir.

<Pitfall>

`set` fonksiyonunu çağırmak [şu anda çalışan koddaki mevcut state'i **değiştirmez**](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Hala "Taylor"!
}
```

Bu fonksiyon yalnızca *sonraki* render etme işleminden başlayarak `useState`'in ne döndüreceğini etkiler.

</Pitfall>

<Recipes titleText="Basit useState örnekleri" titleId="examples-basic">

#### Sayaç (sayı) {/*counter-number*/}

Bu örnekte `count` state değişkeni bir sayı tutmaktadır. Butona tıklamak bu sayıyı artırır.

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
      Bana {count} defa tıkladın
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Metin alanı (string) {/*text-field-string*/}

Bu örnekte `text` state değişkeni bir string tutmaktadır. Yazmaya başladığınız zaman `handleChange` fonksiyonu son input değerini tarayıcı input DOM elemanından okur ve `setText` fonksiyonu state'i güncellemek için çağrılır. Bu, aşağıdaki güncel `text` değerini göstermenizi sağlar.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('Merhaba');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Yazdığınız metin: {text}</p>
      <button onClick={() => setText('Merhaba')}>
        Sıfırla
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Onay kutusu (boolean) {/*checkbox-boolean*/}

Bu örnekte `liked` state değişkeni bir boolean tutmaktadır. Input'a tıkladığınız zaman, `setLiked` fonksiyonu, `liked` state değişkenini tarayıcı onay kutusu input'unun onaylanıp onaylanmadığına göre günceller. `liked` değişkeni onay kutusu altındaki metni render etmek için kullanılır.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        Bunu beğendim
      </label>
      <p>Bunu {liked ? 'beğendim' : 'beğenmedim'}.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (iki değişken) {/*form-two-variables*/}

Aynı bileşende birden fazla state değişkeni bildirebilirsiniz. Her state değişkeni birbirinden tamamıyla bağımsızdır.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Yaşı artır
      </button>
      <p>Selam, {name}. {age} yaşındasın.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### State'i bir önceki state'e göre güncelleme {/*updating-state-based-on-the-previous-state*/}

Varsayalım `age` state'i `42` olsun. Bu yönetici `setAge(age + 1)` fonksiyonunu üç defa çağırır:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Ancak bir tıklamadan sonra `age` değeri `45` yerine `43` olacak! Bunun nedeni ise `set` fonksiyonunu çağırmanın zaten çalışmakta olan kodda `age` state değişkenini [güncellememesidir.](/learn/state-as-a-snapshot) Yani her `setAge(age + 1)` çağrısı `setAge(43)` olur.

Bu problemi çözmek için `setAge`'e bir sonraki state yerine ***güncelleyici fonksiyon* iletebilirsiniz:**

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Burada, `a => a + 1` sizin güncelleyici fonksiyonunuzdur. <CodeStep step={1}>Bekleyen state'i</CodeStep> alır ve ondan <CodeStep step={2}>bir sonraki state'i</CodeStep> hesaplar.

React güncelleyici fonksiyonlarınızı [sıraya](/learn/queueing-a-series-of-state-updates) koyar. Daha sonra, sonraki render sırasında, bu fonksiyonları aynı sırada çağıracaktır:

1. `a => a + 1` fonksiyonu `42` sayısını bekleyen state olarak alacaktır ve sonraki state olarak `43` döndürecektir.
1. `a => a + 1` fonksiyonu `43` sayısını bekleyen state olarak alacaktır ve sonraki state olarak `44` döndürecektir.
1. `a => a + 1` fonksiyonu `44` sayısını bekleyen state olarak alacaktır ve sonraki state olarak `45` döndürecektir.

Sırada bekleyen başka güncelleme olmadığından dolayı React `45` sayısını güncel state olarak saklayacaktır.

Ortak düşünce, bekleyen state argümanını state değişkeni adının ilk harfi olarak adlandırmaktır; örneğin `age` için `a` kullanmak. Ancak, daha açıklayıcı olmasını istiyorsanız `prevAge` ya da başka bir şey kullanabilirsiniz.

React, geliştirme sırasında güncelleyici fonksiyonlarınızın [saf](/learn/keeping-components-pure) olduğunu doğrulamak için [onları iki defa çağırır.](#my-initializer-or-updater-function-runs-twice)

<DeepDive>

#### Güncelleyici kullanmak her zaman tercih edilir mi? {/*is-using-an-updater-always-preferred*/}

Eğer değiştirdiğiniz state bir önceki state'ten hesaplanıyorsa kodunuzu her zaman `setAge(a => a + 1)` olarak yazmanız size tavsiye edilmiş olabilir. Bunda bir sorun yoktur ama her zaman gerekli değildir.

Pek çok durumda bu iki yaklaşım arasında bir fark yoktur. React, tıklamalar gibi kasıtlı olarak yapılmış kullanıcı aksiyonları için `age` state değişkeninin bir sonraki tıklamadan önce güncellendiğine emin olur. Bu, tıklama yöneticisinin, olay yöneticisinin başlangıcında "eski" bir `age` değişkeni görme riski olmadığı anlamına gelir.

Ancak, aynı olay içinde birden fazla güncelleme yaparsanız, güncelleyiciler yardımcı olabilir. Ayrıca state değişkenine erişmenin sakıncalı olduğu durumlarda da faydalıdırlar (bu durumlarla yeniden render'ları optimize etmeye çalışırken karşılaşabilirsiniz).

Kod olarak kalabılık söz dizimi yerine tutarlığı tercih ediyorsanız, değiştirdiğiniz state bir önceki state'ten hesaplanıyorsa her zaman güncelleyici yazmak mantıklı olacaktır. Eğer state *başka* bir state değişkeninin önceki state'inden hesaplanıyorsa, güncelleyicileri bir nesne içine koyabilir ve [reducer kullanabilirsiniz.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="Güncelleyeci ve sonraki state'i direkt olarak iletme arasındaki fark" titleId="examples-updater">

#### Güncelleyici fonksiyonu iletme {/*passing-the-updater-function*/}

Bu örnek güncelleyici fonksiyonu iletmektedir bu yüzden "+3" butonu çalışır.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Yaşınız: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Sonraki state'i direkt olarak iletme {/*passing-the-next-state-directly*/}

Bu örnek güncelleyici fonksiyonu **iletmez** bu yüzden "+3" butonu **olması gerektiği gibi çalışmaz**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Yaşınız: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### State'teki nesneleri ve dizileri güncelleme {/*updating-objects-and-arrays-in-state*/}

State içine nesneleri ve dizileri koyabilirsiniz. React'te, state salt-okunur olarak kabul edilir bu yüzden **mevcut nesnelerinizi *mutasyona uğratmak* yerine *değiştirmelisiniz***. Örneğin, state'inizde bir `form` nesnesi varsa, onu mutasyona uğratmayın:

```js
// 🚩 State'teki nesneyi böyle mutasyona uğratmayın:
form.firstName = 'Taylor';
```

Onun yerine tüm nesneyi yenisiyle değiştirin:

```js
// ✅ State'i yeni bir nesne ile değiştirin
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Daha fazla bilgi için bu sayfaları okuyun: [state içindeki nesneleri güncelleme](/learn/updating-objects-in-state) ve [state içindeki dizileri güncelleme](/learn/updating-arrays-in-state).

<Recipes titleText="State içindeki nesnelere ve dizilere örnekler" titleId="examples-objects">

#### Form (nesne) {/*form-object*/}

Bu örnekte `form` state değişkeni bir nesne tutmaktadır. Her input'un tüm formun bir sonraki state'i ile birlikte `setForm` fonksiyonunu çağıran bir yöneticisi vardır. `{ ...form }` spread sözdizimi state nesnesini mutasyona uğratmak yerine değiştirilmesini sağlar.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        Ad:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Soyad:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        E-posta:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (iç içe nesneler) {/*form-nested-object*/}

Bu örnekte state iç içedir. İç içe state'i güncellediğinizde, güncellediğiniz state nesnesinin ve aynı zamanda o nesneyi "içeren" diğer nesnelerin bir kopyasını oluşturmanız gerekmektedir. Daha fazla bilgi almak için [iç içe nesneleri güncelleme](/learn/updating-objects-in-state#updating-a-nested-object) sayfasını okuyun.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Ad:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Başlık:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Şehir:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Resim:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        {person.name}
        {' tarafindan '}
        <i>{person.artwork.title}</i>
        <br />
        ({person.artwork.city} şehrinde)
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Liste (dizi) {/*list-array*/}

Bu örnekte `todos` state değişkeni bir dizi tutmaktadır. Her buton yöneticisi dizinin bir sonraki versiyonu ile `setTodos` fonksiyonunu çağırır. `[...todos]` spread sözdizimi, `todos.map()` ve `todos.filter()` metodları state dizisini mutasyona uğratmak yerine değiştirilmesini sağlar.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Süt al', done: true },
  { id: 1, title: 'Tacoları ye', done: false },
  { id: 2, title: 'Çay demle', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Yapılacakları ekle"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Immer kullanarak kısa ve öz güncelleme mantığı yazmak {/*writing-concise-update-logic-with-immer*/}

Eğer dizileri ve nesneleri mutasyona uğratmadan güncellemek yorucu bir hale geldiyse, tekrar eden kodu azaltmak için [Immer](https://github.com/immerjs/use-immer) gibi bir kütüphane kullanabilrsiniz. Immer ile nesneleri mutasyona uğratıyormuş gibi kısa ve öz kod yazabilirsiniz ama Immer arka planda değiştirilemez(immutable) güncellemeler yapmaktadır.

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Görülecek Sanat Eserleri Listesi</h1>
      <h2>Görmek istediğim eserler listesi:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Başlangıç state'ini yeniden yaratmaktan kaçınma {/*avoiding-recreating-the-initial-state*/}

React başlangıç state'ini bir defa kaydeder ve sonraki render'larda görmezden gelir.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()` fonksiyonunun sonucu sadece başlangıç render'ında kullanılmasına rağmen, bu fonksiyonu hala her render'da yeniden çağırmaktasınız. Eğer bu fonksiyon büyük diziler ya da pahalı hesaplamalar yapıyorsa, bu israfa neden olabilir.

Bu durumu çözmek için bu fonksiyonu, `useState`'e **_başlatıcı_ fonksiyon olarak** iletebilirsiniz:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Burada `createInitialTodos` olarak ilettiğinize dikkat edin. Yani burada `createInitialTodos()` fonksiyonunu çağırmanın sonucunu değil *fonksiyonun kendisini* iletiyoruz. Eğer `useState`'e fonksiyon iletirseniz, React bu fonksiyonu sadece başlangıçta çağıracaktır.

React, geliştirme sırasında başlatıcıların [saf](/learn/keeping-components-pure) olduğunu doğrulamak için [onları iki defa çağırabilir.](#my-initializer-or-updater-function-runs-twice)

<Recipes titleText="Başlatıcı iletme ve direkt olarak başlangıç state'ini iletme arasındaki farklar" titleId="examples-initializer">

#### Başlatıcı fonksiyon iletme {/*passing-the-initializer-function*/}

Bu örnekte başlatıcı fonksiyon iletilmektedir yani `createInitialTodos` fonksiyonu yalnızca başlangıçta çalışır. Input'a yazdığınızda olduğu gibi, bileşen yeniden render edildiğinde tekrar çalışmazlar.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Ekle</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Başlangıç state'ini direkt olarak iletme {/*passing-the-initial-state-directly*/}

Bu örnek başlatıcı fonksiyonunu **iletmez**. Input'a bir şey yazdığınızda olduğu gibi `createInitialTodos` fonksiyonu her render'da çalışır. Davranışta gözle görülür bir değişiklik yoktur ama bu kodun verimliliği daha düşüktür.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Ekle</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### State'i anahtar ile sıfırlama {/*resetting-state-with-a-key*/}

[Listeleri render ederken](/learn/rendering-lists) sık sık `key`(`anahtar`) niteliğini göreceksiniz. Ancak, bu başka bir amaca da hizmet etmektedir.

**Bir bileşene farklı bir `key` ileterek onun state'ini** sıfırlayabilirsiniz. Bu örnekte Sıfırla butonu, `Form`'a `key` olarak ilettiğimiz `version` state değişkenini değiştirir. `key` değiştiğinde React, `Form` bileşenini sıfırdan yeniden yaratır (ve tüm alt elemanlarını) böylelikle state sıfırlanmış olur.

Daha fazla bilgi edinmek için [state'i korumak ve sıfırlamak](/learn/preserving-and-resetting-state) sayfasını inceleyin.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Sıfırla</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Selam, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Önceki render'lardaki bilgiyi saklama {/*storing-information-from-previous-renders*/}

State'i genellikle olay yöneticileri içinde güncellersiniz. Ancak, bazı nadir durumlarda state'i render'a cevap olarak ayarlamak isteyebilirsiniz -- örneğin, bir prop değiştiğinde state değişkenini değiştirmek isteyebilirsiniz.

Çoğu durumda buna ihtiyacınız yoktur:

* **Eğer ihtiyacınız olan değer tamamen mevcut prop'lar ya da diğer state'ler kullanılarak hesaplanabiliyorsa, [gereksiz state'i tamamen kaldırın.](/learn/choosing-the-state-structure#avoid-redundant-state)** Sık sık yeniden hesaplama yapmaktan endişeliyseniz, [`useMemo` Hook'u](/reference/react/useMemo) size yardımcı olabilir.
* Tüm bileşen ağacının state'ini sıfırlamak istiyorsanız, [bileşeninize farklı bir `key` iletin.](#resetting-state-with-a-key)
* Eğer mümkünse, kullandığınız tüm state'leri olay yöneticileri ile güncelleyin.

Bunların hiçbirine uymayan nadir bir durum varsa, bileşeniniz render edilirken `set` fonksiyonunu çağırarak şu ana kadar render edilmiş değerlere dayalı olarak state'i güncellemek için kullanabileceğiniz bir model vardır.

Aşağıdaki bunu gösteren bir örnektir. `CountLabel` bileşeni kendisine iletilen `count` prop'unu render etmektedir:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Diyelim ki sayacın son değişiklikten beri *arttığını ya da azaldığını* göstermek istiyorsunuz. `count` prop'u size bunu söylemez -- prop'un bir önceki değeri hakkında bilgiyi siz takip etmelisiniz. `prevCount` state bileşenini önceki değerleri takip etmek için ekleyin. Sayacın arttığınımı yoksa azaldığınımı takip etmek için yeni bir `trend` state değişkeni ekleyin. `prevCount` ve `count` değerlerini kıyaslayın ve değeler eşit değilse,`prevCount` ve `trend` değerlerini güncelleyin. Şimdi mevcut sayaç prop'unu ve *son render'dan itibaren nasıl değiştiğini* gösterebilirsiniz.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Artır
      </button>
      <button onClick={() => setCount(count - 1)}>
        Azalt
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'artıyor' : 'azalıyor');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>Sayaç {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Şunu unutmayın ki eğer `set` fonksiyonunu render esnasında çağırırsanız, bu fonksiyon `prevCount !== count` gibi bir koşullu ifadenin içinde olmak zorundadır ve koşullu ifadenin içinde `setPrevCount(count)` gibi bir çağrı olmak zorundadır. Aksi halde, bileşeniniz sonsuz bir döngü içinde çökene kadar yeniden render edilecektir. Aynı zamanda, *şu anda render edilen* bileşenin state'ini sadece bu şekilde güncelleyebilirsiniz. *Başka* bir bileşenin `set` fonksiyonunu render esnasında çağırmak bir hatadır. Son olarak, `set` fonksiyonu çağrınızın [state'i mutasyona uğratmadan güncellemesine](#updating-objects-and-arrays-in-state) dikkat etmelisiniz -- bu, sizin diğer [saf fonksiyon](/learn/keeping-components-pure) kurallarını çiğneyebileceğiniz anlamına gelmez.

Bu modeli anlaması zor olabilir ve genel olarak bu modelden kaçınılması en yararlısıdır. Ancak, state'i Efekt içinde güncellemekten daha iyidir. `set` fonksiyonunu render esnasında çağırdığınızda React, bileşeniniz bir `return` ifadesine sahip olduktan hemen sonra ve alt elemanları render etmeden önce bu bileşeni yeniden render edecektir. Böylelikle, alt elemanların iki defa render edilmesine gerek olmayacaktır. Bileşeninizin geri kalan fonksiyonu hala çalışacaktır (ve sonuç görmezden gelinecektir). Eğer koşullu ifadeniz tüm Hook çağrılarının altındaysa, erken bir `return;` ifadesi ekleyerek render etmeyi erken sıfırlayabilirsiniz.

---

## Sorun giderme {/*troubleshooting*/}

### State'i güncelledim ama konsolda eski değeri görüyorum {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

`set` fonksiyonunu çağırmak **çalışan koddaki state'i değiştirmez**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // 1 ile yeniden render iste 
  console.log(count);  // Hala 0!

  setTimeout(() => {
    console.log(count); // Bu da 0!
  }, 5000);
}
```

Bunun nedeni [state'in anlık görüntü olarak davranmasıdır.](/learn/state-as-a-snapshot) State'i güncellemek yeni state değeri ile başka bir render isteği gönderir ama bu halihazırda çalışan olay yöneticileri içindeki JavaScript `count` değişkenini etkilemez.

Eğer bir sonraki state'i kullanmak istiyorsanız, değeri `set` fonksiyonuna iletmeden önce başka bir değişkende saklayabilirsiniz:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### State'i güncelledim ama ekran güncellenmiyor {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React, **eğer bir sonraki state'iniz bir önceki ile eşitse güncellemeyi** görmezden gelecektir. Bu karşılaştırma [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile yapılır. Bu durum genellikle state içindeki nesne ya da diziyi direkt olarak değiştirdiğiniz zaman meydana gelir:

```js
obj.x = 10;  // 🚩 Yanlış: nesneyi mutasyona uğratır
setObj(obj); // 🚩 Hiçbir şey yapmaz
```

Var olan bir `obj` nesnesini mutasyona uğrattınız ve `setObj` fonksiyonuna geri ilettiniz ve bu yüzden React güncellemeyi görmezden geldi. Bunu düzeltmek için, her zaman [state içindeki nesneleri ve dizileri _mutasyona uğratmak_ yerine _değiştirdiğinizden_ ](#updating-objects-and-arrays-in-state) emin olmalısınız:

```js
// ✅ Doğru: yeni bir nesne yaratılır
setObj({
  ...obj,
  x: 10
});
```

---

### Bir hata alıyorum: "Çok fazla yeniden render" {/*im-getting-an-error-too-many-re-renders*/}

Şunu söyleyen bir hata alabilirsiniz: `Çok fazla yeniden render. React, sonsuz döngülerin önüne geçmek için yapılan render'ların sayısını kısıtlar.` Genel olarak bu, state'i *render etme esnasında* koşulsuz olarak değiştirdiğiniz anlamına gelir, yani bileşeniniz bir döngüye girer: render et, state'i değiştir (ki bu da bir render'a neden olur), render et, state'i değiştir (ki bu da bir render'a neden olur) ve bu böyle gider. Bu çoğunlukla olay yöneticisi içindeki bir hatadan kaynaklanmaktadır:

```js {1-2}
// 🚩 Yanlış: yöneticiyi render esnasında çağırır
return <button onClick={handleClick()}>Bana tıkla</button>

// ✅ Doğru: olay yöneticisini iletir
return <button onClick={handleClick}>Bana tıkla</button>

// ✅ Doğru: satır içi fonksiyon iletir
return <button onClick={(e) => handleClick(e)}>Bana tıkla</button>
```

Eğer hatanın nedenini bulamıyorsanız, konsolda hatanın yanındaki ok tuşuna basın ve hataya neden olan `set` fonksiyonu çağrısını JavaScript içinde bulun.

---

### Başlatıcım veya güncelleyici fonksiyonum iki defa çalışıyor {/*my-initializer-or-updater-function-runs-twice*/}

[Strict Modda](/reference/react/StrictMode) React, bazı fonksiyonlarınızı bir yerine iki defa çağıracaktır:

```js {2,5-6,11-12}
function TodoList() {
  // Bu bileşen fonksiyonu her render'da iki defa çalışacaktır.

  const [todos, setTodos] = useState(() => {
    // Bu başlatıcı fonksiyon başlangıç sırasında iki defa çalışacaktır.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Bu güncelleyici fonksiyonu her bir tıklama için iki defa çalışacaktır.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Bu beklendik bir durumdur ve kodunuzda bir soruna neden olmamalıdır.

Bu **sadece geliştirme sırasında** olan davranış [bileşenlerinizi saf tutmanıza](/learn/keeping-components-pure) yardımcı olur. React, yapılan çağrılardan birinin sonucunu kullanır ve diğer çağrının sonucunu görmezden gelir. Bileşeniniz, başlatıcınız ve güncelleyici fonksiyonunuz saf olduğu sürece bu durum mantığınızı etkilememelidir. Ancak bu davranış, saf olmayan fonksiyonlarınız varsa, yaptığız hataları bulmanıza yardımcı olur.

Örneğin, bu saf olmayan güncelleyici fonksiyonu state içindeki diziyi mutasyona uğratmaktadır:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Yanlış: state'i mutasyona uğratır
  prevTodos.push(createTodo());
});
```

React güncelleme fonksiyonlarını iki defa çağırdığından dolayı, yapılacak işin iki kere eklendiğini göreceksiniz. Yani burada bir hata olduğunu bileceksiniz. Bu örnekteki hatayı, [diziyi mutasyona uğratmak yerine değiştirerek](#updating-objects-and-arrays-in-state) çözebilirsiniz:

```js {2,3}
setTodos(prevTodos => {
  // ✅ Doğru: yeni state ile değiştirilir
  return [...prevTodos, createTodo()];
});
```

Şimdi güncelleme fonksiyonu saf olduğuna göre, fonksiyonu iki defa çağırmak davranışta herhangi bir farklılığa yol açmayacaktır. Bu yüzden React'in fonksiyonu iki defa çağırması hataları bulmanıza yardımcı olur. **Sadece bileşen, başlatıcı ve güncelleyici fonksiyonlar saf olmalıdır.** Olay yöneticilerinin saf olmasına gerek yoktur yani React olay yöneticilerinizi asla iki defa çağırmayacaktır.

Daha fazla bilgi edinmek için [bileşenleri saf tutmak](/learn/keeping-components-pure) sayfasını okuyabilirsiniz.

---

### State'e bir fonksiyon koymak istiyorum ama fonksiyon çağrılıyor {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

State içine bir fonksiyonu böyle koyamazsınız:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Bir fonksiyon ilettiğinizden dolayı React, `someFunction` fonksiyonunun [başlatıcı fonksiyon](#avoiding-recreating-the-initial-state) olduğunu düşünecektir ve `someOtherFunction` fonksiyonu bir [güncelleyi fonksiyondur](#updating-state-based-on-the-previous-state), bu yüzden React bu fonksiyonu çağırmaya ve sonucunu saklamaya çalışacaktır. Bir fonksiyonu *saklamanın* asıl yolu, `() =>` ifadesini her iki durumda da fonksiyondan önceye eklemektir. Böylelikle React, ilettiğiniz fonksiyonları saklayacaktır.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
