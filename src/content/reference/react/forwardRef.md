---
title: forwardRef
---

<Intro>

`forwardRef`, bileşeninizin bir DOM elemanını, üst bileşene [ref](/learn/manipulating-the-dom-with-refs) (referans) ile iletmenize olanak sağlar.

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Bileşeninizin bir ref alması ve bunu alt bileşene iletmesi için `forwardRef()`'i çağırın:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `render`: Bileşeniniz için render fonksiyonu. React, bu fonksiyonu üst bileşenden aldığı props ve `ref` ile çağırır. Döndürdüğünüz JSX, bileşeninizin çıktısı olacaktır.

#### Döndürülen değer {/*returns*/}

* `forwardRef`, JSX'te render edebileceğiniz bir React bileşeni döndürür. Düz fonksiyonlar olarak tanımlanan React bileşenlerinin aksine, `forwardRef` ile döndürülen bileşen de `ref` prop'u da bulunur.

#### Uyarılar {/*caveats*/}

* Katı Mod (Strict Mode) ile, React render fonksiyonunuzu **iki kez çağırarak** [istemeden yapılan hataları bulmanızı kolaylaştırır](/reference/react/useState#my-initializer-or-updater-function-runs-twice). Bu, yalnızca geliştirme ortamı davranışıdır ve canlı ortamı etkilemez. Eğer render fonksiyonunuz saf (olması gerektiği gibi) ise, bu bileşenin işleyişine zarar vermemelidir. Çağrılardan birinin sonucu göz ardı edilecektir.

---

### `render` fonksiyonu {/*render-function*/}

`forwardRef`, render fonksiyonunu argüman olarak kabul eder. React, bu fonksiyonu `props` ve `ref` ile çağırır:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parametreler {/*render-parameters*/}

* `props`: Üst bileşen tarafından iletilen proplar.

* `ref`:  Üst bileşenden iletilen `ref` özelliği nesne veya fonksiyon olabilir. Eğer üst bileşen bir `ref` iletmemişse, bu değer `null` olur. Aldığınız `ref`'i başka bir bileşene ya da [`useImperativeHandle`](/reference/react/useImperativeHandle) fonksiyonuna aktarmanız gerekir.

#### Döndürülen değer {/*render-returns*/}

* `forwardRef`, JSX'te render edebileceğiniz bir React bileşeni döndürür. Düz fonksiyonlar olarak tanımlanan React bileşenlerinin aksine, `forwardRef` tarafından döndürülen bileşen `ref` prop'u alabilir.

---

## Kullanım {/*usage*/}

### Üst bileşene DOM erişimi sağlama {/*exposing-a-dom-node-to-the-parent-component*/}

Her bileşenin DOM elemanları varsayılan olarak özeldir. Ancak, bazen bir DOM elemanını üst bileşene erişilebilir kılmak yararlı olabilir; örneğin, odaklanma (focus) sağlamak amacıyla. Bunu yapmak için, bileşen tanımınızı `forwardRef()` ile sarmalayarak kullanın:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Props'tan sonra ikinci argüman olarak bir <CodeStep step={1}>ref</CodeStep> alacaksınız. Üst bileşenin erişim sağlamasını istediğiniz DOM elemanına bu ref'i aktarın:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Üst `Form` bileşeninin, `MyInput` tarafından sağlanan <CodeStep step={2}>`<input>` DOM elemanına</CodeStep> erişimine izin verir:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Bu `Form` bileşeni, `MyInput`'a [bir ref gönderir](/reference/react/useRef#manipulating-the-dom-with-a-ref). `MyInput` bileşeni, bu ref'i tarayıcıdaki `<input>` etiketine *iletir*. Sonuç olarak, `Form` bileşeni, `<input>` DOM elemanına erişebilir ve üzerinde [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) işlemini çağırabilir.

Unutmayın ki, bileşeninizin içindeki DOM elemanına bir ref sağlamak, daha sonra bileşeninizin iç yapısını değiştirmeyi zorlaştırır. Genellikle, butonlar (`<button>`) veya metin girişleri (`<input>`) gibi yeniden kullanılabilir temel bileşenlerden DOM elemanları sağlarsınız, ancak bunu avatar veya yorum gibi uygulama seviyesi bileşenler için yapmamalısınız.

<Recipes titleText="Examples of forwarding a ref">

#### `<input>` elamanına odaklanma (focus) {/*focusing-a-text-input*/}

Bu kod parçasında, `<button>` elemanına tıklanınca `<input>`'a odaklanılıyor. `Form` bileşeni, bir ref tanımlayarak `MyInput` bileşenine iletiyor. `MyInput` bileşeni, tanımlanan ref’i tarayıcının `<input>` etiketine aktarıyor. Böylece `Form` bileşeni, `<input>` üzerinde odaklanabilir hale geliyor.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Video oynatma ve duraklatma {/*playing-and-pausing-a-video*/}

Bu kod parçasında, bir `<button>` elemanına tıklanınca `<video>` DOM elemanında [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ve [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) fonksiyonları çağrılıyor. `App` bileşeni, bir ref tanımlayarak `MyVideoPlayer` bileşenine iletiyor. `MyVideoPlayer` bileşeni, ref’i tarayıcıdaki `<video>` elemanına aktarıyor. Bu sayede, `App` bileşeni `<video>` oynatma ve duraklatma işlemlerini gerçekleştirebiliyor.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Birden fazla bileşen aracılığıyla ref iletmek {/*forwarding-a-ref-through-multiple-components*/}

Bir DOM elemanına `ref` aktarmak yerine, `MyInput` gibi kendi bileşeninize aktarabilirsiniz:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Eğer `MyInput` bileşeni, `<input>` elemanına ref'i aktarırsa, `FormField` bileşeninden gönderilen ref, o `<input>` elemanına erişmenizi sağlar.


```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Aşağıdaki kod parçasında, `Form` bileşeni bir ref tanımlar ve `FormField`'e iletir. `FormField` bileşeni, ref'i `MyInput`'a ileterek tarayıcıdaki `<input>` DOM elemanına erişim sağlar. Bu sayede `Form` bileşeni, istenilen DOM elemanına erişebilir.

<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---
### DOM elemanı yerine, kontrolör (imperative handle) kullanma.  {/*dom-elemanı-yerine-kontrolör-imperative-handle-kullanma*/}
{/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Tüm DOM elemanlarını erişime açmak yerine, daha kısıtlı yöntem setine sahip özel bir nesne olan *kontrolör* (imperative handle)  kullanabilirsiniz. Bu işlem için, DOM elemanını belirtmek amaçlı ayrı bir ref tanımlamanız gereklidir:


```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Aldığınız `ref`'i [`useImperativeHandle`](/reference/react/useImperativeHandle) fonksiyonuna iletin ve erişilmesini istediğiniz değeri verin:

```js {6-15}
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

Bir bileşen `MyInput` üzerinden ref'e erişmek istediğinde, DOM elemanı yerine `{focus, scrollIntoView}` nesnesini elde eder. Bu sayede, DOM elemanı hakkında paylaşılan bilgi minimum düzeyde tutulabilir.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Bu çalışmayacak çünkü DOM elemanı erişilebilir değil:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
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

[Kontrolör (imperative handle) hakkında daha fazla bilgi edinin.](/reference/react/useImperativeHandle)

<Pitfall>

**Ref'leri aşırı kullanmaktan kaçınmalısınız.** Yalnızca prop'lar ile ifade edilemeyen zorunlu davranışlar için kullanmalısınız. Örneğin, bir DOM elemanında kaydırma, odaklama, animasyon tetikleme veya metin seçme gibi işlemler için.

**Bir şeyi bir prop olarak ifade edebiliyorsanız, ref kullanmamalısınız.** Örneğin, bir `Modal` bileşeninde `{ open, close }` gibi kontrolör (imperative handle) oluşturmak yerine, `isOpen` prop'unu `<Modal isOpen={isOpen} />` şeklinde kullanmak daha iyidir. [Efektler](/learn/synchronizing-with-effects), kontrollü davranışları prop'lar aracılığıyla sağlamanıza yardımcı olabilir.

</Pitfall>

---

## Sorun Giderme {/*troubleshooting*/}

### Bileşenim `forwardRef` ile sarılı ama `ref` değeri sürekli `null` oluyor. {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Bu, genellikle aldığınız `ref`'i kullanmayı unuttuğunuz anlamına gelir.

Örneğin, bu bileşen aldığı `ref`’i hiçbir şekilde kullanmamaktadır:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Bu problemi çözmek adına, `ref`'i bir DOM elementine veya ref alabilen başka bir bileşene iletmelisiniz.

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

Eğer belirli koşullara bağlı olarak işlemler yapılıyorsa, `MyInput` bileşenine atanan ref değeri `null` olabilir.

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Eğer `showInput` değeri false olursa, ref hiçbir elemana iletilmeyecek ve `MyInput` bileşenine atanan ref boş olacaktır. Özellikle, eğer bu durum bir bileşenin içinde saklanıyorsa, örneğin bu örnekteki `Panel` gibi, bu durum kolaylıkla gözden kaçabilir:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
