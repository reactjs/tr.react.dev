---
title: Sunucu React DOM API'leri
---

<Intro>

`react-dom/server` API’leri, React component’larını server-side HTML’e render etmenizi sağlar. Bu API’ler yalnızca uygulamanızın server tarafında, en üst seviyede initial HTML’i üretmek için kullanılır. Bir [framework](/learn/creating-a-react-app#full-stack-frameworks) bunları sizin için çağırabilir. Çoğu component’inizin bunları import etmesi veya kullanması gerekmez.

</Intro>

---

## Web Streams için Sunucu API'leri {/*server-apis-for-web-streams*/}

Bu metodlar sadece tarayıcılar, Deno ve bazı modern edge runtime'ları gibi [Web Stream'leri](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) içeren ortamlarda kullanılabilir:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream), bir React ağacını [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) olarak render eder.  
* [`resume`](/reference/react-dom/server/renderToPipeableStream), [`prerender`](/reference/react-dom/static/prerender) işlemini bir [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) olarak devam ettirir.


<Note>

Node.js ayrıca uyumluluk için bu yöntemleri de içerir, ancak performansın daha düşük olması nedeniyle önerilmez. Bunun yerine [özel Node.js API'lerini](#server-apis-for-nodejs-streams) kullan.

</Note>
---

## Node.js Stream'leri için Sunucu API'leri {/*server-apis-for-nodejs-streams*/}

Bu yöntemler yalnızca [Node.js Stream'leri](https://nodejs.org/api/stream.html) olan ortamlarda kullanılabilir:

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream), bir React ağacını pipe edilebilir bir [Node.js Stream](https://nodejs.org/api/stream.html) olarak render eder.  
* [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream), [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) işlemini pipe edilebilir bir [Node.js Stream](https://nodejs.org/api/stream.html) olarak devam ettirir.

---

## Non-streaming ortamlar için Legacy Sunucu API'leri {/*legacy-server-apis-for-non-streaming-environments*/}

Bu metodlar, stream'leri desteklemeyen ortamlarda kullanılabilir:

* [`renderToString`](/reference/react-dom/server/renderToString) bir React ağacını string'e render eder.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) interaktif olmayan bir React ağacını string'e render eder.

Streaming API'lerine kıyasla sınırlı işlevselliğe sahiptirler.
