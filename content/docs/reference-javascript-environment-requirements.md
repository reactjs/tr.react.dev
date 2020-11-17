---
id: javascript-environment-requirements
title: JavaScript Ortam Gereksinimleri
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ve [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) gibi koleksiyon tiplerine bağlıdır. Eğer bunları henüz yerel olarak sağlayamayan (ör. IE <11) veya uyumlu olmayan uygulamaları (ör. IE 11) olan eski tarayıcıları ve cihazları destekliyorsanız, paketlenmiş uygulamanıza [core-js](https://github.com/zloirock/core-js) gibi global polyfill'leri dahil etmeyi düşünün.

Eski tarayıcıları desteklemek için core-js kullanan polyfilled bir React 16 ortamı şöyle görünebilir:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
