---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Bu sayfa, React sınıf bileşenleri hakkında detaylı bir API dokümanı içerir. Bu nedenle, [Bileşenler ve Prop'lar](/docs/components-and-props.html), [State ve Yaşam Döngüsü](/docs/state-and-lifecycle.html) gibi temel React kavramlarına aşina olduğunuzu varsaymaktadır. Eğer değilseniz öncelikle bu dokümanları okuyunuz. 

## Giriş {#overview}

React, sınıf ve fonksiyon bileşenleri oluşturmanıza olanak tanır. Sınıf olarak tanımlanan bileşenler daha fazla özellik sunar. Bu özellikler sayfanın ilerleyen bölümlerinde daha detaylı olarak ele alınacaktır. React bileşen sınıfı oluşturmak için, sınıfınızı `React.Component`'tan türetmeniz gerekir:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

`React.Component`'tan türetilen sınıflarda, *zorunlu* olarak tanımlamanız gereken metot sadece [`render()`](#render)'dır. Bu sayfada tanıtılacak diğer metotlar ise opsiyoneldir. 

**`React.Component` yerine kendi temel sınıflarınızı oluşturmanızı kesinlikle tavsiye etmiyoruz.** Çünkü React bileşenlerinde, kodun tekrar kullanılabilirliği  [kalıtım yoluyla değil, kompozisyon oluşturma ile sağlanır](/docs/composition-vs-inheritance.html).

>Not:
>
>React'te, ES6 sınıfı olarak bileşen tanımlamak zorunda değilsiniz. Eğer ES6 kullanmak istemiyorsanız, npm paketi olarak yer alan [create-react-class](/docs/creact-without-es6.html) modülü veya benzer bir özel soyutlama yöntemi kullanabilirsiniz. 

### Bileşenin Yaşam Döngüsü {#the-component-lifecycle}

Her bileşen, belirli anlarda çalıştırabileceğiniz birkaç "yaşam döngüsü metodu" (lifecycle methods) sunar. **Bu metodları hatırlamak için, [yaşam döngüsü diyagramını](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) kullanabilirsiniz.** Aşağıdaki listede, yaygın olarak kullanılan yaşam döngüsü metodları **kalın** harfler ile belirtilmiştir. Geri kalan metotlar, daha nadir kullanımlar için uygundur.

#### Ekleme {#mounting}

Bir bileşenin oluşumundan ve DOM'a eklenmesine kadar geçen süreç içerisinde çağrılan metotlar, sırasıyla aşağıdaki gibi belirlenmiştir:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Not:
>
>Aşağıdaki metot eski React projelerinde kullanılmaktaydı. Fakat asenkron render etme süreçlerinde problemli olduğundan dolayı artık yeni projelerde [kullanmamanız gerekir](/blog/2018/03/27/update-on-async-rendering.html):
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Güncelleme {#updating}

Bir güncelleme, bileşenin props'u veya state'i değiştirilerek oluşabilir. Bir bileşen tekrar render edildiğinde çağrılan fonksiyonlar sırasıyla aşağıdaki gibidir:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Not:
>
>Aşağıdaki metotlar problemli olduğundan dolayı artık yeni projelerde [kullanmamanız gerekir](/blog/2018/03/27/update-on-async-rendering.html):
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Çıkarılma {#unmounting}

Bir bileşen, DOM'dan çıkarıldığında bu metot çalışır:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Hata Yakalama {#error-handling}

Render esnasında, yaşam döngüsü metodunda veya herhangi bir alt bileşenin constructor'ında bir hata oluştuğunda, aşağıdaki metotlar çağrılır:

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Diğer API'lar {#other-apis}

Bunların haricinde her bileşen bazı API'ları sunar:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Sınıf Özellikleri {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Nesne Özellikleri {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Başvuru Dokümanı {#reference}

### Yaygın Olarak Kullanılan Yaşam Döngüsü Metotları {#commonly-used-lifecycle-methods}

Bu bölümde anlatılacak metotlar, React bileşenleri oluştururken yaygın olarak karşılaşacağınız kullanım senaryolarını içerir. **Görsel bir anlatım için [yaşam döngüsü diyagramını](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) inceleyebilirsiniz.**

### `render()` {#render}

```javascript
render()
```

`render()` metodu, bir sınıf bileşeni için gereken tek metottur.

Çağrıldığında, `this.props` ile `this.state`'i denetler ve aşağıdaki veri tiplerinden birini geri döndürür:

- **React elementleri.** Genellikle [JSX](/docs/introducing-jsx.html) kullanılarak oluşturulurlar. Örneğin, `<div />` ve `<MyComponent />` birer React elementidir. `<div/>`, React'e bir DOM düğümünün render edilmesini bildirir. `<MyComponent/>` ise kullanıcının tanımladığı bir bileşendir.
- **Diziler and fragment'lar.** Render edilecek birden fazla elemanları geri döndürmenizi sağlarlar. Daha fazla bilgi için [fragments](/docs/fragments.html) dokümanını inceleyebilirsiniz.
- **Portal'lar**. Alt bileşenleri, farklı bir DOM alt ağacı olarak render etmeyi sağlarlar. Daha fazla bilgi için [portals](/docs/portals.html) dokümanını inceleyebilirsiniz.
- **String'ler ve sayılar.** DOM içerisinde metin düğümü olarak render edilirler.
- **Boolean'lar ve `null`**. Hiçbir şey render etmezler. (Genellikle `return test && <Child />` tarzındaki kod yapısını desteklemek için vardırlar. Buradaki `test`, bir boolean değişkendir.)

`render()` metodu saf halde olmalıdır. Yani bileşenin state'ini değiştirmemeli, aynı parametrelerle çağrıldığında hep aynı çıktıyı vermeli, ve internet tarayıcısı ile direkt olarak etkileşimde bulunmamalıdırlar.

Eğer tarayıcı ile etkileşimde bulunmanız gerekirse, `componentDidMount()` veya diğer yaşam döngüsü metotlarında bu işlemi gerçekleştiriniz. `render()`'ın saf halde tutulması, bileşen üzerinde daha kolay çalışmanızı sağlar.

> Not
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate) metodu `false` dönerse, `render()` metodu çağrılmaz.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**state'i kullanmadığınız veya `bind()` fonksiyonu ile herhangi bir metot bağlamadığınız sürece, React bileşeni için bir constructor metodu oluşturmanız gerekli değildir.**

Bir React bileşeninin constructor'ı, ilgili bileşen uygulamaya eklenmeden önce çağrılır. `React.Component`'tan türetilen sınıf için bir constructor oluştururken, fonksiyon içerisinde ilk satırda `super(props)` çağırmanız gereklidir. Aksi halde `this.props` özelliği, constructor içerisinde `undefined` olarak değer alacaktır. Bu durum, uygulamanızda birtakım hatalara neden olabilir.

Constructor, genellikle iki temel amaçla kullanılır:

* `this.state`'e bir nesne atanarak [yerel state](/docs/state-and-lifecycle.html)'in oluşturulması.
* `bind()` metodu kullanılarak, bileşene [olay metotlarının](/docs/handling-events.html) bağlanması.

`constructor()` içerisinde, **`setState()` metodunu çağırmamalısınız**. Eğer bileşeniniz yerel state'i kullanmak istiyorsa, constructor içerisinde direkt olarak **`this.state`'e atayınız**:

```js
constructor(props) {
  super(props);
  // Burada this.setState()'i çağırmayınız!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

`this.state`'e direkt olarak atama yapmanız gereken tek yer constructor'dır. Diğer tüm metotlarda, `this.setState()`'i kullanmanız gereklidir.

Constructor'da, yan etki eden metotlardan veya `setInterval()` gibi abonelik metotlarını oluşturmaktan kaçınınız. Bunun yerine `componentDidMount()` metodunda gerçekleştiriniz. 

>Not
>
>**state'e prop nesnelerinin içeriklerini atamayınız! Bu çok yaygın olarak yapılan bir hatadır:**
>
>```js
>constructor(props) {
>  super(props);
>  // İşte bunu yapmayınız!
>  this.state = { color: props.color };
>}
>```
>
>Buradaki problemlerden birincisi, state'e props değerinin atanması gereksizdir. Çünkü direkt olarak `this.props.color` değeri kullanılabilir. İkinci problem ise, `color` prop'unda yapılan değişiklikler, state'e yansıtılmadığı için hatalara neden olur. 
>
>**Bu tarz bir kodlamayı, yalnızca prop güncellemelerini göz ardı etmek istediğinizde yapınız.** Bu durumda, `color` değişkenini `initialColor` veya `defaultColor` olarak isimlendirmek daha uygun hale gelecektir. Bileşenin iç state'ini güncellemek için zorlamanız gerektiğinde [`key` özelliğini değiştirerek](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) bunu yapabilirsiniz.
>
>[State'in türetilmesinden kaçınmak](/blog/2018/06/07/you-probably-dont-need-derived-state.html) adlı makalemizi okuyarak, prop'lara bağlı bir state'e ihtiyacınız olduğunda ne yapmanız gerektiği ile ilgili bilgi edinebilirsiniz.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

Bir bileşen, DOM ağacına eklendikten hemen sonra `componentDidMount()` çalıştırılır. DOM düğümlerini gerektiren atama işlemleri bu fonksiyon içerisinde yapılmalıdır. Eğer verilerinizi uzak bir API'den yüklemeniz gerekiyorsa, ağ isteğini bu fonksiyonda başlatabilirsiniz.

Ayrıca bu metot, `setInterval()` gibi abonelik gerektiren metotları çağırmak için de uygundur. Eğer böyle bir abonelik metodu çağırdıysanız, `componentWillUnmount()` metodu içerisinde abonelikten çıkmayı unutmayınız. 

`componentDidMount()`'ta **`setState()`'i çağırabilirsiniz**. Bunun sonucunda ekstra bir render etme işlemi gerçekleşmiş olur. Fakat bu işlem, tarayıcı tarafından ekrandaki arayüzün görüntülenmesinden önce gerçekleşir. Bu durum, `render()` metodu iki kez çalışsa bile, kullanıcının bu olayı farketmemesini garanti eder. Fakat bu kodlama mantığını kullanırken dikkatli olunuz. Çünkü bu durum genellikle performans sorunlarına yol açmaktadır. Bu nedenle birçok durumda, `state` atamalarını `constructor()` metodu içerisinde gerçekleştiriniz. Ancak tooltip veya modal bileşenlerinin gösterildiği durumlarda, render işlemi öncesinde DOM düğümünün boyutu veya pozisyonu gibi bir özelliği ölçümlemek istiyorsanız, bu kod mantığını kullanmanız gereklidir.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

Adından da anlaşılacağı gibi `componentDidUpdate()` metodu, sadece DOM güncellemelerinde gerçekleştirilir. Bu nedenle başlangıçtaki render işleminde çağrılmaz.

Bileşen güncellendiğinde, DOM üzerinde yapmak istediğiniz işleri gerçekleştirmek için bu metodu kullanınız. Ayrıca bu metot, önceki prop ile sonraki prop değerlerini karşılaştırıp, buna bağlı olarak ağ isteklerini gerçekleştirmek için uygun bir yerdir. Örneğin, prop nesnesi değişmediyse ağ isteğinin yapılmasına gerek yoktur.

```js
componentDidUpdate(prevProps) {
  // Genel kullanım (prop değerlerini karşılaştırmayı unutmayınız!):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

`componentDidUpdate()` metodunun **içerisinde `setState()` çağrısı** yapabilirsiniz. Fakat unutmayınız ki bu çağrı, üstteki gibi bir koşul ifadesi içerisinde yer almalıdır. Aksi halde uygulamanız sonsuz döngüye girebilir. Ayrıca kullanıcı tarafından farkedilmeyen fakat bileşen performansına etki edebilecek seviyede ekstra bir render işlemi gerçekleşmesine neden olur. Eğer üst bileşenden gelen prop'u mevcut bileşenin state'ine kopyalamaya çalışıyorsanız, bunun yerine direkt olarak prop kullanabilirsiniz. Neden [prop'un state'e kopyalanmasının hatalara yol açabileceği](/blog/2018/06/07/you-probably-dont-need-derived-state.html) hakkında daha fazla bilgi edinmek için blog yazısını inceleyebilirsiniz..

Eğer bileşeninizde `getSnapshotBeforeUpdate()` yaşam döngüsü metodunu kodlamışsanız (ki bu nadir bir durumdur), geri döndürdüğü değer `componentDidUpdate()` metoduna "snapshot" ismiyle üçüncü parametre olarak aktarılır. Aksi halde bu parametre, `undefined` olacaktır.

> Not:
>
> Eğer [`shouldComponentUpdate()`](#shouldcomponentupdate) metodu false döndürüyorsa, `componentDidUpdate()` metodu çağrılmayacak demektir.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

Bir bileşen, DOM'dan çıkarıldığında veya tamamen yok edildiğinde `componentWillUnmount()` metodu çalıştırılır. `componentDidMount()`'ta yapılan; zamanlayıcı fonksiyonların geçersiz kılınması, ağ isteklerinin iptal edilmesi, veya herhangi bir abonelik metodunun temizlenmesi gibi işlemleri bu metotta gerçekleştiriniz.

`componentWillUnmount()`'ta **`setState()` metodunu çağırmamalısınız.** Çünkü, bileşen artık DOM'dan ayrıldığı için, tekrar render edilme işlemi asla gerçekleştirilmeyecektir. Bir bileşen eğer DOM'dan ayrıldıysa, artık tekrar DOM'a geri takılma süreci gerçekleştirmeyecektir.

* * *

### Nadiren Kullanılan Yaşam Döngüsü Metotları {#rarely-used-lifecycle-methods}

Bu bölümdeki metotlar, nispeten daha az kullanılan durumlar içindir. Nadiren işinizi görseler de, büyük ihtimalle bileşenlerinizde hiçbirini kullanmayacaksınız. **[Bu yaşam döngüsü şemasının](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) üst kısımında yer alan "Daha az kullanılan yaşam döngülerini göster" kutucuğunu işaretlediğinizde** bu metotların çoğunu görebileceksiniz.


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Mevcut state veya prop'lar değiştiğinde, bileşenin çıktısının bu durumdan etkilenmemesini belirtmek için `shouldComponentUpdate()` metodunu kullanınız. Normalde bileşenin varsayılan davranışı, her state değişikliğinde tekrar render edilmesine yöneliktir. Birçok kullanımda bu varsayılan davranışa uymanız gerekmektedir. 

Prop veya state değerleri değiştirildiğinde, render işleminden hemen önce `shouldComponentUpdate()` metodu çalıştırılır. Varsayılan olarak `true` döndürür. Bileşenin başlangıçtaki ilk render zamanında veya `forceUpdate()` metodu kullanıldığında, bu metot çalıştırılmaz. 

Bu metot yalnızca **[performans iyileştirme](/docs/optimizing-performance.html) işlemleri için yapılmıştır.** Render işlemini engellemek için bu metodu kullanmayınız. Zira bazı hataların oluşmasına yol açabilir. Bu nedenle, `shouldComponentUpdate()` metodunu yazmak yerine, React içerisinde varsayılan olarak gelen **[`PureComponent`](/docs/react-api.html#reactpurecomponent)** kullanınız. `PureComponent`, prop ve state'leri yüzeysel olarak karşılaştırır. Bu sayede büyük DOM ağaçlarına sahip bileşenlerde, küçük değişiklikler gerçekleştiğinde oluşacak güncellemelerin oluşma şansını azaltır. Böylece gereksiz güncellemeler göz ardı edilerek performans artışı sağlanmış olur.

Eğer bu metodu kullanmak için kendinize güveniyorsanız, güncellemenin göz ardı edilmesi için `nextProps` ile `this.props`'u, `nextState` ile `this.state` karşılaşştırabilir ve bunun sonucunda `false` değerini döndürebilirsiniz. `false`'un geri döndürülmesi işlemi, alt bileşenlerin state'i değiştiğinde tekrar render edilmelerini engellemeyeceğini unutmayınız.

`shouldComponentUpdate()` metodu içerisinde, eşitlik kontrollerinin derinlemesine gerçekleştirilmesi veya `JSON.stringify()`'ın kullanımı önerilmez. Bu tür kullanımlar verimsizdir ve performansı olumsuz yönde etkiler.

React'in mevcut sürümünde, `shouldComponentUpdate()` metodu `false` döndürdüğünde; [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), ve [`componentDidUpdate()`](#componentdidupdate) metodları çağrılmaz. Gelecek sürümlerde React, `shouldComponentUpdate()` metodunu sıkı bir şekilde uygulamak yerine bir ipucu şeklinde ele alabilir. Bu nedenle `false` döndürülmesine rağmen, bileşenin tekrar render edilmesi ile sonuçlanabilir.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

Bileşenin başlangıçta DOM'a eklenmesinde ve devamında süregelen güncellemelerde, render metodundan hemen önce `getDerivedStateFromProps` çalıştırılır. Bu metot, state'in güncellenmesi için bir nesne geri döndürür. `null` döndürdüğünde ise güncelleme **gerçekleştirilmemiş** olur.

Bu metot, state'in props değişikliklerine bağlı olduğu [nadiren kullanılan durumlar](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) için vardır. Örneğin `<Transition>` bileşeninin, önceki ve sonraki alt bileşenlerini karşılaştırması sayesinde animasyona girme/çıkma süreçlerinin yönetimi için kullanışlı olabilir.

getDerivedStateFromProps metodunun kullanılması, daha fazla kod yazmaya neden olur. Ve bir süre sonra bileşen kodunu takip edemez hale gelirsiniz. 
[Bununyerine alternatif yollar kullanabilirsiniz:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Eğer props'ta oluşan değişikliklere cevap olarak, web isteği veya animasyon işlemi gibi **yan etki** içeren bir işlem gerçekleştirmeniz gerekiyorsa, [`componentDidUpdate`](#componentdidupdate) yaşam döngüsü metodunu kullanınız.

* Eğer bir prop değiştiğinde, bazı verileri yeniden işlemeniz gerekiyorsa, bunun için [memoization yöntemini kullanınız](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Eğer bir prop değiştiğinde, bazı state değerlerini sıfırlamanız gerekiyorsa, bunun için [tamamen kontrollü bir bileşen](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) veya [bir `key`'e sahip tamamen kontrolsüz bir bileşen](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) kullanınız.

Bu metodun, bileşen nesnesine erişimi yoktur. Eğer dilerseniz sınıf tanımının dışarısında, bileşen prop'larından ve state'inden saf fonksiyonlar çıkararak, `getDerivedStateFromProps()` ve diğer sınıf metotları arasında bazı kod içeriklerini tekrar kullanabilirsiniz.

Unutmayınız ki bu metot, sebebi ne olursa olsun **her render işlemi esnasında** çağrılır. Bu durum, yalnızca üst bileşenin tekrar render işlemine sebebiyet verdiği ve yerel `setState`'in render etmediğinde çalıştırılan `UNSAFE_componentWillReceiveProps`'un tam zıttıdır.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

Bileşenin render edilmiş çıktısı, DOM'a yerleştirilmeden hemen önce `getSnapshotBeforeUpdate()` çağrılır. Bu sayede DOM değişmeden önce, kaydırma çubuğu (scrollbar) pozisyonu gibi bazı bilgilerin DOM'dan alınması sağlanır. Bu yaşam döngüsü metodundan döndürülen her değer, `componentDidUpdate()`'e parametre olarak geçilir.

`getSnapshotBeforeUpdate()`'in kullanımı yaygın değildir. Fakat bir sohbet uygulamasında yeni mesaj geldiğinde, kaydırma çubuğunun aşağı kaydırılması gibi özel işlemlerde gerekli olabilir. 

Bir anlık görüntü değeri (snapshot) veya `null` geri döndürülür. 

Örneğin:

`embed:react-component-reference/get-snapshot-before-update.js`

Üstteki örnekte, `scrollHeight` özelliğinin `getSnapshotBeforeUpdate`'ten okunması çok önemlidir. Çünkü "render" adımındaki yaşam döngüsü (`render()`)  ile "commit" adımındaki yaşam döngüleri (`getSnapshotBeforeUpdate` ve `componentDidUpdate`) arasında gecikmeler yaşanabilir.

* * *

### Hata sınırları {#error-boundaries}

[Hata sınırları (error boundaries)](/docs/error-boundaries.html), alt bileşen ağacında gerçekleşen bir JavaScript hatasını yakalayan React bileşenleridir. Yakaladıkları hatayı kaydeder ve bu hatadan dolayı çöken bileşen ağacının gösterilmesi yerine, yedek olarak oluşturulan bir arayüz öğesinin görüntülenmesini sağlarlar. Hata sınırları, kendi alt ağacında gerçekleşen render işlemlerinde, yaşam döngüsü metotlarında ve `constructor`'larda oluşan herhangi bir hatayı yakalarlar.

Bir sınıf bileşeni, `static getDerivedStateFromError()` veya `componentDidCatch()` yaşam döngüsü metotlarını içerirse, o bileşen artık bir hata sınırı haline gelir. State'in, bu yaşam döngüsü metotları ile güncellenmesi, alt ağaçta oluşabilecek beklenmedik JavaScript hatalarının yakalanmasını ve bunun için bir arayüz görüntülenmesini sağlar.

Hata sınırlarını yalnızca beklenmedik exception'ların giderilmesi için kullanınız: **kontrol akışı için kullanmayınız.**

Daha fazla bilgi için [*React 16'da hata yönetimini inceleyiniz*](/blog/2017/07/26/error-handling-in-react-16.html).

> Not
> 
> Hata sınırları sadece **altındaki** ağaçta bulunan bileşenlerde oluşan hataları yakalarlar. Bu nedenle hata sınırları, kendi içerisinde oluşan bir hatayı yakalayamazlar.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

`getDerivedStateFromError(error)` metodu, bir alt bileşende hata oluştuktan sonra hemen çalıştırılır. 
Oluşan hata nesnesini parametre olarak alır ve state'in güncellenmesi için geriye bir değer döndürür: 

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // state'in güncellenmesi ile sonraki aşamada hata mesajının render edilmesi sağlanacaktır 
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Hatanın görüntülenmesi için herhangi bir içerik sunabilirsiniz
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Not
>
> `getDerivedStateFromError()` metodu, "render" aşamasında çağrılır. Bu nedenle herhangi bir yan etkiye izin verilmez. 
Bu tür kullanımlar için, `componentDidCatch()`'i kullanınız.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```


`componentDidCatch(error, info)` metodu, bir alt bileşende hata oluştuktan sonra hemen çalıştırılır. 
İki parametre alır:

1. `error` - Oluşan hata nesnesi.
2. `info` - Hatayı [hangi bileşenin verdiği ile ilgili bilgileri](/docs/error-boundaries.html#component-stack-traces) tutan `componentStack`'i içeren hata bilgisi nesnesidir. 


`componentDidCatch()` metodu, güncellemenin "commit" adımında çalıştırılır. Bu nedenle yan etkiye izin verir. 
Hataların log'lanması tarzındaki işler için kullanılmalıdır: 

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Sonraki render aşamasında hata mesajının görüntülenmesi için state güncelleniyor.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Örnek bir `componentStack` metninin içeriği aşağıdaki gibidir:
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Herhangi bir hata bileşeni görüntüleyebilirsiniz.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Not
> 
> Bir hata durumunda, `setState`'i çağırarak `componentDidCatch()` ile bir hata arayüzü görüntüleyebilirsiniz. Fakat bu yaklaşım, gelecekteki React sürümlerinde kullanımdan kaldırılacaktır.
> Bunun yerine hata arayüzünün render edilmesi için `static getDerivedStateFromError()` metodunu kullanınız.

* * *

### Eski Yaşam Döngüsü Methotları {#legacy-lifecycle-methods}

Aşağıdaki yaşam döngüsü metotları **eski (legacy)** olarak işaretlenmişlerdir. Bu metotlar hala çalışıyor olmalarına rağmen, yeni yazacağınız kodlarda bu metotları kullanmanızı tavsiye etmiyoruz. Eski yaşam döngüsü metotlarından kurtulmak için [bu blog yazısını](/blog/2018/03/27/update-on-async-rendering.html) inceleyebilirsiniz.

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Not
>
> Bu yaşam döngüsü metodunun adı önceden `componentWillMount` şeklindeydi. Bu isim, React'in 17 sürümüne kadar çalışmaya devam edecektir. Bileşenlerinizi otomatik olarak güncellemek için, [`rename-unsafe-lifecycles` ](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) komutunu kullanabilirsiniz.

`UNSAFE_componentWillMount()` metodu, bileşenin DOM'a eklenmesinden önce çağrılır. `render()` metodundan önce çalıştırıldığından dolayı, bu metot içerisinde `setState()` metodunun senkron olarak çağrılması ekstra bir render işlemini tetiklememektedir. Bunun yerine, state'in başlatılması için `constructor()` metodunu kullanmanızı tavsiye ederiz. 

Bu metot içerisinde herhangi bir yan etki içeren işlem veya abonelik işlemleri yapmaktan kaçınınız. Bu tür yaklaşımlar için `componentDidMount()` metodunu kullanınız.

Sunucu taraflı render etme işleminde yalnızca bu yaşam döngüsü metodu çağrılır. 

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Note
>
> Bu yaşam döngüsü metodunun adı önceden `componentWillReceiveProps` şeklindeydi. Bu isim, React'in 17 sürümüne kadar çalışmaya devam edecektir. Bileşenlerinizi otomatik olarak güncellemek için, [`rename-unsafe-lifecycles` ](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) komutunu kullanabilirsiniz.

> Not:
>
> Bu yaşam döngüsü metodunun kullanımı, uygulamanın hatalı ve tutarsız çalışmasına sebep olacaktır.
>
> * Eğer verilerin getirilmesi veya bir animasyonun uygulanması gibi bir **yan etki** gerçekleştirmek istiyorsanız, props'ta oluşan değişikliklere yanıt vermek için [`componentDidUpdate`](#componentdidupdate) metodunu kullanınız.
> * Sadece bir prop değiştiğinde bazı verilerin tekrar hesaplanması için `componentWillReceiveProps` metodunu kullandıysanız, bunun yerine [memoization helper kullanınız](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * Eğer bir prop değiştiğinde bazı state değişkenlerini `componentWillReceiveProps` metodu ile yeniden başlattıysanız, bunun yerine [tamamen kontrollü bir bileşen](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) veya [bir `key`'e sahip tamamen kontrolsüz bir bileşen](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) oluşturabilrsiniz.
>
> Diğer kullanım durumları için, [state'in türetilmesi ile ilgili bu blog yazısını](/blog/2018/06/07/you-probably-dont-need-derived-state.html) inceleyebilirsiniz.

DOM'a eklenmiş bir bileşen, yeni prop değerlerini almasından hemen önce `UNSAFE_componentWillReceiveProps()` metodu çağrılır. Prop değişikliklerine göre state'i güncellemeniz (örneğin state'i yeniden başlatmanız) gerekiyorsa, `this.props` ve `nextProps` değerlerini karşılaştırabilir ve bu metot içerisinde `this.setState()`'i kullanarak state geçişlerini gerçekleştirebilirsiniz.

Unutmayınız ki, eğer bir üst bileşen, altındaki bileşenin tekrar render edilmesine sebep oluyorsa, props değerleri değişmemiş olsa bile bu metot çağrılır. Bu nedenle oluşan değişiklikleri yönetmek için, mevcut değer ile ve sonraki değerleri karşılaştırınız.

React, bileşenin DOM'a [eklenmesi](#mounting) sırasında, başlangıç prop değerleri ile `UNSAFE_componentWillReceiveProps()` metodunu çağırmaz. Yalnızca bileşenin prop değerleri değiştiğinde bu metodu çalıştırır. Bunun haricinde `this.setState()`'in çağrılması da `UNSAFE_componentWillReceiveProps()` metodunun çağrılmasını tetiklemez.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Not
>
> Bu yaşam döngüsü metodunun adı önceden `componentWillUpdate` şeklindeydi. Bu isim, React'in 17 sürümüne kadar çalışmaya devam edecektir. Bileşenlerinizi otomatik olarak güncellemek için, [`rename-unsafe-lifecycles` ](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) komutunu kullanabilirsiniz.

`UNSAFE_componentWillUpdate()` metodu, yeni bir prop veya state değeri alındığında, render işleminin hemen öncesinde çağrılır. Bu fırsatı değerlendirerek, güncelleme oluşmadan önce ilgili hazırlıkları yapabilirsiniz. Bu metot, ilk render işleminde çalıştırılmaz.

Unutmayınız ki, bu fonksiyon içerisinde, `UNSAFE_componentWillUpdate()` metodunun geriye değer döndürmesinden önce, React bileşeninin güncellenmesini tetikleyecek; `this.setState()`'i veya herhangi bir metodu (örneğin Redux action'ının dispatch edilmesini) çağıramazsınız.

Genellikle bu metot, `componentDidUpdate()` metodu ile değiştirilebilir. Eğer bu metıt içerisinde DOM'dan bir değer okuması yapıyorsanız (örneğin kaydırma çubuğu pozisyonunu kaydediyorsanız), bu kodları `getSnapshotBeforeUpdate()`'e taşıyabilirsiniz.

> Not
>
> Eğer [`shouldComponentUpdate()`](#shouldcomponentupdate) metodu false döndürüyorsa, `UNSAFE_componentWillUpdate()` metodu çağrılmaz.

* * *

## Other APIs {#other-apis-1}

Unlike the lifecycle methods above (which React calls for you), the methods below are the methods *you* can call from your components.

There are just two of them: `setState()` and `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(state, props) => stateChange
```

`state` is a reference to the component state at the time the change is being applied. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `state` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Both `state` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `state`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the current state, we recommend using the updater function form, instead:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

For more detail, see:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state` {#state}

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.
