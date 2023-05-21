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
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... metotlarınız ...
    };
  }, []);
  // ...
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `ref`: [`forwardRef`](/reference/react/forwardRef#render-function) render fonksiyonunun ikinci argümanı olarak aldığınız `ref`.

* `createHandle`: Herhangi bir argüman almayan ve açığa çıkarmak istediğiniz ref tanımlayıcısını döndüren bir fonksiyondur. Bu ref tanımlayıcısı herhangi bir tipte olabilir. Genellikle, açığa çıkarmak istediğiniz metotların bulunduğu bir nesne döndürürsünüz.

* **isteğe bağlı** `dependencies`: `createHandle` kodu içinde referans alınan tüm tepkisel değerlerin listesidir. Tepkisel değerler, prop'lar, state ve bileşeninizin doğrudan içerisinde bildirilen tüm değişkenler ve fonskiyonlar gibi değerleri içerir. Eğer linter'ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), her tepkisel değerin doğru bir şekilde bağımlılık(dependency) olarak belirtildiğini doğrular. Bağımlılık listesi, sabit bir sayıda öğeye sahip olmalı ve `[dep1, dep2, dep3]` gibi iç içe yazılmalıdır. React, her bir bağımlılığı önceki değeriyle [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması kullanarak karşılaştırır. Eğer bir yeniden render'lama, bazı bağımlılıklarda değişikliğe neden olduysa veya bu argümanı atladıysanız, `createHandle` fonksiyonunuz yeniden çalıştırılır ve yeni oluşturulan tanımlayıcı ref'e atanır.

#### Dönüş değerleri {/*returns*/}

`useImperativeHandle`, `undefined` döndürür.

---

## Kullanım {/*usage*/}

### Özel bir ref tanımlayıcısını üst elemana açığa çıkarma {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Bileşenler DOM düğümlerini varsayılan olarak üst elemana açığa çıkarmazlar. Örneğin, `MyInput` bileşeninin üst elemanın `<input>` DOM düğümüne [erişmesini](/learn/manipulating-the-dom-with-refs) istiyorsanız, [`forwardRef`](/reference/react/forwardRef) ile tercih etmelisiniz.

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

Yukarıdaki kodla [bir `MyInput` bileşenine ait ref, `<input>` DOM düğümünü alacaktır.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) Ancak, isteğe bağlı olarak özel bir değer de açığa çıkarabilirsiniz. Açığa çıkarılan tanımlayıcıyı özelleştirmek için bileşeninizin üst düzeyinde `useImperativeHandle`'ı çağırın.

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... metotlarınız ...
    };
  }, []);

  return <input {...props} />;
});
```

Yukarıdaki koda dikkat ettiğinizde, `ref` artık `<input>` bileşenine iletilmediğini fark edeceksiniz.

Örneğin, `<input>` DOM düğümünün tamamını açığa çıkarmak istemiyorsunuz, ancak `focus` ve `scrollIntoView` gibi iki metodu açığa çıkarmak istiyorsunuz. Bunun için gerçek tarayıcı DOM'unu ayrı bir ref içinde tutun. Ardından, yalnızca üst elemanın çağırmasını istediğiniz metotlara sahip bir tanımlayıcıyı açığa çıkarmak için `useImperativeHandle`'ı kullanın:

```js {7-14}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
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
});
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
      <MyInput label="Adınızı girin:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Düzenle
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
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
});

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

```js Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
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
});

export default Post;
```


```js CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
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
});

export default CommentList;
```

```js AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Yorum ekle..." ref={ref} />;
});

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
