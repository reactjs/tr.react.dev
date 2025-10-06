---
title: Sunucu React DOM API'leri
---

<Intro>

`react-dom/server` API’leri, React bileşenlerini sunucu tarafında HTML olarak render etmenizi sağlar. Bu API’ler, uygulamanızın en üst seviyesinde ilk HTML’i oluşturmak için sadece sunucuda kullanılır. Bir [framework](/learn/start-a-new-react-project#full-stack-frameworks) bunları sizin için çağırabilir. Çoğu bileşeninizin bunları import etmesi veya kullanması gerekmez.

</Intro>

---

<<<<<<< HEAD
## Node.js Stream'leri için sunucu API'leri {/*server-apis-for-nodejs-streams*/}

Bu metodlar yalnızca [Node.js Stream'leri](https://nodejs.org/api/stream.html) içeren ortamlarda kullanılabilir:

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream), bir React ağacını pipeable bir [Node.js Stream](https://nodejs.org/api/stream.html) olarak render eder.

---

## Web Stream'leri için sunucu API'leri {/*server-apis-for-web-streams*/}
=======
## Server APIs for Web Streams {/*server-apis-for-web-streams*/}
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

Bu metodlar sadece tarayıcılar, Deno ve bazı modern edge runtime'ları gibi [Web Stream'leri](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) içeren ortamlarda kullanılabilir:

<<<<<<< HEAD
* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) bir React ağacını bir [Okunabilir Web Stream'ine](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) render eder.
=======
* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renders a React tree to a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resume`](/reference/react-dom/server/renderToPipeableStream) resumes [`prerender`](/reference/react-dom/static/prerender) to a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).


<Note>

Node.js also includes these methods for compatibility, but they are not recommended due to worse performance. Use the [dedicated Node.js APIs](#server-apis-for-nodejs-streams) instead.

</Note>
---

## Server APIs for Node.js Streams {/*server-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) resumes [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

---

## Non-streaming ortamlar için Legacy Sunucu API'leri {/*legacy-server-apis-for-non-streaming-environments*/}

Bu metodlar, stream'leri desteklemeyen ortamlarda kullanılabilir:

* [`renderToString`](/reference/react-dom/server/renderToString) bir React ağacını string'e render eder.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) interaktif olmayan bir React ağacını string'e render eder.

Streaming API'lerine kıyasla sınırlı işlevselliğe sahiptirler.
