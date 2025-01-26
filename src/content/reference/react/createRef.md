---
title: createRef
---

<Pitfall>

`createRef` çoğunlukla [sınıf bileşenleri.](/reference/react/Component) için kullanılır. Fonksiyon bileşenleri genellikle bunun yerine [`useRef`](/reference/react/useRef) kullanır.

</Pitfall>

<Intro>

`createRef` rastgele değer içerebilen bir [ref](/learn/referencing-values-with-refs) nesnesi oluşturur.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `createRef()` {/*createref*/}

Bir [sınıf bileşeni](/reference/react/Component) içinde bir [ref](/learn/referencing-values-with-refs) bildirmek için `createRef` çağrısı yapın

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Aşağıda daha fazla örneğe bakın.](#usage)

#### Parametreler {/*parameters*/}

`createRef` hiçbir parametre almaz.

#### Returns {/*returns*/}

`createRef` tek bir özelliğe sahip bir nesne döndürür:

* `current`: Başlangıçta `null` olarak ayarlanır. Daha sonra başka bir şeye ayarlayabilirsiniz. Ref nesnesini React'e bir JSX düğümüne `ref` niteliği olarak iletirseniz, React onun `current` özelliğini ayarlayacaktır.

#### Uyarılar {/*caveats*/}

* `createRef` her zaman *farklı* bir nesne döndürür. Bu, `{ current: null }` yazmaya eşdeğerdir.
* Bir fonksiyon bileşeninde, muhtemelen bunun yerine her zaman aynı nesneyi döndüren [`useRef`](/reference/react/useRef) istersiniz.
* `const ref = useRef()` ifadesi `const [ref, _] = useState(() => createRef(null))` ifadesine eşdeğerdir.

---

## Kullanım {/*usage*/}

### Bir sınıf bileşeninde ref bildirme {/*declaring-a-ref-in-a-class-component*/}

Bir [class component,](/reference/react/Component) içinde bir ref bildirmek için `createRef` çağrısı yapın ve sonucunu bir sınıf alanına atayın:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Şimdi JSX'inizdeki bir `<input>` öğesine `ref={this.inputRef}` iletirseniz, React `this.inputRef.current` öğesini girdi DOM node'u ile dolduracaktır. Örneğin, girişi odaklayan bir node'u şu şekilde yapabilirsiniz:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Input'a odaklan
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` çoğunlukla [sınıf bileşenleri.](/reference/react/Component) için kullanılır. Fonksiyon bileşenleri genellikle bunun yerine [`useRef`](/reference/react/useRef) kullanır.

</Pitfall>

---

## Alternatifler {/*alternatives*/}

### `createRef` ile bir sınıftan `useRef` ile bir fonksiyona geçiş {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Yeni kodda [sınıf bileşenleri](/reference/react/Component) yerine fonksiyon bileşenlerinin kullanılmasını öneriyoruz. Eğer `createRef` kullanan bazı mevcut sınıf bileşenleriniz varsa, bunları nasıl dönüştürebileceğiniz aşağıda açıklanmıştır. Bu orijinal koddur:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Input'a odaklan
        </button>
      </>
    );
  }
}
```

</Sandpack>

[Bu bileşeni bir sınıftan bir fonksiyona dönüştürdüğünüzde,](/reference/react/Component#alternatives) `createRef` çağrılarını [`useRef`:](/reference/react/useRef) çağrılarıyla değiştirin

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>
