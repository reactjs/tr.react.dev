---
id: react-api
title: React Üst Düzey API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React`, React kütüphanesine giriş noktasıdır. React'i bir `<script>` etiketinden yüklerseniz, bu üst düzey API'ler `React` globali üzerinde mevcut olacaktır. ES6'yı npm ile kullanıyorsanız, `import React from 'react'` yazabilirsiniz. ES5'i npm ile kullanıyorsanız, `var React = require('react')` yazabilirsiniz.

## Genel Bakış {#overview}

### Bileşenler {#components}

React bileşenleri, kullanıcı arabirimini bağımsız, yeniden kullanılabilir parçalara ayırmanıza ve ayrılmış her bir parça hakkında düşünmenize olanak sağlar. React bileşenleri, `React.Component` yada `React.PureComponent` üzerinden alt sınıflandırma yoluyla tanımlanabilir.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

ES6 sınıflarını kullanmıyorsanız, bunun yerine `create-react-class` modülünü kullanabilirsiniz. Daha fazla bilgi için [ES6 olmadan React kullanma](/docs/react-without-es6.html) bölümüne bakınız.

React bileşenleri ayrıca sarılabilecek fonksiyonlar olarak tanımlanabilir:

- [`React.memo`](#reactmemo)

### React Öğeleri Oluşturma {#creating-react-elements}

Kullanıcı arayüzünüzün nasıl görünmesi gerektiğini tanımlamak için [JSX kullanmanızı](/docs/introducing-jsx.html) öneririz. Her JSX elementi sadece [`React.createElement()`](#createelement) metodunu çağırmak için sözdizimsel şekerdir. JSX kullanıyorsanız, genellikle aşağıdaki metodları doğrudan çağırmazsınız.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Daha fazla bilgi için [JSX olmadan React kullanma](/docs/react-without-jsx.html) bölümüne bakınız.

### Öğeleri Dönüştürme {#transforming-elements}

`React` öğeleri işlemek için birkaç API sağlar:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragment'ler {#fragments}

`React` ayrıca sarıcı olmadan birden fazla eleman render etmek için bir bileşen sağlar.

- [`React.Fragment`](#reactfragment)

### Ref'ler {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Suspense, bileşenlerin render edilmeden önce bir şey için "beklemesini" sağlar. Günümüzde, Suspense yalnızca bir kullanım durumunu destekler: [bileşenleri `React.lazy` ile dinamik olarak yükleme](/docs/code-splitting.html#reactlazy). Gelecekte, veri getirme gibi diğer kullanım durumlarını destekleyecektir.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hook'lar {#hooks}

*Hook'lar*, React 16.8 ile gelen yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar. Hook'lar [özel bir döküman bölümüne](/docs/hooks-intro.html) ve ayrı bir API referansına sahiptir:

- [Temel Hook'lar](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [Ek Hook'lar](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## Referans {#reference}

### `React.Component` {#reactcomponent}

`React.Component`, [ES6 sınıfları](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) kullanılarak tanımlandıklarında React bileşenleri için temel sınıftır:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Temel `React.Component` sınıfına ilişkin metod ve özelliklerin listesi için [React.Component API Referansına](/docs/react-component.html) bakın.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` [`React.Component`](#reactcomponent)'e benzer. Aralarındaki fark, [`React.Component`](#reactcomponent)'in [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) metodunu uygulamamasıdır, ancak `React.PureComponent` bunu yüzeysel bir prop ve state karşılaştırması ile birlikte uygular.

Eğer React bileşeninizin `render()` fonksiyonu aynı prop'lar ve state ile aynı sonucu render ediyor ise, bazı durumlarda performans artışı için `React.PureComponent` kullanabilirsiniz.

> Not
>
> `React.PureComponent`'in `shouldComponentUpdate()` metodu sadece nesneleri yüzeysel olarak karşılaştırır. Eğer bunlar karmaşık veri yapıları içeriyorsa, daha derin farklılıklar için yanlış sonuçlar üretebilir. `PureComponent`'i yalnızca prop'lar ve state'in basit olmasını beklediğiniz durumlarda uzatın, veya derin veri yapılarının değiştiğini biliyorsanız [`forceUpdate()`](/docs/react-component.html#forceupdate) işlevini kullanın. Veya iç içe geçmiş verilerin hızlı bir şekilde karşılaştırılmasını kolaylaştırmak için [değişmez nesneler](https://facebook.github.io/immutable-js/) kullanmayı düşünebilirsiniz.
>
> Ayrıca, `React.PureComponent`'in `shouldComponentUpdate()` metodu tüm bileşen alt ağacı için prop güncellemelerini atlar. Tüm alt bileşenlerinin de "pure" olduğundan emin olun.

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* prop'ları kullanarak render et */
});
```

`React.memo` bir [üst katman bileşenidir](/docs/higher-order-components.html). [`React.PureComponent`](#reactpurecomponent)'e benzer ancak sınıflar yerine fonksiyon bileşenleri için geçerlidir.

Eğer fonksiyon bileşeniniz aynı prop'lar ile aynı sonucu render ediyor ise, bazı durumlarda sonucu ezberleyerek performans artışı sağlaması için onu bir `React.memo` çağrısına sarabilirsiniz. Bu, React'in bileşeni render etmeyi atlayacağı ve son render edilen sonucu yeniden kullanacağı anlamına gelir.

Varsayılan olarak, prop'lar nesnesindeki karmaşık nesneleri sadece yüzeysel bir şekilde karşılaştıracaktır. Karşılaştırma üzerinde kontrolü ele almak istiyorsanız, ikinci argüman olarak özel bir karşılaştırma fonksiyonu sağlayabilirsiniz.

```javascript
function MyComponent(props) {
  /* prop'ları kullanarak render et */
}
function areEqual(prevProps, nextProps) {
  /*
  nextProps'u render'a iletmek,
  prevProps'u render'a iletmek ile aynı sonucu verirse true
  aksi takdirde false döndürür
  */
}
export default React.memo(MyComponent, areEqual);
```

Bu metod yalnızca bir **[performans optimizasyonu](/docs/optimizing-performance.html)** olarak vardır. Bir render işlemini "önlemek" için ona güvenmeyin, bu hatalara neden olabilir.

> Not
>
> Sınıf bileşenlerinde bulunan [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) metodunun aksine, `areEqual` fonksiyonu prop'lar birbirine eşitse `true`, prop'lar birbirine eşit değilse `false` döndürür. Bu `shouldComponentUpdate` işlevinin tersidir.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Verilen tipte yeni bir [React elemanı](/docs/rendering-elements.html) oluştur ve döndür. Type argümanı bir etiket ismi string'i (`'div'` veya `'span'` gibi), bir [React bileşen](/docs/components-and-props.html) tipi (bir sınıf yada fonksiyon), veya bir [React fragment](#reactfragment) tipi olabilir.

[JSX](/docs/introducing-jsx.html) ile yazılmış kod `React.createElement()` işlevini kullanmak üzere dönüştürülecektir. JSX kullanıyorsanız genellikle `React.createElement()` işlevini doğrudan çağırmazsınız. Daha fazla bilgi için bkz. [JSX Olmadan React](/docs/react-without-jsx.html).

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Bir `element`'i kullanarak yeni bir React elemanı klonla ve döndür. Elde edilen eleman, orjinal elemanın prop'larına yeni prop'ları ile yüzeysel olarak birleştirilmiş bir biçimde sahip olacaktır. Yeni alt eleman varolan alt elemanın yerine geçecektir. Orjinal elemandan gelen `key` ve `ref` korunacaktır.

`React.cloneElement()` neredeyse şuna eşdeğerdir:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Ancak, aynı zamanda `ref`'leri de korur. Bu, üzerinde `ref` bulunan bir alt eleman alırsanız, ona üst eleman üzerinden ulaşamayacağınız anlamına gelir. Yeni elemanınız üzerinde aynı `ref` bağlı olarak gelecektir.

Bu API kullanımdan kaldırılan `React.addons.cloneWithProps()` işlevinin yerine geçmiştir.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Return a function that produces React elements of a given type. Like [`React.createElement()`](#createElement), the type argument can be either a tag name string (such as `'div'` or `'span'`), a [React component](/docs/components-and-props.html) type (a class or a function), or a [React fragment](#reactfragment) type.

This helper is considered legacy, and we encourage you to either use JSX or use `React.createElement()` directly instead.

You will not typically invoke `React.createFactory()` directly if you are using JSX. See [React Without JSX](/docs/react-without-jsx.html) to learn more.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Verifies the object is a React element. Returns `true` or `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` provides utilities for dealing with the `this.props.children` opaque data structure.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Invokes a function on every immediate child contained within `children` with `this` set to `thisArg`. If `children` is an array it will be traversed and the function will be called for each child in the array. If children is `null` or `undefined`, this method will return `null` or `undefined` rather than an array.

> Note
>
> If `children` is a `Fragment` it will be treated as a single child and not traversed.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Like [`React.Children.map()`](#reactchildrenmap) but does not return an array.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Returns the total number of components in `children`, equal to the number of times that a callback passed to `map` or `forEach` would be invoked.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Verifies that `children` has only one child (a React element) and returns it. Otherwise this method throws an error.

> Note:
>
>`React.Children.only()` does not accept the return value of [`React.Children.map()`](#reactchildrenmap) because it is an array rather than a React element.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Returns the `children` opaque data structure as a flat array with keys assigned to each child. Useful if you want to manipulate collections of children in your render methods, especially if you want to reorder or slice `this.props.children` before passing it down.

> Note:
>
> `React.Children.toArray()` changes keys to preserve the semantics of nested arrays when flattening lists of children. That is, `toArray` prefixes each key in the returned array so that each element's key is scoped to the input array containing it.

* * *

### `React.Fragment` {#reactfragment}

The `React.Fragment` component lets you return multiple elements in a `render()` method without creating an additional DOM element:

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

You can also use it with the shorthand `<></>` syntax. For more information, see [React v16.2.0: Improved Support for Fragments](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

`React.createRef` creates a [ref](/docs/refs-and-the-dom.html) that can be attached to React elements via the ref attribute.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` creates a React component that forwards the [ref](/docs/refs-and-the-dom.html) attribute it receives to another component below in the tree. This technique is not very common but is particularly useful in two scenarios:

* [Forwarding refs to DOM components](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Forwarding refs in higher-order-components](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` accepts a rendering function as an argument. React will call this function with `props` and `ref` as two arguments. This function should return a React node.

`embed:reference-react-forward-ref.js`

In the above example, React passes a `ref` given to `<FancyButton ref={ref}>` element as a second argument to the rendering function inside the `React.forwardRef` call. This rendering function passes the `ref` to the `<button ref={ref}>` element.

As a result, after React attaches the ref, `ref.current` will point directly to the `<button>` DOM element instance.

For more information, see [forwarding refs](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` lets you define a component that is loaded dynamically. This helps reduce the bundle size to delay loading components that aren't used during the initial render.

You can learn how to use it from our [code splitting documentation](/docs/code-splitting.html#reactlazy). You might also want to check out [this article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) explaining how to use it in more detail.

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Note that rendering `lazy` components requires that there's a `<React.Suspense>` component higher in the rendering tree. This is how you specify a loading indicator.

> **Note**
>
> Using `React.lazy`with dynamic import requires Promises to be available in the JS environment. This requires a polyfill on IE11 and below.

### `React.Suspense` {#reactsuspense}

`React.Suspense` let you specify the loading indicator in case some components in the tree below it are not yet ready to render. Today, lazy loading components is the **only** use case supported by `<React.Suspense>`:

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

It is documented in our [code splitting guide](/docs/code-splitting.html#reactlazy). Note that `lazy` components can be deep inside the `Suspense` tree -- it doesn't have to wrap every one of them. The best practice is to place `<Suspense>` where you want to see a loading indicator, but to use `lazy()` wherever you want to do code splitting.

While this is not supported today, in the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](/blog/2018/11/27/react-16-roadmap.html).

>Note:
>
>`React.lazy()` and `<React.Suspense>` are not yet supported by `ReactDOMServer`. This is a known limitation that will be resolved in the future.
