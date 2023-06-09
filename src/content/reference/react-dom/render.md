---
title: render
---

<Deprecated>

Bu API, React'in gelecekteki bir ana sürümünde kaldırılacaktır.

React 18'de `render`, [`createRoot`](/reference/react-dom/client/createRoot) ile değiştirilmiştir. React 18'de `render` kullanmak, uygulamanızın React 17 gibi davranacağı uyarısını verecektir. Daha fazla bilgi için [buraya](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis) bakınız.

</Deprecated>

<Intro>

`render`, bir [JSX](/learn/writing-markup-with-jsx) ("React düğümü") parçasını tarayıcı DOM düğümüne render eder.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Bir tarayıcı DOM düğümünün içerisinde bir React bileşeni göstermek için `render`'ı çağırın.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React, `<App />` bileşenini `domNode` içinde görüntüleyecek ve içindeki DOM'u yönetmeye başlayacaktır.

Tamamen React ile oluşturulmuş bir uygulama genellikle sadece bir `render` çağrısıyla kök (root) bileşene sahip olur. Sayfanın bazı bölümleri için React "sprinkles" (serpme) kullanılan bir sayfada, ihtiyaç duyulan kadar çok `render` çağrısı bulunabilir.

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: Görüntülemek istediğiniz *React düğümü*. Bu genellikle `<App />` gibi bir JSX parçası olacaktır; ancak bir React elemanını [`createElement()`](/reference/react/createElement) ile oluşturabilir, bir dize, bir sayı, `null` veya `undefined` de geçirebilirsiniz.

* `domNode`: [DOM elemanı.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React, verdiğiniz `reactNode`'u bu DOM elemanının içinde gösterecektir. Bu andan itibaren, React `domNode` içindeki DOM'u yönetir ve React ağacınız (React tree) değiştiğinde güncellenir.

* **optional** `callback`: Fonksiyon. Geçilirse, React bileşeniniz DOM'a yerleştirildikten sonra bu fonksiyon çağrılır.

#### Dönüş değerleri {/*returns*/}

`render` genellikle `null` döndürür. Ancak, verdiğiniz `reactNode` bir *sınıf bileşeni* ise, bu durumda bileşenin bir örneğini döndürecektir.

#### Dikkat edilmesi gerekenler {/*caveats*/}

* React 18'de `render`, [`createRoot`](/reference/react-dom/client/createRoot) ile değiştirilmiştir. Lütfen React 18 ve sonrası için `createRoot` kullanınız.

* İlk `render` çağrısında, React, React bileşenini render etmek için `domNode` içindeki tüm mevcut HTML içeriğini siler. Eğer `domNode`'unuz, sunucu ya da derleme sürecinde React tarafından oluşturulan HTML içeriyorsa, mevcut HTML'e olay yöneticilerini (event handler) ekleyen [`hydrate()`](/reference/react-dom/hydrate) fonksiyonunu kullanınız.

* Eğer aynı `domNode` üzerinde birden fazla `render` çağrısı yaparsanız, React, verdiğiniz son JSX'i yansıtmak için gerektiğinde DOM'u güncelleyecektir. React, DOM'un hangi kısımlarının yeniden kullanılabileceğine ve hangilerinin önceki ağaç (tree) ile ["eşleştirilerek"](/learn/preserving-and-resetting-state) yeniden oluşturulması gerektiğine karar verir. Aynı `domNode` üzerinde `render` çağrısı yapmak, kök bileşen (root component) üzerinde [`set` fonksiyonunu](/reference/react/useState#setstate) çağırmaya benzer: React gereksiz DOM güncellemelerinden kaçınır.

* Eğer uygulamanız tamamen React ile oluşturulmuşsa, uygulamanızda muhtemelen yalnızca bir `render` çağrısı olacaktır. (Bir çatı (framework) kullanıyorsanız, bunu sizin için yapabilir.) JSX'in bir parçasını bileşeninizin bir alt elemanı (child component) olmayan DOM ağacının farklı bir yerinde görüntülemek istediğinizde (örneğin, bir modal veya bir tooltip), `render` yerine [`createPortal`](/reference/react-dom/createPortal) kullanınız.

---

## Kullanım {/*usage*/}

Bir <CodeStep step={1}>React bileşenini</CodeStep> bir <CodeStep step={2}>tarayıcı DOM düğümünde</CodeStep> görüntülemek için `render`'ı çağırın.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Kök bileşeni render etmek {/*rendering-the-root-component*/}

Tamamen React ile oluşturulmuş uygulamalarda, **genellikle bunu sadece başlangıçta bir kez yaparsınız** - "kök" bileşenini (root component) render etmek için.

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

Genellikle `render`'ı tekrar çağırmanıza veya başka yerlere çağırmanıza gerek yoktur. Bu noktadan itibaren, React uygulamanızın DOM'unu yönetmeye başlar. Kullanıcı arayüzünü güncellemek için bileşenleriniz [state](/reference/react/useState) kullanır.

---

### Birden çok kök oluşturma {/*rendering-multiple-roots*/}

Eğer sayfanız [tamamen React ile oluşturulmamışsa](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), React tarafından yönetilen her bir üst düzey kullanıcı arayüzü (UI) parçası için `render`'ı çağırınız.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Bu paragraf React tarafından render edilmiyor (doğrulamak için index.html dosyasını açın).</p>
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
      <h2>Yorumlar</h2>
      <Comment text="Merhaba!" author="Gökçe" />
      <Comment text="Nasılsın?" author="Burak" />
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

Render edilmiş ağaçları (trees) [`unmountComponentAtNode()`](/reference/react-dom/unmountComponentAtNode) ile yok edebilirsiniz.

---

### Render edilmiş ağaçları güncelleme {/*updating-the-rendered-tree*/}

Aynı DOM düğümünde `render` fonksiyonunu birden fazla kez çağırabilirsiniz. Bileşen ağacının yapısı önceden oluşturulanla eşleştiği sürece, React [durumu korur](/learn/preserving-and-resetting-state). Giriş alanına yazı yazabilmeniz, her saniyede tekrarlanan `render` çağrılarının yıkıcı(destructive) olmadığını gösterir:

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

Bu şekilde birden fazla kez `render` çağırmak nadiren gerçekleşir. Genellikle, bunun yerine bileşenlerinizin (component) içinde [state'i güncellersiniz.](/reference/react/useState)
