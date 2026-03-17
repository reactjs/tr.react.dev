---
title: cloneElement
---

<Pitfall>

`cloneElement` kullanımı yaygın değildir ve kırılgan kodlara yol açabilir. [Yaygın alternatiflere göz atın.](#alternatives)

</Pitfall>

<Intro>

`cloneElement`, başka bir elementi başlangıç noktası olarak kullanarak yeni bir React elementi oluşturmanıza olanak tanır.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

`element` temel alınarak ancak farklı `props` ve `children` ile bir React elementi oluşturmak için `cloneElement` fonksiyonunu çağırın:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[Daha fazla örneği aşağıda inceleyin.](#usage)

#### Parametreler {/*parameters*/}

* `element`: `element` argümanı geçerli bir React elementi olmalıdır. Örneğin `<Something />` gibi bir JSX node’u, [`createElement`](/reference/react/createElement) çağrısının sonucu veya başka bir `cloneElement` çağrısının sonucu olabilir.

* `props`: `props` argümanı bir obje veya `null` olmalıdır. Eğer `null` geçirirseniz, clone edilen element orijinal `element.props` değerlerini korur. Aksi takdirde, `props` objesindeki her prop için dönen element, `element.props` yerine `props` içindeki değeri "tercih eder". Geri kalan prop’lar orijinal `element.props`’tan doldurulur. Eğer `props.key` veya `props.ref` geçirirseniz, bunlar orijinal değerlerin yerini alır.

* **opsiyonel** `...children`: Sıfır veya daha fazla child node. Bunlar React element’leri, string’ler, sayılar, [portals](/reference/react-dom/createPortal), boş node’lar (`null`, `undefined`, `true`, `false`) ve React node dizileri dahil olmak üzere herhangi bir React node olabilir. Eğer herhangi bir `...children` argümanı geçmezseniz, orijinal `element.props.children` korunur.

#### Returns {/*returns*/}

`cloneElement`, birkaç özelliğe sahip bir React element objesi döndürür:

* `type`: `element.type` ile aynıdır.
* `props`: `element.props` ile verdiğiniz override `props`’un shallow merge edilmesi sonucu oluşur.
* `ref`: `props.ref` ile override edilmediyse, orijinal `element.ref`.
* `key`: `props.key` ile override edilmediyse, orijinal `element.key`.

Genellikle, bu elementi component’inizden döndürür veya başka bir elementin child’ı olarak kullanırsınız. Element’in özelliklerini okuyabilseniz de, oluşturulduktan sonra her elementi opaque (iç yapısı bilinmeyen) olarak ele almak ve sadece render etmek en iyisidir.

#### Uyarılar {/*caveats*/}

* Bir elementi clone etmek **orijinal elementi değiştirmez.**

* `children`’ları `cloneElement`’e yalnızca **tamamı statik olarak biliniyorsa çoklu argümanlar şeklinde geçmelisiniz,** örneğin `cloneElement(element, null, child1, child2, child3)`. Eğer `children` dinamik ise, tüm diziyi üçüncü argüman olarak geçin: `cloneElement(element, null, listItems)`. Bu, React’in dinamik listeler için [eksik `key` uyarısı vermesini](/learn/rendering-lists#keeping-list-items-in-order-with-key) sağlar. Statik listeler için bu gerekli değildir çünkü yeniden sıralanmazlar.

* `cloneElement`, veri akışını takip etmeyi zorlaştırır, bu yüzden **bunun yerine [alternatifleri](#alternatives) kullanmayı deneyin.**

---

## Kullanım {/*usage*/}

### Bir öğenin özelliklerini geçersiz kılma {/*overriding-props-of-an-element*/}

Bazı <CodeStep step={1}>React element</CodeStep> prop’larını override etmek için, onu `cloneElement`’e <CodeStep step={2}>override etmek istediğiniz props</CodeStep> ile geçirin:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Burada, ortaya çıkan <CodeStep step={3}>cloned element</CodeStep> `<Row title="Cabbage" isHighlighted={true} />` olacaktır.

**Ne zaman kullanışlı olduğunu görmek için bir örnek üzerinden gidelim.**

Bir `List` component’ini düşünün; bu component [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) öğelerini, seçilebilir satırlar listesi olarak render eder ve hangi satırın seçili olduğunu değiştiren bir "Next" butonu vardır. `List` component’i seçili `Row`’u farklı render etmesi gerektiğinden, aldığı her `<Row>` child’ını clone eder ve ekstra bir `isHighlighted: true` veya `isHighlighted: false` prop’u ekler:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Diyelim ki `List`’in aldığı orijinal JSX şöyle görünüyor:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Children’larını clone ederek, `List` her bir `Row`’a ekstra bilgi geçirebilir. Sonuç şöyle görünür:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

“Next” butonuna basıldığında `List`’in state’inin nasıl güncellendiğine ve farklı bir satırın highlight edildiğine dikkat edin:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Özetle, `List` aldığı `<Row />` elementlerini clone etti ve bunlara ekstra bir prop ekledi.

<Pitfall>

Children’ları clone etmek, veri akışının uygulamanızda nasıl ilerlediğini anlamayı zorlaştırır. [Alternatiflerden](#alternatives) birini denemeyi deneyin.

</Pitfall>

---

## Alternatifler {/*alternatives*/}

### Render prop ile veri aktarımı {/*passing-data-with-a-render-prop*/}

`cloneElement` kullanmak yerine, `renderItem` gibi bir *render prop* kabul etmeyi düşünebilirsiniz. Burada `List`, `renderItem`’ı bir prop olarak alır. `List`, her item için `renderItem`’ı çağırır ve `isHighlighted`’ı bir argüman olarak geçirir:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

`renderItem` prop’una "render prop" denir çünkü bir şeyin nasıl render edileceğini belirten bir prop’tur. Örneğin, verilen `isHighlighted` değeri ile bir `<Row>` render eden bir `renderItem` implementasyonu geçebilirsiniz:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Sonuç, `cloneElement` kullanımıyla elde edilen ile aynıdır:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Ancak, `isHighlighted` değerinin nereden geldiğini açıkça takip edebilirsiniz.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Bu desen, `cloneElement`’e göre tercih edilir çünkü daha açıktır.

---

### Veriyi context üzerinden geçirmek {/*passing-data-through-context*/}

`cloneElement`’e bir diğer alternatif ise veriyi [context üzerinden geçirmektir.](/learn/passing-data-deeply-with-context)

Örneğin, bir `HighlightContext` tanımlamak için [`createContext`](/reference/react/createContext) çağırabilirsiniz:

```js
export const HighlightContext = createContext(false);
```

Your `List` component can wrap every item it renders into a `HighlightContext` provider:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext>
        );
      })}
```

With this approach, `Row` does not need to receive an `isHighlighted` prop at all. Instead, it reads the context:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

This allows the calling component to not know or worry about passing `isHighlighted` to `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Instead, `List` and `Row` coordinate the highlighting logic through context.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Learn more about passing data through context.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Extracting logic into a custom Hook {/*extracting-logic-into-a-custom-hook*/}

Another approach you can try is to extract the "non-visual" logic into your own Hook, and use the information returned by your Hook to decide what to render. For example, you could write a `useList` custom Hook like this:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Then you could use it like this:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

The data flow is explicit, but the state is inside the `useList` custom Hook that you can use from any component:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

This approach is particularly useful if you want to reuse this logic between different components.
