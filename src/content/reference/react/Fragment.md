---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, genellikle `<>...</>` sözdizimiyle kullanılır, öğeleri sarmalayıcı bir düğüm olmadan gruplamanı sağlar.  

<Canary> Fragment'ler ayrıca ref'leri de kabul edebilir, bu da sarmalayıcı öğe eklemeden alt DOM düğümleriyle etkileşimde bulunmanı sağlar. Aşağıda referans ve kullanım örneklerini görebilirsin. <Canary>

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

- **optional** `key`: Açık `<Fragment>` sözdizimi ile tanımlanan Fragment'ler [key] alabilir. (/learn/rendering-lists#keeping-list-items-in-order-with-key)  
- <CanaryBadge /> **optional** `ref`: Bir ref objesi (örneğin [`useRef`](/reference/react/useRef) ile oluşturulmuş) veya [callback function](/reference/react-dom/components/common#ref-callback). React, Fragment tarafından sarılan DOM düğümleriyle etkileşim kurmak için yöntemler içeren bir `FragmentInstance`'ı ref değeri olarak sağlar.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

Fragment'e bir ref verdiğinde, React Fragment tarafından sarılan DOM düğümleriyle etkileşim için yöntemler içeren bir `FragmentInstance` nesnesi sağlar:

**Olay yönetimi yöntemleri:**
- `addEventListener(type, listener, options?)`: Fragment'in tüm birinci seviyedeki DOM çocuklarına bir olay dinleyici ekler.  
- `removeEventListener(type, listener, options?)`: Fragment'in tüm birinci seviyedeki DOM çocuklarından bir olay dinleyici kaldırır.  
- `dispatchEvent(event)`: Fragment'in sanal bir çocuğuna bir olay gönderir; eklenen dinleyicileri çağırır ve DOM üstüne kabarcık yapabilir.

**Düzen (layout) yöntemleri:**
- `compareDocumentPosition(otherNode)`: Fragment'in belge konumunu başka bir düğümle karşılaştırır.  
  - Fragment çocuklara sahipse, native `compareDocumentPosition` değeri döndürülür.  
  - Boş Fragment'ler, React ağacı içindeki konumu karşılaştırmayı dener ve `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` içerir.  
  - React ağacı ile DOM ağacı arasında portaling veya diğer eklemeler nedeniyle farklı ilişkiye sahip öğeler `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` olur.  
- `getClientRects()`: Tüm çocukların sınır dikdörtgenlerini temsil eden düz bir `DOMRect` dizisi döndürür.  
- `getRootNode()`: Fragment'in üst DOM düğümünü içeren kök düğümü döndürür.

**Odak (focus) yönetimi yöntemleri:**
- `focus(options?)`: Fragment'teki ilk odaklanabilir DOM düğümünü odaklar. Odak derinlemesine, çocuklar üzerinde denenir.  
- `focusLast(options?)`: Fragment'teki son odaklanabilir DOM düğümünü odaklar. Odak derinlemesine, çocuklar üzerinde denenir.  
- `blur()`: Eğer `document.activeElement` Fragment içindeyse odak kaldırılır.

**Gözlemleme (observer) yöntemleri:**
- `observeUsing(observer)`: Fragment'in DOM çocuklarını bir `IntersectionObserver` veya `ResizeObserver` ile gözlemlemeye başlar.  
- `unobserveUsing(observer)`: Belirtilen observer ile Fragment'in DOM çocuklarını gözlemlemeyi durdurur.

#### Uyarılar {/*caveats*/}

- Eğer bir Fragment'a key değeri geçirmek istiyorsanız, <>...</> sözdizimini kullanamazsınız. 'React'ten Fragment'ı içe aktarmanız ve `<Fragment key={anahtar}>...</Fragment>` şeklinde render etmeniz gerekmektedir.

- React, `<><AltEleman /></>`'dan `[<AltEleman />]`'a veya geriye dönerken, ya da `<><AltEleman /></>`'dan `<AltEleman />`'a ve geriye dönerken [state sıfırlamaz](/learn/preserving-and-resetting-state). Bu durum yalnızca tek seviye derinlikte çalışır: örneğin, `<><><AltEleman /></></>`'dan `<AltEleman />`'a geçmek durumu sıfırlar. Kesin anlamları [burada](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) görebilirsiniz.

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

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

### <CanaryBadge /> Fragment ref'lerini DOM etkileşimi için kullanma {/*using-fragment-refs-for-dom-interaction*/}

Fragment ref'leri, ekstra sarmalayıcı öğe eklemeden Fragment tarafından sarılan DOM düğümleriyle etkileşimde bulunmanı sağlar. Bu, olay yönetimi, görünürlük takibi, odak yönetimi ve `ReactDOM.findDOMNode()` gibi kullanım dışı kalmış desenlerin yerine geçmek için faydalıdır.

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

### <CanaryBadge /> Fragment ref'leri ile görünürlüğü izleme {/*tracking-visibility-with-fragment-refs*/}

Fragment ref'leri, görünürlük takibi ve intersection gözlemi için faydalıdır. Bu sayede, alt Component'ların ref açığa çıkarmasına gerek kalmadan içeriğin ne zaman görünür hale geldiğini izleyebilirsin:

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

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

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
