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

React bileşenleri, kullanıcı arabirimini bağımsız, yeniden kullanılabilir parçalara ayırmanıza ve ayrılmış her bir parça hakkında düşünmenize olanak sağlar. React bileşenleri, `React.Component` ya da `React.PureComponent` üzerinden alt sınıflandırma yoluyla tanımlanabilir.

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

Suspense, bileşenlerin render edilmeden önce bir şey için "beklemesini" sağlar. Şu an için, Suspense yalnızca bir kullanım durumunu destekler: [bileşenleri `React.lazy` ile dinamik olarak yükleme](/docs/code-splitting.html#reactlazy). Gelecekte, veri getirme gibi diğer kullanım durumlarını destekleyecektir.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Transitions {#transitions}

*Transitions* are a new concurrent feature introduced in React 18. They allow you to mark updates as transitions, which tells React that they can be interrupted and avoid going back to Suspense fallbacks for already visible content.

- [`React.startTransition`](#starttransition)
- [`React.useTransition`](/docs/hooks-reference.html#usetransition)

### Hook'lar {#hooks}

*Hook'lar*, React 16.8 ile gelen yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar. Hook'lar [özel bir döküman bölümüne](/docs/hooks-intro.html) ve ayrı bir API referansına sahiptir:

- [Temel Hook'lar](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [İlave Hook'lar](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)
  - [`useDeferredValue`](/docs/hooks-reference.html#usedeferredvalue)
  - [`useTransition`](/docs/hooks-reference.html#usetransition)
  - [`useId`](/docs/hooks-reference.html#useid)
- [Library Hooks](/docs/hooks-reference.html#library-hooks)
  - [`useSyncExternalStore`](/docs/hooks-reference.html#usesyncexternalstore)
  - [`useInsertionEffect`](/docs/hooks-reference.html#useinsertioneffect)

* * *

## Referans {#reference}

### `React.Component` {#reactcomponent}

<<<<<<< HEAD
`React.Component`, [ES6 sınıfları](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) kullanılarak tanımlandıklarında React bileşenleri için temel sınıftır:
=======
> Try the new React documentation for [`Component`](https://beta.reactjs.org/reference/react/Component).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.Component` is the base class for React components when they are defined using [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

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

<<<<<<< HEAD
`React.PureComponent` [`React.Component`](#reactcomponent)'e benzer. Aralarındaki fark, [`React.Component`](#reactcomponent)'in [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) metodunu uygulamamasıdır, ancak `React.PureComponent` bunu yüzeysel bir prop ve state karşılaştırması ile birlikte uygular.
=======
> Try the new React documentation for [`PureComponent`](https://beta.reactjs.org/reference/react/PureComponent).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.PureComponent` is similar to [`React.Component`](#reactcomponent). The difference between them is that [`React.Component`](#reactcomponent) doesn't implement [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), but `React.PureComponent` implements it with a shallow prop and state comparison.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

Eğer React bileşeninizin `render()` fonksiyonu aynı prop'lar ve state ile aynı sonucu render ediyor ise, bazı durumlarda performans artışı için `React.PureComponent` kullanabilirsiniz.

> Not:
>
> `React.PureComponent`'in `shouldComponentUpdate()` metodu nesneleri sadece yüzeysel olarak karşılaştırır. Eğer bunlar karmaşık veri yapıları içeriyorsa, daha derin farklılıklar için yanlış sonuçlar üretebilir. `PureComponent`'i yalnızca prop'lar ve state'in basit olmasını beklediğiniz durumlarda uzatın, veya derin veri yapılarının değiştiğini biliyorsanız [`forceUpdate()`](/docs/react-component.html#forceupdate) işlevini kullanın. Ya da, iç içe geçmiş verilerin hızlı bir şekilde karşılaştırılmasını kolaylaştırmak için [değişmez nesneler](https://immutable-js.com/) kullanmayı düşünebilirsiniz.
>
> Ayrıca, `React.PureComponent`'in `shouldComponentUpdate()` metodu tüm bileşen alt ağacı için prop güncellemelerini atlar. Tüm alt bileşenlerinin de "pure" olduğundan emin olun.

* * *

### `React.memo` {#reactmemo}

> Try the new React documentation for [`memo`](https://beta.reactjs.org/reference/react/memo).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* prop'ları kullanarak render et */
});
```

`React.memo` bir [üst katman bileşenidir](/docs/higher-order-components.html).

Eğer fonksiyon bileşeniniz aynı prop'lar ile aynı sonucu render ediyor ise, bazı durumlarda sonucu ezberleyerek performans artışı sağlaması için onu bir `React.memo` çağrısına sarabilirsiniz. Bu, React'in bileşeni render etmeyi atlayacağı ve son render edilen sonucu yeniden kullanacağı anlamına gelir.

`React.memo` sadece prop değişikliklerini kontrol eder. Eğer `React.memo` içine sarmalanmış bileşeninizde [`useState`](/docs/hooks-state.html), [`useReducer`](/docs/hooks-reference.html#usereducer) ya da [`useContext`](/docs/hooks-reference.html#usecontext) hookları varsa, state ya da context her değiştiğinde bilşeniniz tekrar render edilecektir.

Varsayılan olarak, `props` nesnesindeki karmaşık yapıları sadece yüzeysel bir şekilde karşılaştıracaktır. Karşılaştırma üzerinde kontrolü ele almak istiyorsanız, ikinci argüman olarak özel bir karşılaştırma fonksiyonu sağlayabilirsiniz.

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

Bu metod yalnızca bir **[performans optimizasyonu](/docs/optimizing-performance.html)** olarak vardır. Bir render işlemini "önlemek" için ona güvenmeyin. Bu, hatalara neden olabilir.

> Not
>
> Sınıf bileşenlerinde bulunan [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) metodunun aksine, `areEqual` fonksiyonu prop'lar birbirine eşitse `true`, prop'lar birbirine eşit değilse `false` döndürür. Bu `shouldComponentUpdate` işlevinin tersidir.

* * *

### `createElement()` {#createelement}

> Try the new React documentation for [`createElement`](https://beta.reactjs.org/reference/react/createElement).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Verilen tipte yeni bir [React elemanı](/docs/rendering-elements.html) oluşturun ve döndürün. Type argümanı bir etiket ismi string'i (`'div'` veya `'span'` gibi), bir [React bileşen](/docs/components-and-props.html) tipi (bir sınıf ya da fonksiyon), veya bir [React fragment](#reactfragment) tipi olabilir.

[JSX](/docs/introducing-jsx.html) ile yazılmış kod `React.createElement()` işlevini kullanmak üzere dönüştürülecektir. JSX kullanıyorsanız genellikle `React.createElement()` işlevini doğrudan çağırmazsınız. Daha fazla bilgi için bkz. [JSX Olmadan React](/docs/react-without-jsx.html).

* * *

### `cloneElement()` {#cloneelement}

> Try the new React documentation for [`cloneElement`](https://beta.reactjs.org/reference/react/cloneElement).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

Bir `element`'i kullanarak yeni bir React elemanı klonlayın ve döndürün. `config` tüm yeni özellikleri, `key` 'i veya `ref` 'i içermelidir. Elde edilen eleman, orjinal elemanın prop'larına yeni prop'ları ile yüzeysel olarak birleştirilmiş bir biçimde sahip olacaktır. Yeni alt eleman varolan alt elemanın yerine geçecektir. Eğer `config` içinde `key` ve `ref` yoksa, orjinal elemandan gelen `key` ve `ref` korunacaktır.

`React.cloneElement()` neredeyse şuna eşdeğerdir:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Ancak, aynı zamanda `ref`'leri de korur. Bu, üzerinde `ref` bulunan bir alt eleman alırsanız, ona üst eleman üzerinden ulaşamayacağınız anlamına gelir. Yeni elemanınız üzerinde aynı `ref` bağlı olarak gelecektir. Yeni `ref` veya `key`, eğer varsa eskilerin yerini alacaktır.

Bu API, kullanımdan kaldırılan `React.addons.cloneWithProps()` işlevinin yerine geçmiştir.

* * *

### `createFactory()` {#createfactory}

> Try the new React documentation for [`createFactory`](https://beta.reactjs.org/reference/react/createFactory).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
React.createFactory(type)
```

Belirli bir türden React elemanlarını üreten bir fonksiyon döndürür. [`React.createElement()`](#createelement) gibi, type argümanı bir etiket ismi string'i (`'div'` veya `'span'` gibi), bir [React bileşen](/docs/components-and-props.html) tipi (bir sınıf yada fonksiyon), veya bir [React fragment](#reactfragment) tipi olabilir.

Bu yardımcı işlev eski kabul edilir, ve bunun yerine ya doğrudan JSX kullanmanız ya da `React.createElement()` kullanmanız önerilir.

JSX kullanıyorsanız genellikle `React.createFactory()` işlevini doğrudan çağırmazsınız. Daha fazla bilgi için bkz. [JSX Olmadan React](/docs/react-without-jsx.html).

* * *

### `isValidElement()` {#isvalidelement}

> Try the new React documentation for [`isValidElement`](https://beta.reactjs.org/reference/react/isValidElement).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
React.isValidElement(object)
```

Nesnenin bir React öğesi olduğunu doğrular. `true` veya `false` döndürür.

* * *

### `React.Children` {#reactchildren}

<<<<<<< HEAD
`React.Children` belirsiz veri yapısına sahip `this.props.children` ile ilgilenmek için yardımcı işlevler sağlar.
=======
> Try the new React documentation for [`Children`](https://beta.reactjs.org/reference/react/Children).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.Children` provides utilities for dealing with the `this.props.children` opaque data structure.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

`children` içinde yer alan her birincil alt eleman için bir fonksiyon çağırır, `this`'i (kendisini) `thisArg` ile belirleyin. Eğer `children` bir dizi ise taranacak ve dizi içindeki her alt eleman için fonksiyon çağrılacaktır. Eğer alt elemanlar `null` veya `undefined` ise, bu metod bir dizi yerine `null` veya `undefined` döndürür.

> Not:
>
> Eğer `children` bir `Fragment` ise tek bir alt olarak kabul edilir ve tarama yapılmaz.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

[`React.Children.map()`](#reactchildrenmap) gibidir ancak bir dizi döndürmez.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

`children` içinde bulunan toplam bileşen sayısını döndürür, bir callback'in `map` veya `forEach`'e geçtiği sayıya eşit olarak çağrılır.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

`children`'ın yalnızca bir alt elemanı (bir React elemanı) olduğunu doğrular ve döndürür. Aksi halde bu metod bir hata fırlatır.

> Not:
>
>`React.Children.only()`, [`React.Children.map()`](#reactchildrenmap) işlevinin dönüş değerini kabul etmez, çünkü bu bir React elemanından ziyade bir dizidir.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

`children`'ın belirsiz veri yapısını her bir alt elemana atanmış anahtarları olan düz bir dizi olarak döndürür. Render metodlarınızda bulunan alt eleman koleksiyonlarını işlemek istiyorsanız, özellikle de `this.props.children`'ı alta geçmeden önce yeniden düzenlemek veya dilimlemek istiyorsanız kullanışlıdır.

> Not:
>
> `React.Children.toArray()` alt eleman listelerini düzleştirirken iç içe dizilerin anlamını korumak için anahtarları değiştirir. Yani, `toArray` döndürülen dizideki her bir anahtarı öneklendirir, böylece her bir elemanın anahtarı onu içeren veri dizisini kapsar.

* * *

### `React.Fragment` {#reactfragment}

<<<<<<< HEAD
`React.Fragment` bileşeni, ek bir DOM öğesi oluşturmadan `render()` metodu içinde bir çok eleman döndürmenizi sağlar:
=======
> Try the new React documentation for [`Fragment`](https://beta.reactjs.org/reference/react/Fragment).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

The `React.Fragment` component lets you return multiple elements in a `render()` method without creating an additional DOM element:
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

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

Ayrıca `<></>` sözdizimi kısayoluyla da kullanabilirsiniz. Daha fazla bilgi için, bkz. [React v16.2.0: Fragment'ler için Geliştirilmiş Destek](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

<<<<<<< HEAD
`React.createRef` ref özelliği ile React elemanlarına eklenebilecek bir [ref](/docs/refs-and-the-dom.html) oluşturur.
=======
> Try the new React documentation for [`createRef`](https://beta.reactjs.org/reference/react/createRef).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.createRef` creates a [ref](/docs/refs-and-the-dom.html) that can be attached to React elements via the ref attribute.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

<<<<<<< HEAD
`React.forwardRef` aldığı [ref](/docs/refs-and-the-dom.html) özelliğini ağacın altında bulunan bir diğer bileşene ileten bir React bileşeni oluşturur. Bu teknik çok yaygın değildir, ancak iki durumda özellikle faydalıdır:
=======
> Try the new React documentation for [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.forwardRef` creates a React component that forwards the [ref](/docs/refs-and-the-dom.html) attribute it receives to another component below in the tree. This technique is not very common but is particularly useful in two scenarios:
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

* [Ref'leri DOM bileşenlerine iletme](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Üst katman bileşenlerinde ref iletimi](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` bir render etme fonksiyonunu argüman olarak kabul eder. React bu fonksiyonu `props` ve `ref` olmak üzere iki argüman ile çağıracaktır. Bu fonksiyon geçerli bir React birimi döndürmelidir.

`embed:reference-react-forward-ref.js`

Yukarıdaki örnekte, React `React.forwardRef` çağrısının içindeki render etme fonksiyonuna ikinci bir argüman olarak `<FancyButton ref={ref}>` elementine verilen bir `ref` değerini iletir. Bu render etme fonksiyonu `ref`'i `<button ref={ref}>` elementine geçer.

Sonuç olarak, React ref'i ekledikten sonra, `ref.current` doğrudan `<button>` DOM öğesinin örneğine işaret edecektir.

Daha fazla bilgi için, bkz. [ref iletimi](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

<<<<<<< HEAD
`React.lazy()` dinamik olarak yüklenen bir bileşeni tanımlamanıza izin verir. Bu, ilk render etme sırasında kullanılmayan bileşenlerin yüklemesini geciktirerek paket boyutunu azaltmaya yardımcı olur.
=======
> Try the new React documentation for [`lazy`](https://beta.reactjs.org/reference/react/lazy).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.lazy()` lets you define a component that is loaded dynamically. This helps reduce the bundle size to delay loading components that aren't used during the initial render.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

Nasıl kullanılacağını [kod bölümleme dökümanımızdan](/docs/code-splitting.html#reactlazy) öğrenebilirsiniz. Daha ayrıntılı olarak nasıl kullanılacağını açıklayan [bu makaleye](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) de göz atmak isteyebilirsiniz.

```js
// Bu bileşen dinamik olarak yüklenir
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

`lazy` bileşenlerin render edilmesi için render ağacında daha yukarıda bulunan bir `<React.Suspense>` bileşeninin olması gerektiğini unutmayın. Bir yükleme göstergesini bu şekilde belirlersiniz.

### `React.Suspense` {#reactsuspense}

<<<<<<< HEAD
`React.Suspense`, altındaki ağaçta bulunan bazı bileşenlerin henüz render edilmeye hazır olmaması durumunda yükleme göstergesini belirtmenizi sağlar. Gelecekte, veri alma gibi daha fazla senaryoyu `Suspense` 'in işlemesine izin vermeyi planlıyoruz. Bunu [yol haritamızda](/blog/2018/11/27/react-16-roadmap.html) okuyabilirsiniz.
=======
> Try the new React documentation for [`Suspense`](https://beta.reactjs.org/reference/react/Suspense).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

`React.Suspense` lets you specify the loading indicator in case some components in the tree below it are not yet ready to render. In the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](/blog/2018/11/27/react-16-roadmap.html).
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

Günümüzde, tembel (`lazy`) yüklenen bileşenler `<React.Suspense>` tarafından desteklenen **tek** kullanım durumudur:

```js
// Bu bileşen dinamik olarak yüklenir
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // OtherComponent yüklenene kadar <Spinner> öğesini görüntüler
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Bu, [kod bölümleme kılavuzumuzda](/docs/code-splitting.html#reactlazy) anlatılmıştır. `lazy` bileşenlerin `Suspense` ağacının içinde derinlerde olabileceğini unutmayın (her birini sarmak zorunda değildir). En iyi uygulama, bir yükleme göstergesi görmek istediğiniz yerlere `Suspense` koymak, ancak kodu bölmek istediğiniz her yerde `lazy()` kullanmaktır.

> Note
>
> For content that is already shown to the user, switching back to a loading indicator can be disorienting. It is sometimes better to show the "old" UI while the new UI is being prepared. To do this, you can use the new transition APIs [`startTransition`](#starttransition) and [`useTransition`](/docs/hooks-reference.html#usetransition) to mark updates as transitions and avoid unexpected fallbacks.

#### `React.Suspense` in Server Side Rendering {#reactsuspense-in-server-side-rendering}
During server side rendering Suspense Boundaries allow you to flush your application in smaller chunks by suspending.
When a component suspends we schedule a low priority task to render the closest Suspense boundary's fallback. If the component unsuspends before we flush the fallback then we send down the actual content and throw away the fallback.

#### `React.Suspense` during hydration {#reactsuspense-during-hydration}
Suspense boundaries depend on their parent boundaries being hydrated before they can hydrate, but they can hydrate independently from sibling boundaries. Events on a boundary before it is hydrated will cause the boundary to hydrate at a higher priority than neighboring boundaries. [Read more](https://github.com/reactwg/react-18/discussions/130)

### `React.startTransition` {#starttransition}

> Try the new React documentation for [`startTransition`](https://beta.reactjs.org/reference/react/startTransition).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
React.startTransition(callback)
```
`React.startTransition` lets you mark updates inside the provided callback as transitions. This method is designed to be used when [`React.useTransition`](/docs/hooks-reference.html#usetransition) is not available.

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transition will not show a fallback for re-suspended content, allowing the user to continue interacting while rendering the update.
>
> `React.startTransition` does not provide an `isPending` flag. To track the pending status of a transition see [`React.useTransition`](/docs/hooks-reference.html#usetransition).
