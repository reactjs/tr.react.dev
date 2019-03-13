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

## [Yaşam Döngüsü Metotları](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Lifecycle methods are custom functionality that gets executed during the different phases of a component. There are methods available when the component gets created and inserted into the DOM ([mounting](/docs/react-component.html#mounting)), when the component updates, and when the component gets unmounted or removed from the DOM.

Yaşam döngüsü metotları, bir bileşenin farklı aşamalarında yürütülen özel fonksiyonelliklerdir.

 ## [Kontrollü](/docs/forms.html#controlled-components) ve [Kontrolsüz Bileşenlerin](/docs/uncontrolled-components.html) Farkları

React, form girdilerini yönetmek için iki farklı yaklaşıma sahiptir.

Değeri React tarafından kontrol edilen bir girdi formu elemanına *kontrollü bileşen* denir. Kullanıcı bir kontrollü bileşene veri girdiğinde bir değişim olay yöneticisi tetiklenir ve kodunuz girdinin geçerli olup olmadığına karar verir (güncellenmiş değerle yeniden render ederek). Eğer yeniden render etmezseniz, form elemanı değişmeden kalacaktır.

An *uncontrolled component* works like form elements do outside of React. When a user inputs data into a form field (an input box, dropdown, etc) the updated information is reflected without React needing to do anything. However, this also means that you can't force the field to have a certain value.

Çoğu durumda kontrollü bileşenler kullanmalısınız.

## [Anahtarlar](/docs/lists-and-keys.html) {#keys}

Bir "anahtar", eleman dizileri oluştururken eklemeniz gereken özel bir string özelliğidir. Anahtarlar, React'in hangi öğelerin değiştiğini, eklendiğini veya kaldırıldığını belirlemesine yardımcı olur. Elemanlara stabil bir kimlik kazandırmak için bir dizideki elemanlara anahtarlar verilmelidir.

Anahtarların yalnızca aynı dizideki kardeş elemanlar arasında benzersiz olması gerekir. Tüm uygulama boyunca veya hatta tek bir bileşende bile benzersiz olmaları gerekmez.

`Math.random()` gibi şeyleri anahtarlara iletmeyin. Anahtarların yeniden render ediciler arasında bir "stabil kimliğe" sahip olması önemlidir, böylece React elemanların ne zaman ekleneceğini, kaldırıldığını veya yeniden sıralandığını belirler. İdeal olarak, anahtarlar `post.id` gibi verilerinizden gelen benzersiz ve stabil tanımlayıcılara karşılık gelmelidir.

## [Ref'ler](/docs/refs-and-the-dom.html) {#refs}

React herhangi bir bileşene ekleyebileceğiniz özel bir özelliği destekler. `ref` özelliği, [`React.createRef()` fonksiyonu](/docs/react-api.html#reactcreateref), callback fonksiyonu veya bir string (eski API'da) tarafından oluşturulan bir nesne olabilir. 
`ref` özelliği bir callback fonksiyonu olduğunda, fonksiyon temel DOM öğesini veya sınıf nesnesine (elemanın türüne bağlı olarak) argümanı olarak alır. Bu, DOM elemanına veya bileşen nesnesine doğrudan erişmenize izin verir.

Ref'leri tutumlu bir şekilde kullanın. Eğer kendinizi uygulamanızda sürekli "bir şeyleri gerçekleştirmek" için ref kullanırken buluyorsanız, [yukarıdan aşağı veri akışı](/docs/lifting-state-up.html) ile daha aşina olmayı düşünün.

## [Olaylar](/docs/handling-events.html) {#events}

Olayları React elemanlarıyla yönetme, söz dizimsel bazı farklılıklara sahiptir:

* React olay yöneticileri, küçük harf yerine camelCase kullanılarak adlandırılır.
* JSX ile bir fonksiyonu string yerine olay yöneticisi olarak iletirsiniz.

## [Uyumlaştırma](/docs/reconciliation.html) {#reconciliation}

Bir bileşenin prop'ları veya state'i değiştiğinde, React yeni döndürülen elemanı önceden oluşturulmuş olanla karşılaştırarak gerçek bir DOM güncellemesi gerekip gerekmediğine karar verir. Eşit olmadıklarında, React DOM'ı günceller. Bu sürece "uyumlaştırma" denir.