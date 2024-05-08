---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup`, etkileşimli olmayan bir React ağacını HTML string'e dönüştürür.

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

Sunucuda, uygulamanızı HTML'ye dönüştürmek için `renderToStaticMarkup` yöntemini çağırın.

```js
import { renderToStaticMarkup } from 'react-dom/server';
const html = renderToStaticMarkup(<Page />);
```

Bu, React bileşenlerinizin etkileşimli olmayan HTML çıktısını üretecektir.

[Buradan daha fazla örnek görebilirsiniz.](#usage)

#### Parametreler {/*parameters*/}

* `reactNode`: Bir JSX düğümü gibi HTML'ye dönüştürmek istediğiniz bir React düğümü. Örneğin, şöyle bir JSX düğümü `<Page />`.
* **isteğe bağlı** `options`: Sunucu renderı için bir obje.
  * **isteğe bağlı** `identifierPrefix`: [`useId`](/reference/react/useId) tarafından oluşturulan kimlikler için React'in kullandığı string ön eki. Aynı sayfada birden fazla kök kullanırken çakışmaları önlemek için kullanışlıdır.

#### Dönüş Değeri {/*returns*/}

Bir HTML string'i.

#### Dikkat Edilmesi Gerekenler {/*caveats*/}

* `renderToStaticMarkup` çıktısı "hydrate" edilemez.

* `renderToStaticMarkup` sınırlı Suspense desteğine sahiptir. Bir bileşen askıya alındığında, `renderToStaticMarkup` hemen yedek olarak HTML gönderir.

* `renderToStaticMarkup` tarayıcıda çalışır, ancak istemci kodunda kullanılması önerilmez. Bir bileşeni tarayıcıda HTML'e dönüştürmeniz gerekiyorsa, [HTML'yi bir DOM düğümüne render ederek alın.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Kullanım {/*usage*/}

### Bir etkileşimli olmayan React ağacını HTML olarak string'e çevirme {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Sunucu yanıtınızla birlikte gönderebileceğiniz bir HTML string'i olarak uygulamanızı  `renderToStaticMarkup` ile HTML'ye dönüştürün:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';
// Rota işleyicisinin sözdizimi, kullandığınız arka uç çatısına bağlıdır
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Bu, React bileşenlerinizin başlangıç olarak etkileşimsiz HTML çıktısını üretecektir.

<Pitfall>

Bu yöntem **"hydrate" edilemeyen, etkileşimsiz HTML üretir.** Bu, React'i basit bir statik sayfa oluşturucusu olarak kullanmak istiyorsanız veya tamamen statik içerikler gibi içerikleri oluşturmak için kullanışlıdır.

Etkileşimli uygulamalar sunucuda [`renderToString`](/reference/react-dom/server/renderToString) ve istemci tarafında [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) kullanmalıdır.

</Pitfall>
