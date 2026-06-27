---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream`, pre-rendered bir React tree’yi pipeable bir [Node.js Stream](https://nodejs.org/api/stream.html)’e stream eder.

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

Bu API Node.js’e özeldir. Deno ve modern edge runtime’lar gibi [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) bulunan environment’lar bunun yerine [`resume`](/reference/react-dom/server/renderToReadableStream) kullanmalıdır.

</Note>

---

## Reference {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

Pre-rendered bir React tree’yi HTML olarak bir [Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) içine render etmeye devam etmek için `resume` çağırın.

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[Aşağıda daha fazla örnek görün.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: `prerender` ile çağırdığınız React node. Örneğin `<App />` gibi bir JSX element. Tüm document’i temsil etmesi beklenir, bu yüzden `App` component’i `<html>` tag’ini render etmelidir.
* `postponedState`: Bir [prerender API](/reference/react-dom/static/index)’den return edilen opaque `postpone` object’i; bunu nerede sakladıysanız oradan load edilir (örn. redis, bir file veya S3).
* **optional** `options`: Streaming options içeren bir object.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) için script’lere izin veren bir [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string’i.
  * **optional** `signal`: [Server rendering’i abort etmenizi](#aborting-server-rendering) ve geri kalanını client’ta render etmenizi sağlayan bir [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
  * **optional** `onError`: [Recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) olsun veya [olmasın](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell), bir server error olduğunda fire olan bir callback. Default olarak yalnızca `console.error` çağırır. Bunu [crash report’ları loglamak](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) için override ederseniz, yine de `console.error` çağırdığınızdan emin olun.
  * **optional** `onShellReady`: [Shell](#specifying-what-goes-into-the-shell) tamamlandıktan hemen sonra fire olan bir callback. Streaming’i başlatmak için burada `pipe` çağırabilirsiniz. React, shell’den sonra [additional content’i stream eder](#streaming-more-content-as-it-loads) ve HTML loading fallback’lerini content ile değiştiren inline `<script>` tag’lerini de birlikte gönderir.
  * **optional** `onShellError`: Shell render edilirken bir error oluşursa fire olan bir callback. Error’ı argument olarak alır. Stream’den henüz hiçbir byte emit edilmemiştir ve ne `onShellReady` ne de `onAllReady` çağrılır; bu yüzden [fallback HTML shell output edebilir](#recovering-from-errors-inside-the-shell) veya prelude kullanabilirsiniz.


#### Returns {/*returns*/}

`resume` iki method içeren bir object return eder:

* `pipe`, HTML’i sağlanan [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) içine output eder. Streaming’i enable etmek istiyorsanız `pipe`’ı `onShellReady` içinde, crawler’lar ve static generation için ise `onAllReady` içinde çağırın.
* `abort`, [server rendering’i abort etmenizi](#aborting-server-rendering) ve geri kalanını client’ta render etmenizi sağlar.

#### Caveats {/*caveats*/}

- `resumeToPipeableStream`, `bootstrapScripts`, `bootstrapScriptContent` veya `bootstrapModules` için options kabul etmez. Bunun yerine, bu options’ları `postponedState`’i generate eden `prerender` call’una pass etmeniz gerekir. Ayrıca bootstrap content’i writable stream’e manuel olarak inject edebilirsiniz.
- `resumeToPipeableStream`, `identifierPrefix` kabul etmez; çünkü prefix’in hem `prerender` hem de `resumeToPipeableStream` içinde aynı olması gerekir.
- `nonce`, prerender’a sağlanamadığı için, `nonce`’u yalnızca prerender’a script sağlamıyorsanız `resumeToPipeableStream`’e vermelisiniz.
- `resumeToPipeableStream`, tamamen pre-render edilmemiş bir component bulana kadar root’tan başlayarak yeniden render eder. Yalnızca tamamen prerender edilmiş Component’ler (Component ve children’larının prerender işlemi tamamlanmışsa) tamamen skip edilir.

## Usage {/*usage*/}

### Further reading {/*further-reading*/}

Resume etme davranışı `renderToReadableStream` gibi çalışır. Daha fazla örnek için [`renderToReadableStream` usage section](/reference/react-dom/server/renderToReadableStream#usage)’ına bakın.
[`prerender` usage section](/reference/react-dom/static/prerender#usage), özellikle `prerenderToNodeStream`’in nasıl kullanılacağına dair örnekler içerir.