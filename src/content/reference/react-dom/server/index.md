---
title: Sunucu React DOM API'leri
---

<Intro>

`react-dom/server` API'leri React bileşenlerini sunucuda HTML'e dönüştürmenize olanak sağlar. Bu API'ler yalnızca sunucuda ve uygulamanızın en üst düzeyinde başlangıç HTML'ini oluşturmak için kullanılır. Bir [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) bunları sizin için çağırabilir. Bileşenlerinizin çoğu bunları içe aktarmaya veya kullanmaya ihtiyaç duymaz.

</Intro>

---

## Node.js Stream'leri için sunucu API'leri {/*server-apis-for-nodejs-streams*/}

Bu metodlar yalnızca [Node.js Stream'leri](https://nodejs.org/api/stream.html) içeren ortamlarda kullanılabilir:

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) bir React ağacını bir pipelanabilir [Node.js Stream'ine](https://nodejs.org/api/stream.html) render eder.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) interaktif olmayan bir React ağacını bir [Node.js Readable Stream'ine](https://nodejs.org/api/stream.html#readable-streams) render eder.

---

## Web Stream'leri için sunucu API'leri {/*server-apis-for-web-streams*/}

Bu metodlar sadece tarayıcılar, Deno ve bazı modern edge runtime'ları gibi [Web Stream'leri](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) içeren ortamlarda kullanılabilir:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) bir React ağacını bir [Okunabilir Web Stream'ine](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) render eder.

---

## Stream içermeyen ortamlar için sunucu API'leri {/*server-apis-for-non-streaming-environments*/}

Bu metodlar, stream'leri desteklemeyen ortamlarda kullanılabilir:

* [`renderToString`](/reference/react-dom/server/renderToString) bir React ağacını string'e render eder.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) interaktif olmayan bir React ağacını string'e render eder.

Stream içeren API'lere kıyasla sınırlı işlevselliğe sahiptirler.

---

## Kullanımdan kaldırılan sunucu API'leri {/*deprecated-server-apis*/}

<Deprecated>

Bu API'ler bir sonraki büyük React sürümünde kaldırılacaktır.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) bir React ağacını bir [Node.js Okunabilir Stream'ine](https://nodejs.org/api/stream.html#readable-streams) render eder. (Kullanımdan kaldırıldı.)
