---
title: createFactory
---

<Deprecated>

Bu API, React'in gelecek bir ana sürümünde kaldırılacaktır. [Alternatiflere bakın.](#alternatives)

</Deprecated>

<Intro>

`createFactory`, belirli bir türde React elemanları üreten bir işlev oluşturmanızı sağlar.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Başvuru {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

Belirli bir `type` türünde React elemanları üreten bir factory işlevi oluşturmak için `createFactory(type)` çağrısını kullanın.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Ardından JSX kullanmadan React elemanları oluşturabilirsiniz:

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

[Aşağıdaki örneklere bakın.](#usage)

#### Parametreler {/*parameters*/}

* `type`: `type` argümanı geçerli bir React bileşeni türü olmalıdır. Örneğin bir etiket adı string'i (`'div'` veya `'span'` gibi) ya da bir React bileşeni (bir işlev, sınıf veya [`Fragment`](/reference/react/Fragment) gibi özel bir bileşen) olabilir.

#### Döndürülen değer {/*returns*/}

Bir factory işlevi döndürür. Bu factory işlevi, ilk argüman olarak bir `props` nesnesi, ardından `...children` argümanlarının listesini alır ve verilen `type`, `props` ve `children` ile bir React elemanı döndürür.

---

## Kullanım {/*usage*/}

### Bir factory ile React elemanları oluşturma {/*creating-react-elements-with-a-factory*/}

Çoğu React projesi kullanıcı arayüzünü tanımlamak için [JSX](/learn/writing-markup-with-jsx) kullansa da JSX zorunlu değildir. Geçmişte `createFactory`, JSX kullanmadan kullanıcı arayüzü tanımlamanın yollarından biriydi.

`'button'` gibi belirli bir eleman türü için bir *factory işlevi* oluşturmak üzere `createFactory` çağrısını kullanın:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Bu factory işlevi çağrıldığında, sağladığınız `props` ve alt elemanlarla React elemanları oluşturur:

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

`createFactory` JSX'e alternatif olarak bu şekilde kullanılıyordu. Ancak `createFactory` kullanım dışı bırakılmıştır; yeni kodlarda `createFactory` çağrısı yapmamalısınız. `createFactory` kullanımından nasıl geçiş yapacağınızı aşağıda görebilirsiniz.

---

## Alternatifler {/*alternatives*/}

### `createFactory` işlevini projenize kopyalama {/*copying-createfactory-into-your-project*/}

Projenizde çok sayıda `createFactory` çağrısı varsa bu `createFactory.js` uygulamasını projenize kopyalayın:

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

Bu sayede import ifadeleri dışında kodunuzda değişiklik yapmadan devam edebilirsiniz.

---

### `createFactory` yerine `createElement` kullanma {/*replacing-createfactory-with-createelement*/}

Birkaç `createFactory` çağrınız varsa ve bunları elle taşımakta sakınca görmüyorsanız, ayrıca JSX kullanmak istemiyorsanız, her factory işlevi çağrısını bir [`createElement`](/reference/react/createElement) çağrısıyla değiştirebilirsiniz. Örneğin aşağıdaki kodu:

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

şu kodla değiştirebilirsiniz:

```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

React'i JSX olmadan kullanmaya dair eksiksiz bir örnek:

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### `createFactory` yerine JSX kullanma {/*replacing-createfactory-with-jsx*/}

Son olarak `createFactory` yerine JSX kullanabilirsiniz. React'i kullanmanın en yaygın yolu budur:

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

<Pitfall>

Bazen mevcut kodunuz `'button'` gibi sabit bir değer yerine bir değişkeni `type` olarak geçebilir:

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

JSX'te aynı şeyi yapmak için değişkeninizin adını `Type` gibi büyük harfle başlayacak şekilde değiştirmeniz gerekir:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

Aksi takdirde React, küçük harfle yazıldığı için `<type>` ifadesini yerleşik bir HTML etiketi olarak yorumlar.

</Pitfall>
