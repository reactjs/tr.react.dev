---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle`, bir [ref](/learn/manipulating-the-dom-with-refs) olarak açığa çıkarılan tanımlayıcıyı özelleştirmenizi sağlayan bir React Hook'udur.

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Açığa çıkarılan ref tanımlayıcısını özelleştirmek için bileşeninizin üst düzeyinde `useImperativeHandle`'ı çağırın:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... metotlarınız ...
    };
  }, []);
  // ...
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `ref`: `MyInput` bileşenine prop olarak aldığınız `ref`.

* `createHandle`: Herhangi bir argüman almayan ve açığa çıkarmak istediğiniz ref tanımlayıcısını döndüren bir fonksiyondur. Bu ref tanımlayıcısı herhangi bir tipte olabilir. Genellikle, açığa çıkarmak istediğiniz metotların bulunduğu bir nesne döndürürsünüz.

* **isteğe bağlı** `dependencies`: `createHandle` kodu içinde referans alınan tüm tepkisel değerlerin listesidir. Tepkisel değerler, prop'lar, state ve bileşeninizin doğrudan içerisinde bildirilen tüm değişkenler ve fonskiyonlar gibi değerleri içerir. Eğer linter'ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), her tepkisel değerin doğru bir şekilde bağımlılık(dependency) olarak belirtildiğini doğrular. Bağımlılık listesi, sabit bir sayıda öğeye sahip olmalı ve `[dep1, dep2, dep3]` gibi iç içe yazılmalıdır. React, her bir bağımlılığı önceki değeriyle [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması kullanarak karşılaştırır. Eğer bir yeniden render'lama, bazı bağımlılıklarda değişikliğe neden olduysa veya bu argümanı atladıysanız, `createHandle` fonksiyonunuz yeniden çalıştırılır ve yeni oluşturulan tanımlayıcı ref'e atanır.

<Note>

<<<<<<< HEAD
React 19 ile birlikte, [`ref` bir prop olarak mevcuttur.](/blog/2024/12/05/react-19#ref-as-a-prop) React 18 ve öncesinde, `ref`'i [`forwardRef`'den](/reference/react/forwardRef) almak gerekiyordu.
=======
Starting with React 19, [`ref` is available as a prop.](/blog/2024/12/05/react-19#ref-as-a-prop) In React 18 and earlier, it was necessary to get the `ref` from [`forwardRef`.](/reference/react/forwardRef) 
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

</Note>

#### Returns {/*returns*/}

`useImperativeHandle`, `undefined` döndürür.

---

## Kullanım {/*usage*/}

### Özel bir ref tanımlayıcısını üst elemana açığa çıkarma {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Bir DOM düğümünü ebeveyn elemana açığa çıkarmak için, `ref` prop'unu düğüme iletin.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

Yukarıdaki kodla, [`MyInput`'e ait bir ref, `<input>` DOM düğümünü alacaktır.](/learn/manipulating-the-dom-with-refs) Ancak bunun yerine özel bir değer de açığa çıkarabilirsiniz. Açığa çıkan handle'ı özelleştirmek için, bileşeninizin üst seviyesinde `useImperativeHandle` çağırın:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... metotlarınız ...
    };
  }, []);

  return <input />;
};
```

Yukarıdaki kodda, `ref`'in artık `<input>`'a iletilmediğine dikkat edin.

Örneğin, `<input>` DOM düğümünün tamamını açığa çıkarmak istemiyorsunuz, ancak `focus` ve `scrollIntoView` gibi iki metodu açığa çıkarmak istiyorsunuz. Bunun için gerçek tarayıcı DOM'unu ayrı bir ref içinde tutun. Ardından, yalnızca üst elemanın çağırmasını istediğiniz metotlara sahip bir tanımlayıcıyı açığa çıkarmak için `useImperativeHandle`'ı kullanın:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

Artık, eğer üst eleman `MyInput` için bir ref alırsa, onun üzerinde `focus` ve `scrollIntoView` metotlarını çağırabilecektir. Ancak, altında bulunan `<input>` DOM düğümüne tam erişimi olmayacaktır.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // DOM düğümü açığa çıkarılmadığı için bu çalışmayacaktır:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Adınızı girin" ref={ref} />
      <button type="button" onClick={handleClick}>
        Düzenle
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Zorunlu fonksiyonlarızı açığa çıkarma {/*exposing-your-own-imperative-methods*/}

İstemci tarafından kullanılabilir hâle getirdiğiniz metotlar, DOM metotlarıyla tam olarak eşleşmek zorunda değildir. Örneğin, bu `Post` bileşeni, bir istemci tarafından kullanılabilir hâle getirilen `scrollAndFocusAddComment` metodunu açığa çıkarır. Bu, üst eleman olan `Page`'in, butona tıklandığında yorum listesine kaydırmasına *ve* giriş alanına odaklanmasına olanak tanır:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Bir yorum yazın
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Bloğuma hoşgeldiniz!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Ref'leri aşırı kullanmayın.** Ref'leri sadece, prop olarak ifade edemeyeceğiniz *zorunlu* davranışlar için kullanmalısınız: örneğin, bir düğüme kaydırmak, bir düğüme odaklanmak, bir animasyonu tetiklemek, metin seçmek vb.

**Bir şeyi bir prop olarak ifade edebiliyorsanız, bir ref kullanmamalısınız.** Örneğin, bir `Modal` bileşeninden `{ open, close }` gibi bir ref açığa çıkarmak yerine, `<Modal isOpen={isOpen} />` gibi bir `isOpen` prop'unu almak daha iyidir. [Effect'ler](/learn/synchronizing-with-effects), ref'leri prop'lar aracılığıyla açığa çıkarmada size yardımcı olabilir.

</Pitfall>
