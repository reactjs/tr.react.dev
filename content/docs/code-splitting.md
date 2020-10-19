---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Paketleme {#bundling}

<<<<<<< HEAD
Çoğu React uygulaması, dosyalarını [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) veya [Browserify](http://browserify.org/) gibi araçlarla "paketler." Paketleme, içe aktarılan dosyaları işleyip tek bir dosyaya, "paket" haline getirme işlemidir. Daha sonra bu paket, uygulamanın tamamını tek seferde yüklemek için kullanılabilir.
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

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

<<<<<<< HEAD
Eğer [Create React App](https://create-react-app.dev/),
[Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/)
ya da benzeri bir araç kullanıyorsanız, uygulamanızı paketleyen bir Webpack
kurulumuna sahip olursunuz.

Eğer bu araçlardan birini kullanmıyorsanız, paketleyiciyi kendiniz kurmanız gerekir.
Örnek için, Webpack dokümantasyonundan [Kurulum](https://webpack.js.org/guides/installation/)
ve [Başlangıç](https://webpack.js.org/guides/getting-started/) alanlarına göz atınız.
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to setup bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## Kod Bölümleme {#code-splitting}

<<<<<<< HEAD
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
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## `import()` {#import}

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

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

<<<<<<< HEAD
Webpack bu sözdizimine denk geldiğinde, uygulamanızda otomatik olarak kod bölümlemeye başlar. Eğer Create React App kullanıyorsanız,
bu ayar sizin için halihazırda ayarlanmıştır ve [kullanmaya](https://create-react-app.dev/docs/code-splitting/) hemen
başlayabilirsiniz. Aynı zamanda [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import)'de de desteklenmektedir.

Eğer Webpack ayarlarını kendiniz yapıyorsanız, Webpack'in [kod bölümleme rehberini](https://webpack.js.org/guides/code-splitting/)
okumayı tercih edebilirsiniz. Webpack ayarınız hayal meyal [buna benzeyecektir.](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269)

[Babel](https://babeljs.io/) kullanırken, Babel'ın dinamik import sözdizimini çözümleyebildiğinden
fakat dönüştürmediğinden emin olmanız gerekmekte. Bunun için [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import)'a ihtiyacınız var.
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

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
import React, { Suspense } from 'react';

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
import React, { Suspense } from 'react';

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
import React, { Suspense } from 'react';
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

<<<<<<< HEAD
Uygulamanızda nereye kod bölümleme yapacağınıza karar vermek biraz zor olabilir. Paketlerinizi eşit parçalara ayıracak ama kullanıcı deneyimini de engellemeyecek yerler seçtiğinize emin olmalısınız.

Rotalar, başlamak için güzel yerlerdir. Webteki çoğu insan, yüklenmesi biraz zaman alan sayfa geçişlerine alışıktır. Aynı zamanda tüm sayfayı tek seferde yeniden render etme eğiliminiz vardır ki kullanıcınız, aynı anda sayfanın başka bir elemanıyla etkileşime girmesin.

İşte [React Router](https://reacttraining.com/react-router/) gibi kütüphaneler kullanan uygulamalarda rota bazlı kod bölümlemenin `React.lazy` ile nasıl kurulabileceğine dair bir örnek.
=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
