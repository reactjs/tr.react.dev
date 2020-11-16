---
id: javascript-environment-requirements
title: JavaScript Ortam Gereksinimleri
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ve [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) gibi koleksiyon tiplerine bağlıdır. Eğer bunları henüz yerel olarak sağlayamayan (ör. IE <11) veya uyumlu olmayan uygulamaları (ör. IE 11) olan eski tarayıcıları ve cihazları destekliyorsanız, paketlenmiş uygulamanıza global polyfill dahil etmeyi düşünün. [core-js](https://github.com/zloirock/core-js) ya da [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) gibi.
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

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