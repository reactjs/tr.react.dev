---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, genellikle `<>...</>` sözdizimiyle birlikte kullanılır ve bir kaplayıcı düğüm olmadan elemanları gruplamaya olanak tanır.

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

Tek bir elemana ihtiyaç duyduğunuz durumlarda, elemanları `<Fragment>` içine alarak onları bir araya getirebilirsiniz. Fragment içinde elemanları gruplamak, sonuç DOM üzerinde herhangi bir etkiye sahip değildir; sanki elemanlar gruplanmamış gibi aynı kalır. Boş JSX etiketi <></> çoğu durumda `<Fragment>` için kısaltmadır.

#### Prop'lar {/*props*/}

isteğe bağlı `anahtar`: Açık `<Fragment>` sözdizimiyle tanımlanan Fragment'ler  [anahtara](/learn/rendering-lists#keeping-list-items-in-order-with-key) sahip olabilir.

#### Uyarılar {/*caveats*/}

- Eğer bir Fragment'a key değeri geçirmek istiyorsanız, <>...</> sözdizimini kullanamazsınız. 'React'ten Fragment'ı içe aktarmanız ve `<Fragment key={anahtar}>...</Fragment>` şeklinde render etmeniz gerekmektedir.

- React, `<><AltEleman /></>`'dan `[<AltEleman />]`'a veya geriye dönerken, ya da `<><AltEleman /></>`'dan `<AltEleman />`'a ve geriye dönerken [state sıfırlamaz](/learn/preserving-and-resetting-state). Bu durum yalnızca tek seviye derinlikte çalışır: örneğin, `<><><AltEleman /></></>`'dan `<AltEleman />`'a geçmek durumu sıfırlar. Kesin anlamları [burada](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) görebilirsiniz.

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

DOM'u inceleyerek Fragment alteleman etrafında herhangi bir sarmalayıcı öğe olmadığını doğrulayabilirsiniz:

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