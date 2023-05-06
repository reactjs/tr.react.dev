---
title: memo
---

<Intro>

`memo`, bileşenin prop'ları değişmediğinde yeniden render'lamayı atlamanıza izin verir.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Bir bileşenin *önbelleğe alınmış (memoized)* versiyonunu edinmek için ilgili bileşeni `memo`'ya sarın. Bileşeninizin önbelleğe alınmış bu versiyon, üst bileşen render olsa bile prop'ları değişmediği sürece genellikle yeniden render edilmez. Fakat React hala render edebilir: önbelleğe alma (memoization) render'ı engelleme garantisi değil, performans optimizasyonudur.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `Component`: Önbelleğe almak istediğiniz bileşendir. `memo` bileşeni değiştirmez, önbelleğe alınmış yeni bileşen döndürür. Fonksiyon ve [`forwardRef`](/reference/react/forwardRef) dahil olmak üzere geçerli bir React bileşeni kabul eder.

* **isteğe bağlı** `arePropsEqual`: İki argüman kabul eden bir fonksiyondur: bileşenin eski ve yeni prop'ları. Eski ve yeni değerler aynıysa, bileşen yeni prop'lar ile eski prop'lardakiyle aynı çıktıyı üretecekse, `true` döndürmelidir. Aksi takdirde `false` döndürmelidir. Çoğu zaman bu fonksiyonu belirtmezsiniz. React, prop'ları varsayılan olarak [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırır.

#### Dönüş değerleri {/*returns*/}

`memo` returns a new React component. It behaves the same as the component provided to `memo` except that React will not always re-render it when its parent is being re-rendered unless its props have changed.
`memo` yeni bir React bileşeni döndürür. `memo`'ya sağlanan bileşenle aynı davranır ancak istisna olarak üst bileşen render edildiğinde prop'ları değişmemişse yeniden render edilmez.

---

## Kullanım {/*usage*/}

### Prop'lar değişmediğinde yeniden render'ı önlemek {/*skipping-re-rendering-when-props-are-unchanged*/}

React, normalde üst bileşen yeniden render edildiğinde altındaki bileşenleri de render eder. `memo` ile birlikte yeni prop'lar eskisiyle aynı olduğu sürece render edilmeyecek bileşen oluşturabilirsiniz. Bu tarz bileşenler, *önbelleğe alınmış* olarak nitelendirilir.

Bir bileşeni önbelleğe almak için, `memo`'ya sarmalayın ve döndürdüğü değeri orjinal bileşeninizin yerine kullanın:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Merhaba, {name}!</h1>;
});

export default Greeting;
```

React bileşeni her zaman [pure render mantığına](/learn/keeping-components-pure) sahip olmalıdır. Yani prop'ları, state'i ve context'i değişmediği sürece aynı çıktıyı vermesi beklenir. `memo` kullanarak React'a bu gerekliliğe uymasını söylersiniz. Prop'ları değişmediği takdirde React'ın yeniden render etmesine gerek yoktur. Bileşenin state'i ya da context'i değişirse `memo` ile sarılmış olsa bile yeniden render olur.

Bu örnekte, `Greeting` bileşeni `name` değiştiğinde yeniden render olduğuna (çünkü prop'larından biri), ancak `address` değiştiğinde olmadığına dikkat edin (çünkü `Greeting`'in prop'u değil):

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

**`memo`'ya yalnızca performans optimizasyonu olarak bakmalısınız.** Kodunuz onsuz çalışmıyorsa, öncelikle temel problemi bulun ve çözün. Ardından performansı iyileştirmek için `memo` ekleyebilirsiniz.

</Note>

<DeepDive>

#### Bulduğunuz her yere memo eklemeli misiniz? {/*should-you-add-memo-everywhere*/}

Eğer uygulamanız bu site gibiyse ve çoğunlukla kaba etkileşimler içeriyorsa (sayfayı ve bölümü değiştirmek gibi), önbelleğe almak genellikle gereksizdir. Öte yandan, uygulamanız çizim editörü gibi daha küçük etkileşimler içeriyorsa (örneğin şekilleri taşıma gibi), önbelleğe almak çok faydalı olabilir.

`memo` ile yapılan optimizasyon, yalnızca bileşeniniz sıkça aynı prop'larla yeniden render oluyorsa ve render mantığı pahallıysa değerlidir. Bileşeniniz yeniden render edildiğinde fark edilebilir bir gecikme yoksa önbelleğe almak gereksizdir. Unutmayın ki bileşene her *seferinde farklı* prop'lar (render esnasında tanımlanan fonksiyon veya nesne gibi) geçiyorsanız, `memo` tamamen gereksizdir. Bu nedenle `memo` ile birlikte [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) ve [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)'e ihtiyacınız olacaktır.

Diğer durumlarda bileşeni `memo` ile sarmalamanın faydası yoktur. Bunu yapmanın da önemli bir zararı yoktur, bu yüzden bazı ekipler durumları tek tek düşünmeyip mümkün olduğunca önbelleğe almayı tercih ederler. Bu yaklaşımın dezavantajı, kodun daha az okunabilir hale gelmesidir. Ayrıca tüm önbelleğe alma işlemleri etkili değildir: "her zaman yeni" olan tek bir değer tüm bileşenin önbelleğe alınmasını engellemeye yeterlidir.

**Pratikte birkaç prensibi takip ederek çoğu önbelleğe alma işlemini gereksiz hale getirebilirsiniz:**

1. Bir bileşen diğer bileşenleri görsel olarak sarmalıyorsa, [JSX'i alt eleman olarak kabul etmesine](/learn/passing-props-to-a-component#passing-jsx-as-children) izin verin. Böylece sarmalayan bileşen kendi state'ini güncellediğinde, React alt bileşenlerin yeniden render edilmesinin gerekli olmadığını bilir.
1. Mümkün olduğunca yerel state kullanın ve state'i gerektiğinden fazla [yukarıya taşımayın](/learn/sharing-state-between-components). Örneğin, form gibi geçici state'leri veya fareyle bir öğenin üzerine gelindiği bilgisini ağacınızın en üstünde ya da global state kütüphanenizde tutmayın.
1. [Render mantığınızı saf tutun.](/learn/keeping-components-pure) Bileşeninizin render edilmesi bir soruna neden oluyorsa veya belirgin görsel farklılık oluşturuyorsa, bileşeninizde bir bug vardır! Önbelleğe almak yerine bug'ı çözün.
1. [State güncelleyen gereksiz efektlerden kaçının.](/learn/you-might-not-need-an-effect) React' uygulamalarındaki çoğu performans sorunu, bileşenlerinizin defalarca render olmasına neden olan efekt zincirlerinden kaynaklanır.
1. [Efektlerinizden gereksiz bağımlılıkları kaldırmayı deneyin.](/learn/removing-effect-dependencies) Örneğin, efekt içerisindeki bazı nesne ve fonksiyonları bileşen dışarısına çıkarmak ön belleğe almaktan daha basittir.

Eğer spesifik bir etkileşim hala gecikmeli geliyorsa, [React Developer Tools profiler kullanarak](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) hangi bileşenlerin önbelleğe alındığında fayda sağlayacağını belirleyin ve ihtiyaç duyulan bileşenleri önbelleğe alın. 
These principles make your components easier to debug and understand, so it's good to follow them in any case. In the long term, we're researching [doing granular memoization automatically](https://www.youtube.com/watch?v=lGEMwh32soc) to solve this once and for all.???

</DeepDive>

---

### Ön belleğe alınmış (memoized) bileşeni state kullanarak güncelleme {/*updating-a-memoized-component-using-state*/}

Bir bileşen önbelleğe alınmış olsa bile kendi state'leri değiştiğinde yeniden render edilecektir. Önbelleğe almak, bileşene üst bileşenden iletilen yalnızca prop'larla ilgilidir.

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

Bir state değişkenini mevcut değerine yeniden ayarlarsanız, React `memo` olmasa bile bileşeninizin yeniden render'ını atlar. Bileşen fonlsiyonunuzun fazladan çağırıldığını görebilirsiniz ancak sonuç gözardı edilir.

---

### Ön belleğe alınmış (memoized) bileşeni bağlam (context) kullanarak güncelleme {/*updating-a-memoized-component-using-a-context*/}

Bir bileşen önbelleğe alındığında bile, kullandığı context değiştiğinde yeniden render olur. Önbelleğe almak, bileşene üst bileşenden iletilen yalnızca prop'larla ilgilidir.

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
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Temayı değiştir
      </button>
      <Greeting name="Seher" />
    </ThemeContext.Provider>
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

Bileşeninizin yalnızca context'in bazı _öğeleri_ değiştiğinde yeniden render edilmesini sağlamak için bileşeni ikiye bölün. Dış bileşendeki context'den ihtiyacınız olanı okuyun ve önbelleğe alınmış alt bileşene prop olarak iletin.

---

### Prop değişikliklerini en aza indirme {/*minimizing-props-changes*/}

`memo` kullandığınızda, herhangi bir prop önceki değerine *sığ olarak eşit (shallowly equal)* değilse bileşeniniz yeniden render edilir. React [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırmasını kullanarak bileşeninizdeki her prop'u önceki değeriyle karşılaştırır. `Object.is(3, 3)` sonucunun `true`, `Object.is({}, {})` sonucunun `false` olduğuna dikkat edin.


`memo`'dan en iyi şekilde yararlanmak için, prop'ların değişme sayısını en aza indirin. Örneğin, prop bir nesne ise [`useMemo`](/reference/react/useMemo) kullanarak üst bileşenin her seferinde nesneyi yeniden oluşturmasını önleyebilirsiniz.

```js {5-8}
function Page() {
  const [name, setName] = useState('Seher');
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

Prop değişikliklerini en aza indirmenin daha iyi bir yolu, gereken minimum bilgiyi prop olarak kabul ettiğinden emin olmaktır. Örneğin, bütün nesne yerine değerleri tek tek kabul edebilir:

```js {4,7}
function Page() {
  const [name, setName] = useState('Seher');
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

Önbelleğe alınan bileşene fonksiyon iletmeniz gerektiğinde, hiçbir zaman değişmemesi için bileşen dışında tanımlayın veya render'lar arasında tanımı önbelleğe almak için [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) kullanın.

---

### Özel karşılaştırma fonksiyonu belirtme {/*specifying-a-custom-comparison-function*/}

Önbelleğe alınan bileşenin prop değişikliklerini en aza indirmek bazen mümkün olmayabilir. Bu durumda sığ eşitliği kullanmak yerine (shallow equality) eski ve yeni prop'ları karşılaştırmak için özel bir karşılaştırma fonksiyonu sağlayabilirsiniz. Bu fonksiyon, `memo`'ya ikinci argüman olarak iletilir. Yalnızca yeni prop'ların eskileri ile aynı çıktıyı verdiği durumlarda `true`, aksi takdirde `false` döndürmelidir.

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

Bunu kullanırsanız karşılaştırma fonksiyonunun yeniden render etmeden daha hızlı olup olmadığını kontrol etmek için tarayıcınızın geliştirici araçlarındaki Performans panelini kullanın. Süpriz yaşayabilirsiniz.

Performans ölçümleri yaparken, React'ın canlı ortam (production) modunda çalıştığından emin olun.

<Pitfall>

Özel bir `arePropsEqual` implementasyonu sağlarsanız, **fonksiyonlar dahil her prop'u karşılaştırmanız gerekir.** Fonksiyonlar genellikle ana bileşenin prop'larını ve state'lerini [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) mantığıyla hafızada tutar. `oldProps.onClick !== newProps.onClick` olduğunda `true` döndürürseniz, bileşeniniz `onClick` fonksiyonu içerisinde önceki render'dan kalan prop ve state'leri görmeye devam edecek ve kafa karıştırıcı hatalara yok açacaktır.


Kullandığınız veri yapısının sınırlı derinliğe sahip olduğundan emin değilseniz `arePropsEqual` içerisinde derin eşitlik (deep equality) kontrolü yapmaktan kaçının. **Derin eşitlik kontrolleri son derece yavaş olabilir** ve veri yapısı değiştirildiğinde uygulamanızı birkaç saniye boyunca dondurabilir.

</Pitfall>

---

## Sorun giderme {/*troubleshooting*/}
### Prop bir nesne, dizi veya fonksiyon olduğunda bileşenim yeniden render'lanıyor {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React eski ve yeni prop'ları sığ karşılaştırma ile kıyaslar: her yeni prop'un eski prop'a referans olarak eşit olup olmadığına bakar. Eğer üst eleman her render olduğu zaman eskisiyle birebir aynı olan yeni bir nesne veya dizi oluşturuyorsanız, React değiştirildiğini düşünür. Benzer şekilde, üst bileşen render edildiğinde yeni bir fonksiyon oluşturuyorsanız, React aynı tanıma sahip olsa dahi değiştiğini düşünür. Bunu önlemek için, [prop'ları basitleştirin veya üst bileşendeki prop'ları önbelleğe alın](#minimizing-props-changes).
