---
id: javascript-environment-requirements
title: JavaScript Ortam Gereksinimleri
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 versiyonu, tüm modern tarayıcıları destekler (Edge, Firefox, Chrome, Safari gibi).

Modern tarayıcı özelliklerini yerel olarak desteklemeyen veya uyumlu olmayan özellikleri olan Internet Explorer gibi eski tarayıcıları ve cihazları destekliyorsanız, paketlenmiş uygulamanıza global bir polyfill dahil etmeyi düşünün.

İşte React versiyon 18'in kullandığı modern özelliklerin bir listesi:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

Bu özellikler için doğru polyfill ortamınıza göre değişebilir. Çoğu kullanıcı, [Browserlist](https://github.com/browserslist/browserslist) ayarlarınızı yapılandırabilir. Diğerlerinin ise, direkt olarak [`core-js`](https://github.com/zloirock/core-js) gibi bir polyfill dahil etmesi gerekebilir.
