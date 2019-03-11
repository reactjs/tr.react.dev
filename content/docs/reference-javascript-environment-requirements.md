---
id: javascript-environment-requirements
title: JavaScript Ortam Gereksinimleri
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ve [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) gibi koleksiyon tiplerine bağlıdır. Eğer bunları henüz yerel olarak sağlayamayan (ör. IE <11) veya uyumlu olmayan uygulamaları (ör. IE 11) olan eski tarayıcıları ve cihazları destekliyorsanız, paketlenmiş uygulamanıza global polyfill dahil etmeyi düşünün. [core-js](https://github.com/zloirock/core-js) ya da [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) gibi.

React 16 için eski tarayıcıları destekleyen core-js kullanılan polyfilled bir ortam şöyle görünebilir:

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

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