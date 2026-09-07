---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream`, bir react ağacını pipelanabilir [Node.js Streamine](https://nodejs.org/api/stream.html) render eder.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Bu API Node.js'e özgüdür. Deno, ve bazı modern edge runtimeları gibi [Web Streamleri](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) içeren ortamlar [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)'i kullanmalılardır.

</Note>

---

## Referans {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

React ağacınızı [Node.js Streamine](https://nodejs.org/api/stream.html#writable-streams) HTML olarak render etmek istersseniz `renderToPipeableStream`'i çağırınız.

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

İstemcide üzerinde, [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)'u çağırarak sunucu tarafından oluşturulan HTML'in etkileşimli hale getirebilirsiniz.

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: HTML'e render etmek istediğiniz React düğümüdür. Örneğin, `<App />` gibi bir JSX bileşeni. Belgenin tamamını temsil etmesi beklediğinden dolayı `App` bileşeni `<html>` etiketini render etmelidir.

<<<<<<< HEAD
* **optional** `options`: Streaming options içeren bir object.

  * **optional** `bootstrapScriptContent`: Belirtilirse, bu string inline bir `<script>` tag’i içine yerleştirilir.

  * **optional** `bootstrapScripts`: Sayfada emit edilecek `<script>` tag’leri için string URL’lerden oluşan bir array. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) çağıran `<script>`’i dahil etmek için bunu kullanın. Client tarafında React’i hiç çalıştırmak istemiyorsanız bunu atlayın.

  * **optional** `bootstrapModules`: `bootstrapScripts` gibidir, ancak bunun yerine [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) emit eder.

  * **optional** `identifierPrefix`: React’in [`useId`](/reference/react/useId) tarafından oluşturulan ID’ler için kullandığı string prefix. Aynı sayfada birden fazla root kullanırken conflict’leri önlemek için kullanışlıdır. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)’a geçirilen prefix ile aynı olmalıdır.

  * **optional** `namespaceURI`: Stream için root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris)’sini içeren bir string. Default olarak normal HTML’dir. SVG için `'http://www.w3.org/2000/svg'`, MathML için `'http://www.w3.org/1998/Math/MathML'` geçirin.

  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) için script’lere izin veren bir [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string’i.

  * **optional** `onAllReady`: Hem [shell](#specifying-what-goes-into-the-shell) hem de tüm ek [content](#streaming-more-content-as-it-loads) dahil olmak üzere tüm rendering tamamlandığında tetiklenen bir callback. Bunu `onShellReady` yerine [crawler’lar ve static generation](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) için kullanabilirsiniz. Burada streaming’i başlatırsanız progressive loading elde etmezsiniz. Stream final HTML’i içerir.

  * **optional** `onError`: [Recoverable](#recovering-from-errors-outside-the-shell) olsun ya da [olmasın](#recovering-from-errors-inside-the-shell), server error olduğunda tetiklenen bir callback. Default olarak yalnızca `console.error` çağırır. [Crash report’ları loglamak](#logging-crashes-on-the-server) için override ederseniz, yine de `console.error` çağırdığınızdan emin olun. Shell emit edilmeden önce [status code’u ayarlamak](#setting-the-status-code) için de kullanabilirsiniz.

  * **optional** `onShellReady`: [Initial shell](#specifying-what-goes-into-the-shell) render edildikten hemen sonra tetiklenen bir callback. Burada [status code’u ayarlayabilir](#setting-the-status-code) ve streaming’i başlatmak için `pipe` çağırabilirsiniz. React, shell’den sonra ek [content’i stream eder](#streaming-more-content-as-it-loads) ve HTML loading fallback’lerini content ile değiştiren inline `<script>` tag’lerini de beraberinde gönderir.

  * **optional** `onShellError`: Initial shell render edilirken bir hata oluşursa tetiklenen bir callback. Error’ı argüman olarak alır. Stream’den henüz hiç byte emit edilmemiştir ve ne `onShellReady` ne de `onAllReady` çağrılır; bu yüzden [fallback HTML shell output edebilirsiniz](#recovering-from-errors-inside-the-shell).

  * **optional** `progressiveChunkSize`: Bir chunk içindeki byte sayısı. [Default heuristic hakkında daha fazla okuyun.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
=======
* **optional** `options`: An object with streaming options.
  * **optional** `bootstrapScriptContent`: If specified, this string will be placed in an inline `<script>` tag.
  * **optional** `bootstrapScripts`: An array of string URLs for the `<script>` tags to emit on the page. Use this to include the `<script>` that calls [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omit it if you don't want to run React on the client at all.
  * **optional** `bootstrapModules`: Like `bootstrapScripts`, but emits [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) instead.
  * **optional** `formState`: The form state from a form submission handled by a [Server Function](/reference/rsc/server-functions). If the page is rendered in response to a submission of a form that uses [`useActionState`](/reference/react/useActionState) with a `permalink`, pass the resulting form state so that React embeds it into the HTML for hydration. The same value must be passed to [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) on the client. This is typically passed through by your framework.
  * **optional** `identifierPrefix`: A string prefix React uses for IDs generated by [`useId`.](/reference/react/useId) Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **optional** `importMap`: An [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) object with `imports` and `scopes` properties. React emits it as an inline `<script type="importmap">` tag before any module scripts, so that `<script type="module">` tags (for example, from `bootstrapModules`) can use bare module specifiers. <CanaryBadge /> When `nonce` is set, it is also applied to the import map script.
  * **optional** `maxHeadersLength`: The maximum total length of the header content passed to `onHeaders`, measured in UTF-16 code units. Defaults to 2000. Once the limit is reached, React stops adding resource hints to the headers.
  * **optional** `namespaceURI`: A string with the root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) for the stream. Defaults to regular HTML. Pass `'http://www.w3.org/2000/svg'` for SVG or `'http://www.w3.org/1998/Math/MathML'` for MathML.
  * **optional** `nonce`: A [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string to allow scripts for [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). To use different nonces for scripts and styles, pass an object with `script` and `style` properties instead.
  * **optional** `onAllReady`: A callback that fires when all rendering is complete, including both the [shell](#specifying-what-goes-into-the-shell) and all additional [content.](#streaming-more-content-as-it-loads) You can use this instead of `onShellReady` [for crawlers and static generation.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) If you start streaming here, you won't get any progressive loading. The stream will contain the final HTML.
  * <CanaryBadge /> **optional** `onBrowserBailout`: A callback React calls when it recovers from [`browser()`](/reference/react-dom/browser) by leaving a Suspense fallback for the browser to replace. It receives an `Error` describing the browser-only render and an `errorInfo` object containing the `componentStack`. If a reason was passed to `browser`, it is available as `error.cause`. By default, React does nothing. [See how to report browser-only rendering.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **optional** `onError`: A callback that fires whenever there is a server error, whether [recoverable](#recovering-from-errors-outside-the-shell) or [not.](#recovering-from-errors-inside-the-shell) By default, this only calls `console.error`. If you override it to [log crash reports,](#logging-crashes-on-the-server) make sure that you still call `console.error`. You can also use it to [adjust the status code](#setting-the-status-code) before the shell is emitted.
  * **optional** `onHeaders`: A callback that fires when React has determined the resource hints for the document, such as preconnects and stylesheet, font, or high-priority image preloads. It receives an object with a `Link` property containing the corresponding [`Link` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/link) value, so you can send it as an HTTP response header or as a [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) response. React calls it even when there are no resource hints to send. The header content is capped by `maxHeadersLength`.
  * **optional** `onShellReady`: A callback that fires right after the [initial shell](#specifying-what-goes-into-the-shell) has been rendered. You can [set the status code](#setting-the-status-code) and call `pipe` here to start streaming. React will [stream the additional content](#streaming-more-content-as-it-loads) after the shell along with the inline `<script>` tags that replace the HTML loading fallbacks with the content.
  * **optional** `onShellError`: A callback that fires if there was an error rendering the initial shell.  It receives the error as an argument. No bytes were emitted from the stream yet, and neither `onShellReady` nor `onAllReady` will get called, so you can [output a fallback HTML shell.](#recovering-from-errors-inside-the-shell)
  * **optional** `progressiveChunkSize`: The number of bytes in a chunk. [Read more about the default heuristic.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290


#### Dönüş Değeri {/*returns*/}

`renderToPipeableStream` objeleri iki yöntemle döndürür:

* `pipe` işlemi, HTML'i sağlanan [Yazılabilir Node.js Stream](https://nodejs.org/api/stream.html#writable-streams)'ini çıktı olarak verir. Streami etkinleştirmek istiyorsanız `onShellReady`'de veya tarayıcılar ve statik oluşturma için `pipe`'ı çağırın .
* `abort` [Sunucu renderini iptal etmenizi](#aborting-server-rendering) ve geri kalanını istemci üzerinde render etmenizi sağlar.

---

## Kullanım {/*usage*/}

### React ağaıcını HTML olarak Node.js Streamde render etmek {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

React ağacını HTML olarak [Node.js Stream](https://nodejs.org/api/stream.html#writable-streams)'e render etmek için `renderToPipeableStream`'i çağırın:

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// Route handler syntax backend framework'ünüze bağlıdır
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```


<CodeStep step={1}>Root bileşeniniz</CodeStep> ile birlikte, <CodeStep step={2}>başlangıç `<script>` yolları</CodeStep> listesi sağlamanız gerekmektedir. Root bileşeniniz **root`<html>` etiketi olmak üzere tüm belgeyi dönmelidir.**

Örneğin, böyle gözükebilir:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Benim Uygulamam</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```
React [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)'ı ve <CodeStep step={2}>başlangıç `<script>` etiketlerini</CodeStep> sonuç HTML streamine enjekte edecektir.

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... Bileşenlerinizden oluşturulan HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

İstemcide, başlangıç betiğinizin [tüm `document`'ı `hydrateRoot` çağrısıyla hidrasyon etmesi gerekir:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Bu işlem olay yöneticisi dinleyicilerini sunucu tarafından oluşturulan HTML'e bağlar ve interaktif olmasını sağlar.

<DeepDive>

#### CSS ve JS varlık yollarını derleme çıktısından {/*reading-css-and-js-asset-paths-from-the-build-output*/}

En son oluşturulan varlık URL'leri (JavaScript ve CSS dosyaları gibi) genellikle derleme sonrasında şifrelenir. Örneğin `styles.css` yerine `styles.123456.css` gibi bir sonuç alırsınız. Statik varlık adlarını şifrelemek, aynı varlığın her farklı yapısının farklı bir dosya adı alacağını kesinleştirir. Bu işlem statik varlıklarda güvenle uzun dönem önbelleğe alma işlemini etkinleştirmenizi sağlar: belli bir ada sahip olan bir dosya içeriği asla değiştirmez.

Ancak, varlık URL'lerini derleme sonrasına kadar bilmiyorsanız, onları kaynak kodun içine koymanızın bir yolu yoktur. Örneğin, `"/styles.css"`'i sabit olarak JSX'e vermek işe yaramayacaktır. Kaynak kodunuzdan uzakta tutmak için root bileşeniniz, prop olarak gönderilen bir mapden gerçek dosya adlarını okuyabilir:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

Sunucuda, `<App assetMap={assetMap} />`'i render edin ve varlık URL'leri ile birlikte `assetMap`'i iletin:

```js {1-5,8,9}
// Bu JSON'ı derleme aracınızdan almanız gerekiyor, ör. derleme çıktısından okuyun
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Artık sunucunuz `<App assetMap={assetMap} />` bileşenini render ettiğine göre hidrasyon hatalarını engellemek için istemcinizde de `assetMap`'i  render etmeniz gerekiyor. `assetMap`'i şu şekilde seri hale getirip istemcinize iletebilirsiniz:

```js {9-10}
// Bu JSON'ı derleme aracınızdan almanız gerekiyor.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Dikkat: Veri kullanıcı tarafından oluşturulmadığı için stringfy() yapmanız güvenlidir.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Yukarıdaki örnekte, `bootstrapScriptContent` seçeneği istemcide global `window.assetMap` değişkenini ayarlayan ek bir iç içe  `<script>` etiketi ekler. Bu, istemci kodunun aynı `assetMap`'i okumasını sağlar:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Sunucu ve istemci aynı `assetMap` propuna sahip `App` bileşenini render ettiği için hidrasyon hatası olmaz.

</DeepDive>

---

### Yüklenirken daha fazla içeriği stream etmek {/*streaming-more-content-as-it-loads*/}

Stream işlemi, tüm veriler sunucudan henüz yüklenmemiş olsa bile kullanıcının içeriği görmesini sağlar. Örneğin, bir kapağın, arkadaş ve fotoğrafların bulunduğu kenar çubuğunun ve gönderilerin listelendiği bir profil sayfası düşünün:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />` bileşeni için gereken verilerin yüklenirken zaman aldığını düşünün. Tercihen, kullanıcıya gönderilerin yüklenmesini beklemeden profil sayfasının içeriğini göstermek isterseniz. Bunu yapabilmek için [`Posts`'u `<Suspense>` sınırıyla sarın:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Bu işlem React'a `Posts` verileri yüklenmeden HTML'i stream etmesini söyler. React HTML'i önce yükleme fallback (`PostsGlimmer`)'e gönderir, daha sonra `Posts` verilerini yüklediğinde, React kalan HRML'i yükleme fallback'inin yerini alması için satır içi `<script>` etiketiyle gönderir. Kullanıcın açısından, sayfada önce `PostsGlimmer` görünür daha sonra `Posts` yerini alır.

Daha ayrıntılı bir yükleme dizisi oluşturmak için [`<Suspense>` sınırlarını iç içe geçirebilirsiniz](/reference/react/Suspense#revealing-nested-content-as-it-loads)

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Bu örnekte, React sayfayı stream etmeye daha da önce başlayabilir. `<Suspense>` sınırlarıyla sarılmadıkları için sadece `ProfileLayout` ve `ProfileCover` render işlemini tamamlamalılardır. Ancak, `Sidebar`, `Friends`, ve `Photos`'un veri yüklemesi gerekiyorsa, React bunun yerine `BigSpinner` fallbackine HTML'i gönderir. Daha sonra, veriler yüklendikçe, tümü görünür olana kadar içerikler görüntülenmeye başlayacaktır.

Stream işleminin, React'ın tarayıcıya yüklenmesini veya uygulamanızın etkileşimli hale gelmesini beklemesine gerek yoktur. Sunucu tarafından gönderilen HTML içeriği diğer `<script>` etiketleri yüklenene kadar aşamalı bir şekilde gösterilecektir.

[HTML streaminin nasıl çalıştığı hakkında daha fazla bilgi edinin.](https://github.com/reactwg/react-18/discussions/37)

<Note>

Yalnızca [`use`](/reference/react/use) ile okunan bir Promise gibi, [Suspense boundary’yi aktive eden](/reference/react/Suspense#what-activates-a-suspense-boundary) bir kaynaktan okunan data rendering sırasında suspend olur. Suspense, bir Effect veya event handler içinde fetch edilen data’yı detect etmez.

</Note>

---

### Shell'e neyin gideceğini belirleme {/*specifying-what-goes-into-the-shell*/}

Uygulamanızda `<Suspense>` sınırları dışında kalan parçaya *shell adı verilir:*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Kullanıcı tarafından görülebilecek en erken yükleme durumunu belirler:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Tüm uygulamanızı root içinde `<Suspense>` sınırlarıyla sararsanız, shell sadece o dönme göstergesini içerecektir. Ancak, bu durum kullanıcı deneyimi açısından hoş karşılanmayabilir çünkü ekranda sadece dönme göstergesini görmek sayfanın yavaş olduğunu ve bira bekleyip ekranın gerçek halini görmekten daha can sıkıcı hissettirebilir. Bu yüzden `<Suspense>` sınırlarını shellin *minimal ama tamamlanmış*--tüm sayfa düzeninin iskeleti gibi hissedildiği yerlere yerleştirmek isteyeceksiniz.

Bütün shell render edildikten sonra `onShellReady` callbacki çağırılır. Genelde, stremi bu aşamadan sonra başlatırsınız:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

`onShellReady` çağırıldığında, `<Suspense>` sınırları içinde iç içe geçmiş bileşenlerde veriler hala yükleniyor olabilir.

---

### Sunucudaki çökmelerini günlüğe kaydetme {/*logging-crashes-on-the-server*/}

Varsayılan olarak, sunucudaki tüm hatalar konsolda günlüğe alınır. Bu davranışı çökme raporlarını günlüğe almak için geçersiz kılabilirsiniz:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Kişiselleştirilmiş `onError` olay yöneticisi kullanacaksanız yukarıdaki gösterildiği gibi hataları da günlüğe kaydedin.

---

### Shell içindeki hatalardan kurtulma {/*recovering-from-errors-inside-the-shell*/}

Bu örnekte, shell `ProfileLayout`, `ProfileCover` ve `PostGlimmer` bileşenlerini içeriyor:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Bu bileşenleri render ederken bir hata oluşursa, React kullanıcıya gönderebileceği anlamlı bir HTML'e sahip olamayacaktır. Son çare olarak, sunucu tarafında oluşturmaya bağlı olmayan yedek bir HTML göndermek için `onShellError`'u geçersiz kılın:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Shell'i oluştururken bir hata oluşursa, hem `onError` hem de `onShellError` çağırılacaktır. `onError`'u hata raporu oluşturmada, `onShellError`'u da yedek HTML belgesini göndermek için kullanın. Yedek HTML'iniz hata sayfası olmak zorunda değildir. Bunun yerine, uygulamanızı sadece istemci tarafında render eden alternatif bir shell dahişl edebilirsiniz.

---

### Shell dışındaki hatardan kurtulma {/*recovering-from-errors-outside-the-shell*/}

Bu örnekte, `<Posts />` bileşeni `<Suspense>` ile sarılmıştır o yüzden shellin bir parçası *değildir*:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` bileşeninde veya onun içinde herhangi bir yerde hata oluşursa, React [bunu gidermeye çalışacaktır:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Bu, en yakın `<Suspense>` sınırlayıcısı (`PostsGlimmer`) için yükleme yedeklemesini HTML içinde yayımlayacaktır.
2. Sunucu içinde `Posts` içeriğini render etmekten "vazgeçecektir."
3. JavaScript kodu istemci tarafında yüklendiğinde, React `Posts`'u istemci tarafında render etmeyi *deneyecektir*.

İstemcide `Posts`'un yeniden render edilmesi de başarısız olursa, React istemci tarafında hata verecektir. Render sırasında bütün hatalar gönderilince, [en yakın üst hata sınırı](/reference/react/Component#static-getderivedstatefromerror) hatanın kullanıcıya nasıl gösterileceğine karar verir. Pratikte, hatanın giderilemez olduğu kesinleşene kadar kullanıcı yükleme çubuğunu görür.

İstemci tarafında `Posts`'un yeniden render edilmesi başarılı olursa, sunucu tarafındaki yükleme yedeği istemcideki render çıktısıyla değiştirilir. Bu sayede, kullanıcı sunucuda hata olup olmadığını bilemez. Ancak, sunucunun `onError` callbacki ve istemcinin[`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) callbackleri çalışacağı için bir hata olduğunda haberiniz olacaktır.

---

### Durum kodunu ayarlama {/*setting-the-status-code*/}

Stream işlemi bir takas sunar. Sayfayı stream etmeye hemen başlamalısınız ki kullanıcı da o kadar erken içeriği görebilsin. Ancak, stream işlemine bir kez başladığınızda, cevabın durum kodunu ayarlayamazsınız.

Uygulamanızı shell'e (tüm `<Suspense>` sınırlayıcılarının üstünde) ve geri kalan içerik olarak [böldüğünüzde](#specifying-what-goes-into-the-shell) bu sorunun bir kısmını çözmüş olursunuz. Shell hata verirse, `onShellError` callbackiyle hata durum kodunu görebilirsiniz. Diğer türlü, uygulamanız istemci üzerinde hatadan kurtulabilir ve siz de "OK" durum kodunu gönderebilirsiniz.

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Bir şey yanlış gitti.</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Bileşen shell'in *dışındaysa* (ör. `<Suspense>` sınırlayıcısı içinde) hata gönderilir, React render etmeye devam eder. Bu, `onError` callbackinin çağırılacağını ancak yine de `onShellError` yerine `onShellReady`callbacki alacağınız anlamına gelir. Bunun sebebi React, istemci tarafında [yukarıda açıklandığı gibi](#recovering-from-errors-outside-the-shell) hatadan kurtulmaya çalışacaktır.

Ancak isterseniz, bir şeyin hata verdiği gerçeğini kullanarak durum kodunu ayarlayabilirsiniz:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Bir şey yanlış gitti.</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Bu, sadece başlangıç shell içeriğini oluştururken oluşan shell dışındaki hataları yakalayacaktır, o yüzden kapsamlı değildir. Bir içerikte hata olup olmadığı bilgisi önemliyse, shell içine taşıyabilirsiniz.

---

### Farklı hataları farklı yollarla çözme {/*handling-different-errors-in-different-ways*/}

Hangi hatanın verildiğini görmek için [kendi `onError` alt sınıfızı oluştabilirsiniz](https://javascript.info/custom-errors) veya
[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operatörünü kullanabilirsiniz. Örneğin, kişiselleştirilmiş `NotFoundError`'u tanımayabilirsiniz ve bileşeninizden çalıştırabilirsiniz. Daha sonra `onError`, `onShellReady` ve `onShellError` callbackleri hata tipine göre farklı işlemler yapabilir:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Bir şey yanlış gitti.</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Shelli yayımladığınızda ve stream işlemine başladığınızda durum kodunu değiştiremeyeceğinizi unutmayın.

---

### Tarayıcılar ve statik oluşturma için tüm içerikleri bekleme {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Stream işlemi daha iyi bi kullanıcı deneyimi sunar çünkü kullanıcı, içerik olur olmaz içeriği görebilir.

Ancak, tarayıcılar sayfanızı ziyaret ederken veya derleme zamanında sayfayı oluşturuyorsanız, aşamalı bir şekilde göstermek yerine içeriğin tamamının önce yüklenmesine izin verip ardından nihai HTML çıktısını oluşturmayı tercih edebilirsiniz.

`onAllReady` callbackini kullanarak bütün içeriğin yüklenmesini bekleyebilirsiniz:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ...bot tespit stratejinize bağlı

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Bir şey yanlış gitti.</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Düzenli bir ziyaretçi aşamalı şekilde yüklenen içerik streamine sahip olacaktır. Tarayıcı nihai HTML çıktısını tüm veriler yüklendikten sonra alacaktır. Ancak bu, tarayıcının *bütün* veriyi beklemesi anlamnına geliyor, bazılarının yüklenmesi yavaş olabilir veya hata olabilir. Uygulamanıza bağlı olarak, shelli de tarayıcınıza göndermeyi tercih edebilirsiniz.

---

### Sunucu tarafında render işlemini iptal etme {/*aborting-server-rendering*/}

Zaman aşımı sonrası sunucunuzun render işleminden "vazgeçmeye" zorlayabilirsiniz:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React kalan yükleme yedeklerini HTML olarak temizleyecek ve geri kalanını istemcide render etmeyi deneyecektir.
