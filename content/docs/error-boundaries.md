---
id: error-boundaries
title: Hata Sınırları
permalink: docs/error-boundaries.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React:
>
> - [`React.Component`: Catching rendering errors with an error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

</div>

Geçmişte, bileşenler içindeki JavaScript hataları React'in dahili state'ini bozar ve sonraki renderlarda [şifreli](https://github.com/facebook/react/issues/6895) [hatalar](https://github.com/facebook/react/issues/8579) [gösterirdi](https://github.com/facebook/react/issues/4026). Bu hataların hepsi uygulama kodunda daha önce ortaya çıkmış hatalardan kaynaklanıyordu ve React bu hataları bileşenlerde ele alacak şık bir yol sunmuyor ve bu hataları da atlatamıyordu.


## Hata Sınırlarına Giriş {#introducing-error-boundaries}

Kullanıcı arayüzünün bir parçasında ortaya çıkan bir hata, tüm uygulamayı bozmamalıdır. React kullanıcıları için bu sorunu çözmek adına React 16, "hata sınırı" adında yeni bir konsepti tanıtıyor.

Hata sınırları, bozuk bileşen ağacı yerine **herhangi bir alt bileşen ağacında oluşmuş Javascript hatalarını yakalayan, bunları kayda geçiren ve bir son çare arayüzü gösteren** React bileşenleridir. Hata sınırları tüm alt bileşen ağacında render esnasında, yaşam döngüsü metodlarında ve constructor'da oluşan hataları yakalar.

> Not
>
> Hata sınırları, aşağıdaki hataları **yakalamaz**:
>
> * Olay yöneticileri ([daha fazla bilgi](#how-about-event-handlers))
> * Asenkron kod (örneğin `setTimeout` veya `requestAnimationFrame` callbackleri)
> * Sunucu tarafındaki render
> * Hata sınırının (alt elemanları yerine) kendisinde ortaya çıkan hatalar

Bir sınıf bileşeni, [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) ve [`componentDidCatch()`](/docs/react-component.html#componentdidcatch) metodlarından birini (veya ikisini birden) tanımlarsa, bir hata sınırına dönüşür. Bir hatanın ortaya çıkışının ardından, son çare bileşeni render etmek için, `static getDerivedStateFromError()` metodunu, hata bilgisinin günlüğünü tutmak içinse `componentDidCatch()` metodunu kullanınız.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Bir sonraki render'da son çare arayüzünü göstermek için
    // state'i güncelleyin.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hatanızı bir hata bildirimi servisine de yollayabilirsiniz.
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // İstediğiniz herhangi bir son çare arayüzünü render edebilirsiniz.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

Ardından, normal bir bileşen gibi kullanabilirsiniz:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Hata sınırları, bileşenler için JavaScript'in `catch {}` bloğu gibidir. Yalnız sınıf bileşenleri hata sınırı olabilirler. Pratikte, genellikle bir hata sınırını bir kez tanımlayıp, tüm uygulamanızda kullanmak isteyeceksiniz.

**Hata sınırlarının yalnızca altlarındaki bileşenlerde meydana gelen hataları yakaladıklarını** dikkate alınız.  Bir hata sınırı, kendi içinde meydana gelen hataları yakalayamaz. Eğer bir hata sınırı, hata mesajını render etmekte başarılı olamazsa, bu hata onun üzerindeki en yakın hata sınırına delege edilir. Bu, JavaScript'teki `catch {}` bloğunun çalışma prensibine yakındır.

## Canlı Demo {#live-demo}

[Bir hata sınırının nasıl tanımlandığı ve kullanıldığına dair bu örneğe](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) göz atın.


## Hata Sınırlarının Konumlandırılması {#where-to-place-error-boundaries}

Hata sınırlarının detay seviyesi size bırakılmıştır. Tıpkı sunucu taraflı frameworklerin yaptığına benzer şekilde, en üst seviyedeki rota bileşenini sararak kullanıcılara "Bir şeyler ters gitti" mesajını gösterebildiğiniz gibi, her bileşen parçasını sararak onları uygulamanın geri kalanını bozmaktan koruyabilirsiniz.


## Yakalanmamış Hatalar İçin Yeni Bir Davranış {#new-behavior-for-uncaught-errors}

Bu değişiklik çok önemli bir içeriğe sahip. **React 16'dan itibaren, bir hata sınırı tarafından yakalanmamış hatalar, tüm React bileşen ağacının devreden çıkmasına neden olacaktır.**

Bu kararı alırkan çok tartıştık, ancak tecrübelerimize dayanarak hatalı bir arayüzün yerinde bırakılması, onun tamamen kaldırılmasından daha kötüdür. Örneğin, Messenger gibi bir üründe hatalı bir arayüzün görünür kalması, birinin yanlış kişiye mesaj göndermesine neden olabilir. Benzer olarak, bir ödeme uygulamasında yanlış miktarın görüntülenmesi, hiçbir şey görünmemesinden daha kötüdür.

Bu değişiklik, React 16'ya taşınmanızın ardından daha önce fark etmediğiniz hataların gün yüzüne çıkması anlamına geliyor. Hata sınırları eklemek, bir şeyler yanlış gittiğinde daha iyi bir kullanıcı deneyimi sunmanızı sağlar.

Örneğin Facebook Messenger, kenar çubuğunun, bilgi panelinin, sohbet günlüğü ve mesaj kutusu içeriğini farklı hata sınırlamalarıyla sarar. Eğer bu kullanıcı arayüzlerinden birindeki bileşenlerden biri bozulursa, diğerleriyle etkileşim mümkün kalır.

Ayrıca, canlı sistemdeki yakalanmamış exceptionları öğrenmeniz ve düzeltmeniz için size JS hata bildirim servislerini kullanmanızı (veya bir tane yazmanızı) şiddetle tavsiye ederiz.


## Bileşen Yığını İzi (Stack Trace) {#component-stack-traces}

React 16, uygulama kazara yutsa bile, render esnasında oluşan tüm hataları geliştirme aşamasında konsola yazar. Hata mesajı ve JavaScript yığınının (stack) yanı sıra, bileşen yığını izini (stack trace) de size sunar. Bu sayede, hatanın bileşen ağacının tam olarak neresinde olduğunu görebilirsiniz:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Hata Sınırı bileşeninde yakalanmış bir hata">

Aynı zamanda dosyanın adı ve satır numarasını da bileşen yığını izinde (stack trace) görebilirsiniz. Bu, [Create React App](https://github.com/facebookincubator/create-react-app) projelerinde öntanımlı olarak çalışmaktadır:

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

Eğer Create React App kullanmıyorsanız, [bu eklentiyi](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source) Babel yapılandırmanıza elle ekleyebilirsiniz. Unutmayın ki bu sadece geliştirme içindir ve **canlıda devre dışı bırakılmalıdır**.

> Not
>
> Yığın izlerinde (stack trace) gösterilen bileşen isimleri, [`Function.name`](https://developer.mozilla.org/tr/docs/Web/JavaScript/Reference/Global_Objects/Function/name) özelliğine bağlıdır. Eğer bunu henüz desteklemeyen eski tarayıcıları (örneğin IE 11) da destekliyorsanız, uygulamanızda `Function.name` desteği sunan [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name) gibi bir polyfill kullanmayı düşünün. Alternatif olarak tüm bileşenlerinizde [`displayName`](/docs/react-component.html#displayname) özelliğini ayarlayabilirsiniz.


## Peki Ya try/catch? {#how-about-trycatch}

`try` / `catch` harikadır ama sadece eylemsel (imperative) kodlarda çalışır:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Ancak, React bileşenleri bildirimseldir (declarative) ve **neyin** render edileceğini belirlerler:

```js
<Button />
```

Hata sınırları React'in bildirimsel (declarative) doğasını korur ve beklendiği gibi davranır. Örneğin, eğer bileşen ağacının derinlerinde bir yerde `componentDidUpdate` içinde `setState`'in yol açtığı bir hata oluşsa bile en yakın hata sınırına doğru bir şekilde yönlendirilir.

## Peki Ya Olay Yöneticileri? {#how-about-event-handlers}

Hata sınırları, olay yöneticileri içinde oluşan hataları **yakalamazlar**.

React'in olay yöneticileri içinde oluşan hataları atlatmaya ihtiyacı yoktur. Render ve yaşam döngüsü metodlarının aksine, olay yöneticileri render aşamasında oluşmazlar. Yani onlar bir hata fırlattığında, React hala ekranda ne göstereceğini bilir.

Eğer bir olay yöneticisi içinde bir hatayı yakalamanız gerekiyorsa, JavaScript'in sunduğu normal `try` / `catch` ifadesini kullanın:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Hata oluşturacak bir şey yapın
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Hata yakalandı.</h1>
    }
    return <button onClick={this.handleClick}>Beni tıkla</button>
  }
}
```

Yukarıdaki örnekte normal JavaScript davranışlarının gösterildiğini ve hata sınırlarının kullanılmadığını dikkate alınız.

## React 15'ten Sonraki İsim Değişiklikleri {#naming-changes-from-react-15}

React 15, hata sınırlarını çok limitli bir şekilde destekleyen, `unstable_handleError` isimli başka bir metod içermekteydi. Bu metod artık çalışmıyor ve onu ilk 16 beta versiyonundan itibaren kodunuzda `componentDidCatch` ile değiştirmeniz gerekmektedir.

Bu değişiklik için, kodunuzun taşınmasını otomatikleştirmek adına bir [codemod](https://github.com/reactjs/react-codemod#error-boundaries) sunuyoruz.
