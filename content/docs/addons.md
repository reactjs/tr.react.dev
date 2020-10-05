---
id: addons
title: Add-Ons
permalink: docs/addons.html
---

> Not:
>
> `React.addons` giriş noktası React v15.5'ten itibaren kullanımdan kaldırılmıştır.. Bu eklentiler ayrı modüllere taşındı ve bazıları kullanımdan kaldırıldı.

React eklentileri, React uygulamaları oluşturmak için faydalı ve işe yarar modüller koleksiyonudur. **Bunlar deney amaçlı düşünülmeli** ve core'dan daha sık değişime eğilimi olduğu göz önüne alınmalıdır.

- [`createFragment`](/docs/create-fragment.html), harici olarak anahtarlanmış alt diziler oluşturmak için.

Aşağıdaki eklentiler React'ın sadece geliştirme (unminified) sürümlerinde mevcuttur:

- [`Perf`](/docs/perf.html), en uygun seviyedeki imkanları bulmak için geliştirilmiş bir performans profili oluşturma aracı.
- [`ReactTestUtils`](/docs/test-utils.html), simple helpers for writing test cases.

### Eski Sürüm Eklentiler {#legacy-add-ons}

Aşağıdaki eklentiler eski sürüm olarak kabul edilir ve kullanılmaları önerilmez. Gelecekte çalışmaya devam edecekler ama daha fazla geliştrime yapılmayacak.

- [`PureRenderMixin`](/docs/pure-render-mixin.html). Bunun yerine [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) kullanın.
- [`shallowCompare`](/docs/shallow-compare.html), bir componentin güncellenip güncellenmeyeceğine karar vermek için componentin props ve state'lerini yüzeysel olarak karşılaştıran bir yardımcı işlev. Bunun yerine  [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) kullanılmasını tavsiye ederiz.
- [`update`](/docs/update.html). Bunun yerine [`kolodny/immutability-helper`](https://github.com/kolodny/immutability-helper) kullanın.
- [`ReactDOMFactories`](https://www.npmjs.com/package/react-dom-factories), React'in JSX olmadan kullanımını kolaylaştırmak için önceden yapılandırılmış DOM factory'leri.

### Kullanımdan Kaldırılan Eklentiler {#deprecated-add-ons}

- [`LinkedStateMixin`](/docs/two-way-binding-helpers.html) kullanımdan kaldırılmıştır.
- [`TransitionGroup` and `CSSTransitionGroup`](/docs/animation.html)  [yerlerine geçen eklentilerin](https://github.com/reactjs/react-transition-group/tree/v1-stable) kullanılması için kullanımdan kaldırılmışlardır.

## React'i Eklentilerle Kullanma {#using-react-with-add-ons}

Eklentileri NPM aracılığyla ayrı ayrı yükleyebilir (örnek: `npm install react-addons-create-fragment`) ve onları içeri aktarabilirsiniz:

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```

When using React 15 or earlier from a CDN, you can use React 15 ya da daha önceki sürümleri bir CDN'den kullanırken `react.js` yerine  `react-with-addons.js` kullanabilirsiniz:

```html
<script src="https://unpkg.com/react@15/dist/react-with-addons.js"></script>
```

Eklentiler `React.addons` aracılığıyla global olarak kullanılabilir olacaktır. (örnek: `React.addons.TestUtils`).
