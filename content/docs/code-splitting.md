---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Paketleme {#bundling}

Çoğu React uygulaması, dosyalarını [Webpack](https://webpack.js.org/)
veya [Browserify](http://browserify.org/) gibi araçlarla "paketler."
Paketleme, içe aktarılan dosyaları işleyip tek bir dosyaya, "paket" haline getirme işlemidir.
Daha sonra bu paket, uygulamanın tamamını tek seferde yüklemek için kullanılabilir.

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
büyük üçüncü parti kütüphaneleri dahil ediyorsanız. Paketinizin, uygulamanızın yüklenişini
geciktirecek kadar büyük olmaması için paketinize dahil ettiğiniz kodlara
göz kulak olmanız gerekir.

// to-do: look here
To avoid winding up with a large bundle, it's good to get ahead of the problem
and start "splitting" your bundle.

[Kod Bölümleme](https://webpack.js.org/guides/code-splitting/), Webpack ve
Browserify ([factor-bundle](https://github.com/browserify/factor-bundle) ile)
gibi paketleyicilerin desteklediği, işleyiş süresince dinamik olarak yüklenen
birden çok paket yaratmaya yarayan özelliktir.

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

> Not:
>
> Dinamik `import()` sözdizimi ECMAScript (JavaScript) [önerisi](https://github.com/tc39/proposal-dynamic-import)
> henüz dil standartlarının bir parçası değildir. Yakın gelecekte kabul edilmesi beklenmektedir.

Webpack bu sözdizimine denk geldiğinde, otomatik olarak uygulamanızda
kod bölümlendirmeye başlar. Eğer Create React App kullanıyorsanız,
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
> kod bölümleme yapmak isterseniz, [Loadable Components](https://github.com/smooth-code/loadable-components)'ı tavsiye ediyoruz. Çok iyi bir
> [server-side rendering için paket bölümleme rehberi](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md) var.

`React.lazy` fonksiyonu, dinamik import'u normal bir component gibi render etmeye yarar.

**Önce:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**Sonra:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Bu, bu component render edildiğinde `OtherComponent`'ı içeren paketi otomatik olarak yükler.

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

### Error boundaries {#error-boundaries}

If the other module fails to load (for example, due to network failure), it will trigger an error. You can handle these errors to show a nice user experience and manage recovery with [Error Boundaries](/docs/error-boundaries.html). Once you've created your Error Boundary, you can use it anywhere above your lazy components to display an error state when there's a network error.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Route-based code splitting {#route-based-code-splitting}

Deciding where in your app to introduce code splitting can be a bit tricky. You
want to make sure you choose places that will split bundles evenly, but won't
disrupt the user experience.

A good place to start is with routes. Most people on the web are used to
page transitions taking some amount of time to load. You also tend to be
re-rendering the entire page at once so your users are unlikely to be
interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using
libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

`React.lazy` currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. This ensures that treeshaking keeps working and that you don't pull in unused components.

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
