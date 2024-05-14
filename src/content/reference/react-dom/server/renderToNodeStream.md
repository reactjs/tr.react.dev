---
title: renderToNodeStream
---

<Deprecated>

Bu API, React'in gelecekteki bir ana sürümünde kaldırılacaktır. Bunun yerine  [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) kullanın.

</Deprecated>

<Intro>

`renderToNodeStream` bir React ağacını bir [Node.js Okunabilir Akışı](https://nodejs.org/api/stream.html#readable-streams)'na dönüştürür.

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

Sunucuda, yanıtı aktaracağınız bir [Node.js Okunabilir Akışı](https://nodejs.org/api/stream.html#readable-streams) elde etmek için `renderToNodeStream`'i çağırın.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

İstemci tarafında, sunucu tarafında oluşturulan HTML'i etkileşimli hale getirmek için [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) fonksiyonunu çağırın.

[Buradan daha fazla örnek görebilirsiniz.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: HTML'e dönüştürmek istediğiniz bir React düğümü. Örneğin, `<App />` gibi bir JSX öğesi.

* **isteğe bağlı** `options`: Sunucu renderı için bir obje.
  * **isteğe bağlı** `identifierPrefix`: [`useId`](/reference/react/useId) tarafından oluşturulan kimlikler için React'ın kullandığı string ön eki. Aynı sayfada birden çok kök kullanırken çakışmaları önlemek için kullanışlıdır. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)'e iletilen ön ek ile aynı olmalıdır.

#### Dönüş değeri {/*returns*/}

Bir HTML string'i üreten bir [Node.js Okunabilir Akışı.](https://nodejs.org/api/stream.html#readable-streams)

#### Uyarılar {/*caveats*/}

* Bu yöntem, herhangi bir çıkış vermeden önce tüm [Suspense sınırlarının](/reference/react/Suspense) tamamlanmasını bekler.

* React 18'den itibaren bu yöntem, tüm çıktılarını arabelleğe alır, bu nedenle aslında hiçbir akış avantajı sağlamaz. Bu nedenle, bunun yerine [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)'e geçmeniz önerilir.

* Dönen akış, utf-8 ile kodlanmış bir bayt akışıdır. Başka bir kodlama ile akışa ihtiyacınız varsa, [iconv-lite](https://www.npmjs.com/package/iconv-lite) gibi bir projeye bakabilirsiniz, bu projeler metin dönüştürme akışlarını sağlar.

---

## Kullanım {/*usage*/}

### Bir React ağacını HTML olarak bir Node.js Okunabilir Akışına dönüştürmek {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Sunucu yanıtınıza bağlayabileceğiniz [Node.js Okunabilir Akışını](https://nodejs.org/api/stream.html#readable-streams) almak için `renderToNodeStream`'i çağırın:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// Rota işleyici sözdizimi arka uç çatınıza bağlı olarak değişir
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

Akış, React bileşenlerinizin başlangıçta etkileşimsiz HTML çıktısını üretecek. İstemci tarafında, bu sunucu tarafında oluşturulan HTML'i *hydrate* etmek ve etkileşimli hale getirmek için [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) yöntemini çağırmanız gerekecek.
