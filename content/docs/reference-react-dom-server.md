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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referans {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

React öğesini başlangıç HTML'ine dönüştürün. React bir HTML stringi döndürür. Sunucuda HTML oluşturmak ve daha hızlı sayfa yüklemeleri için ilk istek üzerine işaretlemeyi göndermek ve arama motorlarının sayfalarınızı SEO amacıyla taramasını sağlamak için bu yöntemi kullanabilirsiniz.


Zaten sunucu tarafından oluşturulmuş işaretlemeye sahip olan bir birimde [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)'i çağırırsanız, gayet performanslı bir ilk yükleme deneyimine sahip olmanız için React bunu saklayıp, yalnızca olay yöneticilerini ekleyecektir.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

[`renderToString`](#rendertostring)'e benzer şekildedir. Farklı olarak, React'in `data-reactroot` gibi dahili olarak kullandığı fazladan DOM nitelikleri oluşturmaz. Bu, ekstra özellikleri bir kenara atarak biraz bayt kurtarabileceğiniz için, React'i basit bir statik sayfa oluşturucu olarak kullanmak isterseniz yararlıdır.

İşaretlemeyi etkileşimli hale getirmek için istemci tarafında React'i kullanmayı planlıyorsanız, bu yöntemi kullanmayın. Onun yerine, sunucuda [`renderToString`](#rendertostring) ve istemcide [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) kullanın.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React öğesini başlangıç HTML'ine dönüştürün. React bir HTML string çıktısı veren bir [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) döndürür. Bu akışın HTML çıktısı [`ReactDOMServer.renderToString`](#rendertostring) öğesinin döndüreceği değer ile tamamen aynıdır. Sunucuda HTML oluşturmak ve daha hızlı sayfa yüklemeleri için ilk istek üzerine işaretlemeyi göndermek ve arama motorlarının sayfalarınızı SEO amacıyla taramasını sağlamak için bu yöntemi kullanabilirsiniz.

Zaten sunucu tarafından oluşturulmuş işaretlemeye sahip olan bir birimde [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)'i çağırırsanız, gayet performanslı bir ilk yükleme deneyimine sahip olmanız için React bunu saklayıp, yalnızca olay yöneticilerini ekleyecektir.

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

İşaretlemeyi etkileşimli hale getirmek için istemci tarafında React'i kullanmayı planlıyorsanız, bu yöntemi kullanmayın. Onun yerine, sunucuda [`renderToNodeStream`](#rendertonodestream) ve istemcide [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) kullanın.

> Not:
>
> Yalnızca sunucu için. Bu API tarayıcıda mevcut değildir.
>
> Bu metot utf-8 ile kodlanmış bir bayt akışı (byte stream) döndürür. Başka bir kodlamadaki bir akışa ihtiyacınız varsa, kod dönüştürme metni için dönüştürme akışları (transform streams) sağlayan [iconv-lite](https://www.npmjs.com/package/iconv-lite) gibi bir projeye göz atın.
