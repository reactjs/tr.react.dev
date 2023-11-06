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

* **isteğe bağlı** `options`: Stream seçenekleri olan bir nesne.
  * **isteğe bağlı** `bootstrapScriptContent`: Eğer belirtilmişse, bu string satır içi `<script>` etiketinin içine yerleştirilecektir.
  * **isteğe bağlı** `bootstrapScripts`: `<script>` etiketlerinin sayfada yayınlayacağı string tipindeki URL'lerin dizisi. Kullanmak için, [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)'u çağıran `<script>` etiketiketine dahil edin. React'ı istemci üzerinde çalıştırmak istemiyorsanız atlayınız.
  * **isteğe bağlı** `bootstrapModules`: `bootstrapScripts` gibidir, ancak [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) çıktısı verir.
  * **isteğe bağlı** `identifierPrefix`: React tarafından [`useId`](/reference/react/useId) ile üretilen ID'ler için kullanılan ön ektir. Aynı sayfada birden fazla kök kullanılıyorsa karışıklıkları önlemek için uygundur. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)'a gönderilen ön ek ile aynı olmalıdır.
  * **isteğe bağlı** `namespaceURI`: Stream için kök [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) olan bir stringtir. Standart HTML'de varsayılandır. SVG için `'http://www.w3.org/2000/svg'` ya da MathML için `'http://www.w3.org/1998/Math/MathML'` iletin.
  * **isteğe bağlı** `nonce`: [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) stringi, [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) scriptlerine izin vermek için kullanılır. 
  * **isteğe bağlı** `onAllReady`: [shell](#specifying-what-goes-into-the-shell) ve tüm ek [content](#streaming-more-content-as-it-loads)'ler de dahil olmak üzerebütün render işlemi tamamlandığında çağırılan callbacktir. `onShellReady` [tarayıcılar ve statik oluşturma için](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) yerine kullanabilirsiniz. Streami buradan başlatırsanız, herhangi bir aşamalı yükleme almayacaksınız. Stream, en son HTML'i içerecektir.
  * **isteğe bağlı** `onError`: [Kurtarılabilir](#recovering-from-errors-outside-the-shell) veya [kurtarılamaz](#recovering-from-errors-inside-the-shell) sunucu hatalarında çağırılan callbacktir. Varsayılan olarak sadece `console.error`'u çağırır. [Günlük kitlenme raporularına](#logging-crashes-on-the-server) olarak geçersiz kılsanız bile `console.error`'u çağırdığınızdan emin olun. Ayrıca shell yayınlanmadan önce [durum kodunu ayarlamak](#setting-the-status-code) için de kullanabilirsiniz.
  * **isteğe bağlı** `onShellReady`: [Başlangıç shell](#specifying-what-goes-into-the-shell)'i render edildikten hemen sonra çağırılan callbacktir.  [Durum kodunu ayarlamak](#setting-the-status-code) ve streami başlatmak için `pipe`'ı çağırabilirsiniz. React shellden sonra [ek contentleri stream](#streaming-more-content-as-it-loads) edecektir ve bu contentleri HTML yükleme fallbacklerini değiştiren `<script>` etiketleriyle birlikte stream edecektir.
  * **isteğe bağlı** `onShellError`: Başlangıç shelli render edilirken bir hata varsa çağırılan callbacktir. Hatayı argüman olarak alır. Stream için herhangi bir byte yayınlanmaz ve `onShellReady` ya da  `onAllReady` çağırılmaz. Böylece [bir HTML shellinin fallback çıktısını](#recovering-from-errors-inside-the-shell) alabilirsiniz.
  * **isteğe bağlı** `progressiveChunkSize`: Yığındaki byte sayısıdır. [Varsayılan buluşsal yöntem hakkında daha fazlasını okuyun.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


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

// Route handler syntax backend çatınıza bağlıdır
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

**Sadece Suspense özelliğine sahip veri kaynakları Suspense bileşenini etkinleştirir.** Şunları içerir:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ve [Next.js](https://nextjs.org/docs/getting-started/react-essentials) gibi Suspense özelliği etkin çatılarda veri alma 
- [`lazy`](/reference/react/lazy) ile bileşen kodunu temvel yükleme (lazy-loading).
- [`use`](/reference/react/use) ile bir Promise'in değerini okuma.

Effect veya olay yöneticisi içinde veri alınırken Suspense **tespit edilmez**.

Yukarıdaki `Posts` bileşenininde veri almanın tam yolu çatınıza bağlıdır. Suspense özelliği etkin bir çatı kullanırsanız, detayları çatınızın veri alma dokümantasyonunun içinde bulabilirsiniz.

Kanaat sahibi bir çatı (opinionated framework) olmadan Suspense özelliği etkin veri çekme henüz desteklenmemektedir. Suspense özellikli bir veri kaynağının uygulanmasına yönelik gereksinimler stabil değildir ve dokümantasyonu yoktur. React'ın sonraski sürümlerinde, veri kaynaklarını Suspense ile entegre etmek için resmi bir API yayınlanacaktır.

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

<<<<<<< HEAD
`Posts` bileşeninde veya onun içinde herhangi bir yerde hata oluşursa, React [ondan kurtulmaya çalışacaktır:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)
=======
If an error happens in the `Posts` component or somewhere inside it, React will [try to recover from it:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)
>>>>>>> a8790ca810c1cebd114db35a433b90eb223dbb04

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

### Tarayıcılar ve statik oluşturma için tüm içerikleri bekleme  {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

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
    response.send('<h1>Bir şey ters gitti.</h1>'); 
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
