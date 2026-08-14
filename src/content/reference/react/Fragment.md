---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, genellikle `<>...</>` syntax’ı ile kullanılır ve element’leri bir wrapper node olmadan gruplamanızı sağlar.

<Canary>Fragment’lar ayrıca ref kabul edebilir; bu da wrapper element eklemeden underlying DOM node’larıyla etkileşim kurmayı sağlar.</Canary>

```js
<>
  <AltEleman />
  <BaskaAltEleman />
</>
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<Fragment>` {/*fragment*/}

Tek bir elemana ihtiyaç duyduğunuz durumlarda, elemanları `<Fragment>` içine alarak onları bir araya getirebilirsiniz. Fragment içinde elemanları gruplamak, sonuç DOM üzerinde herhangi bir etkiye sahip değildir; sanki elemanlar gruplanmamış gibi aynı kalır. Boş JSX etiketi `<></>` çoğu durumda `<Fragment></Fragment>` için kısaltmadır.

#### Prop'lar {/*props*/}

- **optional** `key`: Açık `<Fragment>` syntax’iyle tanımlanan Fragment’lar [key’lere](/learn/rendering-lists#keeping-list-items-in-order-with-key) sahip olabilir.
- <CanaryBadge /> **optional** `ref`: Bir ref object’i (örn. [`useRef`](/reference/react/useRef)’ten gelen) veya [callback function](/reference/react-dom/components/common#ref-callback). React, ref value olarak Fragment tarafından sarılan DOM node’larıyla etkileşim kurmak için method’lar implemente eden bir `FragmentInstance` sağlar.

#### Uyarılar {/*caveats*/}

* Bir Fragment’a `key` geçirmek istiyorsanız, `<>...</>` syntax’ini kullanamazsınız. `'react'` içinden `Fragment`’ı açıkça import etmeniz ve `<Fragment key={yourKey}>...</Fragment>` şeklinde render etmeniz gerekir.

* React, `<><Child /></>` render etmekten `[<Child />]` render etmeye geçtiğinizde veya geri döndüğünüzde ya da `<><Child /></>` render etmekten `<Child />` render etmeye geçtiğinizde ve geri döndüğünüzde [state’i resetlemez](/learn/preserving-and-resetting-state). Bu yalnızca tek bir seviye derinlikte çalışır: örneğin, `<><><Child /></></>` yapısından `<Child />` yapısına geçmek state’i resetler. Kesin semantiklere [buradan](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) bakabilirsiniz.

* <CanaryBadge /> Bir Fragment’a `ref` geçirmek istiyorsanız, `<>...</>` syntax’ini kullanamazsınız. `'react'` içinden `Fragment`’ı açıkça import etmeniz ve `<Fragment ref={yourRef}>...</Fragment>` şeklinde render etmeniz gerekir.

---

### <CanaryBadge /> `FragmentInstance` {/*fragmentinstance*/}

Bir Fragment’a `ref` geçirdiğinizde, React bir `FragmentInstance` object’i sağlar. Bu object, Fragment tarafından sarılan birinci seviye DOM child’larıyla etkileşim kurmak için method’lar implemente eder.

* [`addEventListener`](#addeventlistener) ve [`removeEventListener`](#removeeventlistener), tüm birinci seviye DOM child’ları üzerinde event listener’ları yönetir.
* [`dispatchEvent`](#dispatchevent), Fragment üzerinde bir event dispatch eder; bu event DOM parent’a bubble olabilir.
* [`focus`](#focus), [`focusLast`](#focuslast) ve [`blur`](#blur), tüm nested child’lar üzerinde depth-first şekilde focus’u yönetir.
* [`observeUsing`](#observeusing) ve [`unobserveUsing`](#unobserveusing), `IntersectionObserver` veya `ResizeObserver` instance’larını attach ve detach eder.
* [`getClientRects`](#getclientrects), tüm birinci seviye DOM child’larının bounding rectangle’larını döndürür.
* [`getRootNode`](#getrootnode), Fragment’ın parent’ının root node’unu döndürür.
* [`compareDocumentPosition`](#comparedocumentposition), Fragment’ın konumunu başka bir node ile karşılaştırır.
* [`scrollIntoView`](#scrollintoview), Fragment’ın child’larını görünüme kaydırır.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Fragment’ın tüm birinci seviye DOM child’larına bir event listener ekler.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parametreler {/*addeventlistener-parameters*/}

* `type`: Dinlenecek event type’ını temsil eden bir string (örn. `'click'`, `'focus'`).
* `listener`: Event handler function.
* **optional** `options`: [DOM `addEventListener` API’siyle](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) eşleşen, capture için kullanılan bir options object’i veya boolean.

##### Returns {/*addeventlistener-returns*/}

`addEventListener` herhangi bir şey döndürmez (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Fragment’ın tüm birinci seviye DOM child’larından bir event listener’ı kaldırır.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parametreler {/*removeeventlistener-parameters*/}

* `type`: Event type string’i.
* `listener`: Kaldırılacak event handler function.
* **optional** `options`: [DOM `removeEventListener` API’siyle](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) eşleşen bir options object’i veya boolean.

##### Returns {/*removeeventlistener-returns*/}

`removeEventListener` herhangi bir şey döndürmez (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Fragment üzerinde bir event dispatch eder. Eklenen event listener’lar çağrılır ve event Fragment’ın DOM parent’ına bubble olabilir.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parametreler {/*dispatchevent-parameters*/}

* `event`: Dispatch edilecek bir [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) object’i. Eğer `bubbles` `true` ise, event Fragment’ın parent DOM node’una bubble olur.

##### Returns {/*dispatchevent-returns*/}

Event cancel edilmediyse `true`, `preventDefault()` çağrıldıysa `false`.

---

#### `focus(options?)` {/*focus*/}

Fragment içindeki ilk focusable DOM node’una focus eder. Bir DOM element üzerinde `element.focus()` çağırmaktan farklı olarak, bu method yalnızca elementin kendisini veya direct child’larını değil, focusable bir element bulana kadar *tüm* nested child’ları depth-first şekilde arar.

```js
fragmentRef.current.focus();
```

##### Parametreler {/*focus-parameters*/}

* **optional** `options`: Bir [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object’i (örn. `{ preventScroll: true }`).

##### Returns {/*focus-returns*/}

`focus` herhangi bir şey döndürmez (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Fragment içindeki son focusable DOM node’una focus eder. Nested child’ları depth-first şekilde arar, ardından ters sırada iterate eder.

```js
fragmentRef.current.focusLast();
```

##### Parametreler {/*focuslast-parameters*/}

* **optional** `options`: Bir [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object’i.

##### Returns {/*focuslast-returns*/}

`focusLast` herhangi bir şey döndürmez (`undefined`).

---

#### `blur()` {/*blur*/}

Active element Fragment içindeyse focus’u kaldırır. Eğer `document.activeElement` Fragment içinde değilse, `blur` hiçbir şey yapmaz.

```js
fragmentRef.current.blur();
```

##### Returns {/*blur-returns*/}

`blur` herhangi bir şey döndürmez (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Sağlanan observer ile Fragment’ın tüm birinci seviye DOM child’larını observe etmeye başlar.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parametreler {/*observeusing-parameters*/}

* `observer`: Bir [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) veya [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance’ı.

##### Returns {/*observeusing-returns*/}

`observeUsing` herhangi bir şey döndürmez (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Belirtilen observer ile Fragment’ın DOM child’larını observe etmeyi durdurur.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parametreler {/*unobserveusing-parameters*/}

* `observer`: Daha önce [`observeUsing`](#observeusing)’e geçirilen aynı `IntersectionObserver` veya `ResizeObserver` instance’ı.

##### Returns {/*unobserveusing-returns*/}

`unobserveUsing` herhangi bir şey döndürmez (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Tüm birinci seviye DOM child’larının bounding rectangle’larını temsil eden [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) object’lerinden oluşan flat bir array döndürür.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Returns {/*getclientrects-returns*/}

Tüm child’ların bounding rectangle’larını içeren bir `Array<DOMRect>`.

---

#### `getRootNode(options?)` {/*getrootnode*/}

[`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode) davranışıyla eşleşecek şekilde, Fragment’ın parent DOM node’unu içeren root node’u döndürür.

```js
const root = fragmentRef.current.getRootNode();
```

##### Parametreler {/*getrootnode-parameters*/}

* **optional** `options`: [DOM `getRootNode` API’siyle](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options) eşleşen, `composed` boolean property’sine sahip bir object.

##### Returns {/*getrootnode-returns*/}

Bir `Document`, `ShadowRoot` veya parent DOM node yoksa `FragmentInstance`’ın kendisi.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Compares the document position of the Fragment with another node, returning a bitmask matching the behavior of [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parameters {/*comparedocumentposition-parameters*/}

* `otherNode`: The DOM node to compare against.

##### Returns {/*comparedocumentposition-returns*/}

A bitmask of [position flags](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value). Empty Fragments and Fragments with children rendered through a [portal](/reference/react-dom/createPortal) include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` in the result.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Fragment’ın child’larını görünüme kaydırır. `alignToTop` `true` olduğunda veya atlandığında, ilk child’ı scrollable ancestor’ın üst kısmıyla hizalayacak şekilde kaydırır. `alignToTop` `false` olduğunda, son child’ı alt kısımla hizalayacak şekilde kaydırır.

```js
fragmentRef.current.scrollIntoView();
```

##### Parametreler {/*scrollintoview-parameters*/}

* **optional** `alignToTop`: Bir boolean. `true` ise (default), ilk child’ı scrollable area’nın üst kısmına kaydırır. `false` ise, son child’ı alt kısma kaydırır. [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)’dan farklı olarak, bu method bir `ScrollIntoViewOptions` object’i kabul etmez.

##### Döndürür {/*scrollintoview-returns*/}

`scrollIntoView` herhangi bir şey döndürmez (`undefined`).

##### Uyarılar {/*scrollintoview-caveats*/}

* `scrollIntoView` bir options object’i kabul etmez. Bir object geçirmek hata fırlatır. Bunun yerine `alignToTop` boolean’ını kullanın.
* Fragment’ın child’ı yoksa, `scrollIntoView` fallback olarak en yakın sibling’i veya parent’ı görünüme kaydırır.

---

#### `FragmentInstance` Uyarıları {/*fragmentinstance-caveats*/}

* Child’ları hedefleyen method’lar (`addEventListener`, `observeUsing` ve `getClientRects` gibi), Fragment’ın *birinci seviye host (DOM) child’ları* üzerinde çalışır. Başka bir DOM element içinde nested olan child’ları doğrudan hedeflemezler.
* `focus` ve `focusLast`, focusable element’leri bulmak için nested child’ları depth-first şekilde arar; event ve observer method’ları ise yalnızca birinci seviye host child’ları hedefler.
* `observeUsing` text node’lar üzerinde çalışmaz. Fragment yalnızca text child’ları içeriyorsa React development ortamında bir warning loglar.
* React, `addEventListener` ile eklenen event listener’ları gizli [`<Activity>`](/reference/react/Activity) tree’lerine uygulamaz. Bir `Activity` boundary hidden’dan visible’a geçtiğinde, listener’lar otomatik olarak uygulanır.
* `ref`’e sahip bir Fragment’ın her birinci seviye DOM child’ı bir `reactFragments` property’si alır: element’i sahiplenen tüm Fragment instance’larını içeren bir `Set<FragmentInstance>`. Bu, birden fazla Fragment arasında [shared observer cache’lemeyi](#caching-global-intersection-observer) mümkün kılar.

---

## Kullanım {/*usage*/}

### Birden Fazla Eleman Döndürme {/*returning-multiple-elements*/}

`Fragment` veya, `<>...</>` sözdizimini kullanmak birden fazla elemanı bir araya getirir. Tek bir elemanın gidebileceği herhangi bir yere birden fazla eleman koymak için kullanabilirsiniz. Örneğin, bir bileşen sadece bir eleman döndürebilir, ancak Fragment kullanarak birden fazla elemanı bir araya getirebilir ve onları bir grup olarak döndürebilirsiniz:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragmanlar kullanışlıdır çünkü bir Fragment ile elemanları gruplamak, elemanları bir DOM elemanı gibi başka bir konteynerde sarmak gibi düzeni veya stilleri etkilemez. Tarayıcı araçlarıyla bu örneği incelediğinizde, tüm `<h1>` ve `<p>` DOM düğümlerinin etrafında sarmalayıcı olmadan kardeşler olarak görünecektir.

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Özel sözdizimi olmadan bir Fragment nasıl yazılır? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Yukarıdaki örnek, React'ten `Fragment` içe aktarmaya eşdeğerdir:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Genellikle bunun gibi bir şeye ihtiyaç duymazsınız, ancak [`Fragment`'a `key` eklemek] istediğinizde kullanabilirsiniz.(#rendering-a-list-of-fragments)

</DeepDive>

---

### Bir değişkene birden fazla eleman atama {/*assigning-multiple-elements-to-a-variable*/}

Diğer tüm elemanlar gibi, Fragment elemanlarını değişkenlere atayabilir, bunları props olarak iletebilir ve benzeri işlemler yapabilirsiniz:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Metinle elemanları gruplama {/*grouping-elements-with-text*/}

`Fragment` ile, metni bileşenlerle bir araya getirmek için kullanabilirsiniz:


```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Fragment'lar listesini oluşturma: {/*rendering-a-list-of-fragments*/}

İşte `<></>` sözdizimini yerine `Fragment` yazmanız gereken bir durum.  Bir [döngüde birden fazla elemanı oluşturduğunuzda](/learn/rendering-lists), her elemana bir `key` atamanız gerekmektedir. Eğer döngü içindeki elemanlar `Fragment` ise, `key` özelliğini sağlamak için normal JSX eleman sözdizimini kullanmanız gerekir:


```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

DOM'u, Fragment alt elemanlarının etrafında sarmalayıcı öğe olmadığını doğrulamak için inceleyebilirsiniz:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <CanaryBadge /> Wrapper element olmadan event listener ekleme {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`leri, wrapper DOM node’u eklemeden bir grup elemente event listener eklemenizi sağlar. Listener’ları attach etmek ve cleanup yapmak için bir [ref callback](/reference/react-dom/components/common#ref-callback) kullanın:

<Sandpack>

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`addEventListener` çağrısı, listener’ı Fragment’ın her birinci seviye DOM child’ına uygular. Child’lar dinamik olarak eklendiğinde veya kaldırıldığında, `FragmentInstance` listener’ı otomatik olarak ekler veya kaldırır.

<DeepDive>

#### Bir Fragment ref’i hangi child’ları hedefler? {/*which-children-does-a-fragment-ref-target*/}

Bir `FragmentInstance`, Fragment’ın **birinci seviye host (DOM) child’larını** hedefler. Şu tree’yi düşünün:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` bir React component’i olduğu için, `FragmentInstance` DOM node’larını bulmak üzere onun içinden geçerek bakar. Hedeflenen child’lar `A`, `B` ve `D`’dir. `C` hedeflenmez çünkü DOM elementi `B` içinde nested durumdadır.

`addEventListener`, `observeUsing` ve `getClientRects` gibi method’lar bu birinci seviye DOM child’ları üzerinde çalışır. `focus` ve `focusLast` farklıdır; focusable element’leri bulmak için *tüm* nested child’ları depth-first şekilde ararlar.

</DeepDive>

---

### <CanaryBadge /> Bir grup element üzerinde focus yönetme {/*managing-focus-across-elements*/}

Fragment `ref`leri, Fragment içindeki tüm DOM node’ları üzerinde çalışan `focus`, `focusLast` ve `blur` method’larını sağlar:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`focus()` çağırmak `street` input’una focus eder; bu input bir `<fieldset>` ve `<label>` içinde nested olsa bile. `focus()`, yalnızca Fragment’ın direct child’larını değil, tüm nested child’ları depth-first şekilde arar. `focusLast()` aynı işlemi ters yönde yapar ve `blur()`, currently focused element Fragment içindeyse focus’u kaldırır.

---

### <CanaryBadge /> Bir grup elementi görünüme kaydırma {/*scrolling-group-into-view*/}

Wrapper element olmadan bir Fragment’ın child’larını görünüme kaydırmak için `scrollIntoView` kullanın. İlk child’ı en üste kaydırmak için `true` geçirin (veya argümanı atlayın). Son child’ı en alta kaydırmak için `false` geçirin:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Wrapper element olmadan visibility observe etme {/*observing-visibility-without-wrapper*/}

Bir Fragment’ın tüm birinci seviye DOM child’larına `IntersectionObserver` attach etmek için `observeUsing` kullanın. Bu, child component’lerin `ref` expose etmesini veya wrapper element eklemeyi gerektirmeden visibility’yi track etmenizi sağlar:

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Global IntersectionObserver cache’leme {/*caching-global-intersection-observer*/}

Çok sayıda observer’a sahip siteler için yaygın bir performance optimization, config başına tek bir IntersectionObserver paylaşmak ve entry’lerini hangi element’in intersect ettiğine göre doğru callback’lere yönlendirmektir. Fragment `ref`leri, `reactFragments` property’si üzerinden aynı pattern’i destekler.

`ref`’e sahip bir Fragment’ın her birinci seviye DOM child’ında bir `reactFragments` property’si bulunur: bu element’i içeren `FragmentInstance` object’lerinden oluşan bir `Set`. Shared observer tetiklendiğinde, intersect eden element’in hangi `FragmentInstance`’a ait olduğunu bulmak ve doğru callback’leri çalıştırmak için bu property’yi kullanabilirsiniz.

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Aynı options’a sahip birden fazla `ObservedGroup` component’i tek bir `IntersectionObserver`’ı yeniden kullanır. Herhangi bir section görünüme kaydırıldığında, shared observer tetiklenir ve entry’yi doğru callback’e yönlendirmek için `reactFragments`’ı kullanır.
