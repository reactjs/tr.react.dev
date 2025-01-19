---
title: "'use client'"
titleForTitleTag: "'use client' directive"
---

<RSC>

`'use client'`, [React Sunucu Bileşenleri](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ile kullanmak içindir.

</RSC>


<Intro>

`'use client'` istemcide hangi kodun çalışacağını işaretlemenizi sağlar.

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `'use client'` {/*use-client*/}

Modülü ve geçişli bağımlılıklarını istemci kodu olarak işaretlemek için bir dosyanın başına `'use client'` ekleyin.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Bir Sunucu Bileşeninden `'use client'` ile işaretlenmiş bir dosya içe aktarıldığında, [uyumlu paketleyiciler](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) modül içe aktarımını sunucu tarafından çalıştırılan ve istemci tarafından çalıştırılan kod arasında bir sınır olarak değerlendirecektir.

`RichTextEditor` bağımlılıkları olarak, `formatDate` ve `Button` da modüllerinin bir `'use client'` yönergesi içerip içermediğine bakılmaksızın istemcide değerlendirilecektir. Tek bir modülün sunucu kodundan içe aktarıldığında sunucuda, istemci kodundan içe aktarıldığında ise istemcide değerlendirilebileceğini unutmayın.

#### Uyarılar {/*caveats*/}

* `'use client'` bir dosyanın en başında, tüm içe aktarmaların veya diğer kodların üzerinde olmalıdır (yorumlarda sorun yoktur). Tek ya da çift tırnakla yazılmalı, ancak ters tırnak kullanılmamalıdır.
* Bir `'use client'` modülü istemci tarafından oluşturulan başka bir modülden içe aktarıldığında, direktifin hiçbir etkisi yoktur.
* Bir bileşen modülü `'use client'` yönergesi içerdiğinde, bu bileşenin her türlü kullanımının bir İstemci Bileşeni olacağı garanti edilir. Ancak bir bileşen `'use client'` yönergesine sahip olmasa bile istemci üzerinde değerlendirilebilir.
  * Bir bileşen kullanımı, `'use client'` yönergesine sahip bir modülde tanımlanmışsa veya `'use client'` yönergesi içeren bir modülün geçişli bağımlılığı ise İstemci Bileşeni olarak kabul edilir. Aksi takdirde, bir Sunucu Bileşenidir.
* İstemci değerlendirmesi için işaretlenen kod bileşenlerle sınırlı değildir. İstemci modülü alt ağacının bir parçası olan tüm kodlar istemciye gönderilir ve istemci tarafından çalıştırılır.
* Sunucu tarafından değerlendirilen bir modül, bir `'use client'` modülünden değerleri içe aktardığında, değerler ya bir React bileşeni olmalı ya da bir İstemci Bileşenine aktarılmak üzere [desteklenen serileştirilebilir prop değerleri](#passing-props-from-server-to-client-components) olmalıdır. Diğer kullanım durumları bir istisna oluşturur.

### `'use client'` istemci kodunu nasıl işaretler? {/*how-use-client-marks-client-code*/}

Bir React uygulamasında bileşenler genellikle ayrı dosyalara veya [modüllere](/learn/importing-and-exporting-components#exporting-and-importing-a-component) ayrılır.

React Sunucu Bileşenleri kullanan uygulamalar için, uygulama varsayılan olarak sunucu tarafından oluşturulur. `'use client'`, [modül bağımlılık ağacında](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree) bir sunucu-istemci sınırı getirerek etkin bir şekilde İstemci modüllerinin bir alt ağacını oluşturur.

Bunu daha iyi açıklamak için aşağıdaki React Sunucu Bileşenleri uygulamasını düşünün.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="İlham Alma Uygulaması" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>İlham verici sözün:</p>
      <FancyText text={quote} />
      <button onClick={next}>Bana tekrar ilham ver</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Dünün bugünden çok fazla yer kaplamasına izin vermeyin.” — Will Rogers",
  "Hırs, gökyüzüne karşı bir merdiven koymaktır.",
  "Paylaşılan bir sevinç, ikiye katlanmış bir sevinçtir.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

Bu örnek uygulamanın modül bağımlılık ağacında, `InspirationGenerator.js` içindeki `'use client'` yönergesi bu modülü ve tüm geçişli bağımlılıklarını İstemci modülleri olarak işaretler. `InspirationGenerator.js` ile başlayan alt ağaç artık İstemci modülleri olarak işaretlenmiştir.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="'App.js' modülünü temsil eden üst düğümlü bir ağaç grafiği. 'App.js'nin üç çocuğu vardır: 'Copyright.js', 'FancyText.js' ve 'InspirationGenerator.js'. 'InspirationGenerator.js' dosyasının iki çocuğu vardır: 'FancyText.js' ve 'inspirations.js'. 'InspirationGenerator.js' altındaki ve dahilindeki düğümler, 'InspirationGenerator.js' içindeki 'use client' yönergesi nedeniyle bu alt grafiğin istemci tarafından işlendiğini belirtmek için sarı bir arka plan rengine sahiptir.">
`'use client'` React Server Components uygulamasının modül bağımlılık ağacını segmentlere ayırarak `InspirationGenerator.js` ve tüm bağımlılıklarını istemci tarafından oluşturulmuş olarak işaretler.
</Diagram>

Render sırasında, framework root bileşeni sunucuda render edecek ve [render ağacı](/learn/understanding-your-ui-as-a-tree#the-render-tree) üzerinden devam ederek istemci tarafından işaretlenmiş koddan alınan herhangi bir kodu değerlendirmeyi tercih etmeyecektir.

Render ağacının sunucu tarafından render edilen kısmı daha sonra istemciye gönderilir. İstemci, istemci kodunu indirdikten sonra ağacın geri kalanını oluşturmayı tamamlar.

<Diagram name="use_client_render_tree" height={250} width={500} alt="Her bir node'un bir bileşeni ve alt elemanların da alt bileşenleri temsil ettiği bir ağaç grafiği. Üst düzey düğüm 'App' olarak etiketlenmiştir ve 'InspirationGenerator' ve 'FancyText' adlı iki alt bileşene sahiptir. 'InspirationGenerator' öğesinin iki alt bileşeni vardır: 'FancyText' ve 'Copyright'. Hem 'InspirationGenerator' hem de alt bileşeni 'FancyText' istemci tarafından oluşturulmak üzere işaretlenmiştir.">
React Sunucu Bileşenleri uygulaması için render ağacı. `InspirationGenerator` ve alt bileşeni `FancyText`, istemci tarafından işaretlenmiş koddan dışa aktarılan bileşenlerdir ve İstemci Bileşenleri olarak kabul edilir.
</Diagram>

Aşağıdaki tanımları tanıtıyoruz:

* **İstemci Bileşenleri** bir render ağacında bulunan ve istemcide render edilen bileşenlerdir
* **Sunucu Bileşenleri** bir render ağacında bulunan ve sunucuda render edilen bileşenlerdir.

Örnek uygulama üzerinde çalışıldığında, `App`, `FancyText` ve `Copyright` sunucu tarafından oluşturulur ve Sunucu Bileşenleri olarak kabul edilir. `InspirationGenerator.js` ve onun geçişli bağımlılıkları istemci kodu olarak işaretlendiğinden, `InspirationGenerator` bileşeni ve onun alt bileşeni `FancyText` İstemci Bileşenleridir.

<DeepDive>
#### `FancyText` nasıl hem Sunucu hem de İstemci Bileşenidir? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Yukarıdaki tanımlara göre, `FancyText` bileşeni hem Sunucu hem de İstemci Bileşenidir, bu nasıl olabilir?

Öncelikle “bileşen” teriminin çok kesin olmadığını açıklığa kavuşturalım. Burada “bileşen” kelimesinin anlaşılabileceği sadece iki yol vardır:

1. Bir “bileşen” bir **bileşen tanımı** anlamına gelebilir. Çoğu durumda bu bir fonksiyon olacaktır.

```js
// Bu bir bileşenin tanımıdır
function MyComponent() {
  return <p>My Component</p>
}
```

2. Bir “bileşen”, tanımının bir **bileşen kullanımına** da atıfta bulunabilir.
```js
import MyComponent from './MyComponent';

function App() {
  // Bu bir bileşenin kullanımıdır
  return <MyComponent />;
}
```

Kavramları açıklarken çoğu zaman kesin olmamak önemli değildir, ancak bu durumda önemlidir.

Sunucu veya İstemci Bileşenleri hakkında konuştuğumuzda, bileşen kullanımlarına atıfta bulunuyoruz.

* Bileşen `'use client'` yönergesine sahip bir modülde tanımlanmışsa veya bileşen bir İstemci Bileşeni içinde içe aktarılmış ve çağrılmışsa, bileşen kullanımı bir İstemci Bileşenidir.
* Aksi takdirde, bileşen kullanımı bir Sunucu Bileşenidir.


<Diagram name="use_client_render_tree" height={150} width={450} alt="Her bir node'un bir bileşeni ve alt elemanın da alt bileşenleri temsil ettiği bir ağaç grafiği. Üst düzey node 'App' olarak etiketlenmiştir. 'InspirationGenerator' ve 'FancyText' adlı iki alt bileşene sahiptir. 'InspirationGenerator' iki alt bileşene sahiptir, 'FancyText' ve 'Copyright'. Hem 'InspirationGenerator' hem de alt bileşeni 'FancyText' istemci tarafından oluşturulmak üzere işaretlenmiştir.">Bir render ağacı bileşen kullanımlarını gösterir.</Diagram>

`FancyText` sorusuna geri dönersek, bileşen tanımının bir `'use client'` yönergesine sahip _olmadığını_ ve iki kullanımı olduğunu görüyoruz.

`FancyText`'in `App`'in bir alt öğesi olarak kullanılması, bu kullanımı bir Sunucu Bileşeni olarak işaretler. `FancyText` içe aktarıldığında ve `InspirationGenerator` altında çağrıldığında, `InspirationGenerator` bir `'use client'` yönergesi içerdiğinden, `FancyText` kullanımı bir İstemci Bileşenidir.

`FancyText` için bileşen tanımının hem sunucuda değerlendirileceği hem de İstemci Bileşeni kullanımını oluşturmak için istemci tarafından indirileceği anlamına gelir.

</DeepDive>

<DeepDive>

#### `Copyright` neden bir Sunucu Bileşenidir? {/*why-is-copyright-a-server-component*/}

`Copyright`, `InspirationGenerator` İstemci Bileşeninin bir çocuğu olarak işlendiğinden, bunun bir Sunucu Bileşeni olması sizi şaşırtabilir.

`'use client'`'ın sunucu ve istemci kodu arasındaki sınırı render ağacında değil _modül bağımlılık ağacında_ tanımladığını hatırlayın.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="En üst node 'App.js' modülünü temsil eden bir ağaç grafiği. 'App.js''nin üç çocuğu vardır: 'Copyright.js', 'FancyText.js', ve 'InspirationGenerator.js'. 'InspirationGenerator.js' dosyasının iki çocuğu vardır: 'FancyText.js' ve 'inspirations.js'. 'InspirationGenerator.js' altındaki ve dahilindeki node'lar, 'InspirationGenerator.js' içindeki 'use client' yönergesi nedeniyle bu alt grafiğin istemci tarafından işlendiğini belirtmek için sarı bir arka plan rengine sahiptir.">
`'use client'` modül bağımlılık ağacında sunucu ve istemci kodu arasındaki sınırı tanımlar.
</Diagram>

Modül bağımlılık ağacında, `App.js` modülünün `Copyright.js` modülünden `Copyright` modülünü içe aktardığını ve çağırdığını görüyoruz. `Copyright.js` bir `'use client'` direktifi içermediğinden, bileşen kullanımı sunucuda oluşturulur. Root bileşen olduğu için `App` sunucuda oluşturulur.

JSX'i prop olarak geçirebildiğiniz için İstemci Bileşenleri Sunucu Bileşenlerini oluşturabilir. Bu durumda, `InspirationGenerator` [children](/learn/passing-props-to-a-component#passing-jsx-as-children) olarak `Copyright` alır. Ancak `InspirationGenerator` modülü `Copyright` modülünü asla doğrudan içe aktarmaz veya bileşeni çağırmaz, bunların hepsi `App` tarafından yapılır. Aslında `InspirationGenerator` oluşturmaya başlamadan önce `Copyright` bileşeni tamamen çalıştırılır.

Buradan çıkarılacak sonuç, bileşenler arasındaki üst eleman-alt eleman render ilişkisinin aynı render ortamını garanti etmediğidir.

</DeepDive>

### `'use client'` ne zaman kullanılır? {/*when-to-use-use-client*/}

`'use client'` ile bileşenlerin ne zaman İstemci Bileşeni olduğunu belirleyebilirsiniz. Sunucu Bileşenleri varsayılan olduğundan burada bir şeyi ne zaman istemci tarafından işlenmiş olarak işaretlemeniz gerektiğini belirlemek için Sunucu Bileşenlerinin avantajları ve sınırlamalarına kısa bir genel bakış yer almaktadır.

Basit olması için Sunucu Bileşenlerinden bahsediyoruz, ancak aynı ilkeler uygulamanızdaki sunucuda çalışan tüm kodlar için geçerlidir.

#### Sunucu Bileşenlerinin Avantajları {/*advantages*/}
* Sunucu Bileşenleri, istemci tarafından gönderilen ve çalıştırılan kod miktarını azaltabilir. Yalnızca İstemci modülleri paketlenir ve istemci tarafından değerlendirilir.
* Sunucu Bileşenleri sunucu üzerinde çalışmaktan yararlanır. Yerel dosya sistemine erişebilirler ve veri getirme ve ağ istekleri için düşük gecikme yaşayabilirler.

#### Sunucu Bileşenlerinin Sınırlamaları {/*limitations*/}
* Olay yöneticilerinin bir istemci tarafından kaydedilmesi ve tetiklenmesi gerektiğinden Sunucu Bileşenleri etkileşimi destekleyemez.
  * Örneğin, `onClick` gibi olay yöneticileri yalnızca İstemci Bileşenlerinde tanımlanabilir.
* Sunucu Bileşenleri çoğu Hook'ları kullanamaz.
  * Sunucu Bileşenleri işlendiğinde, çıktıları esasen istemcinin işlemesi için bileşenlerin bir listesidir. Sunucu Bileşenleri render işleminden sonra bellekte kalıcı değildir ve kendi state'lerine sahip olamazlar.

### Sunucu Bileşenleri tarafından döndürülen serileştirilebilir türler {/*serializable-types*/}

Tüm React uygulamalarında olduğu gibi, üst bileşenler alt bileşenlere veri aktarır. Farklı ortamlarda işlendikleri için, bir Sunucu Bileşeninden bir İstemci Bileşenine veri aktarmak ekstra dikkat gerektirir.

Bir Sunucu Bileşeninden İstemci Bileşenine aktarılan prop değerleri serileştirilebilir olmalıdır.

Serileştirilebilir prop'lar şunları içerir:
* Primitives
  * [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
  * [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
  * [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  * [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
  * [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
  * [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
  * [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), aracılığıyla yalnızca global Sembol kayıt defterine kayıtlı semboller [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Serileştirilebilir değerler içeren yinelenebilir dosyalar
  * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
  * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
  * [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  * [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ve [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are [Server Functions](/reference/rsc/server-functions)
* Client or Server Component elements (JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Özellikle, bunlar desteklenmemektedir:
* İstemci işaretli modüllerden dışa aktarılmayan veya [`'use server'`](/reference/rsc/use-server) ile işaretlenmeyen [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Herhangi bir sınıfın örneği olan nesneler (belirtilen yerleşikler dışında) veya [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) nesneler
* Global olarak kaydedilmemiş semboller, örn. `Symbol('my new symbol')`


## Kullanım {/*usage*/}

### Etkileşim ve state ile inşa etme {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Sayı: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

`Counter` değeri artırmak ya da azaltmak için hem `useState` Hook'una hem de olay yöneticilerine ihtiyaç duyduğundan, bu bileşen bir İstemci Bileşeni olmalıdır ve en üstte bir `'use client'` yönergesi gerektirecektir.

Buna karşılık etkileşim olmadan kullanıcı arayüzü oluşturan bir bileşenin İstemci Bileşeni olması gerekmez.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Örneğin `Counter`ın üst bileşeni olan `CounterContainer` etkileşimli olmadığı ve state kullanmadığı için `'use client'` gerektirmez. Ayrıca `CounterContainer` bir Sunucu Bileşeni olmalıdır, çünkü sunucudaki yerel dosya sisteminden okuma yapar. Bu da yalnızca bir Sunucu Bileşeninde mümkündür.

Sunucu veya istemciye özel herhangi bir özellik kullanmayan ve nerede işlendiklerinden bağımsız olabilen bileşenler de vardır. Daha önceki örneğimizde, `FancyText` böyle bir bileşendir.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

Bu durumda `'use client'` yönergesini eklemiyoruz, bu da `FancyText`'in _output_'unun (kaynak kodu yerine) bir Sunucu Bileşeninden başvurulduğunda tarayıcıya gönderilmesine neden oluyor. Daha önceki Inspirations uygulaması örneğinde gösterildiği gibi `FancyText` içe aktarıldığı ve kullanıldığı yere bağlı olarak hem Sunucu hem de İstemci Bileşeni olarak kullanılır.

Ancak `FancyText`in HTML çıktısı kaynak koduna (bağımlılıklar dahil) göre büyükse, onu her zaman bir İstemci Bileşeni olmaya zorlamak daha verimli olabilir. Uzun bir SVG path'i döndüren bileşenler, bir bileşeni İstemci Bileşeni olmaya zorlamanın daha verimli olabileceği bir durumdur.

### İstemci API'lerini kullanma {/*using-client-apis*/}

React uygulamanız, [diğerlerinin](https://developer.mozilla.org/en-US/docs/Web/API) yanı sıra tarayıcının web depolama, ses ve video işleme ve cihaz donanımı için API'leri gibi istemciye özel API'ler kullanabilir.

Bu örnekte bileşen bir [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) öğesini işlemek için [DOM API](https://developer.mozilla.org/en-US/docs/Glossary/DOM)'lerini kullanır. Bu API'ler yalnızca tarayıcıda kullanılabildiğinden, İstemci Bileşeni olarak işaretlenmelidir.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Üçüncü taraf kütüphaneleri kullanma {/*using-third-party-libraries*/}

Genellikle bir React uygulamasında yaygın kullanıcı arayüzü modellerini veya mantığını işlemek için üçüncü taraf kütüphanelerden yararlanırsınız.

Bu kütüphaneler bileşen Hook'larına veya istemci API'lerine dayanabilir. Aşağıdaki React API'lerinden herhangi birini kullanan üçüncü taraf bileşenleri istemci üzerinde çalışmalıdır:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) ve [`react-dom`](/reference/react-dom/hooks) Hooks, [`use`](/reference/react/use) ve [`useId`](/reference/react/useId) hariç
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* İstemci API'leri kullanıyorlarsa, örneğin DOM ekleme veya yerel platform görünümleri

Bu kütüphaneler React Server Components ile uyumlu olacak şekilde güncelleştirildiyse, kendi '`'use client' işaretçilerini zaten içerecek ve bunları doğrudan Sunucu Bileşenlerinizden kullanmanıza olanak tanıyacaktır. Bir kütüphane güncellenmemişse veya bir bileşenin yalnızca istemcide belirtilebilen olay yöneticileri gibi desteklere ihtiyacı varsa, üçüncü taraf İstemci Bileşeni ile kullanmak istediğiniz Sunucu Bileşeniniz arasına kendi İstemci Bileşeni dosyanızı eklemeniz gerekebilir.

[TODO]: <> (Troubleshooting - need use-cases)