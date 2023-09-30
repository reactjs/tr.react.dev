---
title: findDOMNode
---

<Deprecated>

Bu başvuru ilerleyen React sürümlerinde kaldırılabilir. [Alternatif başvuruları görüntüle.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode`, fonksiyonu React [sınıf bileşenine](/reference/react/Component) ait tarayıcı DOM nesnesini döndürür.

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## Başvuru dökümanı {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

Bir, React [sınıf bileşenine](/reference/react/Component) ait DOM nesnesini bulmak için `findDOMNode` fonksiyonunu kullanın.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[Daha fazla kullanım örneği için buraya tıklayın.](#usage)

#### Parametreler {/*parameters*/}

* `componentInstance`: [`Bileşene`](/reference/react/Component) ait nesneyi ifade eder. Örnekle, React sınıf bileşeni içerisinde kullanılan `this` işaretcisi parametre olarak kullanılabilir.


#### Geri Döndürür {/*returns*/}

`findDOMNode`, verilen `componentInstance` bileşenini içeren en yakın tarayıcı DOM nesnesini döndürür. Eğer bir bileşen `null` veya `false` olarak render edilirse, `findDOMNode` fonksiyonu `null` değerini döndürür. Eğer bileşen sadece metin içerecek şekilde render edilirse, `findDOMNode`, o değeri içeren bir metin DOM nesnesi döndürür.

#### Uyarılar {/*caveats*/}

* React bileşeni bazı durumlarda bir [Fragment](/reference/react/Fragment) ya da bir dizi içerebilir. Bu durumda `findDOMNode` fonsiyonu içi boş olmayan ilk alt nesneyi döndürecektir.

* `findDOMNode` fonksiyonu sadece DOM objesi oluşturulmuş (mounted) bileşenlerde çalışır. (Bu ne demek?: Bir React bileşeninin tarayıcı DOM üzerinde bir yer edinmiş olmasına "mounted" durum denir). Eğer DOM objesi oluşturulmamış bir bileşeni `findDOMNode` ile kullanmaya çalışırsanız uygulama genelinde bir hata fırlatılır ve uygulama çalışmaz.

* `findDOMNode` fonksiyonu sadece çağrıldığı döngü içerisinde çalışır. Yani bir bileşen yeniden render yapıldığında kendini güncellemez ya da tekrardan çalışmaz.

* `findDOMNode` sadece React sınıf bileşenleri ile çalışır. React fonksiyon bileşeni yapısı ile uyumlu değildir.

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

Şimdi ulaşılan input nesnesiyle bir şeyler yapalım. Bir `show` state'i oluşturalım ve varsayılan değeri `false` olsun. `Göster` buton elementi aracılığı ile state'i güncelliyelim. Güncellenen `show` state'i ile `<AutoSelectingInput />` bileşeni render edilsin.

Alt tarafta gerekli kaynak kodu görüntüleyebilirsiniz, şimdi de neler olduğunu açıklayalım.

Nihai kodda `Göster` butonuna tıklatıldığında `AutoselectingInput` bileşeni ekranda gösterilmeye başlanır. Ekranda gösterildiği için render edilir, render edildikten sonra ise `findDOMNode` fonksiyonu çağrılarak input nesnesi bulunur.

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

`findDOMNode` JSX nesnesi seçimi konusunda oldukça hassas çalışır. Bu yüzden bazen istediğimiz DOM nesnesine ulaşamayabiliriz.

Bu durumu daha da iyi anlayabilmek adına `<input />` elementinin bir üst katmanına `<div>` elementi ekleyelim. Eklediğimiz element `<input />`'u kapsadığından dolayı `findDOMNode` bizlere en üst element olan `<div>` DOM nesnesini döndürecektir.

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

`findDOMNode` bizlere `<input />` elementi yerine `<div>` DOM nesnesini döndürdüğü için artık `ìnput.select()` metodu hata verecektir ve uygulamamız çalışmayacaktır.

Bu sorunu çözmek adına `<input>` elementine [`createRef`](/reference/react/createRef) aracılığı ile bir referans oluşturup atayabilir. Referans üzerinden DOM nesnesine ulaşabiliriz.

Alt kısımdaki örnekte `findDOMNode` yerine `createRef`'in nasıl kullanıdğını daha iyi anlayabilirsiniz.

Açıklamak gerekirse, `ìnputRef = createRef(null)` kodunda null değer tanımlamasına sahip yeni bir referans oluşturduk. Oluşturduğumuz bu referansı `ref={this.inputRef}` niteliği aracılığıyla `input` elementine tanımladık.

Bileşen oluturulduğunda ise `this.inputRef.current` notasyonu ile DOM nesnesine ulaştık ve `input.select()` metodunu yeniden kullanılabilir hale getirdik.

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

[Ref'ler ile DOM Manipülasyonu hakkında daha fazla bilgi almak için tıklayın.](/learn/manipulating-the-dom-with-refs)

---

### Alt bileşene ait DOM nesnesine forwarded ref aracılığı ile ulaşma {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

Bu örnekte, `findDOMNode(this)` ile başka bir bileşene ait DOM nesnesini bulacağız.

Senaryomuzda `AutoselectingInput` bileşeni, `input` elementinin bulunduğu `MyInput` bileşenini render edecek ve bizler `findDOMNode(this)` aracılığı ile `input` elementine ulaşmaya çalışıcağız.

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

Unutmamalıyız ki `findDOMNode(this)`, `AutoselectingInput` içerisinde çağrıldığında bizlere DOM nesnesi olarak `input` elementini döndürmektedir. --bunun sebebi `AutoselectingInput`'in içinde render ettiğimiz `MyInput` bileşeninin sadece `input` elementini döndürmesidir.

Ancak ilerleyen zamanlarda `MyInput` bileşeninde bir değişikliğe gidip, `input` elementini bir `div` elementi ile kapsayacak durumda olursak. Bu kod çalışmayacaktır ve uygulamamız `input` elementini bulamadığı için metod hata verecektir.

`findDOMNode` yerine ref kullanabilmemiz için iki bileşende de belirli düzenlemeler yapmalıyız.

Bu düzenlemeler:

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

Alt taraftaki örnek ise aynı kodun fonksiyon bileşeninde nasıl kullanılacağını gösteriyor.

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

### Kapsayıcı `<div>` elementini ekleme {/*adding-a-wrapper-div-element*/}

Bazen bir bileşenin alt bileşenlerinin konumunu ve boyutunu bilmesi gerekir. Bu durum, `findDOMNode(this)` ile bulunan nesnelerle ve ardından ölçümler için bu nesnelerin [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) gibi DOM yöntemleriyle kullanılmasıyla sonuçlanır.

Şu anda bu kullanım durumu için doğrudan bir eşdeğer alternatif yoktur, bu nedenle `findDOMNode` kullanımdan kaldırılmış olsa da henüz React'tan tamamen kaldırılmamıştır.

Bu durumda çözüm olarak içeriği kapasayacak bir `<div>` elementi oluşturabiliriz. Oluşturduğumuz `<div>` elementinin referansı üzerinden yürüyerek işlemlerimizi yapabiliriz. Ancak unutmamak gerekir ki ekstra oluşturduğumuz kapsayıcılar stil bozulmalarına sebep olabilir.

```js
<div ref={someRef}>
  {children}
</div>
```

Bu aynı zamanda alt bileşenlere focusing ve scrolling olayları için de geçerlidir.
