---
title: findDOMNode
---

<Deprecated>

Bu API, React'in gelecekteki bir ana sürümünde kaldırılacaktır. [Alternatif API'ları görüntüle.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode`, fonksiyonu React [sınıf bileşenine](/reference/react/Component) ait tarayıcı DOM nesnesini döndürür.

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

Bir React [sınıf bileşenine](/reference/react/Component) ait DOM nesnesini bulmak için `findDOMNode` fonksiyonunu çağırın.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[Daha fazla kullanım örneği için buraya tıklayın.](#usage)

#### Parametreler {/*parameters*/}

* `componentInstance`: [`Bileşene`](/reference/react/Component) ait nesneyi ifade eder. Örnekle, React sınıf bileşeni içerisinde kullanılan `this` işaretcisi parametre olarak kullanılabilir.


#### Dönüş Değerleri {/*returns*/}

`findDOMNode`, verilen `componentInstance` bileşenini içeren en yakın DOM nesnesini döndürür. Eğer bir bileşen `null` veya `false` olarak render edilirse, `findDOMNode` fonksiyonu `null` değerini döndürür. Eğer bileşen sadece metin içerecek şekilde render edilirse, `findDOMNode`, o değeri içeren bir metin DOM nesnesi döndürür.

#### Uyarılar {/*caveats*/}

* React bileşeni bazı durumlarda bir [Fragment](/reference/react/Fragment) ya da bir dizi içerebilir. Bu durumda `findDOMNode` fonsiyonu içi boş olmayan ilk alt nesneyi döndürecektir.

* `findDOMNode` fonksiyonu sadece render edilmiş bileşenlerde çalışır. (Yani, bir bileşenin DOM üzerinde bir yer edinmiş olması gerekir). Eğer render edilmemiş bir bileşen için `findDOMNode` fonksiyonunu çağırmaya çalışırsanız (Örn: `findDOMNode()` fonksiyonunu, henüz oluşturulmamış bir bileşenin `render()` fonksiyonu içerisinde çağırırsanız) uygulama genelinde bir hata fırlatılır ve uygulama çalışmaz.

* `findDOMNode` fonksiyonu sadece çağırıldığı andaki sonucu döndürür. Eğer alt bileşen daha sonradan farklı bir node render eder ise bu değişimden haberdar olmak mümkün değildir.

* `findDOMNode` sadece React sınıf bileşenleri ile çalışır, React fonksiyon bileşeni yapısı ile kullanılamaz.

---

## Kullanım {/*usage*/}

### Sınıf bileşeninin ana DOM objesinin bulunması {/*finding-the-root-dom-node-of-a-class-component*/}

Render edilmiş DOM nesnesini bulabilmek için `findDOMNode` fonksiyonunu bir React sınıf bileşeni içerisinde çağırın. (React sınıf bileşenine `this` niteliğini kullanarak erişebilirsiniz)


```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Merhaba" />
  }
}
```

Yukarıdaki kod parçacığında `ìnput` değişkeni `findDOMNode` fonksiyonu aracılığı ile render metodu içerisindeki `<input>` DOM nesnesine ulaşır.

Şimdi ulaşılan input nesnesiyle bir şeyler yapalım. Bir `show` state'i oluşturalım ve varsayılan değeri `false` olsun. `Göster` buton elementi aracılığı ile state'i güncelleyelim. Güncellenen `show` state'i ile `<AutoSelectingInput />` bileşeni render edilsin.

Alt tarafta gerekli kaynak kodu görüntüleyebilirsiniz, şimdi de neler olduğunu açıklayalım.

`Göster` butonuna tıklandığında `AutoselectingInput` bileşeni render edilir ve tarayıcı ekranında görünür hale gelir. Ardından `findDOMNode` fonksiyonu çağrılarak input nesnesi bulunur.

Bulunan nesnede [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) metodu aracılığı ile içinde yazılı olan `Merhaba` yazısı seçili olarak gösterilir.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Göster
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Merhaba" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## Alternatifler {/*alternatives*/}

### Referans değerinden bileşene ait DOM nesnesine ulaşma {/*reading-components-own-dom-node-from-a-ref*/}

`findDOMNode` fonksiyonunun kullanıldığı kodlar kırılgan kodlardır. Çünkü JSX nesnesi ile DOM nesnesi arasındaki bağlantı açık bir şekilde ifade edilmemektedir. Örn, kod içerisindeki `<input />` kısmını `<div>` ile sarmayı deneyelim:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Göster
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Merhaba" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

Bu kullanım kodun çalışmasına engel olacaktır. Çünkü `findDOMNode` geriye `<div>` DOM nesnesini döndürecektir fakat kod dönüş değerinin `<input />` DOM nesnesi olmasını bekler.

Bu tür problemlerin önüne geçmek spesifik bir DOM nesnesi seçebilen için [`createRef`](/reference/react/createRef) fonksiyonunu kullanın.

Alt kısımdaki örnekte `findDOMNode` yerine `createRef`'in nasıl kullanıdğını daha iyi anlayabilirsiniz.

Bu örnekte, `ìnputRef = createRef(null)` kodunda `null` değer tanımlamasına sahip yeni bir referans oluşturduk. Oluşturduğumuz bu referansı `ref={this.inputRef}` niteliği aracılığıyla `input` elementine tanımladık.

Bileşen oluşturulduğunda ise `this.inputRef.current` notasyonu ile DOM nesnesine ulaştık ve `input.select()` metodunu yeniden kullanılabilir hale getirdik.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

Bahsettiğimiz üzere `findDOMNode` fonksiyon bileşenlerini desteklemiyordu. Referans sisteminde sınırlama olmadan fonksiyon bileşenlerinde de kullanabiliyoruz.

Fonksiyon bileşenlerindeki referans kullanımında `createRef` yerini [`useRef`](/reference/react/useRef) hook'u almakta.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Göster
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Merhaba" />
}
```

</Sandpack>

[Ref'ler ile DOM manipülasyonu hakkında daha fazla bilgi almak için tıklayın.](/learn/manipulating-the-dom-with-refs)

---

### Alt bileşene ait DOM nesnesine forwarded ref aracılığı ile ulaşma {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

Bu örnekte, `findDOMNode(this)` ile başka bir bileşene ait DOM nesnesini bulacağız. `AutoselectingInput` bileşeni, `input` elementinin bulunduğu `MyInput` bileşenini render edecek ve `findDOMNode(this)` fonksiyonunu kullanarak `input` elementine ulaşmaya çalışacağız.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

`AutoselectingInput` içindeki `findDOMNode(this)` çağrısının size hala DOM `<input>` verdiğini unutmayın; bu `<input>` için JSX `MyInput` bileşeninin içinde gizli olsa bile. Bu, yukarıdaki örnek için uygun gibi görünse de kodun kırılgan olmasına neden olur. Daha sonra `MyInput`'u düzenlemek ve etrafına bir `<div>` sarmalayıcısı eklemek istediğinizi düşünün. Bu durumda, (bir `<input>` bulmayı bekleyen) `AutoselectingInput` bileşeni doğru çalışmayacaktır.

`findDOMNode` yerine ref kullanabilmemiz için iki bileşende de belirli düzenlemeler yapmalıyız.

1. [Önceki örneklerde](#reading-components-own-dom-node-from-a-ref) işlediğimiz üzere `AutoSelectingInput` içinde bir referans tanımlamalıyız ve bu referansı `MyInput` bileşenine iletmeliyiz.
2. `MyInput` bileşeni ise [`forwardRef`](/reference/react/forwardRef) aracılığı ile bir referans değer döndürmeli ki ortadaki iki referans değeri birbiriyle eşleşsin ve üst bileşen yapısında `input` elementine ait referansı kullanabilelim.

Nihai versiyonda artık `findDOMNode` kullanmadan başka bir bileşen içindeki DOM nesnesine erişebildik:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Göster
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Merhaba" />;
});

export default MyInput;
```

</Sandpack>

Aşağıdaki örnek bu kodun sınıf bileşeni yerine fonksiyon bileşeninde nasıl kullanılacağını gösteriyor:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Göster
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Merhaba" />
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Merhaba" />;
});

export default MyInput;
```

</Sandpack>

---

### Kapsayıcı `<div>` elementi ekleme {/*adding-a-wrapper-div-element*/}

Bazen bir bileşenin alt bileşenlerinin konumunu ve boyutunu bilmesi gerekir. Bu durum, `findDOMNode(this)` ile bulunan nesnelerle ve ardından ölçümler için bu nesnelerin [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) gibi DOM yöntemleriyle kullanılmasıyla sonuçlanır.

Şu anda bu kullanım için doğrudan bir alternatif yoktur, bu nedenle `findDOMNode` kullanımdan kaldırılmış olsa da henüz React'tan tamamen kaldırılmamıştır.

Bu durumda çözüm olarak içeriği kapasayacak bir `<div>` elementi oluşturabilirsiniz ve oluşturduğunuz `<div>` elementine bir referans tanımlayabilirsiniz. Ancak unutmamak gerekir ki ekstra oluşturduğunuz kapsayıcılar stil bozulmalarına sebep olabilir.

```js
<div ref={someRef}>
  {children}
</div>
```

Bu aynı zamanda alt bileşenlere `focusing` ve `scrolling` olayları için de geçerlidir.
