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
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Genel Bakış {#overview}

Aşağıdaki metotlar hem sunucu hem de tarayıcı ortamlarında kullanılabilir:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Bu ilave metotlar **yalnızca sunucuda** kullanılabilen bir pakete (stream) bağlıdır ve tarayıcıda çalışmayacaktır.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referans {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

React öğesini başlangıç HTML'ine dönüştürün. React bir HTML stringi döndürür. Sunucuda HTML oluşturmak ve daha hızlı sayfa yüklemeleri için ilk istek üzerine işaretlemeyi göndermek ve arama motorlarının sayfalarınızı SEO amacıyla taramasını sağlamak için bu yöntemi kullanabilirsiniz.

<<<<<<< HEAD

Zaten sunucu tarafından oluşturulmuş işaretlemeye sahip olan bir birimde [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)'i çağırırsanız, gayet performanslı bir ilk yükleme deneyimine sahip olmanız için React bunu saklayıp, yalnızca olay yöneticilerini ekleyecektir.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

[`renderToString`](#rendertostring)'e benzer şekildedir. Farklı olarak, React'in `data-reactroot` gibi dahili olarak kullandığı fazladan DOM nitelikleri oluşturmaz. Bu, ekstra özellikleri bir kenara atarak biraz bayt kurtarabileceğiniz için, React'i basit bir statik sayfa oluşturucu olarak kullanmak isterseniz yararlıdır.

<<<<<<< HEAD
İşaretlemeyi etkileşimli hale getirmek için istemci tarafında React'i kullanmayı planlıyorsanız, bu yöntemi kullanmayın. Onun yerine, sunucuda [`renderToString`](#rendertostring) ve istemcide [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) kullanın.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
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
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React öğesini başlangıç HTML'ine dönüştürün. React bir HTML string çıktısı veren bir [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) döndürür. Bu akışın HTML çıktısı [`ReactDOMServer.renderToString`](#rendertostring) öğesinin döndüreceği değer ile tamamen aynıdır. Sunucuda HTML oluşturmak ve daha hızlı sayfa yüklemeleri için ilk istek üzerine işaretlemeyi göndermek ve arama motorlarının sayfalarınızı SEO amacıyla taramasını sağlamak için bu yöntemi kullanabilirsiniz.

<<<<<<< HEAD
Zaten sunucu tarafından oluşturulmuş işaretlemeye sahip olan bir birimde [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)'i çağırırsanız, gayet performanslı bir ilk yükleme deneyimine sahip olmanız için React bunu saklayıp, yalnızca olay yöneticilerini ekleyecektir.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Not:
>
> Yalnızca sunucu için. Bu API tarayıcıda mevcut değildir.
>
> Bu metot utf-8 ile kodlanmış bir bayt akışı (byte stream) döndürür. Başka bir kodlamadaki bir akışa ihtiyacınız varsa, kod dönüştürme metni için dönüştürme akışları (transform streams) sağlayan [iconv-lite](https://www.npmjs.com/package/iconv-lite) gibi bir projeye göz atın.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

[`renderToNodeStream`](#rendertonodestream)'e benzer şekildedir. Farklı olarak, React'in `data-reactroot` gibi dahili olarak kullandığı fazladan DOM nitelikleri oluşturmaz. Bu, ekstra özellikleri bir kenara atarak biraz bayt kurtarabileceğiniz için, React'i basit bir statik sayfa oluşturucu olarak kullanmak isterseniz yararlıdır.

Bu akışın HTML çıktısı [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) öğesinin döndüreceği değer ile tamamen aynıdır.

<<<<<<< HEAD
İşaretlemeyi etkileşimli hale getirmek için istemci tarafında React'i kullanmayı planlıyorsanız, bu yöntemi kullanmayın. Onun yerine, sunucuda [`renderToNodeStream`](#rendertonodestream) ve istemcide [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) kullanın.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Not:
>
> Yalnızca sunucu için. Bu API tarayıcıda mevcut değildir.
>
> Bu metot utf-8 ile kodlanmış bir bayt akışı (byte stream) döndürür. Başka bir kodlamadaki bir akışa ihtiyacınız varsa, kod dönüştürme metni için dönüştürme akışları (transform streams) sağlayan [iconv-lite](https://www.npmjs.com/package/iconv-lite) gibi bir projeye göz atın.
