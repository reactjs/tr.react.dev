---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` nesnesi, bileşenleri statik işaretlemeye dönüştürmenizi sağlar. Genellikle, bir Node sunucusunda kullanılır:

```js
// ES modules
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Genel Bakış {#overview}

Bu metotlar yalnızca **[Node.js Akışlarını](https://nodejs.org/api/stream.html) içeren ortamlarda** mevcuttur:

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

Bu metotlar sadece **[Web Akışları'nın](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) olduğu ortamlarda** (tarayıcılar, Deno, ve bazı modern runtime lar) kullanılabilir:

- [`renderToReadableStream()`](#rendertoreadablestream)

Aşağıdaki metotlar akışları (stream) desteklemeyen ortamlarda kullanılabilir:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

* * *

## Referans {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

> Try the new React documentation for [`renderToPipeableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

> Try the new React documentation for [`renderToReadableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

> Try the new React documentation for [`renderToNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React öğesini başlangıç HTML'ine dönüştürün. React bir HTML string çıktısı veren bir [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) döndürür. Bu akışın HTML çıktısı [`ReactDOMServer.renderToString`](#rendertostring) öğesinin döndüreceği değer ile tamamen aynıdır. Sunucuda HTML oluşturmak ve daha hızlı sayfa yüklemeleri için ilk istek üzerine işaretlemeyi göndermek ve arama motorlarının sayfalarınızı SEO amacıyla taramasını sağlamak için bu yöntemi kullanabilirsiniz.

Zaten sunucu tarafından oluşturulmuş işaretlemeye sahip olan bir birimde [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot)'i çağırırsanız, gayet performanslı bir ilk yükleme deneyimine sahip olmanız için React bunu saklayıp, yalnızca olay yöneticilerini ekleyecektir.

> Not:
>
> Yalnızca sunucu için. Bu API tarayıcıda mevcut değildir.
>
> Bu metot utf-8 ile kodlanmış bir bayt akışı (byte stream) döndürür. Başka bir kodlamadaki bir akışa ihtiyacınız varsa, kod dönüştürme metni için dönüştürme akışları (transform streams) sağlayan [iconv-lite](https://www.npmjs.com/package/iconv-lite) gibi bir projeye göz atın.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

> Try the new React documentation for [`renderToStaticNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

[`renderToNodeStream`](#rendertonodestream)'e benzer şekildedir. Farklı olarak, React'in `data-reactroot` gibi dahili olarak kullandığı fazladan DOM nitelikleri oluşturmaz. Bu, ekstra özellikleri bir kenara atarak biraz bayt kurtarabileceğiniz için, React'i basit bir statik sayfa oluşturucu olarak kullanmak isterseniz yararlıdır.

Bu akışın HTML çıktısı [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) öğesinin döndüreceği değer ile tamamen aynıdır.

İşaretlemeyi etkileşimli hale getirmek için istemci tarafında React'i kullanmayı planlıyorsanız, bu yöntemi kullanmayın. Onun yerine, sunucuda [`renderToNodeStream`](#rendertonodestream) ve istemcide [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) kullanın.

> Not:
>
> Yalnızca sunucu için. Bu API tarayıcıda mevcut değildir.
>
> Bu metot utf-8 ile kodlanmış bir bayt akışı (byte stream) döndürür. Başka bir kodlamadaki bir akışa ihtiyacınız varsa, kod dönüştürme metni için dönüştürme akışları (transform streams) sağlayan [iconv-lite](https://www.npmjs.com/package/iconv-lite) gibi bir projeye göz atın.

* * *

### `renderToString()` {#rendertostring}

> Try the new React documentation for [`renderToString`](https://beta.reactjs.org/reference/react-dom/server/renderToString).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToString(element)
```

React öğesini başlangıç HTML'ine dönüştürün. React bir HTML stringi döndürür. Sunucuda HTML oluşturmak ve daha hızlı sayfa yüklemeleri için ilk istek üzerine işaretlemeyi göndermek ve arama motorlarının sayfalarınızı SEO amacıyla taramasını sağlamak için bu yöntemi kullanabilirsiniz.

Zaten sunucu tarafından oluşturulmuş işaretlemeye sahip olan bir birimde [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot)'i çağırırsanız, gayet performanslı bir ilk yükleme deneyimine sahip olmanız için React bunu saklayıp, yalnızca olay yöneticilerini ekleyecektir.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

> Try the new React documentation for [`renderToStaticMarkup`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticMarkup).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

[`renderToString`](#rendertostring)'e benzer şekildedir. Farklı olarak, React'in `data-reactroot` gibi dahili olarak kullandığı fazladan DOM nitelikleri oluşturmaz. Bu, ekstra özellikleri bir kenara atarak biraz bayt kurtarabileceğiniz için, React'i basit bir statik sayfa oluşturucu olarak kullanmak isterseniz yararlıdır.

İşaretlemeyi etkileşimli hale getirmek için istemci tarafında React'i kullanmayı planlıyorsanız, bu yöntemi kullanmayın. Onun yerine, sunucuda [`renderToString`](#rendertostring) ve istemcide [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) kullanın.
