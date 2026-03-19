---
title: Children (Alt Eleman)
---

<Pitfall>

`Children` kullanımı nadirdir ve kırılgan koda yol açabilir. [Yaygın alternatiflere bakın.](#alternatives)

</Pitfall>

<Intro>

`Children`, [`children` prop'u](/learn/passing-props-to-a-component#passing-jsx-as-children) olarak aldığınız JSX'i değiştirmenize ve dönüştürmenize olanak tanır

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Children veri yapısındaki alt eleman sayısını saymak için `Children.count(children)` öğesini çağırın.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Toplam satır: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Aşağıda daha fazla örneğe bakın.](#counting-children)

#### Parametreler {/*children-count-parameters*/}

* `children`: Bileşeniniz tarafından alınan [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) değeri.

#### Returns {/*children-count-returns*/}

Bu `children` içindeki node'ların sayısı.

#### Uyarılar {/*children-count-caveats*/}

- Boş node'lar (`null`, `undefined` ve Booleans), string'ler, sayılar ve [React elemanları](/reference/react/createElement) ayrı node'lar olarak sayılır. Diziler tek tek node'lar olarak sayılmaz, ancak alt elemanları sayılır. **Çaprazlama React öğelerinden daha derine gitmez:** bunlar işlenmez ve alt öğeleri çaprazlanmaz. [Fragments](/reference/react/Fragment) geçilmez.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Children veri yapısındaki her alt eleman için bazı kodlar çalıştırmak üzere `Children.forEach(children, fn, thisArg?)` öğesini çağırın.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Aşağıda daha fazla örneğe bakın](#running-some-code-for-each-child)

#### Parametreler {/*children-foreach-parameters*/}

* `children`: Bileşeniniz tarafından alınan [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) değeri.
* `fn`: Her çocuk için çalıştırmak istediğiniz işlev, [array `forEach` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) callback'e benzer. İlk argüman olarak alt eleman ve ikinci argüman olarak indeksi ile çağrılacaktır. İndeks `0`dan başlar ve her çağrıda artar.
* **isteğe bağlı** `thisArg`: `fn` fonksiyonunun çağrılması gereken [`this` değeri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Atlanırsa, `tanımlanmamış` olur.

#### Returns {/*children-foreach-returns*/}

`Children.forEach` öğesi `undefined` döndürür.

#### Uyarılar {/*children-foreach-caveats*/}

- Boş node'lar (`null`, `undefined` ve Booleans), string'ler, sayılar ve [React elements](/reference/react/createElement) ayrı node'lar olarak sayılır. Diziler tek tek node'lar olarak sayılmaz, ancak alt elemanları sayılır. **Çaprazlama React öğelerinden daha derine gitmez:** bunlar işlenmez ve alt öğeleri çaprazlanmaz. [Fragments](/reference/react/Fragment) çaprazlanmaz.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Alt eleman veri yapısındaki her alt elemani eşlemek veya dönüştürmek için `Children.map(children, fn, thisArg?)` öğesini çağırın.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Aşağıda daha fazla örneğe bakınız.](#transforming-children)

#### Parameters {/*children-map-parameters*/}

* `children`: Bileşeniniz tarafından alınan [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) değeri.  
* `fn`: [array `map` metodu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) callback’ine benzer eşleme fonksiyonu. İlk argüman olarak child’ı, ikinci argüman olarak indeksini alır. İndeks `0`’dan başlar ve her çağrıda artar. Bu fonksiyondan bir React node döndürmeniz gerekir. Bu; boş bir node (`null`, `undefined` veya Boolean), bir string, bir number, bir React elementi ya da diğer React node’larından oluşan bir array olabilir.  
* **optional** `thisArg`: `fn` fonksiyonunun çağrılacağı [`this` değeri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Eğer verilmezse `undefined` olur.

#### Returns {/*children-map-returns*/}

Eğer `children` `null` veya `undefined` ise, aynı değeri döndürür.

Aksi takdirde, `fn` fonksiyonundan döndürdüğünüz node’lardan oluşan düz (flat) bir array döndürür. Dönen array, `null` ve `undefined` hariç tüm döndürdüğünüz node’ları içerir.

#### Uyarılar {/*children-map-caveats*/}

- Boş node’lar (`null`, `undefined` ve Boolean’lar), string’ler, number’lar ve [React elementleri](/reference/react/createElement) ayrı birer node olarak sayılır. Array’ler tekil node olarak sayılmaz, ancak içlerindeki çocuklar sayılır. **Traversal (gezme) React elementlerinin ötesine geçmez:** render edilmezler ve içlerindeki çocuklar da traverse edilmez. [Fragments](/reference/react/Fragment) da traverse edilmez.

- `fn` fonksiyonundan key’li bir element veya element array’i döndürürseniz, **döndürülen elementlerin key’leri, `children` içindeki karşılık gelen orijinal item’ın key’i ile otomatik olarak birleştirilir.** `fn` içinden birden fazla elementi array olarak döndürdüğünüzde, bu elementlerin key’lerinin yalnızca kendi aralarında lokal olarak benzersiz olması yeterlidir.

---

### `Children.only(children)` {/*children-only*/}


Alt elemanların tek bir React öğesini temsil ettiğini doğrulamak için `Children.only(children)` öğesini çağırın.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parametreler {/*children-only-parameters*/}

* `children`: Bileşeniniz tarafından alınan [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) değeri.

#### Returns {/*children-only-returns*/}

Eğer `children` [geçerli bir eleman ise,](/reference/react/isValidElement) bu elemanı döndürür.

Aksi takdirde hata verir.

#### Uyarılar {/*children-only-caveats*/}

- Bu yöntem **`children` olarak bir dizi (örneğin, `Children.map`'in dönüş değeri) geçirirseniz her zaman hata fırlatır.** Başka bir deyişle, `children`'ın tek bir React öğesi olmasını zorunlu kılar, ancak bu bir öğe içeren bir dizi olması anlamına gelmez.

---

### `Children.toArray(children)` {/*children-toarray*/}

Alt eleman veri yapısından bir dizi oluşturmak için `Children.toArray(çocuklar)` öğesini çağırın.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parametreler {/*children-toarray-parameters*/}

* `children`: Bileşeniniz tarafından alınan [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) değeri.

#### Returns {/*children-toarray-returns*/}

`children` içindeki elemanların düz bir dizisini döndürür.

#### Uyarılar {/*children-toarray-caveats*/}

- Boş node'lar (`null`, `undefined` ve Booleans) döndürülen dizide atlanacaktır. **Döndürülen öğelerin anahtarları, orijinal öğelerin anahtarlarından, iç içe geçme düzeylerinden ve konumlarından hesaplanacaktır.** Bu, dizinin düzleştirilmesinin davranışta değişikliklere yol açmamasını sağlar.

---

## Kullanım {/*usage*/}

### Children'ı dönüştürmek {/*transforming-children*/}

Bileşeninizin [`children` prop`u olarak aldığı](/learn/passing-props-to-a-component#passing-jsx-as-children)  JSX çocuklarını dönüştürmek için `Children.map` çağrısını yapın:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

Yukarıdaki örnekte, `RowList` aldığı her children'ı bir `<div className=“Row”>` konteynerine sarar. Örneğin, ana bileşenin `RowList` öğesine `children` prop'u olarak üç `<p>` etiketi ilettiğini varsayalım:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

Daha sonra, yukarıdaki `RowList` implementasyonu ile birlikte, son render edilmiş sonuç şu şekilde görünecektir:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map`, [array’leri `map()` ile dönüştürmeye](/learn/rendering-lists) benzer. Aradaki fark, `children` veri yapısının *opaque (şeffaf olmayan)* olarak kabul edilmesidir. Bu, bazen bir array olsa bile onun bir array ya da başka bir veri tipi olduğunu varsaymamanız gerektiği anlamına gelir. Bu yüzden, `children` üzerinde dönüşüm yapmanız gerekiyorsa `Children.map` kullanmalısınız.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### `children` prop neden her zaman bir array değildir? {/*why-is-the-children-prop-not-always-an-array*/}

React’te `children` prop’u *opaque* (şeffaf olmayan) bir veri yapısı olarak kabul edilir. Bu, onun nasıl yapılandırıldığına güvenmemeniz gerektiği anlamına gelir. `children` üzerinde transform, filtreleme veya sayma işlemleri yapmak için `Children` metodlarını kullanmalısınız.

Pratikte `children` veri yapısı çoğu zaman içeride bir array olarak temsil edilir. Ancak yalnızca tek bir child varsa, React ekstra bir array oluşturmaz; çünkü bu gereksiz bellek kullanımına yol açar. Siz `children`’ın yapısına doğrudan erişmek yerine `Children` metodlarını kullandığınız sürece, React’in iç implementasyonu değişse bile kodunuz bozulmaz.

`children` bir array olsa bile `Children.map` bazı özel davranışlar sunar. Örneğin `Children.map`, dönen elementlerin [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) değerlerini, verilen `children` içindeki key’lerle birleştirir. Bu sayede, JSX children’lar wrapper’lara sarılsa bile orijinal key’lerini “kaybetmez”.

</DeepDive>

<Pitfall>

`children` veri yapısı, JSX olarak geçirdiğiniz bileşenlerin **render edilmiş çıktısını içermez**. Aşağıdaki örnekte `RowList` tarafından alınan `children` yalnızca üç değil, iki öğe içerir:

1. `<p>This is the first item.</p>`  
2. `<MoreRows />`

Bu nedenle bu örnekte yalnızca iki row wrapper oluşturulur:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**`<MoreRows />` gibi iç bileşenlerin render edilmiş çıktısını `children` üzerinde işlem yaparak elde etmenin hiçbir yolu yoktur.** Bu yüzden [genellikle alternatif çözümlerden birini kullanmak daha iyidir.](#alternatives)

</Pitfall>

---

### Her child için kod çalıştırma {/*running-some-code-for-each-child*/}

`Children.forEach` fonksiyonunu, `children` veri yapısındaki her child üzerinde gezinmek için çağırabilirsiniz. Herhangi bir değer döndürmez ve [array `forEach` metoduna](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) benzer. Kendi array’inizi oluşturmak gibi özel mantıkları çalıştırmak için kullanılabilir.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

Daha önce de belirtildiği gibi, `children` üzerinde işlem yaparken iç bir bileşenin render edilmiş çıktısını elde etmenin hiçbir yolu yoktur. Bu yüzden [genellikle alternatif çözümlerden birini kullanmak daha iyidir.](#alternatives)

</Pitfall>

---

### Counting children {/*counting-children*/}

`Children.count(children)` fonksiyonunu çağırarak children sayısını hesaplayabilirsiniz.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Daha önce de belirtildiği gibi, `children` üzerinde işlem yaparken iç bir bileşenin render edilmiş çıktısını elde etmenin hiçbir yolu yoktur. Bu yüzden [genellikle alternatif çözümlerden birini kullanmak daha iyidir.](#alternatives)

</Pitfall>

---

### Children’ı array’e dönüştürme {/*converting-children-to-an-array*/}

`Children.toArray(children)` fonksiyonunu çağırarak `children` veri yapısını normal bir JavaScript array’ine dönüştürebilirsiniz. Bu sayede, [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) veya [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) gibi yerleşik array metodlarını kullanarak üzerinde işlem yapabilirsiniz.

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Daha önce de belirtildiği gibi, `children` üzerinde işlem yaparken iç bir bileşenin render edilmiş çıktısını elde etmenin hiçbir yolu yoktur. Bu yüzden [genellikle alternatif çözümlerden birini kullanmak daha iyidir.](#alternatives)

</Pitfall>

---

## Alternatifler {/*alternatives*/}

<Note>

Bu bölüm, şu şekilde import edilen `Children` API’sine (büyük `C` ile yazılan) alternatifleri açıklar:

```js
import { Children } from 'react';
```

Bunu, [JSX’i `children` prop’u olarak kullanmakla](/learn/passing-props-to-a-component#passing-jsx-as-children) (küçük `c`), karıştırmayın; bu kullanım doğrudur ve önerilir.

</Note>

### Birden fazla bileşen sunma {/*exposing-multiple-components*/}

`Children` metodlarıyla children üzerinde işlem yapmak genellikle kırılgan (fragile) kodlara yol açar. JSX içinde bir bileşene children verdiğinizde, genellikle o bileşenin bu children’ları tek tek manipüle etmesini veya dönüştürmesini beklemezsiniz.

Mümkün olduğunda `Children` metodlarını kullanmaktan kaçınmaya çalışın. Örneğin, `RowList` içindeki her child’ı `<div className="Row">` ile sarmalamak istiyorsanız, bir `Row` bileşeni export edin ve her satırı manuel olarak onunla sarmalayın:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`Children.map` kullanmaktan farklı olarak, bu yaklaşım her child’ı otomatik olarak sarmalamaz. **Ancak, bu yaklaşımın [`Children.map` ile yapılan önceki örneğe](#transforming-children) kıyasla önemli bir avantajı vardır: daha fazla bileşen çıkarsanız (extract etseniz) bile çalışmaya devam eder.** Örneğin, kendi `MoreRows` bileşeninizi çıkarsanız bile hâlâ çalışır:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Bu yaklaşım `Children.map` ile çalışmaz çünkü `<MoreRows />`’u tek bir child (ve tek bir row) olarak “görür”.

---

### Prop olarak object array kabul etme {/*accepting-an-array-of-objects-as-a-prop*/}

Ayrıca bir array’i açıkça prop olarak geçebilirsiniz. Örneğin, bu `RowList` bir `rows` array’ini prop olarak kabul eder:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`rows` normal bir JavaScript array olduğu için, `RowList` bileşeni üzerinde [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) gibi yerleşik array metodlarını kullanabilir.

Bu pattern, children ile birlikte daha fazla bilgiyi yapılandırılmış veri olarak geçmek istediğiniz durumlarda özellikle kullanışlıdır. Aşağıdaki örnekte, `TabSwitcher` bileşeni `tabs` prop’u olarak object’lerden oluşan bir array alır:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

JSX olarak children geçirmekten farklı olarak, bu yaklaşım her bir öğeye `header` gibi ekstra verileri ilişkilendirmenize izin verir. `tabs` verisiyle doğrudan çalıştığınız ve bu bir array olduğu için `Children` metodlarına ihtiyaç duymazsınız.

---

### Render prop çağırarak render’ı özelleştirme {/*calling-a-render-prop-to-customize-rendering*/}

Her bir öğe için JSX üretmek yerine, JSX döndüren bir fonksiyon da geçebilir ve bunu gerektiğinde çağırabilirsiniz. Bu örnekte, `App` bileşeni `TabSwitcher` bileşenine bir `renderContent` fonksiyonu geçirir. `TabSwitcher` ise bu fonksiyonu yalnızca seçili tab için çağırır:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

`renderContent` gibi bir prop’a *render prop* denir çünkü kullanıcı arayüzünün bir parçasının nasıl render edileceğini belirten bir prop’tur. Ancak bunda özel bir durum yoktur: sadece fonksiyon olan normal bir prop’tur.

Render prop’lar fonksiyon olduğu için onlara bilgi de geçebilirsiniz. Örneğin, bu `RowList` bileşeni her row’un `id` ve `index` değerini `renderRow` render prop’una geçirir ve `renderRow` bu `index` değerini kullanarak çift satırları highlight eder:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Bu, parent ve child bileşenlerin children’ları manipulate etmeden birlikte nasıl çalışabileceğine dair başka bir örnektir.

---

## Sorun giderme {/*troubleshooting*/}

### Özel bir bileşen geçiriyorum ama `Children` metodları onun render sonucunu göstermiyor {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Diyelim ki `RowList` bileşenine şu şekilde iki child geçiriyorsunuz:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

If you do `Children.count(children)` inside `RowList`, you will get `2`. Even if `MoreRows` renders 10 different items, or if it returns `null`, `Children.count(children)` will still be `2`. From the `RowList`'s perspective, it only "sees" the JSX it has received. It does not "see" the internals of the `MoreRows` component.

The limitation makes it hard to extract a component. This is why [alternatives](#alternatives) are preferred to using `Children`.
