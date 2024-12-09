---
title: Sunucu React DOM API'leri
---

<Intro>

<<<<<<< HEAD
`react-dom/server` API'leri React bileşenlerini sunucuda HTML'e dönüştürmenize olanak sağlar. Bu API'ler yalnızca sunucuda ve uygulamanızın en üst düzeyinde başlangıç HTML'ini oluşturmak için kullanılır. Bir [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) bunları sizin için çağırabilir. Bileşenlerinizin çoğu bunları içe aktarmaya veya kullanmaya ihtiyaç duymaz.
=======
The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

</Intro>

---

## Node.js Stream'leri için sunucu API'leri {/*server-apis-for-nodejs-streams*/}

Bu metodlar yalnızca [Node.js Stream'leri](https://nodejs.org/api/stream.html) içeren ortamlarda kullanılabilir:

<<<<<<< HEAD
* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) bir React ağacını bir pipelanabilir [Node.js Stream'ine](https://nodejs.org/api/stream.html) render eder.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) interaktif olmayan bir React ağacını bir [Node.js Readable Stream'ine](https://nodejs.org/api/stream.html#readable-streams) render eder.
=======
* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

---

## Web Stream'leri için sunucu API'leri {/*server-apis-for-web-streams*/}

Bu metodlar sadece tarayıcılar, Deno ve bazı modern edge runtime'ları gibi [Web Stream'leri](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) içeren ortamlarda kullanılabilir:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) bir React ağacını bir [Okunabilir Web Stream'ine](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) render eder.

---

<<<<<<< HEAD
## Stream içermeyen ortamlar için sunucu API'leri {/*server-apis-for-non-streaming-environments*/}
=======
## Legacy Server APIs for non-streaming environments {/*legacy-server-apis-for-non-streaming-environments*/}
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

Bu metodlar, stream'leri desteklemeyen ortamlarda kullanılabilir:

* [`renderToString`](/reference/react-dom/server/renderToString) bir React ağacını string'e render eder.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) interaktif olmayan bir React ağacını string'e render eder.

<<<<<<< HEAD
Stream içeren API'lere kıyasla sınırlı işlevselliğe sahiptirler.

---

## Kullanımdan kaldırılan sunucu API'leri {/*deprecated-server-apis*/}

<Deprecated>

Bu API'ler bir sonraki büyük React sürümünde kaldırılacaktır.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) bir React ağacını bir [Node.js Okunabilir Stream'ine](https://nodejs.org/api/stream.html#readable-streams) render eder. (Kullanımdan kaldırıldı.)
=======
They have limited functionality compared to the streaming APIs.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
