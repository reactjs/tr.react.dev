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

> Not:
>
> `React.PureComponent`'in `shouldComponentUpdate()` metodu nesneleri sadece yüzeysel olarak karşılaştırır. Eğer bunlar karmaşık veri yapıları içeriyorsa, daha derin farklılıklar için yanlış sonuçlar üretebilir. `PureComponent`'i yalnızca prop'lar ve state'in basit olmasını beklediğiniz durumlarda uzatın, veya derin veri yapılarının değiştiğini biliyorsanız [`forceUpdate()`](/docs/react-component.html#forceupdate) işlevini kullanın. Ya da, iç içe geçmiş verilerin hızlı bir şekilde karşılaştırılmasını kolaylaştırmak için [değişmez nesneler](https://facebook.github.io/immutable-js/) kullanmayı düşünebilirsiniz.
>
> Ayrıca, `React.PureComponent`'in `shouldComponentUpdate()` metodu tüm bileşen alt ağacı için prop güncellemelerini atlar. Tüm alt bileşenlerinin de "pure" olduğundan emin olun.

* * *

### `React.memo` {#reactmemo}

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

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Bir `element`'i kullanarak yeni bir React elemanı klonlayın ve döndürün. Elde edilen eleman, orjinal elemanın prop'larına yeni prop'ları ile yüzeysel olarak birleştirilmiş bir biçimde sahip olacaktır. Yeni alt eleman varolan alt elemanın yerine geçecektir. Orjinal elemandan gelen `key` ve `ref` korunacaktır.

`React.cloneElement()` neredeyse şuna eşdeğerdir:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Ancak, aynı zamanda `ref`'leri de korur. Bu, üzerinde `ref` bulunan bir alt eleman alırsanız, ona üst eleman üzerinden ulaşamayacağınız anlamına gelir. Yeni elemanınız üzerinde aynı `ref` bağlı olarak gelecektir.

Bu API, kullanımdan kaldırılan `React.addons.cloneWithProps()` işlevinin yerine geçmiştir.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Belirli bir türden React elemanlarını üreten bir fonksiyon döndürür. [`React.createElement()`](#createelement) gibi, type argümanı bir etiket ismi string'i (`'div'` veya `'span'` gibi), bir [React bileşen](/docs/components-and-props.html) tipi (bir sınıf yada fonksiyon), veya bir [React fragment](#reactfragment) tipi olabilir.

Bu yardımcı işlev eski kabul edilir, ve bunun yerine ya doğrudan JSX kullanmanız ya da `React.createElement()` kullanmanız önerilir.

JSX kullanıyorsanız genellikle `React.createFactory()` işlevini doğrudan çağırmazsınız. Daha fazla bilgi için bkz. [JSX Olmadan React](/docs/react-without-jsx.html).

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Nesnenin bir React öğesi olduğunu doğrular. `true` veya `false` döndürür.

* * *

### `React.Children` {#reactchildren}

`React.Children` belirsiz veri yapısına sahip `this.props.children` ile ilgilenmek için yardımcı işlevler sağlar.

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

`React.Fragment` bileşeni, ek bir DOM öğesi oluşturmadan `render()` metodu içinde bir çok eleman döndürmenizi sağlar:

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

`React.createRef` ref özelliği ile React elemanlarına eklenebilecek bir [ref](/docs/refs-and-the-dom.html) oluşturur.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` aldığı [ref](/docs/refs-and-the-dom.html) özelliğini ağacın altında bulunan bir diğer bileşene ileten bir React bileşeni oluşturur. Bu teknik çok yaygın değildir, ancak iki durumda özellikle faydalıdır:

* [Ref'leri DOM bileşenlerine iletme](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Üst katman bileşenlerinde ref iletimi](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` bir render etme fonksiyonunu argüman olarak kabul eder. React bu fonksiyonu `props` ve `ref` olmak üzere iki argüman ile çağıracaktır. Bu fonksiyon geçerli bir React birimi döndürmelidir.

`embed:reference-react-forward-ref.js`

Yukarıdaki örnekte, React `React.forwardRef` çağrısının içindeki render etme fonksiyonuna ikinci bir argüman olarak `<FancyButton ref={ref}>` elementine verilen bir `ref` değerini iletir. Bu render etme fonksiyonu `ref`'i `<button ref={ref}>` elementine geçer.

Sonuç olarak, React ref'i ekledikten sonra, `ref.current` doğrudan `<button>` DOM öğesinin örneğine işaret edecektir.

Daha fazla bilgi için, bkz. [ref iletimi](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` dinamik olarak yüklenen bir bileşeni tanımlamanıza izin verir. Bu, ilk render etme sırasında kullanılmayan bileşenlerin yüklemesini geciktirerek paket boyutunu azaltmaya yardımcı olur.

Nasıl kullanılacağını [kod bölümleme dökümanımızdan](/docs/code-splitting.html#reactlazy) öğrenebilirsiniz. Daha ayrıntılı olarak nasıl kullanılacağını açıklayan [bu makaleye](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) de göz atmak isteyebilirsiniz.

```js
// Bu bileşen dinamik olarak yüklenir
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

`lazy` bileşenlerin render edilmesi için render ağacında daha yukarıda bulunan bir `<React.Suspense>` bileşeninin olması gerektiğini unutmayın. Bir yükleme göstergesini bu şekilde belirlersiniz.

> **Not:**
>
> `React.lazy`'i dinamik içe aktarma ile kullanmak JS ortamında Promise'lerin kullanılabilir olmasını gerektirir. Bu, IE11 (Internet Explorer 11) ve aşağısı için bir polyfill gerektirir.

### `React.Suspense` {#reactsuspense}

`React.Suspense`, altındaki ağaçta bulunan bazı bileşenlerin henüz render edilmeye hazır olmaması durumunda yükleme göstergesini belirtmenizi sağlar. Günümüzde, tembel (`lazy`) yüklenen bileşenler `<React.Suspense>` tarafından desteklenen **tek** kullanım durumudur:

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

Bu bugün desteklenmiyor olsa da, gelecekte `Suspense`'in veri toplama gibi daha fazla durum ile ilgilenmesine izin vermeyi planlıyoruz. Bu konuyu [yol haritamızda](/blog/2018/11/27/react-16-roadmap.html) okuyabilirsiniz.

>Not:
>
>`React.lazy()` ve `<React.Suspense>` henüz `ReactDOMServer` tarafından desteklenmiyor. Bu, gelecekte çözülecek olan bilinen bir sınırlamadır.
