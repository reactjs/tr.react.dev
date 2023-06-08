---
title: render
---

<Deprecated>

Bu API, React'in gelecekteki bir ana sürümünde kaldırılacaktır.

React 18'de `render`, [`createRoot`.](/reference/react-dom/client/createRoot) ile değiştirildi. React 18'de `render` kullanmak, uygulamanızın React 17 gibi davranacağı uyarısını verecektir. Daha fazla bilgi için [buraya](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis) bakın.

</Deprecated>

<Intro>

`render` bir [JSX](/learn/writing-markup-with-jsx) ("React düğümü") parçasını tarayıcı DOM düğümüne render eder.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Bir tarayıcı DOM düğümünün içinde, bir React bileşeni görüntülemek için `render`'ı çağırın.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React `<App />`'i `domNode` içinde görüntüleyecek ve içindeki DOM'u yönetmeye başlayacaktır.

Tamamen React ile oluşturulmuş bir uygulama genellikle kök(root) bileşeni ile yalnızca bir `render` çağrısına sahip olacaktır. Sayfanın bazı bölümleri için React "sprinkles" kullanan bir sayfada, gerektiği kadar çok `render` çağrısına sahip olabilir.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: Görüntülemek istediğiniz *React düğümü*. Bu genellikle `<App />` gibi bir JSX parçası olacaktır, ancak [`createElement()`](/reference/react/createElement) ile oluşturulmuş bir React elemanına, bir dize, bir sayı, `null` veya `undefined` da geçirebilirsiniz.

* `domNode`: [DOM elemanı.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React, geçtiğiniz `reactNode`'u bu DOM elemanının içinde görüntüleyecektir. Bu andan itibaren, React `domNode` içindeki DOM'u yönetecek ve React ağacınız (React tree) değiştiğinde güncelleyecektir.

* **optional** `callback`: Fonksiyon. Geçilirse, React bileşeniniz DOM'a yerleştirildikten sonra onu çağıracaktır.

#### Dönüş değerleri {/*returns*/}

`render` genellikle `null` döndürür. Ancak, geçtiğiniz `reactNode` bir *sınıf bileşeni* ise, o zaman bileşenin bir örneğini döndürecektir.

#### Dikkat edilmesi gerekenler {/*caveats*/}

* React 18'de `render` [`createRoot`.](/reference/react-dom/client/createRoot) ile değiştirildi. Lütfen React 18 ve sonrası için `createRoot` kullanın.

* İlk `render` çağrısında, React, React bileşenini render etmek için `domNode` içindeki tüm mevcut HTML içeriğini temizleyecektir. `domNode`'unuz, sunucu veya derleme sırasında React tarafından oluşturulan HTML içeriyorsa, bunun yerine var olan HTML'e olay işleyicilerini ekleyen [`hydrate()`](/reference/react-dom/hydrate) kullanın.

* Eğer aynı `domNode` üzerinde birden fazla `render` çağrısı yaparsanız, React, geçtiğiniz son JSX'i yansıtmak için gerektiğinde DOM'u güncelleyecektir. React, DOM'un hangi kısımlarının yeniden kullanılabileceğine ve hangilerinin önceki ağaçla(tree) ["eşleştirilerek"](/learn/preserving-and-resetting-state) yeniden oluşturulması gerektiğine karar verecektir. Aynı `domNode` üzerinde `render` çağrısı yapmak, kök bileşen (root component) üzerinde [`set` fonksiyonunu](/reference/react/useState#setstate) çağırmaya benzer: React gereksiz DOM güncellemelerinden kaçınır.

* Eğer uygulamanız tamamen React ile oluşturulmuşsa, uygulamanızda muhtemelen yalnızca bir `render` çağrısı olacaktır. (Bir çatı(framework) kullanıyorsanız, bunu sizin için yapabilir.) JSX'in bir parçasını bileşeninizin bir alt öğesi olmayan DOM ağacının farklı bir yerinde görüntülemek istediğinizde (örneğin, bir modal veya bir tooltip), `render` yerine [`createPortal`](/reference/react-dom/createPortal) kullanın.

---

## Kullanım {/*usage*/}

Bir <CodeStep step={1}>React bileşenini</CodeStep> bir <CodeStep step={2}>tarayıcı DOM düğümünde</CodeStep> görüntülemek için `render`'ı çağırın.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Kök bileşeni render etmek {/*rendering-the-root-component*/}

Tamamen React ile oluşturulmuş uygulamalarda, **genellikle bunu yalnızca başlangıçta bir kez yapacaksınız** - "kök" bileşenini render etmek için.

<Sandpack>

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Merhaba Dünya!</h1>;
}
```

</Sandpack>

Genellikle `render`'ı tekrar çağırmanıza veya daha fazla yere çağırmanıza gerek yoktur. Bu noktadan itibaren, React uygulamanızın DOM'unu yönetmeye başlayacaktır. Kullanıcı arayüzünü güncellemek için bileşenleriniz [state](/reference/react/useState) kullanacak.

---

### Birden çok kök oluşturma {/*rendering-multiple-roots*/}

Eğer sayfanız [tamamen React ile oluşturulmamışsa](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), React tarafından yönetilen her bir üst düzey UI parçası için `render`'ı çağırın.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Bu paragraf React tarafından render edilmiyor (doğrulamak için index.html'i açın).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Anasayfa</NavLink>
      <NavLink href="/about">Hakkında</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Merhaba!" author="Sophie" />
      <Comment text="Nasılsın?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

[`unmountComponentAtNode()`](/reference/react-dom/unmountComponentAtNode) ile render edilmiş ağaçları(trees) yok edebilirsiniz.

---

### Render edilmiş ağaçları güncelleme {/*updating-the-rendered-tree*/}

Aynı DOM düğümü üzerinde `render`'ı birden fazla kez çağırabilirsiniz. Bileşen ağacı yapısı önceki render edilmiş olanla eşleştiği sürece, React [durumu koruyacaktır.](/learn/preserving-and-resetting-state) Tekrarlanan `render` çağrılarından her saniye gelen güncellemelerin yıkıcı olmadığını gösteren girişe yazı yazabileceğinize dikkat edin:

<Sandpack>

```js index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Merhaba Dünya! {counter}</h1>
      <input placeholder="Buraya bir şey yazın" />
    </>
  );
}
```

</Sandpack>

Bu şekilde birden fazla kez `render` çağırmak nadirdir. Genellikle, bunun yerine bileşenlerinizin içinde [state'i güncellersiniz.](/reference/react/useState)
