---
title: isValidElement
---

<Intro>

`isValidElement` bir değerin React elemanı olup olmadığını kontrol eder.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Bir `value` değerinin React elemanı olup olmadığını kontrol etmek için `isValidElement(value)` çağrısı yapın.

```js
import { isValidElement, createElement } from 'react';

// ✅ React elemanları
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ React elemanı olmayan değerler
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Aşağıda daha fazla örneğe bakın.](#usage)

#### Parametreler {/*parameters*/}

* `value`: Kontrol etmek istediğiniz `value` değeri. Herhangi bir türde değer olabilir.

#### Dönüş Değeri {/*returns*/}

`isValidElement`, `value` bir React elemanıysa `true` döndürür. Aksi takdirde `false` döndürür.

#### Uyarılar {/*caveats*/}

* **Yalnızca [JSX etiketleri](/learn/writing-markup-with-jsx) ve [`createElement`](/reference/react/createElement) tarafından döndürülen nesneler React elemanı olarak kabul edilir.** Örneğin, `42` gibi bir sayı geçerli bir React *node'u* olsa da (ve bir bileşenden döndürülebilse de), geçerli bir React elemanı değildir. [`createPortal`](/reference/react-dom/createPortal) ile oluşturulan diziler ve portal'lar da React elemanı olarak *kabul edilmez*.

---

## Kullanım {/*usage*/}

### Bir şeyin React elemanı olup olmadığını kontrol etme {/*checking-if-something-is-a-react-element*/}

Bir değerin *React elemanı* olup olmadığını kontrol etmek için `isValidElement` çağrısı yapın.

React elemanları şunlardır:

- [JSX etiketi](/learn/writing-markup-with-jsx) yazılarak üretilen değerler
- [`createElement`](/reference/react/createElement) çağrılarak üretilen değerler

React elemanları için `isValidElement`, `true` döndürür:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX etiketleri React elemanlarıdır
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ createElement tarafından döndürülen değerler React elemanlarıdır
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Dizeler, sayılar veya rastgele nesneler ve diziler gibi diğer tüm değerler React elemanı değildir.

Bunlar için `isValidElement`, `false` döndürür:

```js
// ❌ Bunlar React elemanı *değildir*
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement`'e ihtiyaç duymanız oldukça nadir bir durumdur. En çok, yalnızca eleman kabul eden başka bir API çağırdığınızda ([`cloneElement`](/reference/react/cloneElement) gibi) ve argümanınız bir React elemanı olmadığında oluşacak hatayı önlemek istediğinizde faydalıdır.

`isValidElement` kontrolü eklemeniz için çok özel bir nedeniniz olmadıkça, muhtemelen buna ihtiyacınız yoktur.

<DeepDive>

#### React elemanları ve React node'ları {/*react-elements-vs-react-nodes*/}

Bir bileşen yazdığınızda, herhangi bir *React node'u* döndürebilirsiniz:

```js
function MyComponent() {
  // ... herhangi bir React node'u döndürebilirsiniz ...
}
```

Bir React node'u şunlardan biri olabilir:

- `<div />` veya `createElement('div')` ile oluşturulan bir React elemanı
- [`createPortal`](/reference/react-dom/createPortal) ile oluşturulan bir portal
- Bir dize (string)
- Bir sayı (number)
- `true`, `false`, `null` veya `undefined` (bunlar görüntülenmez)
- Diğer React node'larından oluşan bir dizi

**`isValidElement`, argümanın bir *React elemanı* olup olmadığını kontrol eder, bir React node'u olup olmadığını değil.** Örneğin, `42` geçerli bir React elemanı değildir. Ancak mükemmel bir şekilde geçerli bir React node'udur:

```js
function MyComponent() {
  return 42; // Bir bileşenden sayı döndürmek sorun değildir
}
```

Bu nedenle, bir şeyin render edilip edilemeyeceğini kontrol etmek için `isValidElement` kullanmamalısınız.

</DeepDive>
