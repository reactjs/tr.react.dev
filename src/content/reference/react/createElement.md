---
title: createElement
---

<Intro>

`createElement` bir React elemanı oluşturmanızı sağlar. [JSX](/learn/writing-markup-with-jsx) yazmaya alternatif olarak hizmet eder.

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Verilen `type`, `props` ve `children` ile bir React elemanı oluşturmak için `createElement` çağrısı yapın.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Aşağıda daha fazla örneğe bakın.](#usage)

#### Parametreler {/*parameters*/}

* `type`: `type` argümanı geçerli bir React bileşen tipi olmalıdır. Örneğin, bir etiket adı dizesi (`'div'` veya `'span'` gibi) veya bir React bileşeni (bir fonksiyon, bir sınıf veya [`Fragment`](/reference/react/Fragment) gibi özel bir bileşen) olabilir.

* `props`: `props` bağımsız değişkeni ya bir nesne ya da `null` olmalıdır. Eğer `null` geçerseniz, boş bir nesneyle aynı muameleyi görecektir. React, ilettiğiniz `props` ile eşleşen prop'lara sahip bir eleman oluşturacaktır. `Props` nesnenizdeki `ref` ve `key` öğelerinin özel olduğunu ve döndürülen `element` üzerinde `element.props.ref` ve `element.props.key` olarak kullanılamayacağını *unutmayın. Bunlar `element.ref` ve `element.key` olarak mevcut olacaktır.

* **isteğe bağlı** `...children`: Sıfır veya daha fazla alt node. React öğeleri, strings, numbers, [portallar](/reference/react-dom/createPortal), boş node'lar (`null`, `undefined`, `true` ve `false`) ve React node'larının dizileri dahil olmak üzere herhangi bir React node'u olabilirler.

#### Returns {/*returns*/}

`createElement`, birkaç özelliğe sahip bir React element nesnesi döndürür:

* `type`: Geçtiğiniz `tip`.
* `props`: `ref` ve `key` dışında geçirdiğiniz `props`.
* `ref`: Geçtiğiniz `ref`. Eksikse, `null`.
* `key`: İlettiğiniz `anahtar` bir string'e zorlanır. Eksikse, `null`.

Genellikle, öğeyi bileşeninizden döndürür veya başka bir öğenin alt elemanı yaparsınız. Öğenin özelliklerini okuyabilseniz de, en iyisi her öğeyi oluşturulduktan sonra opak olarak ele almak ve yalnızca render etmektir.

#### Uyarılar {/*caveats*/}

* React öğelerine ve prop'larına [immutable](https://en.wikipedia.org/wiki/Immutable_object)** olarak davranmalı ve oluşturulduktan sonra içeriklerini asla değiştirmemelisiniz. Geliştirme sırasında, React bunu uygulamak için döndürülen öğeyi ve `props` özelliğini sığ bir şekilde [dondurur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

* JSX kullandığınızda, **kendi özel bileşeninizi oluşturmak için bir etikete büyük harfle başlamalısınız.** Başka bir deyişle, `<Something />` `createElement(Something)` ile eşdeğerdir, ancak `<something />` (küçük harf) `createElement('something')` ile eşdeğerdir (bunun bir dize olduğuna dikkat edin, bu nedenle yerleşik bir HTML etiketi olarak ele alınacaktır).

* Alt elemanları `createElement` öğesine yalnızca **hepsi statik olarak biliniyorsa** birden fazla argüman olarak geçirmelisiniz, örneğin `createElement('h1', {}, child1, child2, child3)`. Alt elemanlarınız dinamikse, dizinin tamamını üçüncü bağımsız değişken olarak iletin: `createElement('ul', {}, listItems)`. Bu, React'in herhangi bir dinamik liste için [eksik `anahtar`lar hakkında sizi uyarmasını](/learn/rendering-lists#keeping-list-items-in-order-with-key) sağlar. Statik listeler için bu gerekli değildir çünkü asla yeniden sıralanmazlar.

---

## Kullanım {/*usage*/}

### JSX olmadan öğe oluşturma {/*creating-an-element-without-jsx*/}

[JSX](/learn/writing-markup-with-jsx)'i sevmiyorsanız veya projenizde kullanamıyorsanız, alternatif olarak `createElement` kullanabilirsiniz.

JSX olmadan bir öğe oluşturmak için, `createElement` öğesini bazı <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep> ve <CodeStep step={3}>children</CodeStep> ile çağırın:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep> isteğe bağlıdır ve ihtiyaç duyduğunuz kadarını geçebilirsiniz (yukarıdaki örnekte üç alt eleman vardır). Bu kod, bir selamlama içeren bir `<h1>` başlığı görüntüleyecektir. Karşılaştırma için, aynı örnek JSX ile yeniden yazılmıştır:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Kendi React bileşeninizi oluşturmak için, `'h1'` gibi bir string yerine <CodeStep step={1}>type</CodeStep> olarak `Greeting` gibi bir fonksiyon geçirin:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

JSX ile şu şekilde görünecektir:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

İşte `createElement` ile yazılmış tam bir örnek:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Ve işte JSX kullanılarak yazılmış aynı örnek:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Her iki kodlama stilinde de sorun yoktur, bu nedenle projeniz için hangisini tercih ederseniz onu kullanabilirsiniz. JSX kullanmanın `createElement` ile karşılaştırıldığında ana faydası, hangi kapanış etiketinin hangi açılış etiketine karşılık geldiğini görmenin kolay olmasıdır.

<DeepDive>

#### React elementi tam olarak nedir? {/*what-is-a-react-element-exactly*/}

Bir öğe, kullanıcı arayüzünün bir parçasının hafif bir tanımıdır. Örneğin, hem `<Greeting name=“Taylor” />` hem de `createElement(Greeting, { name: 'Taylor' })` aşağıdaki gibi bir nesne üretir:

```js
// Biraz basitleştirilmiş
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Bu nesneyi oluşturmanın `Greeting` bileşenini oluşturmadığını veya herhangi bir DOM öğesi yaratmadığını unutmayın.**

Bir React öğesi daha çok bir açıklama gibidir - React'in daha sonra `Greeting` bileşenini oluşturması için bir talimat. Bu nesneyi `App` bileşeninizden döndürerek, React'e bundan sonra ne yapacağını söylersiniz.

Öğeler oluşturmak son derece ucuzdur, bu nedenle optimize etmeye çalışmanıza veya bundan kaçınmanıza gerek yoktur.

</DeepDive>
