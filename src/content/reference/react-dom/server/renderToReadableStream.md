---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream`, bir React tree’yi bir [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) olarak render eder.

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Bu API, [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) üzerine bağımlıdır. Node.js için bunun yerine [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) kullanın.

</Note>

---

## Referans {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

`renderToReadableStream` fonksiyonunu çağırarak React tree’nizi HTML olarak bir [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) içine render edebilirsiniz.

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Client tarafında, server tarafından oluşturulan HTML’i interaktif hale getirmek için [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) fonksiyonunu çağırın.

[Daha fazla örneği aşağıda inceleyin.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: HTML’e render etmek istediğiniz bir React node. Örneğin `<App />` gibi bir JSX element’i. Bunun tüm dokümanı temsil etmesi beklenir, bu yüzden `App` component’i `<html>` etiketini render etmelidir.

* **opsiyonel** `options`: Stream için yapılandırma seçeneklerini içeren bir obje.  
  * **opsiyonel** `bootstrapScriptContent`: Belirtilirse, bu string inline bir `<script>` etiketi içinde yer alır.  
  * **opsiyonel** `bootstrapScripts`: Sayfada emit edilecek `<script>` etiketleri için string URL’lerden oluşan bir dizi. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) fonksiyonunu çağıran `<script>`’i eklemek için bunu kullanın. React’in client tarafında çalışmasını istemiyorsanız bunu boş bırakın.  
  * **opsiyonel** `bootstrapModules`: `bootstrapScripts` gibi, ancak [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) olarak emit eder.  
  * **opsiyonel** `identifierPrefix`: [`useId`](/reference/react/useId) tarafından üretilen ID’ler için React’in kullandığı string önek. Aynı sayfada birden fazla root kullanırken çakışmaları önlemek için faydalıdır. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) ile verilen önek ile aynı olmalıdır.  
  * **opsiyonel** `namespaceURI`: Stream için root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) string’i. Varsayılan olarak normal HTML. SVG için `'http://www.w3.org/2000/svg'` veya MathML için `'http://www.w3.org/1998/Math/MathML'` geçebilirsiniz.  
  * **opsiyonel** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) için script’lere izin vermek amacıyla bir [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string’i.  
  * **opsiyonel** `onError`: Server’da bir hata oluştuğunda tetiklenen callback. Hata [recoverable](#recovering-from-errors-outside-the-shell) veya [non-recoverable](#recovering-from-errors-inside-the-shell) olabilir. Varsayılan olarak sadece `console.error` çağrılır. Bunu [crash raporlarını loglamak için](#logging-crashes-on-the-server) override ederseniz, yine de `console.error` çağırdığınızdan emin olun. Ayrıca [shell emit edilmeden önce status kodunu ayarlamak](#setting-the-status-code) için de kullanabilirsiniz.  
  * **opsiyonel** `progressiveChunkSize`: Bir chunk içindeki byte sayısı. [Varsayılan heuristic hakkında daha fazla bilgi.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)  
  * **opsiyonel** `signal`: [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) ile server render’ı [abort edebilir](#aborting-server-rendering) ve kalan kısmı client’ta render edebilirsiniz.


#### Returns {/*returns*/}

`renderToReadableStream` returns a Promise:

- Eğer [shell](#specifying-what-goes-into-the-shell) render’ı başarılı olursa, bu Promise bir [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) ile çözülür.  
- Eğer shell render’ı başarısız olursa, Promise reddedilir. [Bunu bir fallback shell göstermek için kullanabilirsiniz.](#recovering-from-errors-inside-the-shell)

Return stream’in ek bir özelliği vardır:

* `allReady`: Tüm render işlemi tamamlandığında çözülen bir Promise, bu hem [shell](#specifying-what-goes-into-the-shell) hem de tüm ek [içerik](#streaming-more-content-as-it-loads) için geçerlidir. Response döndürmeden önce `await stream.allReady` yapabilirsiniz [crawlers ve statik üretim için.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Eğer bunu yaparsanız, progressive loading almazsınız. Stream, final HTML’i içerir.

---

## Kullanım {/*usage*/}

### React tree’ini HTML olarak bir Readable Web Stream içine render etmek {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

React tree’nizi HTML olarak bir [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) içine render etmek için `renderToReadableStream` fonksiyonunu çağırın.

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

<CodeStep step={1}>Root component</CodeStep> ile birlikte bir <CodeStep step={2}>bootstrap `<script>` yolları</CodeStep> listesi sağlamanız gerekir.. Root component’iniz **tüm dokümanı, root `<html>` etiketi dahil olmak üzere** döndürmelidir.

Örneğin, şöyle görünebilir:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React, [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) ve <CodeStep step={2}>bootstrap `<script>` etiketlerini</CodeStep> oluşan HTML stream’ine enjekte edecektir:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

Client tarafında, bootstrap script’iniz [tüm `document`’i `hydrateRoot` çağrısı ile hydrate etmelidir:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Bu server tarafından oluşturulan HTML’e event listener’lar ekleyecek ve HTML’i interaktif hale getirecektir.

<DeepDive>

#### Build çıktısından CSS ve JS asset yollarını okumak {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Final asset URL’leri (JavaScript ve CSS dosyaları gibi) genellikle build sonrası hash’lenir. Örneğin, `styles.css` yerine `styles.123456.css` gibi bir dosya ile karşılaşabilirsiniz. Statik asset dosya adlarını hash’lemek, aynı asset’in her farklı build’inin farklı bir dosya adına sahip olmasını garanti eder. Bu faydalıdır çünkü statik assetler için uzun süreli caching’i güvenle etkinleştirmenizi sağlar: belli bir isimdeki dosyanın içeriği hiçbir zaman değişmez.

Ancak, asset URL’lerini build sonrası öğreniyorsanız, bunları kaynak kodunuza koymanın bir yolu yoktur. Örneğin, daha önce JSX içine hardcode edilmiş `"/styles.css"` çalışmaz. Bunları kaynak kodunuzdan çıkarmak için, root component’iniz gerçek dosya adlarını bir prop olarak geçirilen bir map’ten okuyabilir:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Server tarafında, `<App assetMap={assetMap} />` render edin ve asset URL’lerini içeren `assetMap`’inizi geçin:

```js {1-5,8,9}
// Bu JSON’u build aracınızdan almanız gerekir, örneğin build çıktısından okuyabilirsiniz.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Server artık `<App assetMap={assetMap} />` render ettiği için, client tarafında da `assetMap` ile render etmeniz gerekir; aksi takdirde hydration hataları oluşur. `assetMap`’i serialize edip client’a şöyle geçirebilirsiniz:

```js {9-10}
// Bu JSON’u build aracınızdan almanız gerekir.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Dikkat: Bunu stringify() ile güvenle dönüştürebilirsiniz çünkü bu veri kullanıcı tarafından üretilmiş değil.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Yukarıdaki örnekte, `bootstrapScriptContent` seçeneği client tarafında global `window.assetMap` değişkenini ayarlayan ekstra bir inline `<script>` etiketi ekler. Bu sayede client kodu aynı `assetMap`’i okuyabilir:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Hem client hem de server, `App`’i aynı `assetMap` prop’u ile render eder; böylece herhangi bir hydration hatası oluşmaz.

</DeepDive>

---

### İçerik yüklendikçe stream etmek {/*streaming-more-content-as-it-loads*/}

Streaming, kullanıcının tüm veri server’da yüklenmeden önce içeriği görmeye başlamasını sağlar. Örneğin, bir profil sayfasını düşünün; burada bir kapak fotoğrafı, arkadaşlar ve fotoğraflar ile dolu bir yan panel ve bir gönderi listesi gösterilmektedir:

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

Diyelim ki `<Posts />` için veri yüklemesi biraz zaman alıyor. İdeal olarak, gönderileri beklemeden kullanıcıya profil sayfasının geri kalanını göstermek istersiniz. Bunu yapmak için, [Posts’i bir `<Suspense>` sınırına sarın:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Bu, React’e `Posts` verilerini yüklemeden önce HTML’i stream etmeye başlamasını söyler. React önce loading fallback (`PostsGlimmer`) için HTML’i gönderir, ardından `Posts` verilerini yüklemeyi bitirdiğinde kalan HTML’i ve loading fallback’i bu HTML ile değiştiren inline bir `<script>` etiketi gönderir. Kullanıcı perspektifinden bakıldığında, sayfa önce `PostsGlimmer` ile görünür, sonra `Posts` ile değiştirilir.

Daha ayrıntılı bir yükleme sırası oluşturmak için [nested `<Suspense>` sınırları](/reference/react/Suspense#revealing-nested-content-as-it-loads) kullanabilirsiniz:

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


Bu örnekte, React sayfayı çok daha erken stream etmeye başlayabilir. Sadece `ProfileLayout` ve `ProfileCover` öncelikle render’ı tamamlamalıdır, çünkü bunlar herhangi bir `<Suspense>` sınırına sarılmamıştır. Ancak, `Sidebar`, `Friends` veya `Photos` veri yüklemesi gerektiriyorsa, React bunun yerine `BigSpinner` fallback HTML’ini gönderir. Daha fazla veri kullanılabilir hale geldikçe, içerik kademeli olarak gösterilmeye devam eder.

Streaming, React’in browser’da yüklenmesini veya uygulamanızın interaktif hale gelmesini beklemek zorunda değildir. Server’dan gelen HTML içeriği, herhangi bir `<script>` yüklenmeden önce kademeli olarak açığa çıkar.

[Streaming HTML’in nasıl çalıştığı hakkında daha fazla bilgi edinin.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Sadece Suspense destekli veri kaynakları, Suspense component’ini aktif hale getirir.** Bunlar şunları içerir:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ve [Next.js](https://nextjs.org/docs/getting-started/react-essentials) gibi Suspense destekli framework’lerle veri çekme  
- [`lazy`](/reference/react/lazy) ile component kodlarını lazy-load etme  
- [`use`](/reference/react/use) ile bir Promise’in değerini okuma  

Suspense, bir Effect veya event handler içinde veri çekildiğinde **bunu algılamaz**.

Yukarıdaki `Posts` component’inde veriyi nasıl yükleyeceğiniz kullandığınız framework’e bağlıdır. Eğer Suspense destekli bir framework kullanıyorsanız, detaylar veri çekme dokümantasyonunda bulunabilir.

Opinionated bir framework kullanmadan Suspense destekli veri çekme henüz desteklenmemektedir. Suspense destekli bir veri kaynağı uygulamak için gerekenler kararsız ve dokümante edilmemiştir. Suspense ile veri kaynaklarını entegre etmek için resmi bir API, React’in gelecekteki bir sürümünde yayınlanacaktır.

</Note>

---

### Shell’e nelerin dahil edileceğini belirtmek {/*specifying-what-goes-into-the-shell*/}

Herhangi bir `<Suspense>` sınırının dışında kalan uygulama kısmına *shell* denir:

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

Bu, kullanıcının görebileceği en erken yükleme durumunu belirler:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Eğer tüm uygulamayı root’ta bir `<Suspense>` sınırına sararsanız, shell sadece o spinner’ı içerir. Ancak bu hoş bir kullanıcı deneyimi değildir çünkü ekranda büyük bir spinner görmek, biraz daha bekleyip gerçek layout’u görmekten daha yavaş ve can sıkıcı gelebilir. Bu yüzden genellikle `<Suspense>` sınırlarını, shell’in *minimal ama tamamlanmış* hissettirecek şekilde yerleştirirsiniz—tüm sayfa layout’unun bir iskeleti gibi.

`renderToReadableStream` asenkron çağrısı, tüm shell render edildikten hemen sonra bir `stream` ile çözülecektir. Genellikle, o zaman streaming’i başlatır ve o `stream` ile bir response oluşturup döndürürsünüz:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

`stream` döndürüldüğü sırada, iç içe geçmiş `<Suspense>` sınırları içindeki component’ler hâlâ veri yüklüyor olabilir.

---

### Server’da crash’leri loglamak {/*logging-crashes-on-the-server*/}

Varsayılan olarak, server’daki tüm hatalar console’a loglanır. Bu davranışı override ederek crash raporlarını loglayabilirsiniz:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Özel bir `onError` implementasyonu sağlarsanız, yukarıdaki gibi hataları console’a da loglamayı unutmayın.

---

### Shell içindeki hatalardan kurtulmak {/*recovering-from-errors-inside-the-shell*/}

Bu örnekte, shell `ProfileLayout`, `ProfileCover` ve `PostsGlimmer` içerir:

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

Eğer bu component’ler render edilirken bir hata oluşursa, React’in client’a gönderebileceği anlamlı bir HTML olmayacaktır. Son çare olarak server render’a bağlı olmayan bir fallback HTML göndermek için `renderToReadableStream` çağrınızı bir `try...catch` bloğuna sarın:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Eğer shell oluşturulurken bir hata oluşursa, hem `onError` hem de `catch` bloğunuz tetiklenir. Hata raporlaması için `onError`’u, fallback HTML göndermek için ise `catch` bloğunu kullanın. Fallback HTML’inizin bir hata sayfası olması gerekmez. Bunun yerine, uygulamanızı sadece client tarafında render eden alternatif bir shell içerebilirsiniz.

---

### ### Shell dışındaki hatalardan kurtulmak {/*recovering-from-errors-outside-the-shell*/}

Bu örnekte, `<Posts />` component’i `<Suspense>` ile sarılmıştır, bu yüzden shell’in bir parçası **değildir**:

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

Eğer `Posts` component’inde veya içindeki bir yerde hata oluşursa, React [bundan kurtulmayı deneyecektir:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. En yakın `<Suspense>` sınırı (`PostsGlimmer`) için loading fallback HTML’e emit edilir.  
2. Server üzerinde `Posts` içeriğini render etmeye çalışmaktan vazgeçer.  
3. JavaScript kodu client’ta yüklendiğinde, React `Posts`’i client üzerinde *yeniden deneyecektir*.

Eğer client üzerinde `Posts` render’ını yeniden denemek de başarısız olursa, React hatayı client’ta fırlatır. Render sırasında oluşan tüm hatalarda olduğu gibi, [en yakın parent error boundary](/reference/react/Component#static-getderivedstatefromerror) hatayı kullanıcıya nasıl göstereceğinizi belirler. Pratikte, kullanıcı, hatanın geri döndürülemez olduğundan emin olunana kadar bir loading göstergesi görür.

Eğer client üzerinde `Posts` render’ını yeniden denemek başarılı olursa, server’dan gelen loading fallback client render çıktısı ile değiştirilir. Kullanıcı server hatasının farkına varmaz. Ancak, server `onError` callback’i ve client [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) callback’leri tetiklenir, böylece hatadan haberdar olabilirsiniz.

---

### ### Status kodunu ayarlamak {/*setting-the-status-code*/}

Streaming bir takas getirir. Sayfanın içeriğini kullanıcıya daha erken gösterebilmek için mümkün olan en erken zamanda streaming başlatmak istersiniz. Ancak streaming başladıktan sonra response status kodunu artık ayarlayamazsınız.

Uygulamanızı [shell (tüm `<Suspense>` sınırlarının üstünde) ve kalan içerik](#specifying-what-goes-into-the-shell) olarak böldüğünüzde, bu sorunun bir kısmını çözmüş olursunuz. Eğer shell hata verirse, `catch` bloğunuz çalışır ve hata status kodunu ayarlamanıza imkan tanır. Aksi takdirde, uygulamanın client’ta kurtulabileceğini bildiğiniz için "OK" gönderebilirsiniz.

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

If a component *outside* the shell (i.e. inside a `<Suspense>` boundary) throws an error, React will not stop rendering. This means that the `onError` callback will fire, but your code will continue running without getting into the `catch` block. This is because React will try to recover from that error on the client, [as described above.](#recovering-from-errors-outside-the-shell)

However, if you'd like, you can use the fact that something has errored to set the status code:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

This will only catch errors outside the shell that happened while generating the initial shell content, so it's not exhaustive. If knowing whether an error occurred for some content is critical, you can move it up into the shell.

---

### Handling different errors in different ways {/*handling-different-errors-in-different-ways*/}

You can [create your own `Error` subclasses](https://javascript.info/custom-errors) and use the [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator to check which error is thrown. For example, you can define a custom `NotFoundError` and throw it from your component. Then you can save the error in `onError` and do something different before returning the response depending on the error type:

```js {2-3,5-15,22,28,33}
async function handler(request) {
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

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Keep in mind that once you emit the shell and start streaming, you can't change the status code.

---

### Waiting for all content to load for crawlers and static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streaming offers a better user experience because the user can see the content as it becomes available.

However, when a crawler visits your page, or if you're generating the pages at the build time, you might want to let all of the content load first and then produce the final HTML output instead of revealing it progressively.

You can wait for all the content to load by awaiting the `stream.allReady` Promise:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... depends on your bot detection strategy ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

A regular visitor will get a stream of progressively loaded content. A crawler will receive the final HTML output after all the data loads. However, this also means that the crawler will have to wait for *all* data, some of which might be slow to load or error. Depending on your app, you could choose to send the shell to the crawlers too.

---

### Aborting server rendering {/*aborting-server-rendering*/}

You can force the server rendering to "give up" after a timeout:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React will flush the remaining loading fallbacks as HTML, and will attempt to render the rest on the client.
