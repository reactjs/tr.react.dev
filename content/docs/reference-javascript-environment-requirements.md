---
id: javascript-environment-requirements
title: JavaScript Ortam Gereksinimleri
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ve [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) gibi koleksiyon tiplerine bağlıdır. Eğer bunları henüz yerel olarak sağlayamayan (ör. IE <11) veya uyumlu olmayan uygulamaları (ör. IE 11) olan eski tarayıcıları ve cihazları destekliyorsanız, paketlenmiş uygulamanıza [core-js](https://github.com/zloirock/core-js) gibi global polyfill'leri dahil etmeyi düşünün.

Eski tarayıcıları desteklemek için core-js kullanan polyfilled bir React 16 ortamı şöyle görünebilir:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Merhaba, dünya!</h1>,
  document.getElementById('root')
);
```

React aynı zamanda `requestAnimationFrame`'e bağlıdır(test ortamında bile).
`requestAnimationFrame` için [raf](https://www.npmjs.com/package/raf) paketini kullanabilirsiniz:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892
