---
title: <Fragment> (<>...</>)
---

<Intro>

<Fragment>, genellikle <>...</> sözdizimiyle birlikte kullanılır ve bir kaplayıcı düğüm olmadan elemanları gruplamaya olanak tanır.

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

Tek bir elemana ihtiyaç duyduğunuz durumlarda, elemanları <Fragment> içine alarak onları bir araya getirebilirsiniz. Fragment içinde elemanları gruplamak, sonuç DOM üzerinde herhangi bir etkiye sahip değildir; sanki elemanlar gruplanmamış gibi aynı kalır. Boş JSX etiketi <></> çoğu durumda <Fragment></Fragment> için kısaltmadır.

#### Prop'lar {/*props*/}

isteğe bağlı `anahtar`: Açık <Fragment> sözdizimiyle tanımlanan Fragment'ler syntax may have [anahtara](/learn/rendering-lists#keeping-list-items-in-order-with-key) sahip olabilir.

#### Uyarılar {/*caveats*/}

- Eğer bir Fragment'a key değeri geçirmek istiyorsanız, <>...</> sözdizimini kullanamazsınız. 'React'ten Fragment'ı içe aktarmanız ve <Fragment key={anahtar}>...</Fragment> şeklinde render etmeniz gerekmektedir.

- React, <><AltEleman /></>'dan [<AltEleman />]'a veya geriye dönerken, ya da <><AltEleman /></>'dan <AltEleman />'a ve geriye dönerken [state sıfırlamaz](/learn/preserving-and-resetting-state). Bu durum yalnızca tek seviye derinlikte çalışır: örneğin, <><><AltEleman /></></>'dan <AltEleman />'a geçmek durumu sıfırlar. Kesin anlamları [burada](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) görebilirsiniz.



---

## Kullanım {/*usage*/}

### Birden Fazla Eleman Döndürme {/*returning-multiple-elements*/}

Use `Fragment`, or the equivalent `<>...</>` syntax, to group multiple elements together. You can use it to put multiple elements in any place where a single element can go. For example, a component can only return one element, but by using a Fragment you can group multiple elements together and then return them as a group:

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

Fragments are useful because grouping elements with a Fragment has no effect on layout or styles, unlike if you wrapped the elements in another container like a DOM element. If you inspect this example with the browser tools, you'll see that all `<h1>` and `<p>` DOM nodes appear as siblings without wrappers around them:

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

#### How to write a Fragment without the special syntax? {/*how-to-write-a-fragment-without-the-special-syntax*/}

The example above is equivalent to importing `Fragment` from React:

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

Usually you won't need this unless you need to [pass a `key` to your `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Assigning multiple elements to a variable {/*assigning-multiple-elements-to-a-variable*/}

Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:

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

### Grouping elements with text {/*grouping-elements-with-text*/}

You can use `Fragment` to group text together with components:

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

### Rendering a list of Fragments {/*rendering-a-list-of-fragments*/}

Here's a situation where you need to write `Fragment` explicitly instead of using the `<></>` syntax. When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:

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

You can inspect the DOM to verify that there are no wrapper elements around the Fragment children:

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
