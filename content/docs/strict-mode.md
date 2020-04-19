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

Yukarıdaki örnekte strict yöntem kontrolleri `Header` ve `Footer` bileşenleri için *yapılmayacaktır*. Ancak `ComponentOne` ve `ComponentTwo` ve onların tüm alt öğeleri için kontroller yapılacaktır.

`Strict Yöntemi` şu konularda yardımcı olur:
* [Güvenli olmayan yaşam döngülerine sahip bileşenleri tespit etme](#identifying-unsafe-lifecycles)
* [Eski string ref API kullanımı hakkında uyarma](#warning-about-legacy-string-ref-api-usage)
* [Kullanımdan kaldırılmış findDOMNode kullanımı hakkında uyarma](#warning-about-deprecated-finddomnode-usage)
* [Beklenmeyen yan etkileri tespit etme](#detecting-unexpected-side-effects)
* [Eski context API tespit etme](#detecting-legacy-context-api)

React'in gelecek sürümlerinde yeni özellikler eklenecektir.

### Güvenli olmayan yaşam döngülerine sahip bileşenleri tespit etme {#identifying-unsafe-lifecycles}

[Bu blog yazısında](/blog/2018/03/27/update-on-async-rendering.html) açıklandığı gibi, bazı eski yaşam döngüsü metodlarını asenkron React uygulamalarında kullanmak güvenli değildir. Ancak uygulamanız üçüncü parti kütüphaneler kullanıyorsa bu yaşam döngüsü metodlarının kullanılmadığından emin olmak oldukça zordur. Neyse ki, Strict Yöntemi bize bu konuda yardımcı olabilir!

Strict yöntemi etkinleştirildiğinde, React güvenli olmayan yaşam döngüsü kullanan sınıf bileşenlerinin bir listesini toplar ve bu bileşenler hakkında aşağıdaki gibi bir uyarı verir.

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Strict yöntemi sorunlarına çözüm bulmak, gelecekte React sürümlerinde eşzamanlı render etme işleminden yararlanmanızı kolaylaştıracaktır.

### Eski string ref API kullanımı hakkında uyarma {#warning-about-legacy-string-ref-api-usage}

React, daha önce ref'leri yönetmek için iki yol sunuyordu: Eski string ref API ve callback API. String Ref API daha uygun olmasına rağmen [birkaç dezavantajı](https://github.com/facebook/react/issues/1373) vardı ve resmi önerimiz [bunun yerine callback kullanmaktı](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3, herhangi bir dezavantajı olmadan string ref'in rahatlığını sunan üçüncü bir seçenek getirdi:
`embed:16-3-release-blog-post/create-ref-example.js`

Nesne ref'leri büyük ölçüde string ref'lerinin yerine geldiğinden beri strict yöntemi artık string ref kullanımları konusunda uyarıyor.

> **Not:**
>
> Yeni `createRef` API'sine ek olarak Callback ref'leri de desteklenmeye devam edecektir.
>
> Bileşenlerinizdeki callback ref'leri değiştirmeniz gerekmez. Biraz daha esnek bir yapıda oldukları için gelişmiş bir özellik olarak kalacaklar.

[Yeni `createRef` API hakkında daha fazla bilgiyi buradan öğrenebilirsiniz.](/docs/refs-and-the-dom.html)

### Kullanımdan kaldırılmış findDOMNode kullanımı hakkında uyarma {#warning-about-deprecated-finddomnode-usage}

React, sınıf nesne örneği verilen bir DOM düğümünü ağaçta aramak için `findDOMNode`'u destekliyordu. Normalde buna ihtiyaç yoktur çünkü [doğrudan bir DOM düğümüne ref ekleyebilirsiniz](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` ayrıca sınıf bileşenlerinde de kullanılabilir ancak bu, bir ebeveynin belirli alt öğelerin render edilmesine izin vererek soyutlama düzeylerini kırıyordu. Bir üst öğe DOM düğümüne erişebileceği için bir bileşenin uygulama ayrıntılarını değiştiremeyeceğiniz bir kodun yeniden düzenlenmesi (refactoring) tehlikesi oluşturur. `findDOMNode` sadece ilk alt öğeyi döndürür fakat Fragment'ler kullanılarak bir bileşenin birden fazla alt öğe render etmesi mümkündür. `findDOMNode` tek seferlik okuma API'sidir. Sadece istendiğinde cevap verir. Bir alt bileşen farklı bir farklı bir düğüm render ediyorsa, bu değişikliği ele almanın bir yolu yoktur. Bu nedenle `findDOMNode` sadece bileşenler asla değişmeyen tek bir DOM düğümü döndürürse işe yarar.

Bunun yerine, bunu özel bileşeninize bir ref geçerek ve [ref yönlendirme](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) ile DOM boyunca ileterek yapabilirsiniz.

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

### Beklenmeyen yan etkileri tespit etme {#detecting-unexpected-side-effects}

Kavramsal olarak, React iki aşamada çalışır:
* **Render** aşaması, örneğin DOM'da hangi değişikliklerin yapılması gerektiğini belirler. Bu aşamada React, render'ı çağırır ve sonucu bir önceki render çağrısının sonucuyla karşılaştırır. 
* **Commit** aşaması, React'ın değişiklikleri uyguladığı aşamadır. React DOM durumunda, React bu DOM düğümlerini ekler, günceller ve kaldırır. React ayrıca bu aşamada `componentDidMount` ve `componentDidUpdate` gibi yaşam döngülerini çağırır.

Commit aşaması genellikle hızlıdır fakat render aşaması yavaş olabilir. Bu nedenle, yakında gelecek eşzamanlı (concurrent) yöntem (henüz varsayılan olarak etkin değil) render etme işini parçalara ayırır, tarayıcıyı engellememek için işi duraklatır ve devam ettirir. Bu, React'ın render aşaması yaşam döngülerini commit aşamasına hiç geçmeden (bir hata veya daha yüksek öncelikli kesinti nedeniyle) çağırabileceği ya da commit aşamasından önce bir kereden fazla çağırabileceği anlamına gelir. 

Render aşaması yaşam döngüleri aşağıdaki sınıf bileşeni metodlarını içerir:
* `constructor`
* `componentWillMount` (veya `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (veya `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (veya `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` güncelleyen fonksiyonlar (ilk argüman)

Yukarıdaki metodlar bir kereden fazla çağrılabileceğinden, yan etkiler içermemesi önemlidir. Bu kuralı göz ardı etmek, bellek sızıntıları (memory leak) ve geçersiz uygulama durumu (invalid application state) gibi çeşitli sorunlara yol açabilir. Ne yazık ki bu sorunları tespit etmek zor olabilir çünkü genellikle [belirlenebilir olmayabilirler](https://en.wikipedia.org/wiki/Deterministic_algorithm).

Strict yöntemi, yan etkileri otomatik olarak tespit edemez ancak onları daha belirgin hale getirerek tespit etmenize yardımcı olabilir. Bu, aşağıdaki fonksiyonları bilinçli bir şekilde iki kere çağırarak (double-invoking) yapılır:

* Sınıf bileşeni `constructor`, `render`, ve `shouldComponentUpdate` metodları
* Sınıf bileşeni statik `getDerivedStateFromProps` metodu
* Fonksiyon bileşen gövdeleri
* State güncelleyen fonksiyonlar (`setState`in ilk argümanı)
* `useState`, `useMemo`, veya `useReducer`'a aktarılan fonksiyonlar

> Not:
>
> Bu sadece geliştirme modu için geçerlidir. _Yaşam döngüleri canlıda iki defa çağırılmayacaktır._

Örneğin, aşağıdaki kodu ele alalım:
`embed:strict-mode/side-effects-in-constructor.js`

İlk bakışta bu kod sorunlu görünmeyebilir. Ancak `SharedApplicationState.recordEvent` [etkisiz](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning) değilse, bu bileşeni birden çok kez başlatmak geçersiz uygulama durumuna yol açabilir. Bu tür ince bir hata geliştirme sırasında ortaya çıkmayabilir veya bunu tutarsız bir şekilde yaparak gözden kaçabilir.

Strict yöntemi, `constructor` gibi metodları kasıtlı olarak iki kere çağırarak, bu gibi desenlerin fark edilmesini sağlar.

### Eski context API tespit etme {#detecting-legacy-context-api}

Eski context API hataya açıktır ve gelecekteki bir ana sürümde kaldırılacaktır. Hala tüm 16.x sürümleri için çalışır, ancak strict yönteminde şu uyarı mesajını gösterecektir:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Yeni sürüme geçmeye yardımcı olması için [yeni context API](/docs/context.html) dökümanını okuyun.