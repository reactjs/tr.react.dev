---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Paketleme {#bundling}

Çoğu React uygulaması, dosyalarını [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) veya [Browserify](http://browserify.org/) gibi araçlarla "paketler." Paketleme, içe aktarılan dosyaları işleyip tek bir dosyaya, "paket" haline getirme işlemidir. Daha sonra bu paket, uygulamanın tamamını tek seferde yüklemek için kullanılabilir.

#### Örnek {#example}

**Uygulama:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Paket:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Not:
>
> Paketleriniz bundan çok daha farklı gözükecektir.

Eğer [Create React App](https://github.com/facebookincubator/create-react-app),
[Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/)
ya da benzeri bir araç kullanıyorsanız, uygulamanızı paketleyen bir Webpack
kurulumuna sahip olursunuz.

Eğer bu araçlardan birini kullanmıyorsanız, paketleyiciyi kendiniz kurmanız gerekir.
Örnek için, Webpack dokümantasyonundan [Kurulum](https://webpack.js.org/guides/installation/)
ve [Başlangıç](https://webpack.js.org/guides/getting-started/) alanlarına göz atınız.

## Kod Bölümleme {#code-splitting}

Paketleme güzeldir ama uygulamanız büyüdükçe paketiniz de büyür. Özellikle
büyük üçüncü parti kütüphaneleri dahil ediyorsanız. Paketinizin boyutunun, uygulamanızın yüklenişini
geciktirecek kadar büyük olmaması için paketinize dahil ettiğiniz kodlara
göz kulak olmanız gerekir.

Büyük paket boyutlarından kurtulmak için problemin üzerine gitmek ve paketinizi "bölümlemeye" başlamak iyi bir yöntemdir.
Kod-Bölümleme, [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) ve Browserify ([factor-bundle](https://github.com/browserify/factor-bundle) ile) gibi paketleyicilerin desteklediği, işleyiş süresince dinamik olarak yüklenen birden çok paket yaratmaya yarayan özelliktir.

Uygulamanıza kod bölümlemesi yapmak, kullanıcının anlık olarak ihtiyaç duyduğu şeylerin
"lazy yüklenmesine" yardımcı olarak uygulama performansını önemli ölçüde
arttırabilir. Uygulamanızdaki toplam kod miktarını azaltmamış olsanız da kullanıcının
hiçbir zaman ihtiyaç duymayacağı kodu yüklemekten kaçınmış ve ilk yükleme sırasında
ihtiyaç duyulan kodu azaltmış olursunuz.

## `import()` {#import}

Uygulamanıza kod bölümlemeyi getirmenin en iyi yolu dinamik `import()` sözdiziminden geçer.

**Önce:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Sonra:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

Webpack bu sözdizimine denk geldiğinde, uygulamanızda otomatik olarak kod bölümlemeye başlar. Eğer Create React App kullanıyorsanız,
bu ayar sizin için halihazırda ayarlanmıştır ve [kullanmaya](https://facebook.github.io/create-react-app/docs/code-splitting) hemen
başlayabilirsiniz. Aynı zamanda [Next.js](https://github.com/zeit/next.js/#dynamic-import)'de de desteklenmektedir.

Eğer Webpack ayarlarını kendiniz yapıyorsanız, Webpack'in [kod bölümleme rehberini](https://webpack.js.org/guides/code-splitting/)
okumayı tercih edebilirsiniz. Webpack ayarınız hayal meyal [buna benzeyecektir.](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269)

[Babel](https://babeljs.io/) kullanıyorken, Babel'ın dinamik import sözdizimini çözümleyebildiğinden
fakat dönüştürmediğinden emin olmanız gerekmekte. Bunun için [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import)'a ihtiyacınız var.

## `React.lazy` {#reactlazy}

> Not:
>
> `React.lazy` ve Suspense henüz server-side rendering için kullanılabilir değildir. Eğer server taraflı görüntülenen uygulamalar için
> kod bölümleme yapmak isterseniz, [Loadable Components](https://github.com/gregberge/loadable-components)'ı tavsiye ederiz. Çok iyi bir
> [server-side rendering için paket bölümleme rehberi](https://loadable-components.com/docs/server-side-rendering/) var.

`React.lazy` fonksiyonu, dinamik import'u normal bir bileşen gibi render etmeye yarar.

**Önce:**

```js
import OtherComponent from './OtherComponent';
```

**Sonra:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Bu kod, bileşen ilk render edildiğinde `OtherComponent`'ı içeren paketi otomatik olarak yükler.

`React.lazy`, dinamik `import()`'u çağıran bir fonksiyon alır. `default` ile dışarı aktarılan bir React bileşenini içeren modülü çözümleyen
`Promise` return etmelidir.

### Suspense {#suspense}

`MyComponent` render edildiğinde `OtherComponent`'ı içeren modül yüklenmediyse, yüklenmesini beklerken geçirdiğimiz süre içerisinde yükleme göstergesi gibi bir yedek içerik göstermeliyiz. Bu, `Suspense` bileşeniyle yapılır.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
`fallback` prop'u, bileşenin yüklenmesini beklerken göstermek istediğiniz herhangi bir React elemanını kabul eder. `Suspense` bileşenini, lazy bileşeninin üstünde herhangi bir yere yerleştirebilirsiniz. Birden fazla lazy bileşenini tek bir `Suspense` bileşeni içerisine bile alabilirsiniz.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Hata Sınırları {#error-boundaries}

Eğer diğer modül bir nedenden dolayı yüklenmezse (örneğin, ağ sorunu) hata fırlatacaktır. Güzel bir kullanıcı deneyimi sunmak ve kurtarmayı yönetmek için bu hataları [Hata Sınırları](/docs/error-boundaries.html) ile işleyebilirsiniz. Hata Sınırı oluşturduktan sonra, ağ sorunu olduğunda hata göstermek için Hata Sınırını lazy bileşenlerinizin üstünde herhangi bir yerde kullanabilirsiniz.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Rota bazlı kod bölümleme {#route-based-code-splitting}

Uygulamanızda nereye kod bölümleme yapacağınıza karar vermek biraz zor olabilir. Paketlerinizi eşit parçalara ayıracak ama kullanıcı deneyimini de engellemeyecek yerler seçtiğinize emin olmalısınız.

Rotalar, başlamak için güzel yerlerdir. Webteki çoğu insan, yüklenmesi biraz zaman alan sayfa geçişlerine alışıktır. Aynı zamanda tüm sayfayı tek seferde yeniden render etme eğiliminiz vardır ki kullanıcınız, aynı anda sayfanın başka bir elemanıyla etkileşime girmesin.

İşte [React Router](https://reacttraining.com/react-router/) gibi kütüphaneler kullanan uygulamalarda rota bazlı kod bölümlemenin `React.lazy` ile nasıl kurulabileceğine dair bir örnek.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## İsimlendirilmiş Dışa Aktarımlar {#named-exports}

`React.lazy` şu an için sadece default dışa aktarımları desteklemektedir. İçe aktarmak istediğiniz modül, isimlendirilmiş dışa aktarım kullanıyorsa; onu varsayılan olarak tekrar dışa aktaran aracı bir modül yaratabilirsiniz. Bu, ağaçlanmanın çalışmaya devam etmesini ve kullanılmayan bileşenleri çekmemenizi sağlar.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
