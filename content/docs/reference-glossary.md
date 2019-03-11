---
id: glossary
title: React Terimleri Sözlüğü
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Tek-sayfalı Uygulama {#single-page-application}

Tek-sayfalı uygulama, uygulamanın çalışması için gereken tek bir HTML sayfasını ve gerekli tüm varlıkları (JavaScript ve CSS gibi) yükleyen bir uygulamadır. Sayfa veya sonraki sayfalar ile ilgili herhangi bir etkileşim sunucuya gidip gelmeye ihtiyaç duymaz, bu da sayfanın yeniden yüklenmediği anlamına gelir.

React'te bir tek-sayfalı uygulama oluşturabilseniz de, bu bir gereksinim değildir. React ayrıca, mevcut web sitelerinin küçük parçalarını ilave etkileşim ile geliştirmek için de kullanılabilir. React'te yazılan kod, sunucuda PHP gibi bir şey tarafından oluşturulan işaretlemeyle veya diğer istemci tarafı kitaplıklarıyla barışçıl bir şekilde bir arada bulunabilir. Aslında, bu tam olarak React’in Facebook’ta kullanım şeklidir.

## ES6, ES2015, ES2016, vs. {#es6-es2015-es2016-etc}

Bu kısaltmaların tümü, ECMAScript Dil Belirtimi standardının (JavaScript dilinin bir uygulaması) en yeni sürümlerine atıfta bulunur. ES6 sürümü (ES2015 olarak da bilinir) önceki sürümlere birçok ek içerir: ok işlevleri, sınıflar, hazır bilgi şablonları, `let` ve` const` ifadeleri. [Buradan](https://en.wikipedia.org/wiki/ECMAScript#Versions) spesifik versiyonlar hakkında daha fazla şey öğrenebilirsiniz.

## Derleyiciler {#compilers}

Bir JavaScript derleyicisi JavaScript kodunu alır, dönüştürür ve JavaScript kodunu farklı bir formatta döner. En yaygın kullanım durumu, ES6 sözdizimini alıp, eski tarayıcıların yorumlayabildiği sözdizimine dönüştürmektir. [Babel](https://babeljs.io/) React ile en sık kullanılan derleyicidir.

## Paketleyiciler {#bundlers}

Paketleyiciler ayrı modüller (genellikle yüzlerce) olarak yazılmış JavaScript ve CSS kodlarını alır ve bunları tarayıcılar için daha iyi optimize edilmiş birkaç dosyada birleştirir. React uygulamalarında yaygın olarak kullanılan bazı paketleyiciler arasında [Webpack](https://webpack.js.org/) ve [Browserify](http://browserify.org/) bulunur.

## Paket Yöneticileri {#package-managers}

Paket yöneticileri, projenizdeki bağımlılıkları yönetmenize olanak sağlayan araçlardır. [npm](https://www.npmjs.com/) ve [Yarn](https://yarnpkg.com/) React uygulamalarında yaygın olarak kullanılan iki paket yöneticisidir. Her ikisi de aynı npm paket kayıt defteri için istemcilerdir.

## CDN {#cdn}

CDN, İçerik Dağıtım Ağı anlamına gelir. CDN'ler, dünya genelinde bir sunucu ağından önbelleğe alınmış statik içerik sağlar.

## JSX {#jsx}

JSX, JavaScript için bir sözdizimi uzantısıdır. Bir şablon diline benzer ancak JavaScript'in tam gücüne sahiptir. JSX, "React elemanları" olarak adlandırılan düz JavaScript nesnelerini döndüren `React.createElement ()` çağrıları için derlenir. JSX'e temel bir giriş yapmak için [buradaki belgelere bakın](/docs/introducing-jsx.html) ve JSX hakkında daha ayrıntılı eğitimlere [buradan](/docs/jsx-in-depth.html) ulaşın.

React DOM, HTML özellik adları yerine camelCase özellik adlandırma kuralını kullanır. Örneğin, JSX'te `tabindex` `tabIndex` olur. `class` özelliği de JavaScript'e özel bir sözcük olduğu için 'className` olarak yazılır:

```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">My name is {name}!</h1>,
  document.getElementById('root')
);
```  

## [Elemanlar](/docs/rendering-elements.html) {#elements}

React elemanları React uygulamalarının yapı taşlarıdır. Biri, öğeleri daha yaygın olarak bilinen "bileşenler" kavramı ile karıştırabilir. Bir eleman ekranda görmek istediğinizi açıklar. React elemanları değişmezdir.

```js
const element = <h1>Hello, world</h1>;
```

Genellikle, elemanlar doğrudan kullanılmaz, ancak bileşenlerden döndürülür.

## [Components](/docs/components-and-props.html) {#components}

React bileşenleri, sayfaya bir React öğesi döndüren küçük, yeniden kullanılabilir kod parçalarıdır. React bileşeninin en basit sürümü, bir React öğesi dönen düz bir JavaScript fonksiyonudur:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Bileşenler ayrıca ES6 sınıfları olabilir:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Components can be broken down into distinct pieces of functionality and used within other components. Components can return other components, arrays, strings and numbers. A good rule of thumb is that if a part of your UI is used several times (Button, Panel, Avatar), or is complex enough on its own (App, FeedStory, Comment), it is a good candidate to be a reusable component. Component names should also always start with a capital letter (`<Wrapper/>` **not** `<wrapper/>`). See [this documentation](/docs/components-and-props.html#rendering-a-component) for more information on rendering components. 

### [`prop'lar`](/docs/components-and-props.html) {#props}

`props`, bir React bileşenine ait girdilerdir. Ana bileşenden bir alt bileşene aktarılan verilerdir.

'props'ların salt okunur olduklarını unutmayın. Hiçbir şekilde değiştirilmemeleri gerekir:

```js
// Yanlış!
props.number = 42;
```

Kullanıcı girdisine veya bir ağ yanıtına cevap olarak bir değeri değiştirmeniz gerekirse, bunun yerine `state` kullanın.

### `props.children` {#propschildren}

`props.children` her bileşende mevcuttur. Bir bileşenin açılış ve kapanış etiketleri arasındaki içeriği kapsar. Örneğin:

```js
<Welcome>Hello world!</Welcome>
```

"Hello world!" string'i "Welcome" bileşenindeki `props.children`da bulunur:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Sınıf olarak tanımlanan bileşenler için `this.props.children` kullanın:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

A component needs `state` when some data associated with it changes over time. For example, a `Checkbox` component might need `isChecked` in its state, and a `NewsFeed` component might want to keep track of `fetchedPosts` in its state.

The most important difference between `state` and `props` is that `props` are passed from a parent component, but `state` is managed by the component itself. A component cannot change its `props`, but it can change its `state`. To do so, it must call `this.setState()`. Only components defined as classes can have state.

For each particular piece of changing data, there should be just one component that "owns" it in its state. Don't try to synchronize states of two different components. Instead, [lift it up](/docs/lifting-state-up.html) to their closest shared ancestor, and pass it down as props to both of them.

## [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Lifecycle methods are custom functionality that gets executed during the different phases of a component. There are methods available when the component gets created and inserted into the DOM ([mounting](/docs/react-component.html#mounting)), when the component updates, and when the component gets unmounted or removed from the DOM.

 ## [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React has two different approaches to dealing with form inputs. 

An input form element whose value is controlled by React is called a *controlled component*. When a user enters data into a controlled component a change event handler is triggered and your code decides whether the input is valid (by re-rendering with the updated value). If you do not re-render then the form element will remain unchanged.

An *uncontrolled component* works like form elements do outside of React. When a user inputs data into a form field (an input box, dropdown, etc) the updated information is reflected without React needing to do anything. However, this also means that you can't force the field to have a certain value.

In most cases you should use controlled components.

## [Keys](/docs/lists-and-keys.html) {#keys}

A "key" is a special string attribute you need to include when creating arrays of elements. Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside an array to give the elements a stable identity.

Keys only need to be unique among sibling elements in the same array. They don't need to be unique across the whole application or even a single component.

Don't pass something like `Math.random()` to keys. It is important that keys have a "stable identity" across re-renders so that React can determine when items are added, removed, or re-ordered. Ideally, keys should correspond to unique and stable identifiers coming from your data, such as `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React supports a special attribute that you can attach to any component. The `ref` attribute can be an object created by [`React.createRef()` function](/docs/react-api.html#reactcreateref) or a callback function, or a string (in legacy API). When the `ref` attribute is a callback function, the function receives the underlying DOM element or class instance (depending on the type of element) as its argument. This allows you to have direct access to the DOM element or component instance.

Use refs sparingly. If you find yourself often using refs to "make things happen" in your app, consider getting more familiar with [top-down data flow](/docs/lifting-state-up.html).

## [Events](/docs/handling-events.html) {#events}

Handling events with React elements has some syntactic differences:

* React event handlers are named using camelCase, rather than lowercase.
* React olay işleyicileri, küçük harf yerine camelCase kullanılarak adlandırılır.
* With JSX you pass a function as the event handler, rather than a string.
* JSX ile bir dizge yerine olay işleyicisi olarak bir işlev iletirsiniz.

## [Uyumlaştırma](/docs/reconciliation.html) {#reconciliation}

Bir bileşenin prop'ları veya state'i değiştiğinde, React yeni döndürülen elemanı önceden oluşturulmuş olanla karşılaştırarak gerçek bir DOM güncellemesi gerekip gerekmediğine karar verir. Eşit olmadıklarında, React DOM'ı günceller. Bu sürece "uyumlaştırma" denir.