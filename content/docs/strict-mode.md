---
id: strict-mode
title: Strict Yöntemi
permalink: docs/strict-mode.html
---

`Strict Yöntemi` (StrictMode) uygulamadaki potansiyel sorunları vurgulayan bir araçtır. `Fragment` gibi `Strict Yöntemi` de herhangi bir görünür UI render etmez. `Strict Yöntemi` aynı zamanda alt öğeler için ek kontrol ve uyarıları etkinleştirir.

> Not:
>
> Strict Yöntem kontrolleri sadece geliştirme modunda yapılır.; _canlıda herhangi bir etkisi yoktur_.

Strict yöntemini uygulamanızın herhangi bir parçası için aktif hale getirebilirsiniz. Örneğin:
`embed:strict-mode/enabling-strict-mode.js`

Yukarıdaki örnekte strict yöntem kontrolleri `Header` ve `Footer` bileşenleri için yapılmayacaktır. Ancak `ComponentOne` ve `ComponentTwo` ve onların tüm alt öğeleri için kontroller yapılacaktır.

`Strict Yöntemi` bize şu konularda yardımcı olur:
* [Güvenli olmayan yaşam döngülerine sahip bileşenleri tespit etme](#identifying-unsafe-lifecycles)
* [Eski string ref API kullanımı hakkında uyarma](#warning-about-legacy-string-ref-api-usage)
* [Kullanımdan kaldırılmış findDOMNode kullanımı hakkında uyarma](#warning-about-deprecated-finddomnode-usage)
* [Beklenmeyen yan etkileri tespit etme](#detecting-unexpected-side-effects)
* [Eski context API tespit etme](#detecting-legacy-context-api)

React'in gelecek sürümlerinde yeni özellikler eklenecektir.

### Güvenli olmayan yaşam döngülerine sahip bileşenleri tespit etme {#identifying-unsafe-lifecycles}

[Bu blog yazısında](/blog/2018/03/27/update-on-async-rendering.html) açıklandığı gibi, bazı eski yaşam döngüsü metodlarıni asenkron React uygulamalarında kullanmak güvenli değildir. applications. Ancak uygulamanız üçüncü parti kütüphaneler kullanıyorsa bu yaşam döngüsü metodlarının kullanılmadığından emin olmak oldukça zordur. Neyse ki, Strict Yöntemi bize bu konuda yardımcı olabilir!

Strict yöntemi etkinleştirildiğinde, React güvenli olmayan yaşam döngüsü kullanan sınıf bileşenlerinin bir listesini toplar ve bu bileşenler hakkında aşağıdaki gibi bir uyarı verir.

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Strict yöntemi sorunlarına çözüm bulmak, gelecekte React sürümlerinde eşzamanlı render etme işleminden yararlanmanızı kolaylaştıracaktır.

### Eski string ref API kullanımı hakkında uyarma {#warning-about-legacy-string-ref-api-usage}

React, daha önce ref'leri yönetmek için iki yol sunuyordu: Eski string ref API ve callback API. String Ref API daha uygun olmasına rağmen [birkaç dezavantajı](https://github.com/facebook/react/issues/1373) vardı ve resmi önerimiz [bunun yerine callback kullanmaktı](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3, herhangi bir dezavantajı olmadan string ref'in rahatlığını sunan üçüncü bir seçenek getirdi:
`embed:16-3-release-blog-post/create-ref-example.js`

Nesne ref'leri büyük ölçüde string ref'lerinin yerine geldiğinden beri Strict yöntemi artık string ref kullanımları konusunda uyarıyor.

> **Not:**
>
> Yeni `createRef` API'sine ek olarak Callback ref'leri de desteklenmeye devam edecektir.
>
> Bileşenlerinizdeki callback ref'leri değiştirmeniz gerekmez. Biraz daha esnek bir yapıda oldukları için gelişmiş bir özellik olarak kalacaklar.

[Yeni `createRef` API hakkında daha fazla bilgiyi buradan öğrenebilirsiniz.](/docs/refs-and-the-dom.html)

### Kullanımdan kaldırılmış findDOMNode kullanımı hakkında uyarma {#warning-about-deprecated-finddomnode-usage}

React, sınıf nesne örneği verilen bir DOM düğümünü ağaçta aramak için `findDOMNode`'u destekliyordu. Normalde buna ihtiyaç yoktur çünkü [doğrudan bir DOM düğümüne ref ekleyebilirsiniz](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` ayrıca sınıf bileşenlerinde de kullanılabilir ancak bu, bir ebeveynin belirli alt öğelerin render edilmesine izin vererek soyutlama düzeylerini kırıyordu. Bir üst öğe DOM düğümüne erişebileceği için bir bileşenin uygulama ayrıntılarını değiştiremeyeceğiniz bir kodun yeniden düzenlenmesi (refactoring) tehlikesi oluşturur. `findDOMNode` sadece ilk alt öğeyi döndürür fakat Fragment'ler kullanılarak bir bileşenin birden fazla alt öğe render etmesi mümkündür. `findDOMNode` tek seferlik okuma API'sidir. Sadece istendiğinde cevap verir. Bir alt bileşen farklı bir farklı bir düğüm render ediyorsa, bu değişikliği ele almanın bir yolu yoktur. Bu nedenle `findDOMNode` sadece bileşenler asla değişmeyen tek bir DOM düğümü döndürürse işe yarar.


Bunun yerine, bunu özel bileşeninize bir ref geçerek ve [ref yönlendirme](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) ile DOM boyunca ileterek açıkça yapabilirsiniz.

Ayrıca bileşeninize bir sarıcı (wrapper) DOM düğümü ekleyebilir ve doğrudan ona bir ref ekleyebilirsiniz.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Not:
>
> CSS'te, düğümün tasarımın bir parçası olmasını istemiyorsanız [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) özelliğini kullanabilirsiniz.

### Detecting unexpected side effects {#detecting-unexpected-side-effects}

Conceptually, React does work in two phases:
* The **render** phase determines what changes need to be made to e.g. the DOM. During this phase, React calls `render` and then compares the result to the previous render.
* The **commit** phase is when React applies any changes. (In the case of React DOM, this is when React inserts, updates, and removes DOM nodes.) React also calls lifecycles like `componentDidMount` and `componentDidUpdate` during this phase.

The commit phase is usually very fast, but rendering can be slow. For this reason, the upcoming concurrent mode (which is not enabled by default yet) breaks the rendering work into pieces, pausing and resuming the work to avoid blocking the browser. This means that React may invoke render phase lifecycles more than once before committing, or it may invoke them without committing at all (because of an error or a higher priority interruption).

Render phase lifecycles include the following class component methods:
* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` updater functions (the first argument)

Because the above methods might be called more than once, it's important that they do not contain side-effects. Ignoring this rule can lead to a variety of problems, including memory leaks and invalid application state. Unfortunately, it can be difficult to detect these problems as they can often be [non-deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm).

Strict mode can't automatically detect side effects for you, but it can help you spot them by making them a little more deterministic. This is done by intentionally double-invoking the following functions:

* Class component `constructor`, `render`, and `shouldComponentUpdate` methods
* Class component static `getDerivedStateFromProps` method
* Function component bodies
* State updater functions (the first argument to `setState`)
* Functions passed to `useState`, `useMemo`, or `useReducer`

> Note:
>
> This only applies to development mode. _Lifecycles will not be double-invoked in production mode._

For example, consider the following code:
`embed:strict-mode/side-effects-in-constructor.js`

At first glance, this code might not seem problematic. But if `SharedApplicationState.recordEvent` is not [idempotent](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), then instantiating this component multiple times could lead to invalid application state. This sort of subtle bug might not manifest during development, or it might do so inconsistently and so be overlooked.

By intentionally double-invoking methods like the component constructor, strict mode makes patterns like this easier to spot.

### Detecting legacy context API {#detecting-legacy-context-api}

The legacy context API is error-prone, and will be removed in a future major version. It still works for all 16.x releases but will show this warning message in strict mode:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Read the [new context API documentation](/docs/context.html) to help migrate to the new version.
