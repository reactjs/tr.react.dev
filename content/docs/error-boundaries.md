---
id: error-boundaries
title: Hata Sınırları
permalink: docs/error-boundaries.html
---

Geçmişte, bileşenler içindeki JavaScript hataları React'in dahili stateini bozar ve sonraki renderlarda [şifreli](https://github.com/facebook/react/issues/6895) [hatalar](https://github.com/facebook/react/issues/8579) [gösterirdi](https://github.com/facebook/react/issues/4026). Bu hataların hepsi uygulama kodunda daha önce ortaya çıkmış hatalardan kaynaklanıyordu ve React bu hataları bileşenlerde ele alacak şık bir yol sunmuyor ve bu hataları da atlatamıyordu.


## Hata Sınırlarına Giriş {#introducing-error-boundaries}

Kullanıcı arayüzünün bir parşasında ortaya çıkan bir hata, tüm uygulamayı bozmamalıdır. React kullanıcıları için bu sorunu çözmek adına React 16, "hata sınırı" adında yeni bir konsepti tanıtıyor.

Hata sınırları, bozuk bileşen ağacı yerine **herhangi bir alt bileşen ağacında oluşmuş Javascript hatalarını yakalayan, bunları kayda geçiren ve bir son çare arayüzü gösteren** React bileşenleridir. Hata sınırları tüm alt ağaçta render esnasında, yaşam döngüsü metodlarında ve constructor'da oluşan hataları yakalar.

> Not
>
> Hata sınırları, aşağıdaki hataları **yakalamaz**:
>
> * Olay yöneticileri ([daha fazla bilgi](#how-about-event-handlers))
> * Asenkron kod (örneğin `setTimeout` veya `requestAnimationFrame` callbackleri)
> * Sunucu tarafındaki render
> * Hata sınırının (alt elemanları yerine) kendisinde ortaya çıkan hatalar

Bir sınıf bileşenini, [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) ve [`componentDidCatch()`](/docs/react-component.html#componentdidcatch) metodlarından birini (veya ikisini birden) tanımlarsa, bir hata sınırına dönüşür. Bir hatanın ortaya çıkışının ardından, son çare bileşeni render etmek için, `static getDerivedStateFromError()` metodunu, hata bilgisinin günlüğünü tutmak içinse `componentDidCatch()` metodunu kullanınız.

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

  componentDidCatch(error, info) {
    // Hatanızı bir hata bildirimi servisine de yollayabilirsiniz.
    logErrorToMyService(error, info);
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

[React 16](/blog/2017/09/26/react-v16.0.html) ile [bir hata sınırının nasıl tanımlandığı ve kullanıldığına](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) göz atınız.


## Hata Sınırlarının Konumlandırılması {#where-to-place-error-boundaries}

Hata sınırlarının detay seviyesi size bırakılmıştır. Tıpkı sunucu taraflı frameworklerin yaptına benzer şekilde, en üst seviyedeki rota bileşenini sararak kullanıcılara "Bir şeyler ters gitti" mesajını gösterebildiğiniz gibi, her bileşen parçasını sararak onları uygulamanın geri kalanını bozmaktan koruyabilirsiniz.


## Yakalanmamış Hatalar İçin Yeni Bir Davranış {#new-behavior-for-uncaught-errors}

Bu değişiklik çok önemli bir içeriğe sahip. **React 16'dan itibaren, bir hata sınırı tarafından yakalanmamış hatalar, tüm React bileşen ağacının devreden çıkmasına neden olacaktır.**

Bu kararı alırkan çok tartıştık, ancak tecrübelerimize dayanarak hatalı bir arayüzün yerinde bırakılması, onun ramamen kaldırılmasından daha kötüdür. Örneğin, Messenger gibi bir üründe hatalı bir arayüzün görünür kalması, birinin yanlış kişiye mesaj göndermesine neden olabilir. Benzer olarak, bir ödeme uygulamasında yanlış miktarın görüntülenmesi, hiçbir şey görünmemesinden daha kötüdür.

Bu değişiklik, React 16'ya göç etmenizin ardından daha önce fark etmediğiniz hataların gün yüzüne çıkması anlamına geliyor. Hata sınırları eklemek, bir şeyler yanlış gittiğinde daha iyi bir kullanıcı deneyimi sunmanızı sağlar.

Örneğin Facebook Messenger, kenar çubuğunun, bilgi panelinin, sohbet günlüğü ve mesaj kutusu içeriğini farklı hata sınırlamalarıyla sarar. Eğer bu kullanıcı arayüzlerinden birindeki bileşenlerden biri bozulursa, diğerleriyle etkileşim mümkün kalır.

Ayrıca, canlı sistemdeki yakalanmamış exceptionları öğrenmeniz ve düzeltmeniz için size JS hata bildirim servislerini kullanmanızı (veya bir tane yazmanızı) şiddetle tavsiye ederiz.


## Bileşen Yığını İzi {#component-stack-traces}

React 16, uygulama kazara yutsa bile, render esnasında oluşan tüm hataları geliştirme aşamasında konsola yazar. Hata mesajı ve JavaScript yığınının yanı sıra, bileşen yığını izini de size sunar. Bu sayede, hatanın bileşen ağacının tam olarak neresinde olduğunu görebilirsiniz:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Hata Sınırı bileşeninde yakalanmış bir hata">

Aynı zamanda dosyanın adı ve satır numarasını da bileşen yığını izinde görebilirsiniz. Bu, [Create React App](https://github.com/facebookincubator/create-react-app) projelerinde öntanımlı olarak çalışmaktadır:

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

Eğer Create React App kullanmıyorsanız, [bu eklentiyi](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) Babel yapılandırmanıza elle ekleyebilirsiniz. Unutmayın ki bu yalnız geliştirme içindir ve **canlıda devre dışı bırakılmalıdır**.

> Not
>
> Yığın izlerinde gösterilen bileşen isimleri, [`Function.name`](https://developer.mozilla.org/tr/docs/Web/JavaScript/Reference/Global_Objects/Function/name) özelliğine bağlıdır. Eğer bunu henüz desteklemeyen eski tarayıcıları (örneğin IE 11) da destekliyorsanız, uygulamanızda `Function.name` desteği sunan [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name) gibi bir polyfill kullanmayı düşünün. Alternatif olarak tüm bileşenlerinizde [`displayName`](/docs/react-component.html#displayname) özelliğini tanımlayabilirsiniz.


## Peki Ya try/catch? {#how-about-trycatch}

`try` / `catch` is great but it only works for imperative code:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

However, React components are declarative and specify *what* should be rendered:

```js
<Button />
```

Error boundaries preserve the declarative nature of React, and behave as you would expect. For example, even if an error occurs in a `componentDidUpdate` method caused by a `setState` somewhere deep in the tree, it will still correctly propagate to the closest error boundary.

## How About Event Handlers? {#how-about-event-handlers}

Error boundaries **do not** catch errors inside event handlers.

React doesn't need error boundaries to recover from errors in event handlers. Unlike the render method and lifecycle methods, the event handlers don't happen during rendering. So if they throw, React still knows what to display on the screen.

If you need to catch an error inside event handler, use the regular JavaScript `try` / `catch` statement:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <div onClick={this.handleClick}>Click Me</div>
  }
}
```

Note that the above example is demonstrating regular JavaScript behavior and doesn't use error boundaries.

## Naming Changes from React 15 {#naming-changes-from-react-15}

React 15 included a very limited support for error boundaries under a different method name: `unstable_handleError`. This method no longer works, and you will need to change it to `componentDidCatch` in your code starting from the first 16 beta release.

For this change, we’ve provided a [codemod](https://github.com/reactjs/react-codemod#error-boundaries) to automatically migrate your code.
