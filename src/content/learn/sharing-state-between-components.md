---
title: Bileşenler Arasında State Paylaşımı
---

<Intro>

Bazen, iki bileşenin state'inin her zaman birlikte değişmesini istersiniz. Bunu yapmak için, her iki bileşenden state'i kaldırın, en yakın ortak üst elemana taşıyın ve ardından onlara proplar aracılığıyla iletin. Bu, *state'i yukarı kaldırma* olarak bilinir ve React kodu yazarken yapacağınız en yaygın şeylerden biridir.

</Intro>

<YouWillLearn>

- Yukarı kaldırarak bileşenler arasında state paylaşımı nasıl yapılır?
- Kontrollü ve kontrolsüz bileşenler nedir?

</YouWillLearn>

## Örnek ile state'in yukarı kaldırılması {/*lifting-state-up-by-example*/}

Bu örnekte, bir üst `Accordion` bileşeni iki ayrı `Panel` bileşenini render eder:

* `Accordion`
  - `Panel`
  - `Panel`

Her `Panel` bileşeninin içeriğinin görünürlüğünü belirleyen bir boolean `isActive` state'i vardır.

Her iki panel için de Göster düğmesine basın:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Göster
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Ankara, Türkiye</h2>
      <Panel title="Hakkında">
        Ankara, Türkiye'nin başkenti ve İstanbul'dan sonra en kalabalık ikinci ilidir.
      </Panel>
      <Panel title="Etimoloji">
        Belgelere dayanmayan ve günümüze kadar gelen söylentilere göre tarihte bahsedilen ilk adı Galatlar tarafından verilen ve Yunanca "çapa" anlamına gelen <i lang="el">Ankyra</i>'dır. Bu isim zamanla değişerek Ancyre, Engüriye, Engürü, Angara, Angora ve nihayet Ankara olmuştur.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Dikkat edin, bir panelin düğmesine basmak diğer paneli etkilemez. Bağımsızdırlar.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Üç bileşenin ağacını gösteren bir diyagram, biri Accordion olarak adlandırılan üst eleman ve iki çocuk bileşeni Panel olarak etiketlenmiştir. Her iki Panel bileşeni de false değerine sahip isActive içerir.">

Başlangıçta, her `Panel`'in `isActive` state'i `false` olduğundan, ikisi de kapalı görünür.

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Öncekiyle aynı diyagram, ancak ilk çocuk Panel bileşeninin isActive değeri true olarak ayarlanmış bir tıklama ile vurgulanıyor. İkinci Panel bileşeni hala false değerini içeriyor." >

Herhangi bir `Panel`'in düğmesine tıklamak, yalnızca o `Panel`'in `isActive` state'ini günceller.

</Diagram>

</DiagramGroup>

**Ancak şimdi sadece bir panelin herhangi bir anda genişletilmesini istediğinizi varsayalım.** Bu tasarımla, ikinci paneli genişletmek, birincisini daraltmalıdır. Bunu nasıl yapardın?

Bu iki paneli koordine etmek için, üç adımda "state'in yukarı kaldırılması" gerekiyor:

1. Alt elemandan state'i **kaldırın.**
2. Ortak üst elemandan hardcoded veriyi **iletin.**
3. Ortak üst elemana state **ekleyin** ve olay işleyicileriyle birlikte aşağıya geçirin.

Bu `Accordion` bileşeninin her iki `Panel`'i koordine etmesine ve her seferinde yalnızca birini genişletmesine izin verecektir.

### Adım 1: Alt elemandan state'i kaldırın. {/*step-1-remove-state-from-the-child-components*/}

`Panel`'in `isActive` kontrolünü üst elemanına vereceksiniz. Bu, üst elemanı `isActive`'i `Panel`'e prop olarak geçireceği anlamına gelir. `Panel` bileşeninden **bu satırı kaldırarak** başlayın:

```js
const [isActive, setIsActive] = useState(false);
```

Bunun yerine, `isActive`'i `Panel`'in prop listesine ekleyin:

```js
function Panel({ title, children, isActive }) {
```

Şimdi, `Panel`'in üst bileşeni `isActive`'i [bileşenlere prop'ları aktarma](/learn/passing-props-to-a-component) yöntemiyle kontrol edebilir. Tersine, `Panel` bileşeninin artık `isActive`'in değerini kontrol etme *yetkisi yoktur* -- bu, artık üst bileşene bağlıdır!

### Adım 2: Ortak üst elemandan hardcoded veriyi iletin. {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

State'i yukarı taşımak için, koordine etmek istediğiniz *her iki* alt bileşenin en yakın ortak üst bileşenini bulmanız gerekir:

* `Accordion` *(en yakın üst eleman)*
  - `Panel`
  - `Panel`

Bu örnekte, `Accordion` bileşenidir. Her iki panelin üzerinde ve prop'larını kontrol edebildiği için, o anda aktif olan panelin "gerçeklik kaynağı" olacaktır. `Accordion` bileşeninin her iki panele de `isActive`'in hardcoded bir değerini (örneğin `true`) geçirmesini sağlayın:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Ankara, Türkiye</h2>
      <Panel title="Hakkında" isActive={true}>
        Ankara, Türkiye'nin başkenti ve İstanbul'dan sonra en kalabalık ikinci ilidir.
      </Panel>
      <Panel title="Etimoloji" isActive={true}>
        Belgelere dayanmayan ve günümüze kadar gelen söylentilere göre tarihte bahsedilen ilk adı Galatlar tarafından verilen ve Yunanca "çapa" anlamına gelen <i lang="el">Ankyra</i>'dır. Bu isim zamanla değişerek Ancyre, Engüriye, Engürü, Angara, Angora ve nihayet Ankara olmuştur.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Göster
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Accordion` bileşenindeki hardcoded `isActive` değerlerini düzenlemeyi deneyin ve sonucu ekranda görün.

### Adım 3: Ortak üst elemana state ekleyin. {/*step-3-add-state-to-the-common-parent*/}

State'i yukarı taşımak genellikle depoladığınız state'in doğasını değiştirir.

Bu durumda, aynı anda yalnızca bir panel aktif olmalıdır. Bu, `Accordion` ortak üst bileşeninin *hangi* panelin aktif olduğunu takip etmesi gerektiği anlamına gelir. Bir `boolean` değeri yerine, aktif `Panel`'in state değişkeni için bir sayı kullanabilir:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex` `0` olduğunda, ilk panel aktiftir ve `1` olduğunda ikincisi aktif olur.

Herhangi `Panel` içindeki "Göster" düğmesine tıklamak, `Accordion` içindeki aktif indexi değiştirmelidir. `Panel` doğrudan `activeIndex` state'ini ayarlayamaz çünkü `Accordion` içinde tanımlanmıştır. `Accordion` bileşenin `Panel` bileşeninin state'ini değiştirmesine *izin vermesi için* [bir olay yöneticisini prop olarak aşağıya geçirmesi](/learn/responding-to-events#passing-event-handlers-as-props) gerekir:

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`Panel` içindeki `<button>` artık tıklama olayı yöneticisi olarak `onShow` prop'unu kullanacaktır:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Ankara, Türkiye</h2>
      <Panel
        title="Hakkında"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Ankara, Türkiye'nin başkenti ve İstanbul'dan sonra en kalabalık ikinci ilidir.
      </Panel>
      <Panel
        title="Etimoloji"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Belgelere dayanmayan ve günümüze kadar gelen söylentilere göre tarihte bahsedilen ilk adı Galatlar tarafından verilen ve Yunanca "çapa" anlamına gelen <i lang="el">Ankyra</i>'dır. Bu isim zamanla değişerek Ancyre, Engüriye, Engürü, Angara, Angora ve nihayet Ankara olmuştur.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Göster
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Bu state'i yukarı taşıma işlemini tamamlar! State'i ortak üst bileşene taşımak, iki paneli koordine etmenizi sağladı. "isShown" bayrakları yerine aktif index kullanmak, aynı anda yalnızca bir panelin aktif olmasını sağladı. Ve olay yöneticisini alt bileşene geçirmek, alt bileşenin üst bileşenin state'ini değiştirmesine izin verdi.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diyagram, üç bileşenli bir ağacı gösteriyor. Bir üst eleman olan Accordion ve iki çocuk olan Panel. Accordion, sıfır olan activeIndex değerine sahiptir ve bu değer, ilk Panel'e geçerken true olan isActive değerine dönüşür, ikinci Panel'e geçerken ise false olan isActive değerine dönüşür." >

Başlangıçta, `Accordion`'un `activeIndex` değeri `0` olduğundan, ilk `Panel` `isActive = true` değerini alır

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

`Accordion`'un `activeIndex` değeri `1` olduğunda, ikinci `Panel` `isActive = true` değerini alır'

</Diagram>

</DiagramGroup>

<DeepDive>

#### Controlled and uncontrolled components {/*controlled-and-uncontrolled-components*/}

It is common to call a component with some local state "uncontrolled". For example, the original `Panel` component with an `isActive` state variable is uncontrolled because its parent cannot influence whether the panel is active or not.

In contrast, you might say a component is "controlled" when the important information in it is driven by props rather than its own local state. This lets the parent component fully specify its behavior. The final `Panel` component with the `isActive` prop is controlled by the `Accordion` component.

Uncontrolled components are easier to use within their parents because they require less configuration. But they're less flexible when you want to coordinate them together. Controlled components are maximally flexible, but they require the parent components to fully configure them with props.

In practice, "controlled" and "uncontrolled" aren't strict technical terms--each component usually has some mix of both local state and props. However, this is a useful way to talk about how components are designed and what capabilities they offer.

When writing a component, consider which information in it should be controlled (via props), and which information should be uncontrolled (via state). But you can always change your mind and refactor later.

</DeepDive>

## A single source of truth for each state {/*a-single-source-of-truth-for-each-state*/}

In a React application, many components will have their own state. Some state may "live" close to the leaf components (components at the bottom of the tree) like inputs. Other state may "live" closer to the top of the app. For example, even client-side routing libraries are usually implemented by storing the current route in the React state, and passing it down by props!

**For each unique piece of state, you will choose the component that "owns" it.** This principle is also known as having a ["single source of truth".](https://en.wikipedia.org/wiki/Single_source_of_truth) It doesn't mean that all state lives in one place--but that for _each_ piece of state, there is a _specific_ component that holds that piece of information. Instead of duplicating shared state between components, *lift it up* to their common shared parent, and *pass it down* to the children that need it.

Your app will change as you work on it. It is common that you will move state down or back up while you're still figuring out where each piece of the state "lives". This is all part of the process!

To see what this feels like in practice with a few more components, read [Thinking in React.](/learn/thinking-in-react)

<Recap>

* When you want to coordinate two components, move their state to their common parent.
* Then pass the information down through props from their common parent.
* Finally, pass the event handlers down so that the children can change the parent's state.
* It's useful to consider components as "controlled" (driven by props) or "uncontrolled" (driven by state).

</Recap>

<Challenges>

#### Synced inputs {/*synced-inputs*/}

These two inputs are independent. Make them stay in sync: editing one input should update the other input with the same text, and vice versa. 

<Hint>

You'll need to lift their state up into the parent component.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Move the `text` state variable into the parent component along with the `handleChange` handler. Then pass them down as props to both of the `Input` components. This will keep them in sync.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtering a list {/*filtering-a-list*/}

In this example, the `SearchBar` has its own `query` state that controls the text input. Its parent `FilterableList` component displays a `List` of items, but it doesn't take the search query into account.

Use the `filterItems(foods, query)` function to filter the list according to the search query. To test your changes, verify that typing "s" into the input filters down the list to "Sushi", "Shish kebab", and "Dim sum".

Note that `filterItems` is already implemented and imported so you don't need to write it yourself!

<Hint>

You will want to remove the `query` state and the `handleChange` handler from the `SearchBar`, and move them to the `FilterableList`. Then pass them down to `SearchBar` as `query` and `onChange` props.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Lift the `query` state up into the `FilterableList` component. Call `filterItems(foods, query)` to get the filtered list and pass it down to the `List`. Now changing the query input is reflected in the list:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
