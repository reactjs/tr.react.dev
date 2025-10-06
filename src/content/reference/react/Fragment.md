---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>`, genellikle `<>...</>` sözdizimiyle birlikte kullanılır ve bir kaplayıcı düğüm olmadan elemanları gruplamaya olanak tanır.
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Experimental> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Experimental>
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

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

<<<<<<< HEAD
**isteğe bağlı** `anahtar`: Açık `<Fragment>` sözdizimiyle tanımlanan Fragment'ler  [anahtara](/learn/rendering-lists#keeping-list-items-in-order-with-key) sahip olabilir.
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <ExperimentalBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <ExperimentalBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

#### Uyarılar {/*caveats*/}

- Eğer bir Fragment'a key değeri geçirmek istiyorsanız, <>...</> sözdizimini kullanamazsınız. 'React'ten Fragment'ı içe aktarmanız ve `<Fragment key={anahtar}>...</Fragment>` şeklinde render etmeniz gerekmektedir.

- React, `<><AltEleman /></>`'dan `[<AltEleman />]`'a veya geriye dönerken, ya da `<><AltEleman /></>`'dan `<AltEleman />`'a ve geriye dönerken [state sıfırlamaz](/learn/preserving-and-resetting-state). Bu durum yalnızca tek seviye derinlikte çalışır: örneğin, `<><><AltEleman /></></>`'dan `<AltEleman />`'a geçmek durumu sıfırlar. Kesin anlamları [burada](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) görebilirsiniz.

- <ExperimentalBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

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

<<<<<<< HEAD
</Sandpack>
=======
</Sandpack>

---

### <ExperimentalBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <ExperimentalBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <ExperimentalBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  const fragmentRef = useRef(null);

  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027
