---
title: Sunucu React DOM API'leri
---

<Intro>

<<<<<<< HEAD
`react-dom/server` API'leri, React bileşenlerini HTML'ye sunucu tarafında render etmenizi sağlar. Bu API'ler, uygulamanızın en üst seviyesinde yalnızca sunucuda kullanılır ve ilk HTML'i oluşturur. Bir [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) bunları sizin için çağırabilir. Çoğu bileşeninizin bunları içe aktarmasına veya kullanmasına gerek yoktur.
=======
The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/creating-a-react-app#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

</Intro>

---

## Node.js Stream'leri için sunucu API'leri {/*server-apis-for-nodejs-streams*/}

Bu metodlar yalnızca [Node.js Stream'leri](https://nodejs.org/api/stream.html) içeren ortamlarda kullanılabilir:

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream), bir React ağacını pipeable bir [Node.js Stream](https://nodejs.org/api/stream.html) olarak render eder.

---

## Web Stream'leri için sunucu API'leri {/*server-apis-for-web-streams*/}

Bu metodlar sadece tarayıcılar, Deno ve bazı modern edge runtime'ları gibi [Web Stream'leri](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) içeren ortamlarda kullanılabilir:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) bir React ağacını bir [Okunabilir Web Stream'ine](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) render eder.

---

## Non-streaming ortamlar için Legacy Sunucu API'leri {/*legacy-server-apis-for-non-streaming-environments*/}

Bu metodlar, stream'leri desteklemeyen ortamlarda kullanılabilir:

* [`renderToString`](/reference/react-dom/server/renderToString) bir React ağacını string'e render eder.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) interaktif olmayan bir React ağacını string'e render eder.

Streaming API'lerine kıyasla sınırlı işlevselliğe sahiptirler.
