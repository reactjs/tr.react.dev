---
title: memo
---

<Intro>

`memo`, bileşenin prop'ları değişmediğinde yeniden render edilmesini önlemenize izin verir.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically applies the equivalent of `memo` to all components, reducing the need for manual memoization. You can use the compiler to handle component memoization automatically.

</Note>

<InlineToc />

---

## Referans {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Bir bileşenin *önbelleğe alınmış (memoized)* versiyonunu edinmek için ilgili bileşeni `memo`'ya sarmalayın. Bileşeninizin önbelleğe alınmış olan bu versiyon, üst bileşen render olsa dahi prop'ları değişmediği sürece genellikle yeniden render edilmez. Genellikle demenin sebebi React'ın yine de render edebilmesidir: önbelleğe alma (memoization) render'ı engellemenin garantisi değil, performans optimizasyonudur.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `Component`: Önbelleğe almak istediğiniz bileşendir. `memo` bileşenin kendisini değiştirmez, önbelleğe alınmış yeni bir bileşen döndürür. Fonksiyon ve [`forwardRef`](/reference/react/forwardRef) dahil olmak üzere geçerli bir React bileşenini kabul eder.

* **isteğe bağlı** `arePropsEqual`: Bileşenin eski ve yeni prop'ları olmak üzere iki argüman kabul eden ve değişiklik olup olmadığını kontrol eden fonksiyondur. Eski ve yeni değerler aynıysa, bileşen yeni prop'lar ile eski prop'lardakiyle aynı çıktıyı üretecekse, `true` döndürmelidir. Aksi takdirde `false` döndürmelidir. Çoğu zaman bu fonksiyonu belirtmezsiniz. Varsayılan olarak React, karşılaştırırken [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) kullanır.

#### Dönüş değeri {/*returns*/}

`memo`, yeni bir React bileşeni döndürür. Bu bileşen `memo`'ya verilen bileşenle aynı davranır ancak üst bileşen render edildiğinde kendi prop'ları değişmemişse yeniden render edilmez.

---

## Kullanım {/*usage*/}

### Prop'lar değişmediğinde yeniden render'ı önlemek {/*skipping-re-rendering-when-props-are-unchanged*/}

React, normalde üst bileşen yeniden render edildiğinde altındaki bileşenleri de render eder. `memo` ile birlikte yeni prop'lar eskisiyle aynı olduğu sürece render edilmeyecek bileşenler oluşturabilirsiniz. Bu bileşenler, *önbelleğe alınmış* olarak nitelendirilir.

Bir bileşeni önbelleğe almak için, `memo`'ya sarmalayın ve döndürdüğü değeri orjinal bileşeninizin yerine kullanın:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Merhaba, {name}!</h1>;
});

export default Greeting;
```

React bileşeni her zaman [saf (pure) render mantığına](/learn/keeping-components-pure) sahip olmalıdır. Yani prop'u, state'i ve context'i değişmediği sürece aynı çıktıyı vermesi beklenir. `memo` kullanarak React'a bu gerekliliğe uymasını söylersiniz. Prop'ları değişmediği takdirde React'ın render tetiklemesine gerek yoktur. Bileşenin state'i ya da context'i değişirse `memo` ile sarılmış olsa bile yeniden render olur.

Bu örnekte, `Greeting` bileşenin `name` değiştiğinde yeniden render olduğuna (çünkü prop'larından biridir), ancak `address` değiştiğinde olmadığına dikkat edin (çünkü `Greeting`'in prop'u değildir):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        İsim{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adres{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting'in render edildi:", new Date().toLocaleTimeString());
  return <h3>Merhaba{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**`memo`'ya yalnızca performans optimizasyonu olarak bakmalısınız.** Kodunuz onsuz çalışmıyorsa, öncelikle temel problemi bulun ve çözün. Ardından, performansı iyileştirmek için `memo` ekleyebilirsiniz.

</Note>

<DeepDive>

#### Bulduğunuz her yere memo eklemeli misiniz? {/*should-you-add-memo-everywhere*/}

Uygulamanız bu site gibi ise ve etkileşimlerin çoğu kaba ise (bir sayfayı veya tüm bir bölümü değiştirmek gibi), memoizasyon genellikle gereksizdir. Öte yandan, uygulamanız daha çok bir çizim düzenleyicisi gibiyse ve etkileşimlerin çoğu ayrıntılı ise (şekilleri taşımak gibi), memoizasyon çok yararlı olabilir.

`memo` ile yapılan optimizasyon, yalnızca bileşeniniz sıkça aynı prop'larla yeniden render oluyorsa ve render mantığı pahallıysa değerlidir. Bileşeniniz yeniden render edildiğinde fark edilebilir bir gecikme yoksa önbelleğe almak gereksizdir. Bileşene her *seferinde farklı* prop (render esnasında tanımlanan fonksiyon veya nesne gibi) geçiyorsanız, `memo` tamamen gereksizdir. Bu nedenle `memo` ile birlikte genellikle [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) ve [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)'e ihtiyacınız olacaktır.

Diğer durumlarda bileşeni `memo` ile sarmalamanın faydası yoktur ancak önemli bir zararı da yoktur. Bu yüzden bazı ekipler üzerinde çok düşünmeden mümkün olduğunca önbelleğe almayı tercih ederler. Bu yaklaşımın dezavantajı, kodun daha az okunabilir hale gelmesidir. Ayrıca tüm önbelleğe alma işlemleri etkili değildir: "her zaman farklı" olan tek bir değer tüm bileşenin önbelleğe alınmasını engellemeye yeterlidir.

**Pratikte birkaç prensibi takip ederek çoğu önbelleğe alma işlemini gereksiz hale getirebilirsiniz:**

1. Bir bileşen diğer bileşenleri görsel olarak sarmalıyorsa, [JSX'i alt eleman olarak kabul etmesine](/learn/passing-props-to-a-component#passing-jsx-as-children) izin verin. Böylece sarmalayan bileşenin kendi state'i güncellendiğinde, React alt bileşenlerin yeniden render edilmesinin gerekli olmadığını bilir.
1. Mümkün olduğunca yerel state kullanın ve state'i gerektiğinden fazla [yukarıya taşımayın](/learn/sharing-state-between-components). Örneğin, form gibi geçici state'leri veya fareyle bir öğenin üzerine gelindiği bilgisini ağacınızın en üstünde ya da global state kütüphanenizde tutmayın.
1. [Render mantığınızı saf tutun.](/learn/keeping-components-pure) Bileşeninizin render edilmesi bir soruna neden oluyorsa veya belirgin görsel farklılık oluşturuyorsa, bileşeninizde bir bug vardır! Önbelleğe almak yerine bug'ı çözün.
1. [State güncelleyen gereksiz efektlerden kaçının.](/learn/you-might-not-need-an-effect) React' uygulamalarındaki çoğu performans sorunu, bileşenlerinizin defalarca render olmasına neden olan efekt zincirlerinden kaynaklanır.
1. [Efektlerinizden gereksiz bağımlılıkları kaldırmayı deneyin.](/learn/removing-effect-dependencies) Örneğin, efekt içerisindeki bazı nesne ve fonksiyonları bileşen dışarısına çıkarmak ön belleğe almaktan daha basittir.

Eğer spesifik bir etkileşim hala gecikmeli geliyorsa, [React Developer Tools'un profiler'ını kullanarak](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) önbelleğe alındığında fayda sağlayacak bileşenleri belirleyin ve tespit ettiklerinizi önbelleğe alın. Bu prensipler bileşenlerinizde hataların ayıklanmasını ve farkedilmesini kolaylaştırır. Bu nedenle durum farketmeksizin adımları takip etmekte yarar vardır. Gelecekte bunu herkes için kökten çözmek adına [önbelleğe almayı nasıl otomatik hale getirebileceğimizi](https://www.youtube.com/watch?v=lGEMwh32soc) araştırıyoruz.

</DeepDive>

---

### Ön belleğe alınmış (memoized) bileşeni state kullanarak güncelleme {/*updating-a-memoized-component-using-state*/}

Bir bileşen önbelleğe alınmış olsa bile kendi state'leri değiştiğinde yeniden render edilecektir. Önbelleğe almak, yalnızca bileşene üst bileşenden iletilen prop'larla ilgilidir.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        İsim{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adres{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting render edildi:', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Merhaba');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Merhaba'}
          onChange={e => onChange('Merhaba')}
        />
        Normal karşılama
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Merhaba, hoşgeldin'}
          onChange={e => onChange('Merhaba, hoşgeldin')}
        />
        İçten karşılama
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Bir state değişkenine mevcut değerini yeniden atarsanız, React bileşeninizi `memo`'ya sarmalanmış olmasa bile yeniden render etmez. Bileşen fonksiyonunuzun fazladan çağırıldığını görebilirsiniz ancak çıktı gözardı edilir.

---

### Ön belleğe alınmış (memoized) bileşeni bağlam (context) kullanarak güncelleme {/*updating-a-memoized-component-using-a-context*/}

Bir bileşen önbelleğe alındığında bile, kullandığı context değiştiğinde yeniden render olur. Önbelleğe almak, yalnızca bileşene üst bileşenden iletilen prop'larla ilgilidir.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Temayı değiştir
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting render edildi:", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Merhaba, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Bileşeninizin yalnızca context'in bazı _öğeleri_ değiştiğinde render edilmesini isterseniz iki parçaya bölün. Dış bileşendeki context'den ihtiyacınız olanı okuyun ve önbelleğe alınmış alt bileşene prop olarak iletin.

---

### Prop değişiklik miktarını minimuma indirme {/*minimizing-props-changes*/}

`memo` kullandığınızda, herhangi bir prop önceki değerine *sığ olarak eşit (shallowly equal)* değilse bileşeniniz yeniden render edilir. React, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) kullanarak bileşeninizdeki her prop'u önceki değeriyle karşılaştırır. `Object.is(3, 3)` sonucunun `true`, `Object.is({}, {})` sonucunun `false` olduğuna dikkat edin.


`memo`'dan en iyi şekilde yararlanmak için prop'ların değişme miktarını minimuma indirin. Örneğin, prop bir nesne ise [`useMemo`](/reference/react/useMemo) kullanarak üst bileşenin her seferinde nesneyi yeniden oluşturmasını önleyebilirsiniz.

```js {5-8}
function Page() {
  const [name, setName] = useState('Anılcan');
  const [age, setAge] = useState(24);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Prop değişikliklerini minimuma indirmenin daha iyi bir yolu, gereksiz bilgileri prop olarak beklemediğinden emin olmaktır. Örneğin, bütün nesne yerine değerleri tek tek kabul edebilir:

```js {4,7}
function Page() {
  const [name, setName] = useState('Anılcan');
  const [age, setAge] = useState(24);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Bazen değerler daha az değişen biçimlere çevrilebilir. Örneğin, buradaki bileşen değerin kendisinden ziyade var olduğunu gösteren bir boolean değer kabul eder:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Önbelleğe alınan bileşene fonksiyon iletmeniz gerekirse, hiçbir zaman değişmemesini sağlamak için bileşenin dışında tanımlayın veya render'lar arasında yeniden tanımlanmaması için [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) kullanarak önbelleğe alın.

---

### Özel karşılaştırma fonksiyonu belirtme {/*specifying-a-custom-comparison-function*/}

Önbelleğe alınan bileşenin prop değişikliklerini minimuma indirmek bazen mümkün olmayabilir. Bu durumda sığ eşitliği kullanmak yerine (shallow equality) eski ve yeni prop'ları karşılaştırmak için özel bir karşılaştırma fonksiyonu sağlayabilirsiniz. Bu fonksiyon, `memo`'ya ikinci argüman olarak iletilir. Yalnızca yeni prop'ların eskileri ile aynı çıktıyı verdiği durumlarda `true`, aksi takdirde `false` döndürmelidir.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Özel fonksiyon kullanırsanız, karşılaştırma fonksiyonunun yeniden render etmekten daha performanslı olup olmadığını kontrol etmek için tarayıcınızın geliştirici araçlarındaki Performans panelini kullanın. Süprizler yaşayabilirsiniz.

Performans ölçümleri yaparken, React'ın canlı ortam (production) modunda çalıştığından emin olun.

<Pitfall>

Özel bir `arePropsEqual` implementasyonu sağlarsanız, **fonksiyonlar dahil her prop'u karşılaştırmanız gerekir.** Fonksiyonlar, ana bileşenin prop'larını ve state'lerini [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) mantığıyla hafızada tutar. `oldProps.onClick !== newProps.onClick` olduğunda `true` döndürürseniz, `onClick` fonksiyonu içerisinde önceki render'dan kalan prop ve state'leri görmeye devam edecek ve kafa karıştırıcı hatalara yok açacaktır.

Kullandığınız veri yapısının sınırlı derinliğe sahip olduğundan emin değilseniz `arePropsEqual` içerisinde derin eşitlik (deep equality) kontrolü yapmaktan kaçının. **Derin eşitlik kontrolleri son derece yavaş olabilir** ve veri yapısı değiştirildiğinde uygulamanızı birkaç saniye boyunca dondurabilir.

</Pitfall>

---

### React Compiler kullanıyorsam hâlâ React.memo’ya ihtiyacım var mı? {/*react-compiler-memo*/}

[React Compiler](/learn/react-compiler) etkinleştirildiğinde, genellikle `React.memo` kullanmanıza gerek kalmaz. Compiler, bileşenlerin gereksiz yeniden render edilmesini otomatik olarak optimize eder.

İşte nasıl çalıştığı:

**React Compiler olmadan**, gereksiz yeniden renderları önlemek için `React.memo` kullanmanız gerekir:

```js
// Parent her saniye yeniden render eder
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Without memo, this re-renders every second even though props don't change
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
});
```

**With React Compiler enabled**, the same optimization happens automatically:

```js
// No memo needed - compiler prevents re-renders automatically
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
}
```

Here's the key part of what the React Compiler generates:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... other code ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... return statement ...
}
```

Notice the highlighted lines: The compiler wraps `<ExpensiveChild name="John" />` in a cache check. Since the `name` prop is always `"John"`, this JSX is created once and reused on every parent re-render. This is exactly what `React.memo` does - it prevents the child from re-rendering when its props haven't changed.

The React Compiler automatically:
1. Tracks that the `name` prop passed to `ExpensiveChild` hasn't changed
2. Reuses the previously created JSX for `<ExpensiveChild name="John" />`
3. Skips re-rendering `ExpensiveChild` entirely

This means **you can safely remove `React.memo` from your components when using React Compiler**. The compiler provides the same optimization automatically, making your code cleaner and easier to maintain.

<Note>

The compiler's optimization is actually more comprehensive than `React.memo`. It also memoizes intermediate values and expensive computations within your components, similar to combining `React.memo` with `useMemo` throughout your component tree.

</Note>

---

## Troubleshooting {/*troubleshooting*/}
### My component re-renders when a prop is an object, array, or function {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React eski ve yeni prop'ları sığ karşılaştırma ile kıyaslar: her yeni prop'un eski prop'a referans olarak eşit olup olmadığına bakar. Eğer üst eleman render olduğunda eskisiyle birebir aynı olan yeni bir nesne veya dizi oluşturuyorsanız, React değiştirildiğini düşünür. Benzer şekilde, üst bileşen render edildiğinde yeni fonksiyon oluşturuyorsanız, React aynı tanıma sahip olsa dahi değiştiğini düşünür. Bunu önlemek için [prop'ları basitleştirin veya üst bileşendeki prop'ları önbelleğe alın](#minimizing-props-changes).
