---
title: useMemo
---

<Intro>

`useMemo` yeniden render işlemleri arasında bir hesaplamanın sonucunu önbelleğe almanızı sağlayan bir React Hook'udur.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useMemo` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Referans {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Yeniden render işlemleri arasında bir hesaplamayı önbelleğe almak için bileşeninizin en üst seviyesinde `useMemo`'yu çağırın:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Aşağıda daha fazla örnek görebilirsiniz.](#usage)

#### Parametreler {/*parameters*/}

* `calculateValue`: Önbelleğe almak istediğiniz değeri hesaplayan fonksiyon. Saf fonksiyon olmalı, argüman almamalı ve herhangi bir türde bir değer döndürmelidir. React ilk render sırasında fonksiyonunuzu çağıracaktır. Sonraki render'larda, bağımlılıklar (`dependencies`) son render'dan bu yana değişmediyse React aynı değeri tekrar döndürecektir. Aksi takdirde, `calculateValue`'yu çağıracak, sonucunu döndürecek ve daha sonra tekrar kullanılabilmesi için saklayacaktır.

* `dependencies`: `calculateValue` kodu içinde referans edilen tüm reaktif değerlerin listesidir. Reaktif değerler; prop'ları, state'i ve doğrudan bileşen gövdenizin içinde tanımlanan tüm değişkenleri ve fonksiyonları içerir. Eğer linter'ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), her reaktif değerin bir bağımlılık olarak doğru şekilde belirtildiğini doğrulayacaktır. Bağımlılıklar listesi sabit sayıda öğeye sahip olmalı ve `[dep1, dep2, dep3]` gibi satır içi yazılmalıdır. React, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırmasını kullanarak her bağımlılığı önceki değeriyle karşılaştıracaktır.

#### Döndürülen Değerler {/*returns*/}

İlk render işleminde `useMemo`, `calculateValue` çağrısının sonucunu hiçbir argüman olmadan döndürür.

Sonraki render işlemleri sırasında, ya son render işleminde depolanmış olan değeri döndürür (bağımlılıklar değişmediyse) ya da `calculateValue` fonksiyonunu tekrar çağırır ve `calculateValue` 'nun döndürdüğü sonucu döndürür.

#### Uyarılar {/*caveats*/}

* useMemo` bir Hook'tur, bu nedenle onu yalnızca **bileşeninizin en üst seviyesinde** veya kendi Hook'larınızda çağırabilirsiniz. Döngülerin veya koşulların içinde çağıramazsınız. Buna ihtiyacınız varsa, yeni bir bileşen çıkarın ve state'i içine taşıyın.
* Strict Mod'da React, [yanlışlıkla oluşan safsızlıkları bulmanıza yardımcı olmak](#my-calculation-runs-twice-on-every-re-render) için **hesaplama fonksiyonunuzu iki kez çağıracaktır**. Bu yalnızca geliştirmeye yönelik bir davranıştır ve canlı ortamı etkilemez. Hesaplama fonksiyonunuz safsa (olması gerektiği gibi), bu durum mantığınızı etkilememelidir. Çağrılardan birinin sonucu göz ardı edilecektir.
* React **özel bir neden olmadıkça önbelleğe alınan değeri atmayacaktır.** Örneğin, geliştirme sırasında, bileşeninizin dosyasını düzenlediğinizde React önbelleği atar. Hem geliştirme hem de canlı ortamda, bileşeniniz ilk mount sırasında askıya alınırsa React önbelleği atacaktır. Gelecekte React, önbelleğin atılmasından yararlanan daha fazla özellik ekleyebilir - örneğin, React gelecekte sanallaştırılmış listeler için yerleşik destek eklerse, sanallaştırılmış tablo görünüm alanından dışarı kaydırılan öğeler için önbelleği atmak mantıklı olacaktır. Eğer `useMemo`'ya sadece bir performans optimizasyonu olarak güveniyorsanız bu bir sorun olmayacaktır. Aksi takdirde, bir [state değişkeni](/reference/react/useState#avoiding-recreating-the-initial-state) veya bir [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) daha uygun olabilir.

<Note>

Dönüş değerlerinin bu şekilde önbelleğe alınması [*memoization*](https://en.wikipedia.org/wiki/Memoization) olarak da bilinir, bu yüzden bu Hook `useMemo` olarak adlandırılmıştır.

</Note>

---

## Kullanım {/*usage*/}

### Maliyetli yeniden hesaplamaların atlanması {/*skipping-expensive-recalculations*/}

Bir hesaplamayı yeniden render işlemleri arasında önbelleğe almak için, bileşeninizin en üst seviyesinde bir `useMemo` çağrısına sarın:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo`'ya iki parametre geçmeniz gerekir:

1. `() =>` gibi hiçbir argüman almayan ve hesaplamak istediğiniz şeyi döndüren bir <CodeStep step={1}>hesaplama fonksiyonu</CodeStep>.
2. Bileşeniniz içinde hesaplamanızda kullanılan her değeri içeren bir <CodeStep step={2}>bağımlılıklar listesi</CodeStep>.

İlk render işleminde `useMemo`'dan alacağınız <CodeStep step={3}>değer</CodeStep>, <CodeStep step={1}>hesaplamanızın</CodeStep> çağrılmasının sonucu olacaktır.

Sonraki her render işleminde React, bağımlılıkları son render sırasında ilettiğiniz bağımlılıklarla karşılaştıracaktır. Bağımlılıkların hiçbiri ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırıldığında) değişmediyse, `useMemo` daha önce hesapladığınız değeri döndürür. Aksi takdirde, React hesaplamanızı yeniden çalıştıracak ve yeni değeri döndürecektir.

Başka bir deyişle, `useMemo`, bağımlılıkları değişene kadar bir hesaplama sonucunu yeniden render işlemleri arasında önbelleğe alır.

**Bunun ne zaman yararlı olduğunu görmek için bir örnek üzerinden gidelim.**

Varsayılan olarak, React her yeniden render edildiğinde bileşeninizin tüm gövdesini yeniden çalıştıracaktır. Örneğin, `TodoList` state'ini güncellerse veya üstünden yeni prop'lar alırsa, `filterTodos` fonksiyonu yeniden çalışacaktır:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Genelde çoğu hesaplama çok hızlı olduğu için bu bir sorun teşkil etmez. Ancak, büyük bir diziyi filtreliyor veya dönüştürüyorsanız ya da maliyetli bir hesaplama yapıyorsanız, veriler değişmediyse tekrar hesaplamayı atlamak isteyebilirsiniz. Hem `todos` hem de  `tab` son render sırasında olduğu gibi aynıysa, hesaplamayı `useMemo`'ya sarmak, daha önce hesapladığınız `visibleTodos`'u yeniden kullanmanızı sağlar.

Bu tür önbelleğe alma işlemine *[memoization](https://en.wikipedia.org/wiki/Memoization)* adı verilir.

<Note>

**`useMemo`'ya yalnızca bir performans optimizasyonu olarak güvenmelisiniz.** Kodunuz onsuz çalışmıyorsa, önce altta yatan sorunu bulun ve düzeltin. Daha sonra performansı artırmak için `useMemo` ekleyebilirsiniz.

</Note>

<DeepDive>

#### Bir hesaplamanın maliyetli olup olmadığı nasıl anlaşılır? {/*how-to-tell-if-a-calculation-is-expensive*/}

Genel olarak, binlerce nesne oluşturmadığınız veya üzerinde döngü yapmadığınız sürece, hesaplama muhtemelen maliyetli değildir. Emin olmak istiyorsanız, bir kod parçasında harcanan zamanı ölçmek için bir console log ekleyebilirsiniz:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Ölçtüğünüz etkileşimi gerçekleştirin (örneğin, input'a yazmak). Daha sonra konsolunuzda `filter array: 0.15ms` gibi kayıtlar göreceksiniz. Kaydedilen toplam süre önemli bir miktara ulaşıyorsa (örneğin, `1ms` veya daha fazla), bu hesaplamayı hafızaya almak mantıklı olabilir. Bir deneme olarak, bu etkileşimde toplam kaydedilen sürenin azalıp azalmadığını doğrulamak için hesaplamayı `useMemo` içine sarabilirsiniz:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Todos ve tab değişmediyse atlanır
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` *ilk* render işlemini hızlandırmaz. Sadece güncellemeler üzerindeki gereksiz çalışmaları atlamanıza yardımcı olur.

Makinenizin muhtemelen kullanıcılarınızınkinden daha hızlı olduğunu unutmayın, bu nedenle performansı yapay bir yavaşlatma ile test etmek iyi bir fikirdir. Örneğin, Chrome bunun için bir [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) seçeneği sunar.

Ayrıca, geliştirme sırasında performans ölçümünün size en doğru sonuçları vermeyeceğini unutmayın. (Örneğin, [Strict Mod](/reference/react/StrictMode) açık olduğunda, her bileşenin bir yerine iki kez işlendiğini göreceksiniz). En doğru zamanlamaları elde etmek için uygulamanızı canlı ortam için oluşturun ve kullanıcılarınızın sahip olduğu gibi bir cihazda test edin.

</DeepDive>

<DeepDive>

#### Her yere useMemo'yu  eklemeli misiniz? {/*should-you-add-usememo-everywhere*/}

Eğer uygulaman bu siteye benziyorsa ve etkileşimlerin çoğu kaba (örneğin bir sayfanın veya tüm bir bölümün değiştirilmesi gibi) ise, **memoization** genellikle gereksizdir. Öte yandan, eğer uygulaman bir çizim editörüne daha çok benziyorsa ve etkileşimlerin çoğu daha ayrıntılı (örneğin şekilleri taşımak gibi) ise, o zaman **memoization**’ı oldukça faydalı bulabilirsin.

`useMemo` ile optimizasyon sadece birkaç durumda değerlidir:

- `useMemo`'ya koyduğunuz hesaplama fark edilir derecede yavaştır ve bağımlılıkları nadiren değişiyordur.
- Bunu [`memo`](/reference/react/memo) içine sarılmış bir bileşene prop olarak geçersiniz. Değer değişmediyse yeniden render işlemini atlamak istersiniz. Memoization, bileşeninizin yalnızca bağımlılıklar aynı olmadığında yeniden render'lanmasını sağlar.
- Geçtiğiniz değer daha sonra bazı Hook'ların bağımlılığı olarak kullanılır. Örneğin, belki başka bir `useMemo` hesaplama değeri bu değere bağlıdır. Ya da bu değere [`useEffect`](/reference/react/useEffect) ile bağlısınızdır.

Diğer durumlarda bir hesaplamayı `useMemo` içine sarmanın hiçbir faydası yoktur. Bunu yapmanın önemli bir zararı da yoktur, bu nedenle bazı ekipler her durumu düşünmemeyi ve mümkün olduğunca çok belleğe almayı tercih eder. Bu yaklaşımın dezavantajı, kodun daha az okunabilir hale gelmesidir. Ayrıca, her belleğe alma işlemi etkili değildir: "her zaman yeni" olan tek bir değer, tüm bir bileşen için memoizasyonu kırmak için yeterlidir.

**Pratikte, birkaç ilkeyi izleyerek çok sayıda belleğe alma işlemini gereksiz hale getirebilirsiniz:**

1. Bir bileşen diğer bileşenleri görsel olarak sardığında, [JSX'i alt bileşen olarak kabul etmesine izin verin.](/learn/passing-props-to-a-component#passing-jsx-as-children) Bu sayede, kapsayıcı bileşen kendi state'ini güncellediğinde, React alt bileşenlerinin yeniden render edilmesine gerek olmadığını bilir.
1. Yerel state'i tercih edin ve state'i gereğinden daha [yukarı kaldırma](/learn/sharing-state-between-components)yın. Örneğin, formlar gibi geçici state'leri ve bir öğenin üzerine gelindiğinde ağacınızın tepesinde veya global bir state kütüphanesinde mi olduğunu saklamayın.
1. [Render mantığı](/learn/keeping-components-pure)nızı saf tutun. Bir bileşenin yeniden render edilmesi bir soruna neden oluyorsa veya göze çarpan bir görsel yapaylık oluşturuyorsa, bileşeninizde bir hata var demektir! Memoizasyon eklemek yerine hatayı düzeltin.
1. [State'i güncelleyen gereksiz Efektlerden kaçının.](/learn/you-might-not-need-an-effect) React uygulamalarındaki performans sorunlarının çoğu, bileşenlerinizin tekrar tekrar render edilmesine neden olan Efektlerden kaynaklanan güncelleme zincirlerinden kaynaklanır.
1.[Efektlerinizden gereksiz bağımlılıkları kaldırmaya çalışın](/learn/removing-effect-dependencies) Örneğin, memoization yerine, bir nesneyi veya bir işlevi bir Efektin içine veya bileşenin dışına taşımak genellikle daha basittir.

Belirli bir etkileşim hala gecikmeli geliyorsa, [React Developer Tools profilleyicisini kullanın](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) ve hangi bileşenlerin memoizasyondan en çok yararlanacağını görün ve gerektiğinde memoizasyon ekleyin. Bu ilkeler bileşenlerinizin hata ayıklamasını ve anlaşılmasını kolaylaştırır, bu nedenle her durumda bunları takip etmek iyidir. Uzun vadede, bunu kesin olarak çözmek için [otomatik olarak granüler memoization yapmayı](https://www.youtube.com/watch?v=lGEMwh32soc) araştırıyoruz.

</DeepDive>

<Recipes titleText="useMemo ile bir değeri doğrudan hesaplama arasındaki fark" titleId="examples-recalculation">

#### `useMemo` ile yeniden hesaplamayı atlama {/*skipping-recalculation-with-usememo*/}

Bu örnekte, `filterTodos` uygulaması **yapay olarak yavaşlatılmıştır**, böylece işleme sırasında çağırdığınız bazı JavaScript işlevleri gerçekten yavaş olduğunda ne olduğunu görebilirsiniz. Sekmeleri değiştirmeyi ve temayı değiştirmeyi deneyin.

Sekmeleri değiştirmek yavaş hissettirir çünkü yavaşlatılmış `filterTodos`u yeniden çalıştırmaya zorlar. Bu beklenen bir durumdur çünkü `tab` değişmiştir ve bu nedenle tüm hesaplamanın *yeniden çalıştırılması* gerekir. (Neden iki kez çalıştığını merak ediyorsanız, [burada](#my-calculation-runs-twice-on-every-re-render) açıklanmıştır.)

Temayı değiştir. **Yapay yavaşlamaya rağmen `useMemo` sayesinde hızlıdır.** Yavaş `filterTodos` çağrısı atlandı çünkü hem `todos` hem de `tab` (`useMemo`ya bağımlılık olarak ilettiğiniz değişkenler) son render'dan bu yana değişmedi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Aşırı yavaş kodu simüle etmek için 500 ms boyunca hiçbir şey yapmayın
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Bir değeri her zaman yeniden hesaplama {/*always-recalculating-a-value*/}

Bu örnekte, `filterTodos` uygulaması da **yapay olarak yavaşlatılmıştır**, böylece işlem sırasında çağırdığınız bazı JavaScript işlevleri gerçekten yavaş olduğunda ne olduğunu görebilirsiniz. Sekmeleri değiştirmeyi ve temayı değiştirmeyi deneyin.

Önceki örnekten farklı olarak, temayı değiştirmek de artık yavaş! Bunun nedeni **bu sürümde `useMemo` çağrısı olmamasıdır,** bu nedenle yapay olarak yavaşlatılmış `filterTodos` her yeniden oluşturmada çağrılır. Sadece `theme` değişmiş olsa bile çağrılır.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Aşırı yavaş kodu simüle etmek için 500 ms boyunca hiçbir şey yapmayın
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Burada **yapay yavaşlatma kaldırılmış olarak** aynı kodu inceleyebiliriz. `useMemo` eksikliği fark edilir derecede mi, değil mi?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Çoğu zaman, memoizasyon olmadan kod iyi çalışır. Etkileşimleriniz yeterince hızlıysa, memoizasyona ihtiyacınız olmayabilir.

`utils.js`deki todo öğelerinin sayısını artırmayı deneyebilir ve davranışın nasıl değiştiğini görebilirsiniz. Bu özel hesaplama başlangıçta çok maliyetli değildi, ancak `todos` sayısı önemli ölçüde artarsa, ek yükün çoğu filtrelemeden ziyade yeniden oluşturmada olacaktır. Yeniden oluşturma işlemini `useMemo` ile nasıl optimize edebileceğinizi görmek için aşağıda okumaya devam edin.

<Solution />

</Recipes>

---

### Bileşenlerin yeniden oluşturulmasını atlama {/*skipping-re-rendering-of-components*/}

Bazı durumlarda, `useMemo` alt bileşenleri yeniden oluşturma performansını optimize etmenize de yardımcı olabilir. Bunu göstermek için, bu `TodoList` bileşeninin `visibleTodos` öğesini alt bileşen `List` öğesine bir prop olarak aktardığını varsayalım:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`Tema` prop'unu değiştirmenin uygulamayı bir anlığına dondurduğunu fark ettiniz, ancak JSX'inizden `<List />` öğesini kaldırırsanız, hızlı hissedersiniz. Bu size `List` bileşenini optimize etmeyi denemeye değer olduğunu söyler.

**Varsayılan olarak, bir bileşen yeniden render edildiğinde, React tüm alt bileşenlerini özyinelemeli olarak yeniden render eder.** Bu nedenle, `TodoList` farklı bir `tema` ile yeniden oluşturulduğunda, `List` bileşeni de *aynı şekilde* yeniden oluşturulur. Bu, yeniden render için fazla hesaplama gerektirmeyen bileşenler için uygundur. Ancak, yeniden render işleminin yavaş olduğunu doğruladıysanız, `List`e, prop'lar son render ile aynı olduğunda [`memo`](/reference/react/memo) içine sararak yeniden oluşturmayı atlamasını söyleyebilirsiniz:

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Bu değişiklikle `List`, tüm prop'lar son render işlemindeki ile *aynı* ise yeniden render işlemini atlayacaktır.** İşte bu noktada hesaplamayı önbelleğe almak önemli hale geliyor! `visibleTodos`u `useMemo` olmadan hesapladığınızı düşünün:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Tema her değiştiğinde, bu farklı bir dizi olacak...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... böylece List'in prop'ları asla aynı olmayacak ve her seferinde yeniden oluşturulacaktır */}
      <List items={visibleTodos} />
    </div>
  );
}
```

Yukarıdaki örnekte, `{}` nesne literali'nin her zaman yeni bir nesne oluşturmasına benzer şekilde, **`filterTodos` fonksiyonu her zaman *farklı* bir dizi oluşturur**. Normalde bu bir sorun teşkil etmez, ancak `List` prop'larının asla aynı olmayacağı ve [`memo`](/reference/react/memo) optimizasyonunuzun çalışmayacağı anlamına gelir. İşte bu noktada `useMemo` kullanışlı hale gelir:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // React'e yeniden oluşturmalar arasında hesaplamanızı önbelleğe almasını söyleyin...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...yani bu bağımlılıklar değişmediği sürece...
  );
  return (
    <div className={theme}>
      {/* ...List, aynı prop'ları alacak ve yeniden oluşturmayı atlayabilecektir */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**`visibleTodos` hesaplamasını `useMemo` içine sararak, yeniden render'lar arasında (bağımlılıklar değişene kadar) *aynı* değere sahip olmasını sağlarsınız.** Belirli bir nedenle yapmadığınız sürece bir hesaplamayı `useMemo` içine sarmak *zorunda* değilsiniz. Bu örnekteki nedeni [`memo`,](/reference/react/memo) içine sarılmış bir bileşene aktarmanız ve bunun yeniden oluşturmayı (render'ı) atlamasına izin vermesidir. Bu sayfada `useMemo`'yu kullanmak için birkaç neden daha anlatılmaktadır.

<DeepDive>

#### Bireysel JSX node'larını memoize etme {/*memoizing-individual-jsx-nodes*/}

`List`'i [`memo`](/reference/react/memo) içine sarmak yerine, `<List />` JSX node'unu kendisini `useMemo` içine sarabilirsiniz:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Davranış aynı olacaktır. Eğer `visibleTodos` değişmediyse, `List` yeniden oluşturulmayacaktır.

`<List items={visibleTodos}  />`  gibi bir JSX node'u `{ type: List, props: { items: visibleTodos } }` gibi bir nesnedir. Bu nesneyi oluşturmanın maliyeti çok ucuzdur, ancak React, içeriğin son seferle aynı olup olmadığını bilmez. Bu yüzden React varsayılan olarak `List` bileşenini yeniden oluşturacaktır.

Ancak, React önceki render sırasında aynı JSX'i görürse, bileşeninizi yeniden render etmeye çalışmaz. Bunun nedeni JSX node'larının [değişmez (immutable)](https://en.wikipedia.org/wiki/Immutable_object) olmasıdır. Bir JSX node nesnesi zaman içinde değişmemiş olabilir, bu nedenle React yeniden oluşturmayı atlamanın güvenli olduğunu bilir. Ancak bunun işe yaraması için node'un yalnızca kodda aynı görünmesi değil, *gerçekte aynı nesne* olması gerekir. Bu örnekte `useMemo`'nun yaptığı şey budur.

JSX node'larını `useMemo` içine manuel olarak sarmak uygun değildir. Örneğin, bunu koşullu olarak yapamazsınız. Genellikle bu nedenle bileşenleri JSX node'larını sarmak yerine [`memo`](/reference/react/memo) ile sararsınız.

</DeepDive>

<Recipes titleText="Yeniden oluşturmayı atlamak ile her zaman yeniden oluşturmak arasındaki fark" titleId="examples-rerendering">

#### `useMemo` ve `memo` ile yeniden oluşturmayı atlama {/*skipping-re-rendering-with-usememo-and-memo*/}

Bu örnekte, `List` bileşeni **yapay olarak yavaşlatılmıştır**, böylece render'ladığınız bir React bileşeni gerçekten yavaş olduğunda ne olduğunu görebilirsiniz. Sekmeleri değiştirmeyi ve temayı değiştirmeyi deneyin.

Sekmeleri değiştirmek yavaş hissettiriyor çünkü yavaşlatılmış `List` bileşinini yeniden oluşturmaya zorluyor. Bu beklenen bir durumdur çünkü `tab` değişmiştir ve bu nedenle kullanıcının yeni seçimini ekrana yansıtmanız gerekir.

Şimdi, temayı değiştirmeyi deneyin. Bu işlem **`useMemo` ve [`memo`](/reference/react/memo) sayesinde, yapay yavaşlamaya rağmen, hızlıdır!** `List` yeniden render edilmeyi atladı çünkü `visibleItems` dizisi son render işleminden bu yana değişmedi. `useMemo`ya bağımlılık olarak aktardığınız hem `todos` hem de `tab` son render işleminden bu yana değişmediği için `visibleItems` dizisi değişmedi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Aşırı yavaş kodu simüle etmek için 500 ms boyunca hiçbir şey yapmayın
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Bir bileşeni her zaman yeniden oluşturma {/*always-re-rendering-a-component*/}

Bu örnekteki `List` implementasyonu da **yapay olarak yavaşlatılmıştır**, böylece işlediğiniz bazı React bileşenleri gerçekten yavaş olduğunda ne olduğunu görebilirsiniz. Sekmeleri ve temayı değiştirmeyi deneyin.

Önceki örnekten farklı olarak, temayı değiştirmek de artık yavaş! Bunun nedeni **bu sürümde `useMemo` çağrısı olmamasıdır,** bu nedenle `visibleTodos` her zaman farklı bir dizidir ve yavaşlatılmış `List` bileşeni yeniden oluşturmayı atlayamaz.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Aşırı yavaş kodu simüle etmek için 500 ms boyunca hiçbir şey yapmayın
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ancak, aynı kodu **yapay yavaşlatma kaldırılmış halde** inceleyelim. `useMemo`nun eksikliği fark ediliyor mu, edilmiyor mu?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Çoğu zaman, memoization olmadan kod iyi çalışır. Etkileşimleriniz yeterince hızlıysa, memoizasyona ihtiyacınız yoktur.

Uygulamanızı gerçekte neyin yavaşlattığına dair gerçekçi bir fikir edinmek için React'i üretim (production) modunda çalıştırmanız, [React Developer Tools](/learn/react-developer-tools) özelliğini devre dışı bırakmanız ve uygulamanızın kullanıcılarının sahip olduklarına benzer cihazlar kullanmanız gerektiğini unutmayın.

<Solution />

</Recipes>

---

### Preventing an Effect from firing too often {/*preventing-an-effect-from-firing-too-often*/}

Sometimes, you might want to use a value inside an [Effect:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

This creates a problem. [Every reactive value must be declared as a dependency of your Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) However, if you declare `options` as a dependency, it will cause your Effect to constantly reconnect to the chat room:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problem: This dependency changes on every render
  // ...
```

To solve this, you can wrap the object you need to call from an Effect in `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Only changes when options changes
  // ...
```

This ensures that the `options` object is the same between re-renders if `useMemo` returns the cached object.

However, since `useMemo` is performance optimization, not a semantic guarantee, React may throw away the cached value if [there is a specific reason to do that](#caveats). This will also cause the effect to re-fire, **so it's even better to remove the need for a function dependency** by moving your object *inside* the Effect:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ No need for useMemo or object dependencies!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

Now your code is simpler and doesn't need `useMemo`. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### Başka bir Hook'un bağımlılığını memoize etme {/*memoizing-a-dependency-of-another-hook*/}

Doğrudan bileşen gövdesinde oluşturulan bir nesneye bağlı olan bir hesaplamanız olduğunu varsayalım:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Dikkat: Bileşen gövdesinde oluşturulan bir nesneye bağımlılık
  // ...
```

Bu şekilde bir nesneye bağlı olmak, belleğe alma (memoizasyon) işleminin amacını ortadan kaldırır. Bir bileşen yeniden oluşturulduğunda, doğrudan bileşen gövdesinin içindeki tüm kod yeniden çalışır. **`SearchOptions` nesnesini oluşturan kod satırları da her yeniden oluşturmada çalışacaktır.** `searchOptions`, `useMemo` çağrınızın bir bağımlılığı olduğundan ve her seferinde farklı olduğundan, React bağımlılıkların farklı olduğunu bilir ve `searchItems`ı her seferinde yeniden hesaplar.

Bunu düzeltmek için, `searchOptions` nesnesini bir bağımlılık olarak geçirmeden önce *kendisini* memoize edebilirsiniz:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Yalnızca text değiştiğinde değişir

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Yalnızca allItems veya searchOptions değiştiğinde değişir
  // ...
```

Yukarıdaki örnekte, `text` değişmediyse, `searchOptions` nesnesi de değişmeyecektir. Ancak, daha da iyi bir çözüm `searchOptions` nesne bildirimini `useMemo` hesaplama fonksiyonunun *içine* taşımaktır:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Yalnızca allItems veya text değiştiğinde değişir
  // ...
```

Şimdi hesaplamanız doğrudan `text`'e bağlıdır (bu bir string'dir ve "yanlışlıkla" farklı hale gelemez).

---

### Bir fonksiyonu memoize etme {/*memoizing-a-function*/}

`Form` bileşeninin [`memo`](/reference/react/memo) içine sarıldığını varsayalım. Bir fonksiyonu prop olarak iletmek istiyorsunuz:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Nasıl `{}` farklı bir nesne yaratıyorsa, `function() {}` gibi fonksiyon bildirimleri ve `() => {}` gibi ifadeler de her yeniden oluşturmada *farklı* bir fonksiyon üretir. Yeni bir fonksiyon oluşturmak tek başına bir sorun değildir. Bu kaçınılması gereken bir şey değildir! Ancak, `Form` bileşeni memoize edilmişse, muhtemelen hiçbir prop değişmediğinde yeniden oluşturmayı atlamak istersiniz. Her zaman *farklı* olan bir prop, memoizasyonun amacını ortadan kaldıracaktır.

Bir fonksiyonu `useMemo` ile memoize etmek için, hesaplama fonksiyonunuzun başka bir fonksiyon döndürmesi gerekir:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + product.id + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Bu hantal görünüyor! **Fonksiyonları memoize etmek o kadar yaygındır ki, React özellikle bunun için yerleşik bir Hook'a sahiptir.** Ekstra iç içe fonksiyon yazmak zorunda kalmamak için **fonksiyonlarınızı `useMemo` yerine [`useCallback`](/reference/react/useCallback) içine sarın:**

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + product.id + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Yukarıdaki iki örnek tamamen eşdeğerdir. `useCallback`in tek faydası, fazladan bir iç içe fonksiyon yazmaktan kaçınmanızı sağlamasıdır. Başka bir şey yapmaz. [`useCallback`](/reference/react/useCallback) hakkında daha fazla bilgi edinin.

---

## Sorun giderme {/*troubleshooting*/}

### Hesaplamam her yeniden oluşturmada iki kez çalışıyor {/*my-calculation-runs-twice-on-every-re-render*/}

[Strict Mod]'da (/reference/react/StrictMode), React bazı fonksiyonlarınızı bir yerine iki kez çağıracaktır:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Bu bileşen fonksiyonu her render için iki kez çalışacaktır.

  const visibleTodos = useMemo(() => {
    // Bağımlılıklardan herhangi biri değişirse bu hesaplama iki kez çalışacaktır.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Bu beklenen bir durumdur ve kodunuzu bozmamalıdır.

Bu **sadece geliştirme amaçlı** davranış, [bileşenleri saf tutmanıza](/learn/keeping-components-pure) yardımcı olur. React, çağrılardan birinin sonucunu kullanır ve diğer çağrının sonucunu yok sayar. Bileşeniniz ve hesaplama işlevleriniz saf olduğu sürece, bu durum mantığınızı etkilememelidir. Ancak, saf olmadıkları takdirde, bu durum hatayı fark etmenize ve düzeltmenize yardımcı olur.

Örneğin, bu saf olmayan hesaplama fonksiyonu, prop olarak aldığınız bir diziyi mutasyona uğratır:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Hata: bir prop'u mutasyona uğratmak
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React fonksiyonunuzu iki kez çağırır, böylece todo'nun iki kez eklendiğini fark edersiniz. Hesaplamanız mevcut nesneleri değiştirmemelidir, ancak hesaplama sırasında oluşturduğunuz *yeni* nesneleri değiştirmenizde bir sakınca yoktur. Örneğin, `filterTodos` fonksiyonu her zaman *farklı* bir dizi döndürüyorsa, bunun yerine *döndürülen* diziyi değiştirebilirsiniz:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Doğru: hesaplama sırasında oluşturduğunuz bir nesnenin mutasyona uğratılması
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Saflık hakkında daha fazla bilgi edinmek için [keeping components pure](/learn/keeping-components-pure) bölümünü okuyun.

Ayrıca, mutasyon olmadan [nesneleri güncelleme](/learn/updating-objects-in-state) ve [dizileri güncelleme](/learn/updating-arrays-in-state) kılavuzlarına göz atın.

---

### Benim `useMemo` çağrımın bir nesne döndürmesi gerekiyor, ancak undefined döndürüyor {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Buradaki kod çalışmıyor:

```js {1-2,5}
  // 🔴 () => { ile bir ok fonksiyonundan bir nesne döndüremezsiniz
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

JavaScript'te, `() => {` ok fonksiyonu gövdesini başlatır, bu nedenle `{` ayracı nesnenizin bir parçası değildir. Bu yüzden bir nesne döndürmez ve hatalara yol açar. Bunu `({` ve `})` gibi parantezler ekleyerek düzeltebilirsiniz:

```js {1-2,5}
  // Bu işe yarar, ancak birinin tekrar bozması kolaydır
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Ancak, bu yine de kafa karıştırıcıdır ve birinin parantezleri kaldırarak bozması çok kolaydır.

Bu hatadan kaçınmak için, açık bir şekilde `return` deyimi yazın:

```js {1-3,6-7}
  // ✅ Bu işe yarar ve açıktır
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Bileşenim her render olduğunda, `useMemo` içindeki hesaplama yeniden çalışıyor {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Bağımlılık dizisini ikinci bir bağımsız değişken olarak belirttiğinizden emin olun!

Bağımlılık dizisini unutursanız, `useMemo` her seferinde hesaplamayı yeniden çalıştıracaktır:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Her seferinde yeniden hesaplar: bağımlılık dizisi yok
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Bu da, bağımlılık dizisini ikinci bir bağımsız değişken olarak geçiren düzeltilmiş versiyonudur:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Gereksiz yere yeniden hesaplama yapmaz
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Bu işe yaramazsa, sorun bağımlılıklarınızdan en az birinin önceki render işleminden farklı olmasıdır. Bağımlılıklarınızı konsola manuel olarak kaydederek bu sorunu ayıklayabilirsiniz:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Daha sonra konsolda farklı yeniden oluşturmalardan dizilere sağ tıklayabilir ve her ikisi için de "Genel değişken olarak sakla"yı seçebilirsiniz. İlkinin `temp1` ve ikincisinin `temp2` olarak kaydedildiğini varsayarsak, her iki dizideki her bir bağımlılığın aynı olup olmadığını kontrol etmek için tarayıcı konsolunu kullanabilirsiniz:

```js
Object.is(temp1[0], temp2[0]); // İlk bağımlılık, diziler arasında aynı mı?
Object.is(temp1[1], temp2[1]); // İkinci bağımlılık, diziler arasında aynı mı?
Object.is(temp1[2], temp2[2]); // ... ve her bağımlılık için böyle devam eder ...
```

Hangi bağımlılığın memoizasyonu bozduğunu bulduğunuzda, ya onu kaldırmanın bir yolunu bulun ya da [onu da memoize edin.](#memoizing-a-dependency-of-another-hook)

---

### Bir döngü içinde her liste öğesi için `useMemo` çağırmam gerekiyor, ancak buna izin verilmiyor {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Diyelim ki `Chart` bileşeni [`memo`](/reference/react/memo) içine sarılmış olsun. `ReportList` bileşeni yeniden oluşturulduğunda listedeki her `Chart`'ın yeniden oluşturulmasını atlamak istiyorsunuz. Ancak, `useMemo` öğesini bir döngü içinde çağıramazsınız:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 useMemo'yu bu şekilde bir döngü içinde çağıramazsınız:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Bunun yerine, her bir öğe için bir bileşen çıkarın ve tek tek öğeler için verileri not edin:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ En üst seviyede useMemo'yu çağırın:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Alternatif olarak, `useMemo` seçeneğini kaldırabilir ve bunun yerine `Report` seçeneğinin kendisini [`memo`](/reference/react/memo) ile sarabilirsiniz. Eğer `item` prop'u değişmezse, `Report` yeniden oluşturmayı atlayacaktır, dolayısıyla `Chart` da yeniden oluşturmayı atlayacaktır:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
