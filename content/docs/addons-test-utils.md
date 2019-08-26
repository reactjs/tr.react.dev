---
id: test-utils
title: Test Araçları
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Ekleme**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 npm ile
```

## Genel Bakış {#overview}

`ReactTestUtils`, React bileşenlerini seçtiğiniz test çerçevesinde test etmeyi kolaylaştırır. Facebook, JavaScript testi için Jest‘i kullanmaktadır.

> Not:
>
> Bileşenlerinizi son kullanıcı kullanır gibi kullanan testler yazmanız ve etkinleştirmeniz için tasarlanmış [React Testing Library](https://testing-library.com/react)'yi kullanmanızı öneririz.
>
> Alternatif olarak Airbnb [Enzyme](http://airbnb.io/enzyme/) adında bir test aracı yayınladı. Bu araç, React bileşenlerinizin çıktısını test etmenizi, üzerinde gezinmenizi ve değiştirmenizi kolaylaştırmaktadır.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Başvuru Dokümanı {#reference}

### `act()` {#act}

Bileşen testlerini hazırlamak için kodunuzu paket haline getirin ve `act()`'i kullanarak bileşeniniz içerisinde güncelleme yapabilirsiniz. `act()`, React'in tarayıcıda çalışma biçimine çok yakın bir şekilde çalışmasını sağlamaktadır.

>Not
>
>Eğer `react-test-renderer`'ı kullanırsanız, bu size `act` çıktısının aynı şekilde davranmasını sağlar.

Örneğin aşağıdaki gibi bir `Counter` bileşenimizin olduğunu düşünün:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `${this.state.count} kez tıkladınız`;
  }
  componentDidUpdate() {
    document.title = `${this.state.count} kez tıkladınız`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>{this.state.count} kez tıkladınız</p>
        <button onClick={this.handleClick}>
          Beni tıkla
        </button>
      </div>
    );
  }
}
```

Bu bileşeni aşağıdaki gibi test edebiliriz:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('sayacı render edebilir ve güncelleyebilir', () => {
  // render ve componentDidMount'u test eder
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('0 kez tıkladınız');
  expect(document.title).toBe('0 kez tıkladınız');

  // render and componentDidUpdate'u test eder
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('1 kez tıkladınız');
  expect(document.title).toBe('1 kez tıkladınız');
});
```

Unutmayınız ki, `document`'a DOM container'ı eklenmediği sürece, DOM olayları çalışmayacaktır. Bu tarz basmakalıp/sabit kodlarla uğraşmamak için, [React Testing Library](https://testing-library.com/react) gibi bir kütüphaneyi kullanabilirsiniz.

<<<<<<< HEAD
The [`Test Tarifleri`](/docs/testing-recipes.html) sayfası `act()` in nasıl çalıştığına dair, örnek kullanımlarla birlikte, daha fazla bilgi içerir.
=======
- The [`recipes`](/docs/testing-recipes.html) document contains more details on how `act()` behaves, with examples and usage.
>>>>>>> 519a3aec91a426b0c8c9ae59e292d064df48c66a

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Mock (sahte ya da taklit) bir React bileşeni olarak kullanılabilmesine izin veren yöntemleri ekleyebilmek için bu metoda mock edilmiş bir bileşen modülü gönderin. Her zamanki gibi render etmesi yerine, bileşen belirtilen herhangi bir alt elemanı içeren basit bir `<div>` olacaktır. (Veya `mockTagName` belirtilmişse, belirtilen eleman olacaktır)

> Not:
>
> `mockComponent()` eski bir API'dır. Onun yerine [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock)'u kullanmanızı tavsiye ederiz.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Eğer `element` herhangi bir React elemanı ise `true` döner.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Eğer `element`, React'in `componentClass` tipinde olan bir React elemanı ise `true` döner.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Eğer `instance`, `div` veya `span` gibi bir DOM bileşeni ise `true` döner

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Eğer `instance`, kullanıcı tanımlı sınıf veya fonksiyon gibi bileşeni ise `true` döner.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Eğer `instance`, React'in `componentClass` tipinde olan bir React elemanı ise `true` döner.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

`tree` içindeki tüm bileşenleri dolaşır ve `test(component)`'ın `true` olduğu tüm bileşenleri toplar. Tek başına pek kullanışlı değil, ancak diğer test araçları için basit olarak kullanılmaktadır.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Render edilen ağaçta, belirtilen `className` ile eşleşen bütün DOM elemanlarını bulur.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

[`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)'a benzerdir, ancak sadece bir sonuç olmasını bekler ve geriye sonucu döndürür. (Birden fazla eşleşme varsa exception fırlatır).

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Render edilen ağaçta, belirtilen `tagName` ile eşleşen bütün DOM elemanlarını bulur.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

[`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)'a benzerdir, ancak sadece bir sonuç olmasını bekler ve geriye sonucu döndürür. (Birden fazla eşleşme varsa exception fırlatır).

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Belirtilen `componentClass`'a eşit olan bütün bileşenleri bulur.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

[`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)'a benzerdir, ancak sadece bir sonuç olmasını bekler ve geriye sonucu döndürür. (Birden fazla eşleşme varsa exception fırlatır).

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Bir React öğesini dökümandan ayrılmış bir DOM elemanı olarak render edin. **Bu fonksiyonun DOM'a ihtiyacı vardır.** Şuna eşdeğerdir:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Not:
>
> `React`'a eklemeden **önce** global olarak hazır olan `window`, `window.document` ve `window.document.createElement`'e ihtiyacınız olacaktır. Aksi takdirde React DOM'a erişemediğini düşünecektir ve böylece `setState` gibi metodlar çalışmayacaktır.

* * *

## Diğer Araçlar {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

İsteğe bağlı olan `eventData` olay verileri ile bir DOM elemanı üzerinde olay gönderimini simüle edebilirsiniz.

`Simulate`, [React'in anlayabildiği her olay](/docs/events.html#support-events) için bir metoda sahiptir.

**Elemana tıklama**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Input alanındaki değeri değiştirme ve ENTER'a basma**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'zürafa';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Not
>
> React'in sağlayamadığı ama bileşeninizde kullandığınız herhangi bir olay özelliğini (örneğin, keyCode, which, vb...) sizin sağlamanız gerekmektedir.

* * *
